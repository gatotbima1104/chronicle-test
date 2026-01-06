import { config } from "dotenv";
import { resolve } from "path";
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg";

const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
config({ path: resolve(__dirname, `../../${envFile}`), override: true })

// Prisma Client
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
export const prisma = new PrismaClient({adapter});

// Database
export const PORT = Number(process.env.PORT || 3000);
export const NODE_ENV = process.env.NODE_ENV || "development";
export const DATABASE_URL = process.env.DATABASE_URL || "";

// JWT
export const JWT_SECRET = process.env.JWT_SECRET || "";

// REDIS
export const REDIS_HOST = process.env.REDIS_HOST || "";
export const REDIS_PORT = Number(process.env.REDIS_PORT || 8002);

// CELERY
export const CELERY_API = process.env.CELERY_API || "";