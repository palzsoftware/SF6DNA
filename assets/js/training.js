// ==========================================
// 練習メニュー画面のロジック
// ==========================================
//
// 1. localStorageから診断結果(sf6dna_score / sf6dna_result)を読み込む
// 2. 8軸のスコアのうち、最も低い2軸を「重点的に練習すべき軸」とする
// 3. training-menu-data.js から該当軸のドリルを取得して表示する
//    (データが無い軸は resultData の weaknesses にフォールバックする)
// 4. 完了チェックを localStorage(sf6dna_training_progress)に保存する
//
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const noDiagnosisSection = document.getElementById("noDiagnosisSection");
    const trainingContent = document.getElementById("trainingContent");
    const trainingResultType = document.getElementById("trainingResultType");
    const axisSummaryArea = document.getElementById("axisSummaryArea");
    const trainingMenuArea = document.getElementById("trainingMenuArea");

    // ===== 8軸の日本語ラベル(診断結果ページの表記に合わせる) =====
    const axisLabels = {
        aggressive: "攻撃",
        defensive: "守り",
        zoning: "牽制",
        balanced: "バランス",
        reading: "読み合い",
        combo: "コンボ",
        strategy: "戦略",
        instinct: "直感"
    };

    const difficultyLabels = {
        beginner: "初級",
        intermediate: "中級",
        advanced: "上級"
    };

    // ===== 1. 診断結果の読み込み =====
    const result = localStorage.getItem("sf6dna_result");
    const score = JSON.parse(localStorage.getItem("sf6dna_score") || "null");

    // スコアが無い(診断未実施)場合は、診断への導線だけを表示して終了する
    if (!score || typeof score !== "object") {
        noDiagnosisSection.style.display = "";
        trainingContent.style.display = "none";
        return;
    }

    noDiagnosisSection.style.display = "none";
    trainingContent.style.display = "";

    // ===== 2. スコアが低い軸を2つ特定する =====
    const sortedAxes = Object.keys(score)
        .filter(axis => axisLabels[axis]) // 想定外のキーが紛れ込んでいても安全に無視する
        .sort((a, b) => score[a] - score[b]);

    const weakAxes = sortedAxes.slice(0, 2);

    // ===== タイプ表示 =====
    if (result && typeof resultData !== "undefined" && resultData[result]) {
        trainingResultType.textContent = `あなたの診断タイプ: ${resultData[result].name}`;
    }

    // ===== 軸のスコアサマリーを表示 =====
    axisSummaryArea.innerHTML = weakAxes.map(axis => `
        <div class="axis-summary-card">
            <p class="axis-summary-label">${axisLabels[axis]}</p>
            <p class="axis-summary-score">${score[axis]}<span class="axis-summary-max"> / 5</span></p>
        </div>
    `).join("");

    // ===== 3. 完了状況(進捗)の読み込み =====
    // キー: ドリルID、値: { completedCount, lastCompletedAt }
    function loadProgress() {
        try {
            return JSON.parse(localStorage.getItem("sf6dna_training_progress") || "{}");
        } catch (err) {
            // 万一データが壊れていた場合も、練習メニュー自体は表示できるようにする
            console.warn("[training] 進捗データの読み込みに失敗しました", err);
            return {};
        }
    }

    function saveProgress(progress) {
        localStorage.setItem("sf6dna_training_progress", JSON.stringify(progress));
    }

    function formatDate(isoString) {
        const d = new Date(isoString);
        return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
    }

    // ===== ドリルの取得(データが無い軸はテキストのフォールバックを使う) =====
    function getDrillsForAxis(axis) {
        if (trainingMenuData[axis] && trainingMenuData[axis].length > 0) {
            return trainingMenuData[axis];
        }
        return []; // データが無い場合は空配列。フォールバック表示は描画側で行う
    }

    // ===== 4. ドリルの描画 =====
    let html = "";

    weakAxes.forEach(axis => {

        const drills = getDrillsForAxis(axis);

        if (drills.length === 0) {

            // ドリルデータがまだ無い軸は、診断結果の weaknesses テキスト(先頭の1件)にフォールバックする
            let fallbackText = null;
            if (result && typeof resultData !== "undefined" && resultData[result]) {
                const firstWeakness = resultData[result].weaknesses[0];
                fallbackText = firstWeakness ? firstWeakness.improve : null;
            }

            html += `
                <div class="training-card training-card-fallback">
                    <p class="training-axis-badge">${axisLabels[axis]}</p>
                    <p class="training-fallback-text">
                        ${fallbackText || "この軸の練習メニューは現在準備中です。"}
                    </p>
                </div>
            `;

            return;

        }

        drills.forEach(drill => {

            html += `
                <div class="training-card" data-drill-id="${drill.id}">

                    <div class="training-card-header">
                        <p class="training-axis-badge">${axisLabels[drill.axis] || drill.axis}</p>
                        <p class="training-difficulty-badge">${difficultyLabels[drill.difficulty] || drill.difficulty}</p>
                    </div>

                    <h3 class="training-title">${drill.title}</h3>

                    <p class="training-reason">
                        <span class="training-label">この練習をする理由</span>
                        ${drill.reason}
                    </p>

                    <p class="training-purpose">
                        <span class="training-label">目的</span>
                        ${drill.purpose}
                    </p>

                    <div class="training-steps">
                        <span class="training-label">手順</span>
                        <ol>
                            ${drill.steps.map(step => `<li>${step}</li>`).join("")}
                        </ol>
                    </div>

                    <p class="training-target">
                        <span class="training-label">目標</span>
                        ${drill.targetReps}
                    </p>

                    <div class="training-card-footer">

                        <span class="training-duration">
                            所要時間目安: ${drill.durationMinutes}分
                        </span>

                        <div class="training-video-area" data-search-query="${drill.searchQuery}">
                            <!-- 動画リンクは非同期で後から挿入される -->
                        </div>

                    </div>

                    <div class="training-progress-area">
                        <button type="button" class="btn btn-secondary btn-small training-complete-button" data-drill-id="${drill.id}">
                            完了にする
                        </button>
                        <span class="training-progress-status" data-drill-id="${drill.id}"></span>
                    </div>

                </div>
            `;

        });

    });

    trainingMenuArea.innerHTML = html;

    // ===== 完了状況の表示を更新する =====
    function renderProgressStatus(drillId) {

        const progress = loadProgress();
        const entry = progress[drillId];
        const statusEl = trainingMenuArea.querySelector(`.training-progress-status[data-drill-id="${drillId}"]`);

        if (!statusEl) return;

        if (entry && entry.completedCount > 0) {
            statusEl.textContent = `✓ ${entry.completedCount}回完了(最終: ${formatDate(entry.lastCompletedAt)})`;
        } else {
            statusEl.textContent = "";
        }

    }

    // 初期表示時に、既に完了記録があるドリルの状況を表示する
    trainingMenuArea.querySelectorAll(".training-complete-button").forEach(button => {
        renderProgressStatus(button.dataset.drillId);
    });

    // ===== 完了ボタンのクリック処理 =====
    trainingMenuArea.addEventListener("click", (e) => {

        const button = e.target.closest(".training-complete-button");
        if (!button) return;

        const drillId = button.dataset.drillId;
        const progress = loadProgress();

        const current = progress[drillId] || { completedCount: 0, lastCompletedAt: null };

        progress[drillId] = {
            completedCount: current.completedCount + 1,
            lastCompletedAt: new Date().toISOString()
        };

        saveProgress(progress);
        renderProgressStatus(drillId);

    });

    // ===== 参考動画の取得(video-search.jsの共通関数を利用) =====
    const VIDEO_API_BASE_URL = "https://sf6dna-backend.onrender.com";

    async function loadDrillVideo(area) {

        const query = area.dataset.searchQuery;
        if (!query) return;

        const queries = [query, `${query} コツ`];

        const results = await fetchVideosWithQueryRetry(VIDEO_API_BASE_URL, queries, 1);

        if (results && results.length > 0) {

            area.innerHTML = `
                <a class="training-video-link" href="${results[0].url}" target="_blank" rel="noopener">
                    参考動画を見る ↗
                </a>
            `;

        } else {

            // APIが未設定/失敗/0件の場合は、YouTube検索リンクにフォールバックする
            const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

            area.innerHTML = `
                <a class="training-video-link" href="${searchUrl}" target="_blank" rel="noopener">
                    YouTubeで検索する ↗
                </a>
            `;

        }

    }

    trainingMenuArea.querySelectorAll(".training-video-area").forEach(area => {
        loadDrillVideo(area);
    });

});
