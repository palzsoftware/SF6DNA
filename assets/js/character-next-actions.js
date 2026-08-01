// ==========================================
// キャラクター詳細ページ用「次にすること」ビルダー(Phase6-A)
// ==========================================
//
// next-actions.js(対象非依存の汎用エンジン)に渡すためのconfigを、
// キャラクター向けに組み立てる処理をここに集約する。
//
// このファイルはキャラクター固有の知識(character-data.jsの構造、
// お気に入り/苦手のlocalStorageキー、faqDataForTodayの中身)に依存する。
// Phase6-Bでプレイヤー詳細等に同じ導線を追加する場合は、
// このファイルを真似て player-next-actions.js のような専用ファイルを
// 新設し、next-actions.js自体は変更しない。
//
// 依存関係(character.htmlでの読み込み順):
//   site-constants.js(getCharacterRelation/RELATION_STATUS)
//   → faq-data.js(faqDataForToday)
//   → next-actions.js(renderNextActions)
//   → character-next-actions.js(このファイル)
//   → characters.js(buildCharacterNextActions()を呼び出す側)
//
// ==========================================


/**
 * キャラクター詳細ページ用の「次にすること」アクションを組み立てる
 *
 * お気に入り/苦手登録の状態によって、優先して見せたいアクションのトーンを変える。
 * (お気に入り登録済み→「使い込む」文脈を優先、苦手登録済み→「対策」文脈を優先)
 *
 * @param {Object} character - character-data.js の1キャラクター分のオブジェクト
 * @returns {Object|null} renderNextActions()にそのまま渡せる設定オブジェクト
 */
function buildCharacterNextActions(character) {

    if (!character) return null;

    const relation = (typeof getCharacterRelation === "function") ? getCharacterRelation(character.id) : null;
    const relationStatus = relation ? relation.status : null;
    const isWeak = (typeof RELATION_STATUS !== "undefined") && relationStatus === RELATION_STATUS.WEAK;

    const actions = [];

    // ① 練習する(苦手登録済みなら「対策のための練習」を優先表示)
    actions.push({
        id: "training",
        icon: "🎯",
        label: isWeak ? "対策のための練習をする" : "このキャラの練習をする",
        href: "training.html",
        tone: isWeak ? "primary" : "default"
    });

    // ② 有利不利・対策を見る(同一ページ内の有利不利セクションへアンカー遷移)
    actions.push({
        id: "matchup",
        icon: "🛡",
        label: "有利不利・対策を見る",
        href: "#matchupSection",
        tone: isWeak ? "primary" : "default"
    });

    // ③ このキャラを使うプロを見る(プレイヤー図鑑へ。既存の検索キーワードの
    //    仕組みをそのまま使うため、URLパラメータ経由でキャラクター名を渡す)
    actions.push({
        id: "players",
        icon: "👤",
        label: `${character.name}を使うプロを見る`,
        href: `players.html?character=${encodeURIComponent(character.id)}`,
        tone: "default"
    });

    // ④ 関連FAQを見る(存在するFAQデータの中から、コンボ/対策等のキーワードに
    //    一致するものを1件だけ紹介する。専用FAQが無いキャラクターについて
    //    存在しないデータを作ることはしない)
    actions.push(buildRelatedFaqAction(character, isWeak));

    return {
        heading: "次にすること",
        entityType: "character",
        entityId: character.id,

        // このコンポーネントを表示しているページの固定ID。
        // location.pathname等からの自動生成はせず、ここで明示的に持つ
        // (Phase6-Aレビューでの指摘: URL構造が変わっても記録データの表記を揺らさないため)
        sourcePage: "character_detail",

        // クリック時点の状態のスナップショット。next-actions.js側では
        // キーの意味を解釈せず、そのまま活動ログのmetadataに記録される。
        // 「ユーザーとキャラクターの関係」を単一のステータスに統一したことに合わせて、
        // ここも1つの値(relationStatus)で持たせる(Phase6-B)。
        statusSnapshot: {
            relationStatus: relationStatus || "none"
        },

        actions
    };

}


/**
 * キャラクターに関連しそうなFAQを1件選び、「次にすること」用のアクションとして返す
 *
 * 同じキャラクターであれば毎回同じFAQが選ばれるよう、キャラクターIDから
 * 決定的な(ランダムでない)値を作って選択に使う。ランダムにすると再訪問のたびに
 * 違うFAQが表示され、「このキャラに関連している」という信頼感が薄れるため。
 *
 * @param {Object} character
 * @param {boolean} isWeak - 苦手登録済みかどうか(苦手なら「対策」寄りのFAQを優先)
 * @returns {Object} next-actions用のaction設定
 */
function buildRelatedFaqAction(character, isWeak) {

    const fallback = {
        id: "faq",
        icon: "❓",
        label: "関連FAQを見る",
        href: "faq.html",
        tone: "default"
    };

    // faq-data.jsが読み込まれていないページ(未対応ページ)では汎用リンクにフォールバックする
    if (typeof faqDataForToday === "undefined" || !Array.isArray(faqDataForToday)) {
        return fallback;
    }

    const keywords = isWeak ? /対策|コンボ|練習|勝てない/ : /コンボ|練習/;
    const candidates = faqDataForToday.filter(item => keywords.test(item.question + item.answer));

    if (candidates.length === 0) return fallback;

    // キャラクターIDの文字コード合計を「日替わり」と同じ考え方の決定的な選定に使う
    const seed = character.id.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    const picked = candidates[seed % candidates.length];

    return {
        id: "faq",
        icon: "❓",
        label: picked.question,
        href: "faq.html",
        tone: "default"
    };

}
