import type { VideoSummary } from "@/lib/event-media";
/** Mai preview research candidates: counter means fighting AGAINST Mai. No publication or patch verification. */
const candidates = [
  {
    "id": "gtfmRj-yK4A",
    "title": "Mai Shiranui Combo Guide - Street Fighter 6",
    "channel": "rooflemonger",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=gtfmRj-yK4A"
  },
  {
    "id": "EzIJY013-U0",
    "title": "Street Fighter 6 Starter Guide for Mai Shiranui",
    "channel": "IGN",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=EzIJY013-U0"
  },
  {
    "id": "f78kDhtzHlY",
    "title": "舞 最強コンボ集【解説付き】",
    "channel": "ナウマン / Nauman",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=f78kDhtzHlY"
  },
  {
    "id": "YlOqitnNEA4",
    "title": "SF6 Mai Combo Guide - Essential Routes and Cashouts",
    "channel": "raidhyn",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=YlOqitnNEA4"
  },
  {
    "id": "NVckT4RZVi8",
    "title": "簡単にできて実戦的な舞対策",
    "channel": "ACQUA",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=NVckT4RZVi8"
  },
  {
    "id": "8D-UoGVOdJE",
    "title": "舞対策 やられるとマジで困る舞対策を暴露",
    "channel": "たこ煮",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=8D-UoGVOdJE"
  },
  {
    "id": "20DIAA9Js14",
    "title": "舞のコンボの固定化について",
    "channel": "山崎だだだ",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=20DIAA9Js14"
  },
  {
    "id": "EdvYqpPiR4A",
    "title": "舞のコンボ＆セットプレイを徹底解説",
    "channel": "いおりチャンネル",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=EdvYqpPiR4A"
  },
  {
    "id": "HUh85zfflxA",
    "title": "コマンド無しで勝てるモダン舞",
    "channel": "えだ",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=HUh85zfflxA"
  },
  {
    "id": "u5O4saobv0E",
    "title": "SFL2026 ふ～ど C.ヴァイパー vs KEI.B 舞",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=u5O4saobv0E"
  },
  {
    "id": "PEofQ1nxhqw",
    "title": "舞実装！簡単から高火力までコンボ解説",
    "channel": "ぷげら pugera",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=PEofQ1nxhqw"
  },
  {
    "id": "TT4qIpqKI10",
    "title": "勝てるようになる舞の使い方",
    "channel": "Gorou / 五郎",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=TT4qIpqKI10"
  },
  {
    "id": "yPB0njAEjTU",
    "title": "SFL2026 ヤマグチ 舞 vs きんちょ テリー",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=yPB0njAEjTU"
  },
  {
    "id": "b9--aV-pa-U",
    "title": "10分で分かるモダン舞 徹底解説",
    "channel": "シラバイクロム",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=b9--aV-pa-U"
  },
  {
    "id": "GCy88rhmgbk",
    "title": "SFL2026 りゅうきち 舞 vs ひぐち ガイル",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=GCy88rhmgbk"
  },
  {
    "id": "YUUwamdJnd8",
    "title": "SFL2026 ナウマン 舞 vs ときど JP",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=YUUwamdJnd8"
  },
  {
    "id": "GOJvwSFRuRo",
    "title": "SFL2026 ボンちゃん サガット vs もけ 舞",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=GOJvwSFRuRo"
  },
  {
    "id": "UaI4L_OZQnc",
    "title": "SFL2026 もけ 舞 vs ひびき リリー",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=UaI4L_OZQnc"
  },
  {
    "id": "Fp_A_VA_D7k",
    "title": "SFL2026 大谷 ケン vs KEI.B 舞",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=Fp_A_VA_D7k"
  },
  {
    "id": "yOseauyL0X4",
    "title": "SFL2026 さはら エド vs マゴ 舞",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=yOseauyL0X4"
  }
] as const;
export const CHARACTER_VIDEO_MAI_RESEARCH: VideoSummary[] = candidates.map(({id,title,channel,kind,source}): VideoSummary => ({
 id:`preview-mai-${id}`,slug:`preview-mai-${id}`,title,platform:"youtube",videoType:kind,publishedAt:null,
 description:`${kind==="counter"?"舞への対策動画。":kind==="match"?"舞が登場する対戦動画。":"舞の使い方・攻略動画。"} 出典: ${source}。内容詳細・動画再生・現在Patch・公開適格性は未検証です。`,
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],characters:["舞"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
