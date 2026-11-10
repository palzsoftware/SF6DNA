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
  },
  {
    "id": "4zdoJFZnF58",
    "title": "レジェンド帯におけるセットプレイの考え方",
    "channel": "doskonnbu",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=4zdoJFZnF58"
  },
  {
    "id": "ffl2j1zL10M",
    "title": "Year3対応 ガチくんが愛用するラシードコンボ",
    "channel": "ガチくん /Gachikun",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=ffl2j1zL10M"
  },
  {
    "id": "fuJD80pymuk",
    "title": "STREET FIGHTER 6 RASHID COMBOS Starter Combo Guide",
    "channel": "VesperArcade",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=fuJD80pymuk"
  },
  {
    "id": "hkYqoYwAbGs",
    "title": "Rashid SF6 BnB and practical combo guide",
    "channel": "rooflemonger",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=hkYqoYwAbGs"
  },
  {
    "id": "ol12yc6mllg",
    "title": "ラシードの全て 戦略・テクニック・イウサール理論",
    "channel": "クローバー",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=ol12yc6mllg"
  },
  {
    "id": "Qm18nWDSURU",
    "title": "Rashid Gachikun Ranked Match Highlights",
    "channel": "SF6 DOJO REPLAYS",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=Qm18nWDSURU"
  },
  {
    "id": "Xzt98iG5E_8",
    "title": "スト6 ラシード対策講座",
    "channel": "石上ですが",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=Xzt98iG5E_8"
  },
  {
    "id": "c4I7ZVYJBg4",
    "title": "ラシード対策",
    "channel": "ACQUA",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=c4I7ZVYJBg4"
  },
  {
    "id": "TzknzSzfHcU",
    "title": "16分でわかるラシード対策 ベガ目線",
    "channel": "大車輪",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=TzknzSzfHcU"
  },
  {
    "id": "8HoDt0ln8sc",
    "title": "テリー使いのラシード対策まとめ",
    "channel": "holosokuのスト6攻略チャンネル",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=8HoDt0ln8sc"
  },
  {
    "id": "_GPaZ-S9mh0",
    "title": "師弟杯 ラシード師弟 渋谷ハルとガチくん",
    "channel": "渋谷ハル切り抜き",
    "kind": "match",
    "source": "https://ckworks.jp/vinforadar/video/_GPaZ-S9mh0"
  },
  {
    "id": "9EfBI2tJBKs",
    "title": "ラシード師弟杯 元配信 渋谷ハル ガチくん",
    "channel": "渋谷ハル",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=9EfBI2tJBKs"
  },
  {
    "id": "LKIrzILJo9c",
    "title": "ガチくん驚異の62ヒットコンボ",
    "channel": "ガチくん /Gachikun",
    "kind": "guide",
    "source": "https://yutura.net/channel/75894/popular/LKIrzILJo9c/"
  },
  {
    "id": "6Zvegf5OykA",
    "title": "ガチくん イウサールを抜けられた実戦",
    "channel": "ガチくん /Gachikun",
    "kind": "match",
    "source": "https://yutura.net/channel/75894/popular/6Zvegf5OykA/"
  },
  {
    "id": "VU72LitmdBQ",
    "title": "ガチくん リーサルのアドリブコンボ",
    "channel": "ガチくん /Gachikun",
    "kind": "match",
    "source": "https://yutura.net/channel/75894/popular/VU72LitmdBQ/"
  },
  {
    "id": "m4SM3UqUSqc",
    "title": "ガチくん イウサールとSA3の判断",
    "channel": "ガチくん /Gachikun",
    "kind": "guide",
    "source": "https://yutura.net/channel/75894/popular/m4SM3UqUSqc/"
  },
  {
    "id": "3RKO3b3270w",
    "title": "ガチくん ラシードの対空",
    "channel": "ガチくん /Gachikun",
    "kind": "guide",
    "source": "https://yutura.net/channel/75894/popular/3RKO3b3270w/"
  },
  {
    "id": "VVwwKQO_Tdg",
    "title": "ガチくん リーサル場面のビタコン",
    "channel": "ガチくん /Gachikun",
    "kind": "match",
    "source": "https://yutura.net/channel/75894/popular/VVwwKQO_Tdg/"
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
