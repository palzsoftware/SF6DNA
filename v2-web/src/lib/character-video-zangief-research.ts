import type { VideoSummary } from "@/lib/event-media";
/** Zangief candidate video research. Source URLs document discovery.
 * Only YouTube ID/title are checked; playback and current-patch applicability unverified. */
const candidates = [
  {
    "id": "t5Ze-BGLwQw",
    "title": "SA2の使い方：起き攻め・セットプレイ・コンボ",
    "channel": "ザンギもん【スト6】ザンギエフ解説",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=t5Ze-BGLwQw"
  },
  {
    "id": "2vf-MVDimZc",
    "title": "SF6 Zangief: A Highly Situational SPD Combo Guide",
    "channel": "膝十字断裂丸 Street Fighter 6 Zangief",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=2vf-MVDimZc"
  },
  {
    "id": "2-Vx6NSgzgw",
    "title": "ザンギエフYear3完全ガイド",
    "channel": "戦闘民族ずんだもん【アクションゲーム解説】",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=2-Vx6NSgzgw"
  },
  {
    "id": "zROn7wmg984",
    "title": "SF6 Zangief Combo Guide",
    "channel": "LVCKYJ",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=zROn7wmg984"
  },
  {
    "id": "SMfIHkbpQbo",
    "title": "スメタナドロップキックで飛び道具を無効化するザンギエフ",
    "channel": "ストーム久保",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=SMfIHkbpQbo"
  },
  {
    "id": "0heYVC1vxQw",
    "title": "ザンギエフの高IQ逆択とコマンド投げ",
    "channel": "ストーム久保",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=0heYVC1vxQw"
  },
  {
    "id": "DrTupeasPPU",
    "title": "ザンギエフ初心者向け：コマ投げ後の攻め継続",
    "channel": "べーやんの部屋【ゆっくり解説チャンネル】",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=DrTupeasPPU"
  },
  {
    "id": "xt4vSlsvVB8",
    "title": "ザンギエフ新アウトフィットと対戦",
    "channel": "ストーム久保",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=xt4vSlsvVB8"
  },
  {
    "id": "RW6plRm5rxg",
    "title": "MR1位到達！ランクマを制圧した板橋ザンギエフ",
    "channel": "Itabashi Zangief",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=RW6plRm5rxg"
  },
  {
    "id": "gJFqsBazLYE",
    "title": "レジェンドザンギ！板橋ザンギエフのランクマ",
    "channel": "SF6-MODERN",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=gJFqsBazLYE"
  },
  {
    "id": "P9-jFrCdutA",
    "title": "ザンギエフでランクマッチ#01",
    "channel": "SOMA",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=P9-jFrCdutA"
  },
  {
    "id": "TsWf0gZU_b8",
    "title": "新ACTになってから触ってねぇ！十神流ザンギエフ",
    "channel": "★十神★【TENSHIN】",
    "kind": "match",
    "source": "https://yutura.net/channel/135836/video/TsWf0gZU_b8/"
  },
  {
    "id": "e4gwqPVg8lc",
    "title": "スト6#272 ゆるザンギ",
    "channel": "えよこ",
    "kind": "match",
    "source": "https://yutura.net/channel/118382/video/e4gwqPVg8lc/"
  },
  {
    "id": "KgITtE8Agxg",
    "title": "板橋ザンギエフの神リーサル",
    "channel": "Itabashi Zangief",
    "kind": "guide",
    "source": "https://yutura.net/channel/143874/video/KgITtE8Agxg/"
  }
] as const;
export const CHARACTER_VIDEO_ZANGIEF_RESEARCH: VideoSummary[] = candidates.map(({id,title,channel,kind,source}): VideoSummary => ({
  id:`preview-zangief-${id}`, slug:`preview-zangief-${id}`, title,
  platform:"youtube",videoType:kind,publishedAt:null,
  description:`ザンギエフ関連候補。参照元: ${source}。現行Patch・映像再生は未確認。`,
  url:`https://www.youtube.com/watch?v=${id}`,
  thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],
  characters:["ザンギエフ"],players:[],categories:[kind],level:"unknown",
  viewCount:null,viewCountCheckedAt:null
}));
