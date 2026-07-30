const teamData = {

    varrel:{

        id:"varrel",

        name:"VARREL",

        logo:"assets/images/teams/varrel.png",

        country:"日本",

        official:"",

        sflRank:"2026シーズン Division F 出場中",

        description:"マゴと水派が長年チームを支え、そこにVARRELを世界へ導く使命を持つときど、若手の急先鋒わびいちが加わった編成。ALL VARRELの一体感でSFL制覇を目指しています。",

        players:[
            "tokido",
            "mago",
            "mizuha",
            "wabiichi"
        ]

    },

    reject:{

        id:"reject",

        name:"REJECT",

        logo:"assets/images/teams/reject.png",

        country:"日本",

        official:"",

        sflRank:"2026シーズン Division F 出場中",

        description:"数々のタイトルで実績を残す選手が所属する、日本を代表する格闘ゲームチーム。連覇を目標に掲げ、毎シーズン優勝候補の一角として名前が挙がります。",

        players:[
            "daigo",
            "fuudo",
            "yas",
            "hinao",
            "haitani"
        ]

    },

    // 2026/7/27 追加: VTuber事務所を「チーム」として扱い、
    // 同じ事務所のメンバーをまとめて表示できるようにする
    // ※VTuber事務所は公式大会「SFL」への出場チームではないため、
    //   sflRank欄は設けない(team-detail.jsで自動的に非表示になる)

    nijisanji:{

        id:"nijisanji",

        name:"にじさんじ",

        logo:"assets/images/teams/nijisanji.png",

        country:"日本",

        official:"https://www.nijisanji.jp",

        description:"多数のライバーが所属するVTuberグループ。ストリートファイター6をプレイするライバーも多数活動しています。",

        players:[
            "kuzuha",
            "onotora",
            "kanae",
            "murakumokagetsu",
            "usamirito",
            "kurieita",
            "inamirai",
            "wataraihibari",
            "nagaokei"
        ]

    },

    vspo:{

        id:"vspo",

        name:"ぶいすぽっ！",

        logo:"assets/images/teams/vspo.png",

        country:"日本",

        official:"",

        description:"eスポーツに力を入れるVTuberグループ。格闘ゲームをプレイするメンバーも多く在籍しています。",

        players:[
            "amayuimoka",
            "kisaragiren",
            "choyahanabi"
        ]

    },

    holostars:{

        id:"holostars",

        name:"ホロスターズ",

        logo:"assets/images/teams/holostars.png",

        country:"日本",

        official:"https://holostars.hololivepro.com",

        description:"ホロライブプロダクション所属の男性VTuberグループ。",

        players:[
            "rikka"
        ]

    },

    sycom:{

        id:"sycom",

        name:"@Sycom",

        logo:"assets/images/teams/sycom.png",

        country:"日本",

        official:"https://www.sycom.co.jp/esports/",

        description:"BTOパソコンメーカー・サイコムが運営する自社eスポーツチーム。ストリートファイター6部門を主軸に活動しています。",

        players:[
            "orarin",
            "zabuton",
            "pipokun",
            "imaishouta",
            "seichi"
        ]

    },

    zeta:{

        id:"zeta",

        name:"ZETA DIVISION",

        logo:"assets/images/teams/zeta.png",

        country:"日本",

        official:"https://zetadivision.com",

        sflRank:"2026シーズン Division S 出場中",

        description:"2018年設立、GANYMEDE株式会社が運営する日本最大級のプロeスポーツ組織。VALORANTやApex Legendsなど14以上の部門を持ち、格闘ゲーム部門には頂点を知るももち、難攻不落のひぐち、努力家のヤマグチ、絶対王者MenaRDが集結しています。",

        players:[
            "momochi",
            "higuchi",
            "yamaguchi",
            "menard"
        ]

    },

    ibushigin:{

        id:"ibushigin",

        name:"FUKUSHIMA IBUSHIGIN",

        logo:"assets/images/teams/ibushigin.png",

        country:"日本",

        official:"",

        sflRank:"2026シーズン Division S 出場中",

        description:"福島県を拠点に活動するチーム。前シーズン最下位からの巻き返しを掲げ、全員が福島に集まって練習を重ねています。",

        players:[
            "yanai",
            "johnny",
            "torimeshi",
            "twobassa"
        ]

    },

    dfm:{

        id:"dfm",

        name:"DetonatioN FocusMe",

        logo:"assets/images/teams/dfm.png",

        country:"日本",

        official:"https://team-detonation.net/",

        sflRank:"2026シーズン Division S 出場中",

        description:"2015年設立、名古屋にホームスタジアムを構える国内トップクラスのプロeスポーツチーム。所属選手は60名を超え、格闘ゲームだけでなくMOBAやFPSなど幅広いタイトルで活動しています。格闘ゲーム部門は前年SFL得点王・MVPのKEI.Bを迎えた新体制です。",

        rosterHistory:{
            "2024": ["machabo", "itabashizangief", "keib", "nauman"]
        },

        players:[
            "itabashizangief",
            "keib",
            "nauman",
            "johntakeuchi"
        ]

    },

    favgaming:{

        id:"favgaming",

        name:"KADOKAWA FAV gaming",

        logo:"assets/images/teams/favgaming.png",

        country:"日本",

        official:"https://www.favgaming.com/",

        sflRank:"2026シーズン Division S 出場中",

        description:"埼玉を拠点に、『ファミ通』『電撃オンライン』でおなじみのKADOKAWA Game Linkageがプロデュースするeスポーツチーム。りゅうきちが新リーダーを務める体制で優勝を目指しています。",

        players:[
            "ryukichi",
            "sako",
            "fujimura",
            "moke"
        ]

    },

    good8:{

        id:"good8",

        name:"Good 8 Squad",

        logo:"assets/images/teams/good8.png",

        country:"日本",

        official:"https://good8squad.com/",

        sflRank:"2026シーズン Division S 出場中",

        description:"2018年結成、「esports makes our life」を掲げるプロeスポーツチーム。世界選手権優勝経験を持つガチくん、さはらをはじめ、実力と人気を兼ね備えた選手が所属しています。",

        rosterHistory:{
            "2024": ["gachikun", "kawano", "pugera", "yhcmochi"],
            "2025": ["gachikun", "kawano", "pugera", "sahara"]
        },

        players:[
            "gachikun",
            "kawano",
            "pugera",
            "sahara"
        ]

    },

    kumamoto:{

        id:"kumamoto",

        name:"Saishunkan Sol 熊本",

        logo:"assets/images/teams/kumamoto.png",

        country:"日本",

        official:"",

        sflRank:"2026シーズン Division S 出場中",

        description:"熊本を拠点に活動するチーム。長年チームを牽引したネモをコーチに据え、新リーダーのcosaを中心とした新体制でシーズンに挑んでいます。「熊本を、日本を、世界を照らす太陽のようなチームに」を目標に掲げています。",

        rosterHistory:{
            "2025": ["nemo", "machabo", "cosa", "kobayan"]
        },

        players:[
            "cosa",
            "machabo",
            "kobayan",
            "kincho",
            "nemo"
        ]

    },

    cr:{

        id:"cr",

        name:"Crazy Raccoon",

        logo:"assets/images/teams/cr.png",

        country:"日本",

        official:"https://crazyraccoon.jp/",

        sflRank:"2026シーズン Division S 出場中",

        description:"2018年発足、「ゲーマーをかっこよく魅せる」をコンセプトに掲げる総合エンタメ型のeスポーツチーム。競技部門だけでなくストリーマー・クリエイター部門も抱え、独自大会「CR CUP」やイベント「CR FES」も主催しています。",

        rosterHistory:{
            "2025": ["dogura", "shuto", "kazunoko", "bonchan"]
        },

        players:[
            "dogura",
            "bonchan",
            "kazunoko",
            "shuto"
        ]

    },

    ixa:{

        id:"ixa",

        name:"広島 TEAM iXA",

        logo:"assets/images/teams/ixa.png",

        country:"日本",

        official:"",

        sflRank:"2026シーズン Division S 出場中",

        description:"広島を拠点に活動するチーム。「勝敗だけでなく魅せる試合でリーグを盛り上げる」ことを目標に、日本一・世界一を目指しています。",

        players:[
            "acqua",
            "hibiki",
            "akira",
            "takepi"
        ]

    },

    ntpoja:{

        id:"ntpoja",

        name:"名古屋NTPOJA",

        logo:"assets/images/teams/ntpoja.png",

        country:"日本",

        official:"",

        sflRank:"2026シーズン Division F 出場中",

        description:"「名古屋を元気に」を理念に活動する、名古屋発のプロスポーツクラブ。名古屋ゆかりの選手が集う”ALL名古屋”体制で、地域活性化にも貢献しながら悲願の初優勝を目指しています。",

        rosterHistory:{
            "2024": ["keib", "tachikawa", "otani", "mocchi"],
            "2025": ["keib", "seiya", "otani", "mocchi"]
        },

        players:[
            "seiya",
            "raoyamu",
            "otani",
            "mocchi"
        ]

    },

    riddleorder:{

        id:"riddleorder",

        name:"RIDDLE ORDER",

        logo:"assets/images/teams/riddleorder.png",

        country:"日本",

        official:"https://riddle.info/",

        sflRank:"2026シーズン Division F 出場中(SFL初参戦)",

        description:"2016年、配信者ボドカにより発足したプロゲーミングチーム。Apex LegendsやVALORANTなど複数部門で活動しており、格闘ゲーム部門はSFL初参戦のフレッシュな編成に挑戦しています。",

        players:[
            "takagi",
            "adelie",
            "jr",
            "hikaru"
        ]

    },

    scarz:{

        id:"scarz",

        name:"SCARZ",

        logo:"assets/images/teams/scarz.png",

        country:"日本",

        official:"https://www.scarz.net/",

        description:"2012年設立、「人々の心に爪痕(scars)を残す」という思いから名付けられた国内老舗のプロeスポーツ組織。若手選手の育成プログラムにも力を入れています。",

        players:[
            "akutagawa",
            "ryusei"
        ]

    },

};
