// ==========================================
// マイページのロジック
// ==========================================
//
// 「自分専用のSF6DNAホーム画面」として、以下を1画面に集約する。
//   - 今日のあなたへのアドバイス(ルールベース、AIは使わない)
//   - レベル/XP/連続練習の状況
//   - 最近の診断結果
//   - 今日のおすすめ練習
//   - 今日見るべき動画
//   - 成長履歴
//   - お気に入り(キャラクター/プレイヤー)
//
// 既存のホームページ(home.js)のロジック・localStorageキーをそのまま再利用し、
// 新しいデータ構造は極力増やさない方針で実装している。
//
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const emptySection = document.getElementById("mypageEmptySection");
    const content = document.getElementById("mypageContent");

    const score = JSON.parse(localStorage.getItem("sf6dna_score") || "null");
    const result = localStorage.getItem("sf6dna_result");
    const diagnosisMode = localStorage.getItem("sf6dna_diagnosis_mode") || "beginner";

    const isDiagnosed = !!(score && typeof score === "object");

    if (!isDiagnosed) {
        emptySection.style.display = "";
        content.style.display = "none";
        return;
    }

    emptySection.style.display = "none";
    content.style.display = "";

    const trainingProgress = getLocalJSON("sf6dna_training_progress", {});

    const progressEntries = Object.values(trainingProgress);
    const totalCompletions = progressEntries.reduce((sum, e) => sum + (e.completedCount || 0), 0);

    let lastPracticeDate = null;
    progressEntries.forEach(entry => {
        if (!entry.lastCompletedAt) return;
        const d = new Date(entry.lastCompletedAt);
        if (!lastPracticeDate || d > lastPracticeDate) lastPracticeDate = d;
    });

    function daysAgo(date) {
        return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    }

    // ===== レベル/XP(home.jsと同じ算出ルール) =====
    const xp = 50 + (totalCompletions * 10) + (diagnosisMode === "advanced" ? 30 : 0);
    const level = Math.floor(xp / 100) + 1;
    const xpIntoLevel = xp % 100;

    const typeName = (typeof resultData !== "undefined" && resultData[result]) ? resultData[result].name : "";

    document.getElementById("mypageGreeting").textContent = `おかえりなさい(Lv.${level})`;
    document.getElementById("mypageLevel").textContent = `Lv.${level} ・ ${typeName}`;
    document.getElementById("mypageXpBar").style.width = `${xpIntoLevel}%`;

    // 連続活動日数(ストリーク)は活動ログ(training/video/faq/diagnosis等の総合)から算出する。
    // 練習の完了だけを見ていた従来の表示より、実際の利用実態に近いストリークになる。
    const streakDays = typeof getStreakDays === "function" ? getStreakDays() : 0;
    const streakText = streakDays > 0 ? `🔥 ${streakDays}日連続` : "";
    const lastPracticeText = lastPracticeDate
        ? (daysAgo(lastPracticeDate) === 0 ? "今日練習しました" : `最終練習: ${daysAgo(lastPracticeDate)}日前`)
        : "まだ練習記録がありません";

    document.getElementById("mypageStreakText").textContent = streakText
        ? `${streakText} ・ ${lastPracticeText}`
        : lastPracticeText;

    // ===== 弱点軸の特定(training.js / home.jsと同じロジック) =====
    function getWeakestAxis() {
        if (typeof trainingMenuData === "undefined") return null;
        const entries = Object.entries(score).filter(([axis]) => trainingMenuData[axis]);
        if (entries.length === 0) return null;
        entries.sort((a, b) => a[1] - b[1]);
        return entries[0][0];
    }

    const weakestAxis = getWeakestAxis();

    // ===== 最近の診断結果 =====
    const resultArea = document.getElementById("mypageResultArea");
    if (resultArea && typeof resultData !== "undefined" && resultData[result]) {
        resultArea.innerHTML = `
            <p class="mypage-result-type">${resultData[result].name}</p>
            <p class="mypage-result-desc">${resultData[result].description || ""}</p>
            <a href="result.html?view=1" class="mypage-card-link">詳しく見る <i class="ti ti-arrow-right" aria-hidden="true"></i></a>
        `;
    }

    // ===== 今日のおすすめ練習(苦手キャラクターが登録されていれば、その対策を意識する文脈を追加) =====
    const trainingArea = document.getElementById("mypageTrainingArea");
    const weakestDrill = (weakestAxis && typeof trainingMenuData !== "undefined" && trainingMenuData[weakestAxis])
        ? trainingMenuData[weakestAxis][0]
        : null;

    const weakCharacterIds = getWeakCharacterIds().filter(id => typeof characterData !== "undefined" && characterData[id]);
    const challengeCharacter = weakCharacterIds.length > 0 && typeof characterData !== "undefined"
        ? characterData[getDailyPick(weakCharacterIds, 8)]
        : null;

    if (trainingArea) {

        if (weakestDrill) {

            const challengeNote = challengeCharacter
                ? `<p class="mypage-training-challenge"><i class="ti ti-flag" aria-hidden="true"></i>苦手な${challengeCharacter.name}との対戦を意識しながら練習してみましょう</p>`
                : "";

            trainingArea.innerHTML = `
                <p class="mypage-training-title">${weakestDrill.title}</p>
                <p class="mypage-training-reason">${weakestDrill.reason}</p>
                ${challengeNote}
                <a href="training.html" class="mypage-card-link">練習メニューへ <i class="ti ti-arrow-right" aria-hidden="true"></i></a>
            `;

        } else {
            trainingArea.innerHTML = `<p class="mypage-empty">練習メニューを見てみましょう</p><a href="training.html" class="mypage-card-link">練習メニューへ</a>`;
        }
    }

    // ===== 成長履歴 =====
    // 比較ロジックはsite-constants.jsのgetGrowthComparison()に一本化(Phase6-C修正)。
    // これにより、index.htmlと全く同じ基準・同じ文言で「前回の記録」との比較が表示される。
    const growthArea = document.getElementById("mypageGrowthArea");

    if (growthArea) {

        const growthComparison = (typeof getGrowthComparison === "function")
            ? getGrowthComparison(score, weakestAxis)
            : null;

        if (!growthComparison) {
            growthArea.innerHTML = `<p class="mypage-empty">記録を蓄積中です。数日後に成長の推移が表示されます。</p>`;
        } else {
            growthArea.innerHTML = `
                <p class="mypage-result-type">${AXIS_LABELS[growthComparison.axis] || growthComparison.axis}: ${growthComparison.currentScore}<span class="home-growth-diff ${growthComparison.diffClass}">(${growthComparison.diffText})</span></p>
                <p class="mypage-training-reason">前回の記録(${growthComparison.comparisonDate})との比較</p>
            `;
        }

    }

    // ===== 今日見るべき動画 =====
    loadTodayVideo();

    // ===== 今日のキャラクター/プレイヤー/FAQ =====
    // 「今日のあなたへのアドバイス」等とsaltをズラし、偏りを避ける
    renderTodayCharacter();
    renderTodayPlayer();
    renderTodayFaq();

    function renderTodayCharacter() {

        const area = document.getElementById("mypageTodayCharacterArea");
        if (!area || typeof characterData === "undefined") return;

        const dailyId = pickDailyCharacterId(characterData, 0, "recommend");
        const c = dailyId ? characterData[dailyId] : null;

        if (!c) {
            area.innerHTML = `<p class="mypage-empty">準備中です</p>`;
            return;
        }

        area.innerHTML = `
            <p class="mypage-result-type">${c.name}</p>
            <a href="character.html?id=${dailyId}" class="mypage-card-link">詳しく見る <i class="ti ti-arrow-right" aria-hidden="true"></i></a>
        `;

    }

    function renderTodayPlayer() {

        const area = document.getElementById("mypageTodayPlayerArea");
        if (!area || typeof playerData === "undefined") return;

        const players = Object.values(playerData);
        const p = getDailyPick(players, 3);

        if (!p) {
            area.innerHTML = `<p class="mypage-empty">準備中です</p>`;
            return;
        }

        area.innerHTML = `
            <p class="mypage-result-type">${p.name}</p>
            <a href="player.html?id=${p.id}" class="mypage-card-link">詳しく見る <i class="ti ti-arrow-right" aria-hidden="true"></i></a>
        `;

    }

    function renderTodayFaq() {

        const area = document.getElementById("mypageTodayFaqArea");
        if (!area || typeof faqDataForToday === "undefined") return;

        const item = pickDailyFaq(faqDataForToday, 4);

        if (!item) {
            area.innerHTML = `<p class="mypage-empty">準備中です</p>`;
            return;
        }

        area.innerHTML = `
            <p class="mypage-result-type">${item.question}</p>
            <p class="mypage-training-reason">${item.answer}</p>
            <a href="faq.html" class="mypage-card-link">FAQ一覧へ <i class="ti ti-arrow-right" aria-hidden="true"></i></a>
        `;

    }

    async function loadTodayVideo() {

        const area = document.getElementById("mypageVideoArea");
        if (!area) return;

        area.innerHTML = `<p class="mypage-empty">読み込み中…</p>`;

        const VIDEO_API_BASE_URL = "https://sf6dna-backend.onrender.com";

        // 苦手キャラクターが登録されていれば、その対策動画を優先して探す
        // (「苦手を克服する」体験を動画レコメンドにも反映する)
        const baseQuery = challengeCharacter
            ? `${challengeCharacter.name} 対策 ストリートファイター6`
            : (weakestDrill ? weakestDrill.searchQuery : "ストリートファイター6 初心者 講座");

        const queries = [baseQuery, "ストリートファイター6 初心者 講座"];

        const results = await fetchVideosWithQueryRetry(VIDEO_API_BASE_URL, queries, 1);

        if (results && results.length > 0) {
            area.innerHTML = renderVideoCardHtml(results[0], { variant: "compact" });
        } else {
            area.innerHTML = renderVideoSearchFallbackHtml(queries[0], "YouTubeで探す");
        }

        // 「今日のおすすめ動画」経由のクリックだけを判別できるよう、
        // metadata.source="today_recommendation" を付けて記録する
        // (character.htmlの通常の動画タブでのクリックとは区別するため)
        if (typeof recordActivity === "function") {

            const link = area.querySelector("a");

            if (link) {
                link.addEventListener("click", () => {
                    recordActivity(
                        ACTIVITY_TYPES.VIDEO,
                        challengeCharacter ? challengeCharacter.id : "daily_recommendation",
                        "今日のおすすめ動画",
                        { source: "today_recommendation" }
                    );
                }, { once: true });
            }

        }

    }

    // ===== お気に入り =====
    // getFavoriteCharacterIds()/getWeakCharacterIds()は、Phase6-Bで
    // character_relations(統一ステータス)を参照するよう内部実装が更新されている。
    // 以前は旧キー(sf6dna_favorite_characters等)を直接読んでいたが、そのままだと
    // 新しいステータスの変更が反映されなくなるため、この2箇所は必ずこの関数経由にする。
    renderFavorites(getFavoriteCharacterIds(), "mypageFavoriteCharacters", (id) => {
        const c = typeof characterData !== "undefined" ? characterData[id] : null;
        if (!c) return null;
        return { href: `character.html?id=${id}`, image: c.image, name: c.name };
    }, "characters.html");

    renderFavorites(getWeakCharacterIds(), "mypageWeakCharacters", (id) => {
        const c = typeof characterData !== "undefined" ? characterData[id] : null;
        if (!c) return null;
        return { href: `character.html?id=${id}`, image: c.image, name: c.name };
    }, "characters.html");

    renderFavorites(getLocalJSON("sf6dna_favorite_players", []), "mypageFavoritePlayers", (id) => {
        const p = typeof playerData !== "undefined" ? playerData[id] : null;
        if (!p) return null;
        return { href: `player.html?id=${id}`, image: p.image, name: p.name };
    }, "players.html");

    renderFavoriteVideos();
    renderFavoriteFaq();

    function renderFavoriteVideos() {

        const area = document.getElementById("mypageFavoriteVideos");
        if (!area) return;

        const videos = getLocalJSON("sf6dna_favorite_videos", []);

        if (videos.length === 0) {
            area.innerHTML = `<p class="mypage-empty">まだ登録されていません。キャラクター図鑑の動画からハートボタンで追加できます。</p>`;
            return;
        }

        area.innerHTML = videos.map(v => `
            <a href="${v.url}" target="_blank" rel="noopener" class="mypage-favorite-item">
                <img src="${v.thumbnail}" alt="${v.title}">
                <span>${v.title}</span>
            </a>
        `).join("");

    }

    function renderFavoriteFaq() {

        const area = document.getElementById("mypageFavoriteFaq");
        if (!area) return;

        const questions = getLocalJSON("sf6dna_favorite_faq", []);

        if (questions.length === 0) {
            area.innerHTML = `<p class="mypage-empty">まだ登録されていません。<a href="faq.html" class="mypage-card-link">FAQを見てみる</a></p>`;
            return;
        }

        area.innerHTML = questions.map(q => `<p class="mypage-favorite-faq-item">${q}</p>`).join("");

    }

    function renderFavorites(ids, areaId, resolve, browseHref) {

        const area = document.getElementById(areaId);
        if (!area) return;

        const items = (ids || []).map(resolve).filter(Boolean);

        if (items.length === 0) {
            area.innerHTML = `<p class="mypage-empty">まだ登録されていません。<a href="${browseHref}" class="mypage-card-link">見てみる</a></p>`;
            return;
        }

        area.innerHTML = items.map(item => `
            <a href="${item.href}" class="mypage-favorite-item">
                ${item.image
                    ? `<img src="${item.image}" alt="${item.name}">`
                    : `<span class="mypage-favorite-fallback">${item.name.charAt(0)}</span>`
                }
                <span>${item.name}</span>
            </a>
        `).join("");

    }

    // ===== 今日のあなたへのアドバイス(ルールベース。AIは使用しない) =====
    renderTodayAdvice();

    // ===== 今日のクエスト(Phase4-B③) =====
    renderDailyQuests();

    // ===== 週次・月次レポート(Phase4-B⑤) =====
    // activity-log.jsのgetActivityLogSince()/summarizeActivityLog()をそのまま利用する
    renderActivityReport(7);

    document.querySelectorAll(".mypage-report-tab").forEach(tab => {

        tab.addEventListener("click", () => {

            document.querySelectorAll(".mypage-report-tab").forEach(t => t.classList.remove("mypage-report-tab-active"));
            tab.classList.add("mypage-report-tab-active");

            renderActivityReport(Number(tab.dataset.range));

        });

    });

    function renderActivityReport(days) {

        const area = document.getElementById("mypageReportArea");
        if (!area) return;

        if (typeof getActivityLogSince !== "function" || typeof summarizeActivityLog !== "function") {
            area.innerHTML = `<p class="mypage-empty">レポート機能を準備中です</p>`;
            return;
        }

        const log = getActivityLogSince(days);
        const summary = summarizeActivityLog(log);

        if (summary.totalActions === 0) {
            area.innerHTML = `<p class="mypage-empty">この期間の活動記録がまだありません。練習や動画視聴を記録すると、ここに集計が表示されます。</p>`;
            return;
        }

        const typeLabels = {
            training: { icon: "ti-target-arrow", label: "練習" },
            video: { icon: "ti-player-play", label: "動画視聴" },
            faq: { icon: "ti-help-circle", label: "FAQ閲覧" },
            diagnosis: { icon: "ti-clipboard-list", label: "診断" }
        };

        const statCards = Object.keys(typeLabels)
            .filter(type => summary[type])
            .map(type => `
                <div class="mypage-report-stat">
                    <i class="ti ${typeLabels[type].icon}" aria-hidden="true"></i>
                    <span class="mypage-report-stat-value">${summary[type]}</span>
                    <span class="mypage-report-stat-label">${typeLabels[type].label}</span>
                </div>
            `).join("");

        area.innerHTML = `
            <div class="mypage-report-summary">
                <p class="mypage-report-headline">
                    活動日数 <strong>${summary.activeDays}</strong>日 / ${days}日中 ・ 合計 <strong>${summary.totalActions}</strong>件
                </p>
            </div>
            <div class="mypage-report-stats">
                ${statCards || `<p class="mypage-empty">内訳データがありません</p>`}
            </div>
        `;

    }

    function hasActivityToday(type, target) {

        const log = (typeof getActivityLog === "function") ? getActivityLog() : [];
        const today = (typeof getTodayDateString === "function") ? getTodayDateString() : "";

        const entry = log.find(e => e.date === today);
        if (!entry) return false;

        return entry.actions.some(a => a.type === type && (target === undefined || a.target === target));

    }

    // 「今日のおすすめ」経由(metadata.source==="today_recommendation")の活動が
    // 今日あったかどうかを判定する(通常ページからの閲覧では達成にならないようにするため)
    function hasTodayRecommendationActivity(type) {

        const log = (typeof getActivityLog === "function") ? getActivityLog() : [];
        const today = (typeof getTodayDateString === "function") ? getTodayDateString() : "";

        const entry = log.find(e => e.date === today);
        if (!entry) return false;

        return entry.actions.some(a =>
            a.type === type &&
            a.metadata &&
            a.metadata.source === "today_recommendation"
        );

    }

    function renderDailyQuests() {

        const listEl = document.getElementById("mypageQuestList");
        const progressEl = document.getElementById("mypageQuestProgress");
        const completeEl = document.getElementById("mypageQuestComplete");
        if (!listEl) return;

        // 5カテゴリの中から、日替わりで3つを選ぶ(salt=10。他の「今日のおすすめ」機能と重複しないオフセット)
        // 上級診断が実施済みの場合、診断クエストは「達成済みを毎日表示」ではなく
        // 候補プール自体から除外する(未実施ユーザーだけに表示する仕様)
        const isAdvancedDone = diagnosisMode === "advanced";
        const categoryPool = isAdvancedDone
            ? ["training", "video", "faq", "recommendation"]
            : ["training", "video", "faq", "diagnosis", "recommendation"];

        const startIdx = (typeof getDailyIndex === "function") ? getDailyIndex(categoryPool.length, 10) : 0;
        const categories = [0, 1, 2].map(i => categoryPool[(startIdx + i) % categoryPool.length]);

        const quests = categories.map(buildQuestForCategory).filter(Boolean);

        listEl.innerHTML = quests.map(q => `
            <li class="mypage-quest-item ${q.completed ? "mypage-quest-item-done" : ""}">
                <a href="${q.href}">
                    <i class="ti ${q.completed ? "ti-square-check" : "ti-square"}" aria-hidden="true"></i>
                    <span>${q.label}</span>
                </a>
            </li>
        `).join("");

        const doneCount = quests.filter(q => q.completed).length;
        progressEl.textContent = `${doneCount} / ${quests.length}`;

        if (completeEl) {
            completeEl.style.display = (doneCount === quests.length && quests.length > 0) ? "" : "none";
        }

    }

    function buildQuestForCategory(category) {

        if (category === "training") {

            return {
                label: weakestDrill ? `今日の練習「${weakestDrill.title}」を完了する` : "練習メニューを1件完了する",
                href: "training.html",
                completed: hasActivityToday("training")
            };

        }

        if (category === "video") {

            return {
                label: "今日のおすすめ動画を見る",
                href: "#mypageVideoArea",
                completed: hasTodayRecommendationActivity("video")
            };

        }

        if (category === "faq") {

            return {
                label: "今日のFAQを1件読む",
                href: "faq.html",
                completed: hasActivityToday("faq")
            };

        }

        if (category === "diagnosis") {

            // このカテゴリは上級診断が未実施の場合のみ候補プールに含まれる(常に「未実施」の状態で呼ばれる)
            return {
                label: "上級診断に挑戦する",
                href: "diagnosis.html?mode=advanced",
                completed: false
            };

        }

        if (category === "recommendation") {

            const dailyCharId = (typeof pickDailyCharacterId === "function" && typeof characterData !== "undefined")
                ? pickDailyCharacterId(characterData, 0, "recommend")
                : null;
            const dailyChar = dailyCharId && typeof characterData !== "undefined" ? characterData[dailyCharId] : null;

            return {
                label: dailyChar ? `今日のおすすめキャラ「${dailyChar.name}」を確認する` : "今日のおすすめを確認する",
                href: dailyChar ? `character.html?id=${dailyCharId}` : "characters.html",
                // 今日その対象(キャラ)に関する動画クリック等の活動があれば達成とみなす
                completed: dailyCharId ? hasActivityToday("video", dailyCharId) : false
            };

        }

        return null;

    }

    function renderTodayAdvice() {

        const el = document.getElementById("mypageAdvice");
        if (!el) return;

        // 条件を満たすアドバイス候補を集め、日付ベースで1つを選ぶ
        // (同じ日にページを開き直しても同じ助言が出るよう、ランダムではなく日付から決定的に選ぶ)
        const candidates = [];

        const axisAdviceMap = {
            reading: "今日は対空やガードの意識を高めてみましょう。読み合いの精度が変わってきます。",
            defensive: "今日は反撃されない距離を意識する練習がおすすめです。",
            combo: "今日はコンボ練習に時間を使ってみましょう。1つの技を確実に出すことから始めてOKです。",
            aggressive: "今日は攻めの選択肢を1つ増やすことを意識してみましょう。",
            zoning: "今日は間合い管理を意識した立ち回りを試してみましょう。",
            balanced: "今日は攻めと守りのバランスを意識した立ち回りをしてみましょう。",
            strategy: "今日は試合後に「何をされたか」を1つだけ振り返ってみましょう。",
            instinct: "今日はとっさの判断を早くする練習を試してみましょう。"
        };

        if (weakestAxis && axisAdviceMap[weakestAxis]) {
            candidates.push(axisAdviceMap[weakestAxis]);
        }

        const favoritePlayers = getLocalJSON("sf6dna_favorite_players", []);

        if (favoritePlayers.length > 0 && typeof playerData !== "undefined") {
            const pid = favoritePlayers[getDailyIndex(favoritePlayers.length, 5)];
            const p = playerData[pid];
            if (p) {
                candidates.push(`今日はお気に入りの${p.name}選手の試合を見てみましょう。`);
            }
        }

        const favoriteCharacters = getFavoriteCharacterIds();

        if (favoriteCharacters.length > 0 && typeof characterData !== "undefined") {
            const cid = favoriteCharacters[getDailyIndex(favoriteCharacters.length, 6)];
            const c = characterData[cid];
            if (c) {
                candidates.push(`今日はお気に入りの${c.name}のコンボ動画を1本見てみましょう。`);
            }
        }

        // 苦手キャラクターが登録されていれば、克服のための助言も候補に加える
        if (weakCharacterIds.length > 0 && typeof characterData !== "undefined") {
            const wid = weakCharacterIds[getDailyIndex(weakCharacterIds.length, 9)];
            const w = characterData[wid];
            if (w) {
                candidates.push(`今日は苦手な${w.name}への対策を1つ調べてみましょう。`);
            }
        }

        if (candidates.length === 0) {
            candidates.push("今日はまず練習メニューを1つ試してみましょう。");
        }

        // 複数の候補があれば、日付から決定的に1つを選ぶ(毎日少しずつ違う助言になる)
        // salt=7を使い、他の「今日のおすすめ」機能と重ならないようにしている
        const chosen = candidates[getDailyIndex(candidates.length, 7)];
        el.textContent = chosen;

    }

});
