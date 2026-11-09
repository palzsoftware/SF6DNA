import type { VideoSummary } from "@/lib/event-media";
import { RYU_VIDEO_RESEARCH_BATCH } from "@/lib/ryu-video-research-batch";
/** Preview-only candidates, not published video or confirmed Player/Match relation records. */
const candidates = [
  [
    "5OwVaFl2qbA",
    "【ストリートファイター6】リュウ コンボ集（Ver.2026）",
    "guide",
    "2026-08-29",
    null,
    "リュウのコンボ解説候補。"
  ],
  [
    "kWS3zqOINUU",
    "[SF6] Master Ryu Easily With This One Guide! 2026 Edition",
    "guide",
    "2026-05-19",
    null,
    "コンボと起き攻めを扱う2026年版ガイド。"
  ],
  [
    "BpWyb_iiz7k",
    "しゅーと リュウのセットプレイ・コンボ解説",
    "guide",
    "2026-03-26",
    null,
    "Shutoによるリュウのセットプレイ解説。"
  ],
  [
    "5xlUdexlw3w",
    "【スト6、SF6】リュウ対策。飛び道具に困ってる人は必見！",
    "counter",
    "2026-02-09",
    null,
    "リュウに対する対策動画。"
  ],
  [
    "qNtPFSHVsYQ",
    "【スト6】全キャラ対策 忘れがちな確定反撃集（リュウでの反撃）",
    "counter",
    "2025-09-07",
    null,
    "リュウを使用した確定反撃解説。2025年時点の情報。"
  ],
  [
    "58yZDxP9pb4",
    "【スト6】これぞ最強リュウ 立ち回りのキレが半端じゃない!! シュート（リュウ）",
    "match",
    "2026-07-21",
    "Shuto",
    "Shutoのリュウ使用試合候補。"
  ],
  [
    "JllCD8RuWWY",
    "【SF6】世界1位リュウ！武の境地を感じさせる強さ！！ Shuto（リュウ）",
    "match",
    "2026-07-03",
    "Shuto",
    "Shutoのリュウ使用試合候補。順位表現は未検証。"
  ],
  [
    "1dvZg37KaQ8",
    "スト6 ▰ MR1位ひなおリュウ！破壊力が段違いすぎるｗｗ ▰ ひなお（リュウ）",
    "match",
    "2026-01-10",
    "Hinao",
    "ひなおのリュウ使用試合候補。順位表現は未検証。"
  ],
  [
    "n7SGgM6bgXM",
    "【SF6】世界1位リュウ！一手一手に無駄がない！！ .YAS.（リュウ）",
    "match",
    "2026-07-23",
    "YAS",
    "YASのリュウ使用試合候補。"
  ],
  [
    "iAs1p3LVdAs",
    "Street Fighter 6 Character Guide | Ryu",
    "guide",
    "2023-05-13",
    null,
    "公式リュウガイド。"
  ],
  [
    "ZQLuHVVdG-M",
    "Evo France準優勝記念 リュウのとりこれコンボ5選",
    "guide",
    "2025-12-26",
    null,
    "リュウのコンボ解説。現行パッチ適合性未確認。"
  ],
  [
    "78lXWbSCHDQ",
    "Season 3 NEW Ryu Combos! SF6",
    "guide",
    null,
    null,
    "Season 3のリュウコンボ。公開日・現行パッチ未確認。"
  ],
  [
    "Webv4hwKRew",
    "YEAR3リュウ 実戦向けコンボとセットプレイ19選",
    "guide",
    "2025-09-30",
    null,
    "実戦向けコンボとセットプレイ。"
  ],
  [
    "2cN27UUF95g",
    "SF6 Season 3 Ryu Ultimate Guide - Combos, Frame Traps, Setups",
    "guide",
    null,
    null,
    "リュウのコンボ、連携とセットプレイ解説。"
  ],
  [
    "L7s0xH48pLs",
    "リュウ インパクト返し後の中央シミーセットプレイ",
    "guide",
    "2026-01-07",
    null,
    "リュウの中央シミーセットプレイ。"
  ],
  [
    "c98pgwqOz70",
    "リュウ 相手の暴れ・打ち返し行動対策",
    "guide",
    "2026-01-24",
    null,
    "リュウを使用した暴れ対策・立ち回り解説。"
  ],
  [
    "h1FhaJKouFw",
    "KAZUNOKO (C.Viper) vs YAS (Ryu)",
    "match",
    "2026-05-18",
    "YAS",
    "動画タイトル上のリュウ使用プレイヤーはYAS。"
  ],
  [
    "ekcjVPEkcHA",
    "KAZUNOKO (Jamie) vs YAS (Ryu)",
    "match",
    "2026-08-14",
    "YAS",
    "動画タイトル上のリュウ使用プレイヤーはYAS。"
  ],
  [
    "sgx-BCsfpuE",
    "SAHARA (Ken) vs YAS (Ryu)",
    "match",
    "2026-05-08",
    "YAS",
    "動画タイトル上のリュウ使用プレイヤーはYAS。"
  ],
  [
    "uXuhCwVCEkU",
    "SHUTO (Ryu) vs COSA (Akuma)",
    "match",
    null,
    "Shuto",
    "動画タイトル上のリュウ使用プレイヤーはShuto。"
  ],
  [
    "yNTXGbflDbQ",
    "YAS (Ryu) vs ANGRYBIRD (Ryu)",
    "match",
    null,
    "YAS|AngryBird",
    "両選手がリュウと記載された試合候補。"
  ],
  [
    "qyQxzhxZUkM",
    "YAS (Ryu) vs COSA (Ken)",
    "match",
    null,
    "YAS",
    "タイトル上、リュウを使用するのはYAS。"
  ],
  [
    "Cqc3dtDpaXQ",
    "YAS (Ryu) vs DAIGO (Akuma)",
    "match",
    null,
    "YAS",
    "タイトル上、リュウを使用するのはYAS。"
  ],
  [
    "E0pg7TJeCo4",
    "YAS (Ryu) vs Hikaru (A.K.I.)",
    "match",
    "2026-08-09",
    "YAS",
    "タイトル上、リュウを使用するのはYAS。"
  ],
  [
    "4n9XY6QU4oI",
    "YAS (Ryu) vs JOHNTAKEUCHI (Jamie)",
    "match",
    null,
    "YAS",
    "タイトル上、リュウを使用するのはYAS。"
  ],
  [
    "CYDJRFwqIWI",
    "[SFL 2025] えいた（豪鬼）vs cosa（リュウ）",
    "match",
    "2026-08-29",
    "cosa",
    "タイトル上、リュウを使用するのはcosa。"
  ],
  [
    "seN7qRdlpVA",
    "【リュウ】全てのリュウ使いに捧げる、観たら90％はリュウのコンボを理解できる魂のコンボ動画2026【Year3最新版】",
    "guide",
    "2026-03-21",
    null,
    "sUnによるリュウのコンボ解説。YouTubeの公開情報を照合済み。"
  ],
  [
    "Alr1hWIGr3o",
    "【スト6】リュウ使い必見！実戦向けコンボとセットプレイ16選",
    "guide",
    "2025-04-10",
    null,
    "ぷにぷにの格ゲー解説ちゃんねる。始動別コンボ・端・インパクト・セットプレイ。2025年時点の解説、現行Patch未検証。"
  ],
  [
    "IPrl7UtWBBs",
    "【スト6】シュート解説 リュウの必殺技・通常技・立ち回り徹底解説",
    "guide",
    "2026-03-25",
    null,
    "しゅーとチャンネル / Shuto。波動拳・足刀・波掌撃・地上戦の解説。2026年3月時点、現行Patch未検証。"
  ],
  [
    "_n0stVxs_3s",
    "【スト6】リュウ使いが勝てない理由【立ち回りの本質】",
    "guide",
    "2026-04-20",
    null,
    "スト6の妖精・にこ太郎。中距離、波動拳、対空、選択肢管理の考え方。"
  ],
  [
    "zcQhuqqOF_E",
    "スト6 リュウ コンボ＆セットプレイ集",
    "guide",
    "2024-03-10",
    null,
    "ユーユー。コンボ、電刃錬気、端、起き攻め、SAなど。旧Patch教材、現行成立未検証。"
  ],
  [
    "0lTCUeAZLMg",
    "【スト6】リュウ 実戦向けコンボ 起き攻め セットプレイ",
    "guide",
    "2026-01-27",
    null,
    "レイ【スト6】。小技・中攻撃・強攻撃・インパクト・SA始動と起き攻め。2026年1月時点の動画。"
  ],
  [
    "k45E5fCaS54",
    "【スト6】今から始めても大丈夫！リュウ初心者向け解説なのだ！",
    "guide",
    "2024-12-19",
    null,
    "ぷにぷにの格ゲー解説ちゃんねる。通常技、必殺技、簡単なコンボ。Year2時点の動画。"
  ],
  [
    "JWskwGQzYOM",
    "スト6リュウ Year4対応 中央の起き攻め完全版",
    "guide",
    "2026-08-22",
    null,
    "オバハン。Year4の中央セットプレイ。技性能・有利フレームは未検証。"
  ],
  [
    "2nn6IujVX7c",
    "SF6 Problem X (Arjun) vs EndingWalker (Ryu)",
    "match",
    "2026-10-14",
    null,
    "Stremphoenixの対戦映像。タイトル記載の出演者と使用キャラは正式なPlayer/Match関連未確認。"
  ],
  [
    "qdA3DjyoHbk",
    "YAS リュウ DreamHack 2026の試合振り返り",
    "match",
    "2026-05-18",
    null,
    "YasTubeによるDreamHack 2026の試合映像候補。出演者の正式関連付けは未確認。"
  ],
  [
    "vNFcTuXBdgA",
    "ひぐちが語るEndingWalkerのリュウの強さと勝ち方",
    "guide",
    "2025-04-09",
    null,
    "ひぐちゃんねる。EndingWalkerのリュウの強さと立ち回りに関する考察。2025年時点。"
  ]
] as const;
export const RYU_VIDEO_PREVIEW: VideoSummary[] = [...candidates.map(([youtubeId, title, videoType, date, player, description]): VideoSummary => ({
  id: `preview-ryu-${youtubeId}`,
  slug: `preview-ryu-${youtubeId}`,
  title,
  platform: "youtube",
  videoType,
  publishedAt: date ? `${date}T00:00:00Z` : null,
  description,
  url: `https://www.youtube.com/watch?v=${youtubeId}`,
  thumbnailUrl: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
  channelName: null, durationSeconds: null, language: null, controlTypes: [],
  events: [], characters: ["リュウ"],
  // Preview-only labels inferred from titles, not authoritative entityRefs.
  players: player ? player.split("|") : [],
  categories: [videoType], level: "unknown", viewCount: null, viewCountCheckedAt: null,
})), ...RYU_VIDEO_RESEARCH_BATCH];
