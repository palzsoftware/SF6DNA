import type { VideoSummary } from "@/lib/event-media";
/** キンバリー supplementary Preview-only video candidates; source title/ID checked.
 * Patch, gameplay, associations, and exact timestamp unverified.
 */
const candidates = [
  {
    "id": "sVBQ0-fQImQ",
    "title": "キンバリーの基本コンボと起き攻めを紹介！",
    "date": "2025-04-10",
    "channel": "なお",
    "kind": "guide"
  },
  {
    "id": "Gx3n7EXMlJU",
    "title": "tako キンバリー対戦リプレイ",
    "date": "2026-02-08",
    "channel": "スト6 Best Legend Replays",
    "kind": "match"
  }
] as const;
export const CHARACTER_VIDEO_EXTRA_KIMBERLY: VideoSummary[] = candidates.map(({id,title,date,channel,kind}):VideoSummary=>({
 id:`preview-kimberly-${id}`,slug:`preview-kimberly-${id}`,title,platform:"youtube",videoType:kind,
 publishedAt:date?`${date}T00:00:00Z`:null,
 description:"キンバリーの関連候補。動画内容・現行Patch・対戦関連は未検証です。",
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],
 characters:["キンバリー"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
