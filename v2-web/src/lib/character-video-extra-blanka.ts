import type { VideoSummary } from "@/lib/event-media";
/** ブランカ Preview research videos. Playback, patch applicability and relations unverified. */
const candidates = [
  {
    "id": "prbgxU9eutc",
    "title": "ブランカ攻め方のリプレイコーチング",
    "date": "2024-11-03",
    "channel": "ぷげら pugera",
    "kind": "match"
  },
  {
    "id": "NOqsClqp4WI",
    "title": "ブランカ 2026年8月調整後の新要素・起き攻め研究配信",
    "date": "2026-08-13",
    "channel": "ACQUA",
    "kind": "guide"
  }
] as const;
export const CHARACTER_VIDEO_EXTRA_BLANKA: VideoSummary[] = candidates.map(({id,title,date,channel,kind}):VideoSummary=>({
 id:`preview-blanka-${id}`,slug:`preview-blanka-${id}`,title,platform:"youtube",videoType:kind,
 publishedAt:date?`${date}T00:00:00Z`:null,
 description:"ブランカ動画候補。内容や現行Patch・出演関係は未検証。",
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],
 characters:["ブランカ"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
