import type { VideoSummary } from "@/lib/event-media";
/** Video IDs sourced from YouTube listings or publisher indexes. Candidate-only:
 * playback, content relevance in full, and patch compatibility are not tested. */
const candidates = [
  [
    "544i4qOnC2U",
    "STREET FIGHTER 6 MARISA COMBOS! Starter Combo Guide",
    "VesperArcade",
    "guide"
  ],
  [
    "Tpnb-bzkdE0",
    "Modern Marisa Combos STARTER GUIDE (Season 3)",
    "Fem!Shep",
    "guide"
  ],
  [
    "BZoam-rO1A0",
    "SF6 Marisa Guide - How to play Marisa",
    "iZonk Gaming",
    "guide"
  ],
  [
    "vPdrBCK5P_4",
    "マリーザ対策 最新版 立ち回り・攻め方",
    "スト6初心者応援チャンネル",
    "counter"
  ],
  [
    "5Yy3LK6Kano",
    "他キャラやってたらマリーザのMRが200下がったランクマ",
    "アゴアニキ",
    "match"
  ],
  [
    "2-Si_BO-llY",
    "マリーザの調整・新しい性能を検証するShuto",
    "しゅーとチャンネル",
    "guide"
  ],
  [
    "NyPwNAv6tE8",
    "マリーザの対戦・ゆっくり実況「インテリゴリラ」",
    "にしうりのゆっくりちゃんねる",
    "match"
  ],
  [
    "7FihGFOQpBo",
    "SHAKAとおぼのマリーザ・マノン対戦まとめ",
    "SHAKA Ad Channel",
    "match"
  ],
  [
    "SvwOk6ut-1E",
    "ACQUA講座 マリーザ対策：ファランクスとグラディウス",
    "ACQUA",
    "counter"
  ],
  [
    "OWdWrNH8Zrk",
    "レイのマリーザ対策解説",
    "レイ / Ray",
    "counter"
  ],
  [
    "hVCvPS2Q8K4",
    "マリーザ セットプレイまとめ",
    "投稿者未確認",
    "guide"
  ],
  [
    "ZDAKC2CbGRQ",
    "マリーザ シーズン2セットプレイ",
    "投稿者未確認",
    "guide"
  ],
  [
    "tbLajAzANrY",
    "【スト６】１５分で使えるマリーザ講座！！このキャラで重要な技は〇〇！！",
    "いおりチャンネル",
    "guide"
  ],
  [
    "liZq7lIszWY",
    "マリーザのODスクトゥム、実は簡単に対策できます",
    "いおりチャンネル",
    "counter"
  ],
  [
    "66iA4izlnO4",
    "【スト6】マリーザ 実戦向けコンボ 起き攻め セットプレイ SF6 Marisa Combo Oki Setup",
    "レイ / Ray",
    "guide"
  ],
  [
    "BIp_UORpVeU",
    "【スト6】MR2100↑マリーザ セットプレイ 起き攻め まとめ",
    "レイ / Ray",
    "guide"
  ],
  [
    "E2_puFqlSCQ",
    "MR2000台 レジェ行ってネタだけじゃない所を見せるランクマ【マリーザ】",
    "アゴアニキ",
    "match"
  ],
  [
    "yYdPnyk6qVQ",
    "SF6 MARISA COMBO LEVEL 3",
    "Street Fighter X",
    "guide"
  ],
  [
    "lE9thzmWLF8",
    "シュート直伝マリーザの削り連携を釈迦に伝授",
    "しゅーとチャンネル / Shuto",
    "guide"
  ],
  [
    "7bmeZ0s0RzE",
    "Cマリーザ触ってみんねん",
    "蝶屋はなび / Choya Hanabi",
    "guide"
  ],
  [
    "sppiv-cbDXQ",
    "Cマリーザ練習すんで",
    "蝶屋はなび / Choya Hanabi",
    "guide"
  ],
  [
    "oafJEgtlN70",
    "原点Mマリ！カスタム無限募",
    "蝶屋はなび / Choya Hanabi",
    "match"
  ],
  [
    "gphX0wPOmqQ",
    "ハイマスもどるぞおおおおお（マリーザ対戦）",
    "蝶屋はなび / Choya Hanabi",
    "match"
  ],
  [
    "DrB1cIPIACI",
    "マリーザの誕生日にハイマスに舞い戻る蝶屋はなび",
    "お嬢様やあらへんで!!",
    "match"
  ],
  [
    "alDZ1AbSGUI",
    "Marisa's Best Moments 2026",
    "のぶのゲーマー日記",
    "guide"
  ],
  [
    "WyivztxXrlY",
    "MARISA Combo Guide (Modern Controls)",
    "ahmz1404",
    "guide"
  ]
] as const;
export const CHARACTER_VIDEO_MARISA_RESEARCH: VideoSummary[] = candidates.map(([id,title,channel,kind]): VideoSummary => ({
 id:`preview-marisa-${id}`,slug:`preview-marisa-${id}`,
 title,platform:"youtube",videoType:kind,publishedAt:null,
 description:"マリーザの動画候補。現行Patchと映像再生、出演者・内容の完全照合は未検証。",
 url:`https://www.youtube.com/watch?v=${id}`,
 thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],
 characters:["マリーザ"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
