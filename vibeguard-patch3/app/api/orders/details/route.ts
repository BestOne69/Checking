import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// VIBEGUARD TEST FIXTURE
// BUG #10 (planted): Insecure Direct Object Reference (IDOR).
// This route fetches an order by ID with no check that the requesting
// user actually owns that order. Anyone who guesses or increments an
// order ID (e.g. /api/orders/details?id=1, then id=2, id=3...) can
// read any other buyer's full order details, including shipping
// address. This is distinct from the missing-RLS bug — even WITH RLS
// enabled on the table, using the admin client here bypasses it entirely,
// and even without the admin client, the route logic itself never
// checks auth.uid() against the order's buyer_id.

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("id");

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json({ order: data });
}
