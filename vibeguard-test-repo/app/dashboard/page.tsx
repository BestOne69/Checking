"use client";

import { useEffect, useState } from "react";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// VIBEGUARD TEST FIXTURE
// This client component imports supabaseAdmin directly, which is what
// actually causes the service_role key to be bundled client-side.
// A scanner should flag this import chain, not just the key's existence.

export default function DashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    supabaseAdmin
      .from("orders")
      .select("*")
      .then(({ data }) => setOrders(data ?? []));
  }, []);

  return (
    <div>
      <h1>All orders (unfiltered)</h1>
      <ul>
        {orders.map((o) => (
          <li key={o.id}>{o.product_name} — {o.amount}</li>
        ))}
      </ul>
    </div>
  );
}
