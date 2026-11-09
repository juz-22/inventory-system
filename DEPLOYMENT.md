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

## Inventory CSV upload

The Import Products page parses CSV files in the browser and sends the rows as JSON to
`POST /api/inventory/upload`. The CSV must contain `name`, `category`, `price`, and
either `stock` or `quantity` columns. `quantity` is mapped to the database's `stock`
field. Product names are unique in the current Prisma schema, so duplicate names are
skipped; the response `count` is the number of newly inserted products.

Configure these production variables:

| Platform | Variable | Value |
| --- | --- | --- |
| Vercel (client project) | `VITE_API_URL` | Railway API base URL ending in `/api` |
| Railway (API service) | `DATABASE_URL` | Railway PostgreSQL connection string |
| Railway (API service) | `CLIENT_ORIGINS` | Comma-separated exact origins for custom frontend domains, e.g. `https://inventory.example.com,https://admin.example.com` |

HTTPS `*.vercel.app` origins are allowed automatically by the API. `CLIENT_ORIGINS`
is for custom domains and should contain origins only (scheme and hostname, no path).
For local development, the API allows the Vite origins on port `5173`.
