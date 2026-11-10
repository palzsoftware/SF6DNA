import type { VideoSummary } from "@/lib/event-media";
/** Elena source-traced Preview research; counter means a guide AGAINST Elena. Content, playability and patch applicability unverified. */
const candidates = [
  {
    "id": "TsM0ctTBwJQ",
    "title": "SF6 S4 Elena Practical Combo and Okizeme Guide with Inputs and Notes",
    "channel": "Sea Leaf Dojo",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=TsM0ctTBwJQ"
  },
  {
    "id": "Pu5kXU92rJ0",
    "title": "エレナ徹底対策 リンクスワール・スピンサイズ・各種タゲコン",
    "channel": "スト6初心者応援チャンネル",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=Pu5kXU92rJ0"
  },
  {
    "id": "_jNUQq36vSQ",
    "title": "エレナの立ち回りから必須コンボまで 使い方解説",
    "channel": "煌月ソウル",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=_jNUQq36vSQ"
  },
  {
    "id": "G_aSayiIcGg",
    "title": "Street Fighter 6 Elena Combos! Complete Combo Guide",
    "channel": "VesperArcade",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=G_aSayiIcGg"
  },
  {
    "id": "rw7qdWlaA90",
    "title": "ストリートファイター6 エレナ 基本コンボ",
    "channel": "メノ(Meno)",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=rw7qdWlaA90"
  },
  {
    "id": "H0xfcC4zmc4",
    "title": "エレナの中下段択への対策解説",
    "channel": "ひろしまのあきら",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=H0xfcC4zmc4"
  },
  {
    "id": "Hl4_NWWbIbg",
    "title": "とりあえず一週間ぼられないためのエレナ対策",
    "channel": "えらさんは今日も頑張る",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=Hl4_NWWbIbg"
  },
  {
    "id": "BPYKK53xb3M",
    "title": "SFL2026 どぐら エレナ vs sako エレナ",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=BPYKK53xb3M"
  },
  {
    "id": "uTl2Lc5-MlE",
    "title": "SFL2026 どぐら エレナ vs きんちょ テリー",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=uTl2Lc5-MlE"
  },
  {
    "id": "S9YasKcLXlA",
    "title": "ストーム久保のエレナ下アピール起き攻め実験",
    "channel": "ストーム久保",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=S9YasKcLXlA"
  },
  {
    "id": "w7SgCHyUN08",
    "title": "sako エレナ vs かずのこ アルジュン",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=w7SgCHyUN08"
  },
  {
    "id": "ab7H-07N87c",
    "title": "カワノ アルジュン vs sako エレナ",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=ab7H-07N87c"
  },
  {
    "id": "6OZNRemfzf0",
    "title": "KIDO アルジュン vs sako エレナ",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=6OZNRemfzf0"
  },
  {
    "id": "DhGj-hrwXow",
    "title": "sakoがエレナ使いと対話する対戦・キャラ研究",
    "channel": "sakonoko_game",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=DhGj-hrwXow"
  },
  {
    "id": "GmNcth8Osz8",
    "title": "エレナ実装前の技性能を考察するsako",
    "channel": "sakonoko_game",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=GmNcth8Osz8"
  },
  {
    "id": "BSX-XyzMPmA",
    "title": "エレナを3日間使ったsakoの初期感想",
    "channel": "sakonoko_game",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=BSX-XyzMPmA"
  },
  {
    "id": "lHcPYKvIM9w",
    "title": "sakoエレナの高レベル対戦・激熱コンボ",
    "channel": "昇龍拳",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=lHcPYKvIM9w"
  },
  {
    "id": "g5nToPkbrXc",
    "title": "sakoエレナの対戦・実戦コンボ",
    "channel": "昇龍拳",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=g5nToPkbrXc"
  },
  {
    "id": "8lfdW-TRFLA",
    "title": "鵜飼 2026年8月版エレナのコンボ・起き攻め解説",
    "channel": "鵜飼 -うかい-",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=8lfdW-TRFLA"
  },
  {
    "id": "rg6PKgqvevM",
    "title": "エレナ初心者解説・サバンナケン入門",
    "channel": "斜落せつな",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=rg6PKgqvevM"
  },
  {
    "id": "gIJSr85OJtI",
    "title": "sakoエレナの高レベル対戦動画",
    "channel": "昇龍拳",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=gIJSr85OJtI"
  },
  {
    "id": "cepP7O-ftNg",
    "title": "テリー側から見たエレナ対策・確定反撃",
    "channel": "holosokuのスト6攻略チャンネル",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=cepP7O-ftNg"
  },
  {
    "id": "MZi3RsNog1Y",
    "title": "ベガ視点のエレナ対策9分解説",
    "channel": "大車輪",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=MZi3RsNog1Y"
  },
  {
    "id": "Un0tiGf3KR4",
    "title": "リュウ視点のエレナ確反・リンクシング対策4選",
    "channel": "けんてぃちゅーぶ",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=Un0tiGf3KR4"
  },
  {
    "id": "5CGamXfpvPM",
    "title": "ケン視点のエレナ地上戦・差し返し対策",
    "channel": "おらりん",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=5CGamXfpvPM"
  },
  {
    "id": "jqFhyP1FBzc",
    "title": "ACQUA講座 初心者向けモダンエレナ使い方",
    "channel": "ACQUA",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=jqFhyP1FBzc"
  },
  {
    "id": "oBcADOclnkQ",
    "title": "ACQUA講座 エレナへの確定反撃・補正切り対策",
    "channel": "ACQUA",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=oBcADOclnkQ"
  },
  {
    "id": "Jcejyjlwp-w",
    "title": "エレナ初心者向けコンボ・起き攻め・立ち回り解説配信",
    "channel": "クローバー",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=Jcejyjlwp-w"
  },
  {
    "id": "r-VVJCSAJ6o",
    "title": "どぐらが使い込んだエレナへの対策・ぼったくりポイント",
    "channel": "どぐら 生駒デビル",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=r-VVJCSAJ6o"
  },
  {
    "id": "1HXTSFdf7dI",
    "title": "どぐらのエレナとりこれ講座 MR2400まで使用",
    "channel": "どぐら 生駒デビル",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=1HXTSFdf7dI"
  },
  {
    "id": "kmp7A8qwnrI",
    "title": "立川によるマノン視点のサガット・エレナ対策講座",
    "channel": "SHAKA Ad Channel",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=kmp7A8qwnrI"
  },
  {
    "id": "8J2FA2FQrQ8",
    "title": "どぐらエレナ高レベル対戦・起き攻め集",
    "channel": "昇龍拳",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=8J2FA2FQrQ8"
  },
  {
    "id": "zPARW20XGR0",
    "title": "あきらのエレナ講座・ホロライブ切り抜きまとめ",
    "channel": "テタホ",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=zPARW20XGR0"
  },
  {
    "id": "x3i43ga693o",
    "title": "カプコン公式 日本語版エレナキャラクターガイド",
    "channel": "CapcomChannel",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=x3i43ga693o"
  },
  {
    "id": "DBO-rAHD9jU",
    "title": "どぐらエレナのヒーリングを活用した対戦集",
    "channel": "昇龍拳",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=DBO-rAHD9jU"
  },
  {
    "id": "jOsezMQyqWU",
    "title": "どぐらエレナの高レベル対戦集",
    "channel": "昇龍拳",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=jOsezMQyqWU"
  },
  {
    "id": "8HyKTp4bgh8",
    "title": "どぐらが語るレジェンド到達後のエレナ評価",
    "channel": "どぐらのちょっとええ感じ",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=8HyKTp4bgh8"
  },
  {
    "id": "OFAtZ8mfXuU",
    "title": "どぐら・sakoらによるエレナのキャラ相性議論",
    "channel": "どぐら 生駒デビル",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=OFAtZ8mfXuU"
  },
  {
    "id": "YxcD-mQfIIk",
    "title": "どぐらのエレナ性能検証カスタム対戦",
    "channel": "どぐら 生駒デビル",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=YxcD-mQfIIk"
  }
] as const;
export const CHARACTER_VIDEO_ELENA_RESEARCH: VideoSummary[] = candidates.map(({id,title,channel,kind,source}): VideoSummary => ({
 id:`preview-elena-${id}`,slug:`preview-elena-${id}`,title,platform:"youtube",videoType:kind,publishedAt:null,
 description:`${kind==="counter"?"エレナへの対策動画。":kind==="match"?"エレナが登場する対戦・大会動画。":"エレナの攻略・練習動画。"} 出典: ${source}。動画再生・収録内容・現行Patchとの整合・公開適格性は未検証です。`,
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,channelName:channel,
 durationSeconds:null,language:null,controlTypes:[],events:[],characters:["エレナ"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
