import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// VIBEGUARD TEST FIXTURE
// BUG #2 (planted): this route writes to the `orders` table using the
// admin/service-role client, with no session check, no auth token
// validation, and no verification that the caller owns the buyer_id
// they're submitting. Anyone who finds this endpoint can create orders
// for any buyer_id, at any amount, with no authentication at all.

export async function POST(req: Request) {
  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from("orders")
    .insert({
      buyer_id: body.buyer_id,
      product_name: body.product_name,
      amount: body.amount,
      shipping_address: body.shipping_address,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ order: data });
}

// For contrast: a correctly protected route would look like:
//
// import { createServerClient } from "@/lib/supabaseServer";
//
// export async function POST(req: Request) {
//   const supabase = createServerClient();
//   const { data: { user } } = await supabase.auth.getUser();
//   if (!user) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
//   const body = await req.json();
//   if (body.buyer_id !== user.id) {
//     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//   }
//   ...
// }
