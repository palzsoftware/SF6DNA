/**
 * 15分練習（15種）の初心者向け補足（表示専用）。
 *
 * - 既存の「仮目標」（daily-training-details.ts の successCondition）は変更しない。ここは仮目標の手前の段階だけを書く。
 * - 練習の選び方・保存・診断の採点や推薦には関与しない。フォーカスキーは daily-training の ImprovementFocus と同じ15種。
 * - 「10回中5回」「2回連続」などは SF6DNA の練習の目安で、ゲーム公式の基準ではない（BEGINNER_GOAL_NOTICE で明示）。
 * - ダミー準備の言い方は CAPCOM 公式Webマニュアルの名称（レコード設定・スロット・レコード再生開始・簡単練習設定）に合わせる。
 *   機種ごとのボタン名・メニュー階層はゲーム内で未確認のため書かない。
 * - 元: Claude C の V36 候補（docs/v36/training-beginner-goal-candidate.json）を A がフォーカス別に具体化（2026-11-27）。
 */

export type PracticeFocusKey =
  | "anti_air" | "drive_rush_defense" | "impact_response" | "punish" | "defense" | "offense"
  | "execution" | "neutral" | "corner_defense" | "decision"
  | "meter" | "matchup" | "knowledge" | "habit" | "review";

export type PracticeBeginnerGoal = {
  /** 回数で数える練習か、説明できれば達成の練習か。 */
  kind: "count" | "explain";
  /** 最初の1〜2分でやる、いちばん簡単な形。 */
  firstStep: string;
  /** 仮目標の手前の目安。 */
  beginnerTarget: string;
  /** ダミー（相手役）の準備を、公式の名称でやさしく言い換えたもの。不要な練習は null。 */
  dummyPlain: string | null;
  /** うまくいかないときに、まず見る1点。 */
  firstCheck: string;
};

export const BEGINNER_GOAL_NOTICE =
  "回数の目安はSF6DNA独自の推奨練習目安で、ゲーム公式の基準ではありません。できたら、カードにある仮目標へ進みます。";

const COUNT_TARGET = "まずは10回中5回を目安にします。数えにくいときは、2回続けて狙いどおりにできたら次へ進みます。";
const RECORD_ONE = (what: string) =>
  `相手役の動きは「レコード設定」で記録します。${what}を1つ記録し、そのスロットだけをONにして「レコード再生開始」で再生します。`;

export const PRACTICE_BEGINNER_GOALS: Readonly<Record<PracticeFocusKey, PracticeBeginnerGoal>> = {
  anti_air: {
    kind: "count",
    firstStep: "前ジャンプ攻撃だけを再生し、対空技を1つに決めて出すことだけに集中します。",
    beginnerTarget: COUNT_TARGET,
    dummyPlain: RECORD_ONE("前ジャンプ攻撃"),
    firstCheck: "相手が飛ぶ前にボタンを押していないかを見ます。",
  },
  drive_rush_defense: {
    kind: "count",
    firstStep: "最初はラッシュから出る打撃をガードするだけにして、技で止めるのは慣れてからにします。",
    beginnerTarget: COUNT_TARGET,
    dummyPlain: RECORD_ONE("ドライブラッシュからの打撃"),
    firstCheck: "近い距離でボタンを押して、相手の打撃に負けていないかを見ます。",
  },
  impact_response: {
    kind: "count",
    firstStep: "インパクトだけを再生し、自分は何も振らずに待ってから返します。",
    beginnerTarget: COUNT_TARGET,
    dummyPlain: RECORD_ONE("ドライブインパクト"),
    firstCheck: "自分が技を出している最中ではなかったかを見ます。",
  },
  punish: {
    kind: "count",
    firstStep: "反撃が入ると確認できている技を1つだけ選び、ガードしたあとの反撃技も1つに決めます。",
    beginnerTarget: COUNT_TARGET,
    dummyPlain: "相手役の技は「レコード設定」で記録します。確認済みの技を1つだけ記録し、自分はガードを続けてから反撃します。",
    firstCheck: "反撃が入るか確認していない技に、反撃していないかを見ます。",
  },
  defense: {
    kind: "count",
    firstStep: "起き上がりは、まず打撃をガードするだけに決めて始めます。",
    beginnerTarget: COUNT_TARGET,
    dummyPlain: RECORD_ONE("同じダウンからの打撃"),
    firstCheck: "毎回ちがう守り方を試していないかを見ます。",
  },
  offense: {
    kind: "count",
    firstStep: "起き攻めは、打撃か投げのどちらか1つだけを予定どおりに出す練習から始めます。",
    beginnerTarget: COUNT_TARGET,
    dummyPlain: null,
    firstCheck: "毎回同じダウン・同じ位置から始められているかを見ます。",
  },
  execution: {
    kind: "count",
    firstStep: "成立を確認できた短いコンボを1つ選び、まず片側だけで練習します。",
    beginnerTarget: COUNT_TARGET,
    dummyPlain: null,
    firstCheck: "途切れたのが何発目かを、入力履歴で1か所だけ確認します。",
  },
  neutral: {
    kind: "count",
    firstStep: "相手役は動かさず、けん制技を1つ決めて、床の目印の距離で出すだけにします。",
    beginnerTarget: COUNT_TARGET,
    dummyPlain: null,
    firstCheck: "目印の距離まで歩いてから出しているかを見ます。",
  },
  corner_defense: {
    kind: "count",
    firstStep: "画面端で、まず打撃をガードするだけに決めて始めます。",
    beginnerTarget: COUNT_TARGET,
    dummyPlain: RECORD_ONE("画面端の同じダウンからの打撃"),
    firstCheck: "ガードの途中でジャンプして逃げようとしていないかを見ます。",
  },
  decision: {
    kind: "count",
    firstStep: "前ジャンプだけを再生して合図に慣れてから、前歩きを混ぜます。",
    beginnerTarget: COUNT_TARGET,
    dummyPlain: "相手役の動きは「レコード設定」で記録します。前ジャンプと前歩きを別のスロットに記録し、両方をONにするとランダムに再生されます。",
    firstCheck: "相手が動く前に、再生の順番を読んで押していないかを見ます。",
  },
  meter: {
    kind: "explain",
    firstStep: "ドライブゲージかSAゲージのどちらか1つだけを選んで振り返ります。",
    beginnerTarget: "使った理由か、残した理由を1つ説明できれば十分です。",
    dummyPlain: null,
    firstCheck: "ゲージを使った直後に、状況がどう変わったかを見ます。",
  },
  matchup: {
    kind: "explain",
    firstStep: "困った相手の技を1つだけ選び、どんな場面で困ったかを書き出します。",
    beginnerTarget: "「何をされて」「どう負けたか」を1つ説明できれば十分です。",
    dummyPlain: null,
    firstCheck: "練習の条件（キャラ・位置・距離）が、困った場面とそろっているかを見ます。",
  },
  knowledge: {
    kind: "explain",
    firstStep: "分からなかった場面を1つだけ選び、調べたいことを1文で書きます。",
    beginnerTarget: "調べたことを1点説明できるか、まだ分からない条件を1つ挙げられれば十分です。",
    dummyPlain: null,
    firstCheck: "調べている途中で、最初の疑問から離れていないかを見ます。",
  },
  habit: {
    kind: "explain",
    firstStep: "繰り返してしまった行動を1つだけ選びます。",
    beginnerTarget: "場面と、次に試す行動を1つずつ言えれば十分です。",
    dummyPlain: null,
    firstCheck: "同じ行動をすべて悪い癖だと決めつけていないかを見ます。",
  },
  review: {
    kind: "explain",
    firstStep: "今日の練習で、うまくいった場面とうまくいかなかった場面を1つずつ選びます。",
    beginnerTarget: "次回も続けることを1つ決められれば十分です。",
    dummyPlain: null,
    firstCheck: "結果だけでなく、その前に何をしていたかを見ます。",
  },
};

export function isPracticeFocusKey(value: unknown): value is PracticeFocusKey {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(PRACTICE_BEGINNER_GOALS, value);
}

export function getPracticeBeginnerGoal(focus: unknown): PracticeBeginnerGoal | null {
  return isPracticeFocusKey(focus) ? PRACTICE_BEGINNER_GOALS[focus] : null;
}
