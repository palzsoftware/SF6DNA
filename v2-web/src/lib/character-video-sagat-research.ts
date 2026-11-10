import type { VideoSummary } from "@/lib/event-media";
/** Sagat source-traced Preview research. Counter means advice AGAINST Sagat; source-only, playback and patch not validated. */
const candidates = [
  {
    "id": "nPxy6CH9F9A",
    "title": "Sagat Combo Guide - Street Fighter 6",
    "channel": "rooflemonger",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=nPxy6CH9F9A"
  },
  {
    "id": "0pmZH-lqWis",
    "title": "Sagat Complete Guide! Gameplan, Combos, Tips & Tricks",
    "channel": "VesperArcade",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=0pmZH-lqWis"
  },
  {
    "id": "Ku7goMZClCI",
    "title": "サガット対策はこれで勝てる！画面端の対策",
    "channel": "いおりチャンネル",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=Ku7goMZClCI"
  },
  {
    "id": "5OEpksTbiug",
    "title": "だいこくサガット戦から対策を考えるハイタニ",
    "channel": "ハイタニ TV",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=5OEpksTbiug"
  },
  {
    "id": "-zCHN1dUaXE",
    "title": "ストーム久保がサガットのネタコンボを開発",
    "channel": "ストーム久保",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=-zCHN1dUaXE"
  },
  {
    "id": "vfqrvGr-osk",
    "title": "サガット タイガーネクサス活用運びコンボ",
    "channel": "イナガイル@攻めガイル",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=vfqrvGr-osk"
  },
  {
    "id": "2Us1J0gj5fY",
    "title": "ストーム久保がサガットのセットプレイを開発",
    "channel": "ストーム久保",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=2Us1J0gj5fY"
  },
  {
    "id": "sYfTJp24lQk",
    "title": "サガット対策 ここでの投げ抜けは危険",
    "channel": "ずんだもんふぁいたーch",
    "kind": "counter",
    "source": "https://yutura.net/channel/100869/video/sYfTJp24lQk/"
  },
  {
    "id": "kmp7A8qwnrI",
    "title": "立川先生が教えるマノンのサガット＆エレナ対策",
    "channel": "SHAKA Ad Channel",
    "kind": "counter",
    "source": "https://yutura.net/channel/71919/video/kmp7A8qwnrI/"
  },
  {
    "id": "JD2_NKqTxBI",
    "title": "SFL2026 ひなお サガット/リュウ vs 板橋ザンギエフ",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://yutura.net/channel/47625/video/JD2_NKqTxBI/"
  },
  {
    "id": "yZghMVOFUzU",
    "title": "SFL2026 ひなお サガット vs あでりい エド",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://yutura.net/channel/47625/video/yZghMVOFUzU/"
  },
  {
    "id": "NdCtgugm0Ww",
    "title": "リリーを使ったサガット対策1分解説",
    "channel": "小路KOG",
    "kind": "counter",
    "source": "https://yutura.net/channel/75358/video/NdCtgugm0Ww/"
  },
  {
    "id": "GOJvwSFRuRo",
    "title": "SFL2026 ボンちゃん サガット vs もけ 舞",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://yutura.net/channel/47625/video/GOJvwSFRuRo/"
  },
  {
    "id": "DZHKCaJyTHk",
    "title": "SHAKAがサガットと初対戦",
    "channel": "SHAKAファンの作業部屋",
    "kind": "match",
    "source": "https://yutura.net/channel/47748/video/DZHKCaJyTHk/"
  },
  {
    "id": "7EQbwKtB_fk",
    "title": "ACQUA講座 サガット対策",
    "channel": "ACQUA",
    "kind": "counter",
    "source": "https://acqua-souken.com/v/7EQbwKtB_fk/"
  },
  {
    "id": "QDakuqBqdbM",
    "title": "しゅーとが舞・リュウ・サガットの調整を検証",
    "channel": "しゅーとチャンネル / Shuto",
    "kind": "guide",
    "source": "https://yutura.net/channel/99161/video/QDakuqBqdbM/"
  }
] as const;
export const CHARACTER_VIDEO_SAGAT_RESEARCH: VideoSummary[] = candidates.map(({id,title,channel,kind,source}): VideoSummary => ({
 id:`preview-sagat-${id}`,slug:`preview-sagat-${id}`,title,platform:"youtube",videoType:kind,publishedAt:null,
 description:`${kind === "counter" ? "サガットへの対策候補。" : kind === "match" ? "サガット関連対戦候補。" : "サガット攻略・調整解説候補。"} 出典: ${source}。出場キャラ・再生可否・現行パッチ・公開適格性は未検証です。`,
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],characters:["サガット"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
