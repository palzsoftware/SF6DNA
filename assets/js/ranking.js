// ==========================================
// ランキングページのロジック
// ==========================================
//
// rankingCategories(ranking-data.js)の設定に沿って各カテゴリを描画する。
// dataSourceが"computed"のものは既存データから計算し、
// "comingSoon"のものは正直に準備中と表示する(実データが無いものを
// 捏造して「人気」と称することはしない)。
//
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const area = document.getElementById("rankingArea");
    if (!area || typeof rankingCategories === "undefined") return;

    area.innerHTML = rankingCategories.map(cat => `
        <section class="ranking-category">
            <h2 class="ranking-category-title">
                <i class="ti ${cat.icon}" aria-hidden="true"></i>
                ${cat.title}
            </h2>
            <p class="ranking-category-desc">${cat.description}</p>
            <div id="ranking-${cat.id}" class="ranking-list"></div>
        </section>
    `).join("");

    rankingCategories.forEach(cat => {

        if (cat.dataSource === "computed" && cat.id === "player-achievements") {
            renderPlayerAchievementRanking();
        } else if (cat.dataSource === "comingSoon") {
            renderComingSoon(cat.id);
        }

    });

});

function renderPlayerAchievementRanking() {

    const container = document.getElementById("ranking-player-achievements");
    if (!container || typeof playerData === "undefined") return;

    const ranked = Object.values(playerData)
        .filter(p => Array.isArray(p.achievements) && p.achievements.length > 0)
        .sort((a, b) => b.achievements.length - a.achievements.length)
        .slice(0, 10);

    if (ranked.length === 0) {
        container.innerHTML = `<p class="ranking-empty">データがありません</p>`;
        return;
    }

    container.innerHTML = ranked.map((p, i) => `
        <a href="player.html?id=${p.id}" class="ranking-row">
            <span class="ranking-rank ${i < 3 ? "ranking-rank-top" : ""}">${i + 1}</span>
            ${p.image
                ? `<img src="${p.image}" alt="${p.name}" class="ranking-avatar">`
                : `<span class="ranking-avatar ranking-avatar-fallback">${p.name.charAt(0)}</span>`
            }
            <span class="ranking-name">${p.name}</span>
            <span class="ranking-value">実績 ${p.achievements.length}件</span>
        </a>
    `).join("");

}

function renderComingSoon(categoryId) {

    const container = document.getElementById(`ranking-${categoryId}`);
    if (!container) return;

    container.innerHTML = `
        <div class="ranking-comingsoon">
            <i class="ti ti-hourglass-empty" aria-hidden="true"></i>
            <span>Coming Soon</span>
        </div>
    `;

}
