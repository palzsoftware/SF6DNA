import type { VideoSummary } from "@/lib/event-media";
/** Preview-only Cammy candidate intake; source records are discovery evidence, not game-version/playback verification. */
const candidates = [
  {
    "id": "seDY-E5OFpQ",
    "title": "Cammy Combo Guide Step By Step + Tips & Tricks",
    "channel": "MadDoggGames",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=seDY-E5OFpQ"
  },
  {
    "id": "H08DKY7_NCw",
    "title": "STREET FIGHTER 6 CAMMY COMBOS! Starter Combo Guide",
    "channel": "VesperArcade",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=H08DKY7_NCw"
  },
  {
    "id": "0RsQq75k9GM",
    "title": "The Ultimate Cammy Guide | Season 3 Street Fighter 6",
    "channel": "Coosco",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=0RsQq75k9GM"
  },
  {
    "id": "c0nCiW7XB1E",
    "title": "ACQUA講座 キャミィ対策",
    "channel": "ACQUA",
    "kind": "counter",
    "source": "https://acqua-souken.com/v/c0nCiW7XB1E/"
  },
  {
    "id": "fmmcrBgrRUY",
    "title": "MR1000コーチング企画 Cキャミィ編",
    "channel": "ACQUA",
    "kind": "guide",
    "source": "https://acqua-souken.com/v/fmmcrBgrRUY/"
  },
  {
    "id": "19MVdN110cQ",
    "title": "キャミィ戦逆択対策 バックジャンプ",
    "channel": "ずんだもんふぁいたーch",
    "kind": "counter",
    "source": "https://yutura.net/channel/100869/video/19MVdN110cQ/"
  },
  {
    "id": "LdxFIacyugo",
    "title": "キャミィ戦超重要 バクステ置き",
    "channel": "ずんだもんふぁいたーch",
    "kind": "counter",
    "source": "https://yutura.net/channel/100869/video/LdxFIacyugo/"
  },
  {
    "id": "qhqahbhq48A",
    "title": "世界1位キャミィ かずのこのハイレベル対戦",
    "channel": "SF6-MODERN",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=qhqahbhq48A"
  },
  {
    "id": "nGJRuMmt5OI",
    "title": "キャミィ対策講座 やる気勢向け",
    "channel": "B",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=nGJRuMmt5OI"
  },
  {
    "id": "1QCDSZ59goE",
    "title": "キャミィをざっくり紹介",
    "channel": "格ゲー好きな高岡",
    "kind": "guide",
    "source": "https://yutura.net/channel/82467/popular/1QCDSZ59goE/"
  },
  {
    "id": "N_Zwgoy1g4A",
    "title": "Punk キャミィ vs かずのこ C.ヴァイパー",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://yutura.net/channel/56626/video/N_Zwgoy1g4A/"
  },
  {
    "id": "bo5dyNp8hhY",
    "title": "YHC-餅 ダルシム vs Punk キャミィ",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://yutura.net/channel/56626/video/bo5dyNp8hhY/"
  },
  {
    "id": "NKBJzz922_0",
    "title": "かずのこ配信 ちょいリュウからのキャミィ",
    "channel": "かずのこチャンネル",
    "kind": "match",
    "source": "https://yutura.net/channel/20381/video/NKBJzz922_0/"
  },
  {
    "id": "uARNBerur3w",
    "title": "立川コーチング キャミィの伸びしろを発見したかずのこ",
    "channel": "立川ちゃんねる",
    "kind": "guide",
    "source": "https://yutura.net/channel/100695/video/uARNBerur3w/"
  },
  {
    "id": "7TFMHdv1tZI",
    "title": "かずのこ配信 新バージョンのキャミィをやる人",
    "channel": "かずのこチャンネル",
    "kind": "match",
    "source": "https://yutura.net/channel/20381/video/7TFMHdv1tZI/"
  },
  {
    "id": "yQPaYhQQFu8",
    "title": "MR2300キャミィのリプレイコーチング #83",
    "channel": "ぷげら pugera",
    "kind": "guide",
    "source": "https://yutura.net/channel/111842/video/yQPaYhQQFu8/"
  },
  {
    "id": "DM4McD0vlxk",
    "title": "世界1位キャミィ さうたむ対戦集",
    "channel": "SF6-MODERN",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=DM4McD0vlxk"
  },
  {
    "id": "Sg6uqxEIR-Q",
    "title": "世界1位キャミィ Phenom対戦集",
    "channel": "SF6-MODERN",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=Sg6uqxEIR-Q"
  },
  {
    "id": "52GIqPYDPw0",
    "title": "キャミィ実用的基本コンボ Year3",
    "channel": "アダー@実用的ゲームちゃんねる",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=52GIqPYDPw0"
  },
  {
    "id": "g9AlVlM5fGc",
    "title": "かずのこ配信 キンバリー・ジェイミー・キャミィ予定",
    "channel": "かずのこチャンネル",
    "kind": "match",
    "source": "https://yutura.net/channel/20381/video/g9AlVlM5fGc/"
  },
  {
    "id": "Uae2PoVWLDc",
    "title": "KEI.Bによるキャミィのコンボコーチング",
    "channel": "シフォンのぶいすぽ更新ch",
    "kind": "guide",
    "source": "https://ckworks.jp/vinforadar/video/kirinuki/Uae2PoVWLDc"
  },
  {
    "id": "uShS7ig9j3Q",
    "title": "かずのことあきらのキャミィWコーチング",
    "channel": "Vtuber Showdown",
    "kind": "guide",
    "source": "https://ckworks.jp/vinforadar/video/kirinuki/uShS7ig9j3Q"
  },
  {
    "id": "JiHbWTYfgc8",
    "title": "ACQUA配信 ジュリ・キャミィコーチング企画",
    "channel": "ACQUA",
    "kind": "guide",
    "source": "https://acqua-souken.com/live/JiHbWTYfgc8/"
  },
  {
    "id": "jHUb26CLaMc",
    "title": "うる虎がーるのキャミィと対戦する配信",
    "channel": "那和ツムグ",
    "kind": "match",
    "source": "https://yutura.net/channel/95495/video/jHUb26CLaMc/"
  },
  {
    "id": "sv3ZchxWMEE",
    "title": "なるお8キャラ対戦 キャミィ戦を含む",
    "channel": "なるおのひとりでできるもん",
    "kind": "match",
    "source": "https://yutura.net/channel/98960/popular/sv3ZchxWMEE/"
  }
] as const;
export const CHARACTER_VIDEO_CAMMY_RESEARCH: VideoSummary[] = candidates.map(({id,title,channel,kind,source}): VideoSummary => ({
 id:`preview-cammy-${id}`,slug:`preview-cammy-${id}`,title,platform:"youtube",
 videoType:kind,publishedAt:null,
 description:`キャミィ関連候補。調査元: ${source}。再生・使用キャラの全編照合・現行Patchの適合性は未検証。`,
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],characters:["キャミィ"],players:[],categories:[kind],
 level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
