/**
 * Display-only notes from A's draft (SF6DNA_DIAG_TRAINING_UX_DRAFT_20261125, A3/A4) for the 15-minute practice.
 * The menu selection (5 minutes x 3) and saved progress are unchanged. Steps come from CAPCOM's official web manual;
 * they are not checked in the game, and button names for platforms other than PS5 are not shown.
 */
const MANUAL = {
  practice: "https://game.capcom.com/manual/SF6/ja/ps5/page/6/3",
  record: "https://game.capcom.com/manual/SF6/ja/ps5/page/8/6",
};

export function DailyTrainingSetupGuide({ fromDiagnosis }: { fromDiagnosis: boolean }) {
  return <div className="daily-training-setup-guide">
    {fromDiagnosis ? <p>2・3つ目は、毎日入れ替わる基礎メニューです（診断の2位・3位とは別です）。</p> : null}
    <details>
      <summary>トレーニングモードの共通準備（全メニュー共通）</summary>
      <ol>
        <li>トレーニングを開きます（ファイティンググラウンド＞プラクティス＞トレーニング）。細かい設定が不要なら「簡単練習設定」も使えます。</li>
        <li>OPTIONSボタン（PS5の場合）でメニューを開き、「レコード設定」で相手の動きを記録します。記録は8個までです。</li>
        <li>再生設定で使うスロットだけをONにし、「レコード再生開始」で再生します。複数ONにするとランダムに再生されます。</li>
        <li>毎回同じ位置から始めるため、「基本設定＞ショートカット操作設定」でバトル再スタートとレコード再生をボタンに割り当てます。</li>
      </ol>
      <p className="muted">出典：CAPCOM公式Webマニュアル（<a href={MANUAL.practice} target="_blank" rel="noopener noreferrer">プラクティス</a>／<a href={MANUAL.record} target="_blank" rel="noopener noreferrer">レコード設定Tips</a>）。ゲーム内での確認は済んでいません。PS5以外のボタン名は確認中です。</p>
    </details>
  </div>;
}
