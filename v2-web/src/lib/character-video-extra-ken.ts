import type { VideoSummary } from "@/lib/event-media";
/** ケン Preview research videos. Playback, patch applicability and relations unverified. */
const candidates = [
  {
    "id": "MjlZar5pQno",
    "title": "ケン 強行動・連携・コンボ・起き攻め",
    "date": "2026-01-18",
    "channel": "レイ / Ray",
    "kind": "guide"
  }
] as const;
export const CHARACTER_VIDEO_EXTRA_KEN: VideoSummary[] = candidates.map(({id,title,date,channel,kind}):VideoSummary=>({
 id:`preview-ken-${id}`,slug:`preview-ken-${id}`,title,platform:"youtube",videoType:kind,
 publishedAt:date?`${date}T00:00:00Z`:null,
 description:"ケン動画候補。内容や現行Patch・出演関係は未検証。",
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],
 characters:["ケン"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
