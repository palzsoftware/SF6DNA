import type { VideoSummary } from "@/lib/event-media";
/** 2026-11-09 independent public lookup. Titles marked 原題未確認 are descriptive placeholders. */
const candidates = [
  {
    "slug": "dee-jay",
    "name": "ディージェイ",
    "id": "jAM8BfyErFE",
    "title": "【スト6】勝てるようになる『ディージェイの使い方』解説~初級者編~",
    "channel": "Rush Gorou",
    "date": "2024-01-12",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=jAM8BfyErFE"
  },
  {
    "slug": "lily",
    "name": "リリー",
    "id": "Dpxrje6DShA",
    "title": "リリー関連候補｜基本セットプレイ（原題未確認）",
    "channel": "",
    "date": null,
    "kind": "guide",
    "source": "https://note.com/chorisoism/n/n891bbdbc8857"
  },
  {
    "slug": "lily",
    "name": "リリー",
    "id": "MVbI8MuKJTI",
    "title": "リリー関連候補｜コンボ（原題未確認）",
    "channel": "",
    "date": null,
    "kind": "guide",
    "source": "https://note.com/chorisoism/n/n891bbdbc8857"
  },
  {
    "slug": "lily",
    "name": "リリー",
    "id": "G6Cguubt9iw",
    "title": "リリー関連候補｜立ち回り（原題未確認）",
    "channel": "",
    "date": null,
    "kind": "guide",
    "source": "https://note.com/chorisoism/n/n891bbdbc8857"
  },
  {
    "slug": "lily",
    "name": "リリー",
    "id": "HnYG1kCwF_I",
    "title": "リリー関連候補｜キャラの強み（原題未確認）",
    "channel": "",
    "date": null,
    "kind": "guide",
    "source": "https://note.com/chorisoism/n/n891bbdbc8857"
  },
  {
    "slug": "lily",
    "name": "リリー",
    "id": "_PCa_yyjFDA",
    "title": "リリー関連候補｜ブレイブ関連（原題未確認）",
    "channel": "",
    "date": null,
    "kind": "guide",
    "source": "https://note.com/chorisoism/n/n891bbdbc8857"
  }
] as const;
export const NEXT_TEN_PUBLIC_SEARCH_FOLLOWUP: Readonly<Record<string, VideoSummary[]>> = Object.fromEntries(
  candidates.reduce((map, row) => {
    const video: VideoSummary = {
      id: `preview-${row.slug}-${row.id}`,
      slug: `preview-${row.slug}-${row.id}`,
      title: row.title,
      platform: "youtube",
      videoType: row.kind,
      publishedAt: row.date ? `${row.date}T00:00:00Z` : null,
      description: `公開索引からの動画候補。出典: ${row.source}。原題・投稿者が未確認の場合は仮表示。再生・現行Patch・関係は未検証。`,
      url: `https://www.youtube.com/watch?v=${row.id}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${row.id}/hqdefault.jpg`,
      channelName: row.channel || null,
      durationSeconds: null,
      language: null,
      controlTypes: [],
      events: [],
      characters: [row.name],
      players: [],
      categories: [row.kind],
      level: "unknown",
      viewCount: null,
      viewCountCheckedAt: null,
    };
    const existing = map.get(row.slug) ?? [];
    existing.push(video);
    map.set(row.slug, existing);
    return map;
  }, new Map<string, VideoSummary[]>()),
);
