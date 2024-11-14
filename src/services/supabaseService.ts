import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabase: SupabaseClient = createClient(import.meta.env.VITE_SUPA_URL, import.meta.env.VITE_SUPA_PUBLIC_KEY)

export default supabase;