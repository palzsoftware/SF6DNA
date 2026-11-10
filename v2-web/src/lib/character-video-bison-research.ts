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
  },
  {
    "id": "2r5igavLYkM",
    "title": "How To Play Modern M. Bison! Street Fighter 6",
    "channel": "Hidden Juice Village ASAP Dream",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=2r5igavLYkM"
  },
  {
    "id": "1TSnZ1zEOVw",
    "title": "2026版Mベガコンボ・起き攻め解説",
    "channel": "キラのスト6研究所",
    "kind": "guide",
    "source": "https://sf6-genten.com/article/vega-combo-modern-starters-and-okizeme-kira"
  },
  {
    "id": "8Hc7JUOHjC8",
    "title": "Classic M.BISON Combos & Setup guide",
    "channel": "Joe Ebios",
    "kind": "guide",
    "source": "https://sf6-genten.com/article/vega-okizeme-classic-backfist-setups-joe-ebios"
  },
  {
    "id": "qq0MoFNAdHo",
    "title": "ベガ対策（エレナ視点）",
    "channel": "せいち",
    "kind": "counter",
    "source": "https://sf6-genten.com/article/vega-matchup-elena-side-seichi"
  },
  {
    "id": "lQiOwAlk0oQ",
    "title": "14分でわかるベガ対策（ベガミラー）",
    "channel": "大車輪",
    "kind": "counter",
    "source": "https://sf6-genten.com/article/vega-matchup-mirror-daisharin"
  },
  {
    "id": "9BPh_hSCWEo",
    "title": "テリー使いのベガ対策まとめ",
    "channel": "holosokuのスト6攻略チャンネル",
    "kind": "counter",
    "source": "https://sf6-genten.com/article/terry-matchup-vega-holosoku"
  },
  {
    "id": "KqiX1cVYn4k",
    "title": "モダンエドから見たベガ対策",
    "channel": "モダンエド専門学校",
    "kind": "counter",
    "source": "https://sf6-genten.com/article/vega-matchup-from-modern-ed-side-modern-ed-school"
  },
  {
    "id": "wk0LAcG2SdI",
    "title": "使い手によるベガ対策講座",
    "channel": "KGS Phoenix",
    "kind": "counter",
    "source": "https://sf6-genten.com/article/vega-matchup-anti-vega-lecture-kgsphoenix"
  },
  {
    "id": "memXkRESe1E",
    "title": "MR2100に教わるベガ対策（エド視点）",
    "channel": "KtR_こーたろー",
    "kind": "counter",
    "source": "https://sf6-genten.com/article/vega-matchup-ed-side-elliot-ktr"
  },
  {
    "id": "82AFgXpp7NQ",
    "title": "鬼の攻めを凌げ！ベガ対策の初歩（マノン視点）",
    "channel": "GANAKEN",
    "kind": "counter",
    "source": "https://sf6-genten.com/article/vega-matchup-manon-side-basics-ganaken"
  },
  {
    "id": "zBn_ZMK5ds4",
    "title": "ベガ対策完全版 Year4対応",
    "channel": "スト6初心者応援チャンネル",
    "kind": "counter",
    "source": "https://sf6-genten.com/article/vega-matchup-year4-anti-vega-guide-ecu1"
  }
] as const;

export const CHARACTER_VIDEO_BISON_RESEARCH: VideoSummary[] = candidates.map(({id,title,channel,kind,source}): VideoSummary => ({
 id:`preview-m-bison-${id}`,slug:`preview-m-bison-${id}`,title,platform:"youtube",videoType:kind,publishedAt:null,
 description:`${kind === "counter" ? "ベガへの対策動画。" : "ベガの使い方・解説動画。"} 出典: ${source}。動画再生・内容詳細・現行Patchとの適合性・公開承認は未検証です。`,
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,channelName:channel,
 durationSeconds:null,language:null,controlTypes:[],events:[],characters:["ベガ"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
