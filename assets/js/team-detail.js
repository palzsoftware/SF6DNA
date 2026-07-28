document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);

    const id = params.get("id");

    const team = teamData[id];

    if (!team) {

        document.body.innerHTML = "<h1>チームが見つかりません。</h1>";

        return;
    }

    document.getElementById("teamName").textContent =
        team.name;

    const teamLogoEl = document.getElementById("teamLogo");

    if (team.logo) {
        teamLogoEl.src = team.logo;
        teamLogoEl.alt = team.name;
        teamLogoEl.onerror = function () {
            this.replaceWith(Object.assign(
                document.createElement("div"),
                { className: "team-logo-fallback", textContent: team.name.charAt(0) }
            ));
        };
    } else {
        teamLogoEl.replaceWith(Object.assign(
            document.createElement("div"),
            { className: "team-logo-fallback", textContent: team.name.charAt(0) }
        ));
    }

    document.getElementById("teamCountry").textContent =
        team.country;

    const descEl = document.getElementById("teamDescription");
    descEl.textContent =
        team.description || "";
    descEl.style.display = team.description ? "" : "none";

    const playersArea = document.getElementById("teamPlayers");

    playersArea.innerHTML = "";

    team.players.forEach(pid => {

        const player = playerData[pid];

        if (!player) return;

        const imageHtml = player.image
            ? `<img
                    src="${player.image}"
                    class="player-image"
                    alt="${player.name}"
                    onerror="this.replaceWith(Object.assign(document.createElement('div'), {className:'related-avatar-fallback', textContent:'${player.name.charAt(0)}'}));"
                >`
            : `<div class="related-avatar-fallback">${player.name.charAt(0)}</div>`;

        const charNames = (player.characters || [])
            .map(cid => characterData[cid] ? characterData[cid].name : cid)
            .join(" ・ ");

        playersArea.innerHTML += `

<a
    href="player.html?id=${player.id}"
    class="related-card"
>

    ${imageHtml}

    <h3>${player.name}</h3>

    <p class="player-main">
        ${charNames || "未登録"}
    </p>

</a>

`;

    });

});