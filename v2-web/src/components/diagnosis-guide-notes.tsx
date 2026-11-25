import type { DiagnosisQuestion } from "@/types/diagnosis";

/**
 * Display-only explanations from A's draft (SF6DNA_DIAG_TRAINING_UX_DRAFT_20261125, priority A1/A2).
 * Does not change questions, options, scoring, recommendations or what is saved: it only reads the
 * question text and option labels that are already shown.
 */
const TERMS: readonly { match: RegExp; text: string }[] = [
  { match: /確定反撃|確反/, text: "確定反撃（確反）：相手の技をガードした後、こちらの攻撃が必ず間に合う反撃のことです。" },
  { match: /Dリバーサル|ドライブリバーサル/, text: "Dリバーサル：ガード中にドライブゲージを使って出す反撃です。" },
  { match: /シミー/, text: "シミー：投げると見せて少し下がり、相手の投げ抜けを空振りさせて反撃する攻めです。" },
  { match: /バーンアウト/, text: "バーンアウト：ドライブゲージを使い切った状態です。" },
  { match: /リーサル/, text: "リーサル：残り体力を倒し切れる場面のことです。" },
];

export function DiagnosisQuestionNotes({ question }: { question: DiagnosisQuestion }) {
  const source = `${question.prompt} ${question.helpText ?? ""}`;
  const terms = TERMS.filter(term => term.match.test(source));
  // Name the real option: labels differ by diagnosis (e.g. 「よくわからない / 意識できていない」「よくわからない / 未意識」).
  const unknown = question.options.find(option => option.value === "unknown");
  if (!terms.length && !unknown) return null;
  return <div className="diagnosis-question-notes">
    {terms.length ? <dl className="diagnosis-terms" aria-label="用語の説明">{terms.map(term => {
      const [name, body] = term.text.split("：");
      return <div key={name}><dt>{name}</dt><dd>{body}</dd></div>;
    })}</dl> : null}
    {unknown ? <p className="muted">分からない・意識したことがない場合は「{unknown.label}」を選んでください。その項目の練習の優先度が上がります。</p> : null}
  </div>;
}

/** Scene hints for the top improvement items (A2). Text is a shortened form of the result page's practice notes. */
const SCENE_HINTS: Readonly<Record<string, string>> = {
  anti_air: "相手が飛べる距離で、地上の技を振りすぎていないか。",
  drive_rush_defense: "近いラッシュはまずガード。止める技は届く距離だけ。",
  impact_response: "技を振っていない時に見えたら、インパクトで返す。",
  punish: "よく受ける技を1つ決め、ガード後に反撃が入るか確かめる。",
};

export function ImprovementResultGuide({ axes, labelOf }: { axes: readonly string[]; labelOf: (axis: string) => string }) {
  const hints = axes.filter(axis => SCENE_HINTS[axis]);
  return <div className="diagnosis-result-guide">
    <h3>結果の読み方</h3>
    <ul>
      <li>この結果は、あなたの自己評価から「練習する順番」を出したものです。実際の操作の上手さや反応速度は測っていません。</li>
      <li>「よくわからない・意識できていない」と答えた項目は、「苦手」と答えた項目より優先して表示されます。</li>
    </ul>
    {hints.length ? <><h4>試合で意識すること</h4><ul>{hints.map(axis => <li key={axis}><strong>{labelOf(axis)}</strong>：{SCENE_HINTS[axis]}</li>)}</ul></> : null}
  </div>;
}
