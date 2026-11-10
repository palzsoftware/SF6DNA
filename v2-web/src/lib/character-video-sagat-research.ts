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
  },
  {
    "id": "MwDicXEEhI0",
    "title": "SFL2026 あきら キャミィ vs ヤナイ サガット",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://yutura.net/channel/47625/video/MwDicXEEhI0/"
  },
  {
    "id": "Lzj9AlmVOd0",
    "title": "SFL2026 cosa ケン vs ヤナイ サガット",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://yutura.net/channel/47625/video/Lzj9AlmVOd0/"
  },
  {
    "id": "i3thfKeAEqg",
    "title": "2026年5月版 サガット最速起き攻めの全て",
    "channel": "スト6の思い出",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=i3thfKeAEqg"
  },
  {
    "id": "A1cESBAhgUk",
    "title": "IGN Japan サガット実装前プレビュー・コンボトライアル",
    "channel": "IGN Japan",
    "kind": "guide",
    "source": "https://yutura.net/channel/17855/video/A1cESBAhgUk/"
  },
  {
    "id": "-Ukqx7wZdyM",
    "title": "ボンちゃんによる2026年5月調整・サガット確認",
    "channel": "プロゲーマーボンちゃん",
    "kind": "guide",
    "source": "https://yutura.net/channel/53696/video/-Ukqx7wZdyM/"
  },
  {
    "id": "FcdP0QP3sM4",
    "title": "ボンちゃん サガット vs 立川 アルジュン",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://yutura.net/channel/56626/video/FcdP0QP3sM4/"
  },
  {
    "id": "ybBUW0nmYkM",
    "title": "ボンちゃんがサガットのデヨの歴史を解説",
    "channel": "プロゲーマーボンちゃん",
    "kind": "guide",
    "source": "https://yutura.net/channel/53696/video/ybBUW0nmYkM/"
  },
  {
    "id": "6jazofn8Ao8",
    "title": "ボンちゃん サガット vs あくたがわ マノン",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://yutura.net/channel/56626/video/6jazofn8Ao8/"
  },
  {
    "id": "zkG6wjLucac",
    "title": "SF6: Sagat SA2 Setups",
    "channel": "Killerex100",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=zkG6wjLucac"
  },
  {
    "id": "zs2BFZMe3OU",
    "title": "公式日本語サガットキャラクターガイド",
    "channel": "CapcomChannel",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=zs2BFZMe3OU"
  },
  {
    "id": "0bB_SgPwplU",
    "title": "サガットのクラシックコンボ練習配信",
    "channel": "卯埜らび / Rabi Uno",
    "kind": "guide",
    "source": "https://yutura.net/channel/113399/video/0bB_SgPwplU/"
  },
  {
    "id": "3PRlt5v8PmA",
    "title": "Before You Main! A SF6 Guide to Sagat",
    "channel": "TheYukster",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=3PRlt5v8PmA"
  },
  {
    "id": "l50j2Dr2G6s",
    "title": "Sagat Combo Guide for Street Fighter 6",
    "channel": "iZonk Gaming",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=l50j2Dr2G6s"
  },
  {
    "id": "Kmq0DDk0FAE",
    "title": "マゴがメインキャラ候補としてサガットを使い始める",
    "channel": "マゴ /MAGO",
    "kind": "match",
    "source": "https://yutura.net/channel/74045/video/Kmq0DDk0FAE/"
  },
  {
    "id": "jX6ZIfGVP-U",
    "title": "テリー使いのサガット対策まとめ",
    "channel": "holosokuのスト6攻略チャンネル",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=jX6ZIfGVP-U"
  },
  {
    "id": "MSVazuIY3Kw",
    "title": "ボンちゃんがサガットをランクマッチに投入",
    "channel": "プロゲーマーボンちゃん",
    "kind": "match",
    "source": "https://yutura.net/channel/53696/trend/MSVazuIY3Kw/"
  },
  {
    "id": "2Mm6fmurHH0",
    "title": "ふり〜だがボンちゃんサガットの大会戦績を振り返る",
    "channel": "ふり〜だ",
    "kind": "match",
    "source": "https://yutura.net/channel/4351/video/2Mm6fmurHH0/"
  },
  {
    "id": "005YPELlcXI",
    "title": "ボンちゃんがサガットの地上戦の悩みを分析",
    "channel": "プロゲーマーボンちゃん",
    "kind": "guide",
    "source": "https://yutura.net/channel/53696/video/005YPELlcXI/"
  },
  {
    "id": "edbvmn79iRQ",
    "title": "ボンちゃんのサガット参戦日・初日研究",
    "channel": "プロゲーマーボンちゃん",
    "kind": "guide",
    "source": "https://yutura.net/channel/53696/trend/edbvmn79iRQ/"
  },
  {
    "id": "lT83dGc2-v4",
    "title": "ひなお サガット vs 翔 アルジュン",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://yutura.net/channel/56626/video/lT83dGc2-v4/"
  },
  {
    "id": "baiVox9bdKA",
    "title": "Blaz ジェイミー vs ヤナイ サガット",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://yutura.net/channel/56626/video/baiVox9bdKA/"
  },
  {
    "id": "xSisBuOpi8k",
    "title": "どぐらがレジェンド上位Blazサガットと対戦",
    "channel": "どぐら 生駒デビル",
    "kind": "match",
    "source": "https://yutura.net/channel/55594/trend/xSisBuOpi8k/"
  },
  {
    "id": "nzrj7qpfjuY",
    "title": "どぐらがサガットで緊急ランクマに挑戦",
    "channel": "どぐら 生駒デビル",
    "kind": "match",
    "source": "https://yutura.net/channel/55594/trend/nzrj7qpfjuY/"
  },
  {
    "id": "ARR5F9ztsxk",
    "title": "初心者サガットのランクマ・バトルハブ配信",
    "channel": "志上ハジメ",
    "kind": "match",
    "source": "https://yutura.net/channel/56238/video/ARR5F9ztsxk/"
  }
] as const;
export const CHARACTER_VIDEO_SAGAT_RESEARCH: VideoSummary[] = candidates.map(({id,title,channel,kind,source}): VideoSummary => ({
 id:`preview-sagat-${id}`,slug:`preview-sagat-${id}`,title,platform:"youtube",videoType:kind,publishedAt:null,
 description:`${kind === "counter" ? "サガットへの対策候補。" : kind === "match" ? "サガット関連対戦候補。" : "サガット攻略・調整解説候補。"} 出典: ${source}。出場キャラ・再生可否・現行パッチ・公開適格性は未検証です。`,
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],characters:["サガット"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
