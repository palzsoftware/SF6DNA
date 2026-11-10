import type { VideoSummary } from "@/lib/event-media";
/** Ingrid video research: source-linked preview candidates only. 
 * counter = advice AGAINST Ingrid. Full playback, content, patch and publication approval remain unverified.
 * Deleted/unavailable historic videos are intentionally excluded. */
const candidates = [
  {
    "id": "1o4EPXASNwg",
    "title": "Street Fighter 6 Ingrid Combo Guide! Annotations & Timestamps",
    "channel": "VesperArcade",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=1o4EPXASNwg",
    "published": "2026-05-30"
  },
  {
    "id": "lJKr8s3TII0",
    "title": "イングリッドの立ち回りから必須コンボまで！使い方解説",
    "channel": "煌月ソウル【スト6解説】",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=lJKr8s3TII0",
    "published": "2026-06-05"
  },
  {
    "id": "1kFHnxOx36A",
    "title": "SF6 Ingrid Combos Guide",
    "channel": "MC MuraFGC",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=1kFHnxOx36A",
    "published": "2026-05-28"
  },
  {
    "id": "TC5iK3yiOXk",
    "title": "【スト6、SF6】絶対勝率が上がる！イングリッド対策！",
    "channel": "ACQUA",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=TC5iK3yiOXk",
    "published": "2026-06-01"
  },
  {
    "id": "w-xf_il8xqg",
    "title": "【スト6】イングリッド対策 実践編！実戦で勝率を上げる立ち回りと攻略ポイントを徹底解説",
    "channel": "いおりチャンネル",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=w-xf_il8xqg",
    "published": "2026-06-04"
  },
  {
    "id": "zeXnNeBJysM",
    "title": "イングリッドに勝てない人へ。歌広場さんと学ぶ対策講座【スト6】",
    "channel": "いおりチャンネル",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=zeXnNeBJysM",
    "published": "2026-06-02"
  },
  {
    "id": "q-HasgU1a_U",
    "title": "【5選】知識で差がつく『イングリッド対策』徹底解説 // じゃじい × ハメコ。",
    "channel": "SmashlogTV - SF6",
    "kind": "counter",
    "source": "https://sf6-ingrid.com/article/ingrid-matchup-anti-5-tips-smashlog",
    "published": "2026-06-12"
  },
  {
    "id": "I_pM4R_dO68",
    "title": "【スト6】イングリッドの実戦コンボ＆セットプレイまとめ！とりあえずこれ覚えればOK【SF6】",
    "channel": "いおりチャンネル",
    "kind": "guide",
    "source": "https://yutura.net/channel/75881/video/I_pM4R_dO68/",
    "published": "2026-10-01"
  }
] as const;

export const CHARACTER_VIDEO_INGRID_RESEARCH: VideoSummary[] = candidates.map(({id,title,channel,kind,source,published}): VideoSummary => ({
  id:`preview-ingrid-${id}`, slug:`preview-ingrid-${id}`, title, platform:"youtube", videoType:kind,
  publishedAt: `${published}T00:00:00Z`,
  description:`${kind === "counter" ? "イングリッドに勝つためのキャラ対策候補。" : "イングリッドの使い方・コンボ解説候補。"} 参照元: ${source}。動画本編・現行Patch・再生可否・公開承認は未検証です。`,
  url:`https://www.youtube.com/watch?v=${id}`, thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  channelName:channel, durationSeconds:null, language:null, controlTypes:[], events:[],
  characters:["イングリッド"], players:[], categories:[kind], level:"unknown", viewCount:null, viewCountCheckedAt:null,
}));
