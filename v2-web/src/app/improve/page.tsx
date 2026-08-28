import type { Metadata } from "next";
import Link from "next/link";
import { ImprovementLoopTool } from "@/components/improvement-loop-tool";
import { listCharacters } from "@/lib/characters";

export const metadata: Metadata = {
  title: "上達ループ | SF6DNA",
  description: "対戦ログ、直近10戦レビュー、弱点分析、Replay復習を一つの流れで管理します。",
};

export default async function ImprovePage() {
  const characters = await listCharacters();
  if (!characters.length) {
    return (
      <div className="site-shell page-stack">
        <section className="empty-state">
          <h1>上達ループを読み込めません</h1>
          <p>公開済みキャラクターデータを取得できません。接続状態を確認して再読み込みしてください。</p>
          <p><Link href="/tools">ツール一覧へ戻る</Link></p>
        </section>
      </div>
    );
  }

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">Improvement Loop</p>
        <h1>上達ループ</h1>
        <p>対戦後30秒ログから弱点を集計し、TrainingとReplay復習へつなげます。記録はこのブラウザ内に保存されます。</p>
        <p><Link href="/tools">ツール一覧へ戻る</Link></p>
      </section>
      <ImprovementLoopTool characters={characters} />
    </div>
  );
}
