import type { VideoSummary } from "@/lib/event-media";
/** Batch 03: five source-checked official guides; Preview-only candidates. */
const candidates = [
  {
    "slug": "e-honda",
    "name": "E.本田",
    "id": "knPaBQmrfjo",
    "date": "2023-05-21",
    "title": "Street Fighter 6 Character Guide | E. Honda"
  },
  {
    "slug": "deejay",
    "name": "ディージェイ",
    "id": "GUDRAkoriD4",
    "date": "2023-05-22",
    "title": "Street Fighter 6 Character Guide | Dee Jay"
  },
  {
    "slug": "manon",
    "name": "マノン",
    "id": "On9nmbUvCTw",
    "date": "2023-05-23",
    "title": "Street Fighter 6 Character Guide | Manon"
  },
  {
    "slug": "marisa",
    "name": "マリーザ",
    "id": "kZiy7hkBPIY",
    "date": "2023-05-24",
    "title": "Street Fighter 6 Character Guide | Marisa"
  },
  {
    "slug": "zangief",
    "name": "ザンギエフ",
    "id": "zj213DBy0TY",
    "date": "2023-05-26",
    "title": "Street Fighter 6 Character Guide | Zangief"
  }
] as const;
export const CHARACTER_VIDEO_BATCH_03: Readonly<Record<string, VideoSummary[]>> =
 Object.fromEntries(candidates.map(({slug,name,id,date,title}) => [slug,[{
  id: `preview-${slug}-${id}`,slug:`preview-${slug}-${id}`,title,
  platform:"youtube",videoType:"guide",publishedAt:`${date}T00:00:00Z`,
  description:"ストリートファイター公式のキャラクター基本操作ガイド。現行Patch適合性は未検証です。",
  url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  channelName:"Street Fighter",durationSeconds:null,language:"en",controlTypes:[],events:[],
  characters:[name],players:[],categories:["guide"],level:"unknown",viewCount:null,viewCountCheckedAt:null,
 } satisfies VideoSummary]]));
