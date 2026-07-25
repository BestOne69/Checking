import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// Server-only client — never imported from a "use client" file.
// This is the correct pattern; contrast with lib/supabaseAdmin.ts.

export function createServerClient() {
  return createServerComponentClient({ cookies });
}
