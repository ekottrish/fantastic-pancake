// --- Supabase credentials via environment variables ---
// Supabase credentials are now sourced from Vite environment variables. Ensure that
// you provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your `.env` file.

export const SUPABASE_URL: string | undefined = import.meta.env.VITE_SUPABASE_URL as string | undefined;
export const SUPABASE_KEY: string | undefined = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error(
    'Supabase credentials are missing. Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.'
  );
}
