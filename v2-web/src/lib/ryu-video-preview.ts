import type { VideoSummary } from "@/lib/event-media";
/** Preview-only candidates, never publication approval or confirmed Player relations. */
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
    "リュウのコンボ・起き攻め解説。DBには公開ステータスの登録あり。"
  ],
  [
    "BpWyb_iiz7k",
    "しゅーと リュウのセットプレイ・コンボ解説",
    "guide",
    "2026-03-26",
    "Shuto",
    "リュウのセットプレイ・コンボ解説候補。"
  ],
  [
    "5xlUdexlw3w",
    "【スト6、SF6】リュウ対策。飛び道具に困ってる人は必見！",
    "counter",
    "2026-02-09",
    null,
    "リュウ対策の解説候補。"
  ],
  [
    "qNtPFSHVsYQ",
    "【スト6】全キャラ対策 忘れがちな確定反撃集（リュウでの反撃）",
    "counter",
    "2025-09-07",
    null,
    "リュウでの確定反撃例。旧年度のため現行パッチ未検証。"
  ],
  [
    "58yZDxP9pb4",
    "【スト6】これぞ最強リュウ 立ち回りのキレが半端じゃない!! シュート（リュウ）",
    "match",
    "2026-07-21",
    "Shuto",
    "Shutoのリュウ使用対戦動画候補。"
  ],
  [
    "JllCD8RuWWY",
    "【SF6】世界1位リュウ！武の境地を感じさせる強さ！！ Shuto（リュウ）",
    "match",
    "2026-07-03",
    "Shuto",
    "Shutoのリュウ使用対戦動画候補。順位表記は未検証。"
  ],
  [
    "1dvZg37KaQ8",
    "スト6 ▰ MR1位ひなおリュウ！破壊力が段違いすぎるｗｗ ▰ ひなお（リュウ）",
    "match",
    "2026-01-10",
    "Hinao",
    "Hinaoのリュウ使用対戦動画候補。順位表記は未検証。"
  ],
  [
    "n7SGgM6bgXM",
    "【SF6】世界1位リュウ！一手一手に無駄がない！！ .YAS.（リュウ）",
    "match",
    "2026-07-23",
    "YAS",
    "YASのリュウ使用動画候補。プレイヤーのDBステータスはdraft。"
  ]
] as const;
export const RYU_VIDEO_PREVIEW: VideoSummary[] = candidates.map(([youtubeId, title, videoType, date, player, description]) => ({
  id: `preview-ryu-${youtubeId}`, slug: `preview-ryu-${youtubeId}`, title,
  platform: "youtube", videoType, publishedAt: `${date}T00:00:00Z`, description,
  url: `https://www.youtube.com/watch?v=${youtubeId}`,
  thumbnailUrl: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
  channelName: null, durationSeconds: null, language: null, controlTypes: [],
  events: [], characters: ["リュウ"], players: player ? [player] : [], categories: [videoType],
  level: "unknown", viewCount: null, viewCountCheckedAt: null,
}));
