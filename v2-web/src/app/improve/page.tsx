import type { Metadata } from "next";
import Link from "next/link";
import { ImprovementLoopTool } from "@/components/improvement-loop-tool";
import { DataSourceUnavailableError } from "@/lib/data-source-error";
import { listCharacters } from "@/lib/repositories/app-repository";

export const metadata: Metadata = {
  title: "上達ループ | SF6DNA",
  description: "対戦ログ、直近10戦レビュー、弱点分析、Replay復習を一つの流れで管理します。",
};

export default async function ImprovePage() {
  try {
    const characters = await listCharacters();
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
  } catch (error) {
    if (error instanceof DataSourceUnavailableError) {
      return (
        <div className="site-shell page-stack">
          <section className="empty-state">
            <h1>上達ループを読み込めません</h1>
            <p>キャラクターデータへ接続できません。接続状態を確認して再読み込みしてください。</p>
          </section>
        </div>
      );
    }
    throw error;
  }
}
