import { createClient } from "@supabase/supabase-js";

/**
 * Admin Supabase client using the Service Role Key.
 * STRICTLY for server-side trusted operations: background jobs, click registration, audit tasks.
 * NEVER import this file into Client Components.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    // In dev/setup mode, fall back to anon key with a clear server warning
    console.warn("[STACKWISE SECURITY ALERT] SUPABASE_SERVICE_ROLE_KEY not configured. Falling back to anonymous permissions.");
    return createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
