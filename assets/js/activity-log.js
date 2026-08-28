// ==========================================
// 活動ログ(sf6dna_activity_log)
// ==========================================
//
// 目的:
//   「何を」「いつ」やったかを日付単位で記録する基盤。
//   現時点ではストリーク(連続活動日数)表示のためだけに使うが、
//   将来的に以下の機能でも同じデータをそのまま再利用する前提で設計している。
//     - デイリークエスト(その日にやった/やっていないの判定)
//     - 週次・月次レポート(期間内の行動を種類別に集計)
//     - 目標設定・達成率(「今週の練習4日」等の達成判定)
//
// データ構造:
//
//   sf6dna_activity_log = [
//       {
//           date: "2026-08-01",              // YYYY-MM-DD(ローカル日付)
//           actions: [
//               {
//                   type: "training",         // 行動の種類(下記ACTIVITY_TYPES参照)
//                   target: "reading",        // 何を対象にしたか(軸ID/キャラID/質問文など)
//                   label: "対空やガードの意識", // 画面表示用のラベル(集計時に文言を再構築しなくて済むよう保持)
//                   timestamp: "2026-08-01T10:23:00.000Z" // 記録した正確な日時(ISO文字列)
//               },
//               ...
//           ]
//       },
//       ...
//   ]
//
// 設計方針:
//   - 「日付ごとに1エントリ、その中に複数actions」という構造にすることで、
//     ストリーク計算(その日に何かやったか)がO(1)で判定でき、
//     週次・月次集計も「対象期間のエントリをフィルタするだけ」で済む
//   - typeは文字列の列挙(下記ACTIVITY_TYPES)とし、将来種類が増えても
//     配列に追加するだけで対応できるようにしている
//   - 180日より古いエントリは、記録・読み込みのたびに自動で間引かれる
//     (localStorageの容量肥大化を防ぐため。180日あれば月次レポート
//      6ヶ月分は十分にカバーできる想定)
//
// ==========================================

const ACTIVITY_LOG_KEY = "sf6dna_activity_log";
const ACTIVITY_LOG_RETENTION_DAYS = 180;

// 行動(イベント)の種類。将来ここに追加するだけで拡張できる。
//
// 注意: TRAINING/VIDEO/FAQ/DIAGNOSISの値("training"等)は、mypage.jsの
// デイリークエスト・週次レポート機能が文字列として直接参照している(既存の実装)。
// そのため、これらの値は今回変更していない(値を変えると集計が壊れるため)。
// mypage.js側をACTIVITY_TYPES参照に統一するリファクタは、Phase6-Cの提案として
// 別途まとめている(既存機能を壊さずに対応するには影響範囲の精査が必要なため)。
const ACTIVITY_TYPES = {
    TRAINING: "training",              // 練習メニューの完了
    VIDEO: "video",                    // 動画を開いた
    FAQ: "faq",                        // FAQを開いた
    DIAGNOSIS: "diagnosis",            // 診断を完了した
    CHARACTER_VIEW: "character_view",  // キャラクター詳細ページを開いた(Phase6-B)
    PLAYER_VIEW: "player_view",        // プレイヤー詳細ページを開いた(Phase6-B)
    RELATION_CHANGE: "character_relation_change", // キャラクターとの関係ステータスが変化した(Phase6-B)。
                                                     // 「今の状態」はsite-constants.jsのcharacter_relationsが持ち、
                                                     // 「いつ何から何に変わったか」はこちらに記録する(責務分離)
    NEXT_ACTION_CLICK: "next_action_click" // 「次にすること」導線のクリック(Phase6-A)。
                                             // どの導線がよく使われているかを、将来レコメンド機能の
                                             // 判断材料として集計できるようにするための種別。
};

// ==========================================
// metadataの推奨キー(分析基盤を意識した命名の統一)
// ==========================================
//
// recordActivity()のmetadataは自由なオブジェクトのままにしているが(イベントの種類ごとに
// 必要な項目が異なるため、型を固定すると逆に窮屈になる)、集計のしやすさのために
// 「使うなら、このキー名を使う」という推奨命名を以下にまとめておく。
// 新しいイベントを追加する際は、まずこの一覧に無いか確認してから項目名を決めること。
//
//   entityType      : 対象の種類("character" / "player" 等)
//   entityId        : 対象のID
//   sourcePage      : 表示していたページの固定ID(例: "character_detail")
//   sourceFeature    : ページ内のどの機能経由か(例: "next_actions" / "today_recommendation")
//   diagnosisType    : 診断の種類・モード(例: "beginner" / "advanced")
//   relationStatus   : キャラクターとの関係ステータス(RELATION_STATUSのいずれか)
//   from / to        : 状態が変化した場合の変化前後の値
//   recommendReason  : レコメンド経由の場合、その理由(例: "type_weak_matchup" / "favorite_character")
//
// ==========================================

/**
 * 今日の日付をYYYY-MM-DD形式で取得する(ローカルタイムゾーン基準)
 */
function getTodayDateString() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

/**
 * 活動ログを読み込む(読み込み時に180日より古いエントリを自動で間引く)
 * @returns {Array}
 */
function getActivityLog() {

    // site-constants.js の getLocalJSON() に集約された共通の
    // 「JSON安全読み込み」処理を利用する(このファイル単体でも動くよう、
    // 読み込まれていない場合は最低限のフォールバックを用意している)
    const log = (typeof getLocalJSON === "function")
        ? getLocalJSON(ACTIVITY_LOG_KEY, [])
        : JSON.parse(localStorage.getItem(ACTIVITY_LOG_KEY) || "[]");

    return pruneActivityLog(log);

}

/**
 * 180日より古いエントリを取り除く
 * @param {Array} log
 * @returns {Array} 間引き後のログ(呼び出し側で保存するかは任意)
 */
function pruneActivityLog(log) {

    if (!Array.isArray(log)) return [];

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - ACTIVITY_LOG_RETENTION_DAYS);

    return log.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= cutoff;
    });

}

function saveActivityLog(log) {

    if (typeof setLocalJSON === "function") {
        setLocalJSON(ACTIVITY_LOG_KEY, log);
    } else {
        localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(log));
    }

}

/**
 * 今日の活動を1件記録する
 *
 * @param {string} type - ACTIVITY_TYPES のいずれか(自由な文字列も可。将来の拡張を妨げないため)
 * @param {string} target - 対象(キャラID・軸ID・質問文等)
 * @param {string} [label] - 画面表示用のラベル。省略時はtargetをそのまま使う
 * @param {Object} [metadata] - 任意の付加情報(省略可)。
 *   例: { source: "today_recommendation" } … 「今日のおすすめ」経由での実行か
 *       { quest: true }                    … デイリークエストの対象だったか
 *       { goalId: "weekly_training_4" }    … 目標設定機能の対象だったか
 *   将来の機能(デイリークエスト・目標設定等)が、既存の記録処理を変更せずに
 *   「実行元」や「紐付く目標」を後から追加で判別できるようにするための項目。
 *   未指定の場合はactionにmetadataキー自体を含めない(既存データとの互換性を保つため)。
 */
function recordActivity(type, target, label, metadata) {

    if (!type || !target) return;

    const log = getActivityLog();
    const today = getTodayDateString();

    let todayEntry = log.find(entry => entry.date === today);

    if (!todayEntry) {
        todayEntry = { date: today, actions: [] };
        log.push(todayEntry);
    }

    const action = {
        type,
        target,
        label: label || target,
        timestamp: new Date().toISOString()
    };

    // metadataは任意項目。指定が無い場合はキー自体を持たせず、
    // 既存の(metadataを持たない)過去データと構造を揃える。
    if (metadata && typeof metadata === "object") {
        action.metadata = metadata;
    }

    todayEntry.actions.push(action);

    saveActivityLog(log);

}

/**
 * 現在の連続活動日数(ストリーク)を計算する。
 * 「今日」または「昨日」から遡って、活動が途切れずに続いている日数を数える。
 * (今日まだ何もしていない場合でも、昨日までストリークが続いていれば
 *  「継続中」として扱う。今日何もしないまま日をまたぐとリセットされる)
 *
 * @returns {number}
 */
function getStreakDays() {

    const log = getActivityLog();
    if (log.length === 0) return 0;

    const activeDates = new Set(log.map(entry => entry.date));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 今日の活動が無い場合は、昨日を起点にする(今日はまだ終わっていないため)
    let cursor = new Date(today);
    if (!activeDates.has(getTodayDateString())) {
        cursor.setDate(cursor.getDate() - 1);
    }

    let streak = 0;

    while (true) {

        const y = cursor.getFullYear();
        const m = String(cursor.getMonth() + 1).padStart(2, "0");
        const d = String(cursor.getDate()).padStart(2, "0");
        const dateStr = `${y}-${m}-${d}`;

        if (!activeDates.has(dateStr)) break;

        streak++;
        cursor.setDate(cursor.getDate() - 1);

    }

    return streak;

}

/**
 * 指定した日数分さかのぼった範囲の活動ログを取得する
 * (週次・月次レポートの実装時に利用する想定)
 *
 * @param {number} days - 何日前まで遡るか(今日を含む)
 * @returns {Array}
 */
function getActivityLogSince(days) {

    const log = getActivityLog();

    const cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - (days - 1));

    return log.filter(entry => new Date(entry.date) >= cutoff);

}

/**
 * 指定した種類(type)ごとの行動件数を集計する
 * (週次レポート「動画5本・練習4日」等の実装時に利用する想定)
 *
 * @param {Array} log - getActivityLogSince() 等で絞り込んだログ
 * @returns {Object} { activeDays: 5, totalActions: 18, training: 6, video: 5, faq: 4, diagnosis: 3, ... }
 *   activeDays   … 対象期間中、何かしら活動した日数(ログのエントリ数と同じ)
 *   totalActions … 対象期間中の全アクション件数の合計(種類を問わない)
 *   それ以外のキーは、action.typeごとの件数
 */
function summarizeActivityLog(log) {

    const summary = {
        activeDays: 0,
        totalActions: 0
    };

    if (!Array.isArray(log)) return summary;

    summary.activeDays = log.length;

    log.forEach(entry => {
        entry.actions.forEach(action => {
            summary[action.type] = (summary[action.type] || 0) + 1;
            summary.totalActions++;
        });
    });

    return summary;

}
