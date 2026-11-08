# InventorySys deployment

## API on Railway

1. Create a Railway service from this repository.
2. Set the service root directory to `server`.
3. In the Railway service Variables settings, set `DATABASE_URL` to the production PostgreSQL connection string.
4. Set `OPENAI_API_KEY` and `SALES_ADMIN_PASSWORD` in Railway.
5. Deploy the API service.

The service runs a lockfile-based dependency install, Prisma client generation, and migrations
during the build. The API requires Node 18.18 or newer. The local `server/.env` file is
ignored by Git and is not uploaded to Railway; environment variables must be configured in
Railway itself.

## Client on Vercel

1. Import the repository into Vercel.
2. Set the project root directory to `client`.
3. Set the framework preset to Vite.
4. Set the Vercel environment variable `VITE_API_URL` to the Railway API URL followed by
   `/api`:

   `https://inventory-system-production-12fc.up.railway.app/api`

5. Deploy.

The `client/vercel.json` rewrite keeps React Router routes working on refresh.
