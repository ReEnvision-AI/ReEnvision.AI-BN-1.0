// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { createClient } from 'jsr:@supabase/supabase-js@2';
import Stripe from 'stripe';

console.log('Hello from Functions!');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_API_KEY')! as string;
console.log("Stripe secret key:", STRIPE_SECRET_KEY)
//const SUPABASE_DB_URL = Deno.env.get('DB_URL')! as string;
//const SUPABASE_ANON_KEY = Deno.env.get('ANON_KEY')! as string;
const DOMAIN = Deno.env.get('DOMAIN')! as string;
//const supabase = createClient(SUPABASE_DB_URL, SUPABASE_ANON_KEY);

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  httpClient: Stripe.createFetchHttpClient(),
});

Deno.serve(async (request: Request) => {
  

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response('', {
      status: 200,
    });
  }
  if (request.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
    });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      {
        global: {
          headers: { Authorization: request.headers.get('Authorization')! },
        },
      }
    )

    // First get the token from the Authorization header
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token){
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Now we can get the session or user object
    const {
      data: { user },
    } = await supabaseClient.auth.getUser(token)

    // And we can run queries in the context of our authenticated user
    const { data: userData , error: userError } = await supabaseClient.from('profiles').select('id', 'stripe_customer_id', 'email', 'first_name', 'last_name').single()

    //console.log('User:', user);
    console.log('User Data:', userData);  

    if (userError || !userData) {
      return new Response(JSON.stringify({ error: 'An unexpected error occurred. USR-4271-AX0D' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      })
    }

    if (!userData.stripe_customer_id) {
      //create new stripe customer
      console.log('Creating new stripe customer');
      console.log('User Email:', user.email);
      console.log('User ID:', userData.id);
      console.log('User Data:', userData);
      const customer = await stripe.customers.create({
        email: user.email ? user.email : '',
        metadata: {
          user_id: userData.id,
        },
      })

      await supabaseClient.from('public.profiles').update({ stripe_customer_id: customer.id }).eq('id', userData.id);
      userData.stripe_customer_id = customer.id;
    }

    const product_id = "prod_RgsOOFG1xbT5Zd"
    console.log('Product ID:', product_id);

    // Ensure that the product_id is valid
    //const { data: productData, error: productError } = await supabaseClient.from('products').select('id, default_price').eq('id', product_id)

    //console.log('Product Data:', productData);

    //if(productError || !productData) {
    //  console.error(productError);
    //  return new Response(JSON.stringify({ error: 'An unexpected error occurred. PRD-8398-FC3S' }), {
    //    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    //    status: 404,
    //  })
    //}
    
    //const {data: priceData, error: priceError} = await supabaseClient.from("prices").select("unit_amount", "type").eq("id", productData.default_price).single();

    //if(priceError || !priceData) {
    //  console.log(priceError);
    //  return new Response(JSON.stringify({ error: 'An unexpected error occurred. PRD-8398-FC3S' }), {
    //    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    //    status: 404,
    //  })
    //}

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price: "price_1QnUdJB2qnYuPGRFFyqvB50r",
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer: userData.stripe_customer_id,
      return_url: `${DOMAIN}/payment-success`,
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

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-checkout-session' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
