import type { VideoSummary } from "@/lib/event-media";
/** Preview research batch 04. Channel and video URL are source-derived, not release approval. */
const candidates = [
  {
    "slug": "lily",
    "name": "リリー",
    "id": "IXKkpq45c0c",
    "date": "2023-05-30",
    "title": "Street Fighter 6 Character Guide | Lily",
    "channel": "GameSpot Trailers"
  },
  {
    "slug": "cammy",
    "name": "キャミィ",
    "id": "u-CHmzZ9z-8",
    "date": "2023-05-28",
    "title": "Street Fighter 6 Character Guide | Cammy",
    "channel": "Street Fighter"
  },
  {
    "slug": "rashid",
    "name": "ラシード",
    "id": "c2U3nex-8C4",
    "date": "2023-07-17",
    "title": "Street Fighter 6 Character Guide | Rashid",
    "channel": "Street Fighter"
  },
  {
    "slug": "aki",
    "name": "A.K.I.",
    "id": "Yva_TJaMfrk",
    "date": "2023-09-18",
    "title": "Street Fighter 6 Character Guide | A.K.I.",
    "channel": "Street Fighter"
  },
  {
    "slug": "ed",
    "name": "エド",
    "id": "TqumE_S5jUs",
    "date": "2024-02-15",
    "title": "Street Fighter 6 Character Guide | Ed",
    "channel": "Street Fighter"
  }
] as const;
export const CHARACTER_VIDEO_BATCH_04: Readonly<Record<string, VideoSummary[]>> =
Object.fromEntries(candidates.map(({slug,name,id,date,title,channel})=>[slug,[{
 id:`preview-${slug}-${id}`,slug:`preview-${slug}-${id}`,title,
 platform:"youtube",videoType:"guide",publishedAt:`${date}T00:00:00Z`,
 description:"基本操作・技紹介の動画候補。収録時点の内容です。現行Patch適合性は未検証です。",
 url:`https://www.youtube.com/watch?v=${id}`,
 thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:"en",controlTypes:[],events:[],characters:[name],players:[],
 categories:["guide"],level:"unknown",viewCount:null,viewCountCheckedAt:null,
} satisfies VideoSummary]]));
