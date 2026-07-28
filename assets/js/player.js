document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);

    const id = params.get("id");

    const players = {

    ...proData,
    ...streamerData,
    ...vtuberData,
    ...youtuberData,
    ...casterData

};

const player = players[id];

    if(!player){

        document.body.innerHTML =
        "<h1>プレイヤーが見つかりません。</h1>";

        return;
    }

    document.getElementById("playerName").textContent =
        player.name;

    document.getElementById("playerCountry").textContent =
    player.country;

    // 所属チームがteamData(チーム図鑑)に登録されていれば、
    // クリックでチーム詳細ページへ飛べるバッジとして表示する
    const belongingTeam = Object.values(teamData).find(
        t => t.players.includes(player.id)
    );

    function renderTeamLabel(elementId) {

        const el = document.getElementById(elementId);
        if (!el) return;

        if (belongingTeam) {
            el.innerHTML =
                `<a href="team-detail.html?id=${belongingTeam.id}" class="team-badge-link">${player.team}</a>`;
        } else {
            el.textContent = player.team || "フリー";
        }

    }

    renderTeamLabel("playerTeam");
    renderTeamLabel("playerTeamInline");

    document.getElementById("playerMainCharacters").textContent =
player.characters
    .map(id => characterData[id] ? characterData[id].name : id)
    .join(" / ");

    // ===== 新規プロフィール項目(未登録の場合は「未登録」と表示) =====
    document.getElementById("playerDevice").textContent =
        player.device || "未登録";

    document.getElementById("playerControlType").textContent =
        player.controlType || "未登録";

    document.getElementById("playerSf6History").textContent =
        player.sf6History || "未登録";

    // ===== 学べるポイント =====
    // 立ち回り/読み合い/守り/攻め/コンボ/キャラクター理解/メンタル/大会力の
    // カテゴリ別データ(learningCategories)があればそちらを優先して箇条書き表示する。
    // 無い場合は、以前からある強み解説文(learningPointsDetail)のみ表示する。
    const strengthDetailEl = document.getElementById("playerStrengthDetail");
    const learningCategoriesEl = document.getElementById("playerLearningCategories");

    strengthDetailEl.textContent =
        player.learningPointsDetail || "このプレイヤーの強みは準備中です。";

    const categoryLabels = {
        movement: "■ 立ち回り",
        reading: "■ 読み合い",
        defense: "■ 守り",
        offense: "■ 攻め",
        combo: "■ コンボ",
        characterKnowledge: "■ キャラクター理解",
        mental: "■ メンタル",
        tournament: "■ 大会力"
    };

    if (player.learningCategories) {

        learningCategoriesEl.innerHTML = Object.keys(categoryLabels)
            .filter(key => player.learningCategories[key] && player.learningCategories[key].length > 0)
            .map(key => `
                <div class="learning-category">
                    <h4>${categoryLabels[key]}</h4>
                    <ul>
                        ${player.learningCategories[key].map(point => `<li>${point}</li>`).join("")}
                    </ul>
                </div>
            `).join("");

    } else if (player.learningPoints && player.learningPoints.length > 0) {

        // 旧データ(タグのみ)の互換表示
        learningCategoriesEl.innerHTML = `
            <div class="learning-points-tags">
                ${player.learningPoints.map(point => `<span class="learning-point-tag">${point}</span>`).join("")}
            </div>
        `;

    } else {

        learningCategoriesEl.innerHTML = "";

    }

    document.getElementById("playerStyle").textContent =
        player.style;

    const playerImageEl = document.getElementById("playerImage");
    const playerImageWrap = playerImageEl.parentElement;

    function showFallbackAvatar() {
        playerImageWrap.innerHTML =
            `<div class="avatar-fallback-img">${player.name.charAt(0)}</div>`;
    }

    if (player.image) {
        playerImageEl.src = player.image;
        playerImageEl.alt = player.name;
        playerImageEl.onerror = function () {
            showFallbackAvatar();
        };
    } else {
        showFallbackAvatar();
    }

   const characterArea =
document.getElementById("playerCharacters");

characterArea.innerHTML = "";

player.characters.forEach(id=>{

    const character = characterData[id];

    if(!character) return;

    characterArea.innerHTML += `

<a
    href="character.html?id=${character.id}"
    class="player-character-card"
>

    <img
        src="${character.image}"
        alt="${character.name}"
    >

    <h3>${character.name}</h3>

    <p>${character.type}</p>

</a>

`;

});

const memberContainer =
    document.getElementById("teamMembers");

memberContainer.innerHTML = "";

// team-data.jsに登録されている全チームから、このプレイヤーの所属チームを探し、
// 同じチームの他のメンバーを自動的に表示する(VARREL/REJECT以外にも対応)
const belongingTeamForMembers = typeof teamData !== "undefined"
    ? Object.values(teamData).find(t => t.players.includes(player.id))
    : null;

const memberIds = belongingTeamForMembers
    ? belongingTeamForMembers.players.filter(id => id !== player.id)
    : (player.teamMembers || []);

memberIds.forEach(id=>{

    const member = players[id];

    if(!member) return;

    const memberImageHtml = member.image
        ? `<img
                src="${member.image}"
                alt="${member.name}"
                onerror="this.replaceWith(Object.assign(document.createElement('div'), {className:'related-avatar-fallback', textContent:'${member.name.charAt(0)}'}));"
            >`
        : `<div class="related-avatar-fallback">${member.name.charAt(0)}</div>`;

    memberContainer.innerHTML += `

        <a
            href="player.html?id=${member.id}"
            class="team-member-card"
        >

            ${memberImageHtml}

            <span>${member.name}</span>

        </a>

        `;

});

    // 大会実績: ベスト8までに絞って表示する
    function isTop8(resultText) {
        if (!resultText) return false;
        if (resultText.includes("優勝")) return true; // 準優勝も含む
        const m = resultText.match(/(\d+)\s*位/);
        if (m) return Number(m[1]) <= 8;
        return false;
    }

    const top8Achievements = (player.achievements || []).filter(a => isTop8(a.result));

    document.getElementById("playerAchievements").innerHTML =
    top8Achievements
        .map(a => `

<li class="achievement-item">

    <span class="achievement-date">
        ${a.date}
    </span>

    <span class="achievement-tournament">
        ${a.tournament}
    </span>

    <span class="achievement-result">
        ${a.result}
    </span>

</li>

`)
        .join("") || `<li class="achievement-item">大会実績は準備中です。</li>`;

const youtubeLink = document.getElementById("youtubeLink");
const twitterLink = document.getElementById("twitterLink");
const twitchLink = document.getElementById("twitchLink");

if(player.youtube){
    youtubeLink.href = player.youtube;
}else{
    youtubeLink.style.display = "none";
}

if(player.twitter){
    twitterLink.href = player.twitter;
}else{
    twitterLink.style.display = "none";
}

if(player.twitch){
    twitchLink.href = player.twitch;
}else{
    twitchLink.style.display = "none";
}

// ===== タブ切り替え(公式サイトのOVERVIEW/PLAY風レイアウト) =====
const tabButtons = document.querySelectorAll(".player-tab-button");
const tabPanels = document.querySelectorAll(".player-tab-panel");

tabButtons.forEach(button => {

    button.addEventListener("click", () => {

        tabButtons.forEach(b => b.classList.remove("active"));
        tabPanels.forEach(p => p.classList.remove("active"));

        button.classList.add("active");

        const target = document.querySelector(
            `.player-tab-panel[data-panel="${button.dataset.tab}"]`
        );

        if (target) target.classList.add("active");

    });

});

// ===== おすすめ動画(API取得) =====
// プロなら大型大会の対戦動画、ストリーマー/YouTuber/VTuberはスト6関連動画を検索する。
// 大会実績が無い人は、代わりにおすすめ動画を多めに取得する。
const VIDEO_API_BASE_URL = "https://sf6dna-backend.onrender.com";

async function loadPlayerVideos() {

    const videosArea = document.getElementById("playerVideosArea");

    const hasAchievements = top8Achievements.length > 0;

    const query = player.type === "pro"
        ? `${player.name} 対戦動画 大会 ストリートファイター6`
        : `${player.name} ストリートファイター6`;

    // 実績が無いプレイヤーは、代わりにおすすめ動画を多めに表示する
    const maxResults = hasAchievements ? 6 : 10;

    if (!VIDEO_API_BASE_URL) {
        videosArea.innerHTML = `<p class="video-empty">現在関連動画はありません</p>`;
        return;
    }

    try {

        const url = `${VIDEO_API_BASE_URL}/api/videos/search?q=${encodeURIComponent(query)}&max=${maxResults}`;
        const res = await fetch(url);

        if (!res.ok) throw new Error("API error");

        const data = await res.json();

        if (!data.results || data.results.length === 0) {
            videosArea.innerHTML = `<p class="video-empty">現在関連動画はありません</p>`;
            return;
        }

        videosArea.innerHTML = data.results.map(video => `
            <a class="video-scroll-card" href="${video.url}" target="_blank" rel="noopener">
                <img src="${video.thumbnail}" alt="${video.title}">
                <div class="video-scroll-info">
                    <h4>${video.title}</h4>
                </div>
            </a>
        `).join("");

    } catch (err) {

        console.warn("[playerVideos] 取得に失敗しました", err);
        videosArea.innerHTML = `<p class="video-empty">現在関連動画はありません</p>`;

    }

}

loadPlayerVideos();

});