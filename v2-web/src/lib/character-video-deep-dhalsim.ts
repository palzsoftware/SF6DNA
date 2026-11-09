import type { VideoSummary } from "@/lib/event-media";
/** ダルシム YouTube title/ID candidates. Preview-only; gameplay, Player/Match relations not validated. */
const candidates = [
  {
    "id": "OvaSzftq5tY",
    "title": "【スト６ダルシム】実は攻めも強い！ダルシムの最強攻め方５選！【初心者講座】#ストリートファイター6 #スト6解説 #vtuber #dhalsim",
    "channel": "牙キバル@VTuber",
    "date": "2024-11-27",
    "kind": "guide"
  },
  {
    "id": "VPKlmKW-nlg",
    "title": "【スト6】全ダルシム使い必見！立ち回り・コンボ・実戦テクニックを鶏めしが徹底解説",
    "channel": "鶏めしチャンネル",
    "date": "2026-07-14",
    "kind": "guide"
  },
  {
    "id": "w7MrScQsj3s",
    "title": "【スト6】とりあえずこの動画だけでOK！？ダルシムの全てをレジェンドダルシムが徹底解説！！",
    "channel": "はるみー",
    "date": "2024-12-21",
    "kind": "guide"
  },
  {
    "id": "MGp16TTKOHY",
    "title": "【スト6】ダルシム解説を作り続けた到達点【コンボ,起き攻め,立ち回り】【モダン,クラシック】",
    "channel": "たこ煮",
    "date": "2026-10-16",
    "kind": "guide"
  },
  {
    "id": "xrYANqq2ObQ",
    "title": "【スト6】道着大好きなるおの はじめてのダルシム【なるお・ストリートファイター6】",
    "channel": "なるおのひとりでできるもん",
    "date": "2025-07-01",
    "kind": "guide"
  },
  {
    "id": "NW_gzay0nJ0",
    "title": "【スト6】これ一本でマスター到達!?ダルシム基本コンボ6選",
    "channel": "ホシノ / Hoshino",
    "date": "2025-11-14",
    "kind": "guide"
  },
  {
    "id": "HWCDO3hoaJs",
    "title": "見るとダルシムのランクが絶対に上がる動画【スト6】【キャラ対策,コンボ,攻め方】【クラシック,モダン対応】",
    "channel": "たこ煮",
    "date": "2025-10-09",
    "kind": "counter"
  },
  {
    "id": "l19rCIg7P34",
    "title": "【新コンボ対応】最新版！ダルシム実戦コンボ・重要度別まとめ【スト６ダルシム】",
    "channel": "牙キバル@VTuber",
    "date": "2025-06-07",
    "kind": "guide"
  },
  {
    "id": "tjZi_6oLIOc",
    "title": "【ダルシム攻略】覚えれば世界が変わる！オススメ最強連携３選【ダルシム/スト６】",
    "channel": "牙キバル@VTuber",
    "date": "2025-07-20",
    "kind": "guide"
  },
  {
    "id": "YHjHQSLovfo",
    "title": "【SF6/Year4】🔥レジェンドダルシムから学ぶ最新立ち回り〚Torimeshi/YHC-餅/Garnet〛",
    "channel": "SF6キャラ対策リプレイコレクション",
    "date": "2026-08-10",
    "kind": "guide"
  },
  {
    "id": "IrGHcupqb7E",
    "title": "【スト６】15分で使えるダルシム講座！！複雑なキャラを使いこなすコツを解説！【Street Fighter 6】",
    "channel": "いおりチャンネル【スト6講座と対戦動画投稿】",
    "date": "2023-12-17",
    "kind": "guide"
  },
  {
    "id": "RUGr5FyAnjY",
    "title": "【SF6】✨Shakaから学ぶダルシム最新版立ち回り🔥 Latest Strategy from Shaka’s Dhalsim!",
    "channel": "SF6キャラ対策リプレイコレクション",
    "date": "2026-05-16",
    "kind": "guide"
  },
  {
    "id": "JAx6qRSq4gQ",
    "title": "【スト6】ダルシム初中級者向け基礎テクニック10選を解説　マスターすればレジェンドは近い 【～MR1800におすすめ】",
    "channel": "伊予 / I-yo",
    "date": "2024-09-04",
    "kind": "guide"
  },
  {
    "id": "hr-9oQu1EaQ",
    "title": "ダルシム初心者まずこれやれ3選【スト6】 #shorts",
    "channel": "ホシノ / Hoshino",
    "date": "2025-04-16",
    "kind": "guide"
  },
  {
    "id": "BOm97qq-3MU",
    "title": "【スト6】鶏めしさんにダルシムの基礎を教わるにじさんじ唯一のダルシム使いネス君【榊ネス切り抜き/ストリートファイター6/にじさんじ】",
    "channel": "にじホロV【格ゲー切り抜き】",
    "date": "2025-10-06",
    "kind": "guide"
  },
  {
    "id": "aFrcjS8JBRI",
    "title": "【SF6】世界1位ダルシム！立ち回りが完全に職人技ｗｗｗ「YHC-餅:ダルシム(Dhalsim)」【スト6】",
    "channel": "SF6-MODERN",
    "date": "2026-09-06",
    "kind": "guide"
  },
  {
    "id": "ST935BK1D1g",
    "title": "【ダルシム攻略】ダルシムの画面端の防御講座【ダルシム/スト６/切り抜き】",
    "channel": "牙キバル@VTuber",
    "date": "2025-11-21",
    "kind": "guide"
  },
  {
    "id": "9_eRjTN9fHU",
    "title": "【スト６】ダルシム　コンボ・連携まとめ",
    "channel": "さきゅー",
    "date": "2026-10-02",
    "kind": "guide"
  },
  {
    "id": "tMaoXWPbEr4",
    "title": "【SF6】世界1位ダルシム！触れさせぬ間合いを極めし仙人！！「YHC-餅:ダルシム(Dhalsim)」【スト6】",
    "channel": "SF6-MODERN",
    "date": "2026-11-07",
    "kind": "guide"
  },
  {
    "id": "rIm3x8O58Fk",
    "title": "我々ダルシム使いは報われた！強化で全てを手に入れたダルシムから確かな手応えを感じるストーム久保【スト6】",
    "channel": "ストーム久保",
    "date": "2025-06-23",
    "kind": "guide"
  },
  {
    "id": "P-oABVDv0Sw",
    "title": "【スト6】あまりにも鮮やかなダルシムのコンボ 鶏めし (ダルシム) 【ストリートファイター6】",
    "channel": "昇龍拳",
    "date": "2023-12-29",
    "kind": "guide"
  },
  {
    "id": "HF3VTdj-dYo",
    "title": "【SF6】ダルシム 超低コスト確定反撃高火力コンボ！#スト6 #スト6解説",
    "channel": "inaGuile@攻めガイル",
    "date": "2025-09-20",
    "kind": "guide"
  },
  {
    "id": "UCr6o_gIEkk",
    "title": "【スト６】意外と知らないダルシムの初見〇し連携【ダルシム解説】 #ストリートファイター6 #vtuber #dhalsim",
    "channel": "牙キバル@VTuber",
    "date": "2024-11-02",
    "kind": "guide"
  },
  {
    "id": "ZCrausx-uwA",
    "title": "【ダルシム】最強技「下中P」を使いこなせ！コンボ,連携,攻め方を超解説 モダン,クラシック対応【スト6】",
    "channel": "たこ煮",
    "date": "2025-08-08",
    "kind": "guide"
  },
  {
    "id": "NqcR8JMdCGE",
    "title": "【スト6】調整で強化されたダルシムを鶏めしが解説！強すぎて笑いが止まらないｗ",
    "channel": "鶏めしチャンネル",
    "date": "2025-06-07",
    "kind": "guide"
  },
  {
    "id": "feweYO2e4Ho",
    "title": "【ダルシム】出来たら最強な必須技術を解説！　モダンでもクラシックでも使える！　コンボ,立ち回り,セットプレイ等 【スト6】",
    "channel": "たこ煮",
    "date": "2025-01-06",
    "kind": "guide"
  },
  {
    "id": "jj2BcrXP4Tg",
    "title": "【スト６】ダルシムの格好良すぎるコンボ３選【ダルシム解説】 #ストリートファイター6 #vtuber #dhalsim",
    "channel": "牙キバル@VTuber",
    "date": "2024-10-22",
    "kind": "guide"
  },
  {
    "id": "i10KJJFfHOo",
    "title": "【SF6】世界1位ダルシム！触れることさえ許さぬ仙人の領域！！「YHC-餅:ダルシム(Dhalsim)」【スト6】",
    "channel": "SF6-MODERN",
    "date": "2026-10-28",
    "kind": "guide"
  },
  {
    "id": "qqob76aEiQM",
    "title": "【スト６】ひたすら歩け！新しい超ガン攻めダルシムを披露するキバル【ダルシム/切り抜き】",
    "channel": "牙キバル@VTuber",
    "date": "2026-02-06",
    "kind": "guide"
  }
] as const;
export const CHARACTER_VIDEO_DEEP_DHALSIM: VideoSummary[] = candidates.map(({id,title,channel,date,kind})=>({
 id:`preview-dhalsim-${id}`,slug:`preview-dhalsim-${id}`,title,
 platform:"youtube",videoType:kind,publishedAt:date?`${date}T00:00:00Z`:null,
 description:"ダルシム関連の候補動画。現行Patch適合性、出演者・対戦関係は未検証です。",
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],
 characters:["ダルシム"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
