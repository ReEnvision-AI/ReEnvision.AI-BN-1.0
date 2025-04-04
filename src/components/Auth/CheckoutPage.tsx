import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useRef, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import supabase from '../../services/supabaseService';
import { ReEnvisionLogo } from '../icons/ReEnvisionLogo'; // Import the logo

const stripeKey = import.meta.env.VITE_STRIPE_API_KEY;

if (!stripeKey) {
  throw new Error('Missing Stripe API key. Please check your .env file.');
}

const stripePromise = loadStripe(stripeKey);

interface CheckoutSessionResponse {
  clientSecret: string;
}

export const CheckoutPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuthContext();
  const hasFetchedSecret = useRef(false);

  useEffect(() => {
    setClientSecret(null);
    setError(null);
    hasFetchedSecret.current = false;
    setLoading(false);

    if (!user) {
      return;
    }

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
        hasFetchedSecret.current = true;
      } catch (err: any) {
        console.error('Unexpected error:', err);
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050b16] to-[#1a365d] flex items-center justify-center p-4">
      <div className="w-full max-w-lg p-8 bg-black/50 backdrop-blur-xl rounded-lg shadow-lg border border-blue-900/50 overflow-y-auto max-h-[90vh]">
        <div className="flex flex-col items-center mb-6">
          <ReEnvisionLogo className="w-24 h-24 mb-4" /> {/* Add the logo */}
          <h2 className="text-2xl font-bold text-center text-white">Subscribe to ReEnvision AI</h2>
        </div>
        {error && <div className="mb-4 p-3 bg-red-500/20 text-red-200 rounded">{error}</div>}
        <div id="checkout">
          {!loading && clientSecret ? (
            <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          ) : (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <span className="ml-3 text-gray-300">Loading Checkout...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
