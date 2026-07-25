import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// VIBEGUARD TEST FIXTURE
// BUG #8 (planted): Stripe webhook handler with NO signature
// verification. Without checking the `stripe-signature` header against
// your webhook secret, ANYONE can POST a fake "payment succeeded"
// event to this endpoint and trigger whatever your handler does next
// (e.g. mark an order as paid, grant access, ship a product) without
// ever paying. This is one of the single most common vibecoded payment
// bugs, since the "happy path" demo works perfectly without verification.

export async function POST(req: Request) {
  const event = await req.json();

  if (event.type === "payment_intent.succeeded") {
    const orderId = event.data.object.metadata.order_id;

    await supabaseAdmin
      .from("orders")
      .update({ status: "paid" })
      .eq("id", orderId);
  }

  return NextResponse.json({ received: true });
}

// A correct version verifies the signature before trusting the payload:
//
// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
//
// export async function POST(req: Request) {
//   const body = await req.text();
//   const signature = req.headers.get("stripe-signature")!;
//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(
//       body,
//       signature,
//       process.env.STRIPE_WEBHOOK_SECRET!
//     );
//   } catch (err) {
//     return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
//   }
//   ...
// }
