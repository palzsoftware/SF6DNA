const streamerData = {

    // 2026/7/27 追加: 検索で裏取りした実在ストリーマー
    k4sen:{

        id:"k4sen",
        name:"k4sen",
        type:"streamer",
        country:"日本",
        team:"",
        image:"",
        main:[
            "jp"
        ],
        style:"色々なキャラを試すマルチプレイヤー型",
        characters:[
            "jp",
            "marisa",
            "blanka",
            "deejay"],

        learningCategories: {
            movement: ["JP・マリーザ・ブランカを操る立ち回り"],
            offense: ["人気配信者としての知名度に見合う積極的な攻め"],
            defense: ["複数キャラを扱う中で培った守りの技術"],
            reading: ["配信を通じて磨いた読み合い"],
            combo: ["複数キャラそれぞれの特性を活かしたコンボ"],
            characterKnowledge: ["JP・マリーザ・ブランカ・ディージェイという複数キャラへの理解"],
            mental: ["配信活動と両立する安定したメンタル"],
            tournament: ["配信・大会活動での経験"]
        },
        youtube:"",
        twitch:"https://www.twitch.tv/k4sen",
        twitter:"https://x.com/k4sen"

    },

    // 2026/7/27 追加: 検索で裏取りした実在ストリーマー
    donpisha:{
        id:"donpisha",
        name:"ドンピシャ",
        type:"streamer",
        country:"日本",
        team:"三人称",
        image:"",
        main:["guile"],
        style:"堅実型",
        characters:["guile"],

        learningCategories: {
            movement: ["ガイルを軸にした立ち回り"],
            offense: ["ストリーマーとしての積極的な攻め"],
            defense: ["ガイルらしい堅実な守り"],
            reading: ["配信を通じて磨いた読み合い"],
            combo: ["ガイルの特性を活かしたコンボ選択"],
            characterKnowledge: ["ガイルというキャラクターへの理解"],
            mental: ["配信活動と両立する安定したメンタル"],
            tournament: ["REJECT FIGHT NIGHT出場を含む経験"]
        },
        youtube:"",
        twitch:"",
        twitter:"https://x.com/DONPISHA22"
    },

    shaka:{
        id:"shaka",
        name:"SHAKA",
        type:"streamer",
        country:"日本",
        team:"DETONATOR",
        image:"",
        main:["manon"],
        style:"技巧型",
        characters:["manon","marisa","bison"],

        learningCategories: {
            movement: ["マノンを軸にした立ち回り"],
            offense: ["DETONATOR所属ストリーマーとしての積極的な攻め"],
            defense: ["堅実な守り"],
            reading: ["あくたがわとのチームでRed Bull LEGENDUS優勝を果たした読み合い"],
            combo: ["マノンの特性を活かしたコンボ選択"],
            characterKnowledge: ["マノン・マリーザ・ベガという複数キャラへの理解"],
            mental: ["大舞台での優勝経験に裏打ちされた精神力"],
            tournament: ["Red Bull LEGENDUS優勝を含む実績"]
        },
        youtube:"",
        twitch:"",
        twitter:""
    },

    kosaku:{
        id:"kosaku",
        name:"コサク",
        type:"streamer",
        country:"日本",
        team:"TOPANGA / VARREL",
        image:"",
        main:["elena"],
        style:"",
        characters:["elena","cammy"],

        learningCategories: {
            movement: ["エレナ・キャミィを軸にした立ち回り"],
            offense: ["TOPANGA/VARRELスタッフとしての知見を活かした攻め"],
            defense: ["堅実な守り"],
            reading: ["ときどチャンネルでの経験に基づく読み合い"],
            combo: ["エレナ・キャミィそれぞれの特性を活かしたコンボ"],
            characterKnowledge: ["エレナ・キャミィという複数キャラへの理解"],
            mental: ["ときど選手を支えるスタッフとしての安定した精神力"],
            tournament: ["配信・大会活動での経験"]
        },

        pastTeams:["AKIHABARA ENCOUNT"],

        achievements:[
            {date:"2026",tournament:"Fighters Crossover全国大会#02",result:"優勝"},
            {date:"2025",tournament:"第14回TOPANGAチャリティーカップ",result:"5位"},
            {date:"2025",tournament:"GRAPHT CUP 2025 東京予選",result:"5位"},
            {date:"2026",tournament:"第7期 TOPANGAチャンピオンシップ オンライン予選",result:"7位"}
        ],
        youtube:"",
        twitch:"",
        twitter:"https://x.com/kosaku_075"
    },

    takera:{
        id:"takera",
        name:"takera",
        type:"streamer",
        country:"日本",
        team:"忍ism Gaming",
        image:"",
        main:["deejay"],
        style:"",
        characters:["deejay","bison"],

        learningCategories: {
            movement: ["ディージェイ・ベガを軸にした立ち回り"],
            offense: ["忍ism Gaming所属選手としての攻め"],
            defense: ["堅実な守り"],
            reading: ["対戦を重ねる中で培った読み合いの精度"],
            combo: ["ディージェイ・ベガそれぞれの特性を活かしたコンボ"],
            characterKnowledge: ["ディージェイ・ベガという複数キャラへの理解"],
            mental: ["独自プロテイン企画も手掛けるほどの多方面での活動力"],
            tournament: ["国内大会での実績"]
        },
        youtube:"",
        twitch:"https://www.twitch.tv/takera0628",
        twitter:"https://x.com/takeraketa"
    },

    ksk:{
        id:"ksk",
        name:"KSK",
        type:"streamer",
        country:"日本",
        team:"",
        image:"",
        style:"",
        characters:["ehonda"],

        learningCategories: {
            movement: ["独自の立ち回り"],
            offense: ["ストリーマーとしての積極的な攻め"],
            defense: ["堅実な守り"],
            reading: ["配信を通じて磨いた読み合い"],
            combo: ["実戦的なコンボ選択"],
            characterKnowledge: ["使用キャラクターへの理解"],
            mental: ["配信活動と両立する安定したメンタル"],
            tournament: ["大会参加経験"]
        },

        achievements:[],

        youtube:"",
        twitch:"",
        twitter:""
    },

    sasatikk:{
        id:"sasatikk",
        name:"Sasatikk",
        type:"streamer",
        country:"日本",
        team:"",
        image:"",
        style:"",
        characters:["jp", "jamie"],

        learningCategories: {
            movement: ["独自の立ち回り"],
            offense: ["積極的な攻め"],
            defense: ["堅実な守り"],
            reading: ["対戦経験に基づく読み合い"],
            combo: ["実戦的なコンボ選択"],
            characterKnowledge: ["使用キャラクターへの理解"],
            mental: ["安定した精神力"],
            tournament: ["大会参加経験"]
        },

        device:"アケコン：不明",

        achievements:[
            {date:"2023",tournament:"REJECT FIGHT NIGHT",result:"3位"},
            {date:"2023",tournament:"REJECT FIGHT NIGHT Round2",result:"4位"},
            {date:"2024",tournament:"第5回 Crazy Raccoon Cup Street Fighter 6",result:"3位"}
        ],

        youtube:"https://www.youtube.com/@sasatikk",
        twitch:"",
        twitter:""
    },

    ariken:{
        id:"ariken",
        name:"ありけん",
        type:"streamer",
        country:"日本",
        team:"",
        image:"",
        style:"",
        characters:[],

        learningCategories: {
            movement: ["ダルシムを軸にした独特な間合い管理"],
            offense: ["ストリーマー代表としての積極的な攻め"],
            defense: ["ダルシムらしいリーチを活かした守り"],
            reading: ["はるみー選手とチームを組んだ経験に基づく読み合い"],
            combo: ["ダルシムの特性を活かしたコンボ選択"],
            characterKnowledge: ["ダルシムというトリッキーなキャラへの理解"],
            mental: ["ストリーマー代表として大舞台に立つ精神力"],
            tournament: ["Red Bull LEGENDUS出場を含む実績"]
        },

        device:"アケコン：",

        pastTeams:["RIDDLE"],

        achievements:[
            {date:"2024",tournament:"RAGE SUPER MATCH",result:"準優勝"},
            {date:"2025",tournament:"REJECT FIGHT NIGHT Round5 OFFLINE",result:"優勝"},
            {date:"2025",tournament:"REJECT FIGHT NIGHT Round6",result:"優勝"},
            {date:"2023",tournament:"REJECT FIGHT NIGHT Round2",result:"4位"},
            {date:"2024",tournament:"RAGE STREET FIGHTER",result:"3位"}
        ],

        youtube:"",
        twitch:"",
        twitter:""
    },

    obo:{
        id:"obo",
        name:"おぼ",
        type:"streamer",
        country:"日本",
        team:"",
        image:"",
        style:"",
        characters:["ehonda", "chunli"],

        learningCategories: {
            movement: ["独自の立ち回り"],
            offense: ["配信者らしい積極的な攻め"],
            defense: ["堅実な守り"],
            reading: ["配信を通じて磨いた読み合い"],
            combo: ["実戦的なコンボ選択"],
            characterKnowledge: ["使用キャラクターへの理解"],
            mental: ["配信者としての安定したメンタル"],
            tournament: ["大会参加経験"]
        },

        device:"：",

        achievements:[
            {date:"2023",tournament:"REJECT FIGHT NIGHT",result:"優勝"},
            {date:"2023",tournament:"Tokyo Online Party 2023 Summer",result:"優勝"},
            {date:"2024",tournament:"第3回 Crazy Raccoon Cup Street Fighter 6",result:"優勝"},
            {date:"2025",tournament:"消毒杯 Powered by NURO 光",result:"優勝"},
            {date:"2023",tournament:"REJECT FIGHT NIGHT Round2",result:"3位"},
            {date:"2023",tournament:"年末配信者",result:"4位"},
            {date:"2024",tournament:"RAGE STREET FIGHTER",result:"5位"},
            {date:"2024",tournament:"第5回 Crazy Raccoon Cup Street Fighter 6",result:"3位"}
        ],

        youtube:"https://www.youtube.com/@obormentv",
        twitch:"",
        twitter:""
    },

    kokujin:{
        id:"kokujin",
        name:"こくじん",
        type:"streamer",
        country:"日本",
        team:"",
        image:"",
        style:"",
        characters:["ehonda", "ken"],

        learningCategories: {
            movement: ["独自の立ち回り"],
            offense: ["ときどチャンネルにも出演する実力者としての攻め"],
            defense: ["堅実な守り"],
            reading: ["対戦経験に基づく読み合い"],
            combo: ["実戦的なコンボ選択"],
            characterKnowledge: ["使用キャラクターへの理解"],
            mental: ["安定した精神力"],
            tournament: ["大会参加経験"]
        },

        official:"http://ch.nicovideo.jp/kokunuki",

        pastTeams:["REJECT", "REVIZE"],

        achievements:[
            {date:"2024",tournament:"All games Battle Championship #2",result:"準優勝"},
            {date:"2024",tournament:"REJECT FIGHT NIGHT Round3",result:"優勝"},
            {date:"2025",tournament:"REJECT FIGHT NIGHT Round5 OFFLINE",result:"優勝"},
            {date:"2025",tournament:"せつな祭3",result:"準優勝"},
            {date:"2025",tournament:"傀儡杯",result:"優勝"},
            {date:"2023",tournament:"REJECT FIGHT NIGHT",result:"3位"},
            {date:"2024",tournament:"RAGE SUPER MATCH",result:"3位"},
            {date:"2024",tournament:"REJECT FIGHT NIGHT Round4",result:"3位"}
        ],

        youtube:"",
        twitch:"",
        twitter:""
    },

    daikoku:{
        id:"daikoku",
        name:"だいこく",
        type:"streamer",
        country:"日本",
        team:"",
        image:"",
        style:"",
        characters:["guile", "sagat"],

        learningCategories: {
            movement: ["ガイルを軸にした立ち回り"],
            offense: ["積極的な攻めの構築力"],
            defense: ["ガイルらしい堅実な守り"],
            reading: ["対戦を重ねる中で培った読み合いの精度"],
            combo: ["ガイルの特性を活かしたコンボ選択"],
            characterKnowledge: ["ガイルというキャラクターへの理解"],
            mental: ["安定した精神力"],
            tournament: ["国内大会での実績"]
        },

        device:"アケコン：不明",

        pastTeams:["指喧", "ウェルプレイド株式会社", "VARREL"],

        achievements:[
            {date:"2023",tournament:"ICFC",result:"優勝"},
            {date:"2024",tournament:"第13回TOPANGAチャリティーカップ",result:"優勝"},
            {date:"2025",tournament:"第14回TOPANGAチャリティーカップ",result:"準優勝"},
            {date:"2023",tournament:"9月30日 Fukushima Online Tournament",result:"3位"},
            {date:"2023",tournament:"CAPCOM Pro Tour 2023 World Warrior Japan #5",result:"5位"},
            {date:"2023",tournament:"第28回 iXACUP",result:"4位"},
            {date:"2025",tournament:"レイク杯",result:"3位"}
        ],

        youtube:"https://www.youtube.com/channel/UCxUDkgFYAz3JBkfVX-GuLsQ",
        twitch:"",
        twitter:""
    },

    nanai:{
        id:"nanai",
        name:"なない",
        type:"streamer",
        country:"日本",
        team:"",
        image:"",
        style:"",
        characters:["jp"],

        learningCategories: {
            movement: ["独自の立ち回り"],
            offense: ["ストリーマーとしての積極的な攻め"],
            defense: ["堅実な守り"],
            reading: ["配信を通じて磨いた読み合い"],
            combo: ["実戦的なコンボ選択"],
            characterKnowledge: ["使用キャラクターへの理解"],
            mental: ["配信活動と両立する安定したメンタル"],
            tournament: ["大会参加経験"]
        },

        achievements:[],

        youtube:"",
        twitch:"",
        twitter:""
    },

    naruo:{
        id:"naruo",
        name:"なるお",
        type:"streamer",
        country:"日本",
        team:"",
        image:"",
        style:"",
        characters:["jamie", "ryu", "terry"],

        learningCategories: {
            movement: ["独自の立ち回り"],
            offense: ["配信者らしい積極的な攻め"],
            defense: ["堅実な守り"],
            reading: ["配信を通じて磨いた読み合い"],
            combo: ["実戦的なコンボ選択"],
            characterKnowledge: ["使用キャラクターへの理解"],
            mental: ["ときど選手が尊敬するプレイヤーの一人として知られる実力"],
            tournament: ["大会参加経験"]
        },

        device:"アケコン： ※8ボタン中2ボタン未設定で使用 →",

        pastTeams:["魚群", "DetonatioN FocusMe"],

        achievements:[
            {date:"2024",tournament:"騒音カップ powered by NURO 光",result:"優勝"},
            {date:"2025",tournament:"REJECT FIGHT NIGHT Round5 OFFLINE",result:"優勝"},
            {date:"2025",tournament:"TOPANGA TV #657 『 舞 』解禁最速トーナメント！",result:"優勝"},
            {date:"2025",tournament:"DFMはこおし#57 格ゲー部門最強決定戦",result:"優勝"},
            {date:"2024",tournament:"Fighters Crossover全国大会#00",result:"1位"},
            {date:"2024",tournament:"第13回TOPANGAチャリティーカップ",result:"5位"},
            {date:"2024",tournament:"RAGE SUPER MATCH",result:"4位"},
            {date:"2025",tournament:"SLEEP FIGHTER II",result:"4位"}
        ],

        youtube:"",
        twitch:"",
        twitter:""
    },

    frieda:{
        id:"frieda",
        name:"ふり～だ",
        type:"streamer",
        country:"日本",
        team:"",
        image:"",
        style:"",
        characters:["kimberly"],

        learningCategories: {
            movement: ["独自の立ち回り"],
            offense: ["ストリーマーとしての積極的な攻め"],
            defense: ["堅実な守り"],
            reading: ["配信を通じて磨いた読み合い"],
            combo: ["実戦的なコンボ選択"],
            characterKnowledge: ["使用キャラクターへの理解"],
            mental: ["配信活動と両立する安定したメンタル"],
            tournament: ["大会参加経験"]
        },

        achievements:[],

        youtube:"",
        twitch:"",
        twitter:""
    },

    betty:{
        id:"betty",
        name:"べてぃ",
        type:"streamer",
        country:"日本",
        team:"",
        image:"",
        style:"",
        characters:["juri"],

        learningCategories: {
            movement: ["独自の立ち回り"],
            offense: ["積極的な攻め"],
            defense: ["堅実な守り"],
            reading: ["対戦経験に基づく読み合い"],
            combo: ["実戦的なコンボ選択"],
            characterKnowledge: ["使用キャラクターへの理解"],
            mental: ["安定した精神力"],
            tournament: ["大会参加経験"]
        },

        device:"パッド：Victrix Pro BFG Wireless Controller →",

        official:"https://momoiruna.com/",

        pastTeams:["G-STAR Gaming（GSG）"],

        achievements:[
            {date:"2023",tournament:"いいすぽ！ #86 地上波オリジナル「",result:"優勝"},
            {date:"2024",tournament:"CYNTHIA",result:"優勝"},
            {date:"2024",tournament:"TGS2024 Samsung SSD ワルキューレ杯",result:"優勝"},
            {date:"2024",tournament:"せつな祭",result:"準優勝"},
            {date:"2024",tournament:"REJECT FIGHT NIGHT Round4",result:"準優勝"},
            {date:"2025",tournament:"REJECT FIGHT NIGHT Round6",result:"優勝"},
            {date:"2025",tournament:"あじゅ姉フェス 敬老杯",result:"準優勝"},
            {date:"2024",tournament:"じすたげCUP ～",result:"3位"}
        ],

        youtube:"",
        twitch:"",
        twitter:""
    },

    yoshinama:{
        id:"yoshinama",
        name:"よしなま",
        type:"streamer",
        country:"日本",
        team:"",
        image:"",
        style:"",
        characters:["luke"],

        learningCategories: {
            movement: ["M：ルークを軸にした立ち回り"],
            offense: ["スト6初期からメインキャラを貫く攻めの構築"],
            defense: ["堅実な守り"],
            reading: ["じゃじいからコーチングを受けた読み合いの知見"],
            combo: ["ルークの特性を活かしたコンボ選択"],
            characterKnowledge: ["ルークというキャラクターへの深い理解"],
            mental: ["ゲーム実況者としての安定した精神力"],
            tournament: ["配信・大会活動での経験"]
        },

        device:"パッド：Victrix Pro BFG",

        achievements:[
            {date:"2023",tournament:"年末配信者",result:"優勝"},
            {date:"2024",tournament:"RAGE SUPER MATCH",result:"優勝"},
            {date:"2025",tournament:"銀棘杯",result:"優勝"},
            {date:"2025",tournament:"REJECT FIGHT NIGHT Round6",result:"準優勝"},
            {date:"2024",tournament:"第2回 配信者ハイパーゲーム大会",result:"3位"},
            {date:"2024",tournament:"RAGE STREET FIGHTER",result:"7位"},
            {date:"2024",tournament:"獅白杯 上級者トーナメント",result:"7位"},
            {date:"2024",tournament:"REJECT FIGHT NIGHT Round3",result:"3位"}
        ],

        youtube:"https://www.youtube.com/@yoshinama0130",
        twitch:"",
        twitter:""
    },

    earl:{
        id:"earl",
        name:"アール",
        type:"streamer",
        country:"日本",
        team:"",
        image:"",
        style:"",
        characters:["kimberly"],

        learningCategories: {
            movement: ["独自の立ち回り"],
            offense: ["配信者としての積極的な攻め"],
            defense: ["堅実な守り"],
            reading: ["配信を通じて磨いた読み合い"],
            combo: ["実戦的なコンボ選択"],
            characterKnowledge: ["使用キャラクターへの理解"],
            mental: ["配信活動と両立する安定したメンタル"],
            tournament: ["大会参加経験"]
        },

        official:"https://ch.nicovideo.jp/youdeal-ch01",

        achievements:[
            {date:"2025",tournament:"獅白杯3rd レジェンドの部",result:"7位"}
        ],

        youtube:"",
        twitch:"",
        twitter:""
    },

    hameko:{
        id:"hameko",
        name:"ハメコ。",
        type:"streamer",
        country:"日本",
        team:"",
        image:"",
        style:"",
        characters:["marisa", "aki", "ed"],

        learningCategories: {
            movement: ["独自の立ち回り"],
            offense: ["解説・配信活動を通じた深い知識に基づく攻め"],
            defense: ["堅実な守り"],
            reading: ["キャラクター解説動画も手掛けるほどの深い読み合いの知見"],
            combo: ["実戦的なコンボ選択"],
            characterKnowledge: ["解説者としての幅広いキャラクター知識"],
            mental: ["配信活動と両立する安定したメンタル"],
            tournament: ["大会参加経験"]
        },

        pastTeams:["よしもとゲーミング"],

        achievements:[
            {date:"2025",tournament:"第14回TOPANGAチャリティーカップ",result:"5位"}
        ],

        youtube:"https://www.youtube.com/channel/UCwyUaK2cXujgDb2NGnsxT8w",
        twitch:"",
        twitter:""
    },

    kuramochiyuka:{
        id:"kuramochiyuka",
        name:"倉持由香",
        type:"streamer",
        country:"日本",
        team:"",
        image:"",
        style:"",
        characters:["lily"],

        learningCategories: {
            movement: ["独自の立ち回り"],
            offense: ["タレント活動と両立した積極的な攻め"],
            defense: ["堅実な守り"],
            reading: ["配信を通じて磨いた読み合い"],
            combo: ["実戦的なコンボ選択"],
            characterKnowledge: ["使用キャラクターへの理解"],
            mental: ["タレントとしての安定したメンタル"],
            tournament: ["大会参加経験"]
        },

        official:"https://g-stargaming.com/",

        pastTeams:["G-STAR Gaming"],

        achievements:[
            {date:"2024",tournament:"えりー杯",result:"優勝"},
            {date:"2025",tournament:"せつな祭3",result:"優勝"},
            {date:"2024",tournament:"獅白杯 上級者トーナメント",result:"5位"},
            {date:"2025",tournament:"銀棘杯",result:"3位"}
        ],

        youtube:"",
        twitch:"",
        twitter:""
    },

    oosuakira:{
        id:"oosuakira",
        name:"大須晶",
        type:"streamer",
        country:"日本",
        team:"",
        image:"",
        style:"",
        characters:["deejay"],

        learningCategories: {
            movement: ["独自の立ち回り"],
            offense: ["格闘ゲームシーンで広く知られる知見に基づく攻め"],
            defense: ["堅実な守り"],
            reading: ["長年のシーン経験による深い読み合いの知見"],
            combo: ["実戦的なコンボ選択"],
            characterKnowledge: ["幅広いタイトルへの深い理解"],
            mental: ["格闘ゲームシーンを長年支えてきた安定した精神力"],
            tournament: ["配信・イベント活動での経験"]
        },

        achievements:[],

        youtube:"",
        twitch:"",
        twitter:""
    },

    unoshoma:{
        id:"unoshoma",
        name:"宇野昌磨",
        type:"streamer",
        country:"日本",
        team:"",
        image:"",
        style:"",
        characters:["bison"],

        learningCategories: {
            movement: ["独自の立ち回り"],
            offense: ["積極的な攻め"],
            defense: ["堅実な守り"],
            reading: ["対戦経験に基づく読み合い"],
            combo: ["実戦的なコンボ選択"],
            characterKnowledge: ["使用キャラクターへの理解"],
            mental: ["他競技でのトップアスリート経験に基づく高い集中力"],
            tournament: ["イベント参加経験"]
        },

        official:"https://shoma-uno.com/",

        achievements:[
            {date:"2025",tournament:"獅白杯～東西対抗戦～",result:"優勝"}
        ],

        youtube:"https://www.youtube.com/@shomauno424",
        twitch:"",
        twitter:""
    },

    shoji_kog:{
        id:"shoji_kog",
        name:"小路KOG",
        type:"streamer",
        country:"日本",
        team:"",
        image:"",
        style:"",
        characters:["deejay", "lily"],

        learningCategories: {
            movement: ["リリーを軸にした立ち回り"],
            offense: ["若手勢との交流に基づく積極的な攻め"],
            defense: ["堅実な守り"],
            reading: ["対戦を重ねる中で培った読み合い"],
            combo: ["リリーの特性を活かしたコンボ選択"],
            characterKnowledge: ["リリーというキャラクターへの理解"],
            mental: ["安定した精神力"],
            tournament: ["国内大会での実績"]
        },

        pastTeams:["京都スサノオ", "AMATERASU", "IGZIST", "AMATERASU GAMING", "Ninjas in Pyjamas"],

        achievements:[
            {date:"2024",tournament:"IGA CUP powered by GLOE",result:"準優勝"},
            {date:"2023",tournament:"FAVCUP online Road to はじめての EVO sponsored by アコム",result:"5位"},
            {date:"2023",tournament:"10月1日 SS熊本杯",result:"5位"},
            {date:"2024",tournament:"CAPCOM Pro Tour 2024 World Warrior Japan #3",result:"7位"},
            {date:"2025",tournament:"名古屋NTPOJAライセンスチャレンジツアー 2024 ～New Heroは俺だ～ 第4戦",result:"5位"},
            {date:"2025",tournament:"LAKUNA HAKUI CUP",result:"4位"}
        ],

        youtube:"https://www.youtube.com/@kog4586",
        twitch:"",
        twitter:""
    },

    utahirobajun:{
        id:"utahirobajun",
        name:"歌広場淳",
        type:"streamer",
        country:"日本",
        team:"",
        image:"",
        style:"",
        characters:["ken"],

        learningCategories: {
            movement: ["独自の立ち回り"],
            offense: ["タレント活動と両立した積極的な攻め"],
            defense: ["堅実な守り"],
            reading: ["配信を通じて磨いた読み合い"],
            combo: ["実戦的なコンボ選択"],
            characterKnowledge: ["使用キャラクターへの理解"],
            mental: ["タレントとしての安定したメンタル"],
            tournament: ["大会参加経験"]
        },

        device:"アケコン：HORI リアルアーケードPro.V HAYABUSA（2018年1月時点） →",

        achievements:[
            {date:"2025",tournament:"激闘遊戯",result:"優勝"},
            {date:"2024",tournament:"獅白杯2nd 超級の部",result:"5位"}
        ],

        youtube:"",
        twitch:"",
        twitter:""
    },

    shibuyaharu:{
        id:"shibuyaharu",
        name:"渋谷ハル",
        type:"streamer",
        country:"日本",
        team:"",
        image:"",
        style:"",
        characters:["rashid"],

        learningCategories: {
            movement: ["独自の立ち回り"],
            offense: ["eスポーツ界での幅広い活動に基づく積極的な攻め"],
            defense: ["堅実な守り"],
            reading: ["配信・イベント活動で磨いた読み合い"],
            combo: ["実戦的なコンボ選択"],
            characterKnowledge: ["使用キャラクターへの理解"],
            mental: ["eスポーツシーンを牽引する安定した精神力"],
            tournament: ["大会参加経験"]
        },

        device:"レバーレス：PUNK WORKSHOP MINI BOX →",

        official:"https://neo-porte.jp/member/shibuya-hal",

        achievements:[
            {date:"2024",tournament:"Vtuber",result:"準優勝"},
            {date:"2025",tournament:"RFN×SajamSlam INTERNATIONAL CHANPIONSHIP",result:"優勝"},
            {date:"2025",tournament:"獅白杯3rd マスターの部",result:"優勝"},
            {date:"2024",tournament:"獅白杯2nd 電流デスマッチ",result:"1位"},
            {date:"2025",tournament:"獅白杯3rd グランドマスターの部",result:"5位"},
            {date:"2025",tournament:"REJECT FIGHT NIGHT Round6",result:"3位"}
        ],

        youtube:"",
        twitch:"",
        twitter:""
    },

    ishiipuro:{
        id:"ishiipuro",
        name:"石井プロ",
        type:"streamer",
        country:"日本",
        team:"",
        image:"",
        style:"",
        characters:["manon"],

        learningCategories: {
            movement: ["独自の立ち回り"],
            offense: ["ストリーマーとしての積極的な攻め"],
            defense: ["堅実な守り"],
            reading: ["配信を通じて磨いた読み合い"],
            combo: ["実戦的なコンボ選択"],
            characterKnowledge: ["使用キャラクターへの理解"],
            mental: ["配信活動と両立する安定したメンタル"],
            tournament: ["大会参加経験"]
        },

        achievements:[],

        youtube:"",
        twitch:"",
        twitter:""
    },

    kamikic:{
        id:"kamikic",
        name:"神木C",
        type:"streamer",
        country:"日本",
        team:"",
        image:"",
        style:"",
        characters:["jp"],

        learningCategories: {
            movement: ["独自の立ち回り"],
            offense: ["積極的な攻め"],
            defense: ["堅実な守り"],
            reading: ["対戦経験に基づく読み合い"],
            combo: ["実戦的なコンボ選択"],
            characterKnowledge: ["使用キャラクターへの理解"],
            mental: ["安定した精神力"],
            tournament: ["大会参加経験"]
        },

        achievements:[
            {date:"2026",tournament:"第2回 ゆなっこ杯 5on5 supported by LaVISION。",result:"準優勝"},
            {date:"2026",tournament:"D4CUP 第3回オンライン予選",result:"準優勝"},
            {date:"2026",tournament:"D4CUP",result:"7位"}
        ],

        youtube:"https://www.youtube.com/@ckamiki",
        twitch:"",
        twitter:""
    },

    akamikarubi:{
        id:"akamikarubi",
        name:"赤見かるび",
        type:"streamer",
        country:"日本",
        team:"",
        image:"",
        style:"",
        characters:["marisa", "blanka"],

        learningCategories: {
            movement: ["独自の立ち回り"],
            offense: ["配信者として活動しながらの積極的な攻め"],
            defense: ["堅実な守り"],
            reading: ["配信を通じて磨いた読み合い"],
            combo: ["実戦的なコンボ選択"],
            characterKnowledge: ["使用キャラクターへの理解"],
            mental: ["配信活動と両立する安定したメンタル"],
            tournament: ["大会参加経験"]
        },

        device:"パッド：不明",

        achievements:[
            {date:"2024",tournament:"REJECT FIGHT NIGHT Round3",result:"準優勝"},
            {date:"2023",tournament:"REJECT FIGHT NIGHT",result:"4位"},
            {date:"2023",tournament:"REJECT FIGHT NIGHT Round2",result:"4位"},
            {date:"2024",tournament:"騒音カップ powered by NURO 光",result:"2位"},
            {date:"2024",tournament:"獅白杯2nd 上級の部",result:"4位"},
            {date:"2024",tournament:"REJECT FIGHT NIGHT Round4",result:"4位"},
            {date:"2024",tournament:"配信者マリーザ王決定戦",result:"5位"}
        ],

        youtube:"",
        twitch:"",
        twitter:""
    },

};
