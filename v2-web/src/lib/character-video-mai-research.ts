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
  },
  {
    "id": "xWjPz1FufXU",
    "title": "SF6 Mai Practical Combos and Okizeme (2025/08)",
    "channel": "Sea Leaf Dojo",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=xWjPz1FufXU"
  },
  {
    "id": "pM9KOJhhwTE",
    "title": "SFL2026 あでりい エド vs マゴ 舞",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=pM9KOJhhwTE"
  },
  {
    "id": "IBjBV9NxWeg",
    "title": "もけ×ナウマン 舞の弱点と花蝶扇への回答",
    "channel": "SmashlogTV - SF6",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=IBjBV9NxWeg"
  },
  {
    "id": "o1vkmB5DjuE",
    "title": "30秒でわかる舞対策",
    "channel": "えだ",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=o1vkmB5DjuE"
  },
  {
    "id": "E6UhDZaVo3U",
    "title": "SFL2026 KEI.B 舞 vs わびいち テリー",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=E6UhDZaVo3U"
  },
  {
    "id": "DXjs7uddpJU",
    "title": "Mai Shiranui Ultimate Starter Guide",
    "channel": "rooflemonger",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=DXjs7uddpJU"
  },
  {
    "id": "R-wjKWyb24U",
    "title": "テリー視点の舞対策：花蝶扇・画面端・確定反撃",
    "channel": "holosokuのスト6攻略チャンネル",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=R-wjKWyb24U"
  },
  {
    "id": "YTujuiyij9c",
    "title": "マゴ 舞 vs ウメハラ 豪鬼",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=YTujuiyij9c"
  },
  {
    "id": "jXPG3v8kgm4",
    "title": "KIDO アルジュン vs もけ 舞",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=jXPG3v8kgm4"
  },
  {
    "id": "GyoFveyZb5c",
    "title": "Rank 2 Mai Shiranui 高レベル対戦・セットプレイ",
    "channel": "NoMii Aegis",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=GyoFveyZb5c"
  },
  {
    "id": "Iu-oIaPmH_Q",
    "title": "Street Fighter 6 Mai 18 Trade Setups",
    "channel": "ROUBICHL9TAL-YT",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=Iu-oIaPmH_Q"
  },
  {
    "id": "DPjXwpDM43w",
    "title": "リュウ・ケン・豪鬼・舞・ルーク・テリーの違い",
    "channel": "SmashlogTV - SF6",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=DPjXwpDM43w"
  },
  {
    "id": "USexrq4NLX4",
    "title": "ひぐちの舞花蝶扇完全対策",
    "channel": "ひぐちゃんねる",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=USexrq4NLX4"
  },
  {
    "id": "zSBGYWl-cCE",
    "title": "葛葉とどぐらによる舞対策の研究",
    "channel": "どぐらのちょっとええ感じ",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=zSBGYWl-cCE"
  },
  {
    "id": "wy64YtrHaBE",
    "title": "小路KOGがナウマン舞とのスパーを振り返る",
    "channel": "小路KOG",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=wy64YtrHaBE"
  },
  {
    "id": "Pa56fZFXaVc",
    "title": "ACQUA×ハメコ 舞の使い方徹底解説",
    "channel": "SmashlogTV - SF6",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=Pa56fZFXaVc"
  },
  {
    "id": "S4jHKaCg4rc",
    "title": "公式舞キャラクターガイド 日本語版",
    "channel": "PlayStation Japan",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=S4jHKaCg4rc"
  },
  {
    "id": "9waoRzuPD0o",
    "title": "ハイタニによる舞の花蝶扇対策・防御方針",
    "channel": "ハイタニ TV",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=9waoRzuPD0o"
  },
  {
    "id": "jm-Tgn5BHkE",
    "title": "TOPANGA TV マゴが舞の弱点と花蝶扇対策を解説",
    "channel": "mago",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=jm-Tgn5BHkE"
  },
  {
    "id": "g_lWcNT4xqc",
    "title": "舞の実戦基礎コンボ解説 通常編",
    "channel": "あかさか ゆっくり実況",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=g_lWcNT4xqc"
  },
  {
    "id": "nmJ9W-YB_q0",
    "title": "舞の花蝶扇対策まとめ 初心者向け解説",
    "channel": "戦闘民族ずんだもん",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=nmJ9W-YB_q0"
  },
  {
    "id": "Oxz-RHX4sf0",
    "title": "舞まだまだ強いか？ 新環境での舞実戦",
    "channel": "いおりチャンネル",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=Oxz-RHX4sf0"
  },
  {
    "id": "i2D8tttwYKc",
    "title": "紫宮るな 舞対策のコーチングと対戦切り抜き",
    "channel": "さくっと切り抜き",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=i2D8tttwYKc"
  },
  {
    "id": "2nN4kqb8520",
    "title": "紫宮るな 舞対策のコーチング元配信",
    "channel": "紫宮るな",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=2nN4kqb8520"
  },
  {
    "id": "rBDKs_mJo1I",
    "title": "舞の使い方：コンボ・地上戦・花蝶扇・起き攻め",
    "channel": "B",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=rBDKs_mJo1I"
  },
  {
    "id": "wTDVQxLclsk",
    "title": "今夜勝ちたい人のためのモダン舞の使い方4選",
    "channel": "ずんだもんふぁいたーch",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=wTDVQxLclsk"
  },
  {
    "id": "RJR0k7baO6U",
    "title": "キンバリー視点の舞対策",
    "channel": "隼「スト6」",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=RJR0k7baO6U"
  }
] as const;
export const CHARACTER_VIDEO_MAI_RESEARCH: VideoSummary[] = candidates.map(({id,title,channel,kind,source}): VideoSummary => ({
 id:`preview-mai-${id}`,slug:`preview-mai-${id}`,title,platform:"youtube",videoType:kind,publishedAt:null,
 description:`${kind==="counter"?"舞への対策動画。":kind==="match"?"舞が登場する対戦動画。":"舞の使い方・攻略動画。"} 出典: ${source}。内容詳細・動画再生・現在Patch・公開適格性は未検証です。`,
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],characters:["舞"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
