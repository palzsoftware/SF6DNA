const characterData = {
    ryu: {

    // ======================
    // 基本情報
    // ======================
    id: "ryu",
    name: "リュウ",
    image: "assets/images/characters/ryu.jpg",
    release: "初期",
    type: "バランス型",
    difficulty: 3,
    hp:10000,
    combo:3,
    power: 4,
    speed: 3,
    defense: 3,
    reach: 3,
    beginner: 5,
    rush:3,
    projectile:true,
    invincible:true,
    antiAir:4,
    commandGrab:false,


    // ======================
    // ステータス
    // ======================
    stats: {
        power: 4,
        speed: 3,
        defense: 3,
        reach: 3,
        beginner: 5
    },
    // ======================
    // キャラクター情報
    // ======================
   playstyle:"オールラウンダー",
range:"中距離",
concept:
"飛び道具・対空・通常技を駆使し、状況に応じて柔軟に立ち回る基本に忠実なキャラクター。",

strengths:[
    "攻守のバランスが良い",
    "基本を学びやすい性能",
    "どの距離でも安定して戦える"
],

weaknesses:[
    "突出した性能は少ない",
    "相手に合わせた判断力が必要",
    "爆発力では専門キャラに劣る"
],

recommend:[
    "Street Fighterを基礎から学びたい人",
    "バランスの良いキャラが好きな人",
    "長く使えるキャラを探している人"
],
   matchups:{
    strong:[
        {
            id:"ehonda",
            reason:"本田の主力技の頭突きと百貫落としの対応がしやすい"
        },
        {
            id:"ken",
            reason:"火力と通常技のリーチを生かし安定して戦える"
        },
        {
            id:"zangief",
            reason:"飛び道具と対空技で近距離戦をしづらくさせる"
        }
    ],

    weak:[
        {
            id:"jp",
            reason:"飛び道具や設置技による遠距離戦で主導権を握られやすい"
        },
        {
            id:"cammy",
            reason:"素早い接近と空中機動変化技で中距離戦を崩されやすい"
        },
        {
            id:"chunli",
            reason:"リーチの長い通常技で地上戦を支配されやすい"
        }
    ]
},
    // ======================
    // 関連情報
    // ======================
    related: {
        characters: [
            "ken",
            "gouki",
            "luke"
        ],
        players: {
            pros: [
                "shuto",
                "hinao",
                "cosa"
            ],
            streamers: [
               "なし"
            ],
            vtubers: [
             "なし"
            ],youtubers:[]}
    },
    // ======================
    // コンボ動画
    // ======================
    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/ryu_beginner.jpg",
                url: "https://youtu.be/ZQLuHVVdG-M?si=H4-bpg2_A_r2zGcb"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/ryu_intermediate.jpg",
                url: "https://youtu.be/IPrl7UtWBBs?si=rDUnkMMdfV8DWwrK"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%83%AA%E3%83%A5%E3%82%A6%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%83%AA%E3%83%A5%E3%82%A6%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    }
},
    luke: {

    // ======================
    // 基本情報
    // ======================
    id: "luke",
    name: "ルーク",
    image: "assets/images/characters/luke.png",
    release: "初期",
    type: "バランス型",
    difficulty: 2,
    hp:10000,
    combo:3,
    power: 3,
    speed: 4,
    defense: 4,
    reach: 4,
    beginner:5,
    rush:3,
    projectile:true,
    invincible:true,
    antiAir:4,
    commandGrab:true,
    // ======================
    // ステータス
    // ======================
    stats: {
        power: 3,
        speed: 4,
        defense: 4,
        reach: 4,
        beginner:5
    },
    // ======================
    // キャラクター情報
    // ======================
   playstyle:"スタンダード",
range:"近〜中距離",
concept:
"扱いやすい通常技と高性能な必殺技を活かし、安定した立ち回りで試合を組み立てるキャラクター。",

strengths:[
    "初心者でも扱いやすい",
    "通常技と必殺技の性能が高い",
    "攻守ともに安定している"
],

weaknesses:[
    "尖った性能は少ない",
    "相手を崩す工夫が必要",
    "キャラ対策されると読み合いが重要になる"
],

recommend:[
    "初心者から上級者まで幅広く使いたい人",
    "安定した立ち回りを重視する人",
    "まず1キャラを極めたい人"
],
   matchups:{
    strong:[
        {
            id:"juri",
            reason:"飛び道具と通常技でジュリの得意な近距離戦を制限しやすい"
        },
        {
            id:"blanka",
            reason:"突進技を迎撃しやすく、安定した立ち回りができる"
        },
        {
            id:"bison",
            reason:"飛び道具と通常技で攻めの起点を作られにくい"
        }
    ],

    weak:[
        {
            id:"elena",
            reason:"通常技のリーチと高い機動力で中距離戦が苦しい"
        },
        {
            id:"sagat",
            reason:"飛び道具と通常技のリーチ、高い火力で近中距離戦が苦戦しやすい"
        },
        {
            id:"ed",
            reason:"通常技の差し返し能力が高く通常技を振りづらい"
        }
    ]
},
    // ======================
    // 関連情報
    // ======================
    related: {
        characters: [
            "ryu",
            "ken",
            "gouki"
        ],
        players: {
            pros: ["Noble","noahtheprodigy"],
            streamers: ["yoshinama"],
            vtubers: ["なし"],youtubers:[]}
    },
    // ======================
    // コンボ動画
    // ======================
    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/luke_beginner.jpg",
                url: "https://youtu.be/veNUlpvI6is?si=Jr7r3wk7IFMRP5Al"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/luke_intermediate.jpg",
                url: "https://youtu.be/SVKobqqwyJA?si=jDMxrLIL1unQfWp_"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%83%AB%E3%83%BC%E3%82%AF%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%83%AB%E3%83%BC%E3%82%AF%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    }
},
    chunli: {

    // ======================
    // 基本情報
    // ======================
    id: "chunli",
    name: "春麗",
    image: "assets/images/characters/chunli.jpg",
    release: "初期",
    type: "ディフェンス型",
    difficulty: 4,
    hp:10000,
    combo:4,
    power: 2,
    speed: 5,
    defense: 4,
    reach: 4,
    beginner: 2,
    rush:3,
    projectile:true,
    invincible:true,
    antiAir:3,
    commandGrab:false,

    // ======================
    // ステータス
    // ======================
    stats: {
        power: 2,
        speed: 5,
        defense: 4,
        reach: 4,
        beginner: 2
    },

    // ======================
    // キャラクター情報
    // ======================
    playstyle:"差し合い",
range:"中距離",
concept:
"最強クラスの地上戦を武器に、差し合いでじわじわ相手を追い詰めるテクニカルキャラクター",

strengths:[
    "通常技のリーチが長い",
    "機動力が高く立ち回りが強い",
    "攻守ともに安定している"
],

weaknesses:[
    "コンボ難易度が高め",
    "火力を出すには練習が必要",
    "攻めを継続するには状況判断が重要"
],

recommend:[
    "差し合いが好きな人",
    "テクニカルな操作を楽しみたい人",
    "安定した立ち回りを重視する人"
],

matchups:{
    strong:[
        {
            id:"ingrid",
            reason:"強い通常技と高い差し返し能力で地上戦を制しやすい"
        },
        {
            id:"juri",
            reason:"遅い飛び道具と通常技で主導権を握りやすい"
        },
        {
            id:"ryu",
            reason:"通常技と間合い管理のしやすさで地上戦で優位に立てる"
        }
    ],

    weak:[
        {
            id:"ken",
            reason:"攻めの圧力が高く、自分から攻めることが難しい"
        },
        {
            id:"kimberly",
            reason:"表裏択と素早い立ち回りが厄介"
        },
        {
            id:"cviper",
            reason:"高火力・高機動力で読み合いを強いられる"
        }
    ]
},

    // ======================
    // 関連情報
    // ======================
    related: {

        characters: [
            "juri",
            "cammy",
            "guile"
        ],

        players: {
            pros:["moke","seiya","go1"],
            streamers: ["haitani"],
            vtubers: ["なし"],youtubers:[]}
    },
    // ======================
    // コンボ動画
    // ======================
    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/chunli_beginner.jpg",
                url: "https://www.youtube.com/watch?v=o9dFaxAKlBw"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/chunli_intermediate.jpg",
                url: "https://youtu.be/8xrFLJgrjLs?si=PR92tTmfdrLxjZ93"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E6%98%A5%E9%BA%97%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=%E6%98%A5%E9%BA%97%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    }

},

guile:{
    id:"guile",
    name:"ガイル",
    image:"assets/images/characters/guile.jpg",
    release: "初期",
    type: "ディフェンス型",
    difficulty:4,
    hp:10000,
    combo:5,
    power:3,
    speed:2,
    defense:5,
    reach:4,
    beginner:3,
    rush:2,
    projectile:true,
    invincible:true,
    antiAir:3,
    commandGrab:false,
    stats:{

        power:3,
        speed:2,
        defense:5,
        reach:4,
        beginner:3
    },
playstyle:"シューティング",
range:"遠距離",
concept:
"飛び道具と対空技で相手の行動を制限し、自分のペースで試合を組み立てるキャラクター。",

strengths:[
    "飛び道具が非常に強力",
    "対空性能が高い",
    "守りながら戦う能力に優れる"
],

weaknesses:[
    "攻め込まれると苦しくなりやすい",
    "溜め入力に慣れが必要",
    "機動力は控えめ"
],

recommend:[
    "落ち着いて戦いたい人",
    "守りを重視する人",
    "飛び道具主体で戦いたい人"
],
    matchups:{
    strong:[
        {
            id:"zangief",
            reason:"ソニックブームで近距離戦を拒否しやすい"
        },
        {
            id:"manon",
            reason:"コマンド投げの間合いに近づかせにくい"
        },
        {
            id:"marisa",
            reason:"飛び道具主体で得意距離を維持できる"
        }
    ],

    weak:[
        {
            id:"dhalsim",
            reason:"長いリーチとワープ、多様な飛び道具で崩されやすい"
        },
        {
            id:"jp",
            reason:"遠距離戦で飛び道具をつぶされやすい"
        },
        {
            id:"jp",
            reason:"遠距離戦になるとソニックブームだけでは対抗できず押し切れない"
        }
    ]
},

    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/guile_beginner.jpg",
                url: "https://youtu.be/Ro3xFARS76g?si=2-GyjtHwG9geGUTU"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/guile_intermediate.jpg",
                url: "https://youtu.be/5zAnJbKyHW0?si=RaPMrUXp6yIoeGGL"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%82%AC%E3%82%A4%E3%83%AB%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%82%AC%E3%82%A4%E3%83%AB%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    },

    related:{
        characters:[
            "deejay",
            "luke"
        ],
        players:{
            pros:["higuchi",],
            streamers:["donpisha",],
            vtubers:["onotora",],youtubers:[]}
    }
},

ken: {
    // ======================
    // 基本情報
    // ======================
    id: "ken",
    name: "ケン",
    image: "assets/images/characters/ken.png",
    release: "初期",
    type: "バランス型",
    difficulty: 2,
    hp:10000,
    combo:3,
    power: 2,
    speed: 4,
    defense: 3,
    reach: 3,
    beginner: 4,
    rush:5,
    projectile:true,
    invincible:true,
    antiAir:4,
    commandGrab:false,

    // ======================
    // ステータス
    // ======================
    stats: {
        power: 2,
        speed: 4,
        defense: 3,
        reach: 3,
        beginner: 4
    },

    // ======================
    // キャラクター情報
    // ======================
    playstyle:"ラッシュ",
    range:"近〜中距離",
    concept:"素早い接近とラッシュで相手を画面端まで追い詰め、攻めを継続してプレッシャーをかけるキャラクター",
    strengths:[
    "画面端へ運ぶ能力が高い",
    "ラッシュを絡めた攻めが非常に強力",
    "通常技が優秀で攻めを継続しやすい"
],

weaknesses:[
    "コンボ習得の難易度がやや高い",
    "飛び道具戦は得意ではない",
    "守りでは読み合いが必要"
],

recommend:[
    "攻め続けるプレイが好きな人",
    "スピード感のある試合を楽しみたい人",
    "主人公キャラクターを使いたい人"
],

    matchups:{
    strong:[
        {
            id:"elena",
            reason:"ラッシュで懐に入りやすく画面端に追い詰めやすい"
        },
        {
            id:"dhalsim",
            reason:"素早く接近でき遠距離戦を拒否しやすい"
        },
        {
            id:"lily",
            reason:"ラッシュで接近戦に持ち込み固められる"
        }
    ],

    weak:[
        {
            id:"luke",
            reason:"通常技のリーチと火力で競り負けやすい"
        },
        {
            id:"sagat",
            reason:"リーチ差と火力差で押し切られてしまう"
        },
        {
            id:"guile",
            reason:"ソニックブーム主体の展開を崩しにくい"
        }
    ]
},

    // ======================
    // 関連情報
    // ======================
    related: {

        characters: [
            "ryu",
            "gouki",
            "luke"
        ],
        players: {
            pros: [
                "tokido",
                "orarin",
                "ryukichi"
            ],
            streamers: [
                "なし"
            ],
            vtubers: [
               "なし"
            ],youtubers:[]}
    },
    // ======================
    // コンボ動画
    // ======================
    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/ken_beginner.jpg",
                url: "https://youtu.be/q6curP-XhbQ?si=aMkiIx14NunCkulB"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/ken_intermediate.jpg",
                url: "https://youtu.be/XiXDk52Advg?si=R3V4v1jIdHuvMFAP"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%82%B1%E3%83%B3%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%82%B1%E3%83%B3%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    }
},

jamie:{
    id:"jamie",
    name:"ジェイミー",
    image:"assets/images/characters/jamie.jpg",
    release:"初期",
    type:"テクニカル型",
    difficulty:3,
    hp:10000,
    combo:3,
    power:3,
    speed:4,
    defense:3,
    reach:4,
    beginner:2,
    rush:4,
    projectile:false,
    invincible:true,
    antiAir:2,
    commandGrab:true,

    stats:{
        power:3,
        speed:4,
        defense:3,
        reach:4,
        beginner:2
    },
playstyle:"セットプレイ",
range:"近距離",
concept:
"飲酒で性能を強化しながら戦い、試合の流れに応じて戦い方が変化する成長型キャラクター。",

strengths:[
    "飲酒レベルで性能が大きく向上する",
    "攻めの選択肢が豊富",
    "状況に応じた柔軟な立ち回りができる"
],

weaknesses:[
    "序盤は性能が控えめ",
    "飲酒管理が重要",
    "性能を引き出すには練習が必要"
],

recommend:[
    "成長要素のあるキャラが好きな人",
    "状況判断を楽しみたい人",
    "使い込むほど強くなるキャラを使いたい人"
],

   matchups:{
    strong:[
        {
            id:"zangief",
            reason:"機動力を活かして間合い管理しやすい"
        },
        {
            id:"marisa",
            reason:"突進技や空中機動変化技を使用して薬湯レベルを上げやすく戦いやすい"
        },
        {
            id:"deejay",
            reason:"弾抜け技と突進技で地上戦の主導権を握りやすい"
        }
    ],

    weak:[
        {
            id:"guile",
            reason:"飛び道具で薬湯レベルを上げにくい"
        },
        {
            id:"jp",
            reason:"飛び道具で薬湯レベルを上げにくい"
        },
        {
            id:"mai",
            reason:"通常技と飛び道具で固められると近づきにくい"
        }
    ]
},
    related:{
        characters:["chunli","juri","kimberly"],
        players:{
            pros:["tantanmen","johntakeuchi","uryo"],
            streamers:["naruo",],
            vtubers:["kaminariqpi"],youtubers:[]}
    },
    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/jamie_beginner.jpg",
                url: "https://youtu.be/_o-JqpS05Og?si=2Upo8ipE3UsRmdNP"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/jamie_intermediate.jpg",
                url: "https://youtu.be/pT19eZztV8E?si=-dYoTGM7buib6Koz"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%82%B8%E3%82%A7%E3%82%A4%E3%83%9F%E3%83%BC%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%82%B8%E3%82%A7%E3%82%A4%E3%83%9F%E3%83%BC%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    }
},

kimberly:{
    id:"kimberly",
    name:"キンバリー",
    image:"assets/images/characters/kimberly.jpg",
    release:"初期",
    type:"スピード型",
    difficulty:4,
    hp:10000,
    combo:3,
    power:3,
    speed:5,
    defense:2,
    reach:2,
    beginner:2,
    rush:4,
    projectile:false,
    invincible:false,
    antiAir:4,
    commandGrab:false,

    stats:{
        power:3,
        speed:5,
        defense:2,
        reach:2,
        beginner:2
    },
    playstyle:"トリッキー",
range:"近距離",
concept:
"素早い移動と奇襲を活かし、相手を翻弄しながら一気に攻め込むキャラクター。",

strengths:[
    "奇襲性能が高い",
    "機動力が非常に高い",
    "攻めのバリエーションが豊富"
],

weaknesses:[
    "守りがやや不安定",
    "火力はやや控えめ",
    "攻めが読まれると苦しくなる"
],

recommend:[
    "相手を翻弄する戦いが好きな人",
    "スピード感のあるキャラを使いたい人",
    "トリッキーな動きを楽しみたい人"
],
    matchups:{
    strong:[
        {
            id:"jp",
            reason:"高い機動力で飛び道具をかいくぐり接近しやすい"
        },
        {
            id:"dhalsim",
            reason:"テレポートや設置を許さず一気に距離を詰められる"
        },
        {
            id:"guile",
            reason:"飛び道具を読んで攻め込む展開を作りやすい"
        }
    ],

    weak:[
        {
            id:"ken",
            reason:"切り返し性能が高く攻めを継続しにくい"
        },
        {
            id:"cammy",
            reason:"地上戦・機動力ともに競り負けやすい"
        },
        {
            id:"juri",
            reason:"通常技と対空性能が高く飛び込みづらい"
        }
    ]
},
    related:{
        characters:["jamie","cammy","juri"],
        players:{
            pros:["tako","pipokun"],
            streamers:["suzukinoriaki"],
            vtubers:["なし"],youtubers:[]}
    },

    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/kimberly_beginner.jpg",
                url: "https://youtu.be/SQ-0zRY2IDM?si=7qx1CBewWM2nhaY2"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/kimberly_intermediate.jpg",
                url: "https://youtu.be/oPyOxA7ghuU?si=DPv8zy1-MvS7Gq6g"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%82%AD%E3%83%B3%E3%83%90%E3%83%AA%E3%83%BC%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%82%AD%E3%83%B3%E3%83%90%E3%83%AA%E3%83%BC%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    }
},
marisa:{
    id:"marisa",
    name:"マリーザ",
    image:"assets/images/characters/marisa.jpg",
    release:"初期",
    type:"パワー型",
    difficulty:1,
    hp:10500,
    combo:1,
    power:5,
    speed:2,
    defense:4,
    reach:4,
    beginner:5,
    rush:2,
    projectile:false,
    invincible:false,
    antiAir:2,
    commandGrab:true,

    stats:{
        power:5,
        speed:2,
        defense:4,
        reach:4,
        beginner:5
    },
playstyle:"パワー",
range:"近距離",
concept:
"圧倒的な火力とアーマー技を活かし、一撃の重さで相手を制圧するキャラクター。",

strengths:[
    "全キャラクター屈指の火力",
    "アーマー技で攻めを押し通しやすい",
    "コンボ火力が非常に高い"
],

weaknesses:[
    "機動力は低め",
    "細かい差し合いは苦手",
    "飛び道具への対応に工夫が必要"
],

recommend:[
    "高火力キャラが好きな人",
    "豪快な攻めを楽しみたい人",
    "一発逆転を狙いたい人"
],

    matchups:{
    strong:[
        {
            id:"ehonda",
            reason:"高火力で読み合いを制しやすい"
        },
        {
            id:"manon",
            reason:"火力差を押し付けやすい"
        },
        {
            id:"zangief",
            reason:"一度触れば大ダメージを狙いやすい"
        }
    ],

    weak:[
        {
            id:"chunli",
            reason:"機動力と通常技で差し合い負けしやすい"
        },
        {
            id:"cammy",
            reason:"素早い攻めに対応しづらい"
        },
        {
            id:"jp",
            reason:"遠距離戦で近付くのが難しい"
        }
    ]
},

    related:{
        characters:[
            "zangief",
            "manon",
            "honda"
        ],
        players:{
            pros:["itabashizangief",],
            streamers:["なし"],
            vtubers:["なし"],youtubers:[]}
    },
    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/marisa_beginner.jpg",
                url: "https://youtu.be/4XL42eXFjt0?si=0rwF8pBeBk2g9nT0"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/marisa_intermediate.jpg",
                url: "https://youtu.be/AqixhPs1Kfs?si=2WH_pXBsRcwYSCVd"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%83%9E%E3%83%AA%E3%83%BC%E3%82%B6%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%83%9E%E3%83%AA%E3%83%BC%E3%82%B6%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    }
},
manon:{
    id:"manon",
    name:"マノン",
    image:"assets/images/characters/manon.jpg",
    release:"初期",
    type:"グラップラー",
    difficulty:3,
    hp:10000,
    combo:3,
    power:4,
    speed:2,
    defense:3,
    reach:3,
    beginner:2,
    rush:2,
    projectile:false,
    invincible:false,
    antiAir:2,
    commandGrab:true,

    stats:{power:4,speed:2,defense:3,reach:3,beginner:2},

    playstyle:"グラップラー",
range:"近距離",
concept:
"メダルレベルを上げながら試合を有利に進め、強力な投げで勝負を決めるキャラクター。",

strengths:[
    "投げのリターンが非常に高い",
    "メダルが増えるほど脅威になる",
    "通常技のリーチが長い"
],

weaknesses:[
    "投げが通らないと苦しい",
    "機動力は控えめ",
    "序盤は火力が伸びにくい"
],

recommend:[
    "投げキャラが好きな人",
    "読み合いを楽しみたい人",
    "一発のリターンを重視する人"
],

    matchups:{
    strong:[
        {
            id:"ehonda",
            reason:"通常技で牽制しながらメダルを溜めやすい"
        },
        {
            id:"marisa",
            reason:"投げの読み合いに持ち込みやすい"
        },
        {
            id:"zangief",
            reason:"リーチを活かして近距離戦を拒否しやすい"
        }
    ],

    weak:[
        {
            id:"bison",
            reason:"攻めを継続されると切り返しが難しい"
        },
        {
            id:"gouki",
            reason:"飛び道具と高火力で試合を支配されやすい"
        },
        {
            id:"jp",
            reason:"遠距離戦を強いられ接近しづらい"
        }
    ]
},

    related:{
        characters:[
            "marisa",
            "zangief",
            "lily"
        ],
        players:{
            pros:["akutagawa","tachikawa","imaishouta"],
            streamers:["shaka",],
            vtubers:["saikiittetsu"],youtubers:[]}
    },

    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/manon_beginner.jpg",
                url: "https://youtu.be/5F_S1T65YaU?si=I7JFNH-b6QMngZz5"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/manon_intermediate.jpg",
                url: "https://youtu.be/DZAFY6qnQmE?si=w1BtFRVktOPe9QoJ"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%83%9E%E3%83%8E%E3%83%B3%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%83%9E%E3%83%8E%E3%83%B3%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    }
},

zangief:{
    id:"zangief",
    name:"ザンギエフ",
    image:"assets/images/characters/zangief.jpg",
    release:"初期",
    type:"グラップラー",
    difficulty:3,
    hp:11000,
    combo:2,
    power:5,
    speed:1,
    defense:4,
    reach:3,
    beginner:3,
    rush:1,
    projectile:false,
    invincible:false,
    antiAir:2,
    commandGrab:true,

    stats:{
        power:5,
        speed:1,
        defense:4,
        reach:3,
        beginner:3
    },
   playstyle:"グラップラー",
range:"近距離",
concept:
"強力なコマンド投げを軸に、圧倒的な接近戦で相手を追い詰めるキャラクター。",

strengths:[
    "コマンド投げの破壊力が非常に高い",
    "体力が高く打たれ強い",
    "接近戦で圧倒的なプレッシャーを与えられる"
],

weaknesses:[
    "機動力が低い",
    "飛び道具への対応が難しい",
    "接近するまでが苦労しやすい"
],

recommend:[
    "投げキャラが好きな人",
    "読み合いで勝負したい人",
    "一撃の重さを楽しみたい人"
],

    matchups:{
    strong:[
        {
            id:"lily",
            reason:"リーチと火力で読み合いを有利に進めやすい"
        },
        {
            id:"rashid",
            reason:"接近戦に持ち込めれば高火力を押し付けられる"
        },
        {
            id:"bison",
            reason:"一度捕まえれば起き攻めを拒否しやすい"
        }
    ],

    weak:[
        {
            id:"ryu",
            reason:"飛び道具と牽制で接近を止められやすい"
        },
        {
            id:"jp",
            reason:"設置技と飛び道具で近付くのが難しい"
        },
        {
            id:"aki",
            reason:"毒と長い牽制でペースを握られやすい"
        }
    ]
},

    related:{
        characters:[
            "marisa",
            "manon",
            "honda"
        ],
        players:{
            pros:["itabashizangief","kobayan","junior"],
            streamers:["なし"],
            vtubers:["tensihn",],youtubers:[]}
    },

    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/zangief_beginner.jpg",
                url: "https://youtu.be/eGQrk7VXskE?si=ASSxFn71X3CogH6X"
            }
        ],

        intermediate: [
            {
                type: "search",
                title: "中級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%82%B6%E3%83%B3%E3%82%AE%E3%82%A8%E3%83%95%20%E4%B8%AD%E7%B4%9A%E8%80%85%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%82%B6%E3%83%B3%E3%82%AE%E3%82%A8%E3%83%95%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%82%B6%E3%83%B3%E3%82%AE%E3%82%A8%E3%83%95%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    }
},

jp:{
    id:"jp",
    name:"JP",
    image:"assets/images/characters/jp.jpg",
    release:"初期",
    type:"シューティング型",
    difficulty:5,
    hp:10000,
    combo:4,
    power:4,
    speed:2,
    defense:3,
    reach:5,
    beginner:1,
    rush:2,
    projectile:true,
    invincible:true,
    antiAir:2,
    commandGrab:true,

    stats:{
        power:4,
        speed:2,
        defense:3,
        reach:5,
        beginner:1
    },
    playstyle:"シューティング",
range:"遠距離",
concept:
"飛び道具と設置技を駆使し、相手を近づけさせずに主導権を握るキャラクター。",

strengths:[
    "遠距離戦が非常に強力",
    "設置技で相手を制限できる",
    "どの距離でも相手を動かしやすい"
],

weaknesses:[
    "近距離では守りが難しい",
    "技の使い分けが重要",
    "扱いには練習が必要"
],

recommend:[
    "遠距離戦が好きな人",
    "戦略的に戦いたい人",
    "相手をコントロールする戦い方が好きな人"
],

    matchups:{
    strong:[
        {
            id:"zangief",
            reason:"飛び道具と設置技で接近を封じやすい"
        },
        {
            id:"ryu",
            reason:"遠距離戦で主導権を握りやすい"
        },
        {
            id:"manon",
            reason:"投げ間合いに入らせず試合を進めやすい"
        }
    ],

    weak:[
        {
            id:"aki",
            reason:"毒と機動力で遠距離戦を崩されやすい"
        },
        {
            id:"cammy",
            reason:"飛び道具をかいくぐる接近能力が高い"
        },
        {
            id:"juri",
            reason:"機動力で設置技を突破されやすい"
        }
    ]
},

    related:{
        characters:[
            "dhalsim",
            "guile",
            "aki"
        ],
        players:{
            pros:["tokido","ryusei","acqua"],
            streamers:[],
            vtubers:["kisaragiren"],youtubers:[]}
    },

    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/jp_beginner.jpg",
                url: "https://youtu.be/tDSVHrylr3k?si=oyxAcYD7GILYaE4E"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/jp_intermediate.jpg",
                url: "https://youtu.be/nyFNgnzjV3M?si=MSeIVE-2KSFMLFAv"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=JP%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=JP%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    }
},
deejay:{
    id:"deejay",
    name:"ディージェイ",
    image:"assets/images/characters/deejay.jpg",
    release:"初期",
    type:"テクニカル型",
    difficulty:3,
    hp:10000,
    combo:4,
     power:3,
    speed:5,
    defense:4,
    reach:4,
    beginner:3,
    rush:5,
    projectile:true,
    invincible:true,
    antiAir:3,
    commandGrab:false,

    stats:{
        power:3,
        speed:5,
        defense:4,
        reach:4,
        beginner:3
    },
playstyle:"トリッキー",
range:"中距離",
concept:
"緩急のある動きと多彩な技を使い分け、相手を惑わせながら攻めるキャラクター。",

strengths:[
    "攻めのバリエーションが豊富",
    "飛び道具と突進技を使い分けられる",
    "相手を翻弄しやすい"
],

weaknesses:[
    "扱いには慣れが必要",
    "安定した火力を出すには練習が必要",
    "読み負けると苦しくなりやすい"
],

recommend:[
    "自由度の高いキャラが好きな人",
    "相手を惑わせる戦い方をしたい人",
    "多彩な技を使いこなしたい人"
],
    matchups:{
    strong:[
        {
            id:"dhalsim",
            reason:"機動力を活かして遠距離戦を崩しやすい"
        },
        {
            id:"jp",
            reason:"飛び道具をかいくぐって接近しやすい"
        },
        {
            id:"ehonda",
            reason:"通常技と飛び道具で頭突きを止めやすい"
        }
    ],

    weak:[
        {
            id:"cammy",
            reason:"一度近付かれると守りが苦しくなりやすい"
        },
        {
            id:"juri",
            reason:"差し返し性能が高く主導権を握られやすい"
        },
        {
            id:"luke",
            reason:"通常技の強さで地上戦を支配されやすい"
        }
    ]
},

    related:{
        characters:[
            "guile",
            "jamie",
            "kimberly"
        ],
        players:{
            pros:["zabuton",],
            streamers:["takera","ohsuakira","k4sen"],
            vtubers:["なし"],youtubers:[]}
    },

    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/deejay_beginner.jpg",
                url: "https://youtu.be/j6K0a1FZQlQ?si=DbNHCtk7nv6Riq2r"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/deejay_intermediate.jpg",
                url: "https://youtu.be/zS4Pm-9yCxc?si=KgBE0QTgjbIrXzpP"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%83%87%E3%82%A3%E3%83%BC%E3%82%B8%E3%82%A7%E3%82%A4%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%83%87%E3%82%A3%E3%83%BC%E3%82%B8%E3%82%A7%E3%82%A4%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    }
},

cammy:{
    id:"cammy",
    name:"キャミィ",
    image:"assets/images/characters/cammy.jpg",
    release: "初期",
    type:"スピード型",
    difficulty:2,
    hp:10000,
    combo:2,
    power:2,
    speed:5,
    defense:3,
    reach:2,
    beginner:3,
    rush:5,
    projectile:false,
    invincible:true,
    antiAir:5,
    commandGrab:true,
    
    stats:{
        power:2,
        speed:5,
        defense:3,
        reach:2,
        beginner:3
    },
playstyle:"ラッシュ",
range:"近距離",
concept:
"素早い接近能力を活かし、一気に距離を詰めて攻め続ける近距離戦が得意なキャラクター。",

strengths:[
    "接近能力が非常に高い",
    "ラッシュとの相性が良い",
    "画面端での攻めが強力"
],

weaknesses:[
    "飛び道具を持たない",
    "遠距離戦は苦手",
    "相手に近づく工夫が必要"
],

recommend:[
    "近距離戦が好きな人",
    "攻め続けるスタイルが好きな人",
    "スピード感を楽しみたい人"
],

    matchups:{
    strong:[
        {
            id:"guile",
            reason:"高い接近能力で飛び道具を突破しやすい"
        },
        {
            id:"jp",
            reason:"遠距離戦を許さず一気に距離を詰められる"
        },
        {
            id:"dhalsim",
            reason:"長距離戦を拒否して攻めを継続しやすい"
        }
    ],

    weak:[
        {
            id:"zangief",
            reason:"一度捕まると大ダメージを受けやすい"
        },
        {
            id:"chunli",
            reason:"通常技の差し返し性能で競り負けやすい"
        },
        {
            id:"juri",
            reason:"地上戦で主導権を握られやすい"
        }
    ]
},
    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/cammy_beginner.jpg",
                url: "https://youtu.be/tqFsYQ_zcAg?si=0rxf24C5jMBmCqhe"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/cammy_intermediate.jpg",
                url: "https://youtu.be/x8ZSMq0ogww?si=BASrEuZW9quo-2bK"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%82%AD%E3%83%A3%E3%83%9F%E3%82%A3%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%82%AD%E3%83%A3%E3%83%9F%E3%82%A3%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    },
    related:{
        characters:[
            "juri",
            "chunli",
            "kimberly"
        ],
        players:{
            pros:["kazunoko","akira","twobassa"],
            streamers:["なし"],
            vtubers:["sorahoshikirame","uchiwa"],youtubers:[]}
    }
},

lily:{
    id:"lily",
    name:"リリー",
    image:"assets/images/characters/lily.jpg",
    release:"初期",
    type:"グラップラー",
    difficulty:2,
    hp:10000,
    combo:2,
    power:3,
    speed:3,
    defense:3,
    reach:2,
    beginner:4,
    rush:3,
    projectile:false,
    invincible:true,
    antiAir:3,
    commandGrab:true,

    stats:{
        power:3,
        speed:3,
        defense:3,
        reach:2,
        beginner:4
    },
playstyle:"ヒット＆アウェイ",
range:"近距離",
concept:
"機動力と風の力を活かし、一瞬のチャンスから攻め込むキャラクター。",

strengths:[
    "機動力が高い",
    "風ストックによる強力な攻め",
    "接近戦で一気に流れを掴める"
],

weaknesses:[
    "風ストックが無いと性能が落ちる",
    "通常技のリーチは短め",
    "火力はやや控えめ"
],

recommend:[
    "素早く動くキャラが好きな人",
    "強化要素を活かしたい人",
    "攻守の切り替えを楽しみたい人"
],

    matchups:{
    strong:[
        {
            id:"ehonda",
            reason:"風ストックから一気に攻めを押し付けやすい"
        },
        {
            id:"manon",
            reason:"機動力で投げ間合いを外しやすい"
        },
        {
            id:"marisa",
            reason:"先に動いて攻めを継続しやすい"
        }
    ],

    weak:[
        {
            id:"zangief",
            reason:"火力差と読み合いで押し負けやすい"
        },
        {
            id:"rashid",
            reason:"機動力が高く風ストックを使いづらい"
        },
        {
            id:"guile",
            reason:"飛び道具で近付くまでが苦しい"
        }
    ]
},

    related:{
        characters:[
            "manon",
            "cammy",
            "zangief"
        ],
        players:{
            pros:["hibiki"],
            streamers:["なし"],
            vtubers:["なし"],youtubers:[]}
    },

    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/lily_beginner.jpg",
                url: "https://youtu.be/f67FJ4G7Dso?si=kyZCZd7pejSBCfL3"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/lily_intermediate.jpg",
                url: "https://youtu.be/ZAkXuZqiWYE?si=bxmCOEuVURICRm9o"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%83%AA%E3%83%AA%E3%83%BC%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%83%AA%E3%83%AA%E3%83%BC%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    }
},
juri:{

    id:"juri",
    name:"ジュリ",
    image:"assets/images/characters/juri.jpg",
    release: "初期",
    type:"スピード型",
    difficulty:3,
    hp:10000,
    combo:3,
    power:3,
    speed:5,
    defense:2,
    reach:3,
    beginner:2,
    rush:5,
    projectile:true,
    invincible:true,
    antiAir:5,
    commandGrab:false,

    stats:{
        power:3,
        speed:5,
        defense:2,
        reach:3,
        beginner:2
    },

    playstyle:"トリッキー",
range:"近〜中距離",
concept:
"素早い動きと豊富な崩しを活かし、相手を翻弄しながら攻め続けるキャラクター。",

strengths:[
    "崩し性能が高い",
    "機動力に優れる",
    "攻めの選択肢が豊富"
],

weaknesses:[
    "操作難易度が高い",
    "コンボの練習が必要",
    "守りでは読み合いが求められる"
],

recommend:[
    "相手を翻弄するのが好きな人",
    "スピード感ある攻めが好きな人",
    "やり込みがいのあるキャラを使いたい人"
],
    matchups:{
    strong:[
        {
            id:"ehonda",
            reason:"頭突きや百貫を咎めやすく主導権を握りやすい"
        },
        {
            id:"zangief",
            reason:"機動力を活かして投げ間合いを維持しやすい"
        },
        {
            id:"marisa",
            reason:"差し返し性能が高く大技を狙わせにくい"
        }
    ],

    weak:[
        {
            id:"luke",
            reason:"通常技と飛び道具の性能で押し返されやすい"
        },
        {
            id:"guile",
            reason:"飛び道具主体の展開を崩しにくい"
        },
        {
            id:"rashid",
            reason:"攻めを継続されると守りに回りやすい"
        }
    ]
},
    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/juri_beginner.jpg",
                url: "https://youtu.be/ZQourqvHEvM?si=HpRTfIsKmVjRBPuo"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/juri_intermediate.jpg",
                url: "https://youtu.be/34Ai7CwyYXk?si=87YX_0po-lcCzHS1"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%82%B8%E3%83%A5%E3%83%AA%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%82%B8%E3%83%A5%E3%83%AA%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    },
    related:{
        characters:[
            "cammy",
            "chunli",
            "aki"
        ],
        players:{
            pros:["mago","twobassa","pugera"],
            streamers:["betty"],
            vtubers:["ibrahim","amakipururu"],youtubers:[]}
    }
},

blanka:{
    id:"blanka",
    name:"ブランカ",
    image:"assets/images/characters/blanka.jpg",
    release:"初期",
    type:"テクニカル型",
    difficulty:4,
    hp:10000,
    combo:4,
    power:4,
    speed:4,
    defense:4,
    reach:3,
    beginner:3,
    rush:4,
    projectile:false,
    invincible:true,
    antiAir:3,
    commandGrab:true,

    stats:{
        power:4,
        speed:4,
        defense:4,
        reach:3,
        beginner:3
    },
playstyle:"トリッキー",
range:"近距離",
concept:
"予測しづらい動きと奇襲を活かし、相手を翻弄しながら試合の流れを掴むキャラクター。",

strengths:[
    "奇襲性能が非常に高い",
    "相手を翻弄しやすい",
    "攻めの選択肢が豊富"
],

weaknesses:[
    "動きを読まれると苦しくなる",
    "通常技のリーチは短め",
    "守りでは我慢が必要"
],

recommend:[
    "相手を驚かせる戦い方が好きな人",
    "読み合いを楽しみたい人",
    "個性的なキャラを使いたい人"
],

    matchups:{
    strong:[
        {
            id:"cammy",
            reason:"変則的な動きでペースを握りやすい"
        },
        {
            id:"aki",
            reason:"機動力を生かして立ち回りやすい"
        },
        {
            id:"deejay",
            reason:"突進と紀州でリズムを崩しやすい"
        }
    ],

    weak:[
        {
            id:"gouki",
            reason:"通常技と飛び道具が強く、変則的な攻めを通しにくい"
        },
        {
            id:"ed",
            reason:"中距離戦を制されて、得意な動きを封じられやすい"
        },
        {
            id:"terry",
            reason:"リーチと火力で差し合いを有利に進められてしまう"
        }
    ]
},

    related:{
        characters:[
            "honda",
            "kimberly",
            "c.viper"
        ],
        players:{
            pros:["acqua","takagi","menard"],
            streamers:["なし"],
            vtubers:["murakumokagetsu"],youtubers:[]}
    },

    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/blanka_beginner.jpg",
                url: "https://youtu.be/tVSycSSb9yQ?si=aUU-L3DueRsrLhir"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/blanka_intermediate.jpg",
                url: "https://youtu.be/kGV87ZrYEoI?si=_Vw-JTazXIyoBWT7"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%83%96%E3%83%A9%E3%83%B3%E3%82%AB%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%83%96%E3%83%A9%E3%83%B3%E3%82%AB%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    }
},
ehonda:{
    id:"ehonda",
    name:"本田",
    image:"assets/images/characters/ehonda.jpg",
    release:"初期",
    type:"パワー型",
    difficulty:2,
    hp:10500,
    combo:2,
    power:5,
    speed:3,
    defense:5,
    reach:3,
    beginner:4,
    rush:2,
    projectile:false,
    invincible:false,
    antiAir:2,
    commandGrab:true,

    stats:{
        power:5,
        speed:3,
        defense:5,
        reach:3,
        beginner:4
    },
playstyle:"パワー",
range:"近距離",
concept:
"力強い突進技と高い耐久力を武器に、相手を押し切る接近戦が得意なキャラクター。",

strengths:[
    "突進技による圧力が強い",
    "高い体力で粘り強く戦える",
    "シンプルで扱いやすい"
],

weaknesses:[
    "攻めが単調になりやすい",
    "飛び道具への対応が課題",
    "機動力は控えめ"
],

recommend:[
    "豪快な攻めが好きな人",
    "シンプルなキャラを使いたい人",
    "初心者でも勝ちやすいキャラを探している人"
],
    matchups:{
    strong:[
        {
            id:"ken",
            reason:"頭突きと百貫で攻めを押し付けやすい"
        },
        {
            id:"jamie",
            reason:"酒を飲む隙を与えず攻めを継続しやすい"
        },
        {
            id:"cammy",
            reason:"高火力の読み合いに持ち込みやすい"
        }
    ],

    weak:[
        {
            id:"gouki",
            reason:"飛び道具と機動力で近付きにくい"
        },
        {
            id:"guile",
            reason:"ソニックブームで接近を制限されやすい"
        },
        {
            id:"chunli",
            reason:"通常技のリーチで頭突きを対処されやすい"
        }
    ]
},

    related:{
        characters:[
            "zangief",
            "marisa",
            "manon"
        ],
        players:{
            pros:["なし"],
            streamers:[],
            vtubers:[],youtubers:[]}
    },

    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/ehonda_beginner.jpg",
                url: "https://youtu.be/SgBhgRoufXk?si=GqRbx824Aykiffvv"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/ehonda_intermediate.jpg",
                url: "https://youtu.be/GaPEjq8syWk?si=lQy_Q0lIPZ8rtTZj"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E6%9C%AC%E7%94%B0%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=%E6%9C%AC%E7%94%B0%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    }
},

dhalsim:{
    id:"dhalsim",
    name:"ダルシム",
    image:"assets/images/characters/dhalsim.jpg",
    release:"初期",
    type:"シューティング型",
    difficulty:5,
    hp:10000,
    combo:3,
    power:3,
    speed:1,
    defense:4,
    reach:5,
    beginner:1,
    rush:1,
    projectile:true,
    invincible:false,
    antiAir:3,
    commandGrab:false,

    stats:{
        power:3,
        speed:1,
        defense:4,
        reach:5,
        beginner:1
    },
playstyle:"シューティング",
range:"遠距離",
concept:
"圧倒的なリーチと多彩な飛び道具を活かし、相手を寄せ付けずに戦う遠距離戦が得意なキャラクター。",

strengths:[
    "通常技のリーチが非常に長い",
    "遠距離戦で高い制圧力を持つ",
    "相手の動きを制限しやすい"
],

weaknesses:[
    "接近戦は苦手",
    "守りには高い判断力が必要",
    "扱いには慣れが必要"
],

recommend:[
    "遠距離戦が好きな人",
    "相手をコントロールして戦いたい人",
    "個性的なキャラを使いたい人"
],
    matchups:{
    strong:[
        {
            id:"lily",
            reason:"長いリーチと飛び道具で接近を許しにくい"
        },
        {
            id:"ryu",
            reason:"長いリーチと飛び道具で遠距離戦の主導権を握りやすい"
        },
        {
            id:"zangief",
            reason:"長いリーチと飛び道具で接近させずに戦える"
        }
    ],

    weak:[
        {
            id:"bison",
            reason:"早いラッシュと展開で間合いを詰められやすい"
        },
        {
            id:"cammy",
            reason:"素早い立ち回りで得意な距離を維持しにくい"
        },
        {
            id:"kimberly",
            reason:"高い機動力で崩られやすい"
        }
    ]
},

    related:{
        characters:[
            "jp",
            "guile",
            "aki"
        ],
        players:{
            pros:["yhcmochi","torimeshi",],
            streamers:["なし"],
            vtubers:["kibakibaru","hoshino"],youtubers:[]}
    },

    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/dhalsim_beginner.jpg",
                url: "https://youtu.be/JAx6qRSq4gQ?si=9biA2Wcpov2AIh78"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/dhalsim_intermediate.jpg",
                url: "https://youtu.be/VPKlmKW-nlg?si=GpFdaSZVQbgCrmwZ"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    }
},
rashid: {

    // ======================
    // 基本情報
    // ======================
    id: "rashid",
    name: "ラシード",
    image: "assets/images/characters/rashid.png",
    release: "Year1",
    type: "スピード型",
    difficulty: 4,
    hp:10000,
    combo:4,
    power: 3,
    speed: 5,
    defense: 3,
    reach: 2,
    beginner: 2,
    rush:5,
    projectile:true,
    invincible:true,
    antiAir:3,
    commandGrab:false,

    // ======================
    // ステータス
    // ======================
    stats: {
        power: 3,
        speed: 5,
        defense: 3,
        reach: 2,
        beginner: 2
    },

    // ======================
    // キャラクター情報
    // ======================
    playstyle:"ヒット＆アウェイ",
range:"近〜中距離",
concept:
"素早い移動と高い機動力を活かし、相手を翻弄しながら主導権を握るキャラクター。",

strengths:[
    "全キャラクターでもトップクラスの機動力",
    "画面を広く使った攻めができる",
    "相手を翻弄しやすい"
],

weaknesses:[
    "コンボ難易度が高い",
    "火力はやや控えめ",
    "立ち回りの理解が必要"
],

recommend:[
    "素早く動き回るキャラが好きな人",
    "相手を翻弄する戦い方が好きな人",
    "操作にやり込み要素を求める人"
],
    matchups:{
    strong:[
        {
            id:"dhalsim",
            reason:"高い機動力で遠距離戦を崩しやすい"
        },
        {
            id:"manon",
            reason:"攻めを継続して投げを狙わせにくい"
        },
        {
            id:"marisa",
            reason:"機動力で重い通常技をかわしやすい"
        }
    ],

    weak:[
        {
            id:"zangief",
            reason:"一度接近されると読み合いで苦しくなりやすい"
        },
        {
            id:"chunli",
            reason:"通常技で風を使った攻めを止められやすい"
        },
        {
            id:"guile",
            reason:"飛び道具主体の立ち回りを崩しにくい"
        }
    ]
},
    // ======================
    // 関連情報
    // ======================
    related: {

        characters: [
            "ken",
            "cammy",
            "juri"
        ],
        players: {
            pros: [
                "gachikun",
            ],

            streamers: [
                "なし"
            ],
            vtubers: [
                "kanae",
            ],youtubers:[]}
    },
    // ======================
    // コンボ動画
    // ======================
    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/rashid_beginner.jpg",
                url: "https://youtu.be/YgJ7S4durpE?si=H0OCLCemekqHkHaC"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/rashid_intermediate.jpg",
                url: "https://youtu.be/Cvo3ecRx9M4?si=3Hae0fghB14BFKZ4"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%83%A9%E3%82%B7%E3%83%BC%E3%83%89%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%83%A9%E3%82%B7%E3%83%BC%E3%83%89%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    }

},

aki:{
    id:"aki",
    name:"A.K.I.",
    image:"assets/images/characters/aki.jpg",
    release:"Year1",
    type:"テクニカル型",
    difficulty:4,
    hp:10000,
    combo:3,
    power:3,
    speed:3,
    defense:3,
    reach:4,
    beginner:2,
    rush:4,
    projectile:true,
    invincible:false,
    antiAir:2,
    commandGrab:true,

    stats:{
        power:3,
        speed:3,
        defense:3,
        reach:4,
        beginner:2
    },

    playstyle:"トリッキー",
range:"中〜遠距離",
concept:
"毒を駆使した独特な攻めで相手を翻弄し、継続的にプレッシャーを与え続けるキャラクター。",

strengths:[
    "毒による継続ダメージが強力",
    "奇襲や崩しの選択肢が豊富",
    "相手を翻弄する立ち回りが得意"
],

weaknesses:[
    "守りはやや苦手",
    "操作に慣れが必要",
    "毒を活かせないと火力が伸びにくい"
],

recommend:[
    "相手を翻弄する戦い方が好きな人",
    "クセのあるキャラを使いたい人",
    "読み合いを楽しみたい人"
],

    matchups:{
    strong:[
        {
            id:"zangief",
            reason:"毒と牽制で近付かせずに試合を進めやすい"
        },
        {
            id:"ehonda",
            reason:"通常技で突進を止めながら毒を付与しやすい"
        },
        {
            id:"manon",
            reason:"リーチを活かして接近を拒否しやすい"
        }
    ],

    weak:[
        {
            id:"ken",
            reason:"攻めを継続されると毒を活かす展開を作りにくい"
        },
        {
            id:"rashid",
            reason:"機動力で牽制をかわされやすい"
        },
        {
            id:"gouki",
            reason:"飛び道具と機動力で主導権を握られやすい"
        }
    ]
},

    related:{
        characters:["jp","guile","dhalsim"],
        players:{pros:["hikaru",],streamers:[],vtubers:["yukikiriyuki"],youtubers:[]}
    },

    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/aki_beginner.jpg",
                url: "https://youtu.be/twHdRXJS1dw?si=XYjN3D1OxtAYgkOF"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/aki_intermediate.jpg",
                url: "https://youtu.be/cKOqRGwFQ64?si=j_a92-Mt-ysfdjCV"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=A.K.I.%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=A.K.I.%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    }
},
ed:{
    id:"ed",
    name:"エド",
    image:"assets/images/characters/ed.jpg",
    release:"Year1",
    type:"ディフェンス型",
    difficulty:3,
    hp:10000,
    combo:4,
    power:4,
    speed:4,
    defense:5,
    reach:4,
    beginner:2,
    rush:3,
    projectile:true,
    invincible:true,
    antiAir:2,
    commandGrab:false,

    strengths:[
        "通常技が優秀",
        "操作しやすい",
        "コンボ火力が高い"
    ],

    stats:{
        power:4,
        speed:4,
        defense:5,
        reach:4,
        beginner:2
    },

    playstyle:"差し合い",
range:"中距離",
concept:
"長いリーチと扱いやすい必殺技を活かし、中距離戦を支配して主導権を握るキャラクター。",

strengths:[
    "中距離での制圧力が高い",
    "必殺技が扱いやすい",
    "通常技の性能が優秀"
],

weaknesses:[
    "近距離で守り切るには工夫が必要",
    "コンボ火力は状況に左右される",
    "立ち回りの理解が重要"
],

recommend:[
    "差し合いが好きな人",
    "落ち着いて試合を組み立てたい人",
    "初心者から中級者まで幅広く使いたい人"
],

   matchups:{
    strong:[
        {
            id:"zangief",
            reason:"長い通常技で接近を許しにくい"
        },
        {
            id:"ehonda",
            reason:"牽制で頭突きや前進を止めやすい"
        },
        {
            id:"manon",
            reason:"投げ間合いに入らせず戦いやすい"
        }
    ],

    weak:[
        {
            id:"cammy",
            reason:"接近を許すと攻めを継続されやすい"
        },
        {
            id:"gouki",
            reason:"高い攻撃力で一気に流れを持っていかれやすい"
        },
        {
            id:"rashid",
            reason:"素早い攻めで牽制を機能させにくい"
        }
    ]
},

    related:{
        characters:["erena","deejay","dhalsim"],
        players:{pros:["fuudo","momochi","leshar","tachikawa"],streamers:[],vtubers:[],youtubers:[]}
    },

    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/ed_beginner.jpg",
                url: "https://youtu.be/138Cyy-dz24?si=Zl9vmVlMHeoacJx6"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/ed_intermediate.jpg",
                url: "https://youtu.be/aWUqRqP_gn8?si=f29I8O_jofLlVmSQ"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%82%A8%E3%83%89%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%82%A8%E3%83%89%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    }
},
gouki: {
    // ======================
    // 基本情報
    // ======================
    id: "gouki",
    name: "豪鬼",
    image: "assets/images/characters/gouki.png",
    release: "Year1",
    type: "パワー型",
    difficulty:3,
    hp:9000,
    combo:3,
    power: 5,
    speed: 4,
    defense: 2,
    reach: 4,
    beginner: 1,
    rush:5,
    projectile:true,
    invincible:true,
    antiAir:4,
    commandGrab:true,

    // ======================
    // ステータス
    // ======================
   playstyle:"ハイリスク・ハイリターン",
range:"中距離",
concept:
"高い攻撃力と豊富な攻め手を持ち、一度のチャンスで試合を決められる破壊力を持つキャラクター。",

strengths:[
    "全キャラクター屈指の火力",
    "攻めの選択肢が非常に豊富",
    "どの距離でも戦える万能性能"
],

weaknesses:[
    "体力が低くミスが許されにくい",
    "操作難易度が高い",
    "状況判断力が求められる"
],

recommend:[
    "高火力キャラが好きな人",
    "難しいキャラに挑戦したい人",
    "読み合いで勝負したい人"
],
    matchups:{
    strong:[
        {
            id:"zangief",
            reason:"飛び道具と機動力で接近を拒否しやすい"
        },
        {
            id:"ehonda",
            reason:"頭突きを誘って反撃を狙いやすい"
        },
        {
            id:"marisa",
            reason:"機動力を活かして重い攻撃をかわしやすい"
        }
    ],

    weak:[
        {
            id:"jp",
            reason:"遠距離戦で思うように攻め込めない"
        },
        {
            id:"bison",
            reason:"攻めを継続されると体力の低さが響きやすい"
        },
        {
            id:"guile",
            reason:"飛び道具主体の展開を崩しにくい"
        }
    ]
},

    // ======================
    // 関連情報
    // ======================
    related: {

        characters: [
            "ken",
            "ryu",
            "luke"
        ],

        players: {

            pros: [
                "daigo",
                "kawano",
                "bonchan"
            ],

            streamers: [
                "なし"
            ],
            vtubers: [
                "kuzuha",
                "amayuimoka"
            ],youtubers:[]}
    },

    // ======================
    // コンボ動画
    // ======================
    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/gouki_beginner.jpg",
                url: "https://youtu.be/X9CYG7oBJ9M?si=_dg1WPp30NLBRWCm"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/gouki_intermediate.jpg",
                url: "https://youtu.be/P-oE9yV1MHc?si=3facKptAGenaLlYq"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E8%B1%AA%E9%AC%BC%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=%E8%B1%AA%E9%AC%BC%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    }

},
terry:{
    id:"terry",
    name:"テリー",
    image:"assets/images/characters/terry.jpg",
    release:"Year2",
    type:"バランス型",
    difficulty:2,
    hp:10000,
    combo:4,
    power:4,
    speed:3,
    defense:3,
    reach:3,
    beginner:5,
    rush:4,
    projectile:true,
    invincible:true,
    antiAir:4,
    commandGrab:false,

    stats:{
        power:4,
        speed:3,
        defense:3,
        reach:3,
        beginner:5
    },

    playstyle:"オールラウンダー",
range:"中距離",
concept:
"飛び道具・対空・突進技をバランス良く備え、どんな状況にも柔軟に対応できるキャラクター。",

strengths:[
    "攻守のバランスが良い",
    "扱いやすい必殺技が揃っている",
    "近距離から遠距離まで戦いやすい"
],

weaknesses:[
    "突出した性能は少ない",
    "コンボ火力を伸ばすには練習が必要",
    "相手に応じた立ち回りが重要"
],

recommend:[
    "万能キャラを使いたい人",
    "格闘ゲーム初心者",
    "安定した戦い方をしたい人"
],

    matchups:{
    strong:[
        {
            id:"ehonda",
            reason:"飛び道具と通常技で接近を止めやすい"
        },
        {
            id:"zangief",
            reason:"機動力を活かして投げ間合いを維持しやすい"
        },
        {
            id:"manon",
            reason:"地上戦で主導権を握りやすい"
        }
    ],

    weak:[
        {
            id:"jp",
            reason:"遠距離戦を押し付けられると攻め込みにくい"
        },
        {
            id:"guile",
            reason:"飛び道具の撃ち合いで不利になりやすい"
        },
        {
            id:"gouki",
            reason:"攻撃性能の高さで押し切られやすい"
        }
    ]
},

    related:{
        characters:["ken","ryu","luke"],
        players:{pros:["kincho","leshar","wabiichi"],streamers:[],vtubers:[],youtubers:[]}
    },

    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/terry_beginner.jpg",
                url: "https://youtu.be/PYE_EX2kfxM?si=oX0k9BFhtwmeknlO"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/terry_intermediate.jpg",
                url: "https://youtu.be/QrjelyfpqK4?si=APWIKbVYmNYrYz39"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%83%86%E3%83%AA%E3%83%BC%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%83%86%E3%83%AA%E3%83%BC%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    }
},
mai:{
    id:"mai",
    name:"舞",
    image:"assets/images/characters/mai.jpg",
    release:"Year2",
    type:"スピード型",
    difficulty:1,
    hp:10000,
    combo:1,
    power:3,
    speed:5,
    defense:3,
    reach:4,
    beginner:5,
    rush:4,
    projectile:true,
    invincible:true,
    antiAir:4,
    commandGrab:false,

    stats:{
        power:3,
        speed:5,
        defense:3,
        reach:4,
        beginner:5
    },

    playstyle:"ラッシュ",
range:"中距離",
concept:
"高い機動力と豊富な攻めの選択肢を活かし、相手を翻弄しながら主導権を握るキャラクター。",

strengths:[
    "機動力が高い",
    "攻めのバリエーションが豊富",
    "近距離・中距離ともに戦いやすい"
],

weaknesses:[
    "守りはやや不安定",
    "コンボを安定させるには練習が必要",
    "攻めが読まれると反撃を受けやすい"
],

recommend:[
    "スピード感のあるキャラが好きな人",
    "積極的に攻めたい人",
    "華麗な立ち回りを楽しみたい人"
],

    matchups:{
    strong:[
        {
            id:"zangief",
            reason:"高い機動力で接近を拒否しやすい"
        },
        {
            id:"ehonda",
            reason:"立ち回りで頭突きを誘いやすい"
        },
        {
            id:"marisa",
            reason:"リーチを活かして一方的に触りやすい"
        }
    ],

    weak:[
        {
            id:"cammy",
            reason:"接近戦になると攻めを切り返しにくい"
        },
        {
            id:"juri",
            reason:"通常技と機動力で主導権を握られやすい"
        },
        {
            id:"ed",
            reason:"長い通常技で得意距離を維持されやすい"
        }
    ]
},

    related:{
        characters:["terry","kimberly","juri"],
        players:{pros:["mago","keib"],streamers:[],vtubers:[],youtubers:[]}
    },

    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/mai_beginner.jpg",
                url: "https://youtu.be/f78kDhtzHlY?si=ZOVEGXMMGQekJdZa"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/mai_intermediate.jpg",
                url: "https://youtu.be/pdrvZcdIZjI?si=6PLt0KPfOD1BlHnd"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E8%88%9E%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=%E8%88%9E%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    }
},
elena:{
    id:"elena",
    name:"エレナ",
    image:"assets/images/characters/elena.jpg",
    release:"Year2",
    type:"ディフェンス型",
    difficulty:3,
    hp:10000,
    combo:4,
    power:3,
    speed:3,
    defense:3,
    reach:4,
    beginner:3,
    rush:3,
    projectile:false,
    invincible:true,
    antiAir:4,
    commandGrab:false,

    stats:{
        power:3,
        speed:3,
        defense:3,
        reach:4,
        beginner:3
    },
    playstyle:"ヒット＆アウェイ",
    range:"中距離",
    concept:
    "長いリーチと高い機動力を活かし、相手を翻弄しながら有利な距離で戦うキャラクター。",
    strengths:[
    "通常技のリーチが長い",
    "機動力が高い",
    "差し合いが得意"
],
weaknesses:[
    "火力はやや控えめ",
    "守りは読み合いが重要",
    "コンボ精度が求められる"
],

recommend:[
    "差し合いが好きな人",
    "リーチを活かして戦いたい人",
    "機動力の高いキャラを使いたい人"
],

   matchups:{
    strong:[
        {
            id:"marisa",
            reason:"長いリーチで接近を許しにくい"
        },
        {
            id:"zangief",
            reason:"機動力を活かして投げ間合いを維持しやすい"
        },
        {
            id:"ehonda",
            reason:"通常技で頭突きや前進を止めやすい"
        }
    ],

    weak:[
        {
            id:"jp",
            reason:"飛び道具主体の展開を崩しにくい"
        },
        {
            id:"guile",
            reason:"ソニックブームで接近を制限されやすい"
        },
        {
            id:"chunli",
            reason:"通常技の差し返し性能で競り負けやすい"
        }
    ]
},

    related:{
        characters:["chunli","jamie","manon"],
        players:{pros:["dogura","imaishouta"],streamers:["kosaku"],vtubers:[],youtubers:[]}
    },

comboVideos:{

    beginner:[

        {
            title:"初心者コンボ",
            thumbnail:"assets/images/thumbnails/elena_beginner.jpg",
            url:"https://youtu.be/Y6nEL0ZSE2Y?si=rxLRHb0Gd3Db0T8l"
        }

    ],

    intermediate:[

        {
            title:"中級コンボ",
            thumbnail:"assets/images/thumbnails/elena_intermediate.jpg",
            url:"https://youtu.be/1HXTSFdf7dI?si=XN8yFwIT_K0TwBFs"
        }

    ],

    advanced:[
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%82%A8%E3%83%AC%E3%83%8A%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

    match:[
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%82%A8%E3%83%AC%E3%83%8A%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]

},
},

bison:{
    id:"bison",
    name:"ベガ",
    image:"assets/images/characters/bison.jpg",
    release:"Year2",
    type:"パワー型",
    difficulty:3,
    hp:10000,
    combo:2,
    power:5,
    speed:4,
    defense:2,
    reach:4,
    beginner:3,
    rush:5,
    projectile:false,
    invincible:false,
    antiAir:2,
    commandGrab:false,

    stats:{
        power:5,
        speed:4,
        defense:2,
        reach:4,
        beginner:3
    },

    playstyle:"ラッシュ",

concept:
"高い機動力と素早い攻めを武器に、一気に攻撃を畳み掛けて相手を追い詰めるキャラクター。",
range:"近距離",
strengths:[
    "攻め継続能力が高い",
    "機動力に優れる",
    "ラッシュとの相性が非常に良い"
],

weaknesses:[
    "守りはやや不安定",
    "無理な攻めは反撃を受けやすい",
    "火力を伸ばすにはコンボ練習が必要"
],

recommend:[
    "攻め続けるプレイが好きな人",
    "スピード感のある試合を楽しみたい人",
    "スタイリッシュなキャラを使いたい人"
],

    matchups:{
    strong:[
        {
            id:"manon",
            reason:"攻めを継続して投げを狙わせにくい"
        },
        {
            id:"ehonda",
            reason:"頭突きに対応しながら主導権を握りやすい"
        },
        {
            id:"marisa",
            reason:"機動力で重い通常技をかわしやすい"
        }
    ],

    weak:[
        {
            id:"cammy",
            reason:"接近戦で素早く攻め込まれやすい"
        },
        {
            id:"zangief",
            reason:"一度捕まると火力差で押し切られやすい"
        },
        {
            id:"chunli",
            reason:"通常技の差し返し性能で苦戦しやすい"
        }
    ]
},

    related:{
        characters:["gouki","jp","aki"],
        players:{pros:["dogura","yanai","nemo"],streamers:[],vtubers:[],youtubers:[]}
    },

    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/bison_beginner.jpg",
                url: "https://youtu.be/U_fq20cnfdg?si=ziuSAABQag6WoVYt"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/bison_intermediate.jpg",
                url: "https://youtu.be/H3m9GlRQ0vU?si=kQGKmVO_uiuiG9gq"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%83%99%E3%82%AC%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%83%99%E3%82%AC%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    }
},
sagat:{
    id:"sagat",
    name:"サガット",
    image:"assets/images/characters/sagat.jpg",
    release:"Year3",
    type:"パワー型",
    difficulty:2,
    hp:10000,
    combo:3,
    power:5,
    speed:2,
    defense:4,
    reach:5,
    beginner:4,
    rush:4,
    projectile:true,
    invincible:true,
    antiAir:4,
    commandGrab:false,

    stats:{
        power:5,
        speed:2,
        defense:4,
        reach:5,
        beginner:4
    },

    playstyle:"シューティング",
range:"近〜中距離",
concept:
"強力な飛び道具と長い通常技を駆使し、中距離から遠距離を支配するキャラクター。",

strengths:[
    "飛び道具が非常に強力",
    "通常技のリーチが長い",
    "高火力コンボを狙える"
],

weaknesses:[
    "近距離戦は苦手",
    "機動力は控えめ",
    "守りでは相手との距離管理が重要"
],

recommend:[
    "飛び道具主体で戦いたい人",
    "じっくり試合を組み立てたい人",
    "高火力キャラが好きな人"
],

    matchups:{
    strong:[
        {
            id:"zangief",
            reason:"飛び道具と長い通常技で接近を拒否しやすい"
        },
        {
            id:"ehonda",
            reason:"タイガーショットで前進を止めやすい"
        },
        {
            id:"marisa",
            reason:"リーチ差を活かして地上戦を有利に進めやすい"
        }
    ],

    weak:[
        {
            id:"cammy",
            reason:"飛び道具をかいくぐって接近されやすい"
        },
        {
            id:"juri",
            reason:"機動力で得意距離を維持しにくい"
        },
        {
            id:"kimberly",
            reason:"素早い接近で飛び道具を撃ちにくい"
        }
    ]
},

    related:{
        characters:["ryu","ken","guile"],
        players:{pros:["bonchan","hinao"],streamers:[],vtubers:[],youtubers:[]}
    },

    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/sagat_beginner.jpg",
                url: "https://youtu.be/ta-0jFArgtI?si=nhWNe7GlvdcS4tAR"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/sagat_intermediate.jpg",
                url: "https://youtu.be/wRWSPYQMoQ4?si=6WWeFSYTkiARgzaz"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%82%B5%E3%82%AC%E3%83%83%E3%83%88%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%82%B5%E3%82%AC%E3%83%83%E3%83%88%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    }
},
cviper:{
    id:"cviper",
    name:"C.ヴァイパー",
    image:"assets/images/characters/cviper.jpg",
    release:"Year3",
    type:"テクニカル型",
    difficulty:5,
    hp:10000,
    combo:5,
    power:4,
    speed:4,
    defense:2,
    reach:3,
    beginner:1,
    rush:2,
    projectile:true,
    invincible:false,
    antiAir:2,
    commandGrab:false,

    stats:{
        power:4,
        speed:4,
        defense:2,
        reach:3,
        beginner:1
    },
playstyle:"テクニカル",
range:"近距離",
concept:
"多彩なキャンセルと高難度コンボを駆使し、自由度の高い攻めで相手を圧倒するキャラクター。",

strengths:[
    "攻めの自由度が非常に高い",
    "高火力コンボを狙える",
    "崩し性能が高い"
],

weaknesses:[
    "操作難易度が非常に高い",
    "コンボの安定には練習が必要",
    "ミスした時のリスクが大きい"
],

recommend:[
    "難しいキャラに挑戦したい人",
    "コンボを極めたい人",
    "操作技術に自信がある人"
],

    matchups:{
    strong:[
        {
            id:"jp",
            reason:"高い機動力で飛び道具を突破しやすい"
        },
        {
            id:"guile",
            reason:"飛び道具主体の展開を崩しやすい"
        },
        {
            id:"dhalsim",
            reason:"一気に距離を詰めて攻めを継続しやすい"
        }
    ],

    weak:[
        {
            id:"cammy",
            reason:"近距離戦で主導権を握られやすい"
        },
        {
            id:"chunli",
            reason:"通常技の差し返し性能で苦戦しやすい"
        },
        {
            id:"luke",
            reason:"安定した地上戦で攻めを通しにくい"
        }
    ]
},

    related:{
        characters:["juri","kimberly","cammy"],
        players:{pros:["kazunoko","tachikawa","inaba"],streamers:[],vtubers:[],youtubers:[]}
    },

    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/cviper_beginner.jpg",
                url: "https://youtu.be/fRsNOJCkizA?si=r4yY9_gEn-kBemIY"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/cviper_intermediate.jpg",
                url: "https://youtu.be/X6vSz-g5K1Y?si=tQsIA4mavorJfD9Q"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=C.%E3%83%B4%E3%82%A1%E3%82%A4%E3%83%91%E3%83%BC%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=C.%E3%83%B4%E3%82%A1%E3%82%A4%E3%83%91%E3%83%BC%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    }
},
alex:{
    id:"alex",
    name:"アレックス",
    image:"assets/images/characters/alex.jpg",
    release:"Year3",
    type:"パワー型",
    difficulty:3,
    hp:10500,
    combo:4,
    power:5,
    speed:3,
    defense:4,
    reach:3,
    beginner:3,
    rush:3,
    projectile:false,
    invincible:false,
    antiAir:3,
    commandGrab:false,

    stats:{
        power:5,
        speed:3,
        defense:4,
        reach:3,
        beginner:3
    },
playstyle:"パワー",
range:"近距離",
concept:
"豪快な打撃と投げを組み合わせ、一気に流れを引き寄せる近距離戦が得意なキャラクター。",

strengths:[
    "火力が高い",
    "打撃と投げの読み合いが強力",
    "一度攻めると流れを掴みやすい"
],

weaknesses:[
    "機動力は控えめ",
    "飛び道具への対応が課題",
    "接近するまでが苦労しやすい"
],

recommend:[
    "豪快な攻めが好きな人",
    "読み合いを楽しみたい人",
    "高火力キャラを使いたい人"
],

    matchups:{
    strong:[
        {
            id:"ehonda",
            reason:"火力を押し付けやすく読み合いに持ち込みやすい"
        },
        {
            id:"manon",
            reason:"近距離戦で火力勝負を仕掛けやすい"
        },
        {
            id:"marisa",
            reason:"一度攻め始めると流れを作りやすい"
        }
    ],

    weak:[
        {
            id:"guile",
            reason:"飛び道具で接近を止められやすい"
        },
        {
            id:"jp",
            reason:"遠距離戦を押し付けられやすい"
        },
        {
            id:"chunli",
            reason:"通常技のリーチ差で接近しづらい"
        }
    ]
},

    related:{
        characters:["marisa","zangief","manon"],
        players:{pros:["dogura","nemo"],streamers:[],vtubers:[],youtubers:[]}
    },

    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/alex_beginner.jpg",
                url: "https://youtu.be/k9kVyEFys8M?si=pBVSeHJGDzq-Ird7"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/alex_intermediate.jpg",
                url: "https://youtu.be/sXAPb3tKHQw?si=7Uvb7PFYq6kBYonw"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%82%A2%E3%83%AC%E3%83%83%E3%82%AF%E3%82%B9%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%82%A2%E3%83%AC%E3%83%83%E3%82%AF%E3%82%B9%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    }
},
ingrid:{
    id:"ingrid",
    name:"イングリッド",
    image:"assets/images/characters/ingrid.jpg",
    release:"Year3",
    type:"シューティング型",
    difficulty:4,
    hp:10000,
    combo:3,
    power:4,
    speed:3,
    defense:3,
    reach:5,
    beginner:4,
    rush:3,
    projectile:true,
    invincible:true,
    antiAir:2,
    commandGrab:false,

    stats:{
        power:4,
        speed:3,
        defense:3,
        reach:5,
        beginner:4
    },
playstyle:"オールラウンダー",
range:"中〜遠距離",
concept:
"高い機動力と多彩な技を活かし、状況に応じて柔軟に戦える万能型キャラクター。",

strengths:[
    "攻守のバランスが良い",
    "技の種類が豊富",
    "状況に応じて柔軟に戦える"
],

weaknesses:[
    "突出した性能は少ない",
    "キャラクター理解が重要",
    "火力を伸ばすには練習が必要"
],

recommend:[
    "万能キャラが好きな人",
    "色々な戦い方を楽しみたい人",
    "長く使い込みたい人"
],

    matchups:{
    strong:[
        {
            id:"zangief",
            reason:"機動力を活かして接近を拒否しやすい"
        },
        {
            id:"ehonda",
            reason:"立ち回りで主導権を握りやすい"
        },
        {
            id:"manon",
            reason:"投げ間合いに入らせず戦いやすい"
        }
    ],

    weak:[
        {
            id:"jp",
            reason:"遠距離戦で主導権を握られやすい"
        },
        {
            id:"guile",
            reason:"飛び道具主体の展開を崩しにくい"
        },
        {
            id:"gouki",
            reason:"攻撃力と機動力で押し切られやすい"
        }
    ]
},

    related:{
        characters:["ryu","chunli","luke"],
        players:{pros:[],streamers:[],vtubers:[],youtubers:[]}
    },

    comboVideos: {
        beginner: [
            {
                title: "初心者コンボ",
                thumbnail: "assets/images/thumbnails/ingrid_beginner.jpg",
                url: "https://youtu.be/dzV986Pekx0?si=trO6qfIULuz5tl_4"
            }
        ],

        intermediate: [
            {
                title: "中級コンボ",
                thumbnail: "assets/images/thumbnails/ingrid_intermediate.jpg",
                url: "https://youtu.be/tsSoOs43Ygk?si=y6pOJ0b4LlZfEiK0"
            }
        ],

        advanced: [
            {
                type: "search",
                title: "上級者向けの動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%82%A4%E3%83%B3%E3%82%B0%E3%83%AA%E3%83%83%E3%83%89%20%E4%B8%8A%E7%B4%9A%20%E3%82%B3%E3%83%B3%E3%83%9C%20%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A%20%E8%A7%A3%E8%AA%AC%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC6"
            }
        ],

        match: [
            {
                type: "search",
                title: "対戦動画を探す",
                url: "https://www.youtube.com/results?search_query=%E3%82%A4%E3%83%B3%E3%82%B0%E3%83%AA%E3%83%83%E3%83%89%20%E5%AF%BE%E6%88%A6%E5%8B%95%E7%94%BB%20SF6"
            }
        ]
    }
},
}