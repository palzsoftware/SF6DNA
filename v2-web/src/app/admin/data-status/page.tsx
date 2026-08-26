import { redirect } from "next/navigation";
import { getSupabaseAuthServerClient } from "@/lib/supabase/auth-server";

export const metadata = { title: "データ投入状況 | SF6DNA Admin" };

type CountRow = {
  label: string;
  table: string;
  published?: boolean;
};

const COUNT_ROWS: CountRow[] = [
  { label: "キャラクター", table: "characters" },
  { label: "技", table: "moves" },
  { label: "フレームデータ", table: "move_frame_data" },
  { label: "コンボ", table: "combos" },
  { label: "セットプレイ", table: "setups" },
  { label: "連携", table: "sequences" },
  { label: "対策", table: "counters" },
  { label: "トレーニング", table: "trainings" },
  { label: "プレイヤー", table: "players" },
  { label: "大会", table: "tournaments" },
  { label: "試合", table: "matches" },
  { label: "動画", table: "videos" },
  { label: "用語", table: "glossary" },
  { label: "診断", table: "diagnoses" },
  { label: "出典", table: "sources" },
  { label: "パッチ", table: "patches" },
];

export default async function AdminDataStatusPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect("/admin");
  }

  const supabase = await getSupabaseAuthServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") redirect("/admin");

  const counts = await Promise.all(
    COUNT_ROWS.map(async ({ label, table }) => {
      const { count, error } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });
      return { label, table, count: count ?? 0, error: error?.message ?? null };
    })
  );

  const { data: currentPatch } = await supabase
    .from("patches")
    .select("version_label, name, released_at")
    .eq("is_current", true)
    .maybeSingle();

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">ADMIN / DATA STATUS</p>
        <h1>データ投入状況</h1>
        <p>各テーブルの実件数を確認し、空の領域を「実装済み」と誤認しないための管理画面です。</p>
      </section>

      <section className="info-panel">
        <h2>Current Patch</h2>
        {currentPatch ? (
          <p><strong>{currentPatch.name ?? currentPatch.version_label}</strong> <span className="muted">({currentPatch.version_label})</span></p>
        ) : <p className="muted">Current Patch未設定</p>}
      </section>

      <section className="data-status-grid">
        {counts.map((item) => (
          <article className="info-panel" key={item.table}>
            <p className="eyebrow">{item.table}</p>
            <h2>{item.label}</h2>
            {item.error ? <p>取得エラー: {item.error}</p> : <p className="data-count">{item.count.toLocaleString()} 件</p>}
          </article>
        ))}
      </section>
    </div>
  );
}
