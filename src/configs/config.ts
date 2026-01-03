import { config } from "dotenv";
import { resolve } from "path";

const envFile = process.env.NODE_ENV === "production" ?
    ".env.production" : ".env.development";

config({ path: resolve(__dirname, `../../${envFile}`), override: true })

export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const DATABASE_URL = process.env.DATABASE_URL || "";