// =========================================
// SF6 DNA Diagnosis System v2
// =========================================

// -----------------------------
// スコア
// -----------------------------

const score = {

    aggressive:0,   //攻撃型(自分から積極的に攻めて主導権を握りたい人)
    defensive:0,    //堅実型(安定した立ち回りで確実な勝利を目指したい人)
    zoning:0,       //待ち型(相手を動かしてペースを崩し、有利な状況を作って勝ちたい人)
    balanced:0,     //万能型(状況に応じて柔軟に対応し、臨機応変に戦いたい人)

    reading:0,      //読み合い型(相手の考えや行動を読み、先手を取って勝ちたい人)
    combo:0,        //コンボ型(高火力や高難度コンボで大きなリターンを狙いたい人)
    strategy:0,     //戦略型(相手の癖や行動を分析し、対策を組み立てて勝ちたい人)
    instinct:0      //挑戦型(不利な状況でも諦めず、一発逆転を狙って勝負したい人)

};

// -----------------------------
// 現在の質問番号
// -----------------------------

let currentQuestion = 0;

// -----------------------------
// 回答履歴
// -----------------------------

const userAnswers = [];

// -----------------------------
// DOM
// -----------------------------

const questionNumber =
    document.getElementById("questionNumber");

const questionTitle =
    document.getElementById("questionTitle");

const answerList =
    document.getElementById("answerList");

const progressBar =
    document.getElementById("progressBar");

const progressText =
    document.getElementById("progressText");

const stageText =
    document.getElementById("stageText");

const stageDots =
    document.getElementById("stageDots");

const encourageMessage =
    document.getElementById("encourageMessage");

const backButton =
    document.getElementById("backButton");

const stageClearOverlay =
    document.getElementById("stageClearOverlay");

const stageClearTitle =
    document.getElementById("stageClearTitle");

const stageClearSub =
    document.getElementById("stageClearSub");

// -----------------------------
// ステージ構成(UI表示専用。質問データ・スコアリングには一切影響しない)
// -----------------------------
// 1ステージ = 10問。ステージ名は回答内容を誘導しないよう、
// 抽象的なテーマ名にしている。ステージ数は質問配列の長さから自動算出する。

const STAGE_SIZE = 10;

const STAGE_NAMES_BEGINNER = [
    "基本スタイル", "プレイ傾向", "立ち回り", "判断", "総合分析"
];

const STAGE_NAMES_ADVANCED = [
    "基本スタイル", "プレイ傾向", "立ち回り", "判断", "読み合い",
    "対応力", "精密分析", "深層心理", "実戦傾向", "総合分析"
];

// ステージクリア時のサブメッセージ(短く・軽いテンポを保つ)
const STAGE_CLEAR_SUB_MESSAGES = [
    "分析を続行します…",
    "次の分析へ…",
    "特徴をさらに解析します…",
    "傾向を読み取っています…"
];

// 回答モチベーションメッセージ(進捗率で切り替える)
// 実際の診断結果には一切影響しない、演出目的のテキストのみ
const ENCOURAGE_MESSAGES = [
    { threshold: 0.3, text: "ここから診断精度が上がります" },
    { threshold: 0.6, text: "かなり特徴が見えてきました" },
    { threshold: 0.8, text: "あと少しでタイプが判明します" },
    { threshold: 0.95, text: "最後の分析です" }
];

// ローディング画面(結果ページ遷移前)で順番に表示するメッセージ
const LOADING_MESSAGES = [
    "プレイスタイルを解析中...",
    "立ち回り傾向を分析中...",
    "攻撃性・読み合い傾向を測定中...",
    "あなたのSF6 DNAを生成しています..."
];

// 期待感メッセージの重複表示防止・自動消去用の状態
let lastEncourageMessage = "";
let encourageMessageTimer = null;

// -----------------------------
// 質問データ
// -----------------------------

const questions = [
    {
    question: "ラウンド開始直後、あなたは最初にどう動きますか？",
    answers: [
        { text: "積極的に前に出て攻める", score: { aggressive: 3} },
        { text: "差し返しできる距離を保ち相手の様子を見る", score: { defensive: 2, zoning: 1 } },
        { text: "飛び道具が打てる安全な距離を保つ", score: { zoning: 3 } },
        { text: "初手の相手の動きに合わせて行動を変える", score: { balanced: 3} },
        { text: "ジャンプやバックステップなどをして相手の癖を探しながら動く", score: {strategy :2,reading :1} }
    ]
},
{
    question: "対戦中、あなたが最も意識していることは？",
    answers: [
        { text: "相手に攻撃を当てること", score: { aggressive: 3 } },
        { text: "相手の動きを見ること", score: { reading :2,strategy :1 } },
        { text: "お互いのドライブゲージを見ること", score: { strategy :3} },
        { text: "相手との距離を維持すること", score: { zoning: 2, defensive: 1} },
        { text: "その時々によって変える", score: { balanced: 3 } }
    ]
},
{
    question: "試合中、相手が距離を詰めてきました。\nあなたならどうしますか？",
    answers: [
        { text: "こちらも距離を詰める", score: { aggressive: 3 } },
        { text: "置き技をおいて近づかせないようにする", score: { defensive: 2, zoning: 1} },
        { text: "後ろに下がって様子を見る", score: { zoning: 3 } },
        { text: "相手の狙いを読んで対応する", score: { reading :3 } },
        { text: "その場の状況で判断する", score: { balanced: 3 } }
    ]
},
{
    question: "ドライブゲージに余裕があるとき、どう動きますか？",
    answers: [
        { text: "ラッシュやOD技を使用して積極的に攻める", score: {aggressive: 3 } },
        { text: "チャンスが来るまで温存して戦う", score: { defensive: 3 } },
        { text: "相手を意図的に動かしてから使用する", score: { zoning: 2,strategy :1} },
        { text: "ダメージを伸ばすためにコンボで使用する", score: { combo:3 } },
        { text: "ドライブゲージがなくなるのが怖くて使えない", score: {balanced:1 } }
    ]
},
{
    question: "あなたが試合で一番楽しいと思える瞬間は？",
    answers: [
        { text: "自分の攻めが通りそのまま押し勝つ時", score: { aggressive: 3 } },
        { text: "相手の動きを読んで対応した時", score: { reading: 3 } },
        { text: "難しいコンボ(ドリームコンボ、ビタ押しコンボ)を決められた時", score: {combo: 3 } },
        { text: "相手の攻めをさばき切り守れた時", score: { defensive: 3 } },
        { text: "自分が不利な状況で逆転勝利できた時", score: { instinct: 3 } }
    ]
},
{
    question: "自分のドライブゲージが少ないとき、\nどう動きますか？",
    answers: [
        { text: "バーンアウトしてもいいから攻めを続ける", score: { aggressive: 3 } },
        { text: "距離を取り時間を稼いでドライブゲージを回復させながら戦う", score: { zoning:2,balanced:1} },
        { text: "画面端に追い込んでてもバーンアウトしたくないので後ろに下がる", score: {zoning: 3} },
        { text: "そもそもドライブゲージが少なくなる状況にならないようにしている", score: { defensive: 3} },
        { text: "相手の体力とドライブゲージ量による", score: { balanced: 3 } }
    ]
},
{
    question: "あなたが試合中、最も頼りにしている行動は？",
    answers: [
        { text: "ラッシュ", score: { aggressive: 3 } },
        { text: "通常技", score: { defensive: 1,strategy: 1,reading: 1} },
        { text: "ジャンプ", score: { aggressive: 2, instinct:1} },
        { text: "飛び道具", score: { zoning: 2, strategy: 1 } },
        { text: "インパクト", score: { instinct: 2,strategy: 1 } }
    ]
},
{
    question: "相手の攻撃が届かない距離では\n何をすることが多いですか？",
    answers: [
        { text: "自分から前に歩いて距離を詰める", score: { aggressive: 3 } },
        { text: "通常技を置いて牽制する", score: { defensive: 2, strategy: 1 } },
        { text: "飛び道具でプレッシャーをかける", score: { zoning: 3 } },
        { text: "相手の動きを見て判断する", score: { balanced: 3 } },
        { text: "相手の反応を観察する", score: { reading: 2, strategy: 1 } }
    ]
},
{
    question: "試合序盤でリードを取ったら、\nあなたはどう戦いますか？",
    answers: [
        { text: "そのままガンガン攻め続ける", score: { aggressive: 3 } },
        { text: "無理をせず慎重に戦う", score: { defensive: 3 } },
        { text: "相手を焦らせるように立ち回る", score: { zoning: 2, reading: 1 } },
        { text: "相手に合わせて戦い方を変える", score: { balanced: 3 } },
        { text: "逆転されないよう相手の癖を探す", score: { strategy: 2, reading: 1 } }
    ]
},
{
    question: "試合中立ち回りで一時的に距離が離れたとき、\nあなたはどうしますか？",
    answers: [
        { text: "すぐに距離を詰めて攻める", score: { aggressive: 3 } },
        { text: "相手の動きを見ながら前に出る", score: { defensive: 2, reading: 1 } },
        { text: "飛び道具や牽制技でプレッシャーをかける", score: { zoning: 3 } },
        { text: "その場の状況に合わせて行動を変える", score: { balanced: 3 } },
        { text: "相手の反応を見て作戦を組み立てる", score: { strategy: 2, reading: 1 } }
    ]
},

{
    question: "相手をダウンさせた時、\nあなたはどうすることが多いですか？",
    answers: [
        { text: "すぐに起き攻めへ行く", score: { aggressive: 3 } },
        { text: "安全な位置を維持する", score: { defensive: 3 } },
        { text: "相手の暴れを読んで攻撃する", score: { reading: 2, strategy: 1 } },
        { text: "状況に応じて変える", score: { balanced: 3 } },
        { text: "コンボルートを考える", score: { combo: 3 } }
    ]
},

{
    question: "攻める時、最も重視していることは？",
    answers: [
        { text: "相手を押し切ること", score: { aggressive: 3 } },
        { text: "攻めすぎて反撃されないこと", score: { defensive: 3 } },
        { text: "相手の行動を読むこと", score: { reading: 3 } },
        { text: "状況ごとに攻め方を変える", score: { balanced: 3 } },
        { text: "最大コンボを決めること", score: { combo: 3 } }
    ]
},

{
    question: "コンボが入った時、あなたはどう考えますか？",
    answers: [
        { text: "ドライブゲージを使ってできるだけ高火力を狙う", score: { combo: 3 } },
        { text: "安定コンボを選ぶ", score: { defensive: 3 } },
        { text: "起き攻めを優先する", score: { aggressive: 2, strategy: 1 } },
        { text: "状況によって使い分ける", score: { balanced: 3 } },
        { text: "相手のゲージも考えて決める", score: { strategy: 3 } }
    ]
},

{
    question: "攻めが止められた時、どうすることが多いですか？",
    answers: [
        { text: "もう一度攻め直す", score: { aggressive: 3 } },
        { text: "一旦距離を取る", score: { defensive: 3 } },
        { text: "相手の反応を見る", score: { reading: 2, strategy: 1 } },
        { text: "攻め方を変える", score: { balanced: 3 } },
        { text: "思い切って勝負に出る", score: { instinct: 3 } }
    ]
},

{
    question: "ドライブラッシュを使う時の考え方は？",
    answers: [
        { text: "チャンスがあればどんどん使う", score: { aggressive: 3 } },
        { text: "確実に当たる時だけ使う", score: { defensive: 3 } },
        { text: "相手の癖を見て使う", score: { reading: 2, strategy: 1 } },
        { text: "状況で使い分ける", score: { balanced: 3 } },
        { text: "コンボ火力を伸ばすために使う", score: { combo: 3 } }
    ]
},

{
    question: "ドライブインパクトを使う場面は？",
    answers: [
        { text: "壁際では積極的に狙う", score: { aggressive: 2, instinct: 1 } },
        { text: "確信がある時だけ使う", score: { defensive: 3 } },
        { text: "相手の癖を読んで使う", score: { reading: 2, strategy: 1 } },
        { text: "状況によって変える", score: { balanced: 3 } },
        { text: "逆転を狙う時に使う", score: { instinct: 3 } }
    ]
},

{
    question: "コンボ練習で一番重視することは？",
    answers: [
        { text: "火力が高いこと", score: { combo: 3 } },
        { text: "安定して成功すること", score: { defensive: 3 } },
        { text: "実戦で使いやすいこと", score: { balanced: 3 } },
        { text: "状況別に覚えること", score: { strategy: 3 } },
        { text: "見た目がかっこいいこと", score: { instinct: 3 } }
    ]
},

{
    question: "攻めが通っている時、あなたは？",
    answers: [
        { text: "最後まで攻め切る", score: { aggressive: 3 } },
        { text: "欲張らず安定を選ぶ", score: { defensive: 3 } },
        { text: "相手の反撃を警戒する", score: { reading: 2, strategy: 1 } },
        { text: "状況に応じて切り替える", score: { balanced: 3 } },
        { text: "さらに高火力を狙う", score: { combo: 3 } }
    ]
},

{
    question: "リーサルが見えた時、あなたは？",
    answers: [
        { text: "迷わず最大コンボを狙う", score: { combo: 2, aggressive: 1 } },
        { text: "安定して勝てる選択をする", score: { defensive: 3 } },
        { text: "相手の暴れも考える", score: { strategy: 2, reading: 1 } },
        { text: "その場で判断する", score: { balanced: 3 } },
        { text: "多少リスクがあっても勝負する", score: { instinct: 3 } }
    ]
},

{
    question: "攻めが成功した時、一番うれしい瞬間は？",
    answers: [
        { text: "攻め続けて勝ち切れた時", score: { aggressive: 3 } },
        { text: "相手を完全に読めた時", score: { reading: 3 } },
        { text: "最大コンボを決めた時", score: { combo: 3 } },
        { text: "考えた作戦が成功した時", score: { strategy: 3 } },
        { text: "大逆転できた時", score: { instinct: 3 } }
    ]
},

{
    question: "相手に攻め込まれている時、\n最初に考えることは？",
    answers: [
        { text: "チャンスを見つけて反撃する", score: { aggressive: 2, instinct: 1 } },
        { text: "まずはガードを固める", score: { defensive: 3 } },
        { text: "相手の攻め方を観察する", score: { reading: 2, strategy: 1 } },
        { text: "状況に応じて対応を変える", score: { balanced: 3 } },
        { text: "バーンアウトさせることも考える", score: { strategy: 3 } }
    ]
},

{
    question: "画面端に追い込まれた時、\nあなたはどうすることが多いですか？",
    answers: [
        { text: "思い切って攻め返す", score: { aggressive: 2, instinct: 1 } },
        { text: "無理せず守る", score: { defensive: 3 } },
        { text: "相手の癖を見て抜け出す", score: { reading: 2, strategy: 1 } },
        { text: "状況によって行動を変える", score: { balanced: 3 } },
        { text: "無敵技で切り返す", score: { instinct: 3 } }
    ]
},

{
    question: "相手の投げが多いと感じたら、\nどう対応しますか？",
    answers: [
        { text: "暴れで止める", score: { aggressive: 3 } },
        { text: "投げ抜けを狙う", score: { defensive: 3 } },
        { text: "相手のタイミングを読む", score: { reading: 3 } },
        { text: "その都度対応を変える", score: { balanced: 3 } },
        { text: "癖を分析して次に活かす", score: { strategy: 3 } }
    ]
},

{
    question: "相手のジャンプ攻撃には、\nどう対応することが多いですか？",
    answers: [
        { text: "対空を狙う", score: { defensive: 3 } },
        { text: "空対空を狙う", score: { aggressive: 2, instinct: 1 } },
        { text: "相手の癖を読んで待つ", score: { reading: 2, strategy: 1 } },
        { text: "状況によって変える", score: { balanced: 3 } },
        { text: "ガードして仕切り直す", score: { defensive: 2, balanced: 1 } }
    ]
},

{
    question: "守っている時に一番嫌なのは？",
    answers: [
        { text: "攻めを止められること", score: { aggressive: 3 } },
        { text: "ガードを崩されること", score: { defensive: 3 } },
        { text: "相手の行動が読めないこと", score: { reading: 3 } },
        { text: "対応できない状況になること", score: { balanced: 3 } },
        { text: "作戦が通用しないこと", score: { strategy: 3 } }
    ]
},

{
    question: "バーンアウトした時、\nあなたはどう考えますか？",
    answers: [
        { text: "攻め続けて流れを変える", score: { aggressive: 3 } },
        { text: "耐えて回復を待つ", score: { defensive: 3 } },
        { text: "相手の行動を読んで切り返す", score: { reading: 2, strategy: 1 } },
        { text: "状況によって判断する", score: { balanced: 3 } },
        { text: "一発逆転を狙う", score: { instinct: 3 } }
    ]
},
{
    question: "守りが続く展開では、\n何を意識しますか？",
    answers: [
        { text: "反撃のタイミング", score: { aggressive: 2, reading: 1 } },
        { text: "ガードを崩さないこと", score: { defensive: 3 } },
        { text: "相手の攻めの癖", score: { reading: 2, strategy: 1 } },
        { text: "全体の試合展開", score: { balanced: 3 } },
        { text: "相手の狙いを分析する", score: { strategy: 3 } }
    ]
},
{
    question: "相手の攻めが激しい時、\nどう感じますか？",
    answers: [
        { text: "攻め返したくなる", score: { aggressive: 3 } },
        { text: "落ち着いて守る", score: { defensive: 3 } },
        { text: "相手のパターンを探す", score: { reading: 2, strategy: 1 } },
        { text: "状況を整理する", score: { balanced: 3 } },
        { text: "勝負を仕掛ける機会を待つ", score: { instinct: 3 } }
    ]
},
{
    question: "ガードを続けている時、\n一番狙っていることは？",
    answers: [
        { text: "反撃できる隙", score: { aggressive: 2, reading: 1 } },
        { text: "安全に守り切ること", score: { defensive: 3 } },
        { text: "相手の癖を読むこと", score: { reading: 3 } },
        { text: "状況を立て直すこと", score: { balanced: 3 } },
        { text: "相手の攻めを分析すること", score: { strategy: 3 } }
    ]
},

{
    question: "あなたが『守りが上手い』と思うプレイヤーとは？",
    answers: [
        { text: "反撃が上手い人", score: { aggressive: 2, defensive: 1 } },
        { text: "ミスをしない人", score: { defensive: 3 } },
        { text: "相手の行動を読める人", score: { reading: 3 } },
        { text: "どんな状況でも対応できる人", score: { balanced: 3 } },
        { text: "対策を組み立てられる人", score: { strategy: 3 } }
    ]
},
{
    question: "試合中、相手が同じ行動を何度もしてきたら？",
    answers: [
        { text: "そのまま攻め込む", score: { aggressive: 3 } },
        { text: "安全に対応する", score: { defensive: 3 } },
        { text: "癖として読んで狙う", score: { reading: 3 } },
        { text: "次の行動も予測する", score: { strategy: 3 } },
        { text: "様子を見ながら判断する", score: { balanced: 3 } }
    ]
},
{
    question: "初めて戦う相手と対戦した時、最初に知りたいことは？",
    answers: [
        { text: "攻め方", score: { aggressive: 3 } },
        { text: "守り方", score: { defensive: 3 } },
        { text: "癖", score: { reading: 3 } },
        { text: "立ち回り全体", score: { strategy: 3 } },
        { text: "全部見ながら判断する", score: { balanced: 3 } }
    ]
},
{
    question: "1ラウンド目を負けた時、まず考えることは？",
    answers: [
        { text: "もっと攻める", score: { aggressive: 3 } },
        { text: "ミスを減らす", score: { defensive: 3 } },
        { text: "相手の癖を整理する", score: { reading: 3 } },
        { text: "作戦を変える", score: { strategy: 3 } },
        { text: "全体を見直す", score: { balanced: 3 } }
    ]
},
{
    question: "相手に読まれていると感じたら？",
    answers: [
        { text: "さらに攻める", score: { aggressive: 2, instinct: 1 } },
        { text: "一度落ち着く", score: { defensive: 3 } },
        { text: "逆に読み返す", score: { reading: 3 } },
        { text: "作戦を変更する", score: { strategy: 3 } },
        { text: "状況次第で変える", score: { balanced: 3 } }
    ]
},
{
    question: "格上プレイヤーとの対戦では？",
    answers: [
        { text: "とにかく挑む", score: { instinct: 3 } },
        { text: "安定を意識する", score: { defensive: 3 } },
        { text: "何を考えているか読む", score: { reading: 3 } },
        { text: "学べることを探す", score: { strategy: 3 } },
        { text: "状況ごとに変える", score: { balanced: 3 } }
    ]
},
{
    question: "大会やランクマ終盤で緊張した時は？",
    answers: [
        { text: "攻めて流れを変える", score: { aggressive: 3 } },
        { text: "慎重に戦う", score: { defensive: 3 } },
        { text: "相手の様子を見る", score: { reading: 3 } },
        { text: "冷静に勝ち筋を考える", score: { strategy: 3 } },
        { text: "いつも通り戦う", score: { balanced: 3 } }
    ]
},
{
    question: "対戦後に一番振り返ることは？",
    answers: [
        { text: "攻めの成功率", score: { aggressive: 3 } },
        { text: "守りのミス", score: { defensive: 3 } },
        { text: "読み合い", score: { reading: 3 } },
        { text: "試合全体の流れ", score: { strategy: 3 } },
        { text: "全部振り返る", score: { balanced: 3 } }
    ]
},
{
    question: "相手が急にプレイスタイルを変えてきたら？",
    answers: [
        { text: "こちらも攻める", score: { aggressive: 3 } },
        { text: "まず守る", score: { defensive: 3 } },
        { text: "変化の理由を読む", score: { reading: 3 } },
        { text: "作戦を組み直す", score: { strategy: 3 } },
        { text: "柔軟に対応する", score: { balanced: 3 } }
    ]
},
{
    question: "試合中に『勝ち筋』を考えるタイミングは？",
    answers: [
        { text: "攻めながら考える", score: { aggressive: 3 } },
        { text: "守りながら考える", score: { defensive: 3 } },
        { text: "相手を読めた時", score: { reading: 3 } },
        { text: "試合全体を見ながら考える", score: { strategy: 3 } },
        { text: "常に考えている", score: { balanced: 3 } }
    ]
},
{
    question: "あなたにとって読み合いとは？",
    answers: [
        { text: "攻めを通すための手段", score: { aggressive: 3 } },
        { text: "負けないために必要", score: { defensive: 3 } },
        { text: "試合で一番楽しい部分", score: { reading: 4 } },
        { text: "勝つための戦略そのもの", score: { strategy: 4 } },
        { text: "状況によって変わるもの", score: { balanced: 3 } }
    ]
},
{
    question: "ストリートファイター6で\nあなたが一番大切にしていることは？",
    answers: [
        { text: "勝つこと", score: { aggressive: 3 } },
        { text: "安定して勝ち続けること", score: { defensive: 3 } },
        { text: "相手との読み合い", score: { reading: 3 } },
        { text: "自分なりの戦略を考えること", score: { strategy: 3 } },
        { text: "すべて楽しむこと", score: { balanced: 3 } }
    ]
},
{
    question: "新しいコンボを見つけたら？",
    answers: [
        { text: "すぐトレモで練習する", score: { combo: 3 } },
        { text: "安定するなら取り入れる", score: { defensive: 3 } },
        { text: "実戦で使えるか考える", score: { strategy: 3 } },
        { text: "状況によって使い分ける", score: { balanced: 3 } },
        { text: "決まったら気持ちよさそうなら覚える", score: { instinct: 3 } }
    ]
},
{
    question: "負けが続いた時、あなたは？",
    answers: [
        { text: "すぐもう一戦する", score: { aggressive: 2, instinct: 1 } },
        { text: "少し休憩する", score: { defensive: 3 } },
        { text: "リプレイを見る", score: { reading: 2, strategy: 1 } },
        { text: "原因を整理する", score: { strategy: 3 } },
        { text: "気にせず続ける", score: { balanced: 3 } }
    ]
},
{
    question: "キャラクターを選ぶ時、一番重視することは？",
    answers: [
        { text: "攻めが強いこと", score: { aggressive: 3 } },
        { text: "安定して戦えること", score: { defensive: 3 } },
        { text: "読み合いが面白いこと", score: { reading: 3 } },
        { text: "性能や相性を考えること", score: { strategy: 3 } },
        { text: "どんな状況でも戦えること", score: { balanced: 3 } }
    ]
},
{
    question: "あなたにとって理想の勝ち方は？",
    answers: [
        { text: "攻め続けて勝つ", score: { aggressive: 3 } },
        { text: "危なげなく勝つ", score: { defensive: 3 } },
        { text: "相手を読み切って勝つ", score: { reading: 3 } },
        { text: "考えた作戦で勝つ", score: { strategy: 3 } },
        { text: "最後まで接戦を制する", score: { instinct: 3 } }
    ]
},
{
    question: "一番成長を感じる瞬間は？",
    answers: [
        { text: "攻めが通るようになった時", score: { aggressive: 3 } },
        { text: "守れるようになった時", score: { defensive: 3 } },
        { text: "相手を読めるようになった時", score: { reading: 3 } },
        { text: "勝率が上がった時", score: { strategy: 3 } },
        { text: "何でもできるようになった時", score: { balanced: 3 } }
    ]
},
{
    question: "あなたが試合中に一番信じているものは？",
    answers: [
        { text: "攻め続ける力", score: { aggressive: 3 } },
        { text: "守りの安定感", score: { defensive: 3 } },
        { text: "読み合い", score: { reading: 3 } },
        { text: "経験と知識", score: { strategy: 3 } },
        { text: "自分の判断力", score: { balanced: 3 } }
    ]
},
{
    question: "試合で一番悔しい負け方は？",
    answers: [
        { text: "攻め切れなかった", score: { aggressive: 3 } },
        { text: "自分のミス", score: { defensive: 3 } },
        { text: "読み負けた", score: { reading: 3 } },
        { text: "対策不足だった", score: { strategy: 3 } },
        { text: "あと少しで勝てた", score: { instinct: 3 } }
    ]
},
{
    question: "ストリートファイター6で最終的に目指したいプレイヤー像は？",
    answers: [
        { text: "誰も止められない攻撃力", score: { aggressive: 3 } },
        { text: "安定して勝ち続ける実力", score: { defensive: 3 } },
        { text: "相手を読み切る力", score: { reading: 3 } },
        { text: "知識と戦略で勝つ実力", score: { strategy: 3 } },
        { text: "どんな相手にも対応できる実力", score: { balanced: 3 } }
    ]
},
{
    question: "あなたが思う『最強のプレイヤー』とは？",
    answers: [
        { text: "攻め続けて勝てる人", score: { aggressive: 3 } },
        { text: "ミスをしない人", score: { defensive: 3 } },
        { text: "相手を読み切れる人", score: { reading: 3 } },
        { text: "状況を支配できる人", score: { strategy: 3 } },
        { text: "どんな状況でも勝てる人", score: { balanced: 3 } }
    ]
},
];

// -----------------------------
// 診断モード判定(URLパラメータ ?mode=advanced で上級者用に切り替え)
// -----------------------------
const diagnosisMode =
    new URLSearchParams(window.location.search).get("mode") === "advanced"
        ? "advanced"
        : "beginner";

// 上級者用の質問データ(diagnosis-advanced.js)が読み込まれていればそちらを使う。
// 読み込まれていない場合(万一の読み込み漏れ時)は初心者用にフォールバックする。
const activeQuestions =
    diagnosisMode === "advanced" && typeof questionsAdvanced !== "undefined"
        ? questionsAdvanced
        : questions;

localStorage.setItem("sf6dna_diagnosis_mode", diagnosisMode);

const modeBadgeEl = document.getElementById("modeBadge");
if (modeBadgeEl) {
    modeBadgeEl.textContent =
        diagnosisMode === "advanced" ? "🔥 上級者用診断" : "⚡ 初心者用診断";
    modeBadgeEl.classList.add(
        diagnosisMode === "advanced" ? "mode-badge-advanced" : "mode-badge-beginner"
    );
}

// -----------------------------
// 総問題数
// -----------------------------

const TOTAL_QUESTIONS = activeQuestions.length;

// =========================================
// 質問表示
// =========================================

function renderQuestion(direction) {

    const question = activeQuestions[currentQuestion];

    const questionCard = document.querySelector(".question-card");

    // 質問番号
    questionNumber.textContent =
        `Q${currentQuestion + 1}`;

    // 質問文
    questionTitle.innerHTML =question.question.replace(/\n/g, "<br>");

    // 選択肢をリセット
    answerList.innerHTML = "";

    // 選択肢を生成
    question.answers.forEach((answer, index) => {

        const label = document.createElement("label");

        label.className = "answer-item answer-enter";
        label.style.animationDelay = `${index * 60}ms`;
        label.dataset.answerIndex = index;

        label.innerHTML = `
            <input
                type="radio"
                name="question"
            >

            <span class="answer-text">
                ${answer.text}
            </span>

            <span class="answer-check" aria-hidden="true">✓</span>
        `;

        // クリックイベント
        const input = label.querySelector("input");

input.addEventListener("change", () => {
    confirmAnswer(index, label);
});

        answerList.appendChild(label);

    });

    updateProgress();

    // 戻るボタンは最初の質問では表示しない
    if (backButton) {
        backButton.style.visibility = currentQuestion === 0 ? "hidden" : "visible";
    }

    // 質問カードの遷移アニメーション(進む/戻るで方向を変える)
    if (questionCard) {

        questionCard.classList.remove("slide-in-forward", "slide-in-back");
        questionCard.classList.add("hide");

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                questionCard.classList.remove("hide");
                questionCard.classList.add(direction === "back" ? "slide-in-back" : "slide-in-forward");
            });
        });

    }

    // スクリーンリーダー向けに、質問見出しへフォーカスを移す
    // (視覚的なフォーカスリングが目立ちすぎないよう、CSSでoutlineは調整済み)
    questionTitle.focus({ preventScroll: true });

}

// =========================================
// 回答確定(クリック直後の軽いフィードバック→自動で次へ)
// =========================================

function confirmAnswer(index, label) {

    document
        .querySelectorAll(".answer-item")
        .forEach(item =>
            item.classList.remove("selected"));

    label.classList.add("selected");

    // 0.2〜0.3秒だけ「回答を記録した」ことが伝わるフィードバックを見せてから進む
    // (この待機時間は既存の遷移テンポとほぼ同じに保つため、新たに待ち時間を追加しない)
    setTimeout(() => {

        selectAnswer(index);

    }, 280);

}

// =========================================
// プログレス更新
// =========================================

function updateProgress() {

    const stageNames = diagnosisMode === "advanced" ? STAGE_NAMES_ADVANCED : STAGE_NAMES_BEGINNER;
    const totalStages = Math.ceil(TOTAL_QUESTIONS / STAGE_SIZE);
    const currentStage = Math.floor(currentQuestion / STAGE_SIZE) + 1;
    const posInStage = (currentQuestion % STAGE_SIZE) + 1;

    progressBar.style.width =
        `${((currentQuestion + 1) / TOTAL_QUESTIONS) * 100}%`;

    progressText.textContent =
        `QUESTION ${String(currentQuestion + 1).padStart(2, "0")} / ${TOTAL_QUESTIONS}`;

    const stageName = stageNames[currentStage - 1] || "";
    stageText.textContent = `STAGE ${currentStage}/${totalStages} ${stageName}`;

    // ステージ内のミニ進捗ドット
    if (stageDots) {

        stageDots.innerHTML = "";

        for (let i = 0; i < STAGE_SIZE; i++) {
            const dot = document.createElement("span");
            dot.className = "stage-dot" + (i < posInStage ? " filled" : "");
            stageDots.appendChild(dot);
        }

    }

    // 進捗率に応じた期待感メッセージ
    // (演出目的のみ。診断結果には影響しない)
    //
    // セルフレビューでの気づき: 閾値を跨いだ後、同じメッセージを
    // 何問も表示し続けると「常にそこにあるだけの文字」になり、
    // かえって存在感が薄れてしまう。そのため、閾値を跨いだ瞬間だけ
    // 数秒間フラッシュ表示し、その後は自動的に消す仕様にしている。
    if (encourageMessage) {

        const progressRatio = (currentQuestion + 1) / TOTAL_QUESTIONS;
        let message = "";

        ENCOURAGE_MESSAGES.forEach(m => {
            if (progressRatio >= m.threshold) message = m.text;
        });

        if (message && message !== lastEncourageMessage) {

            lastEncourageMessage = message;

            encourageMessage.textContent = message;
            encourageMessage.classList.remove("encourage-flash");
            void encourageMessage.offsetWidth; // アニメーションを再トリガーするための強制リフロー
            encourageMessage.classList.add("encourage-flash");

            clearTimeout(encourageMessageTimer);
            encourageMessageTimer = setTimeout(() => {
                encourageMessage.textContent = "";
                encourageMessage.classList.remove("encourage-flash");
            }, 2800);

        }

    }

}

// =========================================
// 回答処理
// =========================================

function selectAnswer(index) {

    // 回答を保存
    userAnswers[currentQuestion] = index;

    // スコア加算
    const answer = activeQuestions[currentQuestion].answers[index];

    for (const type in answer.score) {
        score[type] += answer.score[type];
    }

    // 最後の問題なら終了
    if (currentQuestion === TOTAL_QUESTIONS - 1) {

        finishDiagnosis();
        return;

    }

    const finishedQuestionIndex = currentQuestion;
    currentQuestion++;

    // ステージの区切りに到達していれば、短いクリア演出を挟んでから次のステージへ
    const isEndOfStage = (finishedQuestionIndex % STAGE_SIZE) === STAGE_SIZE - 1;

    if (isEndOfStage && stageClearOverlay) {

        const clearedStageNumber = Math.floor(finishedQuestionIndex / STAGE_SIZE) + 1;

        stageClearTitle.textContent = `STAGE ${clearedStageNumber} CLEAR!`;
        stageClearSub.textContent =
            STAGE_CLEAR_SUB_MESSAGES[Math.floor(Math.random() * STAGE_CLEAR_SUB_MESSAGES.length)];

        stageClearOverlay.classList.add("show");

        setTimeout(() => {
            stageClearOverlay.classList.remove("show");
            renderQuestion("forward");
        }, 650);

    } else {

        renderQuestion("forward");

    }

}

// =========================================
// 戻る処理(誤操作からの復帰)
// =========================================

function goToPreviousQuestion() {

    if (currentQuestion === 0) return;

    currentQuestion--;

    // 戻った質問で直前に選んでいた回答がある場合、スコアへの影響を一旦取り消す
    // (再度回答した時点で selectAnswer が改めてスコアを加算するため、
    //  ここで取り消しておかないと二重加算になってしまう)
    const previousAnswerIndex = userAnswers[currentQuestion];

    if (previousAnswerIndex !== undefined) {

        const previousAnswer = activeQuestions[currentQuestion].answers[previousAnswerIndex];

        for (const type in previousAnswer.score) {
            score[type] -= previousAnswer.score[type];
        }

        userAnswers[currentQuestion] = undefined;

    }

    renderQuestion("back");

}

if (backButton) {
    backButton.addEventListener("click", goToPreviousQuestion);
}

// =========================================
// キーボード操作対応
// =========================================
// 数字キー(1〜5)で選択肢を選ぶ、Backspaceで1つ前の質問に戻る

document.addEventListener("keydown", (e) => {

    if (e.key === "Backspace") {
        e.preventDefault();
        goToPreviousQuestion();
        return;
    }

    const num = Number(e.key);

    if (Number.isInteger(num) && num >= 1 && num <= 5) {

        const targetLabel = answerList.querySelector(`[data-answer-index="${num - 1}"]`);

        if (targetLabel) {
            const input = targetLabel.querySelector("input");
            if (input) input.checked = true;
            confirmAnswer(num - 1, targetLabel);
        }

    }

});

// =========================================
// 診断終了
// =========================================

function finishDiagnosis() {

    // 一番スコアが高いタイプを取得
    // ※ 同点の場合、常に先頭のキー(aggressive)が選ばれてしまうと
    //   同点時に毎回「攻撃型」寄りに偏ってしまうため、
    //   同点の候補の中からランダムに1つ選ぶようにしている
    const maxScore = Math.max(...Object.values(score));

    const topKeys = Object.keys(score).filter(
        key => score[key] === maxScore
    );

    const resultKey =
        topKeys[Math.floor(Math.random() * topKeys.length)];

    // result-data.js 側もこの英語キー(aggressive等)をそのままオブジェクトの
    // キーとして使っているため、日本語ラベルへの変換はせず英語キーを保存する。
    // 表示用の日本語名は result.js が resultData[resultKey].name から取得する。
    localStorage.setItem("sf6dna_result", resultKey);
    localStorage.setItem(
        "sf6dna_score",
        JSON.stringify(score)
    );

    // 活動ログへ記録(将来のストリーク・週次レポート等で再利用するため)
    if (typeof recordActivity === "function") {
        recordActivity(ACTIVITY_TYPES.DIAGNOSIS, resultKey, "診断を完了");
    }

    // 結果ページへ移る前に、SF6DNAらしい世界観のローディング演出を挟む
    const loadingOverlay = document.getElementById("loadingOverlay");
    const loadingText = document.getElementById("loadingText");

    if (loadingOverlay) {

        loadingOverlay.classList.add("show");

        const totalDuration = 2600;
        const stepDuration = totalDuration / LOADING_MESSAGES.length;

        if (loadingText) {

            LOADING_MESSAGES.forEach((message, i) => {
                setTimeout(() => {
                    loadingText.textContent = message;
                }, i * stepDuration);
            });

        }

        setTimeout(() => {
            location.href = "result.html";
        }, totalDuration);

    } else {

        location.href = "result.html";

    }

}


// 初回表示
renderQuestion("forward");