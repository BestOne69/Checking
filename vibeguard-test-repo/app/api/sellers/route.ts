import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";

// This route IS correctly protected — a good scanner should NOT flag it.
// Included so you can check your tool's false-positive rate, not just
// its true-positive rate.

export async function POST(req: Request) {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { data, error } = await supabase
    .from("sellers")
    .insert({
      user_id: user.id,
      store_name: body.store_name,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ seller: data });
}
