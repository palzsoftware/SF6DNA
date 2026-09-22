import { NextResponse } from "next/server";
import { validateContactPayload, type ContactPayload } from "@/lib/contact-form";

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = await request.json() as ContactPayload;
  } catch {
    return NextResponse.json({ ok: false, message: "入力内容を読み取れませんでした。" }, { status: 400 });
  }

  const validation = validateContactPayload(payload);
  if (!validation.ok) return NextResponse.json(validation, { status: 400 });

  return NextResponse.json(
    { ok: false, code: "delivery_not_configured", message: "サイト内送信は現在接続準備中です。メールでお問い合わせください。" },
    { status: 503, headers: { "Retry-After": "86400" } },
  );
}
