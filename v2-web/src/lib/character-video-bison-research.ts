import type { VideoSummary } from "@/lib/event-media";
/** M. Bison (ベガ) research intake: counter videos target Vega, irrespective of player character. Preview only, not publish-approved. */
const candidates = [
  {
    "id": "HQ4iK6pO2dw",
    "title": "【スト6】ベガ対策",
    "channel": "ACQUA",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=HQ4iK6pO2dw"
  },
  {
    "id": "X_YjomGhFOM",
    "title": "【キャラ対策】レジェンドJPが実戦付きでベガ戦を解説",
    "channel": "なんでねー",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=X_YjomGhFOM"
  },
  {
    "id": "6wc9rJcGq2c",
    "title": "The COMPLETE M. Bison Guide – Combos, Gameplan, & Setups | SF6",
    "channel": "qian",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=6wc9rJcGq2c"
  },
  {
    "id": "2DoeQ5_0ZjI",
    "title": "M. Bison Guide: Essential Combos and Set-plays",
    "channel": "rari",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=2DoeQ5_0ZjI"
  },
  {
    "id": "opQB8Sj_5I8",
    "title": "SF6: M Bison Optimal Combos Part 1",
    "channel": "Killerex100",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=opQB8Sj_5I8"
  },
  {
    "id": "Z8zju67aPSw",
    "title": "M. Bison Season 4 Buffs + New Optimal Combos",
    "channel": "qian",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=Z8zju67aPSw"
  },
  {
    "id": "ZAaIhxvd6wI",
    "title": "Pro player tips to beat M. Bison",
    "channel": "Chris_F",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=ZAaIhxvd6wI"
  }
] as const;

export const CHARACTER_VIDEO_BISON_RESEARCH: VideoSummary[] = candidates.map(({id,title,channel,kind,source}): VideoSummary => ({
 id:`preview-m-bison-${id}`,slug:`preview-m-bison-${id}`,title,platform:"youtube",videoType:kind,publishedAt:null,
 description:`${kind === "counter" ? "ベガへの対策動画。" : "ベガの使い方・解説動画。"} 出典: ${source}。動画再生・内容詳細・現行Patchとの適合性・公開承認は未検証です。`,
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,channelName:channel,
 durationSeconds:null,language:null,controlTypes:[],events:[],characters:["ベガ"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
