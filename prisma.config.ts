import { defineConfig } from "prisma/config";
import { config } from "dotenv";
import { resolve } from "path";

config({
  path: resolve(process.cwd(), ".env.development"),
});

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
