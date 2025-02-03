// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { createClient } from 'jsr:@supabase/supabase-js@2';

import Stripe from 'stripe';

// Get the connection string from the environment variable "SUPABASE_DB_URL"
const databaseUrl = Deno.env.get('SUPABASE_DB_URL')!;

const supabase = createClient(databaseUrl ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '');


const stripe = Stripe(Deno.env.get('STRIPE_API_KEY') as string, {
  httpClient: Stripe.createFetchHttpClient(),
});

const allowedEvents: Stripe.Event.Type[] = [
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.subscription.paused',
  'customer.subscription.resumed',
  'customer.subscription.pending_update_applied',
  'customer.subscription.pending_update_expired',
  'customer.subscription.trial_will_end',
  'invoice.paid',
  'invoice.payment_failed',
  'invoice.payment_action_required',
  'invoice.upcoming',
  'invoice.marked_uncollectible',
  'invoice.payment_succeeded',
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'payment_intent.canceled',
];

async function processEvent(event: Stripe.Event) {
  // Handle the event
  console.log('Processing event:', event.id);
  if (!allowedEvents.includes(event.type)) return;

  const { customer: customerId } = event?.data?.object as {
    customer: string;
  };

  if (typeof customerId !== 'string') {
    throw new Error(`[STRIPE HOOK] ID isn't a string.\nEvent type: ${event.type}`);
  }

  return await syncStripeDataToKV(customerId);
}

async function syncStripeDataToKV(customerId: string) {


  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    limit: 12,
    status: 'all',
    expand: ['data.default_payment_method'],
  });

  console.log('Subscriptions:', subscriptions.data);

  if (subscriptions.data.length === 0) {
    const subData = { status: 'none' };
    //await supabase.storage.from('stripe_subscriptions').upsert([{ id: customerId, data: subData }]);
    return subData;
  }

  const subscription = subscriptions.data[0];

  const subData = {
    subscription_id: subscription.id,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
    currentPeriodEnd: subscription.current_period_end,
    currentPeriodStart: subscription.current_period_start,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    paymentMethod:
      subscription.default_payment_method && typeof subscription.default_payment_method !== 'string'
        ? {
            brand: subscription.default_payment_method.card?.brand ?? null,
            last4: subscription.default_payment_method.card?.last4 ?? null,
          }
        : null,
  };

  // await supabase.storage.from('stripe_subscriptions').upsert([{ id: customerId, data: subData }]);
  console.log('Synced subscription data:', subData);
  return subData;
}

Deno.serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature');

  if (!signature) {
    return new Response('{}', { status: 400 });
  }
  console.log('Stripe-Signature:', signature);

  const body = await req.text();

  async function doEventProcessing() {
    if (typeof signature !== 'string') {
      throw new Error("[STRIPE HOOK] Header isn't a string???");
    }

    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') as string,
      undefined,
    );

    EdgeRuntime.waitUntil(processEvent(event));
  }

  try {
    await doEventProcessing();
  } catch (error) {
    console.error('[STRIPE HOOK] Error processing event:', error);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/stripe-webhook' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
