"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
// src/config/supabase.ts
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Use an absolute path to the .env file
const envPath = path_1.default.resolve(__dirname, '../../.env');
// Log the resolved path for debugging
console.log('Resolved .env path:', envPath);
// Check if the .env file exists
if (!fs_1.default.existsSync(envPath)) {
    throw new Error(`.env file not found at path: ${envPath}`);
}
// Load the .env file
const result = (0, dotenv_1.config)({ path: envPath });
// Log any errors from dotenv
if (result.error) {
    throw new Error(`Failed to load .env file: ${result.error.message}`);
}
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
// Log the values for debugging
console.log('SUPABASE_URL:', supabaseUrl);
console.log('SUPABASE_KEY:', supabaseKey);
if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing environment variables: SUPABASE_URL and/or SUPABASE_KEY must be set');
}
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
