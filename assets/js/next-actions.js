// ==========================================
// 「次にすること」共通コンポーネント(汎用エンジン)
// ==========================================
//
// 目的:
//   情報を読んだ後に、次にとってほしい行動(練習する/対策を見る等)を
//   ページ末尾に提示する。既存ページ同士のリンクを再配置するだけで、
//   新しいデータやページを増やさずに実現する(docs/PHASE6_ACTION_DESIGN.md参照)。
//
// 設計方針(Phase6-Aレビューで見直し):
//   このファイルは「UIの描画」と「クリックの記録」のみを行う、
//   対象(Character/Player/Team/...)を一切知らない汎用エンジンとする。
//   Character固有のロジック(お気に入り/苦手の判定、FAQのキーワードマッチング等)は
//   このファイルに置かず、character-next-actions.js のように対象ごとの
//   専用ファイルへ分離する。
//   Phase6-Bで対象を追加する際は、同じ形式のbuildXxxNextActions()を
//   専用ファイルに追加し、このファイルのrenderNextActions()をそのまま呼び出す。
//
// config の形式(renderNextActionsの第2引数):
//   {
//       heading: "次にすること",        // 省略可
//       entityType: "character",         // 対象の種類(分析用。呼び出し側が決める)
//       entityId: "ryu",                  // 対象のID(分析用)
//       sourcePage: "character_detail",   // このコンポーネントを表示しているページの固定ID。
//                                          // URLから自動生成せず、呼び出し側が明示的に渡す
//                                          // (URL構造が変わっても記録データの表記が
//                                          //  揺れないようにするため)
//       statusSnapshot: {                 // 省略可。クリック時点の状態を記録したい場合に渡す
//           isFavorite: true,             // 例: お気に入り登録済みかどうか
//           isWeak: false                  // 例: 苦手登録済みかどうか
//       },                                 // キー名はこのファイル側では一切解釈せず、
//                                          // そのままdata属性化・記録データ化するだけ
//                                          // (対象ごとに項目が変わっても対応できるようにするため)
//       actions: [
//           { id, icon, label, description, href, tone }
//       ]
//   }
//
// 将来のデータベース化・ユーザー分析を見据えた設計:
//   クリックの記録は、activity-log.js の recordActivity() をそのまま利用する。
//   新しいlocalStorageキーは増やさない(記録先を一本化しておくことで、
//   将来サーバー側DBへ移行する際も「活動ログ」1つのテーブル設計で済む)。
//   記録するキー名(actionId/entityType/entityId/sourcePage/statusSnapshot)は、
//   将来的にDBの列名としてそのまま使えることを意識した命名にしている。
//
// ==========================================


/**
 * キャメルケースのキー名をケバブケースへ変換する(data属性名を作るため)
 * 例: "isFavorite" → "is-favorite"
 * @param {string} key
 * @returns {string}
 */
function camelToKebab(key) {
    return key.replace(/([A-Z])/g, "-$1").toLowerCase();
}


/**
 * dataset経由で取得したキー名(例: "statusIsFavorite")から、
 * 先頭の接頭辞(例: "status")を取り除き、元のキー名(例: "isFavorite")を復元する
 * @param {string} datasetKey
 * @param {string} prefix
 * @returns {string}
 */
function stripDatasetPrefix(datasetKey, prefix) {
    const stripped = datasetKey.slice(prefix.length);
    return stripped.charAt(0).toLowerCase() + stripped.slice(1);
}


/**
 * 「次にすること」セクションを描画する(対象を問わない汎用処理)
 *
 * @param {string} containerId - 描画先要素のid(空のdiv等を想定)
 * @param {Object} config - 上記「configの形式」を参照
 */
function renderNextActions(containerId, config) {

    const container = document.getElementById(containerId);
    if (!container) return;

    if (!config || !Array.isArray(config.actions) || config.actions.length === 0) {
        // 表示できるアクションが無い場合は、空セクションを残さない
        container.innerHTML = "";
        return;
    }

    const heading = config.heading || "次にすること";
    const entityType = config.entityType || "";
    const entityId = config.entityId || "";
    const sourcePage = config.sourcePage || "";
    const statusSnapshot = config.statusSnapshot || {};

    // statusSnapshotの各キーを data-status-* 属性として全アクション共通で埋め込む。
    // ここではキーの「意味」は一切解釈しない(isFavoriteという名前を知っているのは
    // character-next-actions.js側だけでよく、このエンジンは知らなくてよい)
    const statusAttrsHtml = Object.keys(statusSnapshot)
        .map(key => `data-status-${camelToKebab(key)}="${statusSnapshot[key]}"`)
        .join(" ");

    const itemsHtml = config.actions.map(action => {

        const toneClass = action.tone === "primary" ? " next-actions-item-primary" : "";

        const descriptionHtml = action.description
            ? `<span class="next-actions-desc">${action.description}</span>`
            : "";

        return `
            <a
                href="${action.href}"
                class="next-actions-item${toneClass}"
                data-action-id="${action.id}"
                data-entity-type="${entityType}"
                data-entity-id="${entityId}"
                data-source-page="${sourcePage}"
                ${statusAttrsHtml}
            >
                <span class="next-actions-icon" aria-hidden="true">${action.icon || ""}</span>
                <span class="next-actions-text">
                    <span class="next-actions-label">${action.label}</span>
                    ${descriptionHtml}
                </span>
            </a>
        `;

    }).join("");

    container.innerHTML = `
        <h2 class="next-actions-heading">${heading}</h2>
        <div class="next-actions-list">
            ${itemsHtml}
        </div>
    `;

    setupNextActionsLogging(container);

}


/**
 * 「次にすること」内のリンククリックを活動ログへ記録する(1コンテナにつき1回だけ登録すればよいよう、
 * イベント委任(クリックをリスト全体で受け止める)方式にしている)
 *
 * @param {HTMLElement} container
 */
function setupNextActionsLogging(container) {

    if (typeof recordActivity !== "function") return;

    container.addEventListener("click", (e) => {

        const item = e.target.closest("[data-action-id]");
        if (!item) return;

        const actionId = item.dataset.actionId;
        const entityType = item.dataset.entityType || null;
        const entityId = item.dataset.entityId || null;
        const sourcePage = item.dataset.sourcePage || null;

        // targetには「実際にクリックされたリンクの文言」を保存する。
        // (about.jsのFAQクリック記録など、既存のrecordActivityの使われ方と
        //  一貫性を持たせるため。詳細は metadata.actionId/entityId 側で判別できる)
        const labelEl = item.querySelector(".next-actions-label");
        const targetLabel = labelEl ? labelEl.textContent.trim() : actionId;

        // data-status-* 属性を statusSnapshot オブジェクトへ復元する。
        // どんなキーが来るかをこのエンジン側では決め打ちしない。
        const statusSnapshot = {};
        Object.keys(item.dataset).forEach(datasetKey => {
            if (datasetKey.startsWith("status") && datasetKey !== "status") {
                const key = stripDatasetPrefix(datasetKey, "status");
                statusSnapshot[key] = item.dataset[datasetKey] === "true";
            }
        });

        recordActivity(
            ACTIVITY_TYPES.NEXT_ACTION_CLICK,
            targetLabel,
            targetLabel,
            {
                actionId,
                entityType,
                entityId,
                sourcePage,
                statusSnapshot
            }
        );

    });

}
