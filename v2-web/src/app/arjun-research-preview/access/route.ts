import { NextRequest, NextResponse } from "next/server";
import { arjunPreviewQaEnabled, correctArjunQaPassword, createArjunQaToken, arjunQaCookie } from "@/lib/arjun-preview-qa-auth";
export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  if (!arjunPreviewQaEnabled()) return new NextResponse("Not Found", { status: 404 });
  // The credential is never accepted in URL/query strings or persisted.
  if (!request.headers.get("content-type")?.startsWith("application/x-www-form-urlencoded")) {
    return new NextResponse("Unsupported Media Type", { status: 415 });
  }
  const body = await request.formData();
  const candidate = body.get("password");
  if (typeof candidate !== "string" || candidate.length > 256 || !correctArjunQaPassword(candidate)) {
    return new NextResponse("認証できません", { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  const response = NextResponse.redirect(new URL("/arjun-research-preview", request.url), 303);
  response.cookies.set(arjunQaCookie.name, createArjunQaToken(), {
    httpOnly: true, secure: true, sameSite: "strict", path: "/arjun-research-preview", maxAge: arjunQaCookie.maxAge,
  });
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
