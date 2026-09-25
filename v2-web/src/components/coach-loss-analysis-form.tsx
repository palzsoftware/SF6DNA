"use client";

import { useState } from "react";
import { holdLossAnalysis, type LossAnalysisHold, type LossAnalysisInput } from "@/lib/coach-loss-analysis";

const empty: LossAnalysisInput = {
  playerCharacter: "", opponentCharacter: "", result: "", problemScene: "", selfNoticedMistake: "", notes: "",
};

export function CoachLossAnalysisForm() {
  const [input, setInput] = useState<LossAnalysisInput>(empty);
  const [result, setResult] = useState<LossAnalysisHold | null>(null);
  function update(key: keyof LossAnalysisInput, value: string) {
    setInput((current) => ({ ...current, [key]: value }));
    setResult(null);
  }
  return <section className="info-panel" aria-labelledby="loss-analysis-heading">
    <h2 id="loss-analysis-heading">試合を振り返る</h2>
    <p>一場面を手入力して整理します。入力はこの画面内だけで処理し、保存・送信しません。リプレイ映像は解析しません。</p>
    <form className="coach-form" onSubmit={(event) => { event.preventDefault(); setResult(holdLossAnalysis(input)); }}>
      <label htmlFor="loss-player">自分のキャラ</label>
      <input id="loss-player" required maxLength={80} value={input.playerCharacter} onChange={(event) => update("playerCharacter", event.target.value)} />
      <label htmlFor="loss-opponent">相手のキャラ</label>
      <input id="loss-opponent" required maxLength={80} value={input.opponentCharacter} onChange={(event) => update("opponentCharacter", event.target.value)} />
      <label htmlFor="loss-result">勝敗</label>
      <select id="loss-result" required value={input.result} onChange={(event) => update("result", event.target.value)}>
        <option value="">選択してください</option><option value="loss">負け</option><option value="win">勝ち</option>
      </select>
      <label htmlFor="loss-scene">困った場面</label>
      <textarea id="loss-scene" required maxLength={500} value={input.problemScene} onChange={(event) => update("problemScene", event.target.value)} placeholder="例: 2ラウンド目、端を背負った場面で攻撃を受けた" />
      <label htmlFor="loss-mistake">自覚したミス（任意）</label>
      <textarea id="loss-mistake" maxLength={300} value={input.selfNoticedMistake} onChange={(event) => update("selfNoticedMistake", event.target.value)} />
      <label htmlFor="loss-notes">補足（任意）</label>
      <textarea id="loss-notes" maxLength={500} value={input.notes} onChange={(event) => update("notes", event.target.value)} />
      <button className="button-secondary" type="submit">場面を整理する</button>
    </form>
    {result?.errors.length ? <p role="alert">必須項目と文字数を確認してください。</p> : null}
    {result && !result.errors.length ? <div role="status" aria-live="polite">
      <h3>本人の記録</h3><ul>{result.observed.map((item) => <li key={item}>{item}</li>)}</ul>
      <h3>原因の仮説</h3><p>{result.hypothesis ?? "まだ入力されていません。"}</p>
      <h3>次の練習</h3><p>試合の観測と検証済みの攻略根拠が不足しているため、練習内容は保留します。</p>
      <p>{result.nextQuestion}</p>
    </div> : null}
  </section>;
}
