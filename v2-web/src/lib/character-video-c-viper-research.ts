import type { VideoSummary } from "@/lib/event-media";
/** C. Viper research candidates sourced from indexed YouTube pages. Preview only: playback and current patch applicability unverified. Counter videos target C. Viper. */
const candidates = [
  {
    "id": "Ka0KUJuYe5o",
    "title": "So You Want to Learn C. Viper... | Road to Master",
    "channel": "Nephew",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=Ka0KUJuYe5o"
  },
  {
    "id": "oN2JGpTk6lQ",
    "title": "C. Viper Ultimate Starter Guide - Street Fighter 6",
    "channel": "rooflemonger",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=oN2JGpTk6lQ"
  },
  {
    "id": "sD6SaqB9h-M",
    "title": "Street Fighter 6 C. Viper Combos Guide, With Annotations!",
    "channel": "VesperArcade",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=sD6SaqB9h-M"
  },
  {
    "id": "CHBX-njUPm0",
    "title": "C. Viper Combo Guide - Street Fighter 6",
    "channel": "rooflemonger",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=CHBX-njUPm0"
  },
  {
    "id": "j52YVgja-Ms",
    "title": "C.Viper Beginner Guide | Street Fighter 6",
    "channel": "UltraSnance",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=j52YVgja-Ms"
  },
  {
    "id": "iTETV5HOfJ0",
    "title": "How to beat C. Viper in SF6",
    "channel": "Broski",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=iTETV5HOfJ0"
  },
  {
    "id": "uIp0RtZg_m0",
    "title": "【スト6】ヴァイパーを勉強する！ #あきひろ中学校",
    "channel": "獅白ぼたん",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=uIp0RtZg_m0"
  }
] as const;
export const CHARACTER_VIDEO_C_VIPER_RESEARCH: VideoSummary[] = candidates.map(({id,title,channel,kind,source}): VideoSummary => ({
 id:`preview-c-viper-${id}`,slug:`preview-c-viper-${id}`,title,platform:"youtube",videoType:kind,publishedAt:null,
 description:`${kind==="counter"?"C.ヴァイパーへの対策。":"C.ヴァイパーの攻略・研究。"} 出典: ${source}。再生・内容全編・現行パッチ適合性・公開承認は未検証です。`,
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,channelName:channel,
 durationSeconds:null,language:null,controlTypes:[],events:[],characters:["C.ヴァイパー"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
