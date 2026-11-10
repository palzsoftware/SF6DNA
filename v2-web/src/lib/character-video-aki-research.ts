import type { VideoSummary } from "@/lib/event-media";
/** A.K.I. source-traced videos, Preview-only. Patch, gameplay and playback verification pending. */
const candidates = [
  {
    "id": "AA0O7ZR_MFU",
    "title": "2026年1月版A.K.I.コンボ集",
    "channel": "ちょくじゅ",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=AA0O7ZR_MFU"
  },
  {
    "id": "CEv4vRv6rzg",
    "title": "A.K.I.強化後のコンボ研究",
    "channel": "ストーム久保",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=CEv4vRv6rzg"
  },
  {
    "id": "amLZptGY4G0",
    "title": "ひかる A.K.I. 高レベル対戦・毒を使う展開",
    "channel": "SF6-MODERN",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=amLZptGY4G0"
  },
  {
    "id": "2kBkizvG7eM",
    "title": "How to play A.K.I in SF6 - A Complete Guide",
    "channel": "Broski",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=2kBkizvG7eM"
  },
  {
    "id": "ApDAuGnwEvY",
    "title": "Broski A.K.I. 高レベル対戦とコンボ",
    "channel": "SF6-MODERN",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=ApDAuGnwEvY"
  },
  {
    "id": "gDv7DUtECVk",
    "title": "ひかる A.K.I. vs あくたがわ マノン",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=gDv7DUtECVk"
  },
  {
    "id": "Oo6LTXs1GeA",
    "title": "ひかる A.K.I. 新環境の対戦リプレイ",
    "channel": "SF6-MODERN",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=Oo6LTXs1GeA"
  },
  {
    "id": "wPjdzuf1Z3w",
    "title": "ひかる A.K.I. vs YAS リュウ",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=wPjdzuf1Z3w"
  },
  {
    "id": "8EhRVlqc0nM",
    "title": "ひかる A.K.I. vs かずのこ アルジュン",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=8EhRVlqc0nM"
  },
  {
    "id": "7RiZ0p3h5hA",
    "title": "SFL2026 ガチくん ラシード vs ひかる A.K.I.",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=7RiZ0p3h5hA"
  },
  {
    "id": "Vi0lUTPCUMw",
    "title": "SFL2026 ふ～ど エド vs ひかる A.K.I.",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=Vi0lUTPCUMw"
  },
  {
    "id": "j7MAQsGE2es",
    "title": "ひかる A.K.I. 高レベル対戦・猛毒展開",
    "channel": "SF6-MODERN",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=j7MAQsGE2es"
  }
] as const;
export const CHARACTER_VIDEO_AKI_RESEARCH: VideoSummary[] = candidates.map(({id,title,channel,kind,source}): VideoSummary => ({
 id:`preview-aki-${id}`,slug:`preview-aki-${id}`,title,platform:"youtube",videoType:kind,publishedAt:null,
 description:`A.K.I.関連研究候補。出典: ${source}。再生・内容・現行Patch・公開適格性は未検証です。`,
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],characters:["A.K.I."],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
