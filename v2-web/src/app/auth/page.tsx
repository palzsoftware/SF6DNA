import type { Metadata } from "next";
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
        <p>ログイン後は、診断履歴・お気に入り・練習履歴などの同期機能を段階的に利用できるようにします。</p>
      </section>
      <section className="info-panel auth-panel">
        <AuthForm nextPath={nextPath} />
      </section>
    </div>
  );
}
