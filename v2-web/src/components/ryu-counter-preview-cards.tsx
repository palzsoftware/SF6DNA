import type { ReactNode } from "react";
import type { StrategyCardView } from "@/components/strategy-card-explorer";
import styles from "./ryu-counter-preview-cards.module.css";

type CounterCandidate = {
  id: string;
  title: string;
  scope: "全キャラ共通候補" | "キャミィ専用技の候補";
  why: string;
  action: string;
  benefit: string;
  caution: string;
  source: string;
  search: string[];
};

const candidates: CounterCandidate[] = [
  { id: "T001", title: "昇龍拳をガードして反撃", scope: "全キャラ共通候補", why: "リュウの切り返しをガードできれば、こちらの攻めを通す大きな機会になります。", action: "起き攻め中は無敵技を警戒し、ガードを選べる場面では攻撃を出し切らずに待ちます。ガード後は自キャラで届く反撃を選びます。", benefit: "相手の切り返しを空振りさせずに受け止め、ターンとダメージ機会を取り返せます。", caution: "技の強度・距離・端の位置で反撃が届くか変わります。掲載フレーム値を現行Patchと実機で再確認するまで、最大反撃を断定しません。", source: "https://www.streetfighter.com/6/buckler/ja-jp/fight/character/ryu", search: ["昇龍拳", "無敵技", "ガード", "確定反撃"] },
  { id: "T002", title: "竜巻旋風脚はガード後の距離を見る", scope: "全キャラ共通候補", why: "強度や当たり方によってリュウとの距離が変わり、同じ反撃が毎回届くとは限りません。", action: "まずガードを優先し、技が止まった位置を見てから、届く通常技や必殺技で反撃します。先端なら無理に差し返そうとせず、中立に戻します。", benefit: "空振りする反撃を減らし、反撃を受けるリスクを抑えられます。", caution: "強度・持続当たり・端の状況ごとの反撃技は、各キャラクターで要確認です。", source: "https://www.streetfighter.com/6/buckler/ja-jp/fight/character/ryu", search: ["竜巻旋風脚", "距離", "反撃"] },
  { id: "T003", title: "上段足刀蹴りは強度を見て対応", scope: "全キャラ共通候補", why: "ガード後に反撃できる強度と、先端で反撃が届きにくい強度を同じように扱うと、反撃を空振りします。", action: "ガード後にリュウとの距離を見ます。近ければ届く反撃を選び、先端では小さく有利を取り返すか中立へ戻します。", benefit: "反撃可能な状況だけを狙えるため、無理なボタンによる被反撃を防げます。", caution: "強度別の確定反撃と間合いは現行Patchで要確認です。", source: "https://www.streetfighter.com/6/buckler/ja-jp/fight/character/ryu", search: ["上段足刀蹴り", "足刀", "先端", "距離"] },
  { id: "T004", title: "しゃがみ強Kをガード・空振り後に咎める", scope: "全キャラ共通候補", why: "リュウの長い下段を受け続けると、体力と立ち回りの主導権を失いやすくなります。", action: "間合い外では空振りを誘い、空振りを見たら前進して差し返します。ガードできた時は自キャラで届く反撃を確認します。", benefit: "リュウが気軽に下段を振りにくくなり、地上戦の距離を作りやすくなります。", caution: "空振り確認とガード後の反撃は別状況です。距離による届き方を分けて練習してください。", source: "https://www.streetfighter.com/6/buckler/ja-jp/fight/character/ryu", search: ["しゃがみ強K", "下段", "差し返し"] },
  { id: "T005", title: "波動拳はパリィで受けてゲージ消耗を抑える", scope: "全キャラ共通候補", why: "波動拳を立ちガードし続けるとドライブゲージが削られ、バーンアウトに近づきます。", action: "弾の発射を見て通常パリィを使い、パリィを維持しながら距離を詰めます。相手が前進や飛びを狙っている時は、パリィを解いて守りを切り替えます。", benefit: "ガードだけで受けるよりゲージ消耗を抑え、前進の機会も作れます。", caution: "パリィ中は投げに弱くなります。波動拳以外の行動を見てから続けるか判断します。", source: "https://www.sf6-genten.com/article/cammy-ryu-matchup-kumayoshi", search: ["波動拳", "飛び道具", "パリィ", "ドライブゲージ", "ゲージ削り"] },
  { id: "T006", title: "波動拳読みの飛びは距離を選ぶ", scope: "全キャラ共通候補", why: "波動拳を毎回ガードするとゲージを失いますが、見てから飛ぶと対空される危険があります。", action: "弾を撃つ読みがあり、リュウの対空が間に合いにくい距離・タイミングに絞って飛びます。通常時はパリィと歩きを軸にします。", benefit: "飛びを通せた時は一気に接近でき、リュウの弾連打を抑止できます。", caution: "飛びを読まれると大きな反撃を受けます。飛びを基本行動にしないでください。", source: "https://www.streetfighter.com/6/buckler/ja-jp/fight/character/ryu", search: ["波動拳", "ジャンプ", "飛び", "対空"] },
  { id: "T007", title: "キャミィ限定候補：波動拳をアクセルスピンナックルで抜ける", scope: "キャミィ専用技の候補", why: "波動拳をガードし続けるとドライブゲージを削られます。キャミィには、飛び道具無敵を持つアクセルスピンナックルがあります。", action: "リュウが波動拳を撃つと読んだ場面で、飛び道具無敵のある中・強・OD版を選択肢にします。弱版には同じ飛び道具無敵がないため、混同しません。", benefit: "弾を避けて接近し、リュウに波動拳を撃ちにくくさせる狙いがあります。", caution: "このカードの技選択はキャミィ専用です。発生前に止められる場合があり、近距離ODは相手の背後に回り込む条件で硬直差が変わります。波掌撃には飛び道具無敵が対策になりません。", source: "https://sf6-genten.com/character/cammy", search: ["キャミィ", "アクセルスピンナックル", "波動拳", "弾抜け", "飛び道具無敵"] },
  { id: "T008", title: "波掌撃と波動拳を見分ける", scope: "全キャラ共通候補", why: "波掌撃は打撃、波動拳は飛び道具です。弾抜け技を波掌撃に出すなど、属性を取り違えると反撃を受けます。", action: "リュウの動作と距離を見て技を識別します。波掌撃にはガードを基本にし、飛び道具無敵技は波動拳を読んだ時だけ選びます。", benefit: "技の属性に合った防御を選び、不要な被弾を減らせます。", caution: "電刃強化・OD・通常版で性能と有利不利が変わるため、見た目だけで反撃を決めないでください。", source: "https://www.streetfighter.com/6/buckler/ja-jp/fight/character/ryu", search: ["波掌撃", "波動拳", "技の見分け", "弾抜け"] },
  { id: "T009", title: "中波掌撃のガード後は距離を確認", scope: "全キャラ共通候補", why: "資料上はガード後に反撃候補がありますが、距離が離れていると攻撃が届かない場合があります。", action: "ガードした位置を確認し、届く反撃だけを出します。遠ければ無理にボタンを押さず、リュウの次の行動に備えます。", benefit: "確反を取れる近距離だけを逃さず、遠距離の空振りを防げます。", caution: "ガード硬直差は候補資料の数値で、現行Patch・実機で未確認です。距離別の成立確認が必要です。", source: "https://www.streetfighter.com/6/buckler/ja-jp/fight/character/ryu", search: ["波掌撃", "中波掌撃", "確定反撃", "距離"] },
  { id: "T010", title: "弱攻撃からの波掌撃に毎回暴れない", scope: "全キャラ共通候補", why: "リュウは通常技を必殺技でキャンセルできます。攻撃をガードした直後に毎回ボタンを押すと、キャンセル技に負ける場面があります。", action: "連係の隙間とキャンセルを見極めます。まずガードし、連係が途切れる箇所や波掌撃の空振りを確認してから反撃します。", benefit: "決め打ちの暴れを減らし、相手のキャンセル待ちに付き合わずに済みます。", caution: "すべての連係が連続ガードという意味ではありません。技・距離・キャンセル先ごとに確認します。", source: "https://www.streetfighter.com/6/buckler/ja-jp/fight/character/ryu", search: ["波掌撃", "弱攻撃", "暴れ", "キャンセル", "固め"] },
  { id: "T011", title: "鳩尾砕きをガードした後は暴れず守る", scope: "全キャラ共通候補", why: "候補資料ではガード後にリュウ側が有利とされています。即座の小技は、次の打撃に負ける可能性があります。", action: "まずガードを続け、投げ・下段・遅らせ行動を見てから対応します。ジャストパリィや無敵技は相手の次の行動を読んだ時の選択肢にします。", benefit: "有利状況での安易な暴れを減らし、相手の択を見て防御できます。", caution: "有利フレーム値は現行Patch・実機未確認です。先端では投げ間合いも変化します。", source: "https://www.streetfighter.com/6/buckler/ja-jp/fight/character/ryu", search: ["鳩尾砕き", "暴れ", "ジャストパリィ", "投げ"] },
  { id: "T012", title: "鎖骨割りは立ちガードを基本にする", scope: "全キャラ共通候補", why: "中段攻撃をしゃがみガードしていると崩されます。", action: "接近時は中段を意識して立ちガードを混ぜます。ガード後は確定反撃と決めつけず、リュウの硬直と間合いを確認します。", benefit: "中段を受けにくくし、守りを崩される回数を減らせます。", caution: "通常ガード後に大きな反撃が確定するとは限りません。下段との使い分けにも注意します。", source: "https://www.streetfighter.com/6/buckler/ja-jp/fight/character/ryu", search: ["鎖骨割り", "中段", "立ちガード"] },
  { id: "T013", title: "リュウの中足ラッシュ後は択を分けて守る", scope: "全キャラ共通候補", why: "中足キャンセルからのドライブラッシュで、打撃・中段・投げが迫ります。", action: "中足をガードしたら、ラッシュ後の動きを見て立ち・しゃがみを切り替えます。投げを警戒する場面では後退や遅らせ防御も候補にし、同じ防御に固定しません。", benefit: "下段をガードした後も次の択を意識でき、単一の防御を読まれるのを防げます。", caution: "技の見た目やラッシュ距離で選択肢は変わります。練習モードでリュウの代表的な択を再現してください。", source: "https://www.streetfighter.com/6/buckler/ja-jp/fight/character/ryu", search: ["中足", "ドライブラッシュ", "中段", "投げ", "下段"] },
  { id: "T014", title: "電刃錬気は距離を見て止めるか接近", scope: "全キャラ共通候補", why: "リュウに電刃錬気を許すと、強化された波動拳・波掌撃を使われる可能性があります。", action: "技後の距離とこちらの前進速度を見て、届く時だけ踏み込みや牽制で中断を狙います。遠い時は無理に飛び込まず、強化弾へのパリィ準備をします。", benefit: "強化状態を一方的に許しにくくし、危険な距離での飛び込みも避けられます。", caution: "中断できる距離・タイミングは位置や起き上がり状況で変わります。確定で止められると誤認しないでください。", source: "https://www.streetfighter.com/6/buckler/ja-jp/fight/character/ryu", search: ["電刃錬気", "電刃", "強化", "起き攻め"] },
  { id: "T015", title: "リュウのドライブラッシュ中段を警戒", scope: "全キャラ共通候補", why: "ドライブラッシュからの中段をしゃがみ続けるとヒットし、投げだけを警戒すると打撃に負けます。", action: "ラッシュ開始を見たら頭上の攻撃を警戒し、相手が止まる位置で立ちガードへ切り替えます。下段や投げの選択肢もあるため、相手の頻度を見て防御を変えます。", benefit: "ラッシュ後の中段を通されにくくし、相手の攻め方を観察する時間が作れます。", caution: "すべてのラッシュ攻撃が中段ではありません。立ちっぱなしにもせず、択の傾向を見ます。", source: "https://www.streetfighter.com/6/buckler/ja-jp/fight/character/ryu", search: ["ドライブラッシュ", "中段", "対策", "固め"] },
  { id: "T016", title: "投げとシミーを遅らせ防御で見分ける", scope: "全キャラ共通候補", why: "起き上がりに早く投げ抜けを入力すると、後退して投げ抜けを空振りさせるシミーに反撃されます。", action: "毎回早い投げ抜けをせず、状況に応じてガード・遅らせ投げ抜け・後退を選びます。相手が投げを多用するか、投げ抜けを誘うかを記録します。", benefit: "投げと投げ抜け狩りの両方に対して、同じ行動を読まれにくくできます。", caution: "遅らせ防御も打撃重ねには負けることがあります。起き上がり状況と相手の癖を合わせて判断します。", source: "https://www.streetfighter.com/6/buckler/ja-jp/fight/character/ryu", search: ["投げ", "シミー", "投げ抜け", "起き攻め"] },
  { id: "T017", title: "SAをガードした後に反撃する", scope: "全キャラ共通候補", why: "大技をガードしても、距離や相殺の影響を考えず反撃すると届かず、反対に攻め直される場合があります。", action: "SAをガードし終えたことを確認し、リュウとの距離に届く反撃を選びます。弾の相殺や連続攻撃の最終段までガードします。", benefit: "大きな技をしのいだ後の反撃機会を活用しつつ、途中で動いて被弾するミスを減らせます。", caution: "SAの種類・ヒット数・距離で反撃が変わるため、技別の確認が必要です。", source: "https://www.streetfighter.com/6/buckler/ja-jp/fight/character/ryu", search: ["SA", "真空波動拳", "真・波掌撃", "真・昇龍拳", "ガード後"] },
  { id: "T018", title: "ドライブリバーサルをガードしたら反撃", scope: "全キャラ共通候補", why: "切り返しをガードできると、相手のドライブを使わせた上で反撃できる可能性があります。", action: "固め中に反撃技を出し切らず、ドライブリバーサルをガードする選択肢を持ちます。ガードできたら距離に応じた反撃を返します。", benefit: "こちらの攻めを維持しながら相手のゲージを消費させ、反撃の機会を得られます。", caution: "ガード時の硬直差と反撃の届き方は現行Patchで要確認です。", source: "https://www.streetfighter.com/6/buckler/ja-jp/fight/character/ryu", search: ["ドライブリバーサル", "ガード", "反撃", "ドライブゲージ"] },
];

export function projectRyuCounterPreviewCards(): StrategyCardView[] {
  return candidates.map((card) => ({
    id: `ryu-counter-${card.id.toLowerCase()}`,
    kind: "counter",
    title: card.title,
    category: card.scope,
    categoryLabel: card.scope,
    searchTerms: card.search,
    content: <article className={styles.card} data-card-id={card.id}>
      <span className={styles.scope}>{card.scope}</span>
      <h3>{card.title}</h3>
      <details>
        <summary>理由・対策・利点を見る</summary>
        <dl>
          <div><dt>対策が必要な理由</dt><dd>{card.why}</dd></div>
          <div><dt>対策</dt><dd>{card.action}</dd></div>
          <div><dt>対策の利点</dt><dd>{card.benefit}</dd></div>
          <div><dt>注意点</dt><dd>{card.caution}</dd></div>
        </dl>
        <p className={styles.source}>情報源候補：<a href={card.source} target="_blank" rel="noopener noreferrer">技データ・攻略記事を確認 ↗</a></p>
      </details>
    </article>,
  }));
}

export function RyuCounterPreviewNotice() {
  return <div className={styles.notice} role="note">
    <strong>リュウ対策カード候補・Preview</strong>
    <p>2026年8月3日更新の資料候補などをもとにした下書きです。現行Patch・実機検証は未完了のため、公開用の攻略データではありません。技名を検索するか、「全キャラ共通候補」「キャミィ専用技の候補」で絞り込めます。</p>
  </div>;
}
