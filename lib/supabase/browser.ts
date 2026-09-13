import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let browserClient: SupabaseClient | null = null

export function getSupabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const publishableKey = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim()

  if (!url || !publishableKey) {
    throw new Error("Shared Supabase configuration is missing.")
  }

  return { url: url.replace(/\/$/, ""), publishableKey }
}

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient

  const { url, publishableKey } = getSupabasePublicConfig()
  browserClient = createClient(url, publishableKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
    },
  })

  return browserClient
}

