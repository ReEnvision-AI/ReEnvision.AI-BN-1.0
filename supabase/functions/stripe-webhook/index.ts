// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import Stripe from 'stripe';
import type { Tables, TablesInsert } from './types_db';

const toDateTime = (secs: number) => {
  const t = new Date(+0); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

type Product = Tables<'products'>;
type Price = Tables<'prices'>;

Deno.serve(async (req) => {
  // -----------------------------------------------------------------
  // Configuration and Resource Initialization within Deno.serve scope
  // -----------------------------------------------------------------

  const config = {
    supabaseUrl: Deno.env.get('SUPABASE_URL'),
    supabaseServiceKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    stripeApiKey: Deno.env.get('STRIPE_API_KEY'),
    stripeWebhookSecret: Deno.env.get('STRIPE_WEBHOOK_SECRET'),
    allowedStripeEvents: new Set([
      'customer.created',
      'customer.updated',
      'checkout.session.completed',
      'product.created',
      'product.updated',
      'product.deleted',
      'price.created',
      'price.deleted',
      'price.updated',
      'customer.subscription.created',
      'customer.subscription.updated',
      'customer.subscription.deleted',
    ]),
    dbTableNames: {
      products: 'products',
      prices: 'prices',
      subscriptions: 'subscriptions',
      profiles: 'profiles',
    },
  };

  // --- Validate Environment Configuration ---
  if (!config.supabaseUrl) {
    console.error('Missing SUPABASE_URL environment variable.');
    return new Response('Internal server error. 5656', { status: 500 });
  }
  if (!config.supabaseServiceKey) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable.');
    return new Response('Internal server error. 2840', { status: 500 });
  }
  if (!config.stripeApiKey) {
    console.error('Missing STRIPE_API_KEY environment variable.');
    return new Response('Internal server error. 2380', { status: 500 });
  }
  if (!config.stripeWebhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET environment variable.');
    return new Response('Internal server error. 0203', { status: 500 });
  }

  // --- Initialize Supabase Client ---
  const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // --- Initialize Stripe Client ---
  const stripe = Stripe(config.stripeApiKey, {
    httpClient: Stripe.createFetchHttpClient(),
  });

  // -----------------------------------------------------------------
  // Function Definitions within Deno.serve scope
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

    const { error: upsertError } = await supabase.from(config.dbTableNames.products).upsert([productData]);
    if (upsertError) {
      console.error(`Product insert/update failed for product ID [${product.id}]:`, upsertError.message, product);
      // Consider more specific error response if needed, e.g., 503 for DB issues
      throw new Error(`Product insert/update failed: ${upsertError.message}`); // Re-throw for outer error handling
    }
    console.log(`Product inserted/updated: ${product.id}`);
  }

  async function deleteProductRecord(product: Stripe.Product) {
    const { error: deletionError } = await supabase.from(config.dbTableNames.products).delete().eq('id', product.id);
    if (deletionError) {
      console.error(`Product deletion failed for product ID [${product.id}]:`, deletionError.message, product);
      throw new Error(`Product deletion failed: ${deletionError.message}`); // Re-throw for outer error handling
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

    const { error: upsertError } = await supabase.from(config.dbTableNames.prices).upsert([priceData]);

    if (upsertError?.message.includes('foreign key constraint')) {
      if (retryCount < maxRetries) {
        console.warn(`Retry attempt ${retryCount + 1} for price ID [${price.id}] due to foreign key constraint.`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await upsertPriceRecord(price, retryCount + 1, maxRetries);
      } else {
        console.error(
          `Price insert/update failed after ${maxRetries} retries for price ID [${price.id}] due to foreign key constraint.`,
          price,
          upsertError,
        );
        throw new Error(
          `Price insert/update failed after ${maxRetries} retries due to foreign key constraint: ${upsertError.message}`,
        ); // Re-throw
      }
    } else if (upsertError) {
      console.error(`Price insert/update failed for price ID [${price.id}]:`, upsertError.message, price);
      throw new Error(`Price insert/update failed: ${upsertError.message}`); // Re-throw for outer error handling
    } else {
      console.log(`Price inserted/updated: ${price.id}`);
    }
  }

  async function deletePriceRecord(price: Stripe.Price) {
    const { error: deletionError } = await supabase.from(config.dbTableNames.prices).delete().eq('id', price.id);
    if (deletionError) {
      console.error(`Price deletion failed for price ID [${price.id}]:`, deletionError.message, price);
      throw new Error(`Price deletion failed: ${deletionError.message}`); // Re-throw for outer error handling
    }
    console.log(`Price deleted: ${price.id}`);
  }

  async function manageCustomerChange(customer: Stripe.Customer) {
    const email = customer.email;
    if (!email || email === '') {
      console.error(`Customer created without an email.`);
      throw new Error(`Customer created without an email.`);
    }

    const { error: customerError } = await supabase
      .from(config.dbTableNames.profiles)
      .update({ stripe_customer_id: customer.id })
      .eq('email', email);
    if (customerError) {
      console.error(`Updating profile failed for email [${email}]:`, customerError.message);
      throw new Error(`Updating profile failed for email [${email}]:`, customerError.message);
    }
    console.log(`Customer updated`);
  }

  async function manageSubscriptionStatusChange(
    subscriptionId: string,
    customerId: string,
    event_type: string, // Added event_type to log context
  ) {
    console.log(
      `ManageSubscriptionStatusChange start for subscription [${subscriptionId}], customer [${customerId}], event type [${event_type}]`,
    );

    let customerData: { id: string } | null = null;
    let uuid: string;

    // First Attempt: Find customer by stripe_customer_id
    const { data: customerDataResult, error: noCustomerError } = await supabase
      .from(config.dbTableNames.profiles)
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (!noCustomerError && customerDataResult) {
      customerData = customerDataResult;
      uuid = customerData.id;
    } else {
      // Second Attempt: Fetch customer from Stripe and try to find by email.
      console.warn(
        `Customer not found locally with stripe_customer_id [${customerId}].  Attempting Stripe customer retrieval.  Subscription ID: [${subscriptionId}]`,
      );
      let stripeCustomer: Stripe.Customer;
      try {
        stripeCustomer = (await stripe.customers.retrieve(customerId)) as Stripe.Customer;
        if (stripeCustomer.deleted) {
          throw new Error(`Stripe customer ${customerId} is marked as deleted.`);
        }
      } catch (stripeError: any) {
        console.error(
          `Stripe customer retrieve API error for customer ID [${customerId}] during subscription status change for subscription [${subscriptionId}]:`,
          stripeError.message,
          stripeError,
        );
        throw new Error(`Stripe customer retrieve failed: ${stripeError.message}`);
      }

      if (!stripeCustomer.email) {
        console.error(`Stripe customer [${customerId}] has no email address.  Cannot lookup in database.`);
        throw new Error(`Stripe customer has no email address`);
      }

      // Find Customer By Email
      const { data: customerEmailData, error: noCustomerEmailError } = await supabase
        .from(config.dbTableNames.profiles)
        .select('id')
        .eq('email', stripeCustomer.email)
        .single();

      if (noCustomerEmailError || !customerEmailData) {
        console.error(
          `Customer lookup failed by email [${stripeCustomer.email}] for customer ID [${customerId}] during subscription status change for subscription [${subscriptionId}]:`,
          noCustomerEmailError?.message,
        );
        throw new Error(
          `Customer lookup failed by email [${stripeCustomer.email}]: ${noCustomerEmailError?.message ?? 'Customer not found'}`,
        );
      }
      customerData = customerEmailData;
      uuid = customerData.id;
    }

    let subscription: Stripe.Subscription;
    try {
      subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['default_payment_method'],
      });
    } catch (stripeError: any) {
      console.error(
        `Stripe subscription retrieve API error for subscription ID [${subscriptionId}], customer [${customerId}]:`,
        stripeError.message,
        stripeError,
      );
      throw new Error(`Stripe subscription retrieve failed: ${stripeError.message}`); // Re-throw
    }

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
      trial_end: subscription.trial_end ? toDateTime(subscription.trial_end).toISOString() : null,
    };

    const { error: upsertError } = await supabase.from(config.dbTableNames.subscriptions).upsert([subscriptionData]);
    if (upsertError) {
      console.error(
        `Subscription insert/update failed for subscription ID [${subscription.id}], user UUID [${uuid}]:`,
        upsertError.message,
        subscriptionData,
      );
      throw new Error(`Subscription insert/update failed: ${upsertError.message}`); // Re-throw for outer error handling
    }
    console.log(`Inserted/updated subscription [${subscription.id}] for user [${uuid}]`);
  }

  async function processEvent(event: Stripe.Event) {
    // --- Check if event type is allowed ---
    if (!config.allowedStripeEvents.has(event.type)) {
      return new Response(JSON.stringify({ recieved: true }), { status: 200 });
    }

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
            event.type, // Pass event type for logging context
          );
          break;
        }
        case 'checkout.session.completed': {
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === 'subscription') {
            const subscriptionId = checkoutSession.subscription;
            await manageSubscriptionStatusChange(
              subscriptionId as string,
              checkoutSession.customer as string,
              event.type, // Pass event type for logging context
            );
          }
          break;
        }
        case 'customer.created':
        case 'customer.updated': {
          const customer = event.data.object as Stripe.Customer;
          await manageCustomerChange(customer);
          break;
        }

        default:
          // Should not reach here as we've already filtered allowed events, but for extra safety:
          console.warn('Unexpected event type reached in processEvent switch:', event.type, event.id);
          return new Response(`Unexpected event type: ${event.type}`, { status: 400 }); // Or just 200?
      }
    } catch (error: any) {
      console.error('Error processing Stripe event:', event.type, event.id, error);
      return new Response('Webhook event processing failed.', { status: 500 }); // Generic 500 for event processing failures
      // Consider more specific error responses based on the type of error if feasible.
    }
  }

  // -----------------------------------------------------------------
  // Deno.serve Request Handling Logic
  // -----------------------------------------------------------------

  const signature = req.headers.get('Stripe-Signature');
  if (!signature) {
    return new Response('Webhook signature verification failed.', { status: 400 }); // More specific 400 response
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    // --- Construct Stripe Event and Verify Signature ---
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      config.stripeWebhookSecret,
      undefined, // optional timestamp tolerance
    );
  } catch (err: any) {
    console.error(`Stripe webhook signature verification failed: ${err.message}`, err); // Include error details in log
    return new Response(`Webhook signature verification failed: ${err.message}`, {
      status: 400, // 400 for signature failures
    });
  }

  // --- Process the Stripe Event ---
  try {
    await processEvent(event);
    EdgeRuntime.waitUntil(Promise.resolve()); // Keep function alive until event processing finishes
    return new Response(JSON.stringify({ received: true }), { status: 200 }); // 200 OK for successful processing
  } catch (error: any) {
    console.error('Webhook event processing error:', event.type, event.id, error); // Log event details on processing error
    return new Response('Webhook event processing failed.', { status: 500 }); // 500 for processing errors
  }
});
