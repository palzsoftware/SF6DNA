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

    document.getElementById("playerTeam").textContent =
    player.team;

    document.getElementById("playerTeamInline").textContent =
    player.team;

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

if(player.teamMembers){

    player.teamMembers.forEach(id=>{

        const member = players[id];

        if(!member) return;

        memberContainer.innerHTML += `

        <a
            href="player.html?id=${member.id}"
            class="team-member-card"
        >

            <img src="${member.image}">

            <span>${member.name}</span>

        </a>

        `;

    });

}

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

});