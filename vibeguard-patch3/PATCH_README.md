# VibeGuard test fixture — patch 3 (5 new niche bugs)

Add these files to `BestOne69/Checking` alongside everything already
there, commit, and push.

## The 5 new planted bugs — each is genuinely distinct from what you already check

| File | Bug | Why your current checks miss it |
|---|---|---|
| `next.config.js` | Wildcard CORS (`Access-Control-Allow-Origin: *`) | Config file — your scanner has never looked at this file type at all |
| `app/api/admin/route.ts` | "Trust the client" — checks `body.role === "admin"` instead of a server-verified role | This route DOES have an if-check, so a naive "is there any permission logic present" scan would wrongly mark it safe. The bug is that the value being checked comes from the request body, not a verified session |
| `app/api/webhooks/stripe/route.ts` | Payment webhook with no signature verification | This route is SUPPOSED to be reachable without a logged-in user (webhooks come from Stripe's servers) — a plain "requires auth.getUser()" check would be the wrong fix here entirely. It needs a webhook-specific check for signature verification |
| `app/api/orders/details/route.ts` | IDOR — fetches an order by ID with no ownership check | Even if RLS were enabled, this route uses the admin client, bypassing RLS entirely; even without RLS, the route logic itself never confirms the requester owns this order |
| `app/api/upload/route.ts` | Unrestricted file upload — no type check, size limit, or filename sanitization | A completely different vulnerability class (file handling) your scanner has no coverage for yet |

## Recommended build order

1. **CORS wildcard check** — simplest, single regex against config files, zero ambiguity
2. **Webhook signature check** — look for route files with "webhook" in the path, flag if no `constructEvent`/signature-header check is present
3. **IDOR check** — look for GET routes that fetch by an ID param with no accompanying ownership filter (e.g. `.eq("buyer_id", ...)` or `auth.uid()` comparison) — moderate difficulty
4. **Trust-the-client check** — hardest of the five; needs to distinguish "checks `body.`/`req.` value" from "checks `session.`/verified DB lookup" — real false-positive risk if not scoped carefully, save for last
5. **Upload validation check** — lower priority unless your target users build upload features often; skip for now if ShopGram and similar seller apps don't lean heavily on file uploads

## After adding this patch

Expect your finding count to jump by 5 once you've built matching
checks for all five (from wherever your count currently stands after
patches 1 and 2). Until then, re-running today will correctly show 0
new findings for these — that's expected, not a scanner bug; it just
means the checks don't exist yet.
