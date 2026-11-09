import type { VideoSummary } from "@/lib/event-media";
/** ジュリ YouTube title/ID candidates. Preview-only, gameplay and relationships not validated. */
const candidates = [
  {
    "id": "NTC2r8tHqvg",
    "title": "【スト6】【ジュリ】これだけでOKコンボ3選「俺もこれしかやってない」【マゴ】",
    "channel": "マゴ /MAGO",
    "date": "2023-06-02",
    "kind": "guide"
  },
  {
    "id": "34Ai7CwyYXk",
    "title": "【MR2100↑が教える】これ1本ですべてがわかる！ジュリの実用コンボ完全解説【永久保存版】",
    "channel": "ねこま",
    "date": "2026-05-31",
    "kind": "guide"
  },
  {
    "id": "iJt1CAEQKqQ",
    "title": "【スト6】これ一本でジュリを楽にマスターへ！2026年対応版コンボ＆起き攻め完全ガイド【ストリートファイター6 初心者向けジュリ解説】",
    "channel": "さわかぜの格ゲーチャンネル",
    "date": "2026-04-19",
    "kind": "guide"
  },
  {
    "id": "6KgaTQd2hKY",
    "title": "【YEAR3最新版】これ1本ですべてがわかる！MR2000↑が教える初心者向けジュリ講座 【スト6解説】",
    "channel": "ねこま",
    "date": "2025-09-13",
    "kind": "guide"
  },
  {
    "id": "Gi06KLkgfX0",
    "title": "【マスターになりたい人必見】ジュリのこれができたらマスター余裕のコンボと連携を解説",
    "channel": "しあ",
    "date": "2025-08-31",
    "kind": "guide"
  },
  {
    "id": "3eXN6H0o6-k",
    "title": "【アプデ後最新版】これ1本ですべてがわかる！MR2100↑が教えるジュリの新コンボ・起き攻め完全解説！ 【スト6】",
    "channel": "ねこま",
    "date": "2026-03-22",
    "kind": "guide"
  },
  {
    "id": "TJBQX0iONl4",
    "title": "【ジュリ使いは全員やれ】MR2100↑が教える！ジュリのオート差し返し完全解説【ジュリ講座】",
    "channel": "ねこま",
    "date": "2026-01-31",
    "kind": "guide"
  },
  {
    "id": "uL5SnciAvpM",
    "title": "【前編】ファイあつ式ジュリ講座！ジュリ運用時のぷげらの考え方を紹介します【SF6】",
    "channel": "ぷげら pugera",
    "date": "2025-03-14",
    "kind": "guide"
  },
  {
    "id": "ZQourqvHEvM",
    "title": "ジュリをこれから使いたい人へ！今夜から勝てるガチ初心者講座",
    "channel": "しあ",
    "date": "2025-08-22",
    "kind": "guide"
  },
  {
    "id": "4esT9bh54XM",
    "title": "【全ジュリ使い必見】ランクで沼っている人にこそ見てほしい！レートを上げるうえで絶対に知っておきたいジュリの小技・最強択を詰め込んだ解説シリーズ総集編【スト6解説】",
    "channel": "ねこま",
    "date": "2026-06-24",
    "kind": "guide"
  },
  {
    "id": "ZbqG4y8DpWc",
    "title": "【スト6/ジュリ】ジュリの基本コンボルート3選【初・中級者向け】",
    "channel": "さにてぃチャンネル",
    "date": "2025-06-05",
    "kind": "guide"
  },
  {
    "id": "p0rx27nLlYs",
    "title": "初心者・ジュリを使いたい方必見！とりあえず覚えて使えるジュリ状況別コンボ！#shorts",
    "channel": "キータカ Keyetaka",
    "date": "2023-06-23",
    "kind": "guide"
  },
  {
    "id": "O4nbbgDc0cw",
    "title": "ジュリ使いがやめるべき行動と地上戦のコツを解説するぷげら【ガチくんに!切り抜き/スト6】",
    "channel": "Impress eSports Club",
    "date": "2025-04-18",
    "kind": "guide"
  },
  {
    "id": "OtuFzANjZhQ",
    "title": "【MR2100↑が教える】99%のジュリ使いが間違っている！起き攻め引き大Kの使い方完全解説【スト6】",
    "channel": "ねこま",
    "date": "2026-04-06",
    "kind": "guide"
  },
  {
    "id": "TgLdp5ehuGE",
    "title": "ジュリを使ってて一番萎える瞬間の解決法があまりにも意外だったので共有します【スト6/ぷげら】",
    "channel": "ぷげら pugera",
    "date": "2026-05-04",
    "kind": "guide"
  },
  {
    "id": "oaMRjkWhBt8",
    "title": "【MR2199が教える】今すぐ〇〇を増やせ！見るだけで勝率が爆上がりするジュリの起き攻め完全解説【スト6解説】",
    "channel": "ねこま",
    "date": "2026-04-25",
    "kind": "guide"
  },
  {
    "id": "6Ac6NWqgIm8",
    "title": "【スト6】シルバー・ゴールド必見！ジュリのプラチナ昇格セットプレイ！【荒巻ガイ】",
    "channel": "荒巻ガイ",
    "date": "2025-09-12",
    "kind": "guide"
  },
  {
    "id": "PSmzys-BAcA",
    "title": "【スト６初心者向け】モダンジュリ解説！おすすめ簡単コンボや対空！戦い方",
    "channel": "ふみたんゲーム部",
    "date": "2023-06-17",
    "kind": "guide"
  },
  {
    "id": "JdLLRLJ1wYQ",
    "title": "ジュリ使いの神コンボに爆笑そして感動するカワノ #ストリートファイター6",
    "channel": "カワノKawano",
    "date": "2026-02-26",
    "kind": "guide"
  },
  {
    "id": "P7nQv6ctDc0",
    "title": "ジュリのセットプレイとテクニックをまとめて紹介【2026年最新版】",
    "channel": "しあ",
    "date": "2025-01-01",
    "kind": "guide"
  },
  {
    "id": "l_UMUzVvSDU",
    "title": "【スト6】【ジュリ】【コンボ】OD風破コンボセットプレイまとめ　20260317アプデバージョン",
    "channel": "よっさん",
    "date": "2026-03-22",
    "kind": "guide"
  },
  {
    "id": "w3fY9LQWFHc",
    "title": "【水無瀬さんコーチング】ジュリの通常技とラッシュの使い分けを分かりやすく教えるべてぃちゃん【スト6】【或世杯顔合わせ 切り抜き】",
    "channel": "べてぃちゃんねる",
    "date": "2026-01-21",
    "kind": "guide"
  },
  {
    "id": "USaJRyr_9Fw",
    "title": "【SF6】ジュリ 確定反撃最大コンボ！#スト6 #スト6解説",
    "channel": "inaGuile@攻めガイル",
    "date": "2025-04-05",
    "kind": "guide"
  },
  {
    "id": "gqyI4yOBa_U",
    "title": "絶対に知っておいてほしいジュリのコンボ５選",
    "channel": "しあ",
    "date": "2025-03-12",
    "kind": "guide"
  },
  {
    "id": "aoF4B6JrpZU",
    "title": "【スト6】初のランクマでスマーフ行為を疑われてしまうVtuberwww#スト6 #ジュリ #風水エンジン #vtuber #shorts",
    "channel": "いおなch",
    "date": "2025-05-27",
    "kind": "guide"
  },
  {
    "id": "f9mTMp1oGqE",
    "title": "ジュリの絶対に知っておいてほしいセットプレイ",
    "channel": "しあ",
    "date": "2025-01-05",
    "kind": "guide"
  },
  {
    "id": "ItlAX4TBxi8",
    "title": "(実質)Dゲージ消費ゼロ！ジュリのコスパ最強ラッシュ中段コンボ解説【SF6テクニック解説】#ストリートファイター6",
    "channel": "BURNOUT TV.",
    "date": "2026-04-03",
    "kind": "guide"
  }
] as const;
export const CHARACTER_VIDEO_DEEP_JURI: VideoSummary[] = candidates.map(({id,title,channel,date,kind})=>({
 id:`preview-juri-${id}`,slug:`preview-juri-${id}`,title,
 platform:"youtube",videoType:kind,publishedAt:date?`${date}T00:00:00Z`:null,
 description:"ジュリ関連の候補動画。現行Patch適合性、出演者・対戦関係は未検証です。",
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],
 characters:["ジュリ"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
