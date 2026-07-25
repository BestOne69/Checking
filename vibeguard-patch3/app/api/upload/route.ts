import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// VIBEGUARD TEST FIXTURE
// BUG #9 (planted): file upload with no type restriction, no size limit,
// and no filename sanitization. A vibecoded upload feature often just
// takes whatever the user sends and stores it directly. This allows:
// - Uploading executable files (.exe, .sh, .php) disguised as images
// - Path traversal via a crafted filename (e.g. "../../etc/passwd")
// - Storage exhaustion via unlimited file size

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const filename = file.name; // used directly, no sanitization

  const buffer = await file.arrayBuffer();

  const { data, error } = await supabaseAdmin.storage
    .from("uploads")
    .upload(filename, buffer);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ path: data.path });
}

// A correct version validates type, size, and generates a safe filename:
//
// const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
// const MAX_SIZE = 5 * 1024 * 1024; // 5MB
//
// if (!ALLOWED_TYPES.includes(file.type)) {
//   return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
// }
// if (file.size > MAX_SIZE) {
//   return NextResponse.json({ error: "File too large" }, { status: 400 });
// }
// const safeFilename = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
