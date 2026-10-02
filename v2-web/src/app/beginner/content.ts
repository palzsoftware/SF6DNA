export type BeginnerStep = {
  id: string;
  title: string;
  shortTitle: string;
  label: string;
  description: string;
  tryThis: string;
  caution: string;
  media?: string;
  source: string;
};

export const beginnerSteps: readonly BeginnerStep[] = [
  { id: "move", title: "前後に歩いてみる", shortTitle: "移動", label: "MOVE", description: "相手に近づく方向が「前」、離れる方向が「後ろ」。上でジャンプ、下でしゃがみます。", tryThis: "まずは前後に歩く。左右を入れ替えて、もう一度。", caution: "このページの方向図は自分が右向きのとき。左向きなら左右が逆です。", source: "basics" },
  { id: "guard", title: "攻撃をガードする", shortTitle: "ガード", label: "GUARD", description: "後ろ入力で立ちガード、下後ろでしゃがみガード。下段にはしゃがみ、ジャンプ攻撃や中段には立ちガードを使います。", tryThis: "ゲーム内チュートリアルで、立ち・しゃがみガードを1回ずつ。", caution: "投げは通常のガードでは防げません。", media: "guard", source: "guard" },
  { id: "normal", title: "届く技を1つ見つける", shortTitle: "通常技", label: "NORMAL", description: "弱・中・強の攻撃を押して、届く距離を見てみましょう。立ち・しゃがみでも技が変わります。", tryThis: "使うキャラで弱・中・強を1回ずつ。使いやすそうな技を1つ選ぶ。", caution: "速さや届く距離は技ごとに違います。「強ならいつでも強い」わけではありません。", source: "basics" },
  { id: "throw", title: "近づいたら、投げもある", shortTitle: "投げ", label: "THROW", description: "近距離の通常投げは、ガードを続ける相手への選択肢。相手も、タイミングを合わせて投げ抜けできます。", tryThis: "ゲーム内コマンドリストで通常投げを確認し、近距離で1回。", caution: "投げ抜けができるのは通常投げ。コマンド投げとは区別します。", source: "throw" },
  { id: "anti-air", title: "ジャンプには、対空を1つ", shortTitle: "対空", label: "ANTI-AIR", description: "対空は、飛んできた相手を迎え撃つこと。まずは自分のキャラで使う対空技を1つ決めましょう。", tryThis: "ゲーム内キャラクターガイドで対空技を確認し、相手のジャンプに合わせて試す。", caution: "届く距離やタイミングは技ごとに違います。最初から毎回成功しなくて大丈夫。", media: "anti-air", source: "learning" },
  { id: "impact", title: "インパクトは、受けて打つ攻撃", shortTitle: "インパクト", label: "DI", description: "ドライブインパクトは、一部の攻撃を受け止めながら打つ攻撃。画面端では、ガードしても壁に押しつけられることがあります。", tryThis: "トレーニングで相手のインパクトに、自分のインパクトを後から返してみる。", caution: "いつでも返せるわけではありません。自分が動ける状態で、間に合うタイミングが必要です。", media: "impact", source: "drive" },
  { id: "parry", title: "パリィで攻撃を受け止める", shortTitle: "パリィ", label: "PARRY", description: "ドライブパリィは、Driveゲージを使う防御。攻撃を受け止めるとDriveゲージが回復します。", tryThis: "パリィのボタンを確認して、相手の攻撃を1回受け止める。", caution: "投げには注意。ジャストパリィの細かいタイミングは、あとで覚えれば十分です。", media: "parry", source: "drive" },
  { id: "rush", title: "ラッシュで距離を詰める", shortTitle: "ラッシュ", label: "DR", description: "ドライブパリィの構えから前を素早く2回入力すると、ドライブラッシュで近づけます。", tryThis: "相手が動かない状態で、パリィからラッシュを1回。", caution: "移動するシステムです。インパクトのように攻撃を受け止めるものではありません。", media: "rush", source: "drive-input" },
  { id: "cancel-rush", title: "技からラッシュへつなぐ", shortTitle: "キャンセルラッシュ", label: "CDR", description: "キャンセル対応の通常技からラッシュへ切り替え、次の攻撃を狙います。すべての通常技で使えるわけではありません。", tryThis: "ゲーム内ガイドで対応技を確認。まずは相手に当てて、キャンセル中に前を素早く2回。", caution: "パリィからのラッシュよりDriveゲージを多く使います。次の攻撃がコンボになるかは技と条件次第です。", media: "cancel-rush", source: "drive-input" },
  { id: "super", title: "SAの出し方を確認する", shortTitle: "スーパーアーツ", label: "SA", description: "スーパーアーツは、SAゲージを使う技。SA1・SA2・SA3のコマンドをゲーム内リストで確認しましょう。", tryThis: "まずは1種類だけ、トレーニングで出してみる。", caution: "効果や使いどころはキャラごとに違います。すべてが無敵技ではありません。", media: "super", source: "super" },
  { id: "combo", title: "コンボは、まず1つ", shortTitle: "簡単なコンボ", label: "COMBO", description: "ゲーム内コンボトライアルで、短いものを1つ試しましょう。キャラと操作タイプに合ったものを選べば十分です。", tryThis: "短いコンボを1つ練習して、実戦で1回狙う。難しければ単発の技から。", caution: "SF6DNAの基礎コンボは確認が済んだものから掲載します。今はキャラページで技を確認できます。", media: "combo", source: "learning" },
  { id: "wakeup", title: "起き上がりは、まず守る", shortTitle: "起き上がり", label: "WAKEUP", description: "倒されたあと、相手が起き上がりに攻めてくるのが「起き攻め」。迷ったら、まずガードから試しましょう。", tryThis: "起き上がりにボタンを連打せず、1回ガードしてみる。", caution: "ガードも投げには負けます。打撃・通常投げの投げ抜け・パリィ・無敵技などは、状況に合わせて少しずつ。", source: "guard" },
];

export const beginnerGlossary = [
  ["対空", "相手のジャンプを迎え撃つこと。"],
  ["キャンセル", "対応する技の動作を途中で切り替え、次の行動を出すこと。"],
  ["起き攻め", "倒れた相手の起き上がりに合わせて攻めること。"],
  ["暴れ", "相手の攻めに対して、技を出して割り込もうとすること。"],
  ["無敵技", "特定の攻撃を受けない時間がある技。性能は技ごとに違います。"],
  ["ラッシュ", "ここではドライブラッシュの略。素早く近づくシステム。"],
  ["SA", "スーパーアーツの略。Driveゲージとは別のゲージを使います。"],
] as const;

export const beginnerSources = [
  { id: "manual", title: "公式Webマニュアル", url: "https://game.capcom.com/manual/SF6/ja/ps5/page/2/3" },
  { id: "drive", title: "公式：Fighting Ground / ドライブシステム", url: "https://www.streetfighter.com/6/ja-jp/mode/fightingground" },
  { id: "learning", title: "CAPCOM：チュートリアル・キャラクターガイドの紹介", url: "https://news.capcomusa.com/2023/04/20/street-fighter-6-showcase-recap/" },
] as const;
