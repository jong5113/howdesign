import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);
export const supabaseUrlExists = Boolean(supabaseUrl);
export const supabaseAnonKeyExists = Boolean(supabaseAnonKey);
export const supabaseUrlPreview = supabaseUrl ? `${supabaseUrl.slice(0, 28)}...` : null;

if (!hasSupabaseConfig) {
  console.error(
    "[Supabase] Missing environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in local .env.local or Vercel Environment Variables.",
  );
}

export const supabaseClient =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          fetch: (input, init) =>
            fetch(input, {
              ...init,
              cache: "no-store",
            }),
        },
      })
    : null;
