import { NextResponse } from "next/server";
import { validateContactPayload, type ContactPayload } from "@/lib/contact-form";
import { getSupabaseAuthServerClient } from "@/lib/supabase/auth-server";

const MAX_REQUEST_BYTES = 16_384;

function requesterKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || request.headers.get("x-real-ip")?.trim() || "unknown";
}

function hasForeignOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host !== new URL(request.url).host;
  } catch {
    return true;
  }
}

export async function POST(request: Request) {
  if (hasForeignOrigin(request)) {
    return NextResponse.json({ ok: false, message: "送信元を確認できませんでした。" }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ ok: false, message: "入力内容が大きすぎます。" }, { status: 413 });
  }

  let payload: ContactPayload;

  try {
    payload = await request.json() as ContactPayload;
  } catch {
    return NextResponse.json({ ok: false, message: "入力内容を読み取れませんでした。" }, { status: 400 });
  }

  const validation = validateContactPayload(payload);
  if (!validation.ok) return NextResponse.json(validation, { status: 400 });

  try {
    const supabase = await getSupabaseAuthServerClient();
    const { data, error } = await supabase.rpc("submit_contact", {
      p_category: validation.value.category,
      p_message: validation.value.message,
      p_reply_email: validation.value.email,
      p_target_url: validation.value.targetUrl,
      p_requester_key: requesterKey(request),
    });

    if (error) {
      if (error.message.includes("contact_rate_limited")) {
        return NextResponse.json(
          { ok: false, code: "rate_limited", message: "短時間に送信できる回数を超えました。時間をおいてお試しください。" },
          { status: 429, headers: { "Retry-After": "600" } },
        );
      }
      if (error.message.includes("contact_invalid_")) {
        return NextResponse.json({ ok: false, message: "入力内容を確認してください。" }, { status: 400 });
      }
      console.error("[contact] Supabase RPC failed", { code: error.code });
      return NextResponse.json(
        { ok: false, code: "delivery_failed", message: "送信できませんでした。時間をおいてもう一度お試しください。" },
        { status: 503, headers: { "Retry-After": "60" } },
      );
    }

    return NextResponse.json({ ok: true, requestId: data, message: "お問い合わせを受け付けました。" }, { status: 201 });
  } catch {
    return NextResponse.json(
      { ok: false, code: "delivery_failed", message: "送信できませんでした。時間をおいてもう一度お試しください。" },
      { status: 503, headers: { "Retry-After": "60" } },
    );
  }
}
