import type { VideoSummary } from "@/lib/event-media";
/** Batch 06: six source-checked character guide videos; Preview candidates only.
 * Sagat: Official Capcom Europe; Arjun: PlayStation; others: Street Fighter.
 */
const candidates = [
  {
    "slug": "sagat",
    "name": "サガット",
    "id": "9JEBORJuKfw",
    "date": "2025-07-30",
    "title": "Street Fighter 6 Character Guide | Sagat",
    "channel": "Official Capcom Europe"
  },
  {
    "slug": "c-viper",
    "name": "C.ヴァイパー",
    "id": "NKH8jAkt_8Y",
    "date": "2025-09-30",
    "title": "Street Fighter 6 Character Guide | C. Viper",
    "channel": "Street Fighter"
  },
  {
    "slug": "alex",
    "name": "アレックス",
    "id": "e-xXJ-uzIHI",
    "date": "2026-03-03",
    "title": "Street Fighter 6 Character Guide | Alex",
    "channel": "Street Fighter"
  },
  {
    "slug": "ingrid",
    "name": "イングリッド",
    "id": "Rdlx9Ick920",
    "date": "2026-05-21",
    "title": "Street Fighter 6 Character Guide | Ingrid",
    "channel": "Street Fighter"
  },
  {
    "slug": "yasmine",
    "name": "ヤスミン",
    "id": "M7NfqAcU7KI",
    "date": "2026-07-23",
    "title": "Street Fighter 6 Character Guide | Yasmine",
    "channel": "Street Fighter"
  },
  {
    "slug": "arjun",
    "name": "アルジュン",
    "id": "yZrFKutY_6I",
    "date": "2026-10-02",
    "title": "Street Fighter 6 - Character Guide: Arjun | PS5 & PS4 Games",
    "channel": "PlayStation"
  }
] as const;
export const CHARACTER_VIDEO_BATCH_06: Readonly<Record<string, VideoSummary[]>> =
Object.fromEntries(candidates.map(({slug,name,id,date,title,channel})=>[slug,[{
 id:`preview-${slug}-${id}`,slug:`preview-${slug}-${id}`,title,
 platform:"youtube",videoType:"guide",publishedAt:`${date}T00:00:00Z`,
 description:"キャラクターガイド動画の検証候補。公開当時の解説であり、現行Patch適合性やPlayer関連付けは未検証です。",
 url:`https://www.youtube.com/watch?v=${id}`,
 thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:"en",controlTypes:[],events:[],
 characters:[name],players:[],categories:["guide"],level:"unknown",viewCount:null,viewCountCheckedAt:null,
} satisfies VideoSummary]]));
