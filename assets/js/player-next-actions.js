// ==========================================
// プレイヤー詳細ページ用「次にすること」ビルダー(Phase6-B)
// ==========================================
//
// character-next-actions.js と同じ形で、next-actions.js(汎用エンジン)に
// 渡すためのconfigをプレイヤー向けに組み立てる。
//
// 依存関係(player.htmlでの読み込み順):
//   site-constants.js / character-data.js
//   → next-actions.js(renderNextActions)
//   → player-next-actions.js(このファイル)
//   → player.js(buildPlayerNextActions()を呼び出す側)
//
// ==========================================


/**
 * プレイヤー詳細ページ用の「次にすること」アクションを組み立てる
 *
 * @param {Object} player - pro.js/streamer.js等のplayers統合オブジェクトの1件
 * @returns {Object|null} renderNextActions()にそのまま渡せる設定オブジェクト
 */
function buildPlayerNextActions(player) {

    if (!player) return null;

    const actions = [];

    // ① 練習する(プレイヤーごとの個別メニューは無いため、練習ページへの一般導線)
    actions.push({
        id: "training",
        icon: "🎯",
        label: "今日の練習をする",
        href: "training.html",
        tone: "default"
    });

    // ② 使用キャラクターを理解する(プレイヤーのメインキャラクターが
    //    character-data.jsに存在する場合のみ表示。存在しないキャラの
    //    リンクを作ることはしない)
    const mainCharacterId = (player.characters || []).find(id => typeof characterData !== "undefined" && characterData[id]);

    if (mainCharacterId) {
        const mainCharacter = characterData[mainCharacterId];
        actions.push({
            id: "main_character",
            icon: "🥋",
            label: `${mainCharacter.name}を詳しく見る`,
            href: `character.html?id=${mainCharacterId}`,
            tone: "default"
        });
    }

    // ③ 同じキャラクターを使う他の選手を見る(Phase6-Aで用意した
    //    players.html の ?character= パラメータをそのまま再利用する)
    if (mainCharacterId) {
        actions.push({
            id: "similar_players",
            icon: "👥",
            label: "同じキャラを使う他の選手を見る",
            href: `players.html?character=${encodeURIComponent(mainCharacterId)}`,
            tone: "default"
        });
    }

    // 関連FAQは、プレイヤー個別の内容に対応するFAQデータが現状無いため、
    // 存在しない関連性を捏造することになるためあえて含めていない
    // (詳細はPhase6-B完了報告の「今回見送った点」を参照)

    const favoritePlayers = (typeof getLocalJSON === "function") ? getLocalJSON("sf6dna_favorite_players", []) : [];

    return {
        heading: "次にすること",
        entityType: "player",
        entityId: player.id,
        sourcePage: "player_detail",
        statusSnapshot: {
            isFavoritePlayer: favoritePlayers.includes(player.id)
        },
        actions
    };

}
