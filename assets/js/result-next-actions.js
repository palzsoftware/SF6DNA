// ==========================================
// 診断結果ページ用「次にすること」ビルダー(Phase6-C)
// ==========================================
//
// character-next-actions.js / player-next-actions.js と同じ形で、
// next-actions.js(汎用エンジン)に渡すためのconfigを診断結果向けに組み立てる。
//
// 背景(UXレビューでの指摘):
//   診断を受け終えた直後が「今日から始めよう」と一番思わせやすい瞬間なのに、
//   result.htmlには「次にすること」が無く、日々のループ(マイページ・練習)への
//   橋渡しが弱かった。この導線を補うために新設する。
//
// 依存関係(result.htmlでの読み込み順):
//   site-constants.js / character-data.js / result-data.js
//   → next-actions.js(renderNextActions)
//   → result-next-actions.js(このファイル)
//   → result.js(buildResultNextActions()を呼び出す側)
//
// ==========================================


/**
 * 診断結果ページ用の「次にすること」アクションを組み立てる
 *
 * @param {string} resultType - 診断結果のタイプキー(例: "aggressive")
 * @returns {Object|null} renderNextActions()にそのまま渡せる設定オブジェクト
 */
function buildResultNextActions(resultType) {

    if (!resultType || typeof resultData === "undefined" || !resultData[resultType]) return null;

    const typeData = resultData[resultType];
    const actions = [];

    // ① 練習する
    actions.push({
        id: "training",
        icon: "🎯",
        label: "今日の練習をする",
        href: "training.html",
        tone: "primary"
    });

    // ② このタイプが苦手とする相手キャラクターへの対策を見る
    //    (resultData側に定義済みの「診断タイプが苦手とする対戦相手」データを使う。
    //     ユーザーが個別に登録する「苦手キャラクター」(RELATION_STATUS.WEAK)とは
    //     別のデータのため、混同を避けるためIDを type_weak_matchup とする)
    const weakCharacterEntry = (typeData.weakCharacters || [])
        .find(entry => typeof characterData !== "undefined" && characterData[entry.id]);

    if (weakCharacterEntry) {
        const weakCharacter = characterData[weakCharacterEntry.id];
        actions.push({
            id: "type_weak_matchup",
            icon: "🛡",
            label: `${weakCharacter.name}への対策を見る`,
            href: `character.html?id=${weakCharacterEntry.id}`,
            tone: "default"
        });
    }

    // ③ おすすめキャラクターをもっと見る
    actions.push({
        id: "characters",
        icon: "📖",
        label: "おすすめキャラクターをもっと見る",
        href: "characters.html",
        tone: "default"
    });

    // ④ マイページで「今日のあなた」を見る(診断結果を、その場限りで終わらせず
    //    日々のループ=マイページへ橋渡しするための導線。UXレビューで最も
    //    重要な欠落として指摘した箇所)
    actions.push({
        id: "mypage",
        icon: "🏠",
        label: "マイページで今日のあなたを見る",
        href: "mypage.html",
        tone: "default"
    });

    return {
        heading: "次にすること",
        entityType: "diagnosis_result",
        entityId: resultType,
        sourcePage: "diagnosis_result",
        statusSnapshot: {
            diagnosisType: resultType
        },
        actions
    };

}
