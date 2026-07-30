
const scoreArea =document.getElementById("scoreArea");
const resultMatchups =document.getElementById("resultMatchups");
const proPlayerArea = document.getElementById("proPlayerArea");
const statusArea =document.getElementById("statusArea");
const result = localStorage.getItem("sf6dna_result");
const score =JSON.parse(localStorage.getItem("sf6dna_score"));

// ===== 診断未実施でこのページに直接アクセスした場合のガード =====
// score/resultが無い状態でこの先の処理(スコア集計など)を行うとエラーになるため、
// 診断ページへ誘導する(training.html等、他ページと同様のフォールバック方針)
if (!score || typeof score !== "object" || !result) {
    location.href = "diagnosis.html";
    throw new Error("[result] 診断結果が無いため diagnosis.html へリダイレクトします");
}

// ===== 診断モード表示(初心者用/上級者用) =====
const diagnosisModeUsed = localStorage.getItem("sf6dna_diagnosis_mode") || "beginner";
const resultModeBadgeEl = document.getElementById("resultModeBadge");
if (resultModeBadgeEl) {
    resultModeBadgeEl.textContent =
        diagnosisModeUsed === "advanced" ? "🔥 上級者用診断の結果" : "⚡ 初心者用診断の結果";
    resultModeBadgeEl.classList.add(
        diagnosisModeUsed === "advanced" ? "mode-badge-advanced" : "mode-badge-beginner"
    );
}
const resultType = document.getElementById("resultType");
const resultDescription = document.getElementById("resultDescription");
const resultCharacters = document.getElementById("resultCharacters");
const resultStrengths = document.getElementById("resultStrengths");
const resultWeaknesses = document.getElementById("resultWeaknesses");
const resultReason =document.getElementById("resultReason");
const resultWeakCharacters =document.getElementById("resultWeakCharacters");
const resultImprove =document.getElementById("resultImprove");
const shareButton =document.getElementById("shareButton");
const favoriteButton = document.getElementById("favoriteButton");
const jpTab = document.getElementById("jpTab");
const worldTab = document.getElementById("worldTab");
const confidenceArea =document.getElementById("confidenceArea");
const recommendedTactics =document.getElementById("recommendedTactics");
const historyArea = document.getElementById("historyArea");
const clearHistoryButton = document.getElementById("clearHistoryButton");

// ===== タイプごとのアクセントカラー =====
// オレンジ一色になりがちだったため、診断タイプごとに異なる色を割り当てて
// ページ全体(バッジ・タグ・ゲージ・見出し等)に反映する。
const typeColors = {
    aggressive: "#ff6b00",
    defensive:  "#3b82f6",
    zoning:     "#14b8a6",
    balanced:   "#a855f7",
    reading:    "#22d3ee",
    combo:      "#ef4444",
    strategy:   "#6366f1",
    instinct:   "#eab308"
};

function hexToRgba(hex, alpha) {
    const n = parseInt(hex.replace("#", ""), 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const typeColor = typeColors[result] || typeColors.aggressive;
document.documentElement.style.setProperty("--type-color", typeColor);
document.documentElement.style.setProperty("--type-color-soft", hexToRgba(typeColor, 0.15));

// ===== 確信度（diagnosis.jsのscoreから動的に算出） =====
// resultDataは説明文などのテキストのみを持つ設計にしたため、
// 確信度は「1位のスコアが全体に占める割合」からその場で計算する。
function calculateConfidence(scoreObj, topKey) {

    const total = Object.values(scoreObj).reduce((sum, v) => sum + v, 0);
    const topScore = scoreObj[topKey] || 0;
    const percent = total > 0 ? Math.round((topScore / total) * 100) : 0;

    return {
        score: percent,
        comment: `回答全体の${percent}%が「${resultData[topKey].name}」の傾向を示していました。`
    };

}

const confidence = calculateConfidence(score, result);

confidenceArea.innerHTML = `

<div class="score-item">

<div class="score-header">

<strong>${confidence.score}%</strong>

</div>

<div class="score-bar">

<div
class="score-fill"
style="width:${confidence.score}%">
</div>

</div>

<p style="margin-top:12px;">
${confidence.comment}
</p>

</div>

`;


// ===== おすすめキャラクターを毎回動的に算出 =====
// character-evaluation.js の dna (8軸) と、診断で得た score (8軸) の
// コサイン類似度を計算し、近いキャラほど「相性が良い」として上位に並べる。
// これにより「攻撃型なら毎回同じ3人」ではなく、回答内容(scoreの内訳)に応じて
// 毎回違うTOP3が出るようになる。
function calculateCharacterRecommendations(scoreObj, topN = 3) {

    const axes = Object.keys(scoreObj);

    const scored = Object.keys(characterEvaluation).map(id => {

        const dna = characterEvaluation[id].dna;

        let dot = 0;
        let scoreMagnitude = 0;
        let dnaMagnitude = 0;

        axes.forEach(axis => {
            const s = scoreObj[axis] || 0;
            const d = dna[axis] || 0;
            dot += s * d;
            scoreMagnitude += s * s;
            dnaMagnitude += d * d;
        });

        // dnaが全て0(未入力キャラ)は候補から除外する
        if (dnaMagnitude === 0) return null;

        const similarity =
            dot / (Math.sqrt(scoreMagnitude) * Math.sqrt(dnaMagnitude));

        const charInfo = characterData[id];

        return {
            id,
            name: charInfo ? charInfo.name : id,
            image: charInfo ? charInfo.image : "",
            role: charInfo ? charInfo.type : "",
            feature: charInfo ? charInfo.concept : "",
            score: Math.round(similarity * 100),
            reason: characterEvaluation[id].recommendationReason || ""
        };

    }).filter(entry => entry !== null);

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topN);

}

const recommendedCharacters = calculateCharacterRecommendations(score, 3);

// ===== 苦手になりやすいキャラクター(スコア配分から動的算出) =====
// 「〇〇型だからこのキャラが苦手」という固定リストではなく、
// ユーザーの8軸スコアの中で相対的に低い軸(弱点)を特定し、
// その軸のDNA評価が高いキャラクター(=弱点を突いてきやすい相手)を選ぶ。
// これにより、同じ診断タイプでもスコア配分が違えば違う苦手キャラが出る。

const AXIS_TRAIT_LABELS = {
    aggressive: { weak: "攻めの継続力", strong: "攻めを継続してくる" },
    defensive: { weak: "守りの堅さ", strong: "守りが堅く崩しにくい" },
    zoning: { weak: "間合い管理", strong: "間合い管理が巧みで距離を詰めさせない" },
    balanced: { weak: "対応力の高さ", strong: "隙が少なく対応力が高い" },
    reading: { weak: "読み合いの精度", strong: "読みが鋭く行動を見切ってくる" },
    combo: { weak: "コンボの安定感", strong: "一度捕まると火力が高い" },
    strategy: { weak: "対策・分析力", strong: "対策や研究がしっかりしている" },
    instinct: { weak: "勝負強さ", strong: "土壇場での勝負強さがある" }
};

function calculateWeakCharacters(scoreObj, topN = 3) {

    const axes = Object.keys(scoreObj);

    const average =
        axes.reduce((sum, axis) => sum + (scoreObj[axis] || 0), 0) / axes.length;

    // 平均より低い軸ほど「弱点」として重みを持たせる
    const weakness = {};
    axes.forEach(axis => {
        weakness[axis] = Math.max(0, average - (scoreObj[axis] || 0));
    });

    const scored = Object.keys(characterEvaluation).map(id => {

        const dna = characterEvaluation[id].dna;
        if (!dna) return null;

        // このキャラが、ユーザーの弱点軸をどれだけ強く突いてくるか
        let matchScore = 0;
        let topAxis = null;
        let topAxisContribution = -1;

        axes.forEach(axis => {
            const contribution = weakness[axis] * (dna[axis] || 0);
            matchScore += contribution;

            if (contribution > topAxisContribution) {
                topAxisContribution = contribution;
                topAxis = axis;
            }
        });

        const charInfo = characterData[id];
        if (!charInfo) return null;

        const traitLabel = topAxis ? AXIS_TRAIT_LABELS[topAxis] : null;

        return {
            id,
            matchScore,
            reason: traitLabel
                ? `あなたは「${traitLabel.weak}」がやや控えめな傾向があるため、${traitLabel.strong}${charInfo.name}のようなキャラには苦戦しやすい可能性があります。`
                : `プレイスタイルの噛み合わせによっては、苦戦する可能性があるキャラクターです。`
        };

    }).filter(entry => entry !== null && entry.matchScore > 0);

    scored.sort((a, b) => b.matchScore - a.matchScore);

    return scored.slice(0, topN);

}

const dynamicWeakCharacters = calculateWeakCharacters(score, 3);


recommendedTactics.innerHTML = "";

resultData[result].recommendedTactics.forEach(tactic => {

    recommendedTactics.innerHTML += `

    <div class="tactic-card">

        <h4>🔥 ${tactic.title}</h4>

        <p>${tactic.detail}</p>

    </div>

    `;

});



resultType.textContent = resultData[result].name;

document.getElementById("resultCatchCopy").textContent =
    resultData[result].catchCopy;

resultReason.innerHTML =
    resultData[result].reason.replace(/\n/g, "<br>") +
    `<div class="trait-tags">` +
    resultData[result].traits.map(t => `<span class="trait-tag">${t}</span>`).join("") +
    `</div>`;

    resultImprove.innerHTML =
        resultData[result].improve.map(tip => `<li>${tip}</li>`).join("");

resultDescription.textContent =resultData[result].description;

document.getElementById("resultSummary").textContent =
resultData[result].summary;

resultCharacters.innerHTML = "";

const characterReasonEl = document.getElementById("resultCharacterReason");
if (characterReasonEl) {
    characterReasonEl.textContent = resultData[result].characterReason;
}

recommendedCharacters.forEach((character, index) => {

    const rank = ["🥇", "🥈", "🥉"][index] || "";

    resultCharacters.innerHTML += `
        <a class="character-card" href="character.html?id=${character.id}">

    <span class="character-rank">${rank}</span>

    <img
    src="${character.image}"
    alt="${character.name}"
    class="result-character-image"
>

    <h4>${character.name}</h4>

    <p>${character.role}</p>

    <strong>${character.feature}</strong>

    <p class="character-match-score">相性度 ${character.score}%</p>

</a>
    `;

});

resultStrengths.innerHTML = "";

resultData[result].strengths.forEach(item => {

    resultStrengths.innerHTML += `<li>${item}</li>`;


});

resultWeaknesses.innerHTML = "";

resultData[result].weaknesses.forEach(item => {

    resultWeaknesses.innerHTML += `
    <li class="weakness-item">
        <div class="weakness-front">
            <span>${item.text}</span>
            <span class="weakness-hint">カーソルを合わせると改善点が見れます ▶</span>
        </div>
        <div class="weakness-improve">
            💡 ${item.improve}
        </div>
    </li>
    `;

});
const status = resultData[result].status;

// スコアの最大値を基準に相対的なゲージにする(1位のタイプが必ず100%になる)
const maxScore = Math.max(...Object.values(score), 1);

scoreArea.innerHTML = Object.keys(score).map(key => `

<div class="score-item">

    <div class="score-header">

        <span>${resultData[key].name}</span>

        <strong>${score[key]}点</strong>

    </div>

    <div class="score-bar">

        <div
            class="score-fill"
            style="width:${Math.round((score[key] / maxScore) * 100)}%">
        </div>

    </div>

</div>

`).join("");

// プレイ傾向: 診断と同じ8軸すべてを星評価で表示
const statusLabels = {
    aggressive: "攻めの強さ",
    defensive: "受けの堅さ",
    zoning: "間合い管理",
    balanced: "対応力",
    reading: "読み合い",
    combo: "コンボ火力",
    strategy: "戦略性",
    instinct: "勝負強さ"
};

statusArea.innerHTML = Object.keys(statusLabels).map(key => {
    const value = status[key] || 0;
    return `
    <div class="status-item">
        <span class="status-label">${statusLabels[key]}</span>
        <span class="status-stars">${"★".repeat(value)}${"☆".repeat(5 - value)}</span>
    </div>
    `;
}).join("");

resultWeakCharacters.innerHTML = "";

dynamicWeakCharacters.forEach(weak => {

    const charInfo = characterData[weak.id];
    if (!charInfo) return;

    resultWeakCharacters.innerHTML += `
        <a class="character-card weak-character-card" href="character.html?id=${weak.id}">

    <img
        src="${charInfo.image}"
        alt="${charInfo.name}"
        class="result-character-image"
    >

            <h4>${charInfo.name}</h4>

            <p>${weak.reason}</p>

        </a>
    `;

});
resultMatchups.innerHTML = "";

resultData[result].matchups.forEach(type => {

    resultMatchups.innerHTML += `

    <div class="matchup-card">

        <h4>${type.name}</h4>

        <div class="matchup-stars">${"★".repeat(type.rate)}${"☆".repeat(5 - type.rate)}</div>

        <p>${type.reason}</p>

    </div>

    `;

});
shareButton.addEventListener("click", () => {

    const text = `私のSF6 DNA診断結果は「${resultData[result].name}」でした！

おすすめキャラクター
${recommendedCharacters.map(c => "・" + c.name).join("\n")}


#SF6
#SF6DNA`;

    const url =
        "https://twitter.com/intent/tweet?text=" +
        encodeURIComponent(text);

    window.open(url);

});


function renderProPlayers(country){

    proPlayerArea.innerHTML = "";

    const countryLabel = country === "japan" ? "🇯🇵 日本勢" : "🌍 海外勢";

    const entries = country === "japan"
        ? getDynamicJapanProPlayers(score)
        : resultData[result].proPlayers.world;

    entries.forEach(entry => {

        const info = proPlayerDirectory[entry.id] || dynamicPlayerToDirectoryEntry(entry.id);
        if (!info) return;

        const charInfo = characterData[info.characterId];

        // 実写真が無い選手はイニシャルアバターにフォールバックする
        const photoHtml = info.image
            ? `<img src="${info.image}" alt="${info.name}" class="pro-player-photo">`
            : `<div class="pro-player-photo pro-player-photo-fallback">${info.name.charAt(0)}</div>`;

        proPlayerArea.innerHTML += `

<a
    class="character-card pro-player-card"
    href="player.html?id=${entry.id}"
>

    <span class="country-badge">${countryLabel}</span>

    <div class="pro-player-photos">

        ${photoHtml}

        ${charInfo ? `<img src="${charInfo.image}" alt="${charInfo.name}" class="pro-player-character-photo">` : ""}

    </div>

    <h4>${info.name}</h4>

    <p><strong>使用キャラ：</strong>${info.character}</p>

    <p>${entry.reason}</p>

</a>

`;

    });

}

// ===== 日本勢おすすめプロプレイヤーの動的選出 =====
// 「診断タイプ1つ」だけでなく、8軸すべてのスコアを重みとして使い、
// 選手のプレイスタイル(style)とどれだけマッチするかを算出する。
// これにより、同じ診断タイプでもスコアの配分(何点でその型になったか)が
// 違えば、違うおすすめ選手が表示されるようになる。
const AXIS_STYLE_KEYWORDS = {
    aggressive: ["攻撃", "攻め", "爆発力"],
    defensive: ["堅実", "対応", "守"],
    zoning: ["待ち", "間合い"],
    balanced: ["万能", "バランス"],
    reading: ["読み合い"],
    combo: ["技巧", "コンボ"],
    strategy: ["研究", "分析", "攻略"],
    instinct: ["挑戦", "勝負", "型"]
};

function getDynamicJapanProPlayers(scoreObj) {

    const axes = Object.keys(scoreObj);

    const candidates = Object.values(proData)
        .filter(p => p.style)
        .map(p => {

            // このプレイヤーのstyleが、ユーザーのどの軸のキーワードに
            // 一致するかを見て、一致した軸のスコアの合計をマッチ度とする
            let matchScore = 0;
            let bestAxis = null;
            let bestAxisScore = -1;

            axes.forEach(axis => {
                const keywords = AXIS_STYLE_KEYWORDS[axis] || [];
                const hit = keywords.some(kw => p.style.includes(kw));
                if (hit) {
                    const s = scoreObj[axis] || 0;
                    matchScore += s;
                    if (s > bestAxisScore) {
                        bestAxisScore = s;
                        bestAxis = axis;
                    }
                }
            });

            return { player: p, matchScore, bestAxis };

        })
        .filter(entry => entry.matchScore > 0);

    candidates.sort((a, b) => b.matchScore - a.matchScore);

    // マッチする選手が3人未満の場合は、既存の固定リストで不足分を補う
    const fallback = resultData[result].proPlayers.japan;

    const picked = candidates.slice(0, 3).map(entry => ({
        id: entry.player.id,
        reason: `プレイスタイル「${entry.player.style}」が、あなたのスコア配分と特に近い選手です。`
    }));

    while (picked.length < 3 && fallback[picked.length]) {
        picked.push(fallback[picked.length]);
    }

    return picked;

}

// proPlayerDirectory(固定6名)に無い、動的に選ばれた選手用に
// playerDataから同じ形式の情報を組み立てる
function dynamicPlayerToDirectoryEntry(id) {

    const player = typeof playerData !== "undefined" ? playerData[id] : null;
    if (!player) return null;

    const mainCharId = player.characters && player.characters[0];
    const mainCharName = mainCharId && characterData[mainCharId] ? characterData[mainCharId].name : "";

    return {
        name: player.name,
        characterId: mainCharId,
        character: mainCharName,
        image: player.image || "",
        country: "japan"
    };

}




renderProPlayers("japan");
jpTab.classList.add("active");

jpTab.addEventListener("click", () => {

    jpTab.classList.add("active");
    worldTab.classList.remove("active");

    renderProPlayers("japan");

});

worldTab.addEventListener("click", () => {

    worldTab.classList.add("active");
    jpTab.classList.remove("active");

    renderProPlayers("world");

});

const isViewingPastResult =
    new URLSearchParams(location.search).get("view") === "1";

// ===== 診断履歴保存 =====
// view=1 (履歴から過去の結果を見返している状態)の時は、
// 履歴を新しく積み増さない
const history = JSON.parse(
    localStorage.getItem("sf6dna_history")
) || [];

let currentHistoryEntry;

if (!isViewingPastResult) {

    currentHistoryEntry = {
        id: `h_${Date.now()}`,
        result: result,
        score: score,
        date: new Date().toLocaleString("ja-JP"),
        saved: false
    };

    history.unshift(currentHistoryEntry);

    localStorage.setItem(
        "sf6dna_history",
        JSON.stringify(history.slice(0, 20))
    );

}

favoriteButton.addEventListener("click", () => {

    const favorites = JSON.parse(
        localStorage.getItem("sf6dna_favorites")
    ) || [];

   favorites.push({

    id: `f_${Date.now()}`,

    result: result,

    resultName: resultData[result].name,

    score: score,

    date: new Date().toLocaleString("ja-JP"),

    characters: recommendedCharacters

});

    localStorage.setItem(
        "sf6dna_favorites",
        JSON.stringify(favorites)
    );

    // 対応する履歴カードにも「保存済み」の印を付ける
    if (currentHistoryEntry) {

        currentHistoryEntry.saved = true;

        const savedHistory = JSON.parse(
            localStorage.getItem("sf6dna_history")
        ) || [];

        const target = savedHistory.find(h => h.id === currentHistoryEntry.id);
        if (target) target.saved = true;

        localStorage.setItem(
            "sf6dna_history",
            JSON.stringify(savedHistory)
        );

    }

    favoriteButton.classList.add("saved");
    favoriteButton.textContent = "✓ 保存しました";

    renderHistory();

});

// ===== 診断履歴表示 =====
// 保存済み(saved:true)の履歴は強調表示し、クリックすると
// その回の診断結果をもう一度見返せる(result.html?view=1 として読み込み直す)
function renderHistory() {

    historyArea.innerHTML = "";

    history.forEach((item, index) => {

        const typeName =
            resultData[item.result] ? resultData[item.result].name : item.result;

        const isCurrent = !isViewingPastResult && index === 0;

        historyArea.innerHTML += `

    <button
        class="history-card ${item.saved ? "history-card-saved" : ""} ${isCurrent ? "history-card-current" : ""}"
        data-index="${index}"
        ${item.score ? "" : "disabled"}
    >

        ${item.saved ? `<span class="history-saved-badge">★ 保存済み</span>` : ""}

        <strong>${typeName}</strong>

        <p>${item.date}</p>

    </button>

    `;

    });

    historyArea.querySelectorAll(".history-card").forEach(card => {

        card.addEventListener("click", () => {

            const item = history[Number(card.dataset.index)];
            if (!item || !item.score) return;

            localStorage.setItem("sf6dna_result", item.result);
            localStorage.setItem("sf6dna_score", JSON.stringify(item.score));

            location.href = "result.html?view=1";

        });

    });

}

renderHistory();

clearHistoryButton.addEventListener("click", () => {

    const ok = confirm("診断履歴を削除しますか？（保存済みの診断は残ります）");
    if (!ok) return;

    // saved:true(お気に入り登録済み)のものは履歴からも削除しない
    const currentHistory = JSON.parse(
        localStorage.getItem("sf6dna_history")
    ) || [];

    const keptHistory = currentHistory.filter(h => h.saved);

    localStorage.setItem(
        "sf6dna_history",
        JSON.stringify(keptHistory)
    );

    history.length = 0;
    history.push(...keptHistory);

    renderHistory();

});

// ===== セクションのスクロールイン演出 =====
// 各result-sectionが画面内に入ったタイミングで.in-viewを付与してフェードインさせる
if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                revealObserver.unobserve(entry.target);
            }

        });

    }, { threshold: 0.15 });

    document.querySelectorAll(".result-section").forEach(section => {
        revealObserver.observe(section);
    });

} else {

    // 非対応ブラウザでは全セクションをそのまま表示する
    document.querySelectorAll(".result-section").forEach(section => {
        section.classList.add("in-view");
    });

}

// ===== おすすめ動画(診断タイプに合わせて座学系の動画を取得) =====
const VIDEO_API_BASE_URL = "https://sf6dna-backend.onrender.com";

const recommendedVideosArea = document.getElementById("recommendedVideosArea");

async function loadRecommendedVideos() {

    const typeName = resultData[result].name;

    // タイプごとに座学として学べそうな検索クエリを組み立てる
    const queries = [
        `${typeName} 立ち回り 座学 ストリートファイター6`,
        `SF6 初心者 上達 コツ 解説`,
    ];

    let videos = [];

    if (VIDEO_API_BASE_URL) {

        for (const q of queries) {

            try {

                const url = `${VIDEO_API_BASE_URL}/api/videos/search?q=${encodeURIComponent(q)}&max=6`;
                const res = await fetch(url);

                if (res.ok) {
                    const data = await res.json();
                    if (data.results && data.results.length > 0) {
                        videos = videos.concat(data.results);
                    }
                }

            } catch (err) {
                console.warn("[recommendedVideos] 取得に失敗しました", err);
            }

            if (videos.length >= 5) break;

        }

    }

    if (videos.length === 0) {

        // API取得に失敗、または0件だった場合の代替表示
        recommendedVideosArea.innerHTML = `
            <p class="video-empty">現在関連動画はありません</p>
        `;
        return;

    }

    recommendedVideosArea.innerHTML = videos.slice(0, 10).map(video => `
        <a class="video-scroll-card" href="${video.url}" target="_blank" rel="noopener">
            <img src="${video.thumbnail}" alt="${video.title}">
            <div class="video-scroll-info">
                <h4>${video.title}</h4>
            </div>
        </a>
    `).join("");

}

loadRecommendedVideos();
