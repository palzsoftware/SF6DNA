document.addEventListener("DOMContentLoaded", () => {

    const teamArea = document.getElementById("teamArea");

    Object.values(teamData).forEach(team => {

        const logoHtml = team.logo
            ? `<img
                    src="${team.logo}"
                    class="team-card-logo"
                    alt="${team.name}"
                    onerror="this.replaceWith(Object.assign(document.createElement('div'), {className:'team-logo-fallback team-logo-fallback-small', textContent:'${team.name.charAt(0)}'}));"
                >`
            : `<div class="team-logo-fallback team-logo-fallback-small">${team.name.charAt(0)}</div>`;

        teamArea.innerHTML += `

        <a
            href="team-detail.html?id=${team.id}"
            class="team-card"
        >

            ${logoHtml}

            <h2>${team.name}</h2>

            <p class="team-card-country">${team.country}</p>

            <p class="team-card-count">
                所属人数：${team.players.length}人
            </p>

        </a>

        `;

    });

});