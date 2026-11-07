# InventorySys deployment

## API on Render

1. Create a new Render Blueprint from this repository.
2. Set `DATABASE_URL` to the production PostgreSQL connection string.
3. Set `OPENAI_API_KEY`.
4. Set `SALES_ADMIN_PASSWORD`.
5. Deploy the `inventory-system-api` service.

The Render configuration runs Prisma client generation and migrations during the build.

## Client on Vercel

1. Import the repository into Vercel.
2. Set the project root directory to `client`.
3. Set the framework preset to Vite.
4. Set `VITE_API_URL` to the Render API URL followed by `/api`, for example:

   `https://inventory-system-api.onrender.com/api`

5. Deploy.

The `client/vercel.json` rewrite keeps React Router routes working on refresh.
