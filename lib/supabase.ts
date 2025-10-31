import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// It's recommended to store these in environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL or Anon Key is missing. Please check your environment variables.");
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
      