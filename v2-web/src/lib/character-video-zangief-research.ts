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
  },
  {
    "id": "B1-Dp1ZzV6g",
    "title": "こばやん（ザンギエフ）世界1位の投げの暴力",
    "channel": "SF6-MODERN",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=B1-Dp1ZzV6g"
  },
  {
    "id": "DKaO4Dup2qs",
    "title": "こばやん（ザンギエフ）恐怖の近距離戦",
    "channel": "SF6-MODERN",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=DKaO4Dup2qs"
  },
  {
    "id": "VCnN3DPdTPM",
    "title": "Junior（ザンギエフ）世界1位の近距離戦",
    "channel": "SF6-MODERN",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=VCnN3DPdTPM"
  },
  {
    "id": "GQTZjWHEtww",
    "title": "SF6: Zangief Combos + Hype!",
    "channel": "desk",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=GQTZjWHEtww"
  },
  {
    "id": "RbQztrP_Pcw",
    "title": "SFL2026 カワノ（ルーク）対Jr.（ザンギエフ）",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://yutura.net/channel/47625/video/RbQztrP_Pcw/"
  },
  {
    "id": "uafn_f_IbYQ",
    "title": "SFL2026 MenaRD（ルーク）対こばやん（ザンギエフ）",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://yutura.net/channel/47625/video/uafn_f_IbYQ/"
  },
  {
    "id": "elXo-r39uLU",
    "title": "SFL2026 Seiya（春麗）対板橋ザンギエフ（ザンギエフ）",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://yutura.net/channel/47625/video/elXo-r39uLU/"
  },
  {
    "id": "JD2_NKqTxBI",
    "title": "SFL2026 ひなお（サガット／リュウ）対板橋ザンギエフ（ザンギエフ）",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://yutura.net/channel/47625/video/JD2_NKqTxBI/"
  },
  {
    "id": "3bdPWvARRjw",
    "title": "SFL2026 らおやむ（ベガ）対Jr.（ザンギエフ）",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://yutura.net/channel/47625/video/3bdPWvARRjw/"
  },
  {
    "id": "myH8vsW5C3o",
    "title": "SFL2026 板橋ザンギエフ（ザンギエフ）対水派（キャミィ）",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://yutura.net/channel/47625/video/myH8vsW5C3o/"
  },
  {
    "id": "B7A1fzI0AU4",
    "title": "SFL2026板橋ザンギエフの公式ハイライト",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://yutura.net/channel/47625/video/B7A1fzI0AU4/"
  },
  {
    "id": "Q4roaJhhZjU",
    "title": "ザンギエフExpert 2コンボトライアル参考",
    "channel": "投稿者未確認",
    "kind": "guide",
    "source": "https://www.reddit.com/r/StreetFighter/comments/1n3gt5z"
  },
  {
    "id": "kATfcH329_I",
    "title": "ザンギエフExpert 3コンボトライアル参考",
    "channel": "投稿者未確認",
    "kind": "guide",
    "source": "https://www.reddit.com/r/StreetFighter/comments/1n3gt5z"
  },
  {
    "id": "60Ay_4arCFc",
    "title": "EVOフランスのザンギ選手こばやん・板橋ザンギエフの解説",
    "channel": "立川ちゃんねる",
    "kind": "guide",
    "source": "https://www.tubetre.com/videos/view/60Ay_4arCFc"
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
