import postgres from "postgres";
import { config } from "dotenv";
config();
export const query = postgres({
  host: process.env.DB_HOST,
  db: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
// query``