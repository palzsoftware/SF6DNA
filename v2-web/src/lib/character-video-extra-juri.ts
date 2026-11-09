import type { VideoSummary } from "@/lib/event-media";
/** ジュリ Preview research videos. Playback, patch applicability and relations unverified. */
const candidates = [
  {
    "id": "VxNPa3YYaOU",
    "title": "ジュリ 画面端のセットプレイ",
    "date": null,
    "channel": "よっさん",
    "kind": "guide"
  },
  {
    "id": "C59flPo3sA8",
    "title": "ジュリ 持続重ね起き攻め",
    "date": null,
    "channel": "よっさん",
    "kind": "guide"
  }
] as const;
export const CHARACTER_VIDEO_EXTRA_JURI: VideoSummary[] = candidates.map(({id,title,date,channel,kind}):VideoSummary=>({
 id:`preview-juri-${id}`,slug:`preview-juri-${id}`,title,platform:"youtube",videoType:kind,
 publishedAt:date?`${date}T00:00:00Z`:null,
 description:"ジュリ動画候補。内容や現行Patch・出演関係は未検証。",
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],
 characters:["ジュリ"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
