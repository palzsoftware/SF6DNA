document.addEventListener("DOMContentLoaded", () => {

    const teamArea = document.getElementById("teamArea");

    Object.values(teamData).forEach(team => {

        teamArea.innerHTML += `

        <a
            href="team-detail.html?id=${team.id}"
            class="team-card"
        >

            <h2>${team.name}</h2>

            <p>${team.country}</p>

            <p>
                所属人数：${team.players.length}人
            </p>

        </a>

        `;

    });

});