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
    const score = getLocalJSON("sf6dna_score", null);
    const result = localStorage.getItem("sf6dna_result");
    const diagnosisMode = localStorage.getItem("sf6dna_diagnosis_mode") || "beginner";

    const trainingProgress = getLocalJSON("sf6dna_training_progress", {});

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
    // 「今日」を基準に、配列やオブジェクトから1件だけ決定的に選ぶ処理は
    // assets/js/site-constants.js の getDailyIndex() / getDailyPick() に一本化している。

    function getDailyCharacterId() {
        if (typeof characterData === "undefined") return null;
        return pickDailyCharacterId(characterData, 0);
    }

    function getDailyTip() {
        if (typeof dailyTipsData === "undefined" || dailyTipsData.length === 0) return null;
        return dailyTipsData[getDailyIndex(dailyTipsData.length, 1)];
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

        // ストリーク(連続活動日数)。以前はmypage.htmlにしか表示しておらず、
        // サイトを開いた瞬間に見えないと「あと1日で途切れる」という気づきに
        // 繋がらないため、訪問時に必ず目に入るindex.htmlのヒーローにも表示する(Phase6-C)
        const streakDays = typeof getStreakDays === "function" ? getStreakDays() : 0;
        // mypage.jsの表現(絵文字)と統一する。Tabler Iconsの ti-flame は
        // このプロジェクトの他箇所で使用実績が無く、見た目の一貫性と
        // 表示保証の両面から、既存のmypage.jsと同じ絵文字表現に揃える。
        const streakText = streakDays > 0 ? `<span class="home-hero-streak">🔥 ${streakDays}日連続</span>` : "";

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
                ${streakText}
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
    // 比較ロジック自体は site-constants.js の getGrowthComparison() に一本化した
    // (以前はhome.js/mypage.jsそれぞれが独自に「比較の基準」を実装しており、
    //  ページによって表示内容が矛盾していたため)
    function renderGrowthSection() {

        const weakestAxis = getWeakestAxis();
        const comparison = (typeof getGrowthComparison === "function")
            ? getGrowthComparison(score, weakestAxis)
            : null;

        if (!comparison) {

            growthArea.innerHTML = `
                <p class="home-growth-empty">記録を開始しました。次回以降の訪問から、成長の推移を表示します。</p>
            `;
            return;

        }

        growthArea.innerHTML = `
            <p class="home-growth-axis">${AXIS_LABELS[comparison.axis] || comparison.axis}のスコア</p>
            <p class="home-growth-value">
                ${comparison.currentScore}<span class="home-growth-diff ${comparison.diffClass}">(${comparison.diffText})</span>
            </p>
            <p class="home-growth-note">前回の記録(${comparison.comparisonDate})との比較</p>
        `;

    }

    // ===== 最近見たキャラクター/プレイヤー =====
    // Phase6-Bでcharacter.html/player.htmlに閲覧記録(CHARACTER_VIEW/PLAYER_VIEW)を
    // 追加したため、そのデータを活動ログから読み出して表示する(Phase6-C)。
    // 以前はここに記録の仕組みが無く、常に空状態を表示していた。
    function renderRecentSection() {

        function renderRecentList(area, viewType, resolve, browseHref) {

            const emptyHtml = `
                <p class="home-recent-empty-text">まだ閲覧履歴がありません。</p>
                <a href="${browseHref}" class="home-ghost-link">図鑑を見る <i class="ti ti-arrow-right" aria-hidden="true"></i></a>
            `;

            if (typeof getActivityLogSince !== "function" || typeof ACTIVITY_TYPES === "undefined") {
                area.className = "home-recent-empty";
                area.innerHTML = emptyHtml;
                return;
            }

            // 直近30日分の活動ログから、指定した種類(CHARACTER_VIEW/PLAYER_VIEW)だけを、
            // 新しい順・重複を除いて最大4件抽出する
            const log = getActivityLogSince(30);
            const seenIds = new Set();
            const recentIds = [];

            for (let i = log.length - 1; i >= 0 && recentIds.length < 4; i--) {

                const actions = log[i].actions;

                for (let j = actions.length - 1; j >= 0 && recentIds.length < 4; j--) {

                    const action = actions[j];
                    if (action.type !== viewType || seenIds.has(action.target)) continue;

                    seenIds.add(action.target);
                    recentIds.push(action.target);

                }

            }

            const items = recentIds.map(resolve).filter(Boolean);

            if (items.length === 0) {
                area.className = "home-recent-empty";
                area.innerHTML = emptyHtml;
                return;
            }

            area.className = "home-recent-list";
            area.innerHTML = items.map(item => `
                <a href="${item.href}" class="home-recent-item">
                    ${item.image
                        ? `<img src="${item.image}" alt="${item.name}">`
                        : `<span class="home-recent-fallback">${item.name.charAt(0)}</span>`
                    }
                    <span>${item.name}</span>
                </a>
            `).join("");

        }

        renderRecentList(
            recentCharacterArea,
            ACTIVITY_TYPES.CHARACTER_VIEW,
            (id) => {
                const c = typeof characterData !== "undefined" ? characterData[id] : null;
                if (!c) return null;
                return { href: `character.html?id=${id}`, image: c.image, name: c.name };
            },
            "characters.html"
        );

        renderRecentList(
            recentPlayerArea,
            ACTIVITY_TYPES.PLAYER_VIEW,
            (id) => {
                const p = typeof playerData !== "undefined" ? playerData[id] : null;
                if (!p) return null;
                return { href: `player.html?id=${id}`, image: p.image, name: p.name };
            },
            "players.html"
        );

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

    renderMarquee();

});

// ===== キャラクター/プレイヤーの横スクロール演出(Phase3-B) =====
// CSSのアニメーション(@keyframes marqueeScroll)でループさせるため、
// JS側は要素を2セット並べて継ぎ目なくループできるようにするだけでよい。
function renderMarquee() {

    const charArea = document.getElementById("homeMarqueeCharacters");
    const playerArea = document.getElementById("homeMarqueePlayers");

    if (charArea && typeof characterData !== "undefined") {

        const chars = Object.values(characterData).slice(0, 12);
        const itemsHtml = chars.map(c => `
            <img src="${c.image}" alt="${c.name}" class="home-marquee-item" loading="lazy">
        `).join("");

        // 同じ内容を2回並べて、ループ時の継ぎ目を目立たなくする
        charArea.innerHTML = itemsHtml + itemsHtml;

    }

    if (playerArea && typeof playerData !== "undefined") {

        const players = Object.values(playerData).filter(p => p.image).slice(0, 12);

        if (players.length > 0) {

            const itemsHtml = players.map(p => `
                <img src="${p.image}" alt="${p.name}" class="home-marquee-item home-marquee-item-round" loading="lazy">
            `).join("");

            playerArea.innerHTML = itemsHtml + itemsHtml;

        }

    }

}
