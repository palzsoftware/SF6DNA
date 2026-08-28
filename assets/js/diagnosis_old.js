const score = {
    aggressive: 0,
    defensive: 0,
    zoning: 0,
    balanced: 0
};
const questions = [
{
    question: "相手の体力が残り少なくなった時、あなたはどう行動しますか？",
    answers: [
        { text: "一気に攻め切る", score: { aggressive: 2,zoning: 1, balanced: 1 } },
        { text: "相手を見てから攻める", score: { defensive: 2, balanced: 2 } },
        { text: "無理をせず様子を見る", score: { defensive: 3 } },
        { text: "飛び道具や牽制で削る", score: { zoning: 3 } },
        { text: "状況によって変える", score: { balanced: 3 } }
    ]
},
{
    question: "ラウンド開始直後はどう動きますか？",
    answers: [
        { text: "前へ歩く", score: { aggressive: 3 } },
        { text: "様子を見る", score: { defensive: 3,zoning: 2 } },
        { text: "ジャンプする", score: { aggressive: 2, balanced: 1 } },
        { text: "飛び道具を撃つ", score: { zoning: 3 } },
        { text: "相手次第", score: { balanced: 3 } }
    ]
},
{
    question: "相手にインパクトを打たれたら？",
    answers: [
        { text: "返す", score: { aggressive: 2, balanced: 1, balanced: 1 } },
        { text: "ガードする", score: { defensive: 3 } },
        { text: "投げる", score: { aggressive: 3 } },
        { text: "避ける", score: { zoning: 2, balanced: 1 } },
        { text: "状況次第", score: { balanced: 3 } }
    ]
},
{
    question: "一番好きな勝ち方は？",
    answers: [
        { text: "ラッシュで押し切る", score: { aggressive: 3 } },
        { text: "読み勝つ", score: { defensive: 2, zoning: 2 } },
        { text: "じっくり削る", score: { zoning: 3 } },
        { text: "コンボを決める", score: { aggressive: 2, balanced: 1 } },
        { text: "何でも良い", score: { balanced: 3 } }
    ]
},
{
    question: "守りで意識することは？",
    answers: [
        { text: "暴れる", score: { aggressive: 3 } },
        { text: "ガードする", score: { defensive: 3 } },
        { text: "パリィする", score: { defensive: 2, balanced: 1 } },
        { text: "無敵技を使う", score: { aggressive: 2 } },
        { text: "状況次第", score: { balanced: 3 } }
    ]
},
{
    question: "好きな距離は？",
    answers: [
        { text: "密着", score: { aggressive: 3 } },
        { text: "近距離", score: { aggressive: 2, balanced: 1 } },
        { text: "中距離", score: {defensive: 1, balanced: 2  } },
        { text: "遠距離", score: { zoning: 3, defensive: 1} },
        { text: "全部", score: { balanced: 3 } }
    ]
},
{
    question: "負けた時はどう考えますか？",
    answers: [
        { text: "自分の攻め不足", score: { aggressive: 3 } },
        { text: "読み負けた", score: { defensive: 2, zoning: 2  } },
        { text: "操作ミス", score: { balanced: 2 } },
        { text: "キャラ相性", score: { zoning: 2, balanced: 1 } },
        { text: "毎回違う", score: { balanced: 3 } }
    ]
},
{
    question: "よく使う行動は？",
    answers: [
        { text: "ラッシュ", score: { aggressive: 3 } },
        { text: "通常技", score: { defensive: 1, balanced: 2} },
        { text: "ジャンプ", score: { aggressive: 2, balanced: 1  } },
        { text: "飛び道具", score: { zoning: 3 } },
        { text: "全部使う", score: { balanced: 3 } }
    ]
},
{
    question: "得意なのは？",
    answers: [
        { text: "攻め", score: { aggressive: 3 } },
        { text: "守り", score: { defensive: 3 } },
        { text: "対空", score: { defensive: 2, balanced: 1 } },
        { text: "差し返し", score: { zoning: 3 } },
        { text: "状況判断", score: { balanced: 3 } }
    ]
},
{
    question: "試合中に最も意識することは？",
    answers: [
        { text: "攻撃を通す", score: { aggressive: 3 } },
        { text: "相手を見る", score: { defensive: 2, zoning: 2 } },
        { text: "ゲージ管理", score: { balanced: 3 } },
        { text: "体力管理", score: { defensive: 3} },
        { text: "全部", score: { balanced: 4 } }
    ]
}
];

let currentQuestion = 0;
const userAnswers = [];

const questionNumber = document.getElementById("questionNumber");
const questionTitle = document.getElementById("questionTitle");
const answerList = document.getElementById("answerList");

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const remainingText =
document.getElementById("remainingText");

function renderQuestion() {

    const q = questions[currentQuestion];

    questionNumber.textContent = `Q${currentQuestion + 1}`;
    questionTitle.textContent = q.question;

    answerList.innerHTML = "";

    q.answers.forEach((answer, index) => {

        const label = document.createElement("label");
        label.className = "answer-item";

        label.innerHTML = `
            <input type="radio" name="question">
            <span class="answer-text">${answer.text}</span>
        `;

        label.addEventListener("click", () => {
            selectAnswer(index);
        });

        answerList.appendChild(label);

    });

    updateProgress();

}

function updateProgress() {

    const totalQuestions = 50;

    progressBar.style.width =
        `${((currentQuestion + 1) / totalQuestions) * 100}%`;

    progressText.textContent =
        `QUESTION ${String(currentQuestion + 1).padStart(2, "0")} / ${totalQuestions}`;

    remainingText.textContent =
        `残り${totalQuestions - (currentQuestion + 1)}問`;

}

function selectAnswer(index) {

    // 回答を保存
    userAnswers[currentQuestion] = index;

    // 選択した回答
    const answer = questions[currentQuestion].answers[index];

    // スコア加算
    for (const type in answer.score) {
        score[type] += answer.score[type];
    }

    // 最後の質問か判定
    if (currentQuestion === questions.length - 1) {
        finishDiagnosis();
        return;
    }

    // 次の質問へ
    currentQuestion++;
    renderQuestion();

}

function finishDiagnosis() {

    let result = "万能型";

    let maxScore = -1;

    for (const type in score) {

        if (score[type] > maxScore) {

            maxScore = score[type];

            switch (type) {

                case "aggressive":
                    result = "攻撃型";
                    break;

                case "defensive":
                    result = "堅実型";
                    break;

                case "zoning":
                    result = "待ち型";
                    break;

                case "balanced":
                    result = "万能型";
                    break;

            }

        }

    }

    localStorage.setItem(
        "sf6dna_result",
        result
    );

    localStorage.setItem(
        "sf6dna_score",
        JSON.stringify(score)
    );

    location.href = "result.html";

}

renderQuestion();