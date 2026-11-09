import type { VideoSummary } from "@/lib/event-media";
import { RYU_VIDEO_PREVIEW } from "@/lib/ryu-video-preview";
import { CHARACTER_VIDEO_BATCH_01 } from "@/lib/character-video-batch-01";
import { CHARACTER_VIDEO_BATCH_02 } from "@/lib/character-video-batch-02";
import { CHARACTER_VIDEO_BATCH_03 } from "@/lib/character-video-batch-03";
import { CHARACTER_VIDEO_BATCH_04 } from "@/lib/character-video-batch-04";
import { CHARACTER_VIDEO_BATCH_05 } from "@/lib/character-video-batch-05";
import { CHARACTER_VIDEO_BATCH_06 } from "@/lib/character-video-batch-06";
import { CHARACTER_VIDEO_DEEP_DHALSIM } from "@/lib/character-video-deep-dhalsim";
import { CHARACTER_VIDEO_EXTRA_DHALSIM } from "@/lib/character-video-extra-dhalsim";
import { CHARACTER_VIDEO_DEEP_BLANKA } from "@/lib/character-video-deep-blanka";
import { CHARACTER_VIDEO_EXTRA_BLANKA } from "@/lib/character-video-extra-blanka";
import { CHARACTER_VIDEO_DEEP_KEN } from "@/lib/character-video-deep-ken";
import { CHARACTER_VIDEO_EXTRA_KEN } from "@/lib/character-video-extra-ken";
import { CHARACTER_VIDEO_DEEP_JURI } from "@/lib/character-video-deep-juri";
import { CHARACTER_VIDEO_EXTRA_JURI } from "@/lib/character-video-extra-juri";
import { CHARACTER_VIDEO_DEEP_KIMBERLY } from "@/lib/character-video-deep-kimberly";
import { CHARACTER_VIDEO_EXTRA_KIMBERLY } from "@/lib/character-video-extra-kimberly";
import { CHARACTER_VIDEO_DEEP_GUILE } from "@/lib/character-video-deep-guile";
import { CHARACTER_VIDEO_EXTRA_GUILE } from "@/lib/character-video-extra-guile";
import { CHARACTER_VIDEO_DEEP_CHUN_LI } from "@/lib/character-video-deep-chun-li";
import { CHARACTER_VIDEO_EXTRA_CHUN_LI } from "@/lib/character-video-extra-chun-li";
import { CHARACTER_VIDEO_DEEP_JAMIE } from "@/lib/character-video-deep-jamie";
import { CHARACTER_VIDEO_EXTRA_JAMIE } from "@/lib/character-video-extra-jamie";
import { CHARACTER_VIDEO_DEEP_LUKE } from "@/lib/character-video-deep-luke";
import { CHARACTER_VIDEO_EXTRA_LUKE } from "@/lib/character-video-extra-luke";
import { CHARACTER_VIDEO_DEEP_JP } from "@/lib/character-video-deep-jp";
import { CHARACTER_VIDEO_EXTRA_JP } from "@/lib/character-video-extra-jp";

/** Preview-only candidates. Add new character arrays only after reviewing sources.
 * Missing characters intentionally have zero candidates; no inferred relations.
 * This registry is not a publication approval source.
 */
/**
 * Character research intake 11–20, 2026-11-09. The video IDs are grounded in
 * searchable YouTube pages or indexed video pages (e.g. yutura.net).
 * Short display titles are summaries, not necessarily exact uploaded titles.
 * All records are Preview-only and do NOT establish patch verification,
 * rights, Player bindings, or public approval. Playback has not been tested.
 */
const nextTenVideoSeeds = [
  {
    "slug": "e-honda",
    "name": "E.本田",
    "batch": "03",
    "videos": [
      [
        "hZCIEEgyJ2I",
        "あーるえいち（E.本田）vs ウメハラ（豪鬼）",
        "Stremphoenix",
        "match"
      ],
      [
        "4GdN8uwY-vE",
        "しっくすびっと（E.本田）vs ウメハラ（豪鬼）",
        "Stremphoenix",
        "match"
      ],
      [
        "bL69DoEvCwQ",
        "対本田・マリーザには弱攻撃で詐欺飛び",
        "【スト6】ずんだもんふぁいたーch【解説】",
        "counter"
      ],
      [
        "W_Z7J--vaBA",
        "Six Bit（E.本田）vs ウメハラ（豪鬼）",
        "Stremphoenix",
        "match"
      ]
    ]
  },
  {
    "slug": "dee-jay",
    "name": "ディージェイ",
    "batch": "03",
    "videos": [
      [
        "xSw_ORpmDQA",
        "ディージェイ初心者向け講座：コンボと立ち回り",
        "べーやんの部屋【ゆっくり解説チャンネル】",
        "guide"
      ],
      [
        "NiXdBvGzFaI",
        "ディージェイ ランクマ：中ソバットを信じる",
        "まりゅーちゃんねる",
        "match"
      ],
      [
        "BPwbUSFJxys",
        "Classic DeeJay Combos & Setup Guide Season 3",
        "Joe Ebios",
        "guide"
      ],
      [
        "c7Zo42qS4Hw",
        "ディージェイ初心者向け31コンボ集（モダン・クラシック）",
        "まりゅーちゃんねる",
        "guide"
      ]
    ]
  },
  {
    "slug": "manon",
    "name": "マノン",
    "batch": "03",
    "videos": [
      [
        "97PjzREK1WE",
        "マノン Year3対応 実戦向けコンボ・起き攻め・セットプレイ",
        "レイ / Ray",
        "guide"
      ],
      [
        "IRkgJs03Ly0",
        "マノンのコンボ・連携・セットプレイを紹介",
        "チャンネルゴメス",
        "guide"
      ],
      [
        "L4UazTzprJw",
        "Classic MANON Complete Combos & Setup Guide 2026.08.03",
        "Joe Ebios",
        "guide"
      ],
      [
        "5qAQenFz8aQ",
        "マノンの武器職人から新コンボを授かる立川",
        "立川ちゃんねる",
        "guide"
      ],
      [
        "07THf6Qiqm4",
        "Street Fighter 6 Manon Combo Guide",
        "MC MuraFGC",
        "guide"
      ]
    ]
  },
  {
    "slug": "marisa",
    "name": "マリーザ",
    "batch": "03",
    "videos": [
      [
        "8BvuYDaZx4Q",
        "マリーザ MR2100↑ 立ち回り解説",
        "レイ / Ray",
        "guide"
      ],
      [
        "K8LpM8DOIPM",
        "マリーザ MR2100↑ 初心者向け総合解説",
        "レイ / Ray",
        "guide"
      ],
      [
        "DnhAUfsKonA",
        "マリーザ MR2100↑ セットプレイ・起き攻め",
        "レイ / Ray",
        "guide"
      ],
      [
        "anKlgYuF8PM",
        "マリーザでレジェンドを目指すランクマ",
        "アゴアニキ",
        "match"
      ],
      [
        "0achwHVREGA",
        "マリーザ ランクマ・実戦動画",
        "アゴアニキ",
        "match"
      ],
      [
        "-FH9kleTkjo",
        "EVO2025 板橋ザンギエフ（マリーザ）vs VIDEOGUY JR（JP）",
        "Capcom Fighters JP",
        "match"
      ]
    ]
  },
  {
    "slug": "zangief",
    "name": "ザンギエフ",
    "batch": "03",
    "videos": [
      [
        "lx_V6kKBA4U",
        "ザンギエフのドライブラッシュの使い方",
        "えよこ",
        "guide"
      ],
      [
        "KeuqM_-SRHQ",
        "ザンギエフのインパクトパニカン時の選択肢",
        "えよこ",
        "guide"
      ],
      [
        "seI8Ybaxmi4",
        "Street Fighter 6 Zangief Dream Combos",
        "ROUBICHL9TAL-YT",
        "guide"
      ],
      [
        "F6H5Lss6v6s",
        "ザンギエフ対策 SA・起き攻め対応（相手側視点）",
        "jyouji背骨",
        "counter"
      ]
    ]
  },
  {
    "slug": "lily",
    "name": "リリー",
    "batch": "04",
    "videos": [
      [
        "sLrHdeSDJhU",
        "リリーのコスパ最強コンボ",
        "ストーム久保",
        "guide"
      ],
      [
        "b6lu4PpeJqM",
        "リリー対策：三種の神器とNG行動",
        "うりょ",
        "counter"
      ],
      [
        "2NT2NgsklEg",
        "リリー弱コンドルウィンドをあきらが解説",
        "Vtuber Showdown【Vtuber格ゲーch】",
        "guide"
      ],
      [
        "8zKQFinzbV8",
        "リリー vs E.本田 開発者対戦スペシャル",
        "Street Fighter",
        "match"
      ]
    ]
  },
  {
    "slug": "cammy",
    "name": "キャミィ",
    "batch": "04",
    "videos": [
      [
        "BTuBsr7Zpes",
        "キャミィ コンボ100連発 場面別総集編",
        "猫と隼チャンネル",
        "guide"
      ],
      [
        "bsicBb8tcvM",
        "キャミィのアサルトブレード実戦コンボ",
        "ストーム久保",
        "guide"
      ],
      [
        "mgoYn1s9lIE",
        "キャミィ 基本操作＆コンボ完全解説",
        "Alldevice",
        "guide"
      ],
      [
        "lsAIrPPYmO0",
        "モダンキャミィの初心者向け簡単コンボ",
        "カプコン大好きTAKUさん",
        "guide"
      ],
      [
        "amBm8P1cxuw",
        "キャミィ初心者向け コンボ・起き攻め講座",
        "べーやんの部屋【ゆっくり解説チャンネル】",
        "guide"
      ],
      [
        "AMphCRWwn3k",
        "キャミィYear2 使い方・コンボ・起き攻め",
        "Rush Gorou",
        "guide"
      ],
      [
        "tqFsYQ_zcAg",
        "キャミィYear3 実用的基本コンボ完全版",
        "アダー@実用的ゲームちゃんねる",
        "guide"
      ]
    ]
  },
  {
    "slug": "rashid",
    "name": "ラシード",
    "batch": "04",
    "videos": [
      [
        "eXUug9kjcVQ",
        "ラシード 2026年8月版 実戦コンボ20選",
        "doskonnbu",
        "guide"
      ],
      [
        "wGgBKjzTygM",
        "レジェンド帯をワールとラッシュで戦うラシード",
        "doskonnbu",
        "match"
      ],
      [
        "6I-l3e9Bu7A",
        "ラシード イウサールの活用法",
        "doskonnbu",
        "guide"
      ],
      [
        "6aiDYqdv26I",
        "花籠つばさのラシード基礎・コンボ講習",
        "Vtuber Showdown【Vtuber格ゲーch】",
        "guide"
      ],
      [
        "wsVyJbn5aR8",
        "にじさんじ初のラシード使いに俺はなる",
        "花籠つばさ / Hanakago Tsubasa",
        "guide"
      ],
      [
        "iWhE4SQUhhE",
        "モダンラシード ダイヤ帯ランクマ",
        "花籠つばさ / Hanakago Tsubasa",
        "match"
      ]
    ]
  },
  {
    "slug": "aki",
    "name": "A.K.I.",
    "batch": "04",
    "videos": [
      [
        "NXu5hPyW7Hw",
        "A.K.I. 2026年3月版 基本コンボ",
        "メノ(Meno)",
        "guide"
      ],
      [
        "yRKt8zcZw_s",
        "A.K.I. 立ち回り解説（攻め方・守り方）",
        "(つ)の。",
        "guide"
      ],
      [
        "jXCzuToJaq4",
        "ひかる選手 A.K.I. 対戦リプレイ",
        "SF6-MODERN",
        "match"
      ],
      [
        "rOCVfugRvms",
        "A.K.I.でグランドマスターに到達する叶",
        "Kanae Channel",
        "match"
      ],
      [
        "n0guRH2hoNY",
        "初心者モダンA.K.I. ジャンプ攻撃からコンボ",
        "Rumaterasu",
        "guide"
      ],
      [
        "jDqwQkq8vwU",
        "ひかる A.K.I. 新コンボ・セットプレイ解説",
        "ひかる しとね",
        "guide"
      ]
    ]
  },
  {
    "slug": "ed",
    "name": "エド",
    "batch": "04",
    "videos": [
      [
        "9h4pDmZ38IQ",
        "えびはら選手 エド 対戦リプレイ",
        "SF6-MODERN",
        "match"
      ],
      [
        "cTVRgnkzjVc",
        "モダンエド 10分で分かる初心者向け講座",
        "シラバイクロム",
        "guide"
      ],
      [
        "0xceiBiNy7Q",
        "エドの使い方・コンボ・起き攻め・ドリーム",
        "Gorou / 五郎",
        "guide"
      ],
      [
        "m_ajGPJKVvo",
        "モダンエドのドリーム練習・リプレイ反省",
        "常闇トワ切り抜きch",
        "guide"
      ],
      [
        "NoH1BViQnRU",
        "SF6 ED Beginner Guide: Combos & Setups",
        "Joe Ebios",
        "guide"
      ]
    ]
  }
] as const;
const NEXT_TEN_VIDEO_CANDIDATES: Readonly<Record<string, VideoSummary[]>> = Object.fromEntries(
  nextTenVideoSeeds.map(({ slug, name, videos }) => [
    slug,
    videos.map(([youtubeId, title, channel, kind]): VideoSummary => ({
      id: `preview-${slug}-${youtubeId}`,
      slug: `preview-${slug}-${youtubeId}`,
      title,
      platform: "youtube",
      videoType: kind,
      publishedAt: null,
      description: "関連動画の未検証候補。掲載当時の内容で、現行Patch適合・出演者関係・再生可否は未確認です。",
      url: `https://www.youtube.com/watch?v=${youtubeId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
      channelName: channel,
      durationSeconds: null,
      language: null,
      controlTypes: [],
      events: [],
      characters: [name],
      players: [],
      categories: [kind],
      level: "unknown",
      viewCount: null,
      viewCountCheckedAt: null,
    })),
  ]),
);

const previewVideosByCharacter: Readonly<Record<string, readonly VideoSummary[]>> = {
  ryu: RYU_VIDEO_PREVIEW,
  ...CHARACTER_VIDEO_BATCH_01,
  ...CHARACTER_VIDEO_BATCH_02,
  ...CHARACTER_VIDEO_BATCH_03,
  ...CHARACTER_VIDEO_BATCH_04,
  ...CHARACTER_VIDEO_BATCH_05,
  ...CHARACTER_VIDEO_BATCH_06,
  "e-honda": [...(CHARACTER_VIDEO_BATCH_03["e-honda"] ?? []), ...(NEXT_TEN_VIDEO_CANDIDATES["e-honda"] ?? [])],
  "dee-jay": [...(CHARACTER_VIDEO_BATCH_03["dee-jay"] ?? []), ...(NEXT_TEN_VIDEO_CANDIDATES["dee-jay"] ?? [])],
  "manon": [...(CHARACTER_VIDEO_BATCH_03["manon"] ?? []), ...(NEXT_TEN_VIDEO_CANDIDATES["manon"] ?? [])],
  "marisa": [...(CHARACTER_VIDEO_BATCH_03["marisa"] ?? []), ...(NEXT_TEN_VIDEO_CANDIDATES["marisa"] ?? [])],
  "zangief": [...(CHARACTER_VIDEO_BATCH_03["zangief"] ?? []), ...(NEXT_TEN_VIDEO_CANDIDATES["zangief"] ?? [])],
  "lily": [...(CHARACTER_VIDEO_BATCH_04["lily"] ?? []), ...(NEXT_TEN_VIDEO_CANDIDATES["lily"] ?? [])],
  "cammy": [...(CHARACTER_VIDEO_BATCH_04["cammy"] ?? []), ...(NEXT_TEN_VIDEO_CANDIDATES["cammy"] ?? [])],
  "rashid": [...(CHARACTER_VIDEO_BATCH_04["rashid"] ?? []), ...(NEXT_TEN_VIDEO_CANDIDATES["rashid"] ?? [])],
  "aki": [...(CHARACTER_VIDEO_BATCH_04["aki"] ?? []), ...(NEXT_TEN_VIDEO_CANDIDATES["aki"] ?? [])],
  "ed": [...(CHARACTER_VIDEO_BATCH_04["ed"] ?? []), ...(NEXT_TEN_VIDEO_CANDIDATES["ed"] ?? [])],
  "dhalsim": [...(CHARACTER_VIDEO_BATCH_02["dhalsim"] ?? []), ...CHARACTER_VIDEO_DEEP_DHALSIM, ...CHARACTER_VIDEO_EXTRA_DHALSIM],
  "blanka": [...(CHARACTER_VIDEO_BATCH_02["blanka"] ?? []), ...CHARACTER_VIDEO_DEEP_BLANKA, ...CHARACTER_VIDEO_EXTRA_BLANKA],
  "ken": [...(CHARACTER_VIDEO_BATCH_02["ken"] ?? []), ...CHARACTER_VIDEO_DEEP_KEN, ...CHARACTER_VIDEO_EXTRA_KEN],
  "juri": [...(CHARACTER_VIDEO_BATCH_02["juri"] ?? []), ...CHARACTER_VIDEO_DEEP_JURI, ...CHARACTER_VIDEO_EXTRA_JURI],
  "kimberly": [...(CHARACTER_VIDEO_BATCH_02["kimberly"] ?? []), ...CHARACTER_VIDEO_DEEP_KIMBERLY, ...CHARACTER_VIDEO_EXTRA_KIMBERLY],
  "guile": [...(CHARACTER_VIDEO_BATCH_01["guile"] ?? []), ...CHARACTER_VIDEO_DEEP_GUILE, ...CHARACTER_VIDEO_EXTRA_GUILE],
  "chun-li": [...(CHARACTER_VIDEO_BATCH_01["chun-li"] ?? []), ...CHARACTER_VIDEO_DEEP_CHUN_LI, ...CHARACTER_VIDEO_EXTRA_CHUN_LI],
  "jamie": [...(CHARACTER_VIDEO_BATCH_01["jamie"] ?? []), ...CHARACTER_VIDEO_DEEP_JAMIE, ...CHARACTER_VIDEO_EXTRA_JAMIE],
  "luke": [...(CHARACTER_VIDEO_BATCH_01["luke"] ?? []), ...CHARACTER_VIDEO_DEEP_LUKE, ...CHARACTER_VIDEO_EXTRA_LUKE],
  "jp": [...(CHARACTER_VIDEO_BATCH_01["jp"] ?? []), ...CHARACTER_VIDEO_DEEP_JP, ...CHARACTER_VIDEO_EXTRA_JP],
};

export function getCharacterPreviewVideos(characterSlug: string): VideoSummary[] {
  return [...(previewVideosByCharacter[characterSlug] ?? [])];
}

export function getAllPreviewVideoCandidates(): VideoSummary[] {
  return Object.values(previewVideosByCharacter).flatMap(videos => [...videos]);
}
