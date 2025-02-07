## Prerequistes for this project:

1. [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started?queryGroups=platform&platform=macos)
3. [Stripe CLI](https://docs.stripe.com/stripe-cli)

## Get up and running

### Clone the repo

To get started with this project, start by getting a copy of the code:

```bash
git clone git@github.com:ReEnvision-AI/ReEnvision.AI-BN-1.0.git
cd ReEnvision.AI-BN-1.0
```

### Pull DB changes

```bash
supabase db pull
```

### Install Depdencies

Next, install all the dependences:

```bash
pnpm install
```

### Start supabase locally

Now start a local subpase instance:

```bash
supabase start
```

When the supabase containers have started, you will see something like this:

```
supabase local development setup is running.

         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
  S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: some-really-long-anon-key
service_role key: some-really-long-service-role-key
   S3 Access Key: some-long-s3-access-key
   S3 Secret Key: some-really-long-s3-secret-key
       S3 Region: local
```

Take note of the **`API URL`**, **`anon key`**, and **`service_role key`** as you will need them later.

You will also need the stripe information to get the address for your local stripe webhook edge function. The URL for the edge function will be `http://127.0.0.1:54321/functions/v1/stripe-webhook` if the API URL is `http://127.0.0.1:54321`.

### Forward Stripe events to local webhook

In a new terminal, run the following command to have stripe forward events to your local webhook:

```bash
stripe listen --forward-to http://127.0.0.1:54321/funtions/v1/stripe-webhook`
```

This will give you the webhook signing secret, which you will need later. It is shown in the terminal as
`Your webhook signing secret is whsec_7.......`

Note: you may have to signin to stripe via the stripe cli for this to work.

### Set environment variables

#### Vite env file

Make a copy of the `.env.example` file, that is in the project root director, naming it `.env.development.local`. By naming it this, you will ensure that its only used for local development and won't be put in the git repo.

Now you need the Stripe API key. For local development **USE THE TEST KEY**!!! You can find the stripe test key [here](https://dashboard.stripe.com/test/apikeys).

Set `VITE_SUPA_URL` and `VITE_SUPA_PUBLIC_KEY` to the values from supabase (see above).

Set `VITE_STRIPE_API_KEY` to the Stripe test key.

#### Supabase env file

The supabase edge functions also need an `.env` file. This file should be in the `./supabase` directory of the project.

Within the supabase env file, put in the following values:

`STRIPE_API_KEY` set to the **TEST KEY** from Stripe (same as in the vite env file)
`STRIPE_WEBHOOK_SECRET` set to the output of the stripe forward command from above
`DOMAIN=http://127.0.0.1:8000` This is for the checkout complete redirect from Stripe. It assumes you are running the project in dev mode on port `8000`. Change the port if necessary.
`PRICE_ID=price_1QnUdJB2qnYuPGRFFyqvB50r` This is a hardcoded test price for now used in the checkout.

### Start supabase edge functions

To serve the supabase edge functions locally, open a new terminal and run

```bash
supabase functions serve --env.file ./supabase/.env
```

The `.env ` file should be the one you created from the **Supabase env file** section above.

### Start the dev server

To start the dev server, in a new terminal run:

```bash
pnpm dev
```

This will get the dev server running and you can see the application on [localhost:8000](localhost:8000)

### Shutting down

#### Stopping the dev server

Press `q` in the dev server terminal to stop the dev server.

#### Stopping stripe webhook forwarding

In the terminal running the stripe forward-to command, press `Ctl-C` to stop webhook forwarding.

#### Stopping local edge functions

In the terminal serving the local supabase edge functions, press `Ctl-C` to stop the edge functions.

#### Stopping supabase

`supabase stop` to stop the supabase containers.
