import { createClient } from "@supabase/supabase-js";

// Service-role client — yalnızca server-side. RLS'i bypass eder.
export const createAdminClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
