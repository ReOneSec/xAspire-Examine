import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Test the connection and log the result
supabase.from('subjects').select('count').single()
  .then(() => console.log('✓ Supabase connection successful'))
  .catch(error => {
    console.error('✗ Supabase connection error:', error.message);
    console.error('Please check your environment variables and database connection.');
  });