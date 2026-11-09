import type { VideoSummary } from "@/lib/event-media";

/** Batch 01: five manually source-checked official channel character guides.
 * Only for Vercel Preview. This metadata does not grant publication approval,
 * establish Player/Match relations, or verify current patch compatibility.
 * Source for each candidate: the official Street Fighter YouTube video URL.
 */
const candidates = [
  {
    "slug": "jp",
    "name": "JP",
    "id": "ClWYUU7WhTA",
    "date": "2023-05-25",
    "title": "Street Fighter 6 Character Guide | JP"
  },
  {
    "slug": "luke",
    "name": "ルーク",
    "id": "ETI0VifPfaw",
    "date": "2023-05-11",
    "title": "Street Fighter 6 Character Guide | Luke"
  },
  {
    "slug": "jamie",
    "name": "ジェイミー",
    "id": "qg1KoyDiqHI",
    "date": "2023-05-15",
    "title": "Street Fighter 6 Character Guide | Jamie"
  },
  {
    "slug": "chun-li",
    "name": "春麗",
    "id": "seX6oUfwjII",
    "date": "2023-05-14",
    "title": "Street Fighter 6 Character Guide | Chun-Li"
  },
  {
    "slug": "guile",
    "name": "ガイル",
    "id": "xjJaXn45S0E",
    "date": "2023-05-16",
    "title": "Street Fighter 6 Character Guide | Guile"
  }
] as const;

export const CHARACTER_VIDEO_BATCH_01: Readonly<Record<string, VideoSummary[]>> =
  Object.fromEntries(candidates.map(({ slug, name, id, date, title }) => [
    slug,
    [{
      id: `preview-${slug}-${id}`,
      slug: `preview-${slug}-${id}`,
      title,
      platform: "youtube",
      videoType: "guide",
      publishedAt: `${date}T00:00:00Z`,
      description: "ストリートファイター公式のキャラクター基本操作ガイド（公開当時の内容）。現行Patchとの一致は未検証です。",
      url: `https://www.youtube.com/watch?v=${id}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      channelName: "Street Fighter",
      durationSeconds: null,
      language: "en",
      controlTypes: [],
      events: [],
      characters: [name],
      players: [],
      categories: ["guide"],
      level: "unknown",
      viewCount: null,
      viewCountCheckedAt: null,
    } satisfies VideoSummary],
  ]));
