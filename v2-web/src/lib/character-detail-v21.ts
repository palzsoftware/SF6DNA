export type CharacterDetailV21Profile = {
  tagline: string;
  winPath: string;
  firstLesson: string;
  strength: string;
  weakness: string;
  gameplan: Array<{
    label: string;
    title: string;
    body: string;
    caution: string;
  }>;
  ranges: Array<{
    range: string;
    actions: string;
    purpose: string;
    caution: string;
  }>;
};

const profiles: Record<"ryu" | "jp", CharacterDetailV21Profile> = {
  ryu: {
    tagline: "波動拳で地上の前進を抑え、ジャンプには昇龍拳を合わせる。中距離の駆け引きから確実に攻めを始めるスタンダードタイプです。",
    winPath: "中距離で波動拳と通常技を使い分けて相手を動かし、対空や差し返しからダメージと画面位置を取ります。",
    firstLesson: "まずは波動拳を撃った後も相手のジャンプを見られる距離を保ち、飛んできたら昇龍拳で落とす流れを練習します。",
    strength: "波動拳と昇龍拳の組み合わせで地上と空中の両方を見せ、中距離から相手の行動を動かしやすい点が強みです。",
    weakness: "電刃錬気などの準備行動には時間が必要です。相手が接近できる状況では強化を急がず、対空と防御を優先します。",
    gameplan: [
      {
        label: "01 / GROUND",
        title: "波動拳で地上を動かす",
        body: "中距離では波動拳を見せ、歩きやジャンプで接近しようとする相手の反応を確認します。通常技だけに偏らず、地上と空中の両方へ意識を向けさせるのが狙いです。",
        caution: "近すぎる距離での波動拳は反撃を受けやすいため、相手との間合いを見て使います。",
      },
      {
        label: "02 / ANTI-AIR",
        title: "ジャンプは昇龍拳で迎撃する",
        body: "波動拳を越えようとするジャンプには昇龍拳を合わせます。飛び道具と対空を一組で覚えると、リュウの基本となる地上戦を作りやすくなります。",
        caution: "対空を狙うときは、無理に前へ出ず入力できる距離を保ちます。",
      },
      {
        label: "03 / CONVERT",
        title: "触れたら確認済みコンボへ",
        body: "通常技が当たったときは、下のコンボ候補から用途と消費ゲージが合うものを選びます。まずは短く安定するルートから確認します。",
        caution: "成立条件やPatchが未確認の候補はPublicには出しません。",
      },
    ],
    ranges: [
      { range: "遠距離", actions: "波動拳", purpose: "前進を抑え、相手の接近方法を見る", caution: "単調に撃ち続けずジャンプを警戒" },
      { range: "中距離", actions: "通常技 / 波動拳 / 差し返し", purpose: "地上戦から触る機会を作る", caution: "技の空振りとDrive Impactに注意" },
      { range: "近距離", actions: "小技 / 投げ / 防御", purpose: "攻守を短く判断する", caution: "無理に波動拳を撃たない" },
      { range: "画面端", actions: "対空 / コンボ / 位置入れ替え", purpose: "自分の位置を守りながら攻める", caution: "相手のジャンプとDrive Impactを確認" },
    ],
  },
  jp: {
    tagline: "トルバランとトリグラフで遠距離の移動先を制限し、ヴィーハトを組み合わせて相手の接近経路を絞る遠距離・設置型です。",
    winPath: "飛び道具と設置技を同じタイミングで重ねず、相手が歩く・跳ぶ・待つのどれを選ぶか見て次の攻撃位置を変えます。",
    firstLesson: "まずはトルバランで横方向、トリグラフで離れた位置を攻撃する役割の違いを覚え、接近されたら防御へ切り替えます。",
    strength: "トルバラン、トリグラフ、ヴィーハトを使い分け、遠距離で相手の前進・待機・ジャンプの選択を絞りやすい点が強みです。",
    weakness: "設置や飛び道具の入力中に距離を詰められると、遠距離の選択肢を使いにくくなります。近距離では派生に固執せず防御を優先します。",
    gameplan: [
      {
        label: "01 / CONTROL",
        title: "トルバランとトリグラフで進路を絞る",
        body: "遠距離では横方向を進むトルバランと、指定した地面から攻撃するトリグラフを使い分けます。相手の現在位置ではなく、次に進みたい場所へ意識を向けるのが狙いです。",
        caution: "同じ技とタイミングを繰り返すと接近のきっかけを与えるため、相手の反応を見て切り替えます。",
      },
      {
        label: "02 / DEPARTURE",
        title: "ヴィーハトで次の攻撃位置を作る",
        body: "ヴィーハトを設置できた状況では、派生攻撃を意識させて移動先を狭めます。設置そのものを目的にせず、飛び道具や通常技と組み合わせて使います。",
        caution: "設置中でも接近を許したら、派生に固執せず近距離の防御を優先します。",
      },
      {
        label: "03 / SA2",
        title: "ラヴーシュカで攻めを継続する",
        body: "SA2のラヴーシュカは複数の攻撃を発生させ、相手の守りを動かしながら攻めを続ける役割があります。具体的な連携は確認済みデータだけを採用します。",
        caution: "発動後の連携や成立条件はPatch依存のため、未確認ルートをPublicには出しません。",
      },
    ],
    ranges: [
      { range: "遠距離", actions: "トルバラン / トリグラフ / ヴィーハト", purpose: "移動先を制限して主導権を取る", caution: "相手のジャンプと前進の変化を見る" },
      { range: "中距離", actions: "通常技 / 飛び道具 / 対空", purpose: "接近を止めて遠距離へ戻す", caution: "設置に固執せず対空を優先" },
      { range: "近距離", actions: "小技 / 投げ抜け判断 / ODアムネジア", purpose: "守って距離を作り直す", caution: "無理に遠距離技を入力しない" },
      { range: "画面端", actions: "防御 / 対空 / 位置入れ替え", purpose: "中央へ戻る機会を作る", caution: "後退できないため相手の打撃と投げを確認" },
    ],
  },
};

export function getCharacterDetailV21Profile(slug: string): CharacterDetailV21Profile | null {
  return slug === "ryu" || slug === "jp" ? profiles[slug] : null;
}
