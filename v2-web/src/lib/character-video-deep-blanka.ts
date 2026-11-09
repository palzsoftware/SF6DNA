import type { VideoSummary } from "@/lib/event-media";
/** ブランカ YouTube title/ID candidates. Preview-only; gameplay, Player/Match relations not validated. */
const candidates = [
  {
    "id": "JG7O_STzLPY",
    "title": "【スト6、SF6】ブランカのめちゃくちゃ聞かれるコンボ選択＆起き攻めを解説！",
    "channel": "ACQUA",
    "date": "2025-11-02",
    "kind": "guide"
  },
  {
    "id": "tVSycSSb9yQ",
    "title": "【スト6、SF6】これだけ覚えれば勝てる！『ブランカ』とりこれ使い方！",
    "channel": "ACQUA",
    "date": "2026-07-03",
    "kind": "guide"
  },
  {
    "id": "HdVx6-v94Uc",
    "title": "【スト6】初心者にもおすすめ！今日から使える「ブランカ」の最強行動・セットプレイ徹底解説 // ACQUA × ハメコ。【SF6 / ストリートファイター6】",
    "channel": "SmashlogTV - SF6",
    "date": "2024-10-21",
    "kind": "guide"
  },
  {
    "id": "l_aZgMkq8Gs",
    "title": "【ブランカ解説！初心者～GRAND MASTER向け】MR2100ブランカが使っているコンボ&起き攻めまとめ！練習法つき！YEAR4版【スト6】",
    "channel": "oかか",
    "date": "2026-09-13",
    "kind": "guide"
  },
  {
    "id": "EcC1IAsyaaE",
    "title": "【スト6、SF6】ブランカ新要素まとめ！電撃ホールドを使いこなそう",
    "channel": "ACQUA",
    "date": "2026-08-12",
    "kind": "guide"
  },
  {
    "id": "-4WiclueXk8",
    "title": "【ブランカ】全ブランカ使いに捧ぐ！こするだけで勝率が上がる強行動をまとめました！全員見るべし！【SF6 ストリートファイター6 スト6】",
    "channel": "サプフォ党党首ブランカ",
    "date": "2026-04-18",
    "kind": "guide"
  },
  {
    "id": "8WkpwdzbOSg",
    "title": "【スト6】Year3ブランカ 基本コンボ ※人形とSA2は除く｜始動技・状況別・リーサル【ENG sub】Blanka Basic Combos– No Blanka-chan or SA2",
    "channel": "さくね",
    "date": "2025-10-18",
    "kind": "guide"
  },
  {
    "id": "sEVtzfXeg80",
    "title": "【スト６】15分で使えるブランカ講座！！とりあえずこれセットプレイでハメて勝つ！【Street Fighter 6】 #ストリートファイター6  #スト6  #sf6",
    "channel": "いおりチャンネル【スト6講座と対戦動画投稿】",
    "date": "2024-02-27",
    "kind": "guide"
  },
  {
    "id": "Id0zCxrbmhA",
    "title": "【スト6】ブランカ 不利フレームからリターンを取れる 逆択まとめ【ENG sub】SF6 Blanka Reverse Mixups Guide at frame disadvantage",
    "channel": "さくね",
    "date": "2025-07-13",
    "kind": "guide"
  },
  {
    "id": "_1ldiZSJLCg",
    "title": "【ブランカ解説！初心者～MASTER向け】MR2000ブランカによる起き攻めまとめ！練習法つき！【スト6】",
    "channel": "oかか",
    "date": "2024-10-26",
    "kind": "guide"
  },
  {
    "id": "gV_ix2N_3l0",
    "title": "[スト6] レジェンドブランカの距離別振る技まとめ",
    "channel": "ドゴル",
    "date": "2024-08-09",
    "kind": "guide"
  },
  {
    "id": "ufUU8LkOLtk",
    "title": "【スト6】シルバー・ゴールド必見！ブランカのプラチナ昇格セットプレイ！【荒巻ガイ】",
    "channel": "荒巻ガイ",
    "date": "2025-09-27",
    "kind": "guide"
  },
  {
    "id": "QSWXPRmJXmk",
    "title": "[スト6] レジェンドブランカが自分の試合を解説します",
    "channel": "ドゴル",
    "date": "2025-03-03",
    "kind": "match"
  },
  {
    "id": "A8HHHuIq4XA",
    "title": "【ブランカ解説！初心者～中級者向け】状況別基本コンボ,起き攻め,練習法編！【スト6】",
    "channel": "oかか",
    "date": "2024-08-13",
    "kind": "guide"
  },
  {
    "id": "rKqsebFWoeI",
    "title": "【スト6】ブランカ SA2解説 (Year3対応)｜ヒット〜ガード発動・画面端セットプレーまで (Eng sub) Blanka SA2 Guide Combos&Setup【SF6】",
    "channel": "さくね",
    "date": "2025-09-26",
    "kind": "guide"
  },
  {
    "id": "DeoqNCNyBM8",
    "title": "【SF6】世界1位ブランカ！変幻自在の攻めがエグすぎるｗｗｗ「すさ(Susa):ブランカ(Blanka)」【スト6】",
    "channel": "SF6-MODERN",
    "date": "2026-10-31",
    "kind": "guide"
  },
  {
    "id": "vuyLlDb9Fgs",
    "title": "【スト６】ブランカの初見セットプレイをくらう甘結もか #甘結もか #Shorts #ぶいすぽ",
    "channel": "Vtuber格ゲー切り抜き",
    "date": "2024-11-28",
    "kind": "guide"
  },
  {
    "id": "kx49iCOCxxg",
    "title": "【スト6】モダン１位 ブランカ セットプレイが最強すぎるｗ【SF6】",
    "channel": "SF6movie",
    "date": "2026-02-25",
    "kind": "guide"
  },
  {
    "id": "gWMhy0qlH2s",
    "title": "ブランカのこの起き攻めがシンプルにエグいwww【ブランカ・スト６】",
    "channel": "サプフォ党党首ブランカ",
    "date": "2024-07-30",
    "kind": "guide"
  },
  {
    "id": "Ae1PDkKQLYw",
    "title": "【スト6】基本コンボの長所と短所、解説‼︎【ブランカ】",
    "channel": "ジャバウォックおろち",
    "date": "2025-11-24",
    "kind": "guide"
  },
  {
    "id": "AMUbH1eKlsI",
    "title": "【スト6】自分が擦っているブランカの強いコンボとセットプレイまとめてみた【ネモ】",
    "channel": "「ネモ」ストリートファイター6 プロゲーマー【ネモぬき】",
    "date": "2024-05-15",
    "kind": "guide"
  },
  {
    "id": "PYcM1zW-RB0",
    "title": "ブランカの最強コンボ　#スト6 #スト6解説",
    "channel": "えまおチャンネル(emaoch)",
    "date": "2024-12-10",
    "kind": "guide"
  },
  {
    "id": "t3h5YoTcyZ0",
    "title": "Mブランカの全て※マスター未満の方は絶対見てください",
    "channel": "サプフォ党党首ブランカ",
    "date": "2024-05-06",
    "kind": "guide"
  },
  {
    "id": "Qku2Hrwrun0",
    "title": "【スト6】Year4ブランカ調整内容 解説｜コンボ・起き攻めなど変更点まとめ (Eng sub) Blanka  2026.08.03 update | Buffs & Nerfs【SF6】",
    "channel": "さくね",
    "date": "2026-08-11",
    "kind": "guide"
  },
  {
    "id": "RjXcN_Uw748",
    "title": "スト6 MenaRDブランカのやり込み過ぎなコンボがカッコ良すぎて感動するハイタニ #ハイタニ #shorts",
    "channel": "ハイタニ TV",
    "date": "2026-05-07",
    "kind": "guide"
  },
  {
    "id": "vP_U-A3a7sk",
    "title": "【スト6】回避困難すぎるセットプレイ MenaRD (ブランカ) 【SF6】",
    "channel": "昇龍拳",
    "date": "2024-01-05",
    "kind": "guide"
  },
  {
    "id": "ZbHazeBn7hs",
    "title": "【スト6】ブランカちゃん人形 使い方講座 (Year3)｜設置～コンボ・ガード崩しまで【ENG sub】Blanka-chan Guide – Setups, Combos & Mixup (SF6)",
    "channel": "さくね",
    "date": "2025-08-03",
    "kind": "guide"
  },
  {
    "id": "-rcdkyZCRAM",
    "title": "ブランカの評価が激変!?逆対策で触ってみたらちょっと印象が変わってきました...【ブランカ/逆対策/スト6】【立川/切り抜き/CR】",
    "channel": "立川ちゃんねる",
    "date": "2026-08-24",
    "kind": "counter"
  }
] as const;
export const CHARACTER_VIDEO_DEEP_BLANKA: VideoSummary[] = candidates.map(({id,title,channel,date,kind})=>({
 id:`preview-blanka-${id}`,slug:`preview-blanka-${id}`,title,
 platform:"youtube",videoType:kind,publishedAt:date?`${date}T00:00:00Z`:null,
 description:"ブランカ関連の候補動画。現行Patch適合性、出演者・対戦関係は未検証です。",
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],
 characters:["ブランカ"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
