// ==========================================
// サイト共通の定数・辞書
// ==========================================
//
// 診断結果の8軸(aggressive/defensive/zoning/balanced/reading/combo/strategy/instinct)は、
// home.js・training.js・result.js等の複数ファイルで参照される。
// 日本語ラベルの辞書が各ファイルに個別定義され重複していたため、ここに一本化する。
//
// 使い方: このファイルを、参照する側のスクリプトより「前」に読み込むこと。
//
// ==========================================

const AXIS_LABELS = {
    aggressive: "攻撃",
    defensive: "守り",
    zoning: "牽制",
    balanced: "バランス",
    reading: "読み合い",
    combo: "コンボ",
    strategy: "戦略",
    instinct: "直感"
};

// ==========================================
// localStorage 共通ヘルパー(Phase5リファクタリング)
// ==========================================
//
// 「JSON.parse(localStorage.getItem(key) || デフォルト値)をtry/catchで囲む」という
// 全く同じ形のコードが、characters.js/players-list.js/mypage.js/home.js/about.js等、
// サイト全体で20箇所以上に重複していたため、この2関数に一本化する。
//
// 既存の呼び出し元の挙動(壊れたJSONの場合はフォールバック値を返す)は変更していない。
//
// ==========================================

/**
 * localStorageからJSONを安全に読み込む
 * @param {string} key
 * @param {*} [fallback=null] - キーが無い/JSONが壊れている場合に返す値
 * @returns {*}
 */
function getLocalJSON(key, fallback = null) {

    try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
    } catch (err) {
        console.warn(`[site-constants] localStorageの読み込みに失敗しました(key: ${key})`, err);
        return fallback;
    }

}

/**
 * localStorageへJSONを安全に保存する
 * @param {string} key
 * @param {*} value
 */
function setLocalJSON(key, value) {

    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
        console.warn(`[site-constants] localStorageへの保存に失敗しました(key: ${key})`, err);
    }

}

// ==========================================
// 「今日のおすすめ」共通ロジック
// ==========================================
//
// 「今日」を基準に、配列やリストから1件を決定的に選ぶ。
// ランダムではなく日付ベースにすることで、同じ日にページを開き直しても
// 同じ結果になり、翌日には別の結果になる(=毎日少し違う体験)。
//
// salt(第2引数)は、同じ日でも「キャラクター用」「動画用」等の
// カテゴリごとに異なる位置を選ばせるためのズラし値。
// 例えば毎回salt=0だと、配列の長さがたまたま同じカテゴリ同士で
// 同じインデックスが選ばれやすくなる(偏りの原因)ため、
// カテゴリごとに異なるsaltを渡すことを推奨する。
//
// ==========================================

function getDailyIndex(poolLength, salt = 0) {

    if (!poolLength || poolLength <= 0) return 0;

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24));

    return (dayOfYear + salt) % poolLength;

}

/**
 * 配列(またはオブジェクトのvalues)から、今日の1件を決定的に選ぶ
 * @param {Array} list
 * @param {number} [salt=0]
 * @returns {*} 選ばれた要素。listが空の場合はnull
 */
function getDailyPick(list, salt = 0) {

    if (!list || list.length === 0) return null;

    return list[getDailyIndex(list.length, salt)];

}

// ==========================================
// キャラクターとの関係ステータス(Phase6-B)
// ==========================================
//
// 目的:
//   これまで「5段階ステータス(sf6dna_status)」「お気に入り(sf6dna_favorite_characters)」
//   「苦手(sf6dna_weak_characters)」という3つに分かれていたデータを、
//   「ユーザーとキャラクターの関係」を表す1つのステータスへ統一する。
//
// 設計方針:
//   - ステータスの内部値(RELATION_STATUS)は固定の英語キーとする。表示文言・アイコン・色は
//     RELATION_STATUS_CONFIG という設定テーブルにまとめて持たせる。将来ステータスを
//     追加・変更する場合は、この設定テーブルに1件足すだけでよく、
//     呼び出し側にswitch文を増やさずに済む設計にしている。
//   - character_relationsは「現在の状態」だけを持つ(1キャラにつき1エントリ)。
//     「いつ、何から何に変わったか」という変化の記録は、activity-log.jsの
//     RELATION_CHANGEイベントとして別に記録する(状態と履歴の置き場所を混ぜない)。
//
// データ構造: sf6dna_character_relations
//   {
//       [characterId]: {
//           status: "main",                        // RELATION_STATUSのいずれか
//           createdAt: "2026-06-01T00:00:00.000Z",  // 初めてこのキャラに関係がついた日時
//                                                     // (以後のステータス変更では上書きしない)
//           updatedAt: "2026-08-01T03:15:00.000Z"    // 直近でステータスが変わった日時
//       },
//       ...
//   }
//   キー自体が存在しない = 未設定(あえて「未設定」という実体は持たせず、
//   データが無いことそのものを未設定として扱う)
//
// ==========================================

const RELATION_STATUS = Object.freeze({
    MAIN: "main",
    SUB: "sub",
    PRACTICING: "practicing",
    WEAK: "weak",
    INTERESTED: "interested"
});

// ステータスの「見た目」と「意味づけ」を集約する設定テーブル。
// 表示順もこの配列の並び順をそのまま使う。
// 将来 favorite/completed/mastered/retired 等を追加する場合は、この配列に1件足すだけでよい。
const RELATION_STATUS_CONFIG = [
    { status: RELATION_STATUS.MAIN,       label: "メイン",   icon: "★",  badgeClass: "status-main",       color: "#ffd700" },
    { status: RELATION_STATUS.SUB,        label: "サブ",     icon: "△",  badgeClass: "status-sub",        color: "#4aa3ff" },
    { status: RELATION_STATUS.PRACTICING, label: "練習中",   icon: "🎯", badgeClass: "status-practicing", color: "#ff69b4" },
    { status: RELATION_STATUS.WEAK,       label: "苦手",     icon: "⚑",  badgeClass: "status-weak",       color: "#ef4444" },
    { status: RELATION_STATUS.INTERESTED, label: "気になる", icon: "◇",  badgeClass: "status-interest",   color: "#ff8c42" }
];

const CHARACTER_RELATIONS_KEY = "sf6dna_character_relations";

/**
 * ステータスの内部値から、表示用の設定(label/icon/color等)を取得する
 * @param {string} status - RELATION_STATUSのいずれか
 * @returns {Object|null} 該当が無い場合(未設定を含む)はnull
 */
function getRelationStatusConfig(status) {
    return RELATION_STATUS_CONFIG.find(item => item.status === status) || null;
}

/**
 * すべてのキャラクター関係データを取得する
 * @returns {Object}
 */
function getCharacterRelations() {
    return getLocalJSON(CHARACTER_RELATIONS_KEY, {});
}

/**
 * 指定したキャラクターの関係データを取得する
 * @param {string} characterId
 * @returns {{status:string, createdAt:string, updatedAt:string}|null} 未設定の場合はnull
 */
function getCharacterRelation(characterId) {
    const relations = getCharacterRelations();
    return relations[characterId] || null;
}

/**
 * 指定したステータス(複数可)に該当するキャラクターIDの一覧を取得する
 * @param {string|Array<string>} status - RELATION_STATUSの値、または複数指定
 * @returns {Array<string>}
 */
function getCharacterIdsByStatus(status) {

    const statusList = Array.isArray(status) ? status : [status];
    const relations = getCharacterRelations();

    return Object.keys(relations).filter(id => statusList.includes(relations[id].status));

}

/**
 * キャラクターとの関係ステータスを設定する(新規登録・変更・解除は必ずこの関数を通す)
 *
 * @param {string} characterId
 * @param {string|null} status - RELATION_STATUSのいずれか。nullを渡すと「未設定」に戻す(解除)
 * @param {string} [characterName] - 活動ログに残す表示用ラベル(省略時はcharacterIdを使う)
 * @returns {{from:string|null, to:string|null}} 変更前後のステータス
 */
function setCharacterRelation(characterId, status, characterName) {

    const relations = getCharacterRelations();
    const existing = relations[characterId] || null;
    const from = existing ? existing.status : null;
    const now = new Date().toISOString();

    if (status === null) {
        // 解除(未設定に戻す)。エントリ自体を削除し、「存在しない」状態に戻す
        delete relations[characterId];
    } else {
        relations[characterId] = {
            status,
            // createdAtは初回登録時のみ設定し、以後のステータス変更では上書きしない
            // (「いつからこのキャラと関係を持ち始めたか」を残すため)
            createdAt: existing ? existing.createdAt : now,
            updatedAt: now
        };
    }

    setLocalJSON(CHARACTER_RELATIONS_KEY, relations);

    // ここで保存するのは「今の状態」のみ。「変化した」という行動の記録は
    // activity-log.js側(RELATION_CHANGE)に任せる(状態と履歴を混ぜない設計方針のため)
    if (from !== status && typeof recordActivity === "function" && typeof ACTIVITY_TYPES !== "undefined") {
        recordActivity(
            ACTIVITY_TYPES.RELATION_CHANGE,
            characterId,
            characterName || characterId,
            {
                entityType: "character",
                entityId: characterId,
                from,
                to: status
            }
        );
    }

    return { from, to: status };

}

// ===== 互換用ラッパー(既存コードの呼び出し方を変えずに済ませるため) =====
// mypage.js等、複数のファイルが「キャラクターIDの配列を返す」という
// この2関数の形をそのまま使っているため、戻り値の形は変えずに内部実装だけ
// 新しいcharacter_relationsを参照するよう差し替える。
// 「お気に入り」相当は、苦手以外で何らかの関係が設定されているキャラクターとみなす。

function getFavoriteCharacterIds() {
    return getCharacterIdsByStatus([
        RELATION_STATUS.MAIN,
        RELATION_STATUS.SUB,
        RELATION_STATUS.PRACTICING,
        RELATION_STATUS.INTERESTED
    ]);
}

function getWeakCharacterIds() {
    return getCharacterIdsByStatus(RELATION_STATUS.WEAK);
}

// ==========================================
// 匿名ユーザーID(Phase6-B、将来のサーバー連携に備えた土台)
// ==========================================
//
// ブラウザ単位で1つだけ生成される識別子。今は他のどのデータにも埋め込まれておらず、
// 参照している箇所も無い(現時点ではブラウザ内で完結しており、1ブラウザ=1匿名ユーザーが
// 自明なため)。将来、活動ログ等をサーバーへ送信する仕組みができた際に、
// 送信データへ付与するuser_id相当として使う想定。
//
// ==========================================

const ANONYMOUS_USER_ID_KEY = "sf6dna_anonymous_user_id";

/**
 * ブラウザ単位の匿名ユーザーIDを取得する(無ければ生成して保存する)
 * @returns {string}
 */
function getAnonymousUserId() {

    let id = localStorage.getItem(ANONYMOUS_USER_ID_KEY);
    if (id) return id;

    id = (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function")
        ? crypto.randomUUID()
        // crypto.randomUUIDが使えない古い環境向けの簡易フォールバック
        : `anon-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    localStorage.setItem(ANONYMOUS_USER_ID_KEY, id);
    return id;

}

// ==========================================
// データバージョン管理・マイグレーション(Phase6-B)
// ==========================================
//
// 目的:
//   今後もデータ構造の変更が発生し得るため、「今のデータが何世代目の構造か」を
//   sf6dna_data_version として保持し、ページを開くたびに現在のバージョンより
//   新しいマイグレーションだけを順番に適用する仕組みを用意する。
//
// 使い方:
//   DATA_MIGRATIONS配列に { version, migrate } を追加していくだけで、
//   将来のバージョン3・4…にも同じ仕組みで対応できる。
//
// 実行タイミング:
//   このファイル(site-constants.js)の末尾で1度だけ呼び出す。
//   各migrate関数は「まだ実行されていなければ実行する」前提のため、
//   ページを開くたびに呼び出しても、バージョンが追いついていれば何もしない
//   (=結果的に「1回だけ」実行される)。
//
// ==========================================

const DATA_VERSION_KEY = "sf6dna_data_version";
const CURRENT_DATA_VERSION = 2;

/**
 * Version1(旧データ形式)→Version2(character_relations統一)への移行
 *
 * 優先順位(旧データ同士が矛盾していた場合):
 *   1. 苦手(sf6dna_weak_characters)に含まれる → weak
 *   2. 5段階ステータス(sf6dna_status)に値がある → main/sub/interested
 *      (「使ってみたい」= 旧レベル4は、interestedへ統合する)
 *   3. お気に入り(sf6dna_favorite_characters)に含まれる → main
 *   4. どれにも該当しない → 何もしない(未設定のまま)
 *
 * 旧データは削除せず、そのまま残す(互換性維持期間のため)。
 * createdAt/updatedAtには、移行を実行した時点の日時を入れる
 * (旧データには変更日時の記録が無く、過去の正確な日時は再現できないため)。
 */
function migrateCharacterRelationsToV2() {

    const oldStatus = getLocalJSON("sf6dna_status", {});
    const oldFavorites = getLocalJSON("sf6dna_favorite_characters", []);
    const oldWeak = getLocalJSON("sf6dna_weak_characters", []);

    const oldStatusToNew = {
        1: RELATION_STATUS.MAIN,
        2: RELATION_STATUS.SUB,
        3: RELATION_STATUS.INTERESTED,
        4: RELATION_STATUS.INTERESTED // 「使ってみたい」は「気になる」へ統合
    };

    const relations = getLocalJSON(CHARACTER_RELATIONS_KEY, {});
    const now = new Date().toISOString();

    const characterIds = new Set([
        ...Object.keys(oldStatus),
        ...oldFavorites,
        ...oldWeak
    ]);

    characterIds.forEach(id => {

        let status = null;

        if (oldWeak.includes(id)) {
            status = RELATION_STATUS.WEAK;
        } else if (oldStatus[id] && oldStatusToNew[oldStatus[id]]) {
            status = oldStatusToNew[oldStatus[id]];
        } else if (oldFavorites.includes(id)) {
            status = RELATION_STATUS.MAIN;
        }

        if (status) {
            relations[id] = { status, createdAt: now, updatedAt: now };
        }

    });

    setLocalJSON(CHARACTER_RELATIONS_KEY, relations);

}

// バージョンごとのマイグレーション定義。今後Version3が必要になったら、
// { version: 3, migrate: 対応する関数 } をこの配列に追加するだけでよい。
const DATA_MIGRATIONS = [
    { version: 2, migrate: migrateCharacterRelationsToV2 }
];

/**
 * 現在のデータバージョンを確認し、必要なマイグレーションだけを順番に適用する
 */
function runDataMigrations() {

    // キー自体が無い場合(初めてこのサイトを訪れた場合、または本当に旧データが
    // 何も無い場合)は、Version1(初期状態)とみなす
    let version = parseInt(localStorage.getItem(DATA_VERSION_KEY), 10) || 1;

    DATA_MIGRATIONS
        .filter(m => m.version > version)
        .sort((a, b) => a.version - b.version)
        .forEach(m => {
            m.migrate();
            version = m.version;
            localStorage.setItem(DATA_VERSION_KEY, String(version));
        });

}

runDataMigrations();

// ==========================================
// 「今日のキャラクター」選定ロジック(お気に入り・苦手を優先する)
// ==========================================
//
// 優先順位: お気に入り登録済み > 苦手登録済み > 全キャラクターからランダム(日替わり)
// お気に入り・苦手を登録した瞬間から「今日のおすすめ」が変わることで、
// 登録する意味をその場で実感できるようにする狙い。
//
// characters-list.js / home.js / mypage.js から共通で呼び出す。
//
// ==========================================

/**
 * 「今日のキャラクター」のIDを1つ選ぶ
 *
 * mode="recommend"(既定): お気に入り優先(「好きなキャラを見る」体験)
 *   お気に入り登録済み > 苦手登録済み > 全キャラクターの優先順位
 *
 * mode="challenge": 苦手優先(「苦手キャラを克服する」体験)
 *   苦手登録済み > お気に入り登録済み > 全キャラクターの優先順位
 *
 * @param {Object} characterData - character-data.js のcharacterDataオブジェクト
 * @param {number} [salt=0] - 他の「今日のおすすめ」機能とズラすためのオフセット
 * @param {string} [mode="recommend"] - "recommend" | "challenge"
 * @returns {string|null} 選ばれたキャラクターID
 */
function pickDailyCharacterId(characterData, salt = 0, mode = "recommend") {

    if (!characterData) return null;

    const favorites = getFavoriteCharacterIds().filter(id => characterData[id]);
    const weak = getWeakCharacterIds().filter(id => characterData[id]);

    const primary = mode === "challenge" ? weak : favorites;
    const secondary = mode === "challenge" ? favorites : weak;

    if (primary.length > 0) return getDailyPick(primary, salt);
    if (secondary.length > 0) return getDailyPick(secondary, salt);

    return getDailyPick(Object.keys(characterData), salt);

}

/**
 * FAQ候補から1件選ぶ。苦手キャラクターが登録されている場合は、
 * 「対策」「コンボ」「練習」「勝てない」等、克服に関連しそうな質問を優先する。
 * (FAQ自体は特定キャラクター専用の内容を持たないため、キーワードによる
 *  優先度づけに留めている。存在しない専用FAQを捏造することはしない)
 *
 * @param {Array<{question:string, answer:string}>} faqList
 * @param {number} [salt=0]
 * @returns {Object|null}
 */
function pickDailyFaq(faqList, salt = 0) {

    if (!faqList || faqList.length === 0) return null;

    const hasWeak = getWeakCharacterIds().length > 0;

    if (hasWeak) {

        const keywords = /対策|コンボ|練習|勝てない/;
        const challengeRelated = faqList.filter(item => keywords.test(item.question + item.answer));

        if (challengeRelated.length > 0) {
            return getDailyPick(challengeRelated, salt);
        }

    }

    return getDailyPick(faqList, salt);

}

// ==========================================
// 成長記録・比較の共通ロジック(Phase6-C修正)
// ==========================================
//
// 背景:
//   home.js(index.html)とmypage.jsが、同じ sf6dna_score_history を使いながら
//   それぞれ独自に「比較の基準」を実装しており、ページによって表示内容が
//   矛盾する状態になっていた(index.htmlは前回の記録と比較、mypageは
//   記録開始日と比較)。この2つを1つの関数に統一する。
//
// 使い方:
//   index.html・mypage.htmlの両方から getGrowthComparison(score, weakestAxis) を
//   呼び出すだけでよい。比較の基準(「前回」にするか「開始日」にするか)を
//   将来変更したくなった場合も、この関数の中身を1箇所直すだけで両ページに反映される。
//
// ==========================================

const SCORE_HISTORY_KEY = "sf6dna_score_history";
const SCORE_HISTORY_MAX_ENTRIES = 30;

/**
 * 今日のスコアを sf6dna_score_history に記録する(その日にまだ記録が無い場合のみ)。
 * 既に記録済みの日に複数回呼び出しても、二重に記録されることはない。
 *
 * @param {Object} currentScore - 8軸のスコアオブジェクト(sf6dna_scoreと同じ形)
 * @returns {Array} 記録後の履歴配列(古い順)
 */
function recordScoreHistory(currentScore) {

    const today = new Date().toISOString().slice(0, 10);
    let history = getLocalJSON(SCORE_HISTORY_KEY, []);

    const alreadyLoggedToday = history.some(entry => entry.date === today);

    if (!alreadyLoggedToday) {
        history.push({ date: today, score: currentScore });
        if (history.length > SCORE_HISTORY_MAX_ENTRIES) {
            history = history.slice(history.length - SCORE_HISTORY_MAX_ENTRIES);
        }
        setLocalJSON(SCORE_HISTORY_KEY, history);
    }

    return history;

}

/**
 * 「前回の記録」との成長比較を算出する(index.html・mypage.html共通)
 *
 * @param {Object} currentScore - 8軸のスコアオブジェクト
 * @param {string|null} weakestAxis - 比較対象とする軸(弱点軸)
 * @returns {{axis:string, currentScore:number, diff:number, diffText:string, diffClass:string, comparisonDate:string}|null}
 *   比較できない場合(記録が1件以下、弱点軸が無い、前回データが壊れている等)はnull。
 *   呼び出し側は、nullの場合に「記録を開始しました」等の空状態を表示すること。
 */
function getGrowthComparison(currentScore, weakestAxis) {

    if (!weakestAxis || !currentScore) return null;

    const history = recordScoreHistory(currentScore);

    if (history.length <= 1) return null;

    // historyは古い順に並んでいるため、末尾(今日)の1つ前が「前回の記録」にあたる
    const previous = history[history.length - 2];
    const previousScore = previous.score && previous.score[weakestAxis];

    if (typeof previousScore !== "number") return null;

    const currentAxisScore = currentScore[weakestAxis];
    const diff = currentAxisScore - previousScore;

    return {
        axis: weakestAxis,
        currentScore: currentAxisScore,
        diff,
        diffText: diff > 0 ? `+${diff}` : `${diff}`,
        diffClass: diff > 0 ? "home-growth-up" : (diff < 0 ? "home-growth-down" : "home-growth-flat"),
        comparisonDate: previous.date
    };

}
