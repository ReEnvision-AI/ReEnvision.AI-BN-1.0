import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import Stripe from 'stripe';
import { corsHeaders, createErrorResponse } from '../shared/common.ts';

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
    return createErrorResponse('Method not allowed', 405);
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
      return createErrorResponse('No active session', 400);
    }
  } catch (error) {
    console.error(error);
    return createErrorResponse('Internal Server Issue', 405);
  }

  return createErrorResponse('There was an unknown error', 500);
});
