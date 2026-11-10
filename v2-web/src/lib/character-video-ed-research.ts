import type { VideoSummary } from "@/lib/event-media";
/** Video research intake for Ed. Source identity checked, but content, playback, patch and publication remain unverified. Preview only. */
const candidates = [
  {
    "id": "PnMuB3ACUBg",
    "title": "ももちがエドのコンボダメージを検証",
    "channel": "ももち / Momochi",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=PnMuB3ACUBg"
  },
  {
    "id": "6YRL_nNHhyY",
    "title": "花前ハル Cエド コンボ修行",
    "channel": "花前ハル",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=6YRL_nNHhyY"
  },
  {
    "id": "O884EWk51Ko",
    "title": "常闇トワ ももちからエドを学ぶ配信",
    "channel": "常闇トワ",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=O884EWk51Ko"
  },
  {
    "id": "z4YJ_80vW7M",
    "title": "エド対策 詐欺重ね",
    "channel": "ずんだもんふぁいたーch",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=z4YJ_80vW7M"
  },
  {
    "id": "aQeDMa125KY",
    "title": "ももちエドのドリームコンボ実戦",
    "channel": "昇龍拳",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=aQeDMa125KY"
  },
  {
    "id": "lowmMFUBEzw",
    "title": "Street Fighter 6 Ed Combo Guide",
    "channel": "MC MuraFGC",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=lowmMFUBEzw"
  },
  {
    "id": "m4JZB8gV3zc",
    "title": "Street Fighter 6 Ed Complete Combo Guide",
    "channel": "VesperArcade",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=m4JZB8gV3zc"
  },
  {
    "id": "5_VTKLNfb0I",
    "title": "Must Know Ed Combos",
    "channel": "2XKairos",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=5_VTKLNfb0I"
  },
  {
    "id": "pM9KOJhhwTE",
    "title": "SFL2026 あでりい エド vs マゴ 舞",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=pM9KOJhhwTE"
  },
  {
    "id": "Vi0lUTPCUMw",
    "title": "SFL2026 ふ〜ど エド vs ひかる A.K.I.",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=Vi0lUTPCUMw"
  },
  {
    "id": "4gk73UTxM54",
    "title": "さはらとももちのエド対戦と大会振り返り",
    "channel": "常闇トワ切り抜きch",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=4gk73UTxM54"
  },
  {
    "id": "u6eDjzMAdew",
    "title": "エドの調整を立川と検討する常闇トワ",
    "channel": "常闇トワ切り抜きch",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=u6eDjzMAdew"
  },
  {
    "id": "Oof7jZJILkE",
    "title": "SFL2026 さはら エド vs ふ〜ど C.ヴァイパー",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=Oof7jZJILkE"
  },
  {
    "id": "yOseauyL0X4",
    "title": "SFL2026 さはら エド vs マゴ 舞",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=yOseauyL0X4"
  },
  {
    "id": "yZghMVOFUzU",
    "title": "SFL2026 ひなお サガット vs あでりい エド",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=yZghMVOFUzU"
  },
  {
    "id": "ltbILW5S9z8",
    "title": "SFL2024 どぐら ベガ vs LeShar エド",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=ltbILW5S9z8"
  },
  {
    "id": "WiMQTdWNJTI",
    "title": "Capcom Cup 12 LeShar エド対戦解説",
    "channel": "ハイタニ TV",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=WiMQTdWNJTI"
  },
  {
    "id": "Wi621v5tcNY",
    "title": "LeShar エド高レベル対戦",
    "channel": "SF6-MODERN",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=Wi621v5tcNY"
  },
  {
    "id": "ZvavW4J2oqc",
    "title": "Ed Combo Guide Beginner To Advanced",
    "channel": "DarkSynth",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=ZvavW4J2oqc"
  },
  {
    "id": "yVd0gwsynQQ",
    "title": "板橋アルジュン vs LEO-IG エド",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=yVd0gwsynQQ"
  },
  {
    "id": "WHUr6XsG_6Y",
    "title": "Suisenri アルジュン vs LeShar エド",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=WHUr6XsG_6Y"
  },
  {
    "id": "MhGbGjolZhw",
    "title": "ももち エドでレジェンド到達",
    "channel": "ももち / Momochi",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=MhGbGjolZhw"
  },
  {
    "id": "tMHulG-nwfQ",
    "title": "花前ハル Cエド初心者コンボ修行",
    "channel": "花前ハル",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=tMHulG-nwfQ"
  },
  {
    "id": "iSA-vaV3Hs0",
    "title": "蝶屋はなび エド戦対策練習",
    "channel": "蝶屋はなび",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=iSA-vaV3Hs0"
  },
  {
    "id": "-Kn4_NE1F3E",
    "title": "常闇トワ 立川とエド調整を確認する配信",
    "channel": "常闇トワ",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=-Kn4_NE1F3E"
  },
  {
    "id": "4hG9t9fW7h4",
    "title": "モダンエド アルマス立ち回り講座",
    "channel": "モダンエド専門学校",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=4hG9t9fW7h4"
  },
  {
    "id": "DAqSouh35W0",
    "title": "ACQUA モダンエド使い方講座",
    "channel": "ACQUA",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=DAqSouh35W0"
  },
  {
    "id": "-MWSDa1CW2o",
    "title": "常闇トワ SCARZ CUPエド練習",
    "channel": "常闇トワ切り抜きch",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=-MWSDa1CW2o"
  },
  {
    "id": "7XHX376EKPU",
    "title": "さはらが常闇トワをエドコーチング",
    "channel": "常闇トワ切り抜きch",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=7XHX376EKPU"
  },
  {
    "id": "1ZuemRRS8YY",
    "title": "常闇トワ Mエド V最チーム練習",
    "channel": "常闇トワ切り抜きch",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=1ZuemRRS8YY"
  },
  {
    "id": "TkVs1MgTkFg",
    "title": "ももちと常闇トワのエド対決",
    "channel": "ホロライブ切り抜き隊",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=TkVs1MgTkFg"
  },
  {
    "id": "kL3EjCxDwb4",
    "title": "ももちのMエドドリームコーチング",
    "channel": "常闇トワ切り抜きch",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=kL3EjCxDwb4"
  },
  {
    "id": "haflmHtnvGk",
    "title": "立川 エドコーチング 獅白杯向け",
    "channel": "常闇トワ切り抜きch",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=haflmHtnvGk"
  },
  {
    "id": "w7lMBJrwKT4",
    "title": "さはら MエドによるJP対策コーチング",
    "channel": "常闇トワ切り抜きch",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=w7lMBJrwKT4"
  },
  {
    "id": "v-p_duBk_5E",
    "title": "常闇トワ Mエド マスター昇格まで",
    "channel": "ホロライブ切り抜き隊",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=v-p_duBk_5E"
  },
  {
    "id": "fopQzDGVUQ4",
    "title": "常闇トワ エド大型調整確認",
    "channel": "常闇トワ",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=fopQzDGVUQ4"
  },
  {
    "id": "C1I_K5Kimdk",
    "title": "常闇トワ ももち さはら TOP エド対戦",
    "channel": "常闇トワ",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=C1I_K5Kimdk"
  },
  {
    "id": "aA450Ly66ok",
    "title": "さはらによる常闇トワ Mエド対JP練習 元配信",
    "channel": "常闇トワ",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=aA450Ly66ok"
  },
  {
    "id": "SwWfVg00DzE",
    "title": "立川が常闇トワにエドの立ち回りを教える元配信",
    "channel": "常闇トワ",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=SwWfVg00DzE"
  },
  {
    "id": "CHeYsNBglD8",
    "title": "ももちによる常闇トワのエド実戦コーチング 元配信",
    "channel": "常闇トワ",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=CHeYsNBglD8"
  },
  {
    "id": "fJQ5Ejz6uE4",
    "title": "ももちによるエドドリームコンボコーチング",
    "channel": "常闇トワ切り抜きch",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=fJQ5Ejz6uE4"
  },
  {
    "id": "vx5qAhmLeQo",
    "title": "常闇トワ Mエド マスター昇格元配信",
    "channel": "常闇トワ",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=vx5qAhmLeQo"
  },
  {
    "id": "-smAc9w7jIg",
    "title": "立川がMエドの次の練習目標を指導",
    "channel": "ホロライブ切り抜き隊",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=-smAc9w7jIg"
  }
] as const;

export const CHARACTER_VIDEO_ED_RESEARCH: VideoSummary[] = candidates.map(({id,title,channel,kind,source}): VideoSummary => ({
  id: `preview-ed-${id}`,
  slug: `preview-ed-${id}`,
  title,
  platform: "youtube",
  videoType: kind,
  publishedAt: null,
  description: `エド関連の研究候補。出典: ${source}。動画再生・全編の使用キャラ・現在Patch・公開承認は未確認です。`,
  url: `https://www.youtube.com/watch?v=${id}`,
  thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  channelName: channel,
  durationSeconds: null,
  language: null,
  controlTypes: [],
  events: [],
  characters: ["エド"],
  players: [],
  categories: [kind],
  level: "unknown",
  viewCount: null,
  viewCountCheckedAt: null,
}));
