// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import Stripe from 'stripe';

console.log('Hello from Functions!');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_API_KEY')! as string;
const DOMAIN = Deno.env.get('DOMAIN')! as string;

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  httpClient: Stripe.createFetchHttpClient(),
});

Deno.serve(async (request: Request) => {
  

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response('', {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }
  if (request.method !== 'POST') {
    return new Response('Method not allowed', {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });
  }

  try {

    const {email} = await request.json();

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          //TODO: REPLACE WITH ACTUAL PRICE ID
          price: "price_1QnUdJB2qnYuPGRFFyqvB50r",
          quantity: 1,
        },
      ],
      customer_email: email,
      mode: 'subscription',
      return_url: `${DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
    })

    if (!session){
      return new Response(JSON.stringify({ error: 'An unexpected error occurred. USR-1924-QUDX' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      })
    }

    return new Response(JSON.stringify({ clientSecret: session.client_secret }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
});