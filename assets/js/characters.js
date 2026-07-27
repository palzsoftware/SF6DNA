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
        ${player.team}
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

function renderVideos(category){

    const container = document.getElementById("comboVideos");

    container.innerHTML = "";

    const videos = character.comboVideos[category];

    if (!videos || videos.length === 0) {

        container.innerHTML = `
            <p class="video-empty">この分類の動画はまだ登録されていません。</p>
        `;
        return;

    }

    videos.forEach(video=>{

        // type:"search" の場合はキャラ+分類名でYouTube検索結果に飛ぶリンクとして扱う
        // (個別の動画を保証はできないが、クリックすれば必ずYouTubeへ辿り着ける)
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

    });

}
renderVideos("beginner");

});

