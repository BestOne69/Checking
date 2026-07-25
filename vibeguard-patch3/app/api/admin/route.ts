import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// VIBEGUARD TEST FIXTURE
// BUG #9 (planted): this route DOES check for something before allowing
// the action — but it checks a role field the CLIENT sent in the request
// body, not a value verified server-side from the user's actual session/
// database record. Anyone can send { "role": "admin" } in their request
// and pass this check regardless of their real permissions. This is a
// distinct, sneakier bug than "no auth check at all" — it looks
// protected at a glance but isn't.

export async function DELETE(req: Request) {
  const body = await req.json();

  if (body.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await supabaseAdmin.from("sellers").delete().eq("id", body.seller_id);

  return NextResponse.json({ deleted: true });
}

// A correctly protected version verifies the role from the DATABASE,
// tied to the authenticated user's session — never trusts a client-sent field:
//
// export async function DELETE(req: Request) {
//   const supabase = createServerClient();
//   const { data: { user } } = await supabase.auth.getUser();
//   if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//
//   const { data: profile } = await supabase
//     .from("profiles")
//     .select("role")
//     .eq("id", user.id)
//     .single();
//
//   if (profile?.role !== "admin") {
//     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//   }
//   ...
// }
