# ReEnvision.AI-BN-1.0 - Project Readme

This document provides instructions for setting up and running the ReEnvision.AI-BN-1.0 project locally. It covers prerequisites, installation, configuration, and basic usage.

## Table of Contents

- [Quick Start for Most Developers](#quickstart)
- [Full Setup for Database Changes](#fullseutp)
- [Shutting Down](#shutting-down)
- [Troubleshooting](#troubleshooting)
- [Important Notes and Reminders](#important-notes-and-reminders)

## Quick Start
This simplified setup uses the stage Supabase database and a Stripe test API key. You do <em>not</em> need to run SUpabase locally nor do you need to forward Stripe events.
<ol>
<li><strong>Clone the Repository</strong>
<br>Open a terminal and run the following commands to clone the project repository and navigate into the project directory:

```bash
git clone git@github.com:ReEnvision-AI/ReEnvision.AI-BN-1.0.git
cd ReEnvision.AI-BN-1.0
```
</li>

<li><strong>Install Dependencies</strong>

Install the project's Node.js dependencies using `pnpm`:<br>
```bash
pnpm install
```
</li>

<li><strong>Set Environment Variables</strong>

Environment variables are used to configure the application without hardcoding sensitive information (like API keys) directly into the code.
  - **Create the file**: In the project's root directory, copy the `.env.` example file to a new file named `.env.development.local`:

    ```bash
    cp .env.example .env.development.local
    ```

    - **Edit** `.env.development.local`: Open the `.env.development.local` file and set the following variables. Contact the ReEnvision team to obtain the values for these keys:
      - `VITE_SUPA_URL`: The URL for the supabase staging environment
      - `VITE_SUPA_PUBLIC_KEY`: The public key for the supabase staging environment.
      - `VITE_STRIPE_API_KEY`: The public key for the Stripe sandbox environment.

</li>

<li><strong>Start the Development Server:</strong>

```bash
pnpm dev
```

This command builds the application and starts a local development server, usually on port 8000. The terminal output will show the exact URL (e.g., `http://localhost:8000`). Open your web browser and navigate to this URl to run the application.
</li>
</ol>

## Full Setup
These instructions are only necessary if you are making changes to the database schema. If you are unsure whether you need this setup, please contact the ReEnvision team.

### Prerequisites

Before you begin, ensure you have the following software installed and configured:

1.  **Docker Desktop:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) - Used to run Supabase locally in containers. Make sure Docker Desktop is running before starting Supabase.
2.  **Supabase CLI:** [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started?queryGroups=platform&platform=macos) - Used to manage the local Supabase instance and database migrations. Follow the installation instructions for your operating system.
3.  **Stripe CLI:** [Stripe CLI](https://docs.stripe.com/stripe-cli) - Used to test Stripe webhooks locally. You'll need a Stripe account (free for development) to use the CLI.
4.  **pnpm:** This project uses `pnpm` as its package manager. If you don't have it installed, run:
    ```bash
    npm install -g pnpm
    ```
    (If you prefer to use `npm` or `yarn`, you _can_, but you'll need to adapt the commands accordingly. Consider adding instructions for those package managers if you want to support them.)
5.  **Git**: To clone this repo, be sure to have git installed on your machine. Install the proper version for your operating system [here](https://git-scm.com/downloads)

### Getting Started

Follow these steps to get the project running on your local machine:

#### 1. Clone the Repository

Open a terminal and run the following commands to clone the project repository and navigate into the project directory:

```bash
git clone git@github.com:ReEnvision-AI/ReEnvision.AI-BN-1.0.git
cd ReEnvision.AI-BN-1.0
```

#### 2. Pull Database Changes

Pull the latest database schema from Supabase

```bash
supabase db pull
```

This command fetches the latest schema changes and creates migrations so that your local database matches the expected structure.

#### 3. Install Dependencies

Install the project's Node.js dependencies using `pnpm`:

```bash
pnpm install
```

#### 4. Start Supabase locally

Stat the local Supabase instance using Docker:

```bash
supabase start
```

This command starts all the necessary Supabase services (database, authentication, storage, etc.) within Docker containers. It may take a few minutes the first time you run it, as it needs to download the Docker images.

**Output:** After running `supabase start`, you'll see output similar to this in your terminal:

```
supabase local development setup is running.

         API URL: [http://127.0.0.1:54321](http://127.0.0.1:54321)
     GraphQL URL: [http://127.0.0.1:54321/graphql/v1](http://127.0.0.1:54321/graphql/v1)
  S3 Storage URL: [http://127.0.0.1:54321/storage/v1/s3](http://127.0.0.1:54321/storage/v1/s3)  <-- (Note: S3 is used for local storage emulation)
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: [http://127.0.0.1:54323](http://127.0.0.1:54323)
    Inbucket URL: [invalid URL removed]
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: some-really-long-anon-key
service_role key: some-really-long-service-role-key
   S3 Access Key: some-long-s3-access-key
   S3 Secret Key: some-really-long-s3-secret-key
       S3 Region: local
```

**Crucially**, note the following values from the output. You'll need them later:

- `API URL`: (e.g., `http://127.0.0.1:54321`)
- `anon key`: (e.g., `some-really-long-anon-key `)
- `service_role_key`: (e.g., `some-really-long-service-role-key`)

The Supabase Studio URL is also important. You can access the local Supabase Studio (a web-based database management tool) at the `Studio URL` (e.g., `http://127.0.0.1:54323`). This is very helpful for inspecting your database.

#### 5. Forward Stripe Events to Local Webhook

Open a new terminal window (keep the Supabase terminal running). You'll use this terminal to run the Stripe CLI.

Log in to your Stripe account via the CLI:

```bash
stripe login
```

Follow the prompts to authenticate. This is a one time process unless your credentials expire.

Now, forward Stripe events to your local webhook endpoint

```bash
stripe listen --forward-to http://127.0.0.1:54321/functions/v1/stripe-webhook
```

**Important:**

- Replace `http://127.0.0.1:54321` with your actual Supabase `API URL` if it's different. The full URL _must_ match the expected endpoint for your `stripe_webhook` edge function.
- The stripe cli may prompt you to choose which events you want to forward. Choose according to the project's requirements, or select all if you are unsure.

**Output:** The Stripe CLI will output a line like this:

```
Your webhook signing secret is whsec_7......
```

**Copy this** `whsec_...` value. You'll need it for the `STRIPE_WEBHOOK_SECRET` environment variable.

#### 6. Set Environment Variables

Environment variables are used to configure the application without hardcoding sensitive information (like API keys) directly into the code.

**Vite Environment File (.env.development.local)**

<ol>

<li><strong>Create the file:</strong> In the project's root directory, copy the <code>.env.example</code> file to a new file names <code>.env.development.local</code>:

```bash
cp .env.example .env.development.local
```

<p>
Files starting with <code>.env.local</code> are automatically loaded by Vite in development mode and <code>.local</code> ensures it's ignored by Git (so you don't accidentally commit your keys).
</p>
</li>
<li>Edit <code>.env.development.local</code>: Open the <code>.env.development.local</code> files and set the following variables:
<ul>
<li>
<code>VITE_SUPA_URL</code>: Set this to the Supabase <code>API URL</code>you noted earlier (e.g, <code>http://127.0.0.1:54321</code>)
</li>
<li>
<code>VITE_SUPA_PUBLIC_KEY</code>: Set this to the Supabase <code>anon key</code> you noted earlier.
</li>
<li>
<code>VITE_STRIPE_API_KEY</code>: Set this to your Stripe <strong>test</strong> secret key. You can find your test keys in the Stripe Dashboard: <a href='https://dashboard.stripe.com/test/apikeys'>Stripe API Keys</a>. <strong>Do NOT use a live key in development.</strong>
</li>
</ul>
</li>
</ol>

**Supabase Edge Functions Environment File (.env)**

<ol>
<li>
<strong>Create the file:</strong> Inside the <code>./supabase</code> directory, create a new file named <code>.env</code>
</li>
<li> <strong>Edit</strong><code>./supabase/.env</code>: Open the <code>./supabase/.env</code> file and set the following variables:
<ul>
<li><code>STRIPE_API_KEY</code>: Set this to the <em>same</em> Stripe <strong>test</strong> secret key you used in the Vite environment file.
</li>
<li><code>STRIPE_WEBHOOK_SECRET</code>: Set this to the <code>whsec...</code> value you copied from the Stripe CLI output.</li>
<li><code>DOMAIN</code>: Set this to the URL where your development server will be running (e.g., <code>http://127.0.0.1:8000</code>). This is used for redirects after successful Stripe checkouts. Make sure teh port matches your dev server's port.</li>
<li><code>PRICE_ID</code>: <code>price_1QnUdJB2qnYuPGRFFyqvB50r</code> (This is a hardcoded test price ID. You may need to update this if you create your own test products/prices in Stripe.)
</ul>
</ol>

#### 7. Start Supabase Edge Functions

Open another **new terminal window** (keep the Supabase and Stripe CLI terminals running). Navigate to the project's root directory.

Serve the Supabase edge functions:

```bash
supabase functions serve --env-file ./supabase/.env
```

This command starts a local server that hosts your Supabase edge functions, allowing you to test them without deploying them to the Supabase cloud. Ensure the `--env-file` path is correct.

### 7. Start the Development Server

Open one last **new terminal window**. Navigate to the project's root directory.

Start the Vite development server:

```bash
pnpm dev
```

This command builds the application and starts a local development server, usually on port 8000. The terminal output will show the exact URL (e.g., `http://localhost:8000`).

Open your web browser and navigate to the URL provided by the `pnpm dev` command. You should now see the application running.

## Shutting Down

To stop the development environment, follow these steps in order:

<ol>
<li><strong>Development Server:</strong> In the terminal running <code>pnpm dev</code>, press <code>Ctrl-C</code> or type <code>q</code> and press Enter.</li>
<li><strong>Stripe Webhook Forwarding:</strong> In the terminal running <code>stripe listen</code>, press <code>Ctrl-C</code>.</li>
<li><strong>Supabase Edge Functions:</strong> In the terminal running <code>supabase functions serve</code>, press <code>Ctrl-C</code>.</li>
<li><strong>Supabase:</strong> In a terminal, navigate to the project's root directory and run:

```bash
supabase stop
```

This stops all the Supabase docker containers.

</li>
</ol>

## Troubleshooting

- `supabase start` **fails:** Make sure Docker Desktop is running. If it's still failing, try running `supabase stop --no-backup` and then `supabase start` again. This will reset the local Supabase instance (you'll lose any data in your local database).
- **Port conflicts:** If any of the ports (54321, 54323, 54323, 8000, etc.) are already in use, you'll see errors. You can either stop the conflicting process or configure the project to use different ports (this usually involves modifying configuration files and environment variables).
- **Stripe CLI errors:** Ensure you're logged in (`stripe login`) and that your Stripe account is setup correctly. Check the Stripe CLI documentation for more troubleshooting tips.
- **Environment variable issues:** Double-check that you've set all the required environment variables correctly and that the paths to the `.env` files are correct. A typo in an environment variable name or value can cause subtle and hard-to-debug errors.
- **Database connection refused**: Be sure that docker is running before starting supabase.

## Important Notes and Reminders

- **Test Keys Only: Never** use your live Stripe API keys in a development environment. Always use test keys.
- **Data Loss:** Running `supabase stop --no-backup` will reset your local database. Be careful when using this command.
- **Supabase Studio:** Use the Supabase Studio (at the `Studio URL` provided by `supabase start`) to inspect your database, manage users, and explore the Supabase features.
- **Keep Terminals Open:** You'll need multiple terminal windows open simultaneously: one for Supabase, one for the Stripe CLI, one for the Supabase edge functions, and one for the development server.
