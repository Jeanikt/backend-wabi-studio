"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    ZOHO_EMAIL: process.env.ZOHO_EMAIL,
    ZOHO_PASSWORD: process.env.ZOHO_PASSWORD,
    REDIS_URL: process.env.REDIS_URL,
    DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
};
