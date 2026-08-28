// おすすめプロプレイヤー表示用の共有データ。
// result-data.js の proPlayers は「id + 理由」だけを持ち、
// 名前・使用キャラ・画像などの基本情報はここから引く。
// (同じ選手が複数タイプで紹介されるため、情報の重複を避ける設計)
//
// 現状、詳細ページ(pro-player.html)が存在するのは以下6名のみ。
// 新しい選手を追加する場合は、pro-player.html側にも詳細データを追加すること。
//
// image が無い選手(kakeru)は実写真素材が無いため、
// result.js側でイニシャルアバターにフォールバックする。
// (2026年7月: angrybird/punkの画像を追加済み)

const proPlayerDirectory = {

    kakeru: {
        name: "翔",
        characterId: "jp",
        character: "JP",
        country: "japan"
    },

    gachikun: {
        name: "ガチくん",
        characterId: "rashid",
        character: "ラシード",
        country: "japan",
        image: "assets/images/players/gachikun.png"
    },

    higuchi: {
        name: "ひぐち",
        characterId: "guile",
        character: "ガイル",
        country: "japan",
        image: "assets/images/players/higuchi.png"
    },

    menard: {
        name: "MenaRD",
        characterId: "blanka",
        character: "ブランカ / ベガ",
        country: "world",
        image: "assets/images/players/menard.png"
    },

    angrybird: {
        name: "AngryBird",
        characterId: "ken",
        character: "ケン",
        country: "world",
        image: "assets/images/players/angrybird.png"
    },

    punk: {
        name: "Punk",
        characterId: "cammy",
        character: "キャミィ",
        country: "world",
        image: "assets/images/players/punk.png"
    }

};
