import type { VideoSummary } from "@/lib/event-media";
/**
 * E. Honda research batch (2026-11-09).
 * YouTube video IDs and titles drawn from video or explicitly linked index pages.
 * Candidate only; YouTube playback and current-patch relevance are NOT tested.
 * Some entries discuss counterplay against Honda, and are labeled "counter".
 */
const candidates = [
  [
    "JMLB9blQSiw",
    "【スト6】E.本田の対策【頭突きと百貫落とし】",
    "ACQUA",
    "counter"
  ],
  [
    "cD7sI66-JMA",
    "【スト6】E.本田でランクマッチ #01 国技はじめます！",
    "SOMA",
    "match"
  ],
  [
    "1MszvzFK9qA",
    "STREET FIGHTER 6 E.HONDA COMBOS! Starter Combo Guide",
    "VesperArcade",
    "guide"
  ],
  [
    "MXDbnsxZi3A",
    "E. HONDA Combo Guide (Modern Controls) – Street Fighter 6",
    "ahmz1404",
    "guide"
  ],
  [
    "qzuHig3Ppl8",
    "入れ込むだけで体力かDゲージを無くす強化に戦慄するストーム久保",
    "ストーム久保",
    "guide"
  ],
  [
    "8kEMJnsiaPw",
    "必殺技を使わず横綱に昇り詰めた天才力士の動きを視察するストーム久保",
    "ストーム久保",
    "match"
  ],
  [
    "Mf4cP7oZyrU",
    "本田に隠された秘密！使い方次第でノーリスクになる技",
    "ストーム久保",
    "guide"
  ],
  [
    "4ZapKk9LeM4",
    "本田の技術が上がり魔法のような対空コンボを決めるストーム久保",
    "ストーム久保",
    "guide"
  ],
  [
    "ms1A3DHTzjk",
    "Year3始動：本田の新コンボ研究",
    "ストーム久保",
    "guide"
  ],
  [
    "RFlqCY8yZUc",
    "ストリートファイター6 エドモンド本田 基本コンボ",
    "メノ(Meno)",
    "guide"
  ],
  [
    "GBeNYFjWYio",
    "Street Fighter 6 Season 2 Modern Guide - Honda",
    "The Den of Sin",
    "guide"
  ],
  [
    "gW8sCbFq7Qo",
    "SF6 • Stormkubo (E.Honda) • Street Fighter 6",
    "Fight Club TV",
    "match"
  ],
  [
    "zlx0rcyOTTc",
    "StormKUBO (E.Honda) is a beast! Street Fighter 6",
    "Fight Club TV",
    "match"
  ],
  [
    "dwLO66FeY4o",
    "本田の強み弱みと対策を解説",
    "いおりチャンネル",
    "counter"
  ],
  [
    "SgBhgRoufXk",
    "初心者向けランクSSS！エドモンド本田の使い方講座",
    "ACQUA",
    "guide"
  ],
  [
    "P5nGYBM3KRM",
    "テリーの本田対策（実践編）",
    "jyouji背骨",
    "counter"
  ],
  [
    "L6F4fNDVjsA",
    "トッププロの本田Dランク説の理由を解説",
    "ストーム久保",
    "guide"
  ],
  [
    "G8TiVdF8dx0",
    "全キャラ対策講座：本田対策パートあり",
    "いおりチャンネル",
    "counter"
  ],
  [
    "vwPXMi0s8IA",
    "Master Rank E Honda Guide - Street Fighter 6",
    "Chachironi",
    "guide"
  ],
  [
    "W9rzaWMCQq0",
    "あーるえいち（E.本田）vs ひなお（イングリッド）",
    "Stremphoenix",
    "match"
  ],
  [
    "mrDb0IUx6Q8",
    "かっこいいが好きど（アルジュン）vs あーるえいち（E.本田）",
    "Stremphoenix",
    "match"
  ],
  [
    "Uz-Cds22XrU",
    "k4sen本田と順番に戦うスト6対戦会",
    "k4sen / かせん",
    "match"
  ],
  [
    "kNRt74xwomE",
    "本田使われが解説する本田対策【百貫・頭突き】",
    "おーさま劇場",
    "counter"
  ],
  [
    "RhY90qe-hwM",
    "世界1位E.本田・すーも。の高レベル対戦",
    "SF6-MODERN",
    "match"
  ],
  [
    "GbccE9neKUM",
    "SF6: E. Honda Tech (Season 3 Edition)",
    "Killerex100",
    "guide"
  ],
  [
    "W4El3cW8WME",
    "やたら硬派な激強本田に遭遇するハイタニ",
    "ハイタニ TV",
    "match"
  ],
  [
    "auEHlMDDSqg",
    "世界1位E.本田・カンフーマスターの画面端猫だまし",
    "SF6-MODERN",
    "match"
  ],
  [
    "PszBtndhSrI",
    "世界1位E.本田・すーも。の横綱相撲",
    "SF6-MODERN",
    "match"
  ],
  [
    "5OjQW4b3QjQ",
    "本田の四股ハメであらゆる選択肢を潰す",
    "ストーム久保",
    "guide"
  ],
  [
    "GaPEjq8syWk",
    "本田限定テクニックを使う四股完全二択",
    "ストーム久保",
    "guide"
  ],
  [
    "3ln24SnvPa8",
    "地獄の本田環境到来？超強化された本田の性能",
    "ストーム久保",
    "guide"
  ],
  [
    "k8_3YwG2CDA",
    "瀬島山コーチング：モダン本田への実戦指導",
    "ACQUA",
    "guide"
  ],
  [
    "3d_y780nvHU",
    "13分でわかる本田対策【ベガ目線】",
    "大車輪",
    "counter"
  ],
  [
    "SP0UxcNRinY",
    "テリーの本田対策（知識編）",
    "jyouji背骨",
    "counter"
  ],
  [
    "f-AI_JFDNSY",
    "【202412ver】エドモンド本田 基本コンボ",
    "メノ(Meno)",
    "guide"
  ],
  [
    "hVX8l23l3fs",
    "本田の百貫落とし対策",
    "ずんだもんふぁいたーch",
    "counter"
  ],
  [
    "gVWf_DizJ1k",
    "本田戦はこう勝つ：LEGEND視点で対戦を後付け解説",
    "いおりチャンネル",
    "counter"
  ],
  [
    "V_V6HhuCKB8",
    "頭突きと百貫中心のマスター本田に遭遇する西田",
    "西田の小ネタ2",
    "match"
  ],
  [
    "1jCE0NgvSv0",
    "ジャスパ対策が必要な最強技8選（本田・頭突きと百貫を含む）",
    "SmashlogTV - SF6",
    "counter"
  ],
  [
    "fvs_qp0RD5w",
    "クラシック本田限定コンボの研究",
    "ストーム久保",
    "guide"
  ],
  [
    "qZsyJBlfB0I",
    "本田のSAゲージ回収コンボ研究",
    "ストーム久保",
    "guide"
  ]
] as const;
export const CHARACTER_VIDEO_HONDA_RESEARCH: VideoSummary[] = candidates.map(([id, title, channel, kind]): VideoSummary => ({
  id: `preview-e-honda-${id}`,
  slug: `preview-e-honda-${id}`,
  title,
  platform: "youtube",
  videoType: kind,
  publishedAt: null,
  description: kind === "counter" ? "E.本田への対策動画候補。動画内容・現行Patchでの有効性は未検証。" : "E.本田関連の動画候補。動画内容・現行Patchでの有効性は未検証。",
  url: `https://www.youtube.com/watch?v=${id}`,
  thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  channelName: channel,
  durationSeconds: null,
  language: null,
  controlTypes: [],
  events: [],
  characters: ["E.本田"],
  players: [],
  categories: [kind],
  level: "unknown",
  viewCount: null,
  viewCountCheckedAt: null,
}));
