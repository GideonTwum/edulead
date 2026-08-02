import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Component — ignore
        }
      },
    },
  });
}

export function createServiceClient() {
  if (!env.supabaseUrl || !env.supabaseServiceKey) {
    throw new Error("Supabase service client not configured");
  }
  return createSupabaseClient(env.supabaseUrl, env.supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
