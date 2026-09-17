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
    tagline: "波動拳で地上を止め、飛んだ相手を昇龍拳で落とす。中距離の地上戦から攻めのきっかけを作るキャラクターです。",
    winPath: "中距離では通常技と波動拳を使い分けます。相手が飛べば昇龍拳、地上で技を空振れば差し返しを狙い、画面端へ運びます。",
    firstLesson: "波動拳を撃った直後も画面を見続け、相手のジャンプを昇龍拳で落とす練習から始めます。",
    strength: "地上の波動拳と対空の昇龍拳が役割分担しやすく、中距離で相手の前進とジャンプの両方を止められます。",
    weakness: "近距離で波動拳や電刃錬気を選ぶと、相手の打撃を受けやすくなります。距離が詰まったら防御を優先します。",
    gameplan: [
      {
        label: "01 / GROUND",
        title: "波動拳で地上を動かす",
        body: "中距離では波動拳で歩きを止め、相手が波動拳を意識したら通常技で前進を止めます。先に相手を動かして、対空や差し返しにつなげます。",
        caution: "近距離の波動拳は潰されやすいため、通常技が届く距離では無理に撃ちません。",
      },
      {
        label: "02 / ANTI-AIR",
        title: "ジャンプは昇龍拳で迎撃する",
        body: "波動拳を飛び越えようとした相手には昇龍拳を合わせます。波動拳を撃つ距離と昇龍拳が間に合う距離を一組で覚えます。",
        caution: "相手が飛べる距離では、前歩きや追加の波動拳より対空入力を優先します。",
      },
      {
        label: "03 / CONVERT",
        title: "触れたら短いコンボでダウンを取る",
        body: "近距離の小技が当たったら、昇龍拳や竜巻旋風脚で締める短いルートを使います。まずは入力を安定させ、次の起き攻めへ進みます。",
        caution: "下のコンボはPreview確認用です。ダメージや消費量が未確認の項目は実戦判断に使いません。",
      },
      {
        label: "04 / CORNER",
        title: "Drive Rushは接近、Drive Impactは画面端で警戒する",
        body: "中距離ではDrive Rushで一気に近づく選択肢があります。画面端では相手のDrive Impactを常に警戒し、攻めながらも返せる準備をします。",
        caution: "Drive Gaugeを使い切ると守りが苦しくなるため、残量を見て攻めを止めます。",
      },
    ],
    ranges: [
      { range: "遠距離", actions: "波動拳", purpose: "前進を抑え、相手の接近方法を見る", caution: "単調に撃ち続けずジャンプを警戒" },
      { range: "中距離", actions: "通常技 / 波動拳 / 差し返し / Drive Rush", purpose: "地上戦から触る機会を作る", caution: "技の空振りとDrive Impactに注意" },
      { range: "近距離", actions: "小技 / 投げ / 防御", purpose: "攻守を短く判断する", caution: "無理に波動拳を撃たない" },
      { range: "画面端", actions: "対空 / コンボ / 位置入れ替え", purpose: "自分の位置を守りながら攻める", caution: "相手のジャンプとDrive Impactを確認" },
    ],
  },
  jp: {
    tagline: "トルバラン、トリグラフ、ヴィーハトで相手の進路を塞ぎ、遠距離を保って戦うキャラクターです。",
    winPath: "遠距離では飛び道具と設置技で相手を動かし、前進先へ次の攻撃を置きます。距離を詰められたら守り、中央へ戻してラインを作り直します。",
    firstLesson: "トルバランは横の移動、トリグラフは離れた地面、ヴィーハトは設置からの時間差攻撃と役割を分けて覚えます。",
    strength: "遠距離で複数の攻撃位置を使い分けられるため、相手の歩き・待ち・ジャンプに別々の答えを用意できます。",
    weakness: "中距離より内側まで入られると、飛び道具と設置技の入力時間を取りにくくなります。近距離では技を置き続けず、防御して距離を戻します。",
    gameplan: [
      {
        label: "01 / CONTROL",
        title: "トルバランとトリグラフで進路を絞る",
        body: "トルバランで横移動を止め、相手が止まった場所や前進先へトリグラフを置きます。画面上の距離を保ち、相手を少しずつ画面端へ押します。",
        caution: "同じ技を同じ間隔で繰り返すと、ジャンプや前進のタイミングを読まれます。",
      },
      {
        label: "02 / DEPARTURE",
        title: "ヴィーハトで時間差の攻撃を作る",
        body: "ヴィーハトを設置すると、JP本体の攻撃と設置の起動を別のタイミングで使えます。飛び道具と重ね、相手が安全に歩ける場所を減らします。",
        caution: "中距離まで入られたら設置を優先せず、対空や通常技で前進を止めます。",
      },
      {
        label: "03 / SA2",
        title: "ラヴーシュカで攻めを継続する",
        body: "SA2のラヴーシュカは複数の攻撃を順番に発生させます。相手の守りを動かしながら、本体の打撃や投げで攻めを続けるために使います。",
        caution: "発動後の入力順と成立条件はPatchごとの確認が必要です。未確認ルートはPublicには出しません。",
      },
      {
        label: "04 / RESET",
        title: "近距離では守り、中央へ戻る",
        body: "相手に近づかれたら、飛び道具や設置技の入力を止めます。打撃・投げ・対空に対応し、距離ができたら遠距離のライン管理へ戻ります。",
        caution: "画面端では後退できません。相手のジャンプとDrive Impactを先に確認します。",
      },
    ],
    ranges: [
      { range: "遠距離", actions: "トルバラン / トリグラフ / ヴィーハト", purpose: "移動先を制限して主導権を取る", caution: "相手のジャンプと前進の変化を見る" },
      { range: "中距離", actions: "通常技 / トルバラン / 対空", purpose: "接近を止めて遠距離へ戻す", caution: "設置に固執せずジャンプを先に見る" },
      { range: "近距離", actions: "小技 / 投げ抜け判断 / ODアムネジア", purpose: "守って距離を作り直す", caution: "無理に遠距離技を入力しない" },
      { range: "画面端", actions: "防御 / 対空 / 位置入れ替え", purpose: "中央へ戻る機会を作る", caution: "後退できないため相手の打撃と投げを確認" },
    ],
  },
};

export function getCharacterDetailV21Profile(slug: string): CharacterDetailV21Profile | null {
  return slug === "ryu" || slug === "jp" ? profiles[slug] : null;
}
