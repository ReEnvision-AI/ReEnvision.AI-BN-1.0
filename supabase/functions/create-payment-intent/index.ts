// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { createClient } from 'jsr:@supabase/supabase-js@2';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')! as string;
const SUPABASE_DB_URL = Deno.env.get('DB_URL')! as string;
const SUPABASE_ANON_KEY = Deno.env.get('ANON_KEY')! as string;

const supabase = createClient(SUPABASE_DB_URL, SUPABASE_ANON_KEY);

const stripe = new Stripe(STRIPE_SECRET_KEY);

console.log("Hello from Functions!")

Deno.serve({
  async fetch(request) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response("", {
        status : 200
      });
    }

    if (request.method !== 'POST') {
      return new Response("Method not allowed", {
        status: 405
      });
    }

    try {
      // Parse JSON body
      const { user_id, product_id } = await request.json();

      // Validate required fields
      if (!user_id || !product_id) {
        return new Response("Missing required fields", {
          status: 400
        });
      }

      // 1) Fetch the user from the db
      const { data: userData, error: userError } = await supabase.from("profiles").select("id", "stripe_customer_id").eq("id", user_id).single();

      if (userError || !userData) {
        return new Response(JSON.stringify({error: "An unexpected error occurred. USR-4271-AX0D"}), {
          status: 404
        });
      }

      // 2) Look up the product price in the database
      const {data: productData, error: productError} = await supabase.from("prices").select("unit_amount").eq("product", product_id).single();

      if (productError || !productData) {
        return new Response(JSON.stringify({error: "An unexpected error occurred. PRD-8398-FC3S"}), {
          status: 404
        });
      }

      const amount = productData.price_in_cents;

      // 3) Check if we have a Stripe customer, else create one
      let stripeCustomerId = userData.stripe_customer_id;
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: userData.email
        });
        stripeCustomerId = customer.id;

        const { error: updateError} = await supabase.from("profiles").update({stripe_customer_id: stripeCustomerId}).eq("id", user_id);

        if (updateError) {
          return new Response(JSON.stringify({error: "An unexpected error occurred. USR-1924-QUDX"}), {
            status: 500
          });
        }
      }

      // 4) Create paymentintent with the validated amount
      const paymentIntent = await stripe.paymentIntents.create({
        amount, // Price from the product table in cents
        currency: "usd",
        customer: stripeCustomerId,
        automatic_payment_methods: {enabled: true},
      });

      // 5) Return the client secret to the client
      return new Response(
        JSON.stringify({clientSecret: paymentIntent.client_secret}),
        {
          headers: {"Content-Type": "application/json"},
          status: 200
        }
      );
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({error: "An unexpected error occurred. FNC-4545-6EBH"}), {
        status: 500
      });
    }
  }
});
/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-payment-intent' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
