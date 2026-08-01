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

function findTeam(player) {
    return Object.values(teamData).find(t => t.players.includes(player.id));
}

function teamLabelHtml(player) {

    const team = findTeam(player);

    if (team) {
        return `<span class="team-badge" onclick="event.preventDefault(); event.stopPropagation(); location.href='team-detail.html?id=${team.id}';">${player.team}</span>`;
    }

    return player.team || "フリー";

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

        const team = findTeam(player);

        const teammateList = team
            ? team.players
                .filter(id => id !== player.id)
                .map(id => playerData[id] ? playerData[id].name : null)
                .filter(Boolean)
            : [];

        // カードがごちゃつかないよう、3人以上いる場合は先頭2人+「など」に省略する
        const teammateNames = teammateList.length >= 3
            ? `${teammateList.slice(0, 2).join(" ・ ")} など（${teammateList.length}人）`
            : teammateList.join(" ・ ");

        playerArea.innerHTML += `

<a
    href="player.html?id=${player.id}"
    class="related-card"
>

    <span class="player-role-badge">${CATEGORY_LABELS[player.type] || player.type}</span>

    ${imageHtml}

    <h3>${player.name}</h3>

    <p class="player-team">
        ${teamLabelHtml(player)}
    </p>

    <p class="player-main">
        <strong>使用キャラ</strong><br>
        ${charNames || "未登録"}
    </p>

    ${teammateNames ? `
    <p class="player-teammates">
        <strong>チームメンバー</strong><br>
        ${teammateNames}
    </p>
    ` : ""}

    <span class="detail-link">
        ▶ 詳細を見る
    </span>

</a>

`;

    });

}

renderPlayers(Object.values(playerData));

const search = document.getElementById("playerSearch");

let currentCategory = "all";
let currentCountry = "all";

function filterPlayers() {

    const keyword = search.value.trim().toLowerCase();

    const filtered = Object.values(playerData).filter(player => {

        const matchName =
            keyword === "" ||
            player.name.toLowerCase().includes(keyword);

        const matchTeam =
            keyword === "" ||
            (player.team || "").toLowerCase().includes(keyword);

        const matchCharacter =
            keyword === "" ||
            (player.characters || []).some(cid => {
                const cName = characterData[cid] ? characterData[cid].name.toLowerCase() : cid.toLowerCase();
                return cName.includes(keyword) || cid.toLowerCase().includes(keyword);
            });

        // プレイヤー名・使用キャラ・所属チームのいずれかに一致すればOK
        const matchKeyword = matchName || matchTeam || matchCharacter;

        const matchCategory =
            currentCategory === "all" ||
            player.type === currentCategory;

        const matchCountry =
            currentCountry === "all" ||
            (currentCountry === "japan" && isJapan(player)) ||
            (currentCountry === "overseas" && !isJapan(player));

        return matchKeyword && matchCategory && matchCountry;

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

// ===== キャラクター詳細ページからの絞り込み導線(Phase6-A) =====
// character.html の「次にすること」から「?character=キャラID」付きで遷移してきた場合、
// 既存の検索欄(名前・チーム・使用キャラのいずれかに一致すればヒットする仕組み)に
// キャラクター名を自動入力して絞り込む。新しいフィルターUIを追加するのではなく、
// 既にある検索の仕組みをそのまま再利用することで、実装・保守の対象を増やさない。
(function applyCharacterFilterFromUrl() {

    const characterId = new URLSearchParams(window.location.search).get("character");
    if (!characterId) return;

    // characterDataに存在しないIDが渡された場合は、IDそのものをキーワードとして使う
    // (character-data.js側の参照切れ・表記揺れがあっても検索自体は動作するようにするため)
    const characterName = (typeof characterData !== "undefined" && characterData[characterId])
        ? characterData[characterId].name
        : characterId;

    search.value = characterName;
    filterPlayers();

    // 「なぜ絞り込まれているか」が分からないと初心者が迷うため、
    // 画面上に理由と解除方法を明示する(Phase6-B)
    const notice = document.getElementById("playerCharacterFilterNotice");
    if (notice) {
        notice.innerHTML = `${characterName}を使うプレイヤーで絞り込み中 ・ <a href="players.html">絞り込みを解除</a>`;
        notice.classList.remove("hidden");
    }

})();

// ===== 初心者向けピックアップ(Phase3-B) =====
// 「人気」を示す実データ(閲覧数・お気に入り数)が現状無いため、
// 実際に存在するデータ(大会実績の件数)から客観的に算出できる指標のみを使用する。
// 将来、閲覧数などのデータが追加されたら、ここのソート条件を差し替えるだけで対応できる。

function renderPickupRow(areaId, players) {

    const area = document.getElementById(areaId);
    if (!area) return;

    const cardsArea = area.querySelector(".player-pickup-cards");
    if (!cardsArea) return;

    if (players.length === 0) {
        area.style.display = "none";
        return;
    }

    cardsArea.innerHTML = players.map(p => `
        <a href="player.html?id=${p.id}" class="player-pickup-card">
            ${p.image
                ? `<img src="${p.image}" alt="${p.name}" class="player-pickup-img" onerror="this.onerror=null;this.replaceWith(Object.assign(document.createElement('div'),{className:'player-pickup-img player-pickup-img-fallback',textContent:'${p.name.charAt(0)}'}));">`
                : `<div class="player-pickup-img player-pickup-img-fallback">${p.name.charAt(0)}</div>`
            }
            <span class="player-pickup-name">${p.name}</span>
        </a>
    `).join("");

}

function initPlayerPickups() {

    if (typeof proPlayerDirectory !== "undefined") {

        const beginnerPicks = Object.entries(proPlayerDirectory)
            .map(([id, data]) => ({ id, ...data }))
            .filter(p => p.name)
            .slice(0, 4);

        renderPickupRow("pickupBeginnerArea", beginnerPicks);

    }

    if (typeof playerData !== "undefined") {

        const byAchievements = Object.values(playerData)
            .filter(p => Array.isArray(p.achievements))
            .sort((a, b) => b.achievements.length - a.achievements.length)
            .slice(0, 4);

        renderPickupRow("pickupAchievementArea", byAchievements);

        // 「攻め」「守り」は、実在するstyleフィールドの文言から機械的に判定する
        // (架空の指標を作らず、既存データのみを使う)
        const offensePlayers = Object.values(playerData)
            .filter(p => typeof p.style === "string" && /攻撃|攻め/.test(p.style))
            .slice(0, 4);

        const defensePlayers = Object.values(playerData)
            .filter(p => typeof p.style === "string" && /堅実|対応|待ち/.test(p.style))
            .slice(0, 4);

        renderPickupRow("pickupOffenseArea", offensePlayers);
        renderPickupRow("pickupDefenseArea", defensePlayers);

    }

}

initPlayerPickups();

// ===== 今日のおすすめプレイヤー(Phase4) =====
// 「今日のおすすめキャラクター」(salt=0)とズラすため、salt=3を使用する
(function renderTodayPickPlayer() {

    const area = document.getElementById("todayPickPlayer");
    if (!area || typeof playerData === "undefined") return;

    const players = Object.values(playerData);
    const player = getDailyPick(players, 3);

    if (!player) return;

    area.innerHTML = `
        <a href="player.html?id=${player.id}" class="today-pick-link">
            ${player.image
                ? `<img src="${player.image}" alt="${player.name}" class="today-pick-avatar">`
                : `<span class="today-pick-avatar player-pickup-img-fallback">${player.name.charAt(0)}</span>`
            }
            <div>
                <p class="today-pick-sublabel">今日のプレイヤー</p>
                <p class="today-pick-name">${player.name}</p>
            </div>
        </a>
    `;

})();
