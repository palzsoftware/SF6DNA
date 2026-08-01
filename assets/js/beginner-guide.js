// ==========================================
// 初心者ガイドページのロジック
// ==========================================
//
// character-data.js の difficulty(難易度)フィールドを使って、
// 最も難易度が低い(=操作しやすい)キャラクターを自動的にピックアップする。
// 新しいキャラクターが追加された場合も、difficultyさえ設定されていれば
// 自動的に対象になるため、キャラ追加のたびにこのファイルを更新する必要はない。
//
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    renderBeginnerCharacters();
    renderBeginnerPlayers();
    loadBeginnerVideos();

});

// ===== おすすめキャラクター(難易度が低い順に3体) =====
function renderBeginnerCharacters() {

    const area = document.getElementById("beginnerCharacterArea");
    if (!area || typeof characterData === "undefined") return;

    const sorted = Object.values(characterData)
        .filter(c => typeof c.difficulty === "number")
        .sort((a, b) => a.difficulty - b.difficulty)
        .slice(0, 3);

    if (sorted.length === 0) {
        area.innerHTML = `<p class="bg-empty">準備中です</p>`;
        return;
    }

    area.innerHTML = sorted.map(c => `
        <a href="character.html?id=${c.id}" class="bg-character-card">
            <img src="${c.image}" alt="${c.name}" class="bg-character-img">
            <p class="bg-character-name">${c.name}</p>
            <p class="bg-character-difficulty">難易度: ${"★".repeat(c.difficulty)}${"☆".repeat(Math.max(0, 5 - c.difficulty))}</p>
        </a>
    `).join("");

}

// ===== おすすめプレイヤー(初心者向けに解説が丁寧な選手を数名ピックアップ) =====
// 現時点では pro-player-directory.js に登録されている、詳細ページを持つ選手から選定。
// 将来的に「初心者おすすめ」フラグをデータ側に追加すれば、そちらを優先する設計に拡張できる。
function renderBeginnerPlayers() {

    const area = document.getElementById("beginnerPlayerArea");
    if (!area || typeof proPlayerDirectory === "undefined") return;

    const pickupIds = ["gachikun", "higuchi"];

    const players = pickupIds
        .map(id => ({ id, ...proPlayerDirectory[id] }))
        .filter(p => p.name);

    if (players.length === 0) {
        area.innerHTML = `<p class="bg-empty">準備中です</p>`;
        return;
    }

    area.innerHTML = players.map(p => `
        <a href="player.html?id=${p.id}" class="bg-player-card">
            ${p.image
                ? `<img src="${p.image}" alt="${p.name}" class="bg-player-img">`
                : `<div class="bg-player-img bg-player-img-fallback">${p.name.charAt(0)}</div>`
            }
            <p class="bg-player-name">${p.name}</p>
            <p class="bg-player-character">使用キャラ: ${p.character || "-"}</p>
        </a>
    `).join("");

}

// ===== 最初に見る動画(video-search.jsの共通関数を利用) =====
async function loadBeginnerVideos() {

    const area = document.getElementById("beginnerVideoArea");
    if (!area) return;

    const VIDEO_API_BASE_URL = "https://sf6dna-backend.onrender.com";
    const queries = [
        "ストリートファイター6 初心者 操作方法",
        "ストリートファイター6 初心者 講座"
    ];

    const results = await fetchVideosWithQueryRetry(VIDEO_API_BASE_URL, queries, 4);

    if (results && results.length > 0) {

        area.innerHTML = results.map(video => renderVideoCardHtml(video, { variant: "compact" })).join("");

    } else {

        area.innerHTML = renderVideoSearchFallbackHtml(queries[0], "YouTubeで探す");

    }

}
