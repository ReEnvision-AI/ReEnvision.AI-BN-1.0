import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useRef, useState } from 'react'; // Import useRef
import { useAuthContext } from '../../context/AuthContext';
import supabase from '../../services/supabaseService';

const stripeKey = import.meta.env.VITE_STRIPE_API_KEY;

if (!stripeKey) {
  throw new Error('Missing Stripe API key. Please check your .env file.');
}

const stripePromise = loadStripe(stripeKey);

interface CheckoutSessionResponse {
  clientSecret: string;
  // Add other properties if your Supabase function returns them
}

export const CheckoutPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuthContext();
  const hasFetchedSecret = useRef(false); // Use useRef to track if secret has been fetched

  useEffect(() => {
    // Reset state when user changes (login/logout)
    setClientSecret(null);
    setError(null);
    hasFetchedSecret.current = false; // Reset the flag
    setLoading(false);

    if (!user) {
      return; // No user, no need to fetch
    }

    // Only fetch if we haven't already fetched for this user
    if (!hasFetchedSecret.current) {
      setLoading(true);
      fetchStripeSecret();
    }

    async function fetchStripeSecret() {
      try {
        const { data, error } = await supabase.functions.invoke<CheckoutSessionResponse>('create-checkout-session', {
          method: 'POST',
        });
        if (!data || error) {
          console.error(error);
          setError(error?.message || 'An unknown error occurred');
          return;
        }

        console.log('Setting stripe secret to:', data.clientSecret);
        setClientSecret(data.clientSecret);
        hasFetchedSecret.current = true; // Mark as fetched
      } catch (err: any) {
        console.error('Unexpected error:', err);
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }
  }, [user]); // Only depend on user

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Checkout</h2>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      <div id="checkout">
        {!loading && clientSecret ? (
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        ) : (
          <span>Loading...</span>
        )}
      </div>
    </div>
  );
};
