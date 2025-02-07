import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import Stripe from 'stripe';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_API_KEY')! as string;

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  httpClient: Stripe.createFetchHttpClient(),
});

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('', {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });
  }
  try {
    const { session_id } = await req.json();
    if (session_id) {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session) {
        return new Response(JSON.stringify({ status: session.status, customer_email: session.customer_email }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
    } else {
      return new Response('No active session', {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
  } catch (error) {
    console.error(error);
    return new Response('There was an issue', {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });
  }

  return new Response('There was an unknown error', {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 500,
  });
});
