import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string(),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(20),
  JWT_EXPIRES_IN: z.string(),
  CLIENT_URL: z.string(),
});

export const env = envSchema.parse(process.env);
