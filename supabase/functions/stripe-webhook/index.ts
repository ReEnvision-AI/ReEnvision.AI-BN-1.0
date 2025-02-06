// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import Stripe from 'stripe';
import type { Tables, TablesInsert } from './types_db';

const allowedEvents = new Set([
  'checkout.session.completed',
  'product.created',
  'product.updated',
  'product.deleted',
  'price.created',
  'price.deleted',
  'price.updated',
]);

const toDateTime = (secs: number) => {
  const t = new Date(+0); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

type Product = Tables<'products'>;
type Price = Tables<'prices'>;

Deno.serve(async (req) => {
  // -----------------------------------------------------------------
  // Initialize resources within the Deno.serve scope
  // -----------------------------------------------------------------

  // Get environment variables - Fail fast if missing required vars
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  if (!supabaseUrl) {
    console.error('Missing SUPABASE_URL environment variable.');
    return new Response('Internal server error', { status: 500 });
  }
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseServiceKey) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable.');
    return new Response('Internal server error', { status: 500 });
  }
  const stripeApiKey = Deno.env.get('STRIPE_API_KEY');
  if (!stripeApiKey) {
    console.error('Missing STRIPE_API_KEY environment variable.');
    return new Response('Internal server error', { status: 500 });
  }
  const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  if (!stripeWebhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET environment variable.');
    return new Response('Internal server error', { status: 500 });
  }

  // Create Supabase client - using service role key for admin privileges
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // Create Stripe client
  const stripe = Stripe(stripeApiKey, {
    httpClient: Stripe.createFetchHttpClient(),
  });

  // -----------------------------------------------------------------
  // Define functions within the Deno.serve scope
  // -----------------------------------------------------------------

  async function upsertProductRecord(product: Stripe.Product) {
    const productData: Product = {
      id: product.id,
      active: product.active,
      name: product.name,
      description: product.description ?? null,
      image: product.images?.[0] ?? null,
      metadata: product.metadata,
    };

    const { error: upsertError } = await supabase.from('products').upsert([productData]);
    if (upsertError) {
      console.error(`Product insert/update failed: ${upsertError.message}`);
      throw new Error(`Product insert/update failed: ${upsertError.message}`);
    }
    console.log(`Product inserted/updated: ${product.id}`);
  }

  async function deleteProductRecord(product: Stripe.Product) {
    const { error: deletionError } = await supabase.from('products').delete().eq('id', product.id);
    if (deletionError) {
      console.error(`Product deletion failed: ${deletionError.message}`);
      throw new Error(`Product deletion failed: ${deletionError.message}`);
    }
    console.log(`Product deleted: ${product.id}`);
  }

  async function upsertPriceRecord(price: Stripe.Price, retryCount = 0, maxRetries = 3) {
    const priceData: Price = {
      id: price.id,
      product_id: typeof price.product === 'string' ? price.product : '',
      active: price.active,
      currency: price.currency,
      type: price.type,
      unit_amount: price.unit_amount ?? null,
      interval: price.recurring?.interval ?? null,
      interval_count: price.recurring?.interval_count ?? null,
      trial_period_days: price.recurring?.trial_period_days ?? 0,
    };

    const { error: upsertError } = await supabase.from('prices').upsert([priceData]);

    if (upsertError?.message.includes('foreign key constraint')) {
      if (retryCount < maxRetries) {
        console.log(`Retry attempt ${retryCount + 1} for price ID: ${price.id}`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await upsertPriceRecord(price, retryCount + 1, maxRetries);
      }
    } else if (upsertError) {
      console.error(`Price insert/update failed after ${maxRetries} retries: ${upsertError.message}`);
      throw new Error(`Price insert/update failed after ${maxRetries} retries: ${upsertError.message}`);
    } else {
      console.log(`Price inserted/updated: ${price.id}`);
    }
  }

  async function deletePriceRecord(price: Stripe.Price) {
    const { error: deletionError } = await supabase.from('prices').delete().eq('id', price.id);
    if (deletionError) {
      console.error(`Price deletion failed: ${deletionError.message}`);
      throw new Error(`Price deletion failed: ${deletionError.message}`);
    }
    console.log(`Price deleted: ${price}`);
  }

  async function manageSubscriptionStatusChange(
    subscriptionId: string,
    customerId: string,
    createAction?: boolean = false,
  ) {
    console.log('ManageSubscriptionStatusChange start');
    console.log('Customer id:', customerId);
    const { data: customerData, error: noCustomerError } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (noCustomerError) {
      console.error(`Customer lookup failed: ${noCustomerError.message}`);
      throw new Error(`Customer lookup failed: ${noCustomerError.message}`);
    }

    const { id: uuid } = customerData!;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['default_payment_method'],
    });

    // Upsert the latest status of the subscription object
    const subscriptionData: TablesInsert<'subscriptions'> = {
      id: subscription.id,
      user_id: uuid,
      metadata: subscription.metadata,
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
      quantity: subscription.quantity,
      cancel_at_period_end: subscription.cancel_at_period_end,
      cancel_at: subscription.cancel_at ? toDateTime(subscription.cancel_at).toISOString() : null,
      current_period_start: toDateTime(subscription.current_period_start).toISOString(),
      current_period_end: toDateTime(subscription.current_period_end).toISOString(),
      created: toDateTime(subscription.created).toISOString(),
      ended_at: subscription.ended_at ? toDateTime(subscription.ended_at).toISOString() : null,
      trial_start: subscription.trial_start ? toDateTime(subscription.trial_start).toISOString() : null,
      trial_end: subscription.trail_end ? toDateTime(subscription.trail_end).toISOString() : null,
    };

    const { error: upsertError } = await supabase.from('subscriptions').upsert([subscriptionData]);
    if (upsertError) {
      console.error(`Subscription insert/update failed: ${upsertError.message}`);
      throw new Error(`Subscription insert/update failed: ${upsertError.message}`);
    }
    console.log(`Inserted/updated subscription [${subscription.id}] for user [${uuid}]`);
  }

  async function processEvent(event: Stripe.Event) {
    // Handle the event
    if (!allowedEvents.has(event.type)) return;
    try {
      switch (event.type) {
        case 'product.created':
        case 'product.updated':
          await upsertProductRecord(event.data.object as Stripe.Product);
          break;
        case 'product.deleted':
          await deleteProductRecord(event.data.object as Stripe.Product);
          break;
        case 'price.created':
        case 'price.updated':
          await upsertPriceRecord(event.data.object as Stripe.Price);
          break;

        case 'price.deleted':
          await deletePriceRecord(event.data.object as Stripe.Price);
          break;

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === 'customer.subscription.created',
          );
          break;
        }
        case 'checkout.session.completed': {
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === 'subscription') {
            const subscriptionId = checkoutSession.subscription;
            await manageSubscriptionStatusChange(subscriptionId as string, checkoutSession.customer as string, true);
          }
          break;
        }

        default:
          console.log('Unhandled relevant event:', event.type);
          throw new Error('Unhandled relevant event!');
      }
    } catch (error) {
      console.error('Error processing event:', error);
    }
  }

  // -----------------------------------------------------------------
  // Deno.serve request handler logic
  // -----------------------------------------------------------------

  const signature = req.headers.get('Stripe-Signature');
  if (!signature) {
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      stripeWebhookSecret,
      undefined, // optional timestamp tolerance
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new Response(`Webhook signature verification failed: ${err.message}`, {
      status: 400,
    });
  }

  // Process the Stripe event
  try {
    await processEvent(event);
    EdgeRuntime.waitUntil(Promise.resolve()); // Keep function alive until event is processed
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error: any) {
    console.error('Webhook event processing error:', error);
    return new Response('Webhook event processing failed', { status: 500 });
  }
});
