import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useAuthStore } from '../../store/useAuthStore';
import supabase from '../../services/supabaseService';
import { User } from '../../types';

const stripePromise = loadStripe(
  'pk_test_51QmkL0B2qnYuPGRFm72zkfIFa9yX4FrDwBmkuF5lkuC6CADspq8FQexDFhhFcgjDGAheY7hlkPCghvHC5Sc3WbB900Pc6Mm8cT',
);




const fetchStripeUser = async () => {
  const { data, error } = await supabase.functions.invoke('create-payment-customer', {method: "GET"});
  if(!data || error) {
    console.error(error);
    return '';
  }
  return data.customerId;
}

//const stripeUser = fetchStripeUser().then();

interface CheckoutPageProps {
    user: User
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({user}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [stripeSecret, setStripeSecret] = useState<string | null>(null);
  const [stripeUser, setStripeUser] = useState<string>('');
  const signUp = useAuthStore((state) => state.signUp);

  useEffect(()=> {
    const fetchStripeSecret = async () : Promise<void> => {
        const { data, error } = await supabase.functions.invoke('create-checkout-session', {method: "POST", body: {email: user.email}});
        if (!data || error) {
          console.error(error);
        }
      
        //return data.clientSecret;
        //console.log('Setting stripe secret to:', data.clientSecret);
        setStripeSecret(data.clientSecret);
        //setStripeUser(data.customerId);
      };

      fetchStripeSecret().then();
    }, [user])

  /*useEffect(() => {
    const fetchStripeUser = async () => {
      const { data, error } = await supabase.functions.invoke('create-stripe-customer', {method: "GET"});
      if(!data || error) {
        console.error(error);
        return;
      }

      setStripeUser(data.customerId);
    };

    fetchStripeUser().then();
  }, []);*/

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleComplete = () => {
    console.log('Checkout has completed!');
  };

  //const options = { fetchClientSecret: fetchStripeSecret, onComplete: handleComplete };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      <div id="checkout">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret: stripeSecret, onComplete: handleComplete }}>
            <EmbeddedCheckout/>
            
          </EmbeddedCheckoutProvider>
        </div>
    </div>
  );
};

