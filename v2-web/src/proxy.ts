import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  try {
    decodeURIComponent(request.nextUrl.pathname);
  } catch {
    // Fixed content only: never echo the submitted URL or internal error.
    return new NextResponse('<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>URLを読み取れませんでした | SF6DNA</title></head><body><main style="max-width:640px;margin:48px auto;padding:24px;overflow-wrap:anywhere"><p>400 Bad Request</p><h1>URLを読み取れませんでした</h1><p>URLを確認して、もう一度お試しください。</p><a href="/" style="display:inline-block;padding:12px 0">トップページへ戻る</a></main></body></html>', {
      status: 400,
      headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex", "Content-Type": "text/html; charset=utf-8" },
    });
  }
  // Validate first, then preserve the former image-extension auth bypass.
  // A resource slug can look like an image filename, including malformed encoding.
  if (/\.(?:svg|png|jpg|jpeg|gif|webp)$/.test(request.nextUrl.pathname)) {
    return NextResponse.next({ request });
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
