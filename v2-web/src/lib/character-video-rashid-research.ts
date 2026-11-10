import type { VideoSummary } from "@/lib/event-media";
/** Source-traced Rashid research candidates. Preview only; footage, playback, patch and publication unverified. */
const candidates = [
  {
    "id": "K7-u1zEnYH0",
    "title": "ラシード実用コンボとセットプレイ 2025",
    "channel": "(つ)の。",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=K7-u1zEnYH0"
  },
  {
    "id": "rNnuiLlRtAM",
    "title": "Rashid Drive Impact Combo Guide",
    "channel": "4shika / Yoshika",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=rNnuiLlRtAM"
  },
  {
    "id": "lZFUCcnlGaI",
    "title": "ラシード初心者向けコンボ解説",
    "channel": "4shika / Yoshika",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=lZFUCcnlGaI"
  },
  {
    "id": "nmGiVtXAoIU",
    "title": "SF6 Rashid Guide How to Play",
    "channel": "iZonk Gaming",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=nmGiVtXAoIU"
  },
  {
    "id": "GfiAyBbRi_A",
    "title": "ラシード 2026年3月調整後 新コンボとセットプレイ14選",
    "channel": "doskonnbu",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=GfiAyBbRi_A"
  },
  {
    "id": "Z4YIDeIBLOQ",
    "title": "ガチくん ラシードのワールの使い方",
    "channel": "ガチくん / Gachikun",
    "kind": "guide",
    "source": "https://yutura.net/channel/75894/popular/Z4YIDeIBLOQ/"
  },
  {
    "id": "w7vv5PgPZ_8",
    "title": "SFL2026 ガチくん（ラシード）vs 水派（キャミィ）",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://yutura.net/channel/47625/video/w7vv5PgPZ_8/"
  },
  {
    "id": "7RiZ0p3h5hA",
    "title": "SFL2026 ガチくん（ラシード）vs ひかる（A.K.I.）",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://yutura.net/channel/47625/video/7RiZ0p3h5hA/"
  },
  {
    "id": "Ah0gA9-6MZE",
    "title": "SFL2026 ガチくん（ラシード）vs ウメハラ（豪鬼）",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://yutura.net/channel/47625/video/Ah0gA9-6MZE/"
  },
  {
    "id": "mG8-IK9Fgf4",
    "title": "ラシード コーチング ガチくんと渋谷ハル",
    "channel": "渋谷ハル",
    "kind": "guide",
    "source": "https://yutura.net/channel/16596/video/mG8-IK9Fgf4/"
  },
  {
    "id": "pdchpOT_Xls",
    "title": "Ultimate Rashid Beginner Guide",
    "channel": "UltraSnance",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=pdchpOT_Xls"
  },
  {
    "id": "_5nUpsLmWvk",
    "title": "SF6 Ultra High Level Rashid Showcase",
    "channel": "Xuses",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=_5nUpsLmWvk"
  }
] as const;

export const CHARACTER_VIDEO_RASHID_RESEARCH: VideoSummary[] = candidates.map(({id,title,channel,kind,source}): VideoSummary => ({
  id: `preview-rashid-${id}`,
  slug: `preview-rashid-${id}`,
  title,
  platform: "youtube",
  videoType: kind,
  publishedAt: null,
  description: `ラシード関連研究候補。出典: ${source}。再生・収録内容・現行Patch・公開適格性は未検証です。`,
  url: `https://www.youtube.com/watch?v=${id}`,
  thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  channelName: channel,
  durationSeconds: null,
  language: null,
  controlTypes: [],
  events: [],
  characters: ["ラシード"],
  players: [],
  categories: [kind],
  level: "unknown",
  viewCount: null,
  viewCountCheckedAt: null,
}));
