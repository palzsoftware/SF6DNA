import { AuthForm } from "@/components/auth-form";

export const metadata = { title: "ログイン | SF6DNA" };

export default function AuthPage() {
  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">ACCOUNT</p>
        <h1>ログイン</h1>
        <p>ログイン後は、診断履歴・お気に入り・練習履歴などの同期機能を段階的に利用できるようにします。</p>
      </section>
      <section className="info-panel auth-panel">
        <AuthForm />
      </section>
    </div>
  );
}
