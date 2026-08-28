// ===========================
// 上級者用診断: 質問データ(全100問)
// 対象: プラチナ以上のプレイヤー向け。
// 通常版(diagnosis.js)と同じ8軸(aggressive/defensive/zoning/balanced/
// reading/combo/strategy/instinct)でスコアリングする。
// 専門用語は簡略化せず、実戦的でより踏み込んだ判断を問う内容にしている。
// ===========================

const questionsAdvanced = [

{
    question: "確定反撃の場面。ダメージ最大のコンボと、リスクの低い安定行動のどちらを選びますか？",
    answers: [
        { text: "迷わずダメージ最大のコンボを選ぶ", score: { combo: 3, aggressive: 1 } },
        { text: "ミス率を考えて安定行動を選ぶ", score: { defensive: 2, strategy: 1 } },
        { text: "相手の体力とラウンド状況で毎回判断する", score: { balanced: 3 } },
        { text: "普段からその場面専用に練習したコンボを選ぶ", score: { combo: 2, strategy: 1 } },
        { text: "多少リスクがあっても一発逆転を狙える方を選ぶ", score: { instinct: 3 } }
    ]
},
{
    question: "OD無敵技のリソースが残り1回。使うべきか迷う場面が続いています。",
    answers: [
        { text: "早めに使って主導権を取り戻す", score: { aggressive: 2, instinct: 1 } },
        { text: "本当に必要な場面まで温存する", score: { strategy: 3 } },
        { text: "相手のゲージ状況を見て使うタイミングを計る", score: { reading: 2, strategy: 1 } },
        { text: "画面端に追い込まれたら迷わず使う", score: { defensive: 3 } },
        { text: "その場の流れで直感的に判断する", score: { instinct: 2, balanced: 1 } }
    ]
},
{
    question: "起き攻めで、ガード不能とされる連携を仕込む練習は普段からしていますか？",
    answers: [
        { text: "毎回同じ強力な連携を固めて仕込んでいる", score: { combo: 3, aggressive: 1 } },
        { text: "対戦相手のキャラごとに変えている", score: { strategy: 3 } },
        { text: "リスクがあるので封印択も混ぜている", score: { reading: 2, strategy: 1 } },
        { text: "特に固めておらずその場のひらめきで攻める", score: { instinct: 3 } },
        { text: "崩しより安定重視でシンプルな起き攻めにしている", score: { defensive: 2, balanced: 1 } }
    ]
},
{
    question: "キャラ対策として、特定のキャラに対する専用の立ち回りを準備していますか？",
    answers: [
        { text: "主要なキャラは一通り対策を準備している", score: { strategy: 3 } },
        { text: "対戦しながらその場で対応を組み立てる方が得意", score: { reading: 3 } },
        { text: "自分の型を崩さず、相手に合わせすぎない", score: { balanced: 2, aggressive: 1 } },
        { text: "苦手キャラは無理に対策せず割り切っている", score: { instinct: 2, defensive: 1 } },
        { text: "対策より基本の技術を磨く方に時間を使う", score: { combo: 2, strategy: 1 } }
    ]
},
{
    question: "対空の精度について、自分ではどう評価していますか？",
    answers: [
        { text: "ほぼ全ての飛びを正確に落とせる自信がある", score: { defensive: 3 } },
        { text: "強い択（めくり等）には弱いと自覚している", score: { strategy: 2, reading: 1 } },
        { text: "対空より地上の差し合いを重視している", score: { zoning: 3 } },
        { text: "対空を取られること前提で試合を組み立てる", score: { instinct: 2, aggressive: 1 } },
        { text: "相手のジャンプ癖を読んで先読みで落とす", score: { reading: 3 } }
    ]
},
{
    question: "置き技を差し込むタイミングについて、どこまで意識していますか？",
    answers: [
        { text: "技の発生・持続フレームまで意識して置く", score: { strategy: 3 } },
        { text: "感覚とタイミングの経験則で置いている", score: { instinct: 2, zoning: 1 } },
        { text: "相手の行動パターンを見てから置く技を変える", score: { reading: 3 } },
        { text: "置き技よりラッシュでの攻めを優先する", score: { aggressive: 3 } },
        { text: "安定して差し返せる技を1つに絞っている", score: { defensive: 2, balanced: 1 } }
    ]
},
{
    question: "画面端に追い込まれた時、優先する行動は？",
    answers: [
        { text: "無敵技やドライブリバーサルで切り返す", score: { defensive: 3 } },
        { text: "択を絞られる前提でガードを固める", score: { defensive: 2, strategy: 1 } },
        { text: "相手の崩しの癖を読んで最小限の被害に抑える", score: { reading: 3 } },
        { text: "リスクを承知で暴れて流れを変える", score: { instinct: 3 } },
        { text: "画面端になる前に脱出することを常に優先する", score: { zoning: 2, strategy: 1 } }
    ]
},
{
    question: "ラウンド終盤、体力もタイムも拮抗している場面。何を優先しますか？",
    answers: [
        { text: "確実にダメージを取れる安定行動を選ぶ", score: { defensive: 2, strategy: 1 } },
        { text: "一気に決めにいくリスクの高い択を選ぶ", score: { instinct: 3 } },
        { text: "相手の癖から出てくる行動を読み切る", score: { reading: 3 } },
        { text: "タイムアップ勝ちを見据えて逃げに徹する", score: { zoning: 3 } },
        { text: "普段通りの立ち回りを崩さない", score: { balanced: 3 } }
    ]
},
{
    question: "同じ相手と3本先取のセットマッチ。2本目でどう調整しますか？",
    answers: [
        { text: "1本目で見えた弱点を突く方向に寄せる", score: { strategy: 3 } },
        { text: "相手も対策してくる前提で択を散らす", score: { reading: 3 } },
        { text: "自分の得意な形に持ち込むことに集中する", score: { balanced: 2, aggressive: 1 } },
        { text: "リスクを取ってでも早めに畳みかける", score: { aggressive: 3 } },
        { text: "淡々と同じ立ち回りを継続する", score: { defensive: 2, instinct: 1 } }
    ]
},
{
    question: "自分のコンボレシピについて、どちらのタイプに近いですか？",
    answers: [
        { text: "難易度が高くても最大火力のルートを選ぶ", score: { combo: 3 } },
        { text: "実戦成功率を最優先にルートを組む", score: { defensive: 2, strategy: 1 } },
        { text: "状況ごとに複数のルートを使い分けている", score: { balanced: 3 } },
        { text: "ダメージよりその後の展開（起き攻め）を重視する", score: { strategy: 2, reading: 1 } },
        { text: "感覚で毎回少し違うルートを選んでいる", score: { instinct: 2, combo: 1 } }
    ]
},
{
    question: "相手のドライブゲージがバーンアウト直前です。どう動きますか？",
    answers: [
        { text: "一気に攻め込んで畳みかける", score: { aggressive: 3 } },
        { text: "相手が焦って動くのを待って迎撃する", score: { zoning: 2, reading: 1 } },
        { text: "無理はせず着実にダメージを重ねる", score: { strategy: 3 } },
        { text: "リスクを取ってでも一撃で決めにいく", score: { instinct: 3 } },
        { text: "状況を見て攻め方を柔軟に変える", score: { balanced: 2, aggressive: 1 } }
    ]
},
{
    question: "パニカン（カウンターヒット）を取れた瞬間、次の判断は？",
    answers: [
        { text: "反射的に最大コンボへ繋げる", score: { combo: 3 } },
        { text: "その後の状況まで見越した選択をする", score: { strategy: 3 } },
        { text: "確実に決まるコンボを選ぶ", score: { defensive: 2, combo: 1 } },
        { text: "一瞬で判断して即座に反応する", score: { instinct: 2, combo: 1 } },
        { text: "相手のキャラの弱点に合わせて選ぶ", score: { reading: 2, strategy: 1 } }
    ]
},
{
    question: "セットプレイ（起き攻め）を相手に一度対策されました。次はどうしますか？",
    answers: [
        { text: "別の崩し方に切り替える", score: { reading: 3 } },
        { text: "同じ択を続けて心理的揺さぶりをかける", score: { instinct: 2, aggressive: 1 } },
        { text: "リスクの低い牽制に切り替える", score: { defensive: 3 } },
        { text: "複数の択を用意していたローテーションに移る", score: { strategy: 3 } },
        { text: "その場の相手の反応を見てから決める", score: { balanced: 2, reading: 1 } }
    ]
},
{
    question: "対戦相手の使用キャラが自分の苦手キャラでした。試合前にすることは？",
    answers: [
        { text: "対策動画やデータを直前まで確認する", score: { strategy: 3 } },
        { text: "特に準備せず対戦の中で対応する", score: { reading: 2, instinct: 1 } },
        { text: "苦手意識を消すためメンタル面を整える", score: { defensive: 2, instinct: 1 } },
        { text: "自分の得意な展開に持ち込む方法を考える", score: { balanced: 3 } },
        { text: "むしろ苦手キャラ対策を楽しみにしている", score: { aggressive: 2, strategy: 1 } }
    ]
},
{
    question: "大会本番、緊張で普段の動きができていないと感じたら？",
    answers: [
        { text: "深呼吸などのルーティンで気持ちを整える", score: { defensive: 2, strategy: 1 } },
        { text: "あえてリスクを取って流れを変えにいく", score: { instinct: 3 } },
        { text: "シンプルな行動に絞ってミスを減らす", score: { strategy: 3 } },
        { text: "相手の緊張も逆手に取って揺さぶる", score: { reading: 2, aggressive: 1 } },
        { text: "普段の練習を信じてそのまま続ける", score: { balanced: 3 } }
    ]
},
{
    question: "配信・大会という「見られている」状況は、自分にどう影響しますか？",
    answers: [
        { text: "見られている方がむしろ集中できる", score: { instinct: 2, aggressive: 1 } },
        { text: "普段通りを心がけて意識しないようにする", score: { defensive: 3 } },
        { text: "多少緊張はするが実力通りに戦えることが多い", score: { balanced: 3 } },
        { text: "見られている分、慎重な選択が増える", score: { strategy: 2, defensive: 1 } },
        { text: "アピールも兼ねて普段より攻める", score: { aggressive: 3 } }
    ]
},
{
    question: "格上との対戦がセットされました。試合前の心境に近いのは？",
    answers: [
        { text: "何を仕掛けても通用するか純粋に楽しみ", score: { instinct: 3 } },
        { text: "冷静にデータを整理して臨む", score: { strategy: 3 } },
        { text: "格の差を意識しすぎず普段通り戦う", score: { balanced: 3 } },
        { text: "守りを固めて一つでも多くラウンドを拾いにいく", score: { defensive: 3 } },
        { text: "一発の読み合いで仕留めるチャンスを探す", score: { reading: 3 } }
    ]
},
{
    question: "同キャラ対決（ミラーマッチ）における意識は？",
    answers: [
        { text: "技の性能を熟知している分、読み合いを楽しむ", score: { reading: 3 } },
        { text: "自分の方が使い込んでいる自信がある", score: { instinct: 2, combo: 1 } },
        { text: "相手の癖を早めに見極めることに集中する", score: { strategy: 3 } },
        { text: "純粋な操作精度の勝負だと捉えている", score: { combo: 2, defensive: 1 } },
        { text: "対策を組みやすいので落ち着いて戦える", score: { balanced: 3 } }
    ]
},
{
    question: "トレーニングモードでの練習、主に何に時間を使いますか？",
    answers: [
        { text: "最大火力コンボの安定化", score: { combo: 3 } },
        { text: "対空や差し返しなど反応速度の強化", score: { defensive: 3 } },
        { text: "特定キャラへの起き攻め・崩しの構築", score: { strategy: 3 } },
        { text: "フレーム表を見ながらの確定反撃の暗記", score: { strategy: 2, combo: 1 } },
        { text: "その日の気分で色々試す", score: { instinct: 2, balanced: 1 } }
    ]
},
{
    question: "リプレイを見返す時、主に何をチェックしますか？",
    answers: [
        { text: "自分のミスや無駄な被弾の原因", score: { strategy: 3 } },
        { text: "相手の行動パターンや癖", score: { reading: 3 } },
        { text: "コンボの成功率や火力効率", score: { combo: 3 } },
        { text: "ラウンドを通しての判断ミス", score: { defensive: 2, strategy: 1 } },
        { text: "特にリプレイは見返さない", score: { instinct: 3 } }
    ]
},
{
    question: "ドライブラッシュを使う場面として、最も重視しているのは？",
    answers: [
        { text: "攻めを繋げて相手にターンを渡さないこと", score: { aggressive: 3 } },
        { text: "確定反撃時のダメージ最大化", score: { combo: 3 } },
        { text: "ゲージ効率を考えた使いどころの見極め", score: { strategy: 3 } },
        { text: "相手の反応を見てから使うかどうか決める", score: { reading: 2, balanced: 1 } },
        { text: "咄嗟の判断で使うことが多い", score: { instinct: 2, aggressive: 1 } }
    ]
},
{
    question: "投げとの二択（打撃or投げ）を仕掛けられた時、普段の対応は？",
    answers: [
        { text: "投げ抜けよりガードを優先する", score: { defensive: 3 } },
        { text: "相手の傾向から読んで対応を変える", score: { reading: 3 } },
        { text: "無敵技で暴れて択自体を潰す", score: { instinct: 3 } },
        { text: "五分の意識でランダムに近い対応をする", score: { balanced: 3 } },
        { text: "その状況を作られないよう事前に立ち回る", score: { zoning: 2, strategy: 1 } }
    ]
},
{
    question: "苦手なキャラとの対戦経験値を積む方法として近いのは？",
    answers: [
        { text: "ひたすら実戦で数をこなして慣れる", score: { instinct: 2, aggressive: 1 } },
        { text: "動画や攻略情報を徹底的に調べる", score: { strategy: 3 } },
        { text: "そのキャラを自分でも使って理解を深める", score: { combo: 2, strategy: 1 } },
        { text: "得意な展開に持ち込む練習を優先する", score: { balanced: 3 } },
        { text: "経験豊富な人に対策を聞く", score: { defensive: 2, strategy: 1 } }
    ]
},
{
    question: "接近された際の切り返し技（無敵技等）の選択基準は？",
    answers: [
        { text: "ゲージがあれば積極的に使う", score: { defensive: 3 } },
        { text: "本当に危険な場面まで温存する", score: { strategy: 3 } },
        { text: "相手の連携の隙間を読んで差し込む", score: { reading: 3 } },
        { text: "使うかどうかは咄嗟の判断", score: { instinct: 3 } },
        { text: "切り返しよりガードでしのぐ方を優先", score: { defensive: 2, balanced: 1 } }
    ]
},
{
    question: "苦手な距離（間合い）に持ち込まれた時の対応は？",
    answers: [
        { text: "無理に距離を変えず戦い方を変える", score: { balanced: 3 } },
        { text: "何としても得意な距離に戻す", score: { zoning: 3 } },
        { text: "そのまま真っ向勝負を挑む", score: { aggressive: 3 } },
        { text: "相手の得意距離での癖を読む", score: { reading: 2, strategy: 1 } },
        { text: "一旦守りに徹して立て直す", score: { defensive: 3 } }
    ]
},
{
    question: "実力が拮抗する相手との対戦で、最終的に差がつくと思う要素は？",
    answers: [
        { text: "土壇場での読み合いの精度", score: { reading: 3 } },
        { text: "コンボ・操作の安定感", score: { combo: 3 } },
        { text: "事前の対策・研究量", score: { strategy: 3 } },
        { text: "メンタルの強さ・勝負強さ", score: { instinct: 3 } },
        { text: "総合力のバランス", score: { balanced: 3 } }
    ]
},
{
    question: "新しいキャラ調整（バランス調整）が入った直後、どう動きますか？",
    answers: [
        { text: "すぐ実戦で試して感覚を掴む", score: { instinct: 2, aggressive: 1 } },
        { text: "変更点を細かく調べてから調整する", score: { strategy: 3 } },
        { text: "しばらく様子見してから本格対応する", score: { defensive: 2, balanced: 1 } },
        { text: "自分のキャラより相手キャラの変化を優先して調べる", score: { reading: 2, strategy: 1 } },
        { text: "特に気にせずいつも通り練習する", score: { balanced: 3 } }
    ]
},
{
    question: "接近戦での通常技の差し合い、どんな意識で振っていますか？",
    answers: [
        { text: "フレーム有利を意識した技選択", score: { strategy: 3 } },
        { text: "リーチと発生の早さを重視", score: { zoning: 2, defensive: 1 } },
        { text: "相手の技の隙を狙う差し返し重視", score: { reading: 3 } },
        { text: "強気に技を置いて主導権を握る", score: { aggressive: 3 } },
        { text: "その場のノリで振っている", score: { instinct: 3 } }
    ]
},
{
    question: "相手キャラのバーンアウトを誘発するための立ち回りは？",
    answers: [
        { text: "意識的にパリィを誘って狙う", score: { strategy: 3 } },
        { text: "特に意識せず自然な流れに任せる", score: { balanced: 2, instinct: 1 } },
        { text: "攻めを継続することで自然に追い込む", score: { aggressive: 3 } },
        { text: "無理させる技を織り交ぜて誘導する", score: { reading: 3 } },
        { text: "自分のゲージ管理を優先し相手は気にしない", score: { defensive: 2, strategy: 1 } }
    ]
},
{
    question: "対戦中に「この試合、負けたな」と感じた瞬間の行動は？",
    answers: [
        { text: "最後まで諦めず一発逆転を狙う", score: { instinct: 3 } },
        { text: "次のラウンド・次戦の切り替えを優先する", score: { strategy: 2, balanced: 1 } },
        { text: "被害を最小限にすることに徹する", score: { defensive: 3 } },
        { text: "課題を見つけるつもりで冷静に観察する", score: { strategy: 3 } },
        { text: "気持ちを切らさず普段通り戦う", score: { balanced: 3 } }
    ]
},
{
    question: "自分の得意な展開に持ち込むまでの「準備」に使う手数は？",
    answers: [
        { text: "できるだけ早く仕掛けて主導権を握る", score: { aggressive: 3 } },
        { text: "焦らずじっくり準備してから動く", score: { strategy: 3 } },
        { text: "相手の出方次第で臨機応変に変える", score: { balanced: 3 } },
        { text: "間合いを保ちながら機を伺う", score: { zoning: 3 } },
        { text: "一瞬の隙を逃さず仕掛ける", score: { reading: 2, instinct: 1 } }
    ]
},
{
    question: "崩しの選択肢（打撃・投げ・中段・下段等）はいくつ持っていますか？",
    answers: [
        { text: "できる限り多くの選択肢を仕込んでいる", score: { strategy: 3 } },
        { text: "少数精鋭で決め技を磨き込んでいる", score: { combo: 3 } },
        { text: "相手のガードの傾向を見て組み立てる", score: { reading: 3 } },
        { text: "崩しより固い立ち回りを優先している", score: { defensive: 3 } },
        { text: "その場のひらめきで新しい択を作る", score: { instinct: 3 } }
    ]
},
{
    question: "強気に攻めた末に手痛い反撃を受けました。次の一手は？",
    answers: [
        { text: "同じ攻め方を貫き通す", score: { aggressive: 3 } },
        { text: "冷静に分析して行動を修正する", score: { strategy: 3 } },
        { text: "しばらく守りに徹して様子を見る", score: { defensive: 3 } },
        { text: "反撃を受けたこと自体を逆に利用する", score: { reading: 2, instinct: 1 } },
        { text: "気にせずその時々の判断で動く", score: { balanced: 3 } }
    ]
},
{
    question: "自分のプレイの「勝ちパターン」をどれくらい言語化できていますか？",
    answers: [
        { text: "細かく言語化して人にも説明できる", score: { strategy: 3 } },
        { text: "感覚的には分かるが言葉にはしづらい", score: { instinct: 3 } },
        { text: "対戦相手によって変わるので一概に言えない", score: { balanced: 3 } },
        { text: "特定の技・コンボが起点になることが多い", score: { combo: 2, strategy: 1 } },
        { text: "読み合いに勝った時のパターンが多い", score: { reading: 3 } }
    ]
},
{
    question: "コンボの締めを「ダメージ重視」と「起き攻め重視」で選ぶ基準は？",
    answers: [
        { text: "常にダメージ最大を優先する", score: { combo: 3 } },
        { text: "試合の展開次第で毎回変える", score: { balanced: 3 } },
        { text: "起き攻めを継続する方をほぼ常に選ぶ", score: { aggressive: 3 } },
        { text: "相手の残り体力を見て決める", score: { strategy: 3 } },
        { text: "起き攻めで崩せる自信がある時だけ選ぶ", score: { reading: 2, aggressive: 1 } }
    ]
},
{
    question: "自分より格下の相手との対戦、どんな意識で臨みますか？",
    answers: [
        { text: "気を抜かず普段通り全力で戦う", score: { balanced: 3 } },
        { text: "練習だと割り切って新しい択を試す", score: { strategy: 2, instinct: 1 } },
        { text: "確実に勝つことだけを優先する", score: { defensive: 3 } },
        { text: "圧倒的な差を見せつけるように攻める", score: { aggressive: 3 } },
        { text: "相手の成長も考えて手加減することがある", score: { reading: 2, balanced: 1 } }
    ]
},
{
    question: "セットマッチで連敗した後、精神的にどう立て直しますか？",
    answers: [
        { text: "冷静にキャラ相性や対策を見直す", score: { strategy: 3 } },
        { text: "気持ちを切り替えて次で取り返す気概で臨む", score: { instinct: 3 } },
        { text: "守り重視に切り替えて着実に立て直す", score: { defensive: 3 } },
        { text: "一度休憩を挟んで頭を冷やす", score: { balanced: 2, strategy: 1 } },
        { text: "むしろ連敗中に見えた相手の癖を突く", score: { reading: 3 } }
    ]
},
{
    question: "「捨てラウンド」（このラウンドは仕方ないと割り切ること）はありますか？",
    answers: [
        { text: "ほぼ無く、毎ラウンド全力で戦う", score: { balanced: 3 } },
        { text: "情報収集のために割り切ることがある", score: { strategy: 3 } },
        { text: "劣勢すぎる時は無理せず切り替える", score: { defensive: 2, strategy: 1 } },
        { text: "捨てるくらいならリスクを取って粘る", score: { instinct: 3 } },
        { text: "相手の出方を見るための駆け引きとして使う", score: { reading: 3 } }
    ]
},
{
    question: "使用キャラを複数（2〜3体）扱うことについてどう考えていますか？",
    answers: [
        { text: "1キャラを極めることに集中したい", score: { combo: 3 } },
        { text: "対策として複数キャラを使い分けたい", score: { strategy: 3 } },
        { text: "気分やその日の調子で変えることがある", score: { instinct: 2, balanced: 1 } },
        { text: "相手キャラによって有利なキャラに変える", score: { reading: 2, strategy: 1 } },
        { text: "1本目と2本目でキャラを変える戦略を使う", score: { balanced: 3 } }
    ]
},
{
    question: "自分の弱点として一番自覚しているのは？",
    answers: [
        { text: "リスクを取りすぎてしまうこと", score: { instinct: 3 } },
        { text: "慎重になりすぎて機会を逃すこと", score: { defensive: 3 } },
        { text: "コンボの安定感がまだ足りないこと", score: { combo: 3 } },
        { text: "初見の相手への対応力が弱いこと", score: { reading: 2, strategy: 1 } },
        { text: "特に大きな弱点は感じていない", score: { balanced: 3 } }
    ]
},
{
    question: "練習仲間との「オフ練」で主に何を意識していますか？",
    answers: [
        { text: "本番同様の緊張感を作って練習する", score: { instinct: 2, strategy: 1 } },
        { text: "普段試せない択を積極的に試す場にする", score: { reading: 3 } },
        { text: "コンボやセットプレイの精度を高める", score: { combo: 3 } },
        { text: "苦手な相手・キャラとの対戦を優先する", score: { defensive: 2, strategy: 1 } },
        { text: "純粋に楽しむことを優先する", score: { balanced: 3 } }
    ]
},
{
    question: "1つの技の「置き」と「差し返し」、どちらの使用頻度が高いですか？",
    answers: [
        { text: "先読みで置く頻度の方が高い", score: { zoning: 3 } },
        { text: "相手の技を見てからの差し返しが多い", score: { reading: 3 } },
        { text: "どちらもバランスよく使う", score: { balanced: 3 } },
        { text: "攻めながら押し付ける技の方が多い", score: { aggressive: 3 } },
        { text: "その場の反射で決めることが多い", score: { instinct: 3 } }
    ]
},
{
    question: "強豪との練習試合で、勝敗以上に重視することは？",
    answers: [
        { text: "自分の課題を見つけること", score: { strategy: 3 } },
        { text: "とにかく食らいついて勝ちにいくこと", score: { instinct: 3 } },
        { text: "普段の実力を落ち着いて出し切ること", score: { balanced: 3 } },
        { text: "相手の技術を盗んで吸収すること", score: { reading: 2, strategy: 1 } },
        { text: "自分のコンボやセットプレイを試すこと", score: { combo: 3 } }
    ]
},
{
    question: "ランクマッチと大会形式（オフライン等）で、プレイの意識に違いはありますか？",
    answers: [
        { text: "大会の方が集中力が上がり実力を出せる", score: { instinct: 3 } },
        { text: "ランクマの方がリラックスして戦える", score: { balanced: 2, defensive: 1 } },
        { text: "大会では特に安定行動を重視する", score: { strategy: 3 } },
        { text: "どちらでも意識はほとんど変わらない", score: { balanced: 3 } },
        { text: "大会の緊張感を糧に積極的に攻める", score: { aggressive: 3 } }
    ]
},
{
    question: "自分の使用キャラのミラーマッチ以外で、最も対策が難しいと感じるタイプは？",
    answers: [
        { text: "飛び道具中心の待ちタイプ", score: { aggressive: 2, zoning: -1 } },
        { text: "読み合いを多用するトリッキーなタイプ", score: { strategy: 3 } },
        { text: "圧倒的な火力で一撃を狙うタイプ", score: { defensive: 3 } },
        { text: "特にタイプを問わず対応できる", score: { balanced: 3 } },
        { text: "対策が難しい相手ほど燃える", score: { instinct: 3 } }
    ]
},
{
    question: "駆け引きの中で、あえて「読まれる」ことを利用したことはありますか？",
    answers: [
        { text: "よくある。裏の裏を突く駆け引きが得意", score: { reading: 3 } },
        { text: "考えたことはあるが実践は少ない", score: { strategy: 2, reading: 1 } },
        { text: "むしろ読まれないよう工夫することが多い", score: { defensive: 3 } },
        { text: "特に意識したことはない", score: { balanced: 3 } },
        { text: "その場のノリで裏をかくことがある", score: { instinct: 3 } }
    ]
},
{
    question: "自分の中で「調子が悪い日」のサインとして最初に気づくのは？",
    answers: [
        { text: "コンボのミスが増える", score: { combo: 3 } },
        { text: "対空や差し返しの精度が落ちる", score: { defensive: 3 } },
        { text: "無駄に攻め急いでしまう", score: { aggressive: 2, instinct: 1 } },
        { text: "読みが外れることが増える", score: { reading: 3 } },
        { text: "特に調子の波は感じにくい", score: { balanced: 3 } }
    ]
},
{
    question: "調子が悪いと感じた時、その日はどうしますか？",
    answers: [
        { text: "基礎練習に戻って立て直す", score: { strategy: 3 } },
        { text: "気分を変えて別のことをする", score: { balanced: 2, instinct: 1 } },
        { text: "無理にでも量をこなして波を乗り越える", score: { aggressive: 2, instinct: 1 } },
        { text: "守り重視の立ち回りに切り替える", score: { defensive: 3 } },
        { text: "むしろ普段しない挑戦をしてみる", score: { instinct: 3 } }
    ]
},
{
    question: "相手が明らかに格上と分かった時、選ぶ戦略は？",
    answers: [
        { text: "定石通りの安定した立ち回りで挑む", score: { defensive: 3 } },
        { text: "普段しない奇襲や崩しを積極的に試す", score: { instinct: 3 } },
        { text: "事前に対策を練り込んで臨む", score: { strategy: 3 } },
        { text: "相手の反応を見ながら対応を組み立てる", score: { reading: 3 } },
        { text: "特別なことはせずいつも通り戦う", score: { balanced: 3 } }
    ]
},
{
    question: "自分の勝率をキャラ別で把握していますか？",
    answers: [
        { text: "細かく記録・分析している", score: { strategy: 3 } },
        { text: "なんとなく体感で把握している", score: { instinct: 2, balanced: 1 } },
        { text: "特に気にしたことがない", score: { balanced: 3 } },
        { text: "苦手キャラだけは強く意識している", score: { defensive: 2, strategy: 1 } },
        { text: "勝率よりコンボ成功率などを重視する", score: { combo: 3 } }
    ]
},
{
    question: "試合中の呼吸やリズムを意識してコントロールしていますか？",
    answers: [
        { text: "常に一定のリズムを保つよう意識している", score: { strategy: 3 } },
        { text: "劣勢時だけ深呼吸などで整える", score: { defensive: 2, strategy: 1 } },
        { text: "特に意識したことはない", score: { instinct: 2, balanced: 1 } },
        { text: "攻めながら自然とテンポが上がる", score: { aggressive: 3 } },
        { text: "相手の呼吸・テンポを読むことを重視する", score: { reading: 3 } }
    ]
},
{
    question: "1つのコンボルートを完璧に仕上げるのと、複数の状況別ルートを持つのはどちらを優先しますか？",
    answers: [
        { text: "1つを完璧に仕上げることを優先する", score: { combo: 3 } },
        { text: "状況に応じた複数ルートを優先する", score: { strategy: 3 } },
        { text: "対戦の中で自然と身についたものを使う", score: { instinct: 2, balanced: 1 } },
        { text: "ダメージより安定重視のルートを優先する", score: { defensive: 2, combo: 1 } },
        { text: "相手キャラに応じて優先順位を変える", score: { reading: 2, strategy: 1 } }
    ]
},
{
    question: "試合中、相手の入力ミス（暴発）に気づいた時どうしますか？",
    answers: [
        { text: "即座にそこを突いてダメージを取る", score: { reading: 3 } },
        { text: "冷静に確定反撃を選ぶ", score: { combo: 2, strategy: 1 } },
        { text: "気づいても大きくは狙いすぎない", score: { defensive: 2, balanced: 1 } },
        { text: "その隙を逃さず一気に畳みかける", score: { aggressive: 3 } },
        { text: "咄嗟に反応して最速で反撃する", score: { instinct: 3 } }
    ]
},
{
    question: "自キャラの技の性能変更（強化・弱体化）が入った時、真っ先に確認するのは？",
    answers: [
        { text: "フレーム値やダメージなど数値の変化", score: { strategy: 3 } },
        { text: "実際に動かして体感の変化を確認する", score: { instinct: 2, combo: 1 } },
        { text: "起き攻めやコンボへの影響", score: { combo: 3 } },
        { text: "対戦相手への影響（相性の変化）", score: { reading: 2, strategy: 1 } },
        { text: "特に細かく確認せず対戦の中で気づく", score: { balanced: 3 } }
    ]
},
{
    question: "自分の得意な間合いを「作る」ためにどんな工夫をしていますか？",
    answers: [
        { text: "技の差し合いで少しずつ押し込む", score: { zoning: 3 } },
        { text: "ラッシュで一気に距離を詰める", score: { aggressive: 3 } },
        { text: "相手の技の隙を見て距離を調整する", score: { reading: 2, strategy: 1 } },
        { text: "特に意識せず自然な流れに任せる", score: { balanced: 3 } },
        { text: "画面全体の位置関係を常に計算している", score: { strategy: 3 } }
    ]
},
{
    question: "自分が崩された時、原因をどう分析しますか？",
    answers: [
        { text: "読みが外れたことをすぐに認めて次に活かす", score: { strategy: 3 } },
        { text: "たまたま運が悪かったと割り切る", score: { instinct: 2, balanced: 1 } },
        { text: "同じ択を食らわないよう意識を強める", score: { defensive: 3 } },
        { text: "相手の狙いを逆算して次に対応する", score: { reading: 3 } },
        { text: "深く気にせず次のラウンドに切り替える", score: { balanced: 3 } }
    ]
},
{
    question: "SNSやコミュニティでの情報収集、どの程度活用していますか？",
    answers: [
        { text: "最新の攻略情報は積極的に追っている", score: { strategy: 3 } },
        { text: "有名選手のプレイ動画をよく研究する", score: { reading: 2, strategy: 1 } },
        { text: "情報より自分の実戦経験を優先する", score: { instinct: 3 } },
        { text: "コンボや技のフレーム表を主にチェックする", score: { combo: 3 } },
        { text: "特に積極的な情報収集はしていない", score: { balanced: 3 } }
    ]
},
{
    question: "自分の強みを一言で表すとしたら？",
    answers: [
        { text: "攻めの継続力・畳みかける力", score: { aggressive: 3 } },
        { text: "崩れない守りの堅さ", score: { defensive: 3 } },
        { text: "相手を動かす間合い管理", score: { zoning: 3 } },
        { text: "どんな展開にも対応できる柔軟さ", score: { balanced: 3 } },
        { text: "ここぞという時の勝負強さ", score: { instinct: 3 } }
    ]
},
{
    question: "確定反撃を取れる場面で、あえて簡単なコンボに留めることはありますか？",
    answers: [
        { text: "ほぼ無い。常に最大火力を狙う", score: { combo: 3 } },
        { text: "起き攻めを優先してあえて留めることがある", score: { strategy: 3 } },
        { text: "確実性を優先してよく留めている", score: { defensive: 3 } },
        { text: "その場のノリで決める", score: { instinct: 2, balanced: 1 } },
        { text: "相手の残り体力を見て判断する", score: { reading: 2, strategy: 1 } }
    ]
},
{
    question: "苦手な間合い（例：中間距離）での立ち回りをどう克服しましたか？",
    answers: [
        { text: "反復練習でその間合い専用の対応を身につけた", score: { strategy: 3 } },
        { text: "その間合いを避ける立ち回りを徹底した", score: { zoning: 3 } },
        { text: "実戦経験を積んで感覚で対応できるようにした", score: { instinct: 3 } },
        { text: "まだ克服できておらず課題として残っている", score: { defensive: 2, strategy: 1 } },
        { text: "特に意識せず自然に対応できるようになった", score: { balanced: 3 } }
    ]
},
{
    question: "対戦相手が急に戦法を変えてきました。最初にすることは？",
    answers: [
        { text: "すぐにこちらも対応を切り替える", score: { reading: 3 } },
        { text: "変化の意図を冷静に分析する", score: { strategy: 3 } },
        { text: "自分のペースを崩さず様子を見る", score: { balanced: 3 } },
        { text: "変化に構わず攻めを継続する", score: { aggressive: 3 } },
        { text: "咄嗟の直感で対応する", score: { instinct: 3 } }
    ]
},
{
    question: "「勝てばいい」か「魅せる勝ち方をしたい」か、どちらに近いですか？",
    answers: [
        { text: "内容より結果（勝敗）を最優先する", score: { defensive: 2, strategy: 1 } },
        { text: "見ている人が楽しめる試合をしたい", score: { aggressive: 2, instinct: 1 } },
        { text: "自分が納得できる内容かどうかを重視する", score: { strategy: 3 } },
        { text: "状況次第でどちらも大事にする", score: { balanced: 3 } },
        { text: "読み合いに勝つ瞬間が一番の醍醐味", score: { reading: 3 } }
    ]
},
{
    question: "練習量と対戦経験値、どちらが実力向上に効くと感じていますか？",
    answers: [
        { text: "トレモでの反復練習が一番効く", score: { combo: 3 } },
        { text: "実戦の場数が何より重要", score: { instinct: 2, reading: 1 } },
        { text: "両方をバランスよく積む必要がある", score: { balanced: 3 } },
        { text: "対戦後の振り返り・分析が一番効く", score: { strategy: 3 } },
        { text: "守りの反復練習を最優先している", score: { defensive: 3 } }
    ]
},
{
    question: "画面端で自分が攻める側の時、最も重視する要素は？",
    answers: [
        { text: "択の多さで崩し切ること", score: { strategy: 3 } },
        { text: "とにかく攻めを止めないこと", score: { aggressive: 3 } },
        { text: "相手の脱出手段を潰すこと", score: { defensive: 2, strategy: 1 } },
        { text: "一撃必殺の重い択を通すこと", score: { instinct: 3 } },
        { text: "相手の癖から崩し方を選ぶこと", score: { reading: 3 } }
    ]
},
{
    question: "画面端で自分が守る側の時、最優先することは？",
    answers: [
        { text: "無敵技での脱出タイミングを計る", score: { defensive: 3 } },
        { text: "相手の崩しパターンを読み切る", score: { reading: 3 } },
        { text: "最小限の被害で耐えることに徹する", score: { strategy: 3 } },
        { text: "リスクを取って強引に暴れる", score: { instinct: 3 } },
        { text: "落ち着いて選択肢を絞り込む", score: { balanced: 3 } }
    ]
},
{
    question: "自分のプレイスタイルを一言で表すなら？",
    answers: [
        { text: "圧をかけ続けるアグレッシブ型", score: { aggressive: 3 } },
        { text: "崩れない鉄壁の守備型", score: { defensive: 3 } },
        { text: "間合いを支配する頭脳型", score: { zoning: 3 } },
        { text: "何でもこなすオールラウンダー", score: { balanced: 3 } },
        { text: "読み合いを制する心理戦型", score: { reading: 3 } }
    ]
},
{
    question: "コンボ火力とセットプレイ、どちらをより磨き込んでいますか？",
    answers: [
        { text: "圧倒的にコンボ火力の方を磨いている", score: { combo: 3 } },
        { text: "セットプレイ（崩し）の方に時間をかけている", score: { strategy: 3 } },
        { text: "両方同じくらい重視している", score: { balanced: 3 } },
        { text: "その場の対戦相手に応じて変える", score: { reading: 2, strategy: 1 } },
        { text: "どちらより読み合いの精度を優先する", score: { reading: 3 } }
    ]
},
{
    question: "自分が今一番伸ばしたいと思っている技術は？",
    answers: [
        { text: "コンボの安定性・火力効率", score: { combo: 3 } },
        { text: "守りの精度（対空・確反）", score: { defensive: 3 } },
        { text: "読み合いの精度・駆け引き", score: { reading: 3 } },
        { text: "本番でのメンタル・勝負強さ", score: { instinct: 3 } },
        { text: "特定分野より総合力を底上げしたい", score: { balanced: 3 } }
    ]
},
{
    question: "同じミスを繰り返してしまう時、どう対処していますか？",
    answers: [
        { text: "原因を突き止めるまで徹底的に練習する", score: { strategy: 3 } },
        { text: "気にしすぎず場数でカバーする", score: { instinct: 2, balanced: 1 } },
        { text: "ミスを避けるため安定行動を増やす", score: { defensive: 3 } },
        { text: "一度距離を置いて別の練習をする", score: { balanced: 2, strategy: 1 } },
        { text: "むしろ攻めの姿勢で克服しようとする", score: { aggressive: 3 } }
    ]
},
{
    question: "対戦中、相手の思考を読む上で最も注目するのは？",
    answers: [
        { text: "ボタンの押し方・入力の癖", score: { reading: 3 } },
        { text: "ゲージの使い方の傾向", score: { strategy: 3 } },
        { text: "キャラの性能・定石通りの行動", score: { combo: 2, strategy: 1 } },
        { text: "その場の空気感・雰囲気", score: { instinct: 3 } },
        { text: "特に注目せず自分のプレイに集中する", score: { balanced: 3 } }
    ]
},
{
    question: "自分より速いテンポで攻められた時の対応は？",
    answers: [
        { text: "テンポに飲まれず自分のリズムを守る", score: { defensive: 3 } },
        { text: "同じテンポで応戦する", score: { aggressive: 3 } },
        { text: "相手のテンポの隙を突く", score: { reading: 3 } },
        { text: "一度距離を取って仕切り直す", score: { zoning: 3 } },
        { text: "状況を見て柔軟に対応する", score: { balanced: 3 } }
    ]
},
{
    question: "コーチングや指導を受けることについてどう思いますか？",
    answers: [
        { text: "積極的に受けて技術を吸収したい", score: { strategy: 3 } },
        { text: "自分のスタイルを大事にしたいので慎重", score: { instinct: 2, balanced: 1 } },
        { text: "基礎的な部分は教わりたい", score: { defensive: 2, strategy: 1 } },
        { text: "特に必要性を感じていない", score: { balanced: 3 } },
        { text: "教わるより自分で試行錯誤したい", score: { instinct: 3 } }
    ]
},
{
    question: "強い相手のプレイを見て真似したいと思う部分は？",
    answers: [
        { text: "崩れないコンボ・操作精度", score: { combo: 3 } },
        { text: "読み合いの判断の速さ", score: { reading: 3 } },
        { text: "リスクを恐れない勝負どころの選択", score: { instinct: 3 } },
        { text: "隙を見せない守りの堅さ", score: { defensive: 3 } },
        { text: "全体を通した安定感・バランス", score: { balanced: 3 } }
    ]
},
{
    question: "自分の中で「これをやられたら終わり」と感じる展開は？",
    answers: [
        { text: "画面端に完全に固定されること", score: { defensive: 3 } },
        { text: "ゲージを使い切られてバーンアウトすること", score: { strategy: 3 } },
        { text: "読み合いで一方的に崩され続けること", score: { reading: 3 } },
        { text: "特にそういった弱点は感じていない", score: { balanced: 3 } },
        { text: "攻めの手段を完全に潰されること", score: { aggressive: 3 } }
    ]
},
{
    question: "1つの試合の中で、最も重要だと思う瞬間はどこですか？",
    answers: [
        { text: "試合開始直後の主導権争い", score: { aggressive: 2, reading: 1 } },
        { text: "体力が拮抗した終盤の攻防", score: { instinct: 3 } },
        { text: "画面端に追い込んだ・追い込まれた瞬間", score: { strategy: 3 } },
        { text: "ゲージ状況が切り替わる瞬間", score: { strategy: 2, defensive: 1 } },
        { text: "全ての瞬間が同じくらい重要", score: { balanced: 3 } }
    ]
},
{
    question: "格闘ゲームにおいて「才能」と「努力」、どちらが重要だと考えますか？",
    answers: [
        { text: "地道な努力が何より重要だと思う", score: { strategy: 3 } },
        { text: "土壇場での才能・センスが差を生む", score: { instinct: 3 } },
        { text: "どちらも同じくらい必要だと思う", score: { balanced: 3 } },
        { text: "努力を継続できることこそ才能だと思う", score: { defensive: 2, strategy: 1 } },
        { text: "深く考えたことはない", score: { reading: 2, balanced: 1 } }
    ]
},
{
    question: "自分の使用キャラを選んだ理由に一番近いのは？",
    answers: [
        { text: "見た目やキャラクター性が好きだから", score: { instinct: 2, balanced: 1 } },
        { text: "性能が自分のプレイスタイルに合うから", score: { strategy: 3 } },
        { text: "コンボや操作が楽しいから", score: { combo: 3 } },
        { text: "強いキャラだと思ったから", score: { aggressive: 2, combo: 1 } },
        { text: "特に理由はなく直感で選んだ", score: { instinct: 3 } }
    ]
},
{
    question: "対戦相手のキャラが自分の相性有利なキャラだった時の心境は？",
    answers: [
        { text: "油断せず慎重に立ち回る", score: { defensive: 3 } },
        { text: "有利を活かして一気に攻める", score: { aggressive: 3 } },
        { text: "有利不利より対戦相手の腕を見る", score: { balanced: 3 } },
        { text: "相性を活かしつつ相手の対応も読む", score: { reading: 3 } },
        { text: "むしろ相性有利だと燃えないタイプ", score: { instinct: 2, strategy: 1 } }
    ]
},
{
    question: "試合を通して、体力ゲージの管理（削り方・守り方）で意識していることは？",
    answers: [
        { text: "リードを奪ったら守り寄りに切り替える", score: { defensive: 3 } },
        { text: "リードしていても攻めの手を緩めない", score: { aggressive: 3 } },
        { text: "体力差を見て毎回柔軟に方針を変える", score: { balanced: 3 } },
        { text: "削りダメージまで計算して立ち回る", score: { strategy: 3 } },
        { text: "細かい計算より流れを重視する", score: { instinct: 3 } }
    ]
},
{
    question: "自分の得意なセットプレイを相手に完全に見切られた時、どうしますか？",
    answers: [
        { text: "別の崩し方を即座に用意して切り替える", score: { strategy: 3 } },
        { text: "見切られていても押し通す", score: { aggressive: 2, instinct: 1 } },
        { text: "崩しを諦めて安定行動に切り替える", score: { defensive: 3 } },
        { text: "相手の見切り方自体を逆手に取る", score: { reading: 3 } },
        { text: "その場のひらめきで新しい形を作る", score: { instinct: 3 } }
    ]
},
{
    question: "対戦中の「間（ま）」の使い方について、意識していることは？",
    answers: [
        { text: "あえて間を作って相手に考えさせる", score: { strategy: 3 } },
        { text: "間を与えず一気にたたみかける", score: { aggressive: 3 } },
        { text: "相手の間の使い方から心理を読む", score: { reading: 3 } },
        { text: "特に意識したことはない", score: { balanced: 2, instinct: 1 } },
        { text: "間合いの管理を最優先している", score: { zoning: 3 } }
    ]
},
{
    question: "SNS等で自分の対戦動画に評価コメントがついた時の反応は？",
    answers: [
        { text: "参考にして次のプレイに活かす", score: { strategy: 3 } },
        { text: "自分のスタイルを貫くので気にしない", score: { instinct: 3 } },
        { text: "厳しい評価ほど受け止めて改善する", score: { defensive: 2, strategy: 1 } },
        { text: "褒められた部分をさらに伸ばそうとする", score: { aggressive: 2, combo: 1 } },
        { text: "あまりSNSの評価は見ない", score: { balanced: 3 } }
    ]
},
{
    question: "格闘ゲームにおける「型」を持つことについてどう考えますか？",
    answers: [
        { text: "自分の型を極めることが一番強い", score: { combo: 3 } },
        { text: "型を持たず柔軟に対応する方が強い", score: { balanced: 3 } },
        { text: "型はあるが相手を見て崩すこともある", score: { reading: 2, strategy: 1 } },
        { text: "型より本能的な判断を信じている", score: { instinct: 3 } },
        { text: "堅実な基本の型を大事にしている", score: { defensive: 3 } }
    ]
},
{
    question: "強い相手と当たった直後の「悔しさ」をどう次に活かしますか？",
    answers: [
        { text: "悔しさをバネに練習量を増やす", score: { aggressive: 2, strategy: 1 } },
        { text: "冷静に敗因を分析してから動く", score: { strategy: 3 } },
        { text: "リベンジの機会を虎視眈々と狙う", score: { instinct: 3 } },
        { text: "悔しさより学びとして受け止める", score: { balanced: 3 } },
        { text: "しばらく引きずってしまう", score: { defensive: 2, instinct: 1 } }
    ]
},
{
    question: "自分のプレイにおいて「これだけは負けない」と思える強みは？",
    answers: [
        { text: "コンボ・操作精度の高さ", score: { combo: 3 } },
        { text: "崩れない守りの堅さ", score: { defensive: 3 } },
        { text: "土壇場での読みの鋭さ", score: { reading: 3 } },
        { text: "何が来ても対応できる柔軟さ", score: { balanced: 3 } },
        { text: "勝負どころでの思い切りの良さ", score: { instinct: 3 } }
    ]
},
{
    question: "最後に、これからの目標として一番近いのは？",
    answers: [
        { text: "圧倒的な火力・攻めで魅せる存在になりたい", score: { aggressive: 3 } },
        { text: "誰にも崩されない堅実なプレイヤーになりたい", score: { defensive: 3 } },
        { text: "誰よりも深く読み合いを極めたい", score: { reading: 3 } },
        { text: "どんな展開にも対応できる万能選手になりたい", score: { balanced: 3 } },
        { text: "大舞台で勝負強さを発揮できる選手になりたい", score: { instinct: 3 } }
    ]
},
{
    question: "対戦相手が明らかに緊張・動揺しているのが見えた時、どうしますか？",
    answers: [
        { text: "その隙を逃さず一気に攻め立てる", score: { aggressive: 3 } },
        { text: "焦らず着実にダメージを積み重ねる", score: { strategy: 3 } },
        { text: "相手の動揺している行動パターンを読む", score: { reading: 3 } },
        { text: "普段通りの自分のペースを崩さない", score: { balanced: 3 } },
        { text: "一気に決めにいくチャンスと捉える", score: { instinct: 3 } }
    ]
},
{
    question: "自分の使用キャラの「弱いと言われる技」、どう扱っていますか？",
    answers: [
        { text: "工夫して使いこなせるよう研究している", score: { strategy: 3 } },
        { text: "評価に関わらず自分の感覚を信じて使う", score: { instinct: 3 } },
        { text: "基本的には使わず安定した技を優先", score: { defensive: 3 } },
        { text: "場面を選んで使い所を見極めている", score: { reading: 2, strategy: 1 } },
        { text: "他の技との組み合わせで活かす", score: { combo: 3 } }
    ]
},
{
    question: "相手のOD技や無敵技の残りリソースをどこまで数えていますか？",
    answers: [
        { text: "常に正確に数えて立ち回りに反映する", score: { strategy: 3 } },
        { text: "大まかには把握しているが厳密ではない", score: { balanced: 2, strategy: 1 } },
        { text: "あまり数えず相手の行動から判断する", score: { reading: 3 } },
        { text: "特に気にせず自分のプレイに集中する", score: { instinct: 3 } },
        { text: "ゲージ管理は守りの判断にのみ使う", score: { defensive: 3 } }
    ]
},
{
    question: "相手の起き上がりに対して、毎回同じ択を仕掛けますか？それとも変えますか？",
    answers: [
        { text: "基本的に同じ強い択を継続する", score: { aggressive: 2, combo: 1 } },
        { text: "相手の対応を見ながら細かく変える", score: { reading: 3 } },
        { text: "パターンを複数用意してローテーションする", score: { strategy: 3 } },
        { text: "リスクを避けて安定した択に留める", score: { defensive: 3 } },
        { text: "その場の直感で決めることが多い", score: { instinct: 3 } }
    ]
},
{
    question: "自分のキャラの「対空技」以外での空中攻撃への対処法は？",
    answers: [
        { text: "地上技での差し返しを主に使う", score: { zoning: 2, strategy: 1 } },
        { text: "ガードを固めて着地を狙う", score: { defensive: 3 } },
        { text: "相手のジャンプの意図を先に読んで動く", score: { reading: 3 } },
        { text: "無敵技での割り込みを積極的に使う", score: { instinct: 2, aggressive: 1 } },
        { text: "その場の反応速度で対応する", score: { instinct: 3 } }
    ]
},
{
    question: "コンボの「見せ技」（派手だが実用性が低い技）を試合で使うことはありますか？",
    answers: [
        { text: "実用性を最優先するので使わない", score: { defensive: 2, strategy: 1 } },
        { text: "確実に決まる場面なら使うこともある", score: { combo: 3 } },
        { text: "楽しさ重視で機会があれば使う", score: { instinct: 3 } },
        { text: "配信・大会など見られる場では使う", score: { aggressive: 2, instinct: 1 } },
        { text: "実用性と両立できる技だけ選んで使う", score: { strategy: 3 } }
    ]
},
{
    question: "自分の得意なキャラ対策を後輩・仲間に教えることについてどう思いますか？",
    answers: [
        { text: "積極的に教えてシーン全体を強くしたい", score: { balanced: 3 } },
        { text: "聞かれれば教えるが自分からは言わない", score: { defensive: 2, strategy: 1 } },
        { text: "教えることで自分の理解も深まるので好き", score: { strategy: 3 } },
        { text: "対策は基本的に自分だけの武器にしたい", score: { instinct: 2, combo: 1 } },
        { text: "教えるより一緒に練習する方が好き", score: { reading: 2, balanced: 1 } }
    ]
},
{
    question: "1つの技を「封印」して読み合いを深める駆け引きをしたことはありますか？",
    answers: [
        { text: "よくある。裏の裏を読む駆け引きが好き", score: { reading: 3 } },
        { text: "考えたことはあるが実践は少ない", score: { strategy: 2, reading: 1 } },
        { text: "封印より素直な選択を大事にしている", score: { balanced: 3 } },
        { text: "その場のひらめきで自然と封印することがある", score: { instinct: 3 } },
        { text: "安定行動を優先するのであまりしない", score: { defensive: 3 } }
    ]
},
{
    question: "自分の使用キャラの「対策のされやすさ」についてどう感じていますか？",
    answers: [
        { text: "対策されても崩れない地力をつけている", score: { defensive: 3 } },
        { text: "対策の一歩先を行く工夫を常にしている", score: { strategy: 3 } },
        { text: "対策されること自体をあまり気にしない", score: { instinct: 2, balanced: 1 } },
        { text: "対策されたらキャラや型を変える柔軟さがある", score: { balanced: 3 } },
        { text: "対策されるほど燃えて研究したくなる", score: { aggressive: 2, strategy: 1 } }
    ]
},
{
    question: "「勝てる試合を落とした」経験から一番学んだことは？",
    answers: [
        { text: "油断せず最後まで集中を切らさないこと", score: { strategy: 3 } },
        { text: "リードした後の守りの重要性", score: { defensive: 3 } },
        { text: "相手の逆転の芽を早めに摘む判断力", score: { reading: 3 } },
        { text: "結果より過程を大事にする姿勢", score: { balanced: 3 } },
        { text: "最後まで攻めの手を緩めない大切さ", score: { aggressive: 3 } }
    ]
},
{
    question: "対戦相手の使用キャラの「勝ちパターン」をどこまで研究していますか？",
    answers: [
        { text: "主要なキャラは勝ちパターンまで把握している", score: { strategy: 3 } },
        { text: "対戦しながら都度読み取る方が得意", score: { reading: 3 } },
        { text: "自分の対応力でカバーするので研究は最小限", score: { balanced: 3 } },
        { text: "特に研究せず経験則で対応する", score: { instinct: 3 } },
        { text: "自キャラとの相性の部分だけ重点的に見る", score: { defensive: 2, strategy: 1 } }
    ]
},
{
    question: "上級者同士の対戦で、最終的に勝敗を分けると思う一番の要因は？",
    answers: [
        { text: "土壇場でのリスク管理の巧さ", score: { strategy: 3 } },
        { text: "一瞬の読み合いを制する力", score: { reading: 3 } },
        { text: "崩れない基礎技術（コンボ・操作）", score: { combo: 3 } },
        { text: "プレッシャーに負けないメンタル", score: { instinct: 3 } },
        { text: "総合力のわずかな差", score: { balanced: 3 } }
    ]
},
{
    question: "この診断を終えて、自分のプレイスタイルを見つめ直した今の気持ちに近いのは？",
    answers: [
        { text: "強みをもっと伸ばしていきたい", score: { aggressive: 2, combo: 1 } },
        { text: "課題が明確になり練習の指針ができた", score: { strategy: 3 } },
        { text: "自分の勝負どころを再確認できた", score: { instinct: 3 } },
        { text: "バランスの取れたプレイヤーを目指したい", score: { balanced: 3 } },
        { text: "読み合いの精度をさらに高めたい", score: { reading: 3 } }
    ]
},
{
    question: "対戦の合間、次の一戦に向けて最も気持ちを切り替える方法は？",
    answers: [
        { text: "直前の試合の反省点を整理してから臨む", score: { strategy: 3 } },
        { text: "深呼吸などで気持ちをリセットする", score: { defensive: 2, balanced: 1 } },
        { text: "次こそはという気持ちで気合を入れ直す", score: { instinct: 3 } },
        { text: "相手のキャラ・傾向を素早く頭に入れる", score: { reading: 3 } },
        { text: "特に切り替えは意識せず自然体でいる", score: { balanced: 3 } }
    ]
}

];
