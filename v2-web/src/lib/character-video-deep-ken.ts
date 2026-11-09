import type { VideoSummary } from "@/lib/event-media";
/** ケン YouTube title/ID candidates. Preview-only, gameplay and relationships not validated. */
const candidates = [
  {
    "id": "mEKNoo5eSjc",
    "title": "【レジェンドが教える】ケンの使い方解説 前編!!立ち回りで使える強い技や連携、迅雷脚や龍尾脚についても紹介します！【スト6】【STREET FIGHTER 6】",
    "channel": "Gorou / 五郎",
    "date": "2025-11-18",
    "kind": "guide"
  },
  {
    "id": "18vg0pWfzns",
    "title": "【スト6】ケン結構強くなってます！新調整後に必須のコンボ＆連携まとめ",
    "channel": "いおりチャンネル【スト6講座と対戦動画投稿】",
    "date": "2026-08-13",
    "kind": "guide"
  },
  {
    "id": "doxkPWPrfsQ",
    "title": "コレを繰り返すだけでマスターまでいける！ケンで意識するべき超重要な動きを解説するナウマン【ナウマン/切り抜き】",
    "channel": "ナウマン / Nauman",
    "date": "2024-12-13",
    "kind": "guide"
  },
  {
    "id": "z7GAyEOhxCw",
    "title": "【SF6】ケン 奮迅竜巻表裏コンボ❗️裏バージョン #スト6解説 #スト6",
    "channel": "inaGuile@攻めガイル",
    "date": "2024-11-29",
    "kind": "guide"
  },
  {
    "id": "KA_juokP37c",
    "title": "【SF6】ケン 下手に伸ばさない方が何故か減るコンボ！",
    "channel": "inaGuile@攻めガイル",
    "date": "2026-10-11",
    "kind": "guide"
  },
  {
    "id": "nROwKyYDikQ",
    "title": "ケンの立ち回りで意識する事4選！【スト6/STREET FIGHTER 6】",
    "channel": "おらりん",
    "date": "2025-03-09",
    "kind": "guide"
  },
  {
    "id": "oXvzcpY1Uyk",
    "title": "【スト６】超平均的な道着という印象を強く受けた、ケンでレジェンドを達成しました",
    "channel": "どぐら 生駒デビル",
    "date": "2025-05-07",
    "kind": "guide"
  },
  {
    "id": "HSgdf_L2nT0",
    "title": "【SF6】ケン 強昇龍後強P重ねセットプレイ！#スト6 #スト6解説",
    "channel": "inaGuile@攻めガイル",
    "date": "2025-04-18",
    "kind": "guide"
  },
  {
    "id": "hzaLWPVGkHk",
    "title": "初心者向け！ケンはとりあえずこれ！状況別コンボ！",
    "channel": "キータカ Keyetaka",
    "date": "2024-03-22",
    "kind": "guide"
  },
  {
    "id": "SDAfMji23P8",
    "title": "【SF6】ケン 奮迅竜巻後中段セットプレイ❗️#スト6 #スト6解説",
    "channel": "inaGuile@攻めガイル",
    "date": "2025-03-14",
    "kind": "guide"
  },
  {
    "id": "QSExNPS5RTI",
    "title": "【スト6】ケンで勝てない人へ。世界2位まで上げて変えた3つのこと【切り抜き】",
    "channel": "いおりチャンネル【スト6講座と対戦動画投稿】",
    "date": "2026-10-11",
    "kind": "guide"
  },
  {
    "id": "Zyd0UHDcXJ8",
    "title": "【スト6】「〇〇が最強です」ナウマン選手がケンを使う理由5選【ストリートファイター6/SF6】",
    "channel": "SmashlogTV - SF6",
    "date": "2024-08-31",
    "kind": "guide"
  },
  {
    "id": "DDFWFXBkbvE",
    "title": "ケンの火力源【STREET FIGHTER 6/ケン/舞】",
    "channel": "おらりん",
    "date": "2026-07-04",
    "kind": "guide"
  },
  {
    "id": "fIsBFvQ5xQ8",
    "title": "【スト6】勝てるようになる『ケンの使い方』を解説！初心者におすすめの強い技や立ち回り、コンボ、起き攻めを紹介します！【STREET FIGHTER 6】【ストリートファイター6】",
    "channel": "Gorou / 五郎",
    "date": "2023-11-24",
    "kind": "guide"
  },
  {
    "id": "SuchUJX3p6k",
    "title": "超当たるケンのインパクトセットプレイ3選　　#スト6  #ケン #エドモンド本田  #モダン #ゲーム実況 #スト6参加型",
    "channel": "ちるきりす",
    "date": "2026-05-23",
    "kind": "guide"
  },
  {
    "id": "STZnT_eAP68",
    "title": "【SF6】　ケン　高火力コンボ　#スト6　 #ケン 　#shorts",
    "channel": "Soruto ch",
    "date": "2026-08-03",
    "kind": "guide"
  },
  {
    "id": "KkvH6oiREv0",
    "title": "【SF6】ケン 端々運び＆1ゲージ回収オシャレコンボ！",
    "channel": "inaGuile@攻めガイル",
    "date": "2026-10-04",
    "kind": "guide"
  },
  {
    "id": "HYeWGcef-kY",
    "title": "【5分下さい】ケンで“実戦向け”コンボを9個に絞って紹介します【スト6】",
    "channel": "いよすけ / Iyosuke",
    "date": "2023-07-24",
    "kind": "guide"
  },
  {
    "id": "91gku0Xwf1k",
    "title": "スト６ケン使いのための20秒講座  #shorts  #streetfighter6 #sf6 #スト６ #解説 #コンボ  #ケン",
    "channel": "ゆっけのゲームちゃんねる",
    "date": "2024-08-17",
    "kind": "guide"
  },
  {
    "id": "zD5l_99iJ5I",
    "title": "絶対に知っておいてほしいケンのコンボ５選",
    "channel": "しあ",
    "date": "2025-03-14",
    "kind": "guide"
  },
  {
    "id": "HoCJRmi1afE",
    "title": "【SF6】ケン 低難易度高火力コンボ！#スト6 #スト6解説",
    "channel": "inaGuile@攻めガイル",
    "date": "2025-05-20",
    "kind": "guide"
  },
  {
    "id": "ne6_HIrA2g4",
    "title": "【Re】本当に頭を使いたくない人向けのモダンケン解説",
    "channel": "でぃぃち",
    "date": "2026-02-28",
    "kind": "guide"
  },
  {
    "id": "ixLsnYpl3MU",
    "title": "【スト6】MR1900モダンケン徹底解説 コンボ 立ち回り...【Mケン】",
    "channel": "小林八 / こばやしはち",
    "date": "2025-07-31",
    "kind": "guide"
  },
  {
    "id": "khEnOlQusIw",
    "title": "弱波動セットプレイ【スト6/STREET FIGHTER 6】#スト6  #ケン #解説 #コンボ #short",
    "channel": "おらりん",
    "date": "2026-03-28",
    "kind": "guide"
  },
  {
    "id": "UHdHBdZwRyU",
    "title": "ケン(KEN)のこのコンボむずかったんや #shorts #SF6 #streetfighter6 #ストリートファイター6 #スト6 #ken #ケン #combo #コンボ #解説",
    "channel": "まりゅーちゃんねる",
    "date": "2023-11-11",
    "kind": "guide"
  },
  {
    "id": "nUJJvbOUFNw",
    "title": "【SF6】ケン ノーゲージ高火力コンボ❗️#スト6 #スト6解説",
    "channel": "inaGuile@攻めガイル",
    "date": "2024-12-27",
    "kind": "guide"
  },
  {
    "id": "tWjoWgi9Eok",
    "title": "【SF6】ケン 改良版端々運びコンボ❗️ #スト6解説 #スト6",
    "channel": "inaGuile@攻めガイル",
    "date": "2024-11-24",
    "kind": "guide"
  },
  {
    "id": "_VGxiHVrYzk",
    "title": "ノーゲージSA2コンボ【スト6/STREET FIGHTER 6】#スト6  #ケン #解説 #コンボ #short",
    "channel": "おらりん",
    "date": "2026-03-17",
    "kind": "guide"
  }
] as const;
export const CHARACTER_VIDEO_DEEP_KEN: VideoSummary[] = candidates.map(({id,title,channel,date,kind})=>({
 id:`preview-ken-${id}`,slug:`preview-ken-${id}`,title,
 platform:"youtube",videoType:kind,publishedAt:date?`${date}T00:00:00Z`:null,
 description:"ケン関連の候補動画。現行Patch適合性、出演者・対戦関係は未検証です。",
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],
 characters:["ケン"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
