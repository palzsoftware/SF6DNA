import type { VideoSummary } from "@/lib/event-media";
/** Akuma (豪鬼): videos are filed under counter TARGET, regardless of the character used in the guide. Preview-only; playback, patch applicability and approval not checked. */
const candidates = [
  {
    "id": "O8vfYgGi9hY",
    "title": "【スト6】ストリートファイター6講座 豪鬼対策",
    "channel": "石上ですが",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=O8vfYgGi9hY",
    "counterTarget": "akuma"
  },
  {
    "id": "PfWY23CqD0c",
    "title": "【スト6】MR2000の豪鬼対策",
    "channel": "スト6攻略備忘録チャンネル",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=PfWY23CqD0c",
    "counterTarget": "akuma"
  },
  {
    "id": "teQF_xr_cj8",
    "title": "JPさんによる１キャラ３対策のススメ 豪鬼編",
    "channel": "ユーユー",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=teQF_xr_cj8",
    "counterTarget": "akuma"
  },
  {
    "id": "z6BHE41pKig",
    "title": "16分でわかる豪鬼対策【ベガ目線】",
    "channel": "大車輪",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=z6BHE41pKig",
    "counterTarget": "akuma"
  },
  {
    "id": "_vgVSWpFA7U",
    "title": "しゅーとが豪鬼のコンボを徹底解説",
    "channel": "しゅーとチャンネル / Shuto",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=_vgVSWpFA7U",
    "counterTarget": null
  },
  {
    "id": "dJbPPckZUrA",
    "title": "Year3対応 豪鬼の実用コンボ集",
    "channel": "名刀牧奈ch",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=dJbPPckZUrA",
    "counterTarget": null
  },
  {
    "id": "YxtKvL-r9-4",
    "title": "SF6 AKUMA Beginner Guide: The ONLY Combos & Setups You Need",
    "channel": "Joe Ebios",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=YxtKvL-r9-4",
    "counterTarget": null
  },
  {
    "id": "TNXx-RHBF7E",
    "title": "中央でのコンボの安さを解決？豪鬼の新しい強さをウメハラが解説",
    "channel": "Daigo the BeasTV",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=TNXx-RHBF7E",
    "counterTarget": null
  }
] as const;

export const CHARACTER_VIDEO_AKUMA_RESEARCH: VideoSummary[] = candidates.map(({id,title,channel,kind,source,counterTarget}): VideoSummary => ({
 id:`preview-akuma-${id}`,slug:`preview-akuma-${id}`,title,platform:"youtube",videoType:kind,publishedAt:null,
 description:`${counterTarget ? "豪鬼への対策動画（対象キャラ：豪鬼）。" : "豪鬼の使い方・攻略動画。"}出典: ${source}。動画再生・収録内容・現行Patch・公開適格性は未検証です。`,
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],characters:["豪鬼"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
