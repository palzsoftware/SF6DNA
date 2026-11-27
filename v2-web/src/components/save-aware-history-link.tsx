import Link from "next/link";

/**
 * 診断結果画面の「診断履歴を見る」ボタン（表示専用）。
 * 保存処理・重複防止・採点には関与せず、既存の保存状態（databaseSaveStatus）を読むだけ。
 * - saving: 保存が終わる前に履歴を開くと新しい結果がまだ出ないため、短い注意を添える。
 * - failed: 上の保存エラー表示（再試行ボタン付き）と重ならないよう、履歴に出ない理由だけを1文で添える。
 * - saved / idle / ゲスト: 既存の保存状況の表示で足りるため、何も添えない（保存完了前に「保存済み」とは言わない）。
 */
export type HistoryLinkSaveStatus = "idle" | "saving" | "saved" | "failed";

export function historyLinkNote(status: HistoryLinkSaveStatus, guest: boolean): string | null {
  if (guest) return null;
  if (status === "saving") return "保存中です。保存が終わってから開くと、この結果が履歴に表示されます。";
  if (status === "failed") return "この結果はまだ保存できていないため、履歴には表示されません。";
  return null;
}

export function SaveAwareHistoryLink({ status, guest }: { status: HistoryLinkSaveStatus; guest: boolean }) {
  const note = historyLinkNote(status, guest);
  return <>
    <Link className="button-secondary" href="/diagnosis/history">診断履歴を見る</Link>
    {note ? <p className="muted history-link-note">{note}</p> : null}
  </>;
}
