// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import Stripe from 'stripe';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function createErrorResponse(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  });
}

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

  // --- Helper Function: updateSupabaseCustomerWithStripeId --- (Now used after session creation)
  async function updateSupabaseCustomerWithStripeId(uuid: string, stripeCustomerId: string | null | undefined) {
    try {
      const { error: updateError } = await adminSupabase
        .from('profiles')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', uuid);

      if (updateError) {
        console.error('Error in updateSupabaseCustomerWithStripeId (Supabase update failed):', updateError, {
          uuid,
          stripeCustomerId,
        });
        throw new Error(`Supabase customer update error: ${updateError.message}`);
      }
      return stripeCustomerId; // Return the ID even after update.
    } catch (error: any) {
      console.error('Unexpected error in updateSupabaseCustomerWithStripeId:', error, { uuid, stripeCustomerId });
      throw error;
    }
  }

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
    } catch (error: any) {
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
    } catch (error: any) {
      console.error('Error creating Stripe Checkout Session:', error, { userData });
      return createErrorResponse('Failed to create Stripe Checkout Session', 500);
    }

    // --- Update Supabase with Stripe Customer ID (from the session) --- (Crucial Change)
    //let stripeCustomerId: string | null | undefined = null; // Explicitly type as string | null | undefined
    //if (session && session.customer) {
    // Type assertion:  We know session.customer will be a string (or expanded object) here, not a number.
    //  stripeCustomerId = typeof session.customer === 'string' ? session.customer : session.customer.id;
    //  console.log('Customer ID created', stripeCustomerId);
    //} else {
    //  console.log('No customer id was created by stripe checkout session');
    //}

    //try {
    //  await updateSupabaseCustomerWithStripeId(userData.uuid, stripeCustomerId); // Pass the customer ID (or null)
    //} catch (updateError: any) {
    // Even if updating Supabase fails, we still return the clientSecret.  The frontend can proceed with the checkout.
    //  console.error('Failed to update Supabase with Stripe customer ID:', updateError);
    //}

    return new Response(JSON.stringify({ clientSecret: session.client_secret }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (unhandledError: any) {
    console.error('Unhandled error in Deno.serve handler:', unhandledError);
    return createErrorResponse('Unhandled server error', 500);
  }
});
