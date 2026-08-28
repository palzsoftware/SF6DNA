import Link from "next/link";
import { getSupabaseAuthServerClient } from "@/lib/supabase/auth-server";

export const metadata = { title: "管理" };

const ADMIN_SECTIONS = [
  ["データ投入状況", "/admin/data-status"],
  ["データ品質", "/admin/data-quality"],
  ["キャラクター", "/admin/characters"],
  ["キャラクター適性マッピング", "/admin/character-traits"],
  ["技・フレーム", "/admin/moves"],
  ["コンボ", "/admin/content/combos"],
  ["セットプレイ", "/admin/content/setups"],
  ["連携", "/admin/content/sequences"],
  ["対策", "/admin/content/counters"],
  ["トレーニング", "/admin/content/trainings"],
  ["プレイヤー", "/admin/reference/players"],
  ["大会", "/admin/reference/tournaments"],
  ["動画", "/admin/reference/videos"],
  ["用語", "/admin/reference/glossary"],
  ["関連データ", "/admin/relations"],
  ["Patch・Source", "/admin/sources"],
  ["診断", "/admin/diagnoses"],
] as const;

export default async function AdminPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return <AdminMessage title="未設定" body="Supabase環境変数が設定されていません。" />;
  }

  const supabase = await getSupabaseAuthServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <AdminMessage
        title="ログインが必要です"
        body="管理機能は認証済み管理者だけが利用できます。"
        action={<Link className="button-primary inline-button" href="/auth">ログイン</Link>}
      />
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, display_name")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return <AdminMessage title="権限がありません" body="このアカウントには管理者権限が付与されていません。" />;
  }

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">ADMIN</p>
        <h1>管理ダッシュボード</h1>
        <p>{profile.display_name ? `${profile.display_name} としてログイン中。` : "管理者としてログイン中。"} 公開前にPatch・Source・検証状態を確認します。</p>
      </section>
      <section className="card-grid">
        {ADMIN_SECTIONS.map(([label, href]) => (
          <Link className="feature-card" href={href} key={href}>
            <h3>{label}</h3>
            <span>管理 →</span>
          </Link>
        ))}
      </section>
    </div>
  );
}

function AdminMessage({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero"><p className="eyebrow">ADMIN</p><h1>管理機能</h1></section>
      <section className="data-notice"><h2>{title}</h2><p>{body}</p>{action}</section>
    </div>
  );
}
