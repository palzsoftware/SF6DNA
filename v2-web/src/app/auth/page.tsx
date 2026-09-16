import type { Metadata } from "next";
import { LogoutButton } from "@/components/logout-button";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "ログイン",
  robots: { index: false, follow: false, noarchive: true },
};

function getSafeNextPath(next: string | string[] | undefined) {
  const candidate = Array.isArray(next) ? next[0] : next;
  return candidate?.startsWith("/") && !candidate.startsWith("//") ? candidate : "/";
}

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  const nextPath = getSafeNextPath(next);

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">ACCOUNT</p>
        <h1>ログイン</h1>
        <p>ログインすると、完了した診断結果をアカウントに保存できます。お気に入りやランク記録など、端末内保存の機能は別の端末へ自動同期されません。</p>
      </section>
      <section className="info-panel auth-panel">
        <AuthForm nextPath={nextPath} />
        <LogoutButton />
      </section>
    </div>
  );
}
