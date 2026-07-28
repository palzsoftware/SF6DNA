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

    document.getElementById("playerAchievements").innerHTML =
    (player.achievements || [])
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

});