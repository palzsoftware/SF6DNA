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

    // SFL順位: 出場していないチーム(VTuber事務所等)は欄ごと非表示にする
    const sflRankEl = document.getElementById("teamSflRank");
    if (team.sflRank) {
        sflRankEl.textContent = "🏆 " + team.sflRank;
        sflRankEl.style.display = "";
    } else {
        sflRankEl.style.display = "none";
    }

    // 公式サイトボタン: 登録されていれば表示
    const officialLinkEl = document.getElementById("teamOfficialLink");
    if (team.official) {
        officialLinkEl.href = team.official;
        officialLinkEl.style.display = "";
    } else {
        officialLinkEl.style.display = "none";
    }

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

    // ===== 年代別ロスター(データがあるチームのみ表示) =====
    if (team.rosterHistory) {

        document.getElementById("currentRosterHeading").style.display = "";

        const rosterHistorySection = document.getElementById("rosterHistorySection");
        const rosterHistoryArea = document.getElementById("rosterHistoryArea");

        rosterHistorySection.style.display = "";

        // 新しい年が上に来るように降順で表示する
        const years = Object.keys(team.rosterHistory).sort((a, b) => b.localeCompare(a));

        rosterHistoryArea.innerHTML = years.map(year => {

            const memberNames = team.rosterHistory[year]
                .map(pid => playerData[pid] ? playerData[pid].name : pid)
                .join(" ・ ");

            return `
                <div class="roster-history-item">
                    <span class="roster-history-year">${year}年</span>
                    <span class="roster-history-members">${memberNames}</span>
                </div>
            `;

        }).join("");

    } else {

        document.getElementById("currentRosterHeading").style.display = "none";

    }

    // ===== チームの対戦動画・アーカイブ(API取得) =====
    const VIDEO_API_BASE_URL = "https://sf6dna-backend.onrender.com";

    async function loadTeamVideos() {

        const videosArea = document.getElementById("teamVideosArea");

        if (!VIDEO_API_BASE_URL) {
            videosArea.innerHTML = `<p class="video-empty">現在関連動画はありません</p>`;
            return;
        }

        // 1回目のクエリで見つからない場合、表記を変えて再検索する
        // (SFLでの対戦動画は「正式チーム名」よりも「SFL」+チーム名の略称で
        //  ヒットしやすい傾向があるため)
        const queries = [
            `SFL ${team.name} 対戦`,
            `${team.name} ストリートファイターリーグ 対戦 アーカイブ`,
            `${team.name} SFL ハイライト`,
            `ストリートファイター6 ${team.name}`,
        ];

        for (const query of queries) {

            try {

                const url = `${VIDEO_API_BASE_URL}/api/videos/search?q=${encodeURIComponent(query)}&max=8`;
                const res = await fetch(url);

                if (!res.ok) continue;

                const data = await res.json();

                if (data.results && data.results.length > 0) {

                    videosArea.innerHTML = data.results.map(video => `
                        <a class="video-scroll-card" href="${video.url}" target="_blank" rel="noopener">
                            <img src="${video.thumbnail}" alt="${video.title}">
                            <div class="video-scroll-info">
                                <h4>${video.title}</h4>
                            </div>
                        </a>
                    `).join("");

                    return;

                }

            } catch (err) {

                console.warn("[teamVideos] 取得に失敗しました", query, err);

            }

        }

        // すべてのクエリで取得できなかった場合
        videosArea.innerHTML = `<p class="video-empty">現在関連動画はありません</p>`;

    }

    loadTeamVideos();

});