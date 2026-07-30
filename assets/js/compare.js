const compareArea =
    document.getElementById("compareArea");

const compareIds =
    JSON.parse(
        localStorage.getItem("sf6dna_compare")
    ) || [];

renderCompare();

renderCompareSections();

createSection(

    "キャラクターコンセプト",

    [

        ["コンセプト","concept"],
        ["得意距離","range"],
        ["プレイスタイル","playstyle"],
        ["長所","strengths"],
        ["短所","weaknesses"],
        ["こんな人おすすめ","recommend"]

    ]

);

function renderCompare(){

    compareArea.innerHTML = "";

    compareIds.forEach(id => {

        const character =
            characterData[id];

        compareArea.innerHTML += `

<div class="card">

    <img
        src="${character.image}"
        class="character-image"
    >

    <div class="character-content">

        <h3 class="character-name">

            ${character.name}

        </h3>

        <span class="character-type">

            ${character.type}

        </span>

        <p class="character-difficulty">難易度：${"★".repeat(character.difficulty)}${"☆".repeat(5-character.difficulty)}</p>

    </div>

</div>

`;

    });

}

function renderCompareTable(){

    const table =
        document.getElementById("compareTable");

    table.innerHTML = "";

    table.innerHTML += `

<tr>

    <th>項目</th>

    ${compareIds.map(id=>`
        <th>${characterData[id].name}</th>
    `).join("")}

</tr>

`;

    createRow("プレイタイプ","type");
    createRow("操作難易度","difficulty");
    createRow("コンボ難易度","combo");
    createRow("体力","hp");
    createRow("火力","power");
    createRow("機動力","speed");
    createRow("守り","defense");
    createRow("リーチ","reach");
    createRow("初心者おすすめ","beginner");

}

function createRow(title,key){

    const table =
        document.getElementById("compareTable");

    table.innerHTML += `

<tr>

    <td>${title}</td>

    ${compareIds.map(id=>{

        const character =
            characterData[id];

        let value =
            character[key];
            

        if(
    [
        "difficulty",
        "power",
        "speed",
        "defense",
        "reach",
        "combo",
        "beginner"
    ].includes(key)
){

    value =
        "★".repeat(value) +
        "☆".repeat(5-value);

}
if(
    [
        "strengths",
        "weaknesses",
        "recommend"
    ].includes(key)
){

    value = `

<ul class="compare-list">

${value.map(item => `
<li>${item}</li>
`).join("")}

</ul>

`;

}
        return `<td>${value}</td>`;

    }).join("")}

</tr>

`;

}

function renderCompareSections(){

    const content =
        document.getElementById("compareContent");

    content.innerHTML = "";

    createSection(

        "基本情報",

        [

            ["プレイタイプ","type"],
            ["操作難易度","difficulty"],
            ["コンボ難易度","combo"]

        ]

    );

    createSection(

        "性能",

        [

            ["体力","hp"],
            ["火力","power"],
            ["機動力","speed"],
            ["守り","defense"],
            ["リーチ","reach"]

        ]

    );

    renderMatchupSection();
    renderVideoSection();

}

// ===== 相性・使用プレイヤー・有利不利ポイント =====
function getMatchupInfo(fromId, toId) {

    const from = characterData[fromId];
    if (!from || !from.matchups) return null;

    const strong = (from.matchups.strong || []).find(m => m.id === toId);
    if (strong) return { result: "有利", reason: strong.reason };

    const weak = (from.matchups.weak || []).find(m => m.id === toId);
    if (weak) return { result: "不利", reason: weak.reason };

    return { result: "五分", reason: "" };

}

function renderMatchupSection() {

    const content = document.getElementById("compareContent");

    if (compareIds.length < 2) return;

    let html = `
        <div class="compare-group">
            <button class="compare-toggle" data-title="相性・使用プレイヤー">
                ▼ 相性・使用プレイヤー
            </button>
            <div class="matchup-compare-grid">
    `;

    compareIds.forEach(id => {

        const character = characterData[id];

        // 使用プレイヤー(このサイトに登録されているプロ・ストリーマー・VTuber・YouTuber)
        const relatedPlayerIds = character.related && character.related.players
            ? [
                ...(character.related.players.pros || []),
                ...(character.related.players.streamers || []),
                ...(character.related.players.vtubers || []),
                ...(character.related.players.youtubers || [])
              ].filter(pid => pid !== "なし" && typeof playerData !== "undefined" && playerData[pid])
            : [];

        // このキャラから見た、比較している他キャラとの相性
        const matchupHtml = compareIds
            .filter(otherId => otherId !== id)
            .map(otherId => {
                const info = getMatchupInfo(id, otherId);
                if (!info) return "";
                const otherName = characterData[otherId].name;
                const resultClass = info.result === "有利" ? "matchup-good" : info.result === "不利" ? "matchup-bad" : "matchup-even";
                return `
                    <div class="matchup-vs-item ${resultClass}">
                        <strong>対 ${otherName}：${info.result}</strong>
                        ${info.reason ? `<p>${info.reason}</p>` : `<p>大きな有利不利は無く、実力が拮抗しやすい相性です。</p>`}
                    </div>
                `;
            }).join("");

        html += `
            <div class="matchup-character-col">
                <h4>${character.name}</h4>
                ${matchupHtml}
                <div class="matchup-players">
                    <strong>使用プレイヤー</strong>
                    <p>${relatedPlayerIds.length > 0
                        ? relatedPlayerIds.map(pid => playerData[pid].name).join(" ・ ")
                        : "未登録"}</p>
                </div>
            </div>
        `;

    });

    html += `
            </div>
        </div>
    `;

    content.innerHTML += html;

}

// ===== 対戦動画(2キャラ比較時のみ、API取得) =====
const VIDEO_API_BASE_URL = "https://sf6dna-backend.onrender.com";

async function renderVideoSection() {

    const section = document.getElementById("compareVideoSection");
    const videosArea = document.getElementById("compareVideosArea");

    if (compareIds.length !== 2) {
        section.style.display = "none";
        return;
    }

    section.style.display = "";

    const [nameA, nameB] = compareIds.map(id => characterData[id].name);

    // 1つ目のクエリで結果が0件だった場合に備え、
    // 言い回しの異なる複数のクエリを上から順に試す(video-search.jsの共通関数を使用)
    const queries = [
        `${nameA} ${nameB} 対戦動画 ストリートファイター6`,
        `${nameA} ${nameB} SF6`,
        `${nameA} vs ${nameB} ストリートファイター6`
    ];

    if (!VIDEO_API_BASE_URL) {
        videosArea.innerHTML = `<p class="video-empty">現在関連動画はありません</p>`;
        return;
    }

    const results = await fetchVideosWithQueryRetry(VIDEO_API_BASE_URL, queries, 8);

    if (!results) {
        videosArea.innerHTML = `<p class="video-empty">現在関連動画はありません</p>`;
        return;
    }

    videosArea.innerHTML = results.map(video => `
        <a class="video-scroll-card" href="${video.url}" target="_blank" rel="noopener">
            <img src="${video.thumbnail}" alt="${video.title}">
            <div class="video-scroll-info">
                <h4>${video.title}</h4>
            </div>
        </a>
    `).join("");

}
function createSection(title,rows){

    const content =
        document.getElementById("compareContent");

    content.innerHTML += `

<div class="compare-group">

    <button
    class="compare-toggle"
    data-title="${title}"
>

    ▼ ${title}

</button>

    <table class="compare-table">

        <thead>

            <tr>

                <th>項目</th>

                ${compareIds.map(id=>`
                    <th>${characterData[id].name}</th>
                `).join("")}

            </tr>

        </thead>

        <tbody>

            ${rows.map(row=>createRowHtml(row[0],row[1])).join("")}

        </tbody>

    </table>

</div>

`;

}
function createRowHtml(title,key){

    return `

<tr>

    <td>${title}</td>

    ${compareIds.map(id=>{

        const character =
            characterData[id];

        let value =character[key];


        if(
    [
        "strengths",
        "weaknesses",
        "recommend"
    ].includes(key)
){

    value = `

<ul class="compare-list">

${value.map(item => `
<li>${item}</li>
`).join("")}

</ul>

`;

}
        if(
            [
                "difficulty",
                "combo",
                "power",
                "speed",
                "defense",
                "reach",
                "beginner"
            ].includes(key)
        ){

            value =
                "★".repeat(value) +
                "☆".repeat(5-value);

        }

        return `<td>${value}</td>`;

    }).join("")}

</tr>

`;

}

const changeCharacterButton =
    document.getElementById("changeCharacterButton");

changeCharacterButton.addEventListener("click",()=>{

    location.href="character-select.html";

});

document.addEventListener("click", e => {

    const button = e.target.closest(".compare-toggle");
    if (!button) return;

    const table = button.nextElementSibling;

    table.classList.toggle("hidden");

    if (table.classList.contains("hidden")) {
        button.textContent = "▶ " + button.dataset.title;
    } else {
        button.textContent = "▼ " + button.dataset.title;
    }

});