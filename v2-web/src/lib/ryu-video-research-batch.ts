import type { VideoSummary } from "@/lib/event-media";
/**
 * SF6 Ryu Preview research batch, 2026-11-09.
 * YouTube title/ID/channel/date sourced from live video search.
 * This is an unreviewed game-content candidate catalog, not a verified
 * current-patch guide, a public DB row or a confirmed Player relation.
 * Original video titles may differ from the concise Japanese display labels.
 */
const candidates = [
  {
    "id": "LCEmt1l-2Zs",
    "title": "リュウ とりこれコンボとセットプレイ徹底解説",
    "date": "2025-01-14",
    "channel": "いおりチャンネル【スト6講座と対戦動画投稿】",
    "videoType": "guide"
  },
  {
    "id": "AGsqP-kY4s0",
    "title": "スト6リュウ 立ち回り徹底解説・攻め方",
    "date": "2026-03-30",
    "channel": "オバハン",
    "videoType": "guide"
  },
  {
    "id": "k3TJFs9L19E",
    "title": "スト6リュウ 立ち回りの武器・バリエーション",
    "date": "2026-09-09",
    "channel": "オバハン",
    "videoType": "guide"
  },
  {
    "id": "4jQrKSIIrzQ",
    "title": "リュウ 中段持続セットプレイ",
    "date": "2025-01-23",
    "channel": "inaGuile@攻めガイル",
    "videoType": "guide"
  },
  {
    "id": "zQWo9RE59xk",
    "title": "リュウでマスターから上に上がるための立ち回り",
    "date": "2026-04-07",
    "channel": "オバハン",
    "videoType": "guide"
  },
  {
    "id": "gkQltXTGDik",
    "title": "リュウ インパクトセットプレイ",
    "date": "2023-12-31",
    "channel": "はちみつちゃんねる",
    "videoType": "guide"
  },
  {
    "id": "eNZ0CJUAoI0",
    "title": "リュウのセットプレイ・ショート解説",
    "date": "2026-08-27",
    "channel": "カクガリマン",
    "videoType": "guide"
  },
  {
    "id": "72t-jw0AhKc",
    "title": "リュウ 超絶コンボ実演",
    "date": "2024-07-31",
    "channel": "SF6 sp",
    "videoType": "guide"
  },
  {
    "id": "BH5wmHdRUxk",
    "title": "リュウの立ち回り・技を当てに行く方法",
    "date": "2026-02-04",
    "channel": "オバハン",
    "videoType": "guide"
  },
  {
    "id": "kACoVRl21nM",
    "title": "YAS リュウの強力な固め技の解説",
    "date": "2024-11-18",
    "channel": "YasTube",
    "videoType": "guide"
  },
  {
    "id": "Lsu28hgQK5A",
    "title": "YAS リュウのコンボ実演",
    "date": "2025-04-07",
    "channel": "YasTube",
    "videoType": "guide"
  },
  {
    "id": "8SAD3qFaaoE",
    "title": "リュウ 新ver 7100ダメージコンボ実演",
    "date": "2025-06-27",
    "channel": "inaGuile@攻めガイル",
    "videoType": "guide"
  },
  {
    "id": "zuNh6PdlpVY",
    "title": "スト6初心者向け リュウのコンボ集",
    "date": "2025-09-01",
    "channel": "拓@格ゲーブロガー",
    "videoType": "guide"
  },
  {
    "id": "sBBRHA0CiNQ",
    "title": "YAS リュウ使い向けコーチング",
    "date": "2024-11-12",
    "channel": "YasTube",
    "videoType": "guide"
  },
  {
    "id": "jomYiv7z380",
    "title": "リュウ初心者 MASTERまで使える攻略（立ち回り・コンボ・対空）",
    "date": "2026-10-09",
    "channel": "神代オルト🌎スト6初心者攻略",
    "videoType": "guide"
  },
  {
    "id": "Inj8BuujKNw",
    "title": "リュウ 前投げ後のセットプレイ",
    "date": "2026-02-07",
    "channel": "キータカ Keyetaka",
    "videoType": "guide"
  },
  {
    "id": "7XwbPLT2Pr4",
    "title": "リュウ 弱波掌撃の持続重ね",
    "date": "2025-01-23",
    "channel": "inaGuile@攻めガイル",
    "videoType": "guide"
  },
  {
    "id": "hEI_1BjCn4c",
    "title": "リュウ 強波掌撃を使ったセットプレイ",
    "date": "2026-05-01",
    "channel": "オバハン",
    "videoType": "guide"
  },
  {
    "id": "8I3hcAbrb8s",
    "title": "YAS リュウ先端コンボ",
    "date": "2026-02-05",
    "channel": "YasTube",
    "videoType": "guide"
  },
  {
    "id": "m2-0g3OMVWE",
    "title": "リュウ 高火力1ゲージ回収コンボ",
    "date": "2026-09-27",
    "channel": "inaGuile@攻めガイル",
    "videoType": "guide"
  },
  {
    "id": "ppWYuTgGCJg",
    "title": "リュウ 攻め継続の起き攻め",
    "date": "2026-09-07",
    "channel": "オバハン",
    "videoType": "guide"
  },
  {
    "id": "EXD2m_y4foY",
    "title": "リュウ キーボード手元付きコンボ・セットプレイ",
    "date": "2025-07-11",
    "channel": "spike",
    "videoType": "guide"
  },
  {
    "id": "4wgsE_umpjQ",
    "title": "ももちが見るリュウの高火力コンボ",
    "date": "2025-06-08",
    "channel": "ももち / Momochi",
    "videoType": "guide"
  },
  {
    "id": "94EpIh_rjY8",
    "title": "リュウの使い方・基本コンボと起き攻め",
    "date": "2024-09-26",
    "channel": "Gorou / 五郎",
    "videoType": "guide"
  },
  {
    "id": "gI66WilBkO4",
    "title": "ウメハラのリュウ 中Pカウンター始動コンボ",
    "date": "2024-03-04",
    "channel": "昇龍拳",
    "videoType": "match"
  },
  {
    "id": "Lyvl_p8iYOA",
    "title": "リュウ 中竜巻後の鳩尾砕きセットプレイ",
    "date": "2025-06-15",
    "channel": "inaGuile@攻めガイル",
    "videoType": "guide"
  },
  {
    "id": "GoNYNlhZkwo",
    "title": "リュウ マスター向け立ち回り第3弾",
    "date": "2025-04-04",
    "channel": "オバハン",
    "videoType": "guide"
  },
  {
    "id": "1HgaMQyOBro",
    "title": "モダンリュウ 基本コンボ4選",
    "date": "2023-09-01",
    "channel": "コイチ邸格ゲー塾",
    "videoType": "guide"
  },
  {
    "id": "57AwFB15OYQ",
    "title": "リュウ Year3 立ち回りと電刃錬気の使い方",
    "date": "2025-06-13",
    "channel": "オバハン",
    "videoType": "guide"
  },
  {
    "id": "L-K80Q2KtTo",
    "title": "リュウ 引き強Kを使った連携・立ち回り",
    "date": "2026-03-13",
    "channel": "オバハン",
    "videoType": "guide"
  },
  {
    "id": "_RhJcyy0mrg",
    "title": "リュウ 真・ドリームコンボ実演",
    "date": "2025-07-27",
    "channel": "ぷにぷにの格ゲー解説ちゃんねる【ずんだもん】",
    "videoType": "guide"
  }
] as const;
export const RYU_VIDEO_RESEARCH_BATCH: VideoSummary[] = candidates.map(({id,title,date,channel,videoType})=>({
  id:`preview-ryu-${id}`, slug:`preview-ryu-${id}`,
  title,platform:"youtube",videoType,
  publishedAt:`${date}T00:00:00Z`,
  description:"リュウ関連動画の候補。収録時点の内容であり、現行Patchや技・ダメージ数値の成立は未検証です。",
  url:`https://www.youtube.com/watch?v=${id}`,
  thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  channelName:channel,durationSeconds:null,language:null,controlTypes:[],
  events:[],characters:["リュウ"],players:[],categories:[videoType],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
