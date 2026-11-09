import type { VideoSummary } from "@/lib/event-media";
/** 春麗: YouTube title/ID/channel verified from search, Preview candidates only.
 * No verified gameplay, Player relation, or publication approval.
 */
const candidates = [
  {
    "id": "PtVyW8KJ3CQ",
    "title": "【スト6】強化されて今熱いYear3春麗をGO1が解説！",
    "channel": "GO1チャンネル",
    "date": "2025-06-07",
    "kind": "guide"
  },
  {
    "id": "cFdf6SJ8bDc",
    "title": "【スト6】コレを覚えて勝ちまくれ！春麗の最強起き攻めを全て伝授するハイタニ【ハイタニ 蒼輪ちなみ】【SF6 ストリートファイター6】",
    "channel": "ハイタニ TV",
    "date": "2024-12-23",
    "kind": "guide"
  },
  {
    "id": "jPodxwdIPT4",
    "title": "【解説】コマンド無しで強い！モダン春麗のコンボと立ち回り【春麗総合1位】",
    "channel": "えだ",
    "date": "2025-01-07",
    "kind": "guide"
  },
  {
    "id": "vZFsca-uyX8",
    "title": "スト6 「春麗もうちょっと頑張ってくれよ…」春麗のコンボ火力に思わず嘆いてしまうを言うハイタニ #ハイタニ #shorts",
    "channel": "ハイタニ TV",
    "date": "2026-02-25",
    "kind": "guide"
  },
  {
    "id": "mYX1C0_2ovk",
    "title": "初心者向け！春麗はとりあえずこれ！状況別コンボ！",
    "channel": "キータカ Keyetaka",
    "date": "2024-04-19",
    "kind": "guide"
  },
  {
    "id": "veEEtWMtKZU",
    "title": "【春麗】差し返しでパニカンしたらセットプレイで有利を取ろう！【うりょ/スト6】",
    "channel": "うりょ",
    "date": "2025-09-14",
    "kind": "guide"
  },
  {
    "id": "eduVCevisgQ",
    "title": "【スト６】基礎コンもムズい、対空もムズい…春麗のレジェチャレを始めるも、その難しさに顔が歪むどぐら",
    "channel": "どぐら 生駒デビル",
    "date": "2025-01-06",
    "kind": "guide"
  },
  {
    "id": "yMhMWLHUS5k",
    "title": "【スト6】勝てるようになる『春麗の使い方』を解説！初心者におすすめのチュンリーの強い技や立ち回り方、コンボを紹介します！【ストリートファイター6】【STREET FIGHTER 6】",
    "channel": "Gorou / 五郎",
    "date": "2023-08-25",
    "kind": "guide"
  },
  {
    "id": "g8ClvmzO-9o",
    "title": "【SF6】🔥Legend春麗から学ぶ最新版の立ち回り！〚Moke〛〚YOKOHAMA TARO〛 Upgraded Chun-Li!  Chun-Li's Strategy✨",
    "channel": "SF6キャラ対策リプレイコレクション",
    "date": "2026-03-23",
    "kind": "guide"
  },
  {
    "id": "11VBYHkThhY",
    "title": "スト6 春麗に必要なバーンアウト中の固め連携をハイタニが伝授 #shorts #ハイタニ",
    "channel": "ハイタニ TV",
    "date": "2025-09-30",
    "kind": "guide"
  },
  {
    "id": "Nha8tq2ddNw",
    "title": "スト6 SA1で5000ダメージ！超火力な春麗の無敵技反撃コンボ #ハイタニ #shorts",
    "channel": "ハイタニ TV",
    "date": "2026-06-23",
    "kind": "guide"
  },
  {
    "id": "jET6Cr8Gzro",
    "title": "【スト６】春麗編：マスターなりやすさランキング【解説】 #ストリートファイター6 #vtuber #chunli  #スト6解説",
    "channel": "牙キバル@VTuber",
    "date": "2025-03-09",
    "kind": "guide"
  },
  {
    "id": "sGBE-PEklnA",
    "title": "【SF6】春麗 翼旋脚差し返し高火力コンボ！",
    "channel": "inaGuile@攻めガイル",
    "date": "2026-08-25",
    "kind": "guide"
  },
  {
    "id": "7SoPp5nha40",
    "title": "【SF6】春麗 確定反撃高火力コンボ❗️#スト6 #スト6解説",
    "channel": "inaGuile@攻めガイル",
    "date": "2025-03-05",
    "kind": "guide"
  },
  {
    "id": "K3Bn8TaPsnU",
    "title": "【SF6】春麗 立ち強Pカウンター確認エコSA2コンボ！ #スト6 #スト6解説",
    "channel": "inaGuile@攻めガイル",
    "date": "2025-10-22",
    "kind": "guide"
  },
  {
    "id": "UCXuhW1cn7g",
    "title": "【スト6】春麗使いなら覚えるべき！春麗のセットプレイ3選 #春麗 #ストリートファイター6 #スト6 #streetfighter #chunli #スト6解説 #コンボ #sf6 #shorts",
    "channel": "Replica / Esportsキャスター",
    "date": "2025-11-18",
    "kind": "guide"
  },
  {
    "id": "zP6czw5BgXM",
    "title": "モダン春麗の何となく分かる立ち回り講座",
    "channel": "三波ヨタGame ch",
    "date": "2026-06-28",
    "kind": "guide"
  },
  {
    "id": "8Vt8C0XHKCg",
    "title": "【スト6】春麗使いなら覚えるべき！中足/追突リーサルコンボ3選　#春麗 #ストリートファイター6 #スト6 #streetfighter #chunli #スト6解説 #sf6 #shorts",
    "channel": "Replica / Esportsキャスター",
    "date": "2025-12-19",
    "kind": "guide"
  },
  {
    "id": "ZHy2G5g_EKg",
    "title": "春麗 初心者向けコンボまとめ #もけ #streetfighter #ストリートファイター6",
    "channel": "もけあそび!",
    "date": "2024-03-30",
    "kind": "guide"
  },
  {
    "id": "tOjo-bJVSII",
    "title": "【解説】モダン春麗のコンボや立ち回り教えます！【スト6】",
    "channel": "えだ",
    "date": "2023-08-05",
    "kind": "guide"
  },
  {
    "id": "JO3joU6JPoU",
    "title": "【スト６】ケン戦を極めた立ち回りを魅せるSeiya【春麗軍vsケン軍対抗戦】",
    "channel": "Seiya /おわえちゃん",
    "date": "2026-08-19",
    "kind": "match"
  },
  {
    "id": "ZVBL0h7oABU",
    "title": "【スト６】春麗の基本立ち回りは3つのことをループするだけで強い。",
    "channel": "キータカ Keyetaka",
    "date": "2024-02-03",
    "kind": "guide"
  },
  {
    "id": "z15RX8De9Pc",
    "title": "【モダン春麗】強スピバ後におすすめの起き攻め6選",
    "channel": "三波ヨタGame ch",
    "date": "2025-09-15",
    "kind": "guide"
  },
  {
    "id": "QRHVtNmNAZs",
    "title": "【スト6】春麗使いなら覚えるべき！春麗のスタンコンボ4選 #ストリートファイター6 #chunli #sf6 #春麗 #スト6解説",
    "channel": "Replica / Esportsキャスター",
    "date": "2025-11-08",
    "kind": "guide"
  },
  {
    "id": "8dUQ3s4j95s",
    "title": "春麗の最強コンボ #ゲーム実況 #ストリートファイター6 #スト6 #春麗",
    "channel": "和傍屋☎︎【WAKATAYA】",
    "date": "2024-12-27",
    "kind": "guide"
  },
  {
    "id": "NkJHkIa4dWE",
    "title": "スト6 世界5位のモダン春麗講座！相手がバーンアウト時の固め連携 #shorts #ハイタニ",
    "channel": "ハイタニ TV",
    "date": "2024-03-11",
    "kind": "guide"
  }
] as const;
export const CHARACTER_VIDEO_DEEP_CHUN_LI: VideoSummary[] = candidates.map(({id,title,channel,date,kind})=>({
 id:`preview-chun-li-${id}`,slug:`preview-chun-li-${id}`,title,
 platform:"youtube",videoType:kind,publishedAt:date?`${date}T00:00:00Z`:null,
 description:"春麗関連の候補動画。収録時点の情報です。現行Patch、出演者・対戦関係は未検証です。",
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],
 characters:["春麗"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
