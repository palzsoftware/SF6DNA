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
  },
  {
    "id": "wfybyZfve8M",
    "title": "ウメハラ豪鬼のコンボが進化した高レベル対戦",
    "channel": "スト6 Best Legend Replays",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=wfybyZfve8M",
    "counterTarget": null
  },
  {
    "id": "hHD7cUdQ-tE",
    "title": "ウメハラ豪鬼の新しい武器・コンボとランクマ",
    "channel": "細かすぎて伝えたい梅原大吾",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=hHD7cUdQ-tE",
    "counterTarget": null
  },
  {
    "id": "UZADiO2hvh0",
    "title": "新しい手応えを感じるウメハラ豪鬼の立ち回り",
    "channel": "Daigo the BeasTV",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=UZADiO2hvh0",
    "counterTarget": null
  },
  {
    "id": "c5OQJHg28Dw",
    "title": "ウメハラ豪鬼のコンボ選択と実戦研究",
    "channel": "Daigo the BeasTV",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=c5OQJHg28Dw",
    "counterTarget": null
  },
  {
    "id": "fS-DHB4rvYk",
    "title": "ウメハラ豪鬼MR2400突破・レジェンド1位",
    "channel": "Daigo the BeasTV",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=fS-DHB4rvYk",
    "counterTarget": null
  },
  {
    "id": "ZM8KS_CUmuU",
    "title": "ウメハラ豪鬼の対テリー逆転劇",
    "channel": "Daigo the BeasTV",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=ZM8KS_CUmuU",
    "counterTarget": null
  },
  {
    "id": "bU8I3T9oLes",
    "title": "豪鬼の調整案とコンボを考えるウメハラ",
    "channel": "Daigo the BeasTV",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=bU8I3T9oLes",
    "counterTarget": null
  },
  {
    "id": "9Yks0MtCIZE",
    "title": "ウメハラ豪鬼との対戦で対応を考えるACQUA",
    "channel": "ACQUA",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=9Yks0MtCIZE",
    "counterTarget": null
  },
  {
    "id": "v6APk7c2KLI",
    "title": "Year4最新版 レジェンド豪鬼のコンボ＆起き攻めまとめ",
    "channel": "南風カイ",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=v6APk7c2KLI",
    "counterTarget": null
  },
  {
    "id": "rhqvd28qmaQ",
    "title": "10分ちょっとで分かるモダン豪鬼徹底解説",
    "channel": "シラバイクロム",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=rhqvd28qmaQ",
    "counterTarget": null
  },
  {
    "id": "-2_1PQXFQIA",
    "title": "豪鬼の立ち回りから必須コンボまで！豪鬼の使い方解説 基本編",
    "channel": "煌月ソウル【スト6解説】",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=-2_1PQXFQIA",
    "counterTarget": null
  },
  {
    "id": "JlTG66o2sUM",
    "title": "豪鬼 実戦用 厳選コンボ 2026ver",
    "channel": "Tamusin 3123",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=JlTG66o2sUM",
    "counterTarget": null
  },
  {
    "id": "GL5BEqEvTcs",
    "title": "2026年対応版 豪鬼コンボ＆起き攻め完全ガイド",
    "channel": "さわかぜの格ゲーチャンネル",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=GL5BEqEvTcs",
    "counterTarget": null
  },
  {
    "id": "nYR3cV4EPv8",
    "title": "15分で使える豪鬼講座 百鬼と斬空、強ワザの使い方",
    "channel": "いおりチャンネル",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=nYR3cV4EPv8",
    "counterTarget": null
  },
  {
    "id": "tPF5EfzgcRs",
    "title": "ACQUA講座 豪鬼対策",
    "channel": "ACQUA",
    "kind": "counter",
    "source": "https://acqua-souken.com/v/tPF5EfzgcRs/",
    "counterTarget": "akuma"
  },
  {
    "id": "-0plE29PtAo",
    "title": "エド攻略 キャラ対策編 Part.1 豪鬼ほか複数キャラクター",
    "channel": "魔王城",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=-0plE29PtAo",
    "counterTarget": "akuma"
  },
  {
    "id": "G8TiVdF8dx0",
    "title": "レジェンドケンのいおり 超簡単全キャラ対策 豪鬼編含む",
    "channel": "いおりチャンネル",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=G8TiVdF8dx0",
    "counterTarget": "akuma"
  },
  {
    "id": "QVcZRJhnuZQ",
    "title": "豪鬼使うなら覚えたいコンボ達 初中級者向け",
    "channel": "yoriの天敵 Gameちゃんねる",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=QVcZRJhnuZQ",
    "counterTarget": null
  },
  {
    "id": "jgdzilDnpXA",
    "title": "豪鬼の使い方 初心者向けコンボ・技の使い方徹底解説",
    "channel": "SmashlogTV - SF6",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=jgdzilDnpXA",
    "counterTarget": null
  },
  {
    "id": "koFGCTA9Vrs",
    "title": "豪鬼によるモダン対策の初歩を学ぶ",
    "channel": "yoriの天敵 Gameちゃんねる",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=koFGCTA9Vrs",
    "counterTarget": null
  },
  {
    "id": "bD3eB-MEF7s",
    "title": "豪鬼 コンボや起き攻めの先行入力フレーム練習動画",
    "channel": "桜乃シャル(Vtuber)",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=bD3eB-MEF7s",
    "counterTarget": null
  },
  {
    "id": "5_DaC9-uXbo",
    "title": "全キャラ対策② ハイスタンダード編 豪鬼対策を含む",
    "channel": "SmashlogTV - SF6",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=5_DaC9-uXbo",
    "counterTarget": "akuma"
  },
  {
    "id": "CjYt87XbZYk",
    "title": "豪鬼 その場起き上がり先行入力フレーム練習",
    "channel": "桜乃シャル(Vtuber)",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=CjYt87XbZYk",
    "counterTarget": null
  },
  {
    "id": "B6T4KRc4fxw",
    "title": "ウメハラ豪鬼のランクマとカワノの瞬獄殺連携",
    "channel": "Daigo the BeasTV",
    "kind": "guide",
    "source": "https://yutura.net/channel/13246/popular/B6T4KRc4fxw/",
    "counterTarget": null
  },
  {
    "id": "t8YSPUmjgeI",
    "title": "sakoによる豪鬼対策・斬空の対処法",
    "channel": "sakonoko_game",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=t8YSPUmjgeI",
    "counterTarget": "akuma"
  },
  {
    "id": "3UzqIJNNWzE",
    "title": "豪鬼の起き攻めセットプレイ最新版まとめ（2024年当時）",
    "channel": "スト6攻略備忘録チャンネル",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=3UzqIJNNWzE",
    "counterTarget": null
  },
  {
    "id": "7K_FohnZWpo",
    "title": "STREET FIGHTER 6 AKUMA COMBOS Complete Combo Guide",
    "channel": "VesperArcade",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=7K_FohnZWpo",
    "counterTarget": null
  },
  {
    "id": "CDtOPdRif2E",
    "title": "Terry vs Akuma Match Up Guide",
    "channel": "Singh Reviewing Things",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=CDtOPdRif2E",
    "counterTarget": "akuma"
  },
  {
    "id": "Wi-AVwBgNPE",
    "title": "翔JPが対策しづらい豪鬼の行動を解説",
    "channel": "IBUSHIGIN | Kakeru",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=Wi-AVwBgNPE",
    "counterTarget": "akuma"
  },
  {
    "id": "OA3zTq9KAY8",
    "title": "リュウ視点 対豪鬼 確定反撃と斬空波動拳対策4選",
    "channel": "けんてぃちゅーぶ【スト6攻略】",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=OA3zTq9KAY8",
    "counterTarget": "akuma"
  },
  {
    "id": "B6NkxMYNDsk",
    "title": "豪鬼の厳選10コンボとセットプレイ集",
    "channel": "ミダ猫のゲーム動画",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=B6NkxMYNDsk",
    "counterTarget": null
  },
  {
    "id": "qNtPFSHVsYQ",
    "title": "全キャラ対策 忘れがちな確定反撃集（豪鬼含む）",
    "channel": "けんてぃちゅーぶ【スト6攻略】",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=qNtPFSHVsYQ",
    "counterTarget": "akuma"
  },
  {
    "id": "ekE-aAm70JI",
    "title": "豪鬼 知っておきたいセットプレイをおさらい② 初中級者向け",
    "channel": "yoriの天敵 Gameちゃんねる",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=ekE-aAm70JI",
    "counterTarget": null
  },
  {
    "id": "KBQtF76Zvic",
    "title": "豪鬼 とりこれコンボとセットプレイ徹底解説",
    "channel": "いおりチャンネル",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=KBQtF76Zvic",
    "counterTarget": null
  },
  {
    "id": "POdewS08jZk",
    "title": "豪鬼が使う全ての通常技の性能を解説するシュート",
    "channel": "しゅーとチャンネル / Shuto",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=POdewS08jZk",
    "counterTarget": null
  },
  {
    "id": "UJO-EcL9b8c",
    "title": "ケン視点の対豪鬼 波動拳へのジャストパリィとOD波動拳",
    "channel": "おらりん",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=UJO-EcL9b8c",
    "counterTarget": "akuma"
  },
  {
    "id": "9JoHREE7Zz0",
    "title": "豪鬼の立ち回り考察 画面端と波動拳の運用",
    "channel": "スト6の妖精・にこ太郎",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=9JoHREE7Zz0",
    "counterTarget": null
  },
  {
    "id": "Go83PINqvhY",
    "title": "しゅーとが解説する豪鬼の起き攻め・セットプレイ",
    "channel": "しゅーとチャンネル / Shuto",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=Go83PINqvhY",
    "counterTarget": null
  },
  {
    "id": "JiANkUA1PnM",
    "title": "豪鬼とは ストーリーやシリーズ性能の歴史を解説（SF6参戦前資料）",
    "channel": "ぴんぴゲームチャンネル",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=JiANkUA1PnM",
    "counterTarget": null
  }
] as const;

export const CHARACTER_VIDEO_AKUMA_RESEARCH: VideoSummary[] = candidates.map(({id,title,channel,kind,source,counterTarget}): VideoSummary => ({
 id:`preview-akuma-${id}`,slug:`preview-akuma-${id}`,title,platform:"youtube",videoType:kind,publishedAt:null,
 description:`${counterTarget ? "豪鬼への対策動画（対象キャラ：豪鬼）。" : "豪鬼の使い方・攻略動画。"}出典: ${source}。動画再生・収録内容・現行Patch・公開適格性は未検証です。`,
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],characters:["豪鬼"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
