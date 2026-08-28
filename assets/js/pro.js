// 画像(image)フィールドの追加・更新手順は docs/PLAYER_IMAGES.md を参照
const proData = {

/*=========================================
      VARREL
=========================================*/
tokido:{

    id:"tokido",

    name:"ときど",

    type:"pro",

    country:"日本",

    team:"varrel",

    image:"assets/images/players/tokido.png",

    main:[
        "jp"
    ],

    style:"攻略型",

    device:"Hit Box Ultra",

    controlType:"レバーレス",

    sf6History:"2023年6月〜（格闘ゲーム歴は2001年〜、東大在学中からプロ活動）",

    learningCategories:{
        movement:[
            "新作タイトルでも早い段階でキャラの強みと立ち回りの型を見極める分析力",
            "画面を広く使い、相手に選択肢を強要する間合い管理"
        ],
        reading:[
            "対戦を重ねるごとに相手の癖を的確に読み切っていく対応力"
        ],
        defense:[
            "無敵技やドライブリバーサルの発生を正確に把握した守りの選択"
        ],
        offense:[
            "百鬼襲などの攻め継続技を使った主導権の維持"
        ],
        combo:[
            "実戦で安定して決めきれる、火力と再現性を両立したコンボ選択"
        ],
        characterKnowledge:[
            "使用キャラを一本に絞り込み、隅々まで研究し尽くす姿勢"
        ],
        mental:[
            "緻密な生活・練習ルーティンによる、大会本番でのコンディション管理"
        ],
        tournament:[
            "劣勢からでも逆転につなげる、大舞台での勝負強さ"
        ]
    },

    characters:[
        "jp",
        "ken"
    ],

    teamMembers:[
    "mago",
    "mizuha",
    "wabiichi"
],

pastTeams:[
    "reject"
],

achievements:[
    {
        date:"2026-07-12",
        tournament:"BAM16",
        result:"7位"
    },
    {
        date:"2026-03-15",
        tournament:"ストリートファイターリーグ ワールドチャンピオンシップ2025",
        result:"優勝"
    },
    {
        date:"2026",
        tournament:"Winter Clash 2026",
        result:"優勝"
    },
    {
        date:"2026",
        tournament:"ストリートファイターリーグ: Pro-JP 2025",
        result:"優勝"
    },
    {
        date:"2025",
        tournament:"Asian Champions League 2025",
        result:"優勝"
    },
    {
        date:"2025",
        tournament:"The Versus Festival: Habba Edition",
        result:"優勝"
    },
    {
        date:"2024",
        tournament:"CAPCOM Pro Tour 2024 SUPER PREMIER JAPAN",
        result:"優勝"
    },
    {
        date:"2024",
        tournament:"Battle Arena Melbourne 14",
        result:"優勝"
    },
    {
        date:"2024",
        tournament:"ストリートファイターリーグ: Pro-JP 2023",
        result:"優勝"
    },
    {
        date:"2023",
        tournament:"FRONTIER CUP -STREET FIGHTER 6-",
        result:"優勝"
    },
    {
        date:"2023",
        tournament:"CAPCOM Pro Tour 2023 World Warrior Japan #3",
        result:"優勝"
    },
    {
        date:"2023",
        tournament:"EVO 2023",
        result:"4位"
    }
],

    youtube:"https://youtube.com/@tokido?si=LkzXt2Kz76Rmi2WV",

    twitch:"https://www.twitch.tv/tokidoki77?lang=ja",

    twitter:"https://x.com/tokidoki77"

},

mago:{

    id:"mago",

    name:"マゴ",

    type:"pro",

    country:"日本",

    team:"varrel",

    image:"assets/images/players/mago.png",

    main:[
        "mai",
        "juri"
    ],

    style:"攻め継続・対応型",

    characters:[
        "mai",
        "juri"
    ],

    teamMembers:[
        "tokido",
        "mizuha",
        "wabiichi"
    ],

    youtube:"https://www.youtube.com/@magolong3",

    twitch:"https://www.twitch.tv/mago2dgod",

    twitter:"https://x.com/magotto3"

},

mizuha:{

    id:"mizuha",

    name:"水派",

    type:"pro",

    country:"日本",

    team:"varrel",

    image:"assets/images/players/mizuha.png",

    main:[
        "cammy"
    ],

    style:"堅実・対応型",

    characters:[
        "cammy",
        "sagat"
    ],

    teamMembers:[
        "tokido",
        "mago",
        "wabiichi"
    ],

    youtube:"https://www.youtube.com/@mizuha3015",

    twitch:"",

    twitter:"https://twitter.com/mizuha11"

},

wabiichi:{

    id:"wabiichi",

    name:"わびいち",

    type:"pro",

    country:"日本",

    team:"varrel",

    image:"assets/images/players/wabiichi.png",

    main:[
        "terry"
    ],

    style:"立ち回り・読み合い型",

    characters:[
        "terry"
    ],

    teamMembers:[
        "tokido",
        "mago",
        "mizuha"
    ],

    youtube:"",

    twitch:"",

    twitter:"https://x.com/wabiichi_fgc"

},

/*=========================================
  REJECT
=========================================*/

daigo:{

    id:"daigo",

    name:"ウメハラ",

    type:"pro",

    country:"日本",

    team:"reject",

    image:"assets/images/players/daigo.png",

    style:"堅実・対応型",

    characters:[
        "gouki"
    ],

    youtube:"",

    twitch:"",

    twitter:""

},

fuudo:{

    id:"fuudo",

    name:"ふ～ど",

    type:"pro",

    country:"日本",

    team:"reject",

    image:"assets/images/players/fuudo.png",

    style:"読み合い・安定型",

    characters:[
        "ed"
    ],

    youtube:"",

    twitch:"",

    twitter:""

},

yas:{

    id:"yas",

    name:"YAS",

    type:"pro",

    country:"日本",

    team:"reject",

    image:"assets/images/players/yas.png",

    style:"",

    characters:[
        "ryu"

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

hinao:{

    id:"hinao",

    name:"ひなお",

    type:"pro",

    country:"日本",

    team:"reject",

    image:"assets/images/players/hinao.png",

    style:"",

    characters:[
        "ryu",
        "gouki",
        "sagat"
    ],

    youtube:"",

    twitch:"",

    twitter:""

},

haitani:{

    id:"haitani",

    name:"ハイタニ",

    type:"pro",

    country:"日本",

    team:"reject",

    image:"assets/images/players/haitani.png",

    style:"",

    characters:[
            "chunli"
        ],

    youtube:"",

    twitch:"",

    twitter:""

},
  /*=========================================
  ZETA DIVISION
=========================================*/

momochi:{

    id:"momochi",

    name:"ももち",

    type:"pro",

    country:"日本",

    team:"zeta",

    image:"assets/images/players/momochi.png",

    style:"対応・堅実型",

    characters:[
        "ed",
        "jp"
    ],

    youtube:"",

    twitch:"",

    twitter:""

},

higuchi:{

    id:"higuchi",

    name:"ひぐち",

    type:"pro",

    country:"日本",

    team:"zeta",

    image:"assets/images/players/higuchi.png",

    style:"堅実型",

    characters:[
        "guile"
    ],

        learningPoints: ["守り", "飛び道具", "対空"],

        learningPointsDetail:
            "ガイルの飛び道具と対空技を軸に、無理をしない堅実な立ち回りで試合を組み立てるスタイルが特徴です。攻めと守りのバランス感覚に優れ、リスクの低い選択を積み重ねて着実に勝ちを拾う技術は、堅実型・待ち型のプレイヤーにとって特に参考になります。",

    youtube:"",

    twitch:"",

    twitter:""

},

yamaguchi:{

    id:"yamaguchi",

    name:"ヤマグチ",

    type:"pro",

    country:"日本",

    team:"zeta",

    image:"assets/images/players/yamaguchi.png",

    style:"",

    characters:[
        "mai"

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

menard:{

    id:"menard",

    name:"MenaRD",

    type:"pro",

    country:"ドミニカ共和国",

    team:"zeta",

    image:"assets/images/players/menard.png",

    style:"万能・対応型",

    characters:[
        "blanka",
        "bison"
    ],

        learningPoints: ["立ち回り", "読み合い", "状況判断"],

        learningPointsDetail:
            "ブランカとベガを操り、攻守どちらにも寄りすぎない柔軟な立ち回りと、状況に応じた冷静な判断力が持ち味です。読み合いを重視しながらも極端なリスクは取らないバランス感覚は、万能型・戦略型のプレイヤーが「柔軟な対応力」を学ぶ好例です。",

    youtube:"",

    twitch:"",

    twitter:""

},

jazzy:{

    id:"jazzy",

    name:"じゃじぃ",

    type:"pro",

    country:"日本",

    team:"zeta",

    image:"",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

chocoblanka:{

    id:"chocoblanka",

    name:"チョコブランカ",

    type:"pro",

    country:"日本",

    team:"zeta",

    image:"assets/images/players/chocoblanka.png",

    style:"解説・サポート",

    characters:[
        "blanka"
    ],

    youtube:"",

    twitch:"",

    twitter:""

},

/*=========================================
  FUKUSHIMA IBUSHIGIN
=========================================*/

yanai:{

    id:"yanai",

    name:"ヤナイ",

    type:"pro",

    country:"日本",

    team:"FUKUSHIMA IBUSHIGIN",

    image:"assets/images/players/yanai.png",

    style:"",

    characters:[
        "bison"
    ],

    youtube:"",

    twitch:"",

    twitter:""

},

johnny:{

    id:"johnny",

    name:"ジョニィ",

    type:"pro",

    country:"日本",

    team:"FUKUSHIMA IBUSHIGIN",

    image:"assets/images/players/johnny.png",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

torimeshi:{

    id:"torimeshi",

    name:"鶏めし",

    type:"pro",

    country:"日本",

    team:"FUKUSHIMA IBUSHIGIN",

    image:"assets/images/players/torimeshi.png",

    style:"",

    characters:[
        "dhalsim"
    ],

    youtube:"",

    twitch:"",

    twitter:""

},

twobassa:{

    id:"twobassa",

    name:"2BASSA",

    type:"pro",

    country:"日本",

    team:"FUKUSHIMA IBUSHIGIN",

    image:"assets/images/players/twobassa.png",

    style:"",

    characters:[
        "juri",
            "cammy"],

    youtube:"",

    twitch:"",

    twitter:""

},

   /*=========================================
  DetonatioN FocusMe
=========================================*/

itabashizangief:{

    id:"itabashizangief",

    name:"板橋ザンギエフ",

    type:"pro",

    country:"日本",

    team:"DetonatioN FocusMe",

    image:"assets/images/players/itazan.png",

    style:"読み合い・制圧型",

    characters:[
        "zangief"
    ],

    youtube:"",

    twitch:"",

    twitter:""

},

nauman:{

    id:"nauman",

    name:"ナウマン",

    type:"pro",

    country:"日本",

    team:"DetonatioN FocusMe",

    image:"assets/images/players/nauman.png",

    style:"攻撃・爆発力型",

    characters:[
        "ken"
    ],

    youtube:"",

    twitch:"",

    twitter:""

},

johntakeuchi:{

    id:"johntakeuchi",

    name:"竹内ジョン",

    type:"pro",

    country:"日本",

    team:"DetonatioN FocusMe",

    image:"assets/images/players/johntakeuchi.png",

    style:"堅実・対応型",

    characters:[
        "rashid",
            "jamie"],

    youtube:"",

    twitch:"",

    twitter:""

},

keib:{

    id:"keib",

    name:"KEI.B",

    type:"pro",

    country:"日本",

    team:"DetonatioN FocusMe",

    image:"assets/images/players/keib.png",

    style:"",

    characters:[
            "mai"
        ],

    youtube:"",

    twitch:"",

    twitter:""

},

/*=========================================
  KADOKAWA FAV gaming
=========================================*/

sako:{

    id:"sako",

    name:"sako",

    type:"pro",

    country:"日本",

    team:"KADOKAWA FAV gaming",

    image:"assets/images/players/sako.png",

    style:"対応・テクニカル型",

    characters:[
        "elena"
    ],

    youtube:"",

    twitch:"",

    twitter:""

},

ryukichi:{

    id:"ryukichi",

    name:"りゅうきち",

    type:"pro",

    country:"日本",

    team:"KADOKAWA FAV gaming",

    image:"assets/images/players/ryukichi.png",

    style:"攻撃・爆発力型",

    characters:[
        "ken"
    ],

    youtube:"",

    twitch:"",

    twitter:""

},

fujimura:{

    id:"fujimura",

    name:"藤村",

    type:"pro",

    country:"日本",

    team:"KADOKAWA FAV gaming",

    image:"assets/images/players/fujimura.png",

    style:"堅実・対応型",

    characters:[
        "cammy"
    ],

    youtube:"",

    twitch:"",

    twitter:""

},

moke:{

    id:"moke",

    name:"もけ",

    type:"pro",

    country:"日本",

    team:"KADOKAWA FAV gaming",

    image:"assets/images/players/moke.png",

    style:"読み合い・万能型",

    characters:[
        "chunli"
    ],

    youtube:"",

    twitch:"",

    twitter:""

},

   /*=========================================
  Good 8 Squad
=========================================*/

gachikun:{

    id:"gachikun",

    name:"ガチくん",

    type:"pro",

    country:"日本",

    team:"Good 8 Squad",

    image:"assets/images/players/gachikun.png",

    style:"攻守バランス型",

    characters:[
        "rashid"
    ],

        learningPoints: ["ラッシュ", "画面端継続", "読み合い"],

        learningPointsDetail:
            "ラシードのラッシュ性能を最大限に活かし、一度掴んだ主導権を離さない攻めの継続力が持ち味です。画面端に運んでからの攻めを絶やさない技術と、相手の切り返しを読み切る精度の高さが強みで、攻撃型のプレイヤーが「攻めを継続する技術」を学ぶ上で参考になります。",

    youtube:"",

    twitch:"",

    twitter:""

},

kawano:{

    id:"kawano",

    name:"カワノ",

    type:"pro",

    country:"日本",

    team:"Good 8 Squad",

    image:"assets/images/players/kawano.png",

    style:"対応・万能型",

    characters:[
        "gouki"
    ],

    youtube:"",

    twitch:"",

    twitter:""

},

pugera:{

    id:"pugera",

    name:"ぷげら",

    type:"pro",

    country:"日本",

    team:"Good 8 Squad",

    image:"assets/images/players/pugera.png",

    style:"読み合い・堅実型",

    characters:[
        "juri"
    ],

    youtube:"",

    twitch:"",

    twitter:""

},

sahara:{

    id:"sahara",

    name:"さはら",

    type:"pro",

    country:"日本",

    team:"Good 8 Squad",

    image:"assets/images/players/sahara.png",

    style:"攻撃・対応型",

    characters:[
        "ryu"
    ],

    youtube:"",

    twitch:"",

    twitter:""

},


/*=========================================
  Saishunkan Sol 熊本
=========================================*/

cosa:{

    id:"cosa",

    name:"cosa",

    type:"pro",

    country:"日本",

    team:"Saishunkan Sol 熊本",

    image:"assets/images/players/cosa.png",

    style:"対応・堅実型",

    characters:[
        "jp",
            "ryu"],

    youtube:"",

    twitch:"",

    twitter:""

},

machabo:{

    id:"machabo",

    name:"まちゃぼー",

    type:"pro",

    country:"日本",

    team:"Saishunkan Sol 熊本",

    image:"assets/images/players/machabo.png",

    style:"攻守バランス型",

    characters:[
        "mai"
    ],

    youtube:"",

    twitch:"",

    twitter:""

},

kobayan:{

    id:"kobayan",

    name:"こばやん",

    type:"pro",

    country:"日本",

    team:"Saishunkan Sol 熊本",

    image:"assets/images/players/kobayan.png",

    style:"",

    characters:[
            "zangief"
        ],

    youtube:"",

    twitch:"",

    twitter:""

},

kincho:{

    id:"kincho",

    name:"きんちょ",

    type:"pro",

    country:"日本",

    team:"Saishunkan Sol 熊本",

    image:"assets/images/players/kincho.png",

    style:"",

    characters:[
            "terry"
        ],

    youtube:"",

    twitch:"",

    twitter:""

},

nemo:{

    id:"nemo",

    name:"ネモ",

    type:"pro",

    country:"日本",

    team:"Saishunkan Sol 熊本",

    image:"assets/images/players/nemo.png",

    style:"",

    characters:[
            "bison",
            "alex"
        ],

    youtube:"",

    twitch:"",

    twitter:""

},

/*=========================================
  Crazy Raccoon
=========================================*/

dogura:{

    id:"dogura",

    name:"どぐら",

    type:"pro",

    country:"日本",

    team:"Crazy Raccoon",

    image:"assets/images/players/dogura.png",

    style:"研究・対応型",

    characters:[
        "bison",
        "elena",
            "alex"],

    youtube:"",

    twitch:"",

    twitter:""

},

bonchan:{

    id:"bonchan",

    name:"ボンちゃん",

    type:"pro",

    country:"日本",

    team:"Crazy Raccoon",

    image:"assets/images/players/bonchan.png",

    style:"堅実・対応型",

    characters:[
        "sagat",
            "gouki"],

    youtube:"",

    twitch:"",

    twitter:""

},

kazunoko:{

    id:"kazunoko",

    name:"かずのこ",

    type:"pro",

    country:"日本",

    team:"Crazy Raccoon",

    image:"assets/images/players/kazunoko.png",

    style:"攻守バランス型",

    characters:[
        "cammy",
            "cviper"],

    youtube:"",

    twitch:"",

    twitter:""

},

shuto:{

    id:"shuto",

    name:"Shuto",

    type:"pro",

    country:"日本",

    team:"Crazy Raccoon",

    image:"assets/images/players/shuto.png",

    style:"攻撃・対応型",

    characters:[
        "gouki",
            "ryu"],

    youtube:"",

    twitch:"",

    twitter:""

},


tachikawa:{

    id:"tachikawa",

    name:"立川",

    type:"pro",

    country:"日本",

    team:"Crazy Raccoon",

    image:"assets/images/players/tachikawa.png",

    style:"",

    characters:[
            "manon",
            "cviper",
            "ed"
        ],

    youtube:"",

    twitch:"",

    twitter:""

},

dualkevin:{

    id:"dualkevin",

    name:"Dual Kevin",

    type:"pro",

    country:"アメリカ",

    team:"Crazy Raccoon",

    image:"assets/images/players/dualkevin.png",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},
/*=========================================
  広島 TEAM iXA
=========================================*/

acqua:{

    id:"acqua",

    name:"ACQUA",

    type:"pro",

    country:"日本",

    team:"広島 TEAM iXA",

    image:"assets/images/players/acqua.png",

    style:"",

    characters:[
            "blanka",
            "jp"
        ],

    youtube:"",

    twitch:"",

    twitter:""

},

hibiki:{

    id:"hibiki",

    name:"ひびき",

    type:"pro",

    country:"日本",

    team:"広島 TEAM iXA",

    image:"assets/images/players/hibiki.png",

    style:"",

    characters:[
            "lily"
        ],

    youtube:"",

    twitch:"",

    twitter:""

},

akira:{

    id:"akira",

    name:"あきら",

    type:"pro",

    country:"日本",

    team:"広島 TEAM iXA",

    image:"assets/images/players/akira.png",

    style:"",

    characters:[
            "cammy"
        ],

    youtube:"",

    twitch:"",

    twitter:""

},

takepi:{

    id:"takepi",

    name:"takepi",

    type:"pro",

    country:"日本",

    team:"広島 TEAM iXA",

    image:"assets/images/players/takepi.png",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

/*=========================================
  名古屋NTPOJA
=========================================*/

seiya:{

    id:"seiya",

    name:"Seiya",

    type:"pro",

    country:"日本",

    team:"名古屋NTPOJA",

    image:"assets/images/players/seiya.png",

    style:"",

    characters:[
            "chunli"
        ],

    youtube:"",

    twitch:"",

    twitter:""

},

raoyamu:{

    id:"raoyamu",

    name:"らおやむ",

    type:"pro",

    country:"日本",

    team:"名古屋NTPOJA",

    image:"assets/images/players/raoyamu.png",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

otani:{

    id:"otani",

    name:"大谷",

    type:"pro",

    country:"日本",

    team:"名古屋NTPOJA",

    image:"assets/images/players/otani.png",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

mocchi:{

    id:"mocchi",

    name:"もっちー",

    type:"pro",

    country:"日本",

    team:"名古屋NTPOJA",

    image:"assets/images/players/mocchi.png",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

/*=========================================
  RIDDLE ORDER
=========================================*/

takagi:{

    id:"takagi",

    name:"高木",

    type:"pro",

    country:"日本",

    team:"RIDDLE ORDER",

    image:"assets/images/players/takagi.png",

    style:"",

    characters:[
            "blanka"
        ],

    youtube:"",

    twitch:"",

    twitter:""

},

adelie:{

    id:"adelie",

    name:"あでりい",

    type:"pro",

    country:"日本",

    team:"RIDDLE ORDER",

    image:"assets/images/players/adelie.png",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

jr:{

    id:"jr",

    name:"Jr.",

    type:"pro",

    country:"日本",

    team:"RIDDLE ORDER",

    image:"assets/images/players/jr.png",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

hikaru:{

    id:"hikaru",

    name:"ひかる",

    type:"pro",

    country:"日本",

    team:"RIDDLE ORDER",

    image:"assets/images/players/hikaru.png",

    style:"",

    characters:[
            "aki"
        ],

    youtube:"",

    twitch:"",

    twitter:""

},

/*=========================================
  SCARZ
=========================================*/

akutagawa:{

    id:"akutagawa",

    name:"あくたがわ",

    type:"pro",

    country:"日本",

    team:"SCARZ",

    image:"assets/images/players/akutagawa.png",

    style:"",

    characters:[
            "manon"
        ],

    youtube:"",

    twitch:"",

    twitter:""

},

ryusei:{

    id:"ryusei",

    name:"りゅうせい",

    type:"pro",

    country:"日本",

    team:"SCARZ",

    image:"assets/images/players/ryusei.png",

    style:"",

    characters:[
            "jp"
        ],

    youtube:"",

    twitch:"",

    twitter:""

},

/*=========================================
  海外
=========================================*/

angrybird:{

    id:"angrybird",

    name:"AngryBird",

    type:"pro",

    country:"アラブ首長国連邦",

    team:"Team Falcons",

    image:"assets/images/players/angrybird.png",

    style:"",

    characters:[

    ],

        learningPoints: ["ラッシュ", "火力", "起き攻め"],

        learningPointsDetail:
            "ケンのラッシュ性能を活かした攻撃的な立ち回りと、一度捕まえた相手を離さない起き攻めの継続力が特徴です。高い火力を安定して叩き込む技術力もあり、攻撃型・コンボ型のプレイヤーが「攻めの畳みかけ方」を学ぶ上で参考になります。",

    youtube:"",

    twitch:"",

    twitter:""

},

bigbird:{

    id:"bigbird",

    name:"Big Bird",

    type:"pro",

    country:"アラブ首長国連邦",

    team:"Team Falcons",

    image:"assets/images/players/bigbird.png",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

nuckledu:{

    id:"nuckledu",

    name:"NuckleDu",

    type:"pro",

    country:"アメリカ",

    team:"Team Liquid",

    image:"assets/images/players/nuckledu.png",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

punk:{

    id:"punk",

    name:"Punk",

    type:"pro",

    country:"アメリカ",

    team:"FlyQuest",

    image:"assets/images/players/punk.png",

    style:"",

    characters:[

    ],

        learningPoints: ["差し返し", "通常技", "確認精度"],

        learningPointsDetail:
            "キャミィの通常技を的確に使った差し返しの精度と、状況を見極めた冷静な操作技術が持ち味です。無闇にリスクを取らず、相手の技に正確に技を合わせて反撃する技術は、堅実型・戦略型のプレイヤーが「精密な操作技術」を学ぶ上で参考になります。",

    youtube:"",

    twitch:"",

    twitter:""

},

oilking:{

    id:"oilking",

    name:"Oil King",

    type:"pro",

    country:"香港",

    team:"Team Falcons",

    image:"assets/images/players/oilking.png",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

xiaohai:{

    id:"xiaohai",

    name:"Xiaohai",

    type:"pro",

    country:"中国",

    team:"KuaiShou Gaming",

    image:"assets/images/players/xiaohai.png",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

leshar:{

    id:"leshar",

    name:"Leshar",

    type:"pro",

    country:"韓国",

    team:"DRX",

    image:"assets/images/players/leshar.png",

    style:"",

    characters:[
            "ed",
            "terry"
        ],

    youtube:"",

    twitch:"",

    twitter:""

},

nl:{

    id:"nl",

    name:"NL",

    type:"pro",

    country:"韓国",

    team:"DRX",

    image:"assets/images/players/nl.png",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

noahtheprodigy:{

    id:"noahtheprodigy",

    name:"NoahTheProdigy",

    type:"pro",

    country:"アメリカ",

    team:"Twisted Minds",

    image:"",

    style:"",

    characters:[
            "luke"
        ],

    youtube:"",

    twitch:"",

    twitter:""

},

caba:{

    id:"caba",

    name:"Caba",

    type:"pro",

    country:"ドミニカ共和国",

    team:"",

    image:"assets/images/players/caba.png",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

broski:{

    id:"broski",

    name:"Broski",

    type:"pro",

    country:"イギリス",

    team:"",

    image:"assets/images/players/broski.png",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

problemx:{

    id:"problemx",

    name:"Problem X",

    type:"pro",

    country:"イギリス",

    team:"",

    image:"assets/images/players/problemx.png",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

phenom:{

    id:"phenom",

    name:"Phenom",

    type:"pro",

    country:"ノルウェー",

    team:"",

    image:"assets/images/players/phenom.png",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

endingwalker:{

    id:"endingwalker",

    name:"EndingWalker",

    type:"pro",

    country:"イギリス",

    team:"Virtus.pro",

    image:"assets/images/players/endingwalker.png",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

kilzyou:{

    id:"kilzyou",

    name:"Kilzyou",

    type:"pro",

    country:"フランス",

    team:"",

    image:"assets/images/players/kilzyou.png",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

blaz:{

    id:"blaz",

    name:"Blaz",

    type:"pro",

    country:"チリ",

    team:"",

    image:"assets/images/players/blaz.png",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

mickey:{

    id:"mickey",

    name:"Mickey",

    type:"pro",

    country:"フィリピン",

    team:"",

    image:"",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

chriswong:{

    id:"chriswong",

    name:"Chris Wong",

    type:"pro",

    country:"香港",

    team:"",

    image:"assets/images/players/chriswong.png",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

dcq:{

    id:"dcq",

    name:"DCQ",

    type:"pro",

    country:"中国",

    team:"",

    image:"assets/images/players/dcq.png",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

zhen:{

    id:"zhen",

    name:"Zhen",

    type:"pro",

    country:"中国",

    team:"",

    image:"",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

kusanagi:{

    id:"kusanagi",

    name:"Kusanagi",

    type:"pro",

    country:"日本",

    team:"",

    image:"assets/images/players/kusanagi.png",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

mistercrimson:{

    id:"mistercrimson",

    name:"Mister Crimson",

    type:"pro",

    country:"フランス",

    team:"",

    image:"",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

valmaster:{

    id:"valmaster",

    name:"Valmaster",

    type:"pro",

    country:"フランス",

    team:"",

    image:"",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

hotdog29:{

    id:"hotdog29",

    name:"HotDog29",

    type:"pro",

    country:"台湾",

    team:"",

    image:"assets/images/players/hotdog29.png",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

gamerbee:{

    id:"gamerbee",

    name:"GamerBee",

    type:"pro",

    country:"台湾",

    team:"",

    image:"assets/images/players/gamerbee.png",

    style:"",

    characters:[

    ],

    youtube:"",

    twitch:"",

    twitter:""

},

/*=========================================
      フリー
=========================================*/

// 2026/7/27 追加: 検索で裏取りした実在選手
itabashizangief:{

    id:"itabashizangief",
    name:"板橋ザンギエフ",
    type:"pro",
    country:"日本",
    team:"DetonatioN FocusMe",
    image:"",
    main:[
        "zangief"
    ],
    style:"コマンド投げ主体・研究型",
    characters:[
        "zangief",
        "marisa"
    ],
    youtube:"",
    twitch:"",
    twitter:"https://x.com/Itazan_Kuma"

},


    // 2026/7/27 追加: 検索で裏取りした実在選手(@Sycom所属)

    orarin:{
        id:"orarin",
        name:"おらりん",
        type:"pro",
        country:"日本",
        team:"@Sycom",
        image:"https://www.sycom.co.jp/esports/wp-content/uploads/2026/02/orarin_1024x1024.webp",
        main:["ken","mai"],
        style:"攻撃型",
        characters:["ken","mai"],
        teamMembers:["zabuton","pipokun","imaishouta","seichi"],
        achievements:[
            {date:"2024",tournament:"World Warrior Japan #1",result:"2位"},
            {date:"2024",tournament:"World Warrior Japan 日本決勝",result:"3位"},
            {date:"2025",tournament:"BATTLE ARENA TOKUSHIMA 2025",result:"1位"},
            {date:"2025",tournament:"SCARZ Genesis Tournament",result:"4位"}
        ],
        youtube:"https://www.youtube.com/@orarin0823",
        twitch:"https://m.twitch.tv/orarin1/home",
        twitter:"https://x.com/orachaaaaaan"
    },

    zabuton:{
        id:"zabuton",
        name:"さぶとん",
        type:"pro",
        country:"日本",
        team:"@Sycom",
        image:"https://www.sycom.co.jp/esports/wp-content/uploads/2026/02/zabuton_1200x1200.webp",
        main:["deejay"],
        style:"技巧型",
        characters:["deejay"],
        teamMembers:["orarin","pipokun","imaishouta","seichi"],
        achievements:[
            {date:"2025",tournament:"SCARZ Genesis Tournament",result:"優勝"}
        ],
        youtube:"https://www.youtube.com/@zabutonn1",
        twitch:"https://www.twitch.tv/zabutonn_",
        twitter:"https://x.com/zabutonn_"
    },

    pipokun:{
        id:"pipokun",
        name:"ピーポーくん",
        type:"pro",
        country:"日本",
        team:"@Sycom",
        image:"https://www.sycom.co.jp/esports/wp-content/uploads/2026/02/pi-pokun_1024x1024.webp",
        main:["kimberly"],
        style:"技巧型",
        characters:["kimberly"],
        teamMembers:["orarin","zabuton","imaishouta","seichi"],
        achievements:[
            {date:"2024",tournament:"BATTLE ARENA TOKUSHIMA 2024",result:"4位"},
            {date:"2025",tournament:"第4回 TOKYO METRO CUP STREET FIGHTER 6 ソロ部門",result:"準優勝"},
            {date:"2025",tournament:"第12回 ゆなっこ杯 supported by LaVISION。 スト6",result:"5位"},
            {date:"2025",tournament:"GRAPHT CUP 2025 大阪予選",result:"優勝"},
            {date:"2025",tournament:"GRAPHT CUP 2025",result:"5位"}
        ],
        youtube:"https://www.youtube.com/@Pipokun2025",
        twitch:"https://www.twitch.tv/pipokun2025",
        twitter:"https://x.com/pipokun2011"
    },

    imaishouta:{
        id:"imaishouta",
        name:"今井翔太",
        type:"pro",
        country:"日本",
        team:"@Sycom",
        image:"https://www.sycom.co.jp/esports/wp-content/uploads/2026/02/shotaimai_1024x1024.webp",
        main:["elena"],
        style:"技巧型",
        characters:["elena","manon"],
        teamMembers:["orarin","zabuton","pipokun","seichi"],
        achievements:[
            {date:"2025",tournament:"王者杯 第1戦",result:"9位"}
        ],
        youtube:"",
        twitch:"",
        twitter:"https://x.com/imai_sf6"
    },

    seichi:{
        id:"seichi",
        name:"せいち",
        type:"pro",
        country:"日本",
        team:"@Sycom",
        image:"https://www.sycom.co.jp/esports/wp-content/uploads/2026/03/seichi_1024x1024.webp",
        main:["elena"],
        style:"技巧型",
        characters:["elena"],
        teamMembers:["orarin","zabuton","pipokun","imaishouta"],
        achievements:[
            {date:"2025",tournament:"毛～腕 Grand Prix 2025",result:"5位"},
            {date:"2025",tournament:"若手杯",result:"1位"},
            {date:"2025",tournament:"Crazy Raccoon Street Fighter Academy部門 最終選考対戦会 2日目グループ",result:"1位"},
            {date:"2026",tournament:"東京eスポーツフェスタ2026",result:"3位"}
        ],
        youtube:"",
        twitch:"",
        twitter:"https://x.com/Seichi_p_q"
    },

    yhcmochi:{
        id:"yhcmochi",
        name:"YHC-餅",
        type:"pro",
        country:"日本",
        team:"",
        image:"assets/images/players/yhcmochi.png",
        main:["dhalsim"],
        style:"技巧型",
        characters:["dhalsim"],
        youtube:"",
        twitch:"",
        twitter:""
    },

    kakeru:{
        id:"kakeru",
        name:"翔",
        type:"pro",
        country:"日本",
        team:"",
        image:"",
        main:["jp"],
        style:"待ち・読み合い重視",
        characters:["jp"],
        learningPoints: ["対空精度", "距離管理", "ゲージ管理"],

        learningPointsDetail:
            "JPの飛び道具と間合い管理を軸に、相手を動かしながら試合を支配する待ち・読み合い重視のスタイルが特徴です。正確な対空技術と、ドライブゲージを含めたリソース管理の巧みさが持ち味で、待ち型・読み合い型のプレイヤーが「間合いの支配力」を学ぶ上で参考になります。",
        achievements:[
            {date:"",tournament:"CAPCOM CUP",result:"出場"},
            {date:"",tournament:"SFL",result:"出場"}
        ],
        youtube:"",
        twitch:"",
        twitter:""
    },

    go1:{
        id:"go1",
        name:"GO1",
        type:"pro",
        country:"日本",
        team:"CAG OSAKA",
        image:"assets/images/players/go1.png",
        main:["chunli"],
        style:"",
        characters:["chunli","cammy","luke","ehonda"],
        youtube:"",
        twitch:"",
        twitter:"https://x.com/GO13151"
    },

    noble:{
        id:"noble",
        name:"Noble",
        type:"pro",
        country:"日本",
        team:"",
        image:"assets/images/players/noble.png",
        main:["luke"],
        style:"",
        characters:["luke"],
        youtube:"",
        twitch:"",
        twitter:"https://x.com/Noble_fgc"
    },

};
