// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'stripe';
import { createClient } from 'supabase';
import { corsHeaders, createErrorResponse } from '../shared/common.ts';

Deno.serve(async (request: Request) => {
  const config = {
    supabaseUrl: Deno.env.get('SUPABASE_URL'),
    stripeApiKey: Deno.env.get('STRIPE_API_KEY'),
    domain: Deno.env.get('DOMAIN'),
    supabaseServiceKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    priceId: Deno.env.get('PRICE_ID'), // Consider getting this from the request body.
  };

  // --- Validate Environment Configuration --- (No changes here)
  if (!config.supabaseUrl) {
    console.error('Missing SUPABASE_URL environment variable.');
    return createErrorResponse('Missing Supabase URL configuration.', 500);
  }
  if (!config.stripeApiKey) {
    console.error('Missing STRIPE_API_KEY environment variable.');
    return createErrorResponse('Missing Stripe API Key configuration.', 500);
  }
  if (!config.domain) {
    console.error('Missing DOMAIN environment variable.');
    return createErrorResponse('Missing DOMAIN configuration.', 500);
  }
  if (!config.supabaseServiceKey) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable.');
    return createErrorResponse('Missing Supabase Service Role Key configuration.', 500);
  }
  if (!config.priceId) {
    console.warn(
      'PRICE_ID environment variable is missing.  Using default price if any. Consider sending priceId in the request body.',
    );
    // Consider returning an error here, or better yet, get the priceId from the request body.
  }

  const stripe = new Stripe(config.stripeApiKey, {
    httpClient: Stripe.createFetchHttpClient(),
  });

  const adminSupabase = createClient(config.supabaseUrl, config.supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    // --- Handle request method validation --- (No changes here)
    if (request.method === 'OPTIONS') {
      return new Response('', {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    if (request.method !== 'POST') {
      return createErrorResponse('Method not allowed', 405);
    }

    // --- Get user from auth header --- (No changes here)
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return createErrorResponse('Authorization header missing', 401);
    }
    const token = authHeader.replace('Bearer ', '');

    let user;
    try {
      const authResult = await adminSupabase.auth.getUser(token);
      if (authResult.error || !authResult.data.user) {
        console.error('Supabase admin_supabase.auth.getUser error:', authResult.error, { token });
        return createErrorResponse('Invalid or expired token', 401);
      }
      user = authResult.data.user;
    } catch (error: unknown) {
      console.error('Error during admin_supabase.auth.getUser:', error, { token });
      return createErrorResponse('Error verifying token', 400);
    }

    const userData = {
      email: user.email ?? '', // Ensure email is not null/undefined
      uuid: user.id,
    };

    // --- Create Stripe Checkout Session --- (Modified section)
    let session;
    try {
      const priceIdToUse = config.priceId || 'price_1QnUdJB2qnYuPGRFFyqvB50r'; // Use config.priceId if available, else fallback (with warning)
      session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        line_items: [
          {
            price: priceIdToUse, // Use dynamic price ID
            quantity: 1,
          },
        ],
        customer_email: userData.email, // Use customer_email instead of customer
        mode: 'subscription',
        return_url: `${config.domain}/return?session_id={CHECKOUT_SESSION_ID}`,
      });

      if (!session) {
        const message = 'Stripe Checkout Session creation failed (no session returned).';
        console.error(message, { priceId: priceIdToUse, userData });
        return createErrorResponse(message, 500);
      }
    } catch (error: unknown) {
      console.error('Error creating Stripe Checkout Session:', error, { userData });
      return createErrorResponse('Failed to create Stripe Checkout Session', 500);
    }

    return new Response(JSON.stringify({ clientSecret: session.client_secret }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (unhandledError: unknown) {
    console.error('Unhandled error in Deno.serve handler:', unhandledError);
    return createErrorResponse('Unhandled server error', 500);
  }
});
