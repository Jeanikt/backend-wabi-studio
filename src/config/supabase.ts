// src/config/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';

// Use an absolute path to the .env file
const envPath = path.resolve(__dirname, '../../.env');

// Log the resolved path for debugging
console.log('Resolved .env path:', envPath);

// Check if the .env file exists
if (!fs.existsSync(envPath)) {
  throw new Error(`.env file not found at path: ${envPath}`);
}

// Load the .env file
const result = config({ path: envPath });

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
  throw new Error(
    'Missing environment variables: SUPABASE_URL and/or SUPABASE_KEY must be set'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
