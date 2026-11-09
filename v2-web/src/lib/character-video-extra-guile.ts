import type { VideoSummary } from "@/lib/event-media";
/** ガイル supplementary Preview-only video candidates; source title/ID checked.
 * Patch, gameplay, associations, and exact timestamp unverified.
 */
const candidates = [
  {
    "id": "HKsUCKttng8",
    "title": "ひぐち（ガイル）vs ガチくん（ラシード）",
    "date": "2026-06-18",
    "channel": "SF6 RANKED MATCH",
    "kind": "match"
  },
  {
    "id": "YdeCxoxOY24",
    "title": "NuckleDu ガイル対戦リプレイ",
    "date": "2025-05-09",
    "channel": "スト6 Best Legend Replays",
    "kind": "match"
  },
  {
    "id": "qz0VrcXlafU",
    "title": "NuckleDu vs ひぐち ガイル同キャラ対戦",
    "date": "2024-01-10",
    "channel": "昇龍拳",
    "kind": "match"
  },
  {
    "id": "QnOMeRrykos",
    "title": "シュウジ（ガイル）vs ボンちゃん（サガット）",
    "date": "2026-04-12",
    "channel": "GUILESGARDEN",
    "kind": "match"
  },
  {
    "id": "4efjCFa9IIQ",
    "title": "豪鬼使い向けガイル対策3選",
    "date": "2025-12-16",
    "channel": "南風カイ",
    "kind": "counter"
  }
] as const;
export const CHARACTER_VIDEO_EXTRA_GUILE: VideoSummary[] = candidates.map(({id,title,date,channel,kind}):VideoSummary=>({
 id:`preview-guile-${id}`,slug:`preview-guile-${id}`,title,platform:"youtube",videoType:kind,
 publishedAt:date?`${date}T00:00:00Z`:null,
 description:"ガイルの関連候補。動画内容・現行Patch・対戦関連は未検証です。",
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],
 characters:["ガイル"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
