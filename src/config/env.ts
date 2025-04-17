import dotenv from 'dotenv';
dotenv.config();

export const config = {
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_KEY: process.env.SUPABASE_KEY!,
  JWT_SECRET: process.env.JWT_SECRET!,
  ZOHO_EMAIL: process.env.ZOHO_EMAIL!,
  ZOHO_PASSWORD: process.env.ZOHO_PASSWORD!,
  REDIS_URL: process.env.REDIS_URL!,
  DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL!,
};
