import { createClient } from "@supabase/supabase-js";

// VIBEGUARD TEST FIXTURE
// BUG #3 (planted): this file is imported directly into a client
// component below, which means the service_role key gets bundled
// into the JavaScript shipped to the browser. Anyone can open devtools,
// read the bundle, and use this key to bypass RLS entirely on every
// table in the project.
//
// A correct setup keeps this file server-only (e.g. under a route
// handler or server action) and never imports it from a "use client"
// component.

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY! // <- NEXT_PUBLIC_ prefix exposes this to the browser
);
