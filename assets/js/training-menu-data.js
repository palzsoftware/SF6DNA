// ==========================================
// 練習メニュー データ
// ==========================================
//
// 診断(diagnosis.js)と同じ8軸ごとに、練習ドリルをまとめたデータ。
// training.js から読み込まれ、診断結果の弱点軸に応じて表示される。
//
// 各ドリルの構造:
//   id                 一意のID。他のドリルの nextRecommended から参照される
//   axis               対応する診断軸(aggressive/defensive/zoning/balanced/
//                       reading/combo/strategy/instinct)
//   title              ドリルのタイトル
//   difficulty         難易度: "beginner" / "intermediate" / "advanced"
//   priority           優先度: "high" / "medium" / "low"
//                       (同じ軸に複数ドリルがある場合の表示順の目安。
//                        現時点では表示に使っていないが、将来の並び替え・
//                        AIによる優先提案のために保持しておく)
//   character          特定キャラクター専用メニューの場合はキャラID(例:"ryu")、
//                       誰にでも当てはまる汎用メニューの場合は null
//   tags               検索・フィルタ用のタグ配列(現時点では画面表示していない)
//   reason             この練習をする理由(診断結果とのつながりを説明する文章)
//   purpose            この練習の目的(何を身につけるためのものか)
//   steps              手順(配列。番号付きで表示する想定)
//   targetReps         目標回数・達成基準(文章で「何をもって合格か」を示す)
//   checkpoints        練習後のセルフチェック項目(配列。現時点では画面表示していないが、
//                       将来「練習後に振り返りチェックを付けられる」機能や、
//                       AIコーチングが「できていない項目」を拾う際に使う想定)
//   durationMinutes    目安の所要時間(分)
//   searchQuery        参考動画を探すための検索クエリ(video-search.jsで使用)
//   nextRecommended    次におすすめのドリルのID配列。
//                       v1では固定リストだが、将来的にAIが動的に算出した
//                       ID配列に差し替えても、表示側のコードは変更不要な設計
//
// ==========================================

const trainingMenuData = {

    // ===== 攻撃(aggressive) =====
    aggressive: [
        {
            id: "agg_pressure_control_01",
            axis: "aggressive",
            title: "攻めの主導権を維持する練習",
            difficulty: "beginner",
            priority: "high",
            character: null,
            tags: ["攻め", "初心者向け", "主導権"],

            reason:
                "攻撃型は攻めの起点を作るのが得意な一方、攻めが単調になり相手に読まれやすい傾向があります。" +
                "攻めのバリエーションを増やすことで、より安定して主導権を握れるようになります。",

            purpose:
                "1つの攻め方に頼らず、複数の選択肢を持って攻め続ける感覚を身につける",

            steps: [
                "トレーニングモードで、同じ状況から3種類以上の攻め方(投げ/中段/下段など)を用意する",
                "1回の攻めごとに、選択肢をランダムに変えながら10回連続で攻めてみる",
                "同じ選択肢を3回以上連続で使っていないか振り返る"
            ],

            targetReps: "10回の攻めのうち、同じ選択肢が3連続以上にならないように意識できたら合格",

            checkpoints: [
                "毎回、次に何をするか事前に決めてから攻めていたか",
                "相手の反応を待たずに、自分の選択肢だけで攻め切ろうとしていなかったか"
            ],

            durationMinutes: 10,
            searchQuery: "ストリートファイター6 攻め 選択肢 崩し 初心者",

            nextRecommended: ["reading_anti_air_01"]
        }
    ],

    // ===== 守り(defensive) =====
    defensive: [
        {
            id: "def_distance_control_01",
            axis: "defensive",
            title: "反撃されない距離を保つ練習",
            difficulty: "beginner",
            priority: "high",
            character: null,
            tags: ["守り", "初心者向け", "距離管理"],

            reason:
                "診断結果は「守り」のスコアが低めでした。攻めが得意な反面、相手の反撃圏内に留まりやすく、" +
                "そこから連続で攻められる場面が多いと考えられます。",

            purpose:
                "相手の攻撃を受けた後、反撃を受けない距離まで下がる判断を体に染み込ませる",

            steps: [
                "トレーニングモードでCPUを「ガード後に反撃」設定にする",
                "相手の技をガードしたら、すぐに後退して距離を取る",
                "反撃を受けずに済んだ回数を数える"
            ],

            targetReps: "10回中8回、反撃を受けずに距離を取れたら合格",

            checkpoints: [
                "ガードした直後、無意識にその場に留まっていなかったか",
                "距離を取った後、すぐに次の展開に備えられていたか"
            ],

            durationMinutes: 10,
            searchQuery: "ストリートファイター6 反撃 距離 立ち回り 初心者",

            nextRecommended: ["reading_anti_air_01"]
        }
    ],

    // ===== 飛び道具・牽制(zoning) =====
    zoning: [
        {
            id: "zon_spacing_01",
            axis: "zoning",
            title: "飛び道具で間合いを支配する練習",
            difficulty: "intermediate",
            priority: "medium",
            character: null,
            tags: ["牽制", "間合い管理"],

            reason:
                "中〜遠距離での主導権作りが苦手だと、近距離の読み合いに持ち込まれやすくなります。" +
                "飛び道具や牽制技で間合いを支配する感覚を養いましょう。",

            purpose:
                "相手を思い通りの間合いに留め、こちらが動きたいタイミングで動けるようにする",

            steps: [
                "画面のちょうど中間くらいの距離を維持しながらCPUと対戦する",
                "近づかれたら牽制技で押し返し、離れすぎたら飛び道具で圧をかける",
                "1ラウンドの中で、自分から間合いを詰めた回数と離した回数を数える"
            ],

            targetReps: "1ラウンドで、意図して間合いを調整した回数が5回以上",

            checkpoints: [
                "間合いを「なんとなく」ではなく意図して調整できていたか",
                "牽制技を置くタイミングが単調になっていなかったか"
            ],

            durationMinutes: 15,
            searchQuery: "ストリートファイター6 牽制 間合い管理 立ち回り",

            nextRecommended: ["bal_neutral_game_01"]
        }
    ],

    // ===== バランス(balanced) =====
    balanced: [
        {
            id: "bal_neutral_game_01",
            axis: "balanced",
            title: "五分の状況からの立ち回り練習",
            difficulty: "intermediate",
            priority: "medium",
            character: null,
            tags: ["立ち回り", "ニュートラル"],

            reason:
                "特定の状況(攻め or 守り)に偏らず、五分の状況(ニュートラル)からの駆け引きを" +
                "安定させることで、全体のスコアの底上げにつながります。",

            purpose:
                "攻めるか守るかを固定せず、状況に応じて選択できる引き出しを増やす",

            steps: [
                "ラウンド開始位置から、まず1つの技だけで相手の反応を確認する",
                "相手が動いたら合わせて反撃、動かなければ再度牽制を置く、を繰り返す",
                "10ラウンド行い、攻め・守りどちらかに偏りすぎていないか振り返る"
            ],

            targetReps: "10ラウンド中、攻めから入った回数と守りから入った回数が概ね半々になれば合格",

            checkpoints: [
                "毎回同じ初動になっていなかったか",
                "相手の反応を見てから次の行動を選べていたか"
            ],

            durationMinutes: 15,
            searchQuery: "ストリートファイター6 ニュートラル 立ち回り 基礎",

            nextRecommended: ["zon_spacing_01", "reading_anti_air_01"]
        }
    ],

    // ===== 読み合い(reading) =====
    reading: [
        {
            id: "reading_anti_air_01",
            axis: "reading",
            title: "暴れ確認の反応練習",
            difficulty: "beginner",
            priority: "high",
            character: null,
            tags: ["読み合い", "対空", "初心者向け"],

            reason:
                "相手の暴れ技(割り込み)を見てから反撃できるようになると、リスクを抑えつつ" +
                "主導権を取り戻せる場面が増えます。",

            purpose:
                "相手の暴れ技を見てから確定反撃を出す反応速度を鍛える",

            steps: [
                "トレーニングモードでCPUを「ランダムで暴れる」設定にする",
                "相手の暴れ技を見てから確定反撃を出す",
                "反応できた回数と、できずに被弾した回数を数える"
            ],

            targetReps: "10回中7回以上、確定反撃を出せたら合格",

            checkpoints: [
                "技が見えてから反応していたか、それとも予測で置いていたか",
                "反撃できなかった回、原因は見え遅れか操作ミスかを振り返れたか"
            ],

            durationMinutes: 15,
            searchQuery: "ストリートファイター6 対空 反応 確定反撃 練習",

            nextRecommended: ["def_distance_control_01", "combo_confirm_01"]
        }
    ],

    // ===== コンボ(combo) =====
    combo: [
        {
            id: "combo_confirm_01",
            axis: "combo",
            title: "ヒット確認からのコンボ猶予練習",
            difficulty: "intermediate",
            priority: "medium",
            character: null,
            tags: ["コンボ", "ヒット確認"],

            reason:
                "コンボの再現性が低いと、せっかくの攻めのチャンスを最大火力に変えられません。" +
                "ヒット確認からコンボにつなげる練習で、安定した火力を出せるようにします。",

            purpose:
                "技がヒットしたかガードされたかを見極め、状況に応じてコンボを使い分ける",

            steps: [
                "トレーニングモードでガード設定を「ランダム」にする",
                "牽制技を出し、ヒットした時だけコンボにつなげる",
                "ガードされた時に暴れコンボを出してしまっていないか確認する"
            ],

            targetReps: "10回中8回以上、ヒット時のみコンボにつなげられたら合格",

            checkpoints: [
                "ヒットするかガードされるか、目で確認してから次の技を出せていたか",
                "焦って先読みでコンボを出していなかったか"
            ],

            durationMinutes: 15,
            searchQuery: "ストリートファイター6 ヒット確認 コンボ 練習",

            nextRecommended: ["reading_anti_air_01"]
        }
    ],

    // ===== 戦略(strategy) =====
    strategy: [
        {
            id: "strat_matchup_review_01",
            axis: "strategy",
            title: "対キャラ対策の振り返り練習",
            difficulty: "advanced",
            priority: "medium",
            character: null,
            tags: ["対策", "戦略", "上級者向け"],

            reason:
                "その場その場の判断だけでなく、対戦相手のキャラクターに応じた事前の対策を" +
                "持っておくことで、試合全体の組み立てが安定します。",

            purpose:
                "対戦後に「何を狙われたか」「何が通用したか」を言語化する習慣をつける",

            steps: [
                "対戦(オンライン/CPU可)を1試合行う",
                "試合後、相手にやられて困った行動を3つ書き出す",
                "次の試合で、その3つへの対応を1つでも試してみる"
            ],

            targetReps: "3試合連続で、前の試合の振り返りを次の試合に活かせたら合格",

            checkpoints: [
                "感覚だけでなく、具体的な行動として振り返りを書き出せたか",
                "次の試合で実際に対策を試す意識を持てていたか"
            ],

            durationMinutes: 20,
            searchQuery: "ストリートファイター6 対策 キャラ対策 考え方",

            nextRecommended: ["bal_neutral_game_01"]
        }
    ],

    // ===== 直感・とっさの判断(instinct) =====
    instinct: [
        {
            id: "inst_snap_decision_01",
            axis: "instinct",
            title: "とっさの判断力を鍛える練習",
            difficulty: "intermediate",
            priority: "low",
            character: null,
            tags: ["判断力", "反応"],

            reason:
                "考え込みすぎて行動が遅れると、せっかくのチャンスを逃してしまいます。" +
                "瞬間的な判断を数多くこなすことで、判断の速さと精度を両立させます。",

            purpose:
                "限られた時間の中で「攻める/待つ/守る」を素早く判断する感覚を養う",

            steps: [
                "CPU戦を通常より速いテンポで行う(考える時間を意図的に減らす)",
                "1つの行動につき1秒以内に次の行動を決める",
                "判断に迷って行動が止まった回数を数える"
            ],

            targetReps: "1ラウンドの中で、判断が止まった回数が2回以下になれば合格",

            checkpoints: [
                "迷ったときに「とりあえず様子見」で固まっていなかったか",
                "判断の速さを優先しすぎて、無謀な行動になっていなかったか"
            ],

            durationMinutes: 10,
            searchQuery: "ストリートファイター6 判断力 反応速度 練習",

            nextRecommended: ["agg_pressure_control_01"]
        }
    ]

};
