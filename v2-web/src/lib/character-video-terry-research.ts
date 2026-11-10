import type { VideoSummary } from "@/lib/event-media";
/** Terry source-traced preview research. Counter means guidance AGAINST Terry, not Terry against a different character. Gameplay, playback and patch applicability unverified. */
const candidates = [
  {
    "id": "33f_hbjcsoo",
    "title": "STREET FIGHTER 6 TERRY COMBOS! Complete Combo Guide",
    "channel": "VesperArcade",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=33f_hbjcsoo"
  },
  {
    "id": "cE2LkHjyVOc",
    "title": "Terry Bogard Combo Guide - Street Fighter 6",
    "channel": "rooflemonger",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=cE2LkHjyVOc"
  },
  {
    "id": "mI1ETHpxP9o",
    "title": "SF6 BnB Combo Tutorial and Character Guide - Terry",
    "channel": "Bafael",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=mI1ETHpxP9o"
  },
  {
    "id": "8sMUpVJbhko",
    "title": "Street Fighter 6 Terry Guide! Setups, Combos & Tricks",
    "channel": "VesperArcade",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=8sMUpVJbhko"
  },
  {
    "id": "m06SpxkC1kE",
    "title": "Street Fighter 6 Terry Guide! Advanced Tips, Gameplan & Strategy",
    "channel": "VesperArcade",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=m06SpxkC1kE"
  },
  {
    "id": "K0Cch96LzPE",
    "title": "【スト6】テリー対策",
    "channel": "Torimeshi",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=K0Cch96LzPE"
  },
  {
    "id": "KPNyZTFHfKw",
    "title": "【スト６】2026年8月3日版 テリーコンボ解説",
    "channel": "きんちょ / kincho",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=KPNyZTFHfKw"
  },
  {
    "id": "DNwn7MB_Vew",
    "title": "【スト６】きんちょのテリーコンボ総合解説",
    "channel": "きんちょ / kincho",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=DNwn7MB_Vew"
  },
  {
    "id": "PYE_EX2kfxM",
    "title": "2026年3月版テリーコンボ解説",
    "channel": "きんちょ / kincho",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=PYE_EX2kfxM"
  },
  {
    "id": "H03ot-F0SfE",
    "title": "Classic TERRY Combos & Setup guide",
    "channel": "Joe Ebios",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=H03ot-F0SfE"
  },
  {
    "id": "740x8d6Lpew",
    "title": "SF6 TERRY Fundamentals Guide: The ONLY Combos & Setups You Need",
    "channel": "Joe Ebios",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=740x8d6Lpew"
  },
  {
    "id": "_dLySKPCcLc",
    "title": "202603ver テリー基本コンボ",
    "channel": "メノ(Meno)",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=_dLySKPCcLc"
  },
  {
    "id": "rnXgyjtIA_Q",
    "title": "Street Fighter 6 - Terry Combo Guide (Modern Controls)",
    "channel": "In my Dragon Age era",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=rnXgyjtIA_Q"
  }
] as const;

export const CHARACTER_VIDEO_TERRY_RESEARCH: VideoSummary[] = candidates.map(({id,title,channel,kind,source}): VideoSummary => ({
 id:`preview-terry-${id}`,slug:`preview-terry-${id}`,title,platform:"youtube",videoType:kind,publishedAt:null,
 description:`${kind === "counter" ? "テリーへの対策。" : "テリーの攻略・使い方。"}出典: ${source}。再生可否・現行Patch適合・公開承認は未検証です。`,
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],characters:["テリー"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
