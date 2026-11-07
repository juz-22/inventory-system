# InventorySys deployment

## API on Render

1. Create a new Render Blueprint from this repository.
2. In the Render service Environment settings, set `DATABASE_URL` to the production PostgreSQL connection string.
3. Set `OPENAI_API_KEY` in Render.
4. Set `SALES_ADMIN_PASSWORD` in Render.
5. Deploy the `inventory-system-api` service.

The Render configuration runs Prisma client generation and migrations during the build.
The local `server/.env` file is ignored by Git and is not uploaded to Render; environment
variables must be configured in Render itself. The service root endpoint is used as the
Render health check.

## Client on Vercel

1. Import the repository into Vercel.
2. Set the project root directory to `client`.
3. Set the framework preset to Vite.
4. Set `VITE_API_URL` to the Render API URL followed by `/api`, for example:

   `https://inventory-system-api.onrender.com/api`

5. Deploy.

The `client/vercel.json` rewrite keeps React Router routes working on refresh.
