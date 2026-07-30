document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const character = characterData[id];

    if (!character) {

        document.body.innerHTML = "<h1>キャラクターが見つかりません。</h1>";
        return;

    }

    document.getElementById("characterName").textContent =
        character.name;

    document.getElementById("characterType").textContent =
        character.type;

    document.getElementById("characterDescription").textContent =
    character.concept;

    document.getElementById("playstyle").textContent =
    character.playstyle;
    
    document.getElementById("range").textContent =
    character.range;

    document.getElementById("difficulty").textContent =
        "★".repeat(character.difficulty) +
        "☆".repeat(5 - character.difficulty);

    document.getElementById("strengths").innerHTML =
        character.strengths
            .map(item => `<li>${item}</li>`)
            .join("");

    document.getElementById("weaknesses").innerHTML =
        character.weaknesses
            .map(item => `<li>${item}</li>`)
            .join("");

    document.getElementById("recommend").innerHTML =
        character.recommend
            .map(item => `<li>${item}</li>`)
            .join("");

   document.getElementById("matchStrong").innerHTML =
character.matchups.strong
.map(matchup => {

    const enemy = characterData[matchup.id];

    return `
        <li>

            <a
                href="character.html?id=${matchup.id}"
                class="matchup-link"
            >

                <img
                    src="${enemy.image}"
                    alt="${enemy.name}"
                    class="matchup-image"
                >

                <span>${enemy.name}</span>

            </a>

        </li>
    `;

})
.join("");

document.getElementById("matchWeak").innerHTML =
character.matchups.weak
.map(matchup => {

    const enemy = characterData[matchup.id];

    return `
        <li>

            <a
                href="character.html?id=${matchup.id}"
                class="matchup-link"
            >

                <img
                    src="${enemy.image}"
                    alt="${enemy.name}"
                    class="matchup-image"
                >

                <span>${enemy.name}</span>

            </a>

        </li>
    `;

})
.join("");

    if (character.image) {

        document.getElementById("characterImage").src =
            character.image;

        document.getElementById("characterImage").alt =
            character.name;

    }

    const stats = character.stats;

    document.getElementById("powerBar").style.width =
        `${stats.power * 20}%`;

    document.getElementById("speedBar").style.width =
        `${stats.speed * 20}%`;

    document.getElementById("defenseBar").style.width =
        `${stats.defense * 20}%`;

    document.getElementById("reachBar").style.width =
        `${stats.reach * 20}%`;

    document.getElementById("beginnerBar").style.width =
        `${stats.beginner * 20}%`;

    // コンボ難易度: 既存のdifficulty(1〜5)を流用
    document.getElementById("comboDifficultyBar").style.width =
        `${(character.difficulty || 3) * 20}%`;

    // ラッシュ性能: 火力とスピードの平均値から簡易算出
    const rushPower = Math.round((stats.power + stats.speed) / 2);
    document.getElementById("rushPowerBar").style.width =
        `${rushPower * 20}%`;

    // プロ使用率: このサイトに登録されているプロの人数のうち、
    // このキャラを使用しているプロの割合から算出(実データに基づく動的計算)
    const allPros = Object.values(playerData).filter(p => p.type === "pro");
    const usingPros = allPros.filter(p => (p.characters || []).includes(id));
    const usageRate = allPros.length > 0
        ? Math.round((usingPros.length / allPros.length) * 100)
        : 0;

    document.getElementById("proUsageBar").style.width =
        `${Math.min(usageRate * 2, 100)}%`; // 見やすさのため2倍スケールで表示

    document.getElementById("proUsageLabel").textContent =
        `${usageRate}%（${usingPros.length}/${allPros.length}人）`;

        const tabs = document.querySelectorAll(".video-tab");

       tabs.forEach(tab=>{

    tab.addEventListener("click",()=>{

        tabs.forEach(t=>t.classList.remove("active"));

        tab.classList.add("active");

        renderVideos(tab.dataset.category);

    });

});
const ctx = document
    .getElementById("statusChart")
    .getContext("2d");

new Chart(ctx, {

    type: "radar",

    data: {

        labels: [

            "火力",
            "スピード",
            "守備",
            "リーチ",
            "初心者"

        ],

        datasets: [{

            label: character.name,

            data: [

                stats.power,
                stats.speed,
                stats.defense,
                stats.reach,
                stats.beginner

            ],

            backgroundColor: "rgba(255,107,0,0.25)",

            borderColor: "#ff6b00",

            borderWidth: 3,

            pointBackgroundColor: "#ff6b00"

        }]

    },

    options: {

        responsive: true,

        scales: {

            r: {

                min: 0,

                max: 5,

                ticks: {

                    stepSize: 1,

                    backdropColor: "transparent",

                    color: "#cccccc"

                },

                grid: {

                    color: "#444"

                },

                angleLines: {

                    color: "#555"

                },

                pointLabels: {

                    color: "#ffffff",

                    font: {

                        size: 14

                    }

                }

            }

        },

        plugins: {

            legend: {

                display: false

            }

        }

    }
    
    
});

const relatedArea =
document.getElementById("relatedCharacters");

if(character.related.characters){

    character.related.characters.forEach(id=>{

        const c = characterData[id];

        if(!c) return;

        relatedArea.innerHTML += `

<a
    href="character.html?id=${c.id}"
    class="related-card"
>

    <img
        src="${c.image}"
        class="related-image"
        alt="${c.name}"
    >

    <p>${c.name}</p>

</a>

`;

    });

}

function teamLabelHtml(player) {

    const team = Object.values(teamData).find(t => t.players.includes(player.id));

    if (team) {
        return `<span class="team-badge" onclick="event.preventDefault(); event.stopPropagation(); location.href='team-detail.html?id=${team.id}';">${player.team}</span>`;
    }

    return player.team || "フリー";

}

const PLAYER_ROLE_LABELS = {
    pros: "🏆 プロ",
    streamers: "📡 ストリーマー",
    vtubers: "🎭 VTuber",
    youtubers: "▶ YouTuber"
};

function renderRelatedPlayers(elementId, playersByRole){

    const area = document.getElementById(elementId);

    if(!area) return;

    area.innerHTML = "";

    if(!playersByRole) return;

    // 表示順は 固定: プロ → ストリーマー → VTuber → YouTuber
    const roleOrder = ["pros", "streamers", "vtubers", "youtubers"];

    let hasAny = false;

    roleOrder.forEach(role => {

        const playerIds = playersByRole[role];
        if (!playerIds) return;

        playerIds.forEach(id => {

            const player = playerData[id];

            if(!player) return;

            hasAny = true;

            const charNames = (player.characters || [])
                .map(cid => characterData[cid] ? characterData[cid].name : cid)
                .join("・");

            const imageHtml = player.image
                ? `<img
                        src="${player.image}"
                        class="player-image"
                        alt="${player.name}"
                        onerror="this.replaceWith(Object.assign(document.createElement('div'), {className:'related-avatar-fallback', textContent:'${player.name.charAt(0)}'}));"
                    >`
                : `<div class="related-avatar-fallback">${player.name.charAt(0)}</div>`;

            area.innerHTML += `

<a
    href="player.html?id=${player.id}"
    class="related-card"
>

    <span class="player-role-badge">${PLAYER_ROLE_LABELS[role]}</span>

    ${imageHtml}

    <h3>${player.name}</h3>

    <p class="player-team">
        ${teamLabelHtml(player)}
    </p>

    <p class="player-character">
        ${charNames}
    </p>

</a>

`;

        });

    });

    if (!hasAny) {
        area.innerHTML = `<p class="video-empty">このキャラを使用しているプレイヤーはまだ登録されていません。</p>`;
    }

}

renderRelatedPlayers("relatedPlayers", character.related.players);

// ===== 前後のキャラクターへのナビゲーション =====
// character-data.js に登録されている順番で前後キャラを算出する
const allCharacterIds = Object.keys(characterData);
const currentIndex = allCharacterIds.indexOf(id);

if (currentIndex !== -1) {

    const prevId = allCharacterIds[(currentIndex - 1 + allCharacterIds.length) % allCharacterIds.length];
    const nextId = allCharacterIds[(currentIndex + 1) % allCharacterIds.length];

    const prevChar = characterData[prevId];
    const nextChar = characterData[nextId];

    const pager = document.getElementById("characterPager");

    if (pager) {

        pager.innerHTML = `

<a href="character.html?id=${prevId}" class="character-pager-link character-pager-prev">
    <img src="${prevChar.image}" alt="${prevChar.name}">
    <span>
        <small>◀ 前のキャラクター</small>
        <strong>${prevChar.name}</strong>
    </span>
</a>

<a href="character.html?id=${nextId}" class="character-pager-link character-pager-next">
    <span>
        <small>次のキャラクター ▶</small>
        <strong>${nextChar.name}</strong>
    </span>
    <img src="${nextChar.image}" alt="${nextChar.name}">
</a>

`;

    }

}

const img = document.getElementById("characterImage");

img.onload = () => {

    img.style.opacity = 0.25;

};

// バックエンド(YouTube動画検索API)のURL。
// 未デプロイの間は空文字のままにしておけば、従来通り
// 「YouTubeで検索する」リンクにフォールバックする。
// デプロイ後はここにRenderのURLを設定する。
// 例: const VIDEO_API_BASE_URL = "https://sf6dna-video-api.onrender.com";
const VIDEO_API_BASE_URL = "https://sf6dna-backend.onrender.com";

async function fetchVideosFromApi(query, maxResults = 3) {

    if (!VIDEO_API_BASE_URL) return null;

    try {

        const url = `${VIDEO_API_BASE_URL}/api/videos/search?q=${encodeURIComponent(query)}&max=${maxResults}`;

        const res = await fetch(url);
        if (!res.ok) return null;

        const data = await res.json();
        return data.results || null;

    } catch (err) {

        console.warn("[renderVideos] API取得に失敗、検索リンクにフォールバックします", err);
        return null;

    }

}

async function renderVideos(category){

    const container = document.getElementById("comboVideos");

    container.innerHTML = "";

    // 「コンボ・立ち回り」カテゴリは、キャラごとの手入力データに頼らず
    // 常にAPIから自動取得する(最低5件・最大10件を目指す)
    if (category === "combo") {

        container.innerHTML = `<p class="video-empty">動画を読み込み中です…</p>`;

        // 1つ目のクエリで結果が0件だった場合に備え、
        // 言い回しの異なる複数のクエリを上から順に試す(video-search.jsの共通関数を使用)
        const query = `${character.name} コンボ 立ち回り ストリートファイター6`;
        const queries = [
            query,
            `${character.name} SF6 コンボ`,
            `${character.name} ストリートファイター6`
        ];
        const apiResults = await fetchVideosWithQueryRetry(VIDEO_API_BASE_URL, queries, 10);

        if (apiResults && apiResults.length > 0) {

            container.innerHTML = apiResults.map(result => `
                <a class="video-card" href="${result.url}" target="_blank" rel="noopener">
                    <img src="${result.thumbnail}" alt="${result.title}">
                    <div class="video-info">
                        <h3>${result.title}</h3>
                        <span class="video-link-label">YouTubeで見る ↗</span>
                    </div>
                </a>
            `).join("");

        } else {

            // API取得に失敗、または0件だった場合はYouTube検索リンクにフォールバック
            const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

            container.innerHTML = `
                <a class="video-card" href="${searchUrl}" target="_blank" rel="noopener">
                    <div class="video-thumb-search">🔍<span>YouTubeで検索</span></div>
                    <div class="video-info">
                        <h3>${character.name}のコンボ・立ち回り動画を探す</h3>
                        <span class="video-link-label">YouTubeで検索する ↗</span>
                    </div>
                </a>
            `;

        }

        return;

    }

    const videos = character.comboVideos[category];

    if (!videos || videos.length === 0) {

        container.innerHTML = `
            <p class="video-empty">現在関連動画はありません</p>
        `;
        return;

    }

    for (const video of videos) {

        // type:"search" のエントリは、バックエンドAPIが使えれば
        // 実際の動画をその場で取得して表示を差し替える。
        // APIが未設定/失敗した場合は従来通り検索リンクを表示する。
        if (video.type === "search") {

            const query = new URL(video.url).searchParams.get("search_query") || video.title;
            const apiResults = await fetchVideosFromApi(query, 3);

            if (apiResults && apiResults.length > 0) {

                apiResults.forEach(result => {

                    container.innerHTML += `
                        <a class="video-card" href="${result.url}" target="_blank" rel="noopener">
                            <img src="${result.thumbnail}" alt="${result.title}">
                            <div class="video-info">
                                <h3>${result.title}</h3>
                                <span class="video-link-label">YouTubeで見る ↗</span>
                            </div>
                        </a>
                    `;

                });

                continue;

            }

        }

        const isSearch = video.type === "search";

        const thumbnailHtml = isSearch
            ? `<div class="video-thumb-search">🔍<span>YouTubeで検索</span></div>`
            : `<img
                    src="${video.thumbnail}"
                    alt="${video.title}"
                    onerror="this.onerror=null; this.src='${character.image}';"
                >`;

        container.innerHTML += `
            <a
                class="video-card"
                href="${video.url}"
                target="_blank"
                rel="noopener"
            >

                ${thumbnailHtml}

                <div class="video-info">

                    <h3>${video.title}</h3>

                    <span class="video-link-label">
                        ${isSearch ? "YouTubeで検索する ↗" : "YouTubeで見る ↗"}
                    </span>

                </div>

            </a>
        `;

    }

}
renderVideos("beginner");

});

