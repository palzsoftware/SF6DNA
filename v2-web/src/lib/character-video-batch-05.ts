import type { VideoSummary } from "@/lib/event-media";
/** Batch 05: manually matched official Street Fighter YouTube video IDs; Preview only. */
const candidates = [
  {
    "slug": "akuma",
    "name": "豪鬼",
    "id": "SIPTOVx6pls",
    "date": "2024-05-09",
    "title": "Street Fighter 6 Character Guide | Akuma"
  },
  {
    "slug": "m-bison",
    "name": "ベガ",
    "id": "oT1SLN39OiI",
    "date": "2024-06-18",
    "title": "Street Fighter 6 Character Guide | M. Bison"
  },
  {
    "slug": "terry",
    "name": "テリー",
    "id": "qQnF07Owwd8",
    "date": "2024-09-16",
    "title": "Street Fighter 6 Character Guide | Terry"
  },
  {
    "slug": "mai",
    "name": "舞",
    "id": "g31J9y8usSs",
    "date": "2025-01-27",
    "title": "Street Fighter 6 Character Guide | Mai"
  },
  {
    "slug": "elena",
    "name": "エレナ",
    "id": "nlnv52mGbL0",
    "date": "2025-05-20",
    "title": "Street Fighter 6 Character Guide | Elena"
  }
] as const;
export const CHARACTER_VIDEO_BATCH_05: Readonly<Record<string, VideoSummary[]>> =
Object.fromEntries(candidates.map(({slug,name,id,date,title})=>[slug,[{
 id:`preview-${slug}-${id}`,slug:`preview-${slug}-${id}`,title,
 platform:"youtube",videoType:"guide",publishedAt:`${date}T00:00:00Z`,
 description:"公式キャラクターガイド。収録時点の技性能です。現行Patchへの対応は未検証です。",
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:"Street Fighter",durationSeconds:null,language:"en",controlTypes:[],events:[],characters:[name],players:[],
 categories:["guide"],level:"unknown",viewCount:null,viewCountCheckedAt:null,
} satisfies VideoSummary]]));
