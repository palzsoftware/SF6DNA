// ==========================================
// ホームページ ダッシュボードロジック(Phase1改善版)
// ==========================================
//
// 設計方針:
//   - 診断済みユーザーには「ダッシュボード」として、レベル/今日のあなたへ/
//     成長/実績/最近見た項目を優先表示する
//   - 未診断ユーザーには、サービス価値の説明+診断への単一のCTAのみを表示する
//   - Primaryボタン(強調されたボタン)は、画面内に常に1つだけになるようにする
//   - 捏造データは表示しない。正確に算出できない指標(連続日数の完全な履歴等)は、
//     算出できる範囲の指標に置き換えるか、正直な空状態を表示する
//   - 「今日のあなたへ」ブロックは、将来API/AIに差し替えられるよう、
//     データ取得部分(getDailyPick等)を独立した関数として分離している
//
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const heroArea = document.getElementById("homeHero");
    const dailySection = document.getElementById("homeDailySection");
    const dailyArea = document.getElementById("homeDailyArea");
    const growthSection = document.getElementById("homeGrowthSection");
    const growthArea = document.getElementById("homeGrowthArea");
    const badgeSection = document.getElementById("homeBadgeSection");
    const badgeArea = document.getElementById("homeBadgeArea");
    const recentSection = document.getElementById("homeRecentSection");
    const recentCharacterArea = document.getElementById("homeRecentCharacterArea");
    const recentPlayerArea = document.getElementById("homeRecentPlayerArea");
    const valueSection = document.getElementById("homeValueSection");

    // ===== localStorageの読み込み =====
    const score = JSON.parse(localStorage.getItem("sf6dna_score") || "null");
    const result = localStorage.getItem("sf6dna_result");
    const diagnosisMode = localStorage.getItem("sf6dna_diagnosis_mode") || "beginner";

    let trainingProgress = {};
    try {
        trainingProgress = JSON.parse(localStorage.getItem("sf6dna_training_progress") || "{}");
    } catch (err) {
        console.warn("[home] 練習進捗データの読み込みに失敗しました", err);
    }

    const isDiagnosed = !!(score && typeof score === "object");

    // ===== 練習実績の集計(実データのみ) =====
    const progressEntries = Object.values(trainingProgress);

    const totalCompletions = progressEntries.reduce(
        (sum, entry) => sum + (entry.completedCount || 0),
        0
    );

    let lastPracticeDate = null;
    progressEntries.forEach(entry => {
        if (!entry.lastCompletedAt) return;
        const d = new Date(entry.lastCompletedAt);
        if (!lastPracticeDate || d > lastPracticeDate) {
            lastPracticeDate = d;
        }
    });

    function daysAgo(date) {
        const diffMs = Date.now() - date.getTime();
        return Math.floor(diffMs / (1000 * 60 * 60 * 24));
    }

    // ===== レベル/XPの算出(既存データのみから計算する簡易ルール) =====
    const xp =
        (isDiagnosed ? 50 : 0) +
        (totalCompletions * 10) +
        (diagnosisMode === "advanced" ? 30 : 0);

    const level = Math.floor(xp / 100) + 1;
    const xpIntoLevel = xp % 100;

    // ===== 弱点軸の特定(training.jsと同じロジック) =====
    function getWeakestAxis() {

        if (!isDiagnosed || typeof trainingMenuData === "undefined") return null;

        const axisScoreEntries = Object.entries(score)
            .filter(([axis]) => trainingMenuData[axis]);

        if (axisScoreEntries.length === 0) return null;

        axisScoreEntries.sort((a, b) => a[1] - b[1]);
        return axisScoreEntries[0][0];

    }

    // ===== 日替わりの選択ロジック =====
    // 「今日」を基準に、配列やオブジェクトから1件だけ決定的に選ぶ。
    // 将来この関数の中身をAPI呼び出しに差し替えるだけで、
    // 呼び出し側(下のrenderDailySection等)は変更不要な設計にしている。
    function getDayIndex(poolLength) {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 0);
        const dayOfYear = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24));
        return dayOfYear % poolLength;
    }

    function getDailyCharacterId() {
        if (typeof characterData === "undefined") return null;
        const ids = Object.keys(characterData);
        if (ids.length === 0) return null;
        return ids[getDayIndex(ids.length)];
    }

    function getDailyTip() {
        if (typeof dailyTipsData === "undefined" || dailyTipsData.length === 0) return null;
        return dailyTipsData[getDayIndex(dailyTipsData.length)];
    }

    // ===== ヒーローの描画 =====
    if (!isDiagnosed) {

        heroArea.innerHTML = `
            <p class="home-hero-eyebrow">SF6 DNA PLATFORM</p>
            <h1>あなたのSF6を、次のレベルへ</h1>
            <p class="home-hero-lead">診断・図鑑・練習メニューがひとつになった、成長のためのプラットフォーム</p>
            <a href="diagnosis.html" class="home-btn home-btn-primary">診断をはじめる</a>
        `;

        valueSection.style.display = "";

    } else {

        const typeName = (typeof resultData !== "undefined" && resultData[result])
            ? resultData[result].name
            : "";

        const lastPracticeText = lastPracticeDate
            ? (daysAgo(lastPracticeDate) === 0 ? "今日練習しました" : `最終練習: ${daysAgo(lastPracticeDate)}日前`)
            : "まだ練習記録がありません";

        heroArea.innerHTML = `
            <p class="home-hero-eyebrow">Lv.${level} ・ ${typeName}</p>
            <h1>おかえりなさい</h1>
            <div class="home-hero-xpbar">
                <div class="home-hero-xpbar-fill" style="width:${xpIntoLevel}%;"></div>
            </div>
            <p class="home-hero-xptext">次のレベルまで あと${100 - xpIntoLevel}XP</p>
            <div class="home-hero-status">
                <span><i class="ti ti-target-arrow" aria-hidden="true"></i>累計練習 ${totalCompletions}回</span>
                <span><i class="ti ti-calendar" aria-hidden="true"></i>${lastPracticeText}</span>
            </div>
            <a href="training.html" class="home-btn home-btn-primary">今日の練習をする</a>
        `;

        dailySection.style.display = "";
        growthSection.style.display = "";
        badgeSection.style.display = "";
        recentSection.style.display = "";

        renderDailySection();
        renderGrowthSection();
        renderRecentSection();

    }

    // ===== 今日のあなたへ(日替わりコンテンツ) =====
    function renderDailySection() {

        const dailyCharId = getDailyCharacterId();
        const dailyChar = dailyCharId && typeof characterData !== "undefined" ? characterData[dailyCharId] : null;
        const weakestAxis = getWeakestAxis();
        const weakestDrill = weakestAxis && trainingMenuData[weakestAxis] ? trainingMenuData[weakestAxis][0] : null;
        const tip = getDailyTip();

        const tiles = [];

        tiles.push(`
            <a href="${dailyChar ? `character.html?id=${dailyCharId}` : "characters.html"}" class="home-daily-tile home-daily-tile-clickable">
                <p class="home-daily-tile-label"><i class="ti ti-star" aria-hidden="true"></i>今日のおすすめキャラクター</p>
                <p class="home-daily-tile-body">${dailyChar ? dailyChar.name : "図鑑を見てみましょう"}</p>
                <span class="home-daily-tile-arrow"><i class="ti ti-arrow-right" aria-hidden="true"></i></span>
            </a>
        `);

        tiles.push(`
            <a href="training.html" class="home-daily-tile home-daily-tile-clickable">
                <p class="home-daily-tile-label"><i class="ti ti-target-arrow" aria-hidden="true"></i>今日の練習</p>
                <p class="home-daily-tile-body">${weakestDrill ? weakestDrill.title : "練習メニューを見てみましょう"}</p>
                <span class="home-daily-tile-arrow"><i class="ti ti-arrow-right" aria-hidden="true"></i></span>
            </a>
        `);

        tiles.push(`
            <div class="home-daily-tile home-daily-tile-static">
                <p class="home-daily-tile-label"><i class="ti ti-bulb" aria-hidden="true"></i>今日のワンポイント</p>
                <p class="home-daily-tile-body">${tip || "準備中です"}</p>
            </div>
        `);

        tiles.push(`
            <div class="home-daily-tile home-daily-tile-static" id="homeDailyVideoTile">
                <p class="home-daily-tile-label"><i class="ti ti-player-play" aria-hidden="true"></i>今日のおすすめ動画</p>
                <p class="home-daily-tile-body">読み込み中…</p>
            </div>
        `);

        dailyArea.innerHTML = tiles.join("");

        loadDailyVideo(dailyChar ? dailyChar.name : "ストリートファイター6 初心者");

    }

    async function loadDailyVideo(queryBase) {

        const VIDEO_API_BASE_URL = "https://sf6dna-backend.onrender.com";
        const queries = [`${queryBase} 立ち回り ストリートファイター6`, "ストリートファイター6 初心者 講座"];

        const results = await fetchVideosWithQueryRetry(VIDEO_API_BASE_URL, queries, 1);

        const tile = document.getElementById("homeDailyVideoTile");
        if (!tile) return;

        if (results && results.length > 0) {

            const video = results[0];
            const wrapper = document.createElement("a");
            wrapper.href = video.url;
            wrapper.target = "_blank";
            wrapper.rel = "noopener";
            wrapper.className = "home-daily-tile home-daily-tile-clickable home-daily-tile-video";
            wrapper.innerHTML = `
                <p class="home-daily-tile-label"><i class="ti ti-player-play" aria-hidden="true"></i>今日のおすすめ動画</p>
                <p class="home-daily-tile-body">${video.title}</p>
                <span class="home-daily-tile-arrow"><i class="ti ti-arrow-right" aria-hidden="true"></i></span>
            `;
            tile.replaceWith(wrapper);

        } else {

            tile.querySelector(".home-daily-tile-body").textContent = "現在おすすめ動画はありません";

        }

    }

    // ===== 最近の成長 =====
    // score-history をこのページで少しずつ蓄積し、次回以降の訪問で比較できるようにする
    function renderGrowthSection() {

        const HISTORY_KEY = "sf6dna_score_history";
        const today = new Date().toISOString().slice(0, 10);

        let history = [];
        try {
            history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
        } catch (err) {
            history = [];
        }

        const alreadyLoggedToday = history.some(entry => entry.date === today);

        if (!alreadyLoggedToday) {
            history.push({ date: today, score });
            if (history.length > 30) history = history.slice(history.length - 30);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        }

        const weakestAxis = getWeakestAxis();
        const axisLabel = {
            aggressive: "攻撃", defensive: "守り", zoning: "牽制", balanced: "バランス",
            reading: "読み合い", combo: "コンボ", strategy: "戦略", instinct: "直感"
        };

        if (history.length <= 1 || !weakestAxis) {

            growthArea.innerHTML = `
                <p class="home-growth-empty">記録を開始しました。次回以降の訪問から、成長の推移を表示します。</p>
            `;
            return;

        }

        const earliest = history[0];
        const earliestScore = earliest.score && earliest.score[weakestAxis];
        const currentScore = score[weakestAxis];

        if (typeof earliestScore !== "number") {

            growthArea.innerHTML = `
                <p class="home-growth-empty">記録を開始しました。次回以降の訪問から、成長の推移を表示します。</p>
            `;
            return;

        }

        const diff = currentScore - earliestScore;
        const diffText = diff > 0 ? `+${diff}` : `${diff}`;
        const diffClass = diff > 0 ? "home-growth-up" : (diff < 0 ? "home-growth-down" : "home-growth-flat");

        growthArea.innerHTML = `
            <p class="home-growth-axis">${axisLabel[weakestAxis] || weakestAxis}のスコア</p>
            <p class="home-growth-value">
                ${currentScore}<span class="home-growth-diff ${diffClass}">(${diffText})</span>
            </p>
            <p class="home-growth-note">記録開始日(${earliest.date})との比較</p>
        `;

    }

    // ===== 最近見たキャラクター/プレイヤー =====
    // 現時点では、character.html / player.html 側に閲覧履歴を記録する仕組みが
    // まだ無いため、正直な空状態を表示する(Phase3でそれらのページに着手する際、
    // 閲覧時に sf6dna_recent_characters / sf6dna_recent_players へ記録する処理を追加し、
    // ここを実データ表示に差し替える想定)
    function renderRecentSection() {

        recentCharacterArea.innerHTML = `
            <p class="home-recent-empty-text">まだ閲覧履歴がありません。</p>
            <a href="characters.html" class="home-ghost-link">図鑑を見る <i class="ti ti-arrow-right" aria-hidden="true"></i></a>
        `;

        recentPlayerArea.innerHTML = `
            <p class="home-recent-empty-text">まだ閲覧履歴がありません。</p>
            <a href="players.html" class="home-ghost-link">図鑑を見る <i class="ti ti-arrow-right" aria-hidden="true"></i></a>
        `;

    }

    // ===== 実績バッジ(常に描画。診断済みの場合のみセクション表示) =====
    if (isDiagnosed) {

        const badgeDefs = [
            {
                icon: "ti-flag",
                title: "はじめの一歩",
                condition: isDiagnosed,
                hint: "診断を1回受ける"
            },
            {
                icon: "ti-target",
                title: "継続の証",
                condition: totalCompletions >= 5,
                hint: `練習を5回完了する(現在${totalCompletions}回)`
            },
            {
                icon: "ti-crown",
                title: "皆伝の心",
                condition: diagnosisMode === "advanced",
                hint: "上級診断を受ける"
            }
        ];

        badgeArea.innerHTML = badgeDefs.map(badge => `
            <div class="home-badge ${badge.condition ? "home-badge-unlocked" : "home-badge-locked"}">
                <i class="ti ${badge.condition ? badge.icon : "ti-lock"}" aria-hidden="true"></i>
                <p class="home-badge-title">${badge.title}</p>
                <p class="home-badge-hint">${badge.condition ? "達成済み" : badge.hint}</p>
            </div>
        `).join("");

    }

});
