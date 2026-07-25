# VibeGuard test fixture

A deliberately broken Next.js + Supabase app. Use it to check whether your
MVP's scanner catches what it's supposed to catch — and doesn't flag what
it shouldn't.

## Expected findings (should be flagged)

| # | Issue | Location |
|---|-------|----------|
| 1 | RLS disabled on `orders` table | `supabase/schema.sql` |
| 2 | Unauthenticated write to database | `app/api/orders/route.ts` |
| 3 | service_role key bundled into client code | `lib/supabaseAdmin.ts` + `app/dashboard/page.tsx` |

## Should NOT be flagged (false-positive check)

- `sellers` table — RLS is correctly enabled with policies in `supabase/schema.sql`
- `app/api/sellers/route.ts` — correctly checks `auth.getUser()` before writing
- `lib/supabaseServer.ts` — correctly server-only, never imported client-side

## How to use

1. Push this to a public GitHub repo (or point your scanner at a local path
   if your MVP supports that).
2. Run VibeGuard against it.
3. Score it: 3/3 true positives + 0 false positives on the "should not be
   flagged" items is a clean pass. Anything less tells you exactly which
   check to tighten before you show this to real users.

## Note

Every "vulnerability" here is a code-only fixture — there's no live Supabase
project behind it, no real keys, nothing deployed. It exists purely to be
statically scanned.
