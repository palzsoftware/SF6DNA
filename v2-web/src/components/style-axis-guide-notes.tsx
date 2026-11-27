import { listStyleAxisGuides, STYLE_AXIS_DISCLAIMER } from "@/lib/style-axis-guide";

/**
 * 傾向12軸の説明（表示専用）。採点・推薦・保存・通信は持たない。
 * 接続先（承認後）: diagnosis-runner.tsx のプレイスタイル／キャラ適性／総合診断の傾向リストの直後。
 */
export function StyleAxisGuideNotes({ axes, labelOf, limit = 3 }: {
  axes: readonly unknown[];
  labelOf: (key: string) => string;
  limit?: number;
}) {
  const guides = listStyleAxisGuides(axes).slice(0, Math.max(0, limit));
  if (!guides.length) return null;
  return <div className="style-axis-guide-notes">
    <h3>傾向の読み方と次の一歩</h3>
    <p className="muted">{STYLE_AXIS_DISCLAIMER}</p>
    <dl>
      {guides.map((guide) => <div key={guide.key}>
        <dt>{labelOf(guide.key)}</dt>
        <dd>
          <p>{guide.meaning}</p>
          <p><strong>次に試すこと：</strong>{guide.tryNext}</p>
          <p className="muted">試合後の振り返り：{guide.reviewQuestion}</p>
        </dd>
      </div>)}
    </dl>
  </div>;
}
