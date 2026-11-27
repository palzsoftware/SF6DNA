/**
 * プレイスタイル／キャラ適性・総合診断の「傾向」12軸の説明（表示専用）。
 *
 * - 採点・推薦・保存の値は使わず、軸キーから文を引くだけ。軸キーは diagnosis-axis-labels.ts と同じ。
 * - 自己申告の好みの説明であり、強さ・上手さ・相性を判定しない。ゲーム内の性能や数値の主張は含めない。
 * - 文案の元: Claude C の V36 候補（docs/v36/diagnosis-style-axis-copy-candidate.json）を A がレビューし、
 *   「試合後に振り返る問い」を追加した版（2026-11-27）。
 */

export type StyleAxisKey =
  | "aggression" | "patience" | "keepout" | "rushdown" | "grappling" | "setup"
  | "footsies" | "mobility" | "simplicity" | "technicality" | "defense_preference" | "explosive";

export type StyleAxisGuide = {
  /** どんな好みを示す軸か（断定しない言い方）。 */
  meaning: string;
  /** 次の対戦で1つだけ試すこと。 */
  tryNext: string;
  /** 試合後に自分で答える問い（答えは保存しない）。 */
  reviewQuestion: string;
};

export const STYLE_AXIS_DISCLAIMER =
  "回答から見えた「好みの戦い方」の説明です。強さや上手さ、キャラとの相性を判定するものではありません。";

export const STYLE_AXIS_GUIDE: Readonly<Record<StyleAxisKey, StyleAxisGuide>> = {
  aggression: {
    meaning: "自分から前に出て、主導権を取る戦い方を好む傾向です。",
    tryNext: "前に出る前に「近づいたら何を出すか」を1つ決めてから近づいてみましょう。",
    reviewQuestion: "前に出たあと、決めていた行動を出せた場面はありましたか？",
  },
  patience: {
    meaning: "相手を見て、待ってから対応する戦い方を好む傾向です。",
    tryNext: "待っている間に見るもの（相手のよく使う技・距離）を1つに決めてみましょう。",
    reviewQuestion: "待っている間に、相手の癖を1つ見つけられましたか？",
  },
  keepout: {
    meaning: "離れた距離から相手を動かす戦い方を好む傾向です。",
    tryNext: "距離を保てた場面と、詰められた場面を1つずつ見比べてみましょう。",
    reviewQuestion: "詰められたとき、直前に自分は何をしていましたか？",
  },
  rushdown: {
    meaning: "近い距離で攻め続ける戦い方を好む傾向です。",
    tryNext: "攻めが止まった場面を1つ選び、相手が何をして止めたかを確認しましょう。",
    reviewQuestion: "攻めが止まったのは、ガードされた後・割り込まれた後のどちらが多かったですか？",
  },
  grappling: {
    meaning: "投げやコマンド投げを勝ち筋にする戦い方を好む傾向です。",
    tryNext: "投げが通った場面と、投げを抜けられた場面を1つずつ振り返ってみましょう。",
    reviewQuestion: "投げを狙う前に、相手にガードさせる行動を入れられていましたか？",
  },
  setup: {
    meaning: "決まった手順で有利な状況を作る戦い方を好む傾向です。",
    tryNext: "手順を1つに絞り、相手の守り方に合わせて続きを変えられるか試してみましょう。",
    reviewQuestion: "手順のあと、相手の守り方を見て次の行動を変えられましたか？",
  },
  footsies: {
    meaning: "地上の間合いで技を出し合う戦い方を好む傾向です。",
    tryNext: "よく当たる距離と、空振りする距離を1つずつ言葉にしてみましょう。",
    reviewQuestion: "空振りした技は、どの距離で出していましたか？",
  },
  mobility: {
    meaning: "動き回って位置を変える戦い方を好む傾向です。",
    tryNext: "動いた後に何をするかを1つ決め、移動だけで終わらないようにしてみましょう。",
    reviewQuestion: "移動したあと、決めていた行動につなげられましたか？",
  },
  simplicity: {
    meaning: "操作が分かりやすく、判断に集中できることを重視する傾向です。",
    tryNext: "使う技を少しに絞り、それぞれを出す場面を1つずつ決めてみましょう。",
    reviewQuestion: "決めた技を、決めた場面で出せましたか？",
  },
  technicality: {
    meaning: "操作が難しくても、選択肢が多いことを重視する傾向です。",
    tryNext: "選択肢を増やす前に、1つの行動を安定させる練習の時間も取りましょう。",
    reviewQuestion: "試合中に、使いたかったのに出せなかった行動はありましたか？",
  },
  defense_preference: {
    meaning: "守りを固めてから組み立てる戦い方を好む傾向です。",
    tryNext: "守りから攻めに切り替えるきっかけを1つ決めてみましょう。",
    reviewQuestion: "守ったあと、攻めに切り替えられた場面はありましたか？",
  },
  explosive: {
    meaning: "少ない機会で一気に流れを変える戦い方を好む傾向です。",
    tryNext: "流れを変えに行く場面を1つ決め、失敗したときの立て直し方も考えてみましょう。",
    reviewQuestion: "流れを変えに行って失敗したあと、立て直せましたか？",
  },
};

export function isStyleAxisKey(value: unknown): value is StyleAxisKey {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(STYLE_AXIS_GUIDE, value);
}

/** 軸キーの一覧から、説明のある軸だけを並び順を保って返す（重複は除く）。 */
export function listStyleAxisGuides(keys: readonly unknown[]): Array<{ key: StyleAxisKey } & StyleAxisGuide> {
  const seen = new Set<string>();
  const out: Array<{ key: StyleAxisKey } & StyleAxisGuide> = [];
  for (const key of keys) {
    if (!isStyleAxisKey(key) || seen.has(key)) continue;
    seen.add(key);
    out.push({ key, ...STYLE_AXIS_GUIDE[key] });
  }
  return out;
}
