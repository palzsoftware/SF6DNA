import type { VideoSummary } from "@/lib/event-media";
/** 春麗 supplementary Preview-only video candidates; source title/ID checked.
 * Patch, gameplay, associations, and exact timestamp unverified.
 */
const candidates = [
  {
    "id": "t89SGRsimt0",
    "title": "春麗対策３選",
    "date": "2026-01-24",
    "channel": "【スト6】ずんだもんふぁいたーch【解説】",
    "kind": "counter"
  },
  {
    "id": "2cdBStphbAc",
    "title": "春麗の小パン中足スピバの重要性を語るハイタニ",
    "date": "2026-02-04",
    "channel": "ハイタニ TV",
    "kind": "guide"
  },
  {
    "id": "pThBaN0nsfQ",
    "title": "もけ VS GO1 春麗同キャラ対決",
    "date": "2025-01-09",
    "channel": "GO1チャンネル",
    "kind": "match"
  },
  {
    "id": "CyPETZOZCzM",
    "title": "GO1 モダン春麗の対戦まとめ",
    "date": "2025-06-15",
    "channel": "GO1チャンネル",
    "kind": "match"
  },
  {
    "id": "8kD84a1DqFg",
    "title": "春麗 翼旋起き攻め解説",
    "date": "2026-10-02",
    "channel": "Replica / Esportsキャスター",
    "kind": "guide"
  },
  {
    "id": "afnhqx1HkHg",
    "title": "春麗を始めたい人向けのハイタニ解説",
    "date": "2025-03-21",
    "channel": "ハイタニ TV",
    "kind": "guide"
  },
  {
    "id": "IPK18VP6W4g",
    "title": "春麗の連携と対策 MR1900春麗による解説",
    "date": "2026-05-23",
    "channel": "スライム@全力VTuber",
    "kind": "counter"
  },
  {
    "id": "wCowD3sW5WE",
    "title": "春麗 立ち強P確認の練習方法",
    "date": "2026-08-25",
    "channel": "Seiya /おわえちゃん",
    "kind": "guide"
  },
  {
    "id": "3vQ_1VWYcNQ",
    "title": "今日から始める春麗講座",
    "date": "2025-03-09",
    "channel": "うりょ",
    "kind": "guide"
  },
  {
    "id": "uRFk6xks7K4",
    "title": "春麗戦でやってはいけないNG行動5選",
    "date": "2024-08-06",
    "channel": "SmashlogTV - SF6",
    "kind": "guide"
  },
  {
    "id": "2QIFuO3NyG0",
    "title": "春麗 背中蹴り対策",
    "date": "2026-09-25",
    "channel": "KakuhanApp",
    "kind": "counter"
  },
  {
    "id": "ORcKPwnLVyY",
    "title": "クラシック春麗 よくある状況のセットプレイ",
    "date": "2026-06-30",
    "channel": "まんじゅう",
    "kind": "guide"
  },
  {
    "id": "IuuYnA-sarE",
    "title": "ひぐち（ガイル）vs GO1（春麗）SFL2025",
    "date": "2025-11-12",
    "channel": "Capcom Fighters JP",
    "kind": "match"
  },
  {
    "id": "FgLeTcvM9Nw",
    "title": "Leshar（アレックス）vs ハイタニ（春麗）",
    "date": "2026-04-14",
    "channel": "Stremphoenix",
    "kind": "match"
  },
  {
    "id": "KraWpg6lhcg",
    "title": "ハイタニ春麗対戦リプレイ",
    "date": "2026-09-29",
    "channel": "SF6-MODERN",
    "kind": "match"
  },
  {
    "id": "NVRd0YzwWEU",
    "title": "Seiya春麗 ふみふみコンボ",
    "date": "2026-01-18",
    "channel": "Seiya /おわえちゃん",
    "kind": "guide"
  },
  {
    "id": "QfgVPfoSMWI",
    "title": "Seiya春麗の地上戦",
    "date": "2026-08-19",
    "channel": "SF6-MODERN",
    "kind": "guide"
  },
  {
    "id": "bDeIPL6BVPQ",
    "title": "ハイタニ春麗対戦動画",
    "date": "2026-09-12",
    "channel": "SF6-MODERN",
    "kind": "match"
  }
] as const;
export const CHARACTER_VIDEO_EXTRA_CHUN_LI: VideoSummary[] = candidates.map(({id,title,date,channel,kind}):VideoSummary=>({
 id:`preview-chun-li-${id}`,slug:`preview-chun-li-${id}`,title,platform:"youtube",videoType:kind,
 publishedAt:date?`${date}T00:00:00Z`:null,
 description:"春麗の関連候補。動画内容・現行Patch・対戦関連は未検証です。",
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],
 characters:["春麗"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
