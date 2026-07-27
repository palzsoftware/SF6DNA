const playerArea =
document.getElementById("playerArea");

const resultCount =
document.getElementById("playerResultCount");

const CATEGORY_LABELS = {
    pro: "🏆 プロ",
    streamer: "📡 ストリーマー",
    vtuber: "🎭 VTuber",
    youtuber: "▶ YouTuber"
};

// countryは「日本」「アメリカ」「ドミニカ共和国」など具体的な国名で
// 入っているため、「日本」以外はまとめて「海外勢」として扱う
function isJapan(player) {
    return player.country === "日本";
}

function renderPlayers(list) {

    playerArea.innerHTML = "";

    resultCount.textContent = `${list.length}人`;

    if (list.length === 0) {

        playerArea.innerHTML = `
            <p class="empty-message">
                条件に一致するプレイヤーが見つかりませんでした。
            </p>
        `;
        return;

    }

    list.forEach(player => {

        const charNames = (player.characters || [])
            .map(cid => characterData[cid] ? characterData[cid].name : cid)
            .join(" ・ ");

        const imageHtml = player.image
            ? `<img
                    src="${player.image}"
                    class="player-image"
                    alt="${player.name}"
                    onerror="this.replaceWith(Object.assign(document.createElement('div'), {className:'related-avatar-fallback', textContent:'${player.name.charAt(0)}'}));"
                >`
            : `<div class="related-avatar-fallback">${player.name.charAt(0)}</div>`;

        playerArea.innerHTML += `

<a
    href="player.html?id=${player.id}"
    class="related-card"
>

    <span class="player-role-badge">${CATEGORY_LABELS[player.type] || player.type}</span>

    ${imageHtml}

    <h3>${player.name}</h3>

    <p class="player-team">
        ${player.team || "フリー"}
    </p>

    <p class="player-main">
        <strong>使用キャラ</strong><br>
        ${charNames || "未登録"}
    </p>

    <span class="detail-link">
        ▶ 詳細を見る
    </span>

</a>

`;

    });

}

renderPlayers(Object.values(playerData));

const search = document.getElementById("playerSearch");
const characterSearch = document.getElementById("characterSearch");

let currentCategory = "all";
let currentCountry = "all";

function filterPlayers() {

    const keyword = search.value.toLowerCase();
    const characterKeyword = characterSearch.value.toLowerCase();

    const filtered = Object.values(playerData).filter(player => {

        const matchPlayer =
            keyword === "" ||
            player.name.toLowerCase().includes(keyword) ||
            (player.team || "").toLowerCase().includes(keyword);

        const matchCharacter =
            characterKeyword === "" ||
            (player.characters || []).some(cid => {
                const cName = characterData[cid] ? characterData[cid].name.toLowerCase() : cid.toLowerCase();
                return cName.includes(characterKeyword) || cid.toLowerCase().includes(characterKeyword);
            });

        const matchCategory =
            currentCategory === "all" ||
            player.type === currentCategory;

        const matchCountry =
            currentCountry === "all" ||
            (currentCountry === "japan" && isJapan(player)) ||
            (currentCountry === "overseas" && !isJapan(player));

        return matchPlayer && matchCharacter && matchCategory && matchCountry;

    });

    renderPlayers(filtered);

}

const categoryButtons =
document.querySelectorAll(".filter-button:not(.country-button)");

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        currentCategory = button.dataset.filter;

        filterPlayers();

    });

});

search.addEventListener("input", filterPlayers);
characterSearch.addEventListener("input", filterPlayers);

const countryButtons =
document.querySelectorAll(".country-button");

countryButtons.forEach(button => {

    button.addEventListener("click", () => {

        countryButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        currentCountry = button.dataset.country;

        filterPlayers();

    });

});
