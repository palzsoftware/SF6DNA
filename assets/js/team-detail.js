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

});