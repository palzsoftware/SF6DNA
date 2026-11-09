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
