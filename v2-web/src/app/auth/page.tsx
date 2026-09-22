import type { Metadata } from "next";
import { LogoutButton } from "@/components/logout-button";
import { AuthForm } from "@/components/auth-form";
import { getSupabaseAuthServerClient } from "@/lib/supabase/auth-server";

export const metadata: Metadata = {
  title: "ログイン",
  robots: { index: false, follow: false, noarchive: true },
};

function getSafeNextPath(next: string | string[] | undefined) {
  const candidate = Array.isArray(next) ? next[0] : next;
  return candidate?.startsWith("/") && !candidate.startsWith("//") ? candidate : "/";
}

function isMissingSessionError(error: { name?: string; message?: string } | null) {
  return Boolean(error && (error.name === "AuthSessionMissingError" || /session missing/i.test(error.message ?? "")));
}

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  const nextPath = getSafeNextPath(next);
  let accountEmail: string | null = null;
  let authCheckFailed = false;

  try {
    const supabase = await getSupabaseAuthServerClient();
    const { data, error } = await supabase.auth.getUser();
    authCheckFailed = Boolean(error) && !isMissingSessionError(error);
    accountEmail = error ? null : data.user?.email ?? null;
  } catch {
    authCheckFailed = true;
  }

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">ACCOUNT</p>
        <h1>ログイン</h1>
        <p>ログインすると、診断結果をアカウントに保存できます。お気に入りやランク記録は、この端末のブラウザに保存されるため、別の端末には自動で引き継がれません。</p>
      </section>
      <section className="info-panel auth-panel">
        {accountEmail ? (
          <div className="auth-form">
            <div><strong>ログイン中</strong><p className="muted">{accountEmail}</p></div>
            <LogoutButton />
          </div>
        ) : (
          <>
            {authCheckFailed ? <p className="data-notice">ログイン状態を確認できませんでした。再読み込みしてからもう一度お試しください。</p> : null}
            <AuthForm nextPath={nextPath} />
          </>
        )}
      </section>
    </div>
  );
}
