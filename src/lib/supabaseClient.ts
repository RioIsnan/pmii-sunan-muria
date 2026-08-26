import { createClient } from '@supabase/supabase-js';

// Masukkan secara langsung untuk menguji apakah tembus
const supabaseUrl = 'https://qklqviaqjnxcjxxfywk.supabase.co';
const supabaseAnonKey = 'sb_publishable_ka-X43p5rWH15U0C6pdAIg_stx_125i';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);