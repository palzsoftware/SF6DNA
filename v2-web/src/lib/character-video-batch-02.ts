import type { VideoSummary } from "@/lib/event-media";
/** Batch 02: reviewed official Street Fighter YouTube guide IDs, Preview only. */
const candidates = [
  {
    "slug": "kimberly",
    "name": "キンバリー",
    "id": "OEWHuUzI1Os",
    "date": "2023-05-12",
    "title": "Street Fighter 6 Character Guide | Kimberly"
  },
  {
    "slug": "juri",
    "name": "ジュリ",
    "id": "E3i6ZOWJ2Ng",
    "date": "2023-05-17",
    "title": "Street Fighter 6 Character Guide | Juri"
  },
  {
    "slug": "ken",
    "name": "ケン",
    "id": "1SX2m7sqbtA",
    "date": "2023-05-18",
    "title": "Street Fighter 6 Character Guide | Ken"
  },
  {
    "slug": "blanka",
    "name": "ブランカ",
    "id": "iK1QFKraQqA",
    "date": "2023-05-19",
    "title": "Street Fighter 6 Character Guide | Blanka"
  },
  {
    "slug": "dhalsim",
    "name": "ダルシム",
    "id": "eiK61LHLLm8",
    "date": "2023-05-20",
    "title": "Street Fighter 6 Character Guide | Dhalsim"
  }
] as const;
export const CHARACTER_VIDEO_BATCH_02: Readonly<Record<string, VideoSummary[]>> =
  Object.fromEntries(candidates.map(({slug,name,id,date,title}) => [slug,[{
    id: `preview-${slug}-${id}`, slug: `preview-${slug}-${id}`, title,
    platform: "youtube", videoType: "guide",
    publishedAt: `${date}T00:00:00Z`,
    description: "ストリートファイター公式によるキャラクター基本操作ガイド。現行Patch適合性、関連プレイヤーは未検証です。",
    url: `https://www.youtube.com/watch?v=${id}`,
    thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    channelName: "Street Fighter", durationSeconds: null, language: "en",
    controlTypes: [], events: [], characters: [name], players: [],
    categories: ["guide"], level: "unknown", viewCount: null, viewCountCheckedAt: null,
  } satisfies VideoSummary]]));
