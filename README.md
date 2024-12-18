## Prerequistes for this project:

1. [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started?queryGroups=platform&platform=macos)

## Get up and running

### Clone the repo

To get started with this project, start by getting a copy of the code:

```bash
git clone git@github.com:ReEnvision-AI/ReEnvision.AI-BN-1.0.git
cd ReEnvision.AI-BN-1.0
```

### Install Depdencies

Next, install all the dependences:

```bash
npm install
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

Take note of the **`API URL`** and **`anon key`**, as you will need both later.

### Set environment variables

Make a copy of the `.env.example` file, naming it `.env.development.local`. By naming it this, you will ensure that its only used for local development and won't be put in the git repo.

Set `VITE_SUPA_URL` and `VITE_SUPA_PUBLIC_KEY` to the values from above.

### Start the dev server

To start the dev server, run:

```bash
npm run dev
```

This will get the dev server running and you can see the application on [localhost:8000](localhost:8000)

### Shutting down

Press `ctl-c` in the dev server terminal to stop the dev server and then run `supabase stop` to stop the supabase containers.
