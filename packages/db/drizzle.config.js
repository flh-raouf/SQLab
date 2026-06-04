import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "mysql",
  schema: "./src/schema.ts",
  dbCredentials: {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 3308),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "root",
    database: process.env.DB_NAME ?? "DZTelecom",
  },
});
