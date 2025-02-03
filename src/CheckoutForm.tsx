import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  'pk_test_51QmkL0B2qnYuPGRFm72zkfIFa9yX4FrDwBmkuF5lkuC6CADspq8FQexDFhhFcgjDGAheY7hlkPCghvHC5Sc3WbB900Pc6Mm8cT',
);

type PaymentFormProps = {
  userId: string;
};

const CheckoutForm: React.FC<PaymentFormProps> = ({ userId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    // Confirm the payment
    const { error} = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // where to go after a successful payment
        return_url: window.location.origin + '/payment-success',
      },
    });

    if (error) {
      setErrorMessage(error.message || 'An unexpected error occurred');
      setIsLoading(false);
    } else {
      // Payment was successful
      console.log('Payment was successful');
      setErrorMessage(null);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={!stripe || !elements || isLoading}>{isLoading ? 'Processing...' : 'Pay Now'}</button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

const PaymentPage: React.FC<PaymentFormProps> = ({ userId }) => {
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    useEffect(() => {
        fetch("https://<project-id>.functions.supabase.co/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: userId, amount: 1000 }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.clientSecret) {
                setClientSecret(data.clientSecret);
            } else {
                console.error('Error fetching client secret:', data);
            }
        }).catch((error) => 
            console.error(error));
        
    }, [userId]);

    if (!clientSecret) {
        return <div>Loading...</div>;
    }

    const options = { 
        clientSecret,
        appearance: {
            theme: "stripe",
        },
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            <CheckoutForm userId={userId} />
            </Elements>
    )
};

export default PaymentPage