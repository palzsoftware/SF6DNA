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

        <p class="character-difficulty">

            難易度：
            ${"★".repeat(character.difficulty)}
            ${"☆".repeat(5-character.difficulty)}

        </p>

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