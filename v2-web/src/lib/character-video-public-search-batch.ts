import type { VideoSummary } from "@/lib/event-media";
/**
 * 2026-11-09 YouTube/public-index source-checked research intake.
 * A source link supports video identity/title only. Game patch, footage,
 * playback and player relations are not verified. Preview only.
 */
const candidates = [
  {
    "slug": "e-honda",
    "name": "E.本田",
    "id": "V5QLMVF5RFw",
    "title": "1分でわかるE 本田対策【SF6】",
    "channel": "格ゲーゴリラ やさい",
    "date": "2024-02-27",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=V5QLMVF5RFw"
  },
  {
    "slug": "manon",
    "name": "マノン",
    "id": "jyWW6SeSN4o",
    "title": "【スト6】year2対応！基本と応用を抑えたマノンの実践コンボ20選！",
    "channel": "GANAKEN / ガナケン",
    "date": "2024-05-24",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=jyWW6SeSN4o"
  },
  {
    "slug": "marisa",
    "name": "マリーザ",
    "id": "wivf-ugfXdQ",
    "title": "【スト6】マリーザの新コンボと起き攻め セットプレイを紹介【2024.12.02版】",
    "channel": "ミダ猫のゲーム動画",
    "date": "2024-12-06",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=wivf-ugfXdQ"
  },
  {
    "slug": "zangief",
    "name": "ザンギエフ",
    "id": "KoHTZr4R8gs",
    "title": "【スト6】ザンギエフのコンボ集！year3対応！アルマスザンギが使ってるコンボまとめ",
    "channel": "ザンギもん【スト6】ザンギエフ解説",
    "date": "2025-07-26",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=KoHTZr4R8gs"
  },
  {
    "slug": "zangief",
    "name": "ザンギエフ",
    "id": "9ifE4i8cQgU",
    "title": "【スト6 #shorts】飛びからのコンボ【ザンギエフ/Zangief】",
    "channel": "えよこ",
    "date": "2023-06-11",
    "kind": "guide",
    "source": "https://yutura.net/channel/118382/popular/9ifE4i8cQgU/"
  },
  {
    "slug": "cammy",
    "name": "キャミィ",
    "id": "ccybh6-78fQ",
    "title": "【スト6】キャミィ とりこれ汎用コンボ セットプレイ 起き攻め 実戦必須テク総集編",
    "channel": "猫と隼チャンネル",
    "date": "2025-05-05",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=ccybh6-78fQ"
  },
  {
    "slug": "cammy",
    "name": "キャミィ",
    "id": "hkJFt0DTDVI",
    "title": "【スト6】キャミィ 強行動 強連携 コンボ 起き攻め セットプレイ SF6 Cammy Combo Oki Setup",
    "channel": "レイ / Ray",
    "date": "2026-04-08",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=hkJFt0DTDVI"
  },
  {
    "slug": "cammy",
    "name": "キャミィ",
    "id": "K9SuTKKaRxY",
    "title": "【スト6】キャミィ 小技からのコンボ集～基本から応用まで～",
    "channel": "そーだらいと",
    "date": "2023-10-25",
    "kind": "guide",
    "source": "https://sf6-genten.com/article/cammy-light-attack-combos-basic-sodalight"
  },
  {
    "slug": "aki",
    "name": "A.K.I.",
    "id": "DiCKt9EzwYY",
    "title": "スト6 AKI コンボ 使い方 セットプレイ解説 最大7195ダメージ",
    "channel": "Yochimon_Games",
    "date": "2023-09-29",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=DiCKt9EzwYY"
  },
  {
    "slug": "ed",
    "name": "エド",
    "id": "SxL-XoF1TUo",
    "title": "【スト6】エド 強行動 強連携 コンボ 起き攻め セットプレイ SF6 Ed Combo Oki Setup",
    "channel": "レイ / Ray",
    "date": "2026-01-21",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=SxL-XoF1TUo"
  }
] as const;
export const NEXT_TEN_PUBLIC_SEARCH_BATCH: Readonly<Record<string, VideoSummary[]>> =
  Object.fromEntries(
    candidates.reduce((map, video) => {
      const record: VideoSummary = {
        id: `preview-${video.slug}-${video.id}`,
        slug: `preview-${video.slug}-${video.id}`,
        title: video.title,
        platform: "youtube",
        videoType: video.kind,
        publishedAt: `${video.date}T00:00:00Z`,
        description: `候補動画。調査元: ${video.source}。攻略内容・現行Patch・再生可否・出演者関係は未検証です。`,
        url: `https://www.youtube.com/watch?v=${video.id}`,
        thumbnailUrl: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
        channelName: video.channel,
        durationSeconds: null,
        language: null,
        controlTypes: [],
        events: [],
        characters: [video.name],
        players: [],
        categories: [video.kind],
        level: "unknown",
        viewCount: null,
        viewCountCheckedAt: null,
      };
      const videos = map.get(video.slug) ?? [];
      videos.push(record);
      map.set(video.slug, videos);
      return map;
    }, new Map<string, VideoSummary[]>()),
  );
