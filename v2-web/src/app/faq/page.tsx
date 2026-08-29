export const metadata = { title: "FAQ" };

const items = [
  ["SF6DNAの攻略情報はすべて確定情報ですか？", "公開画面では、出典・対象パッチ・確認状態などの公開条件を満たした情報だけを表示します。確認が十分でない情報を、確定情報として表示することはしません。"],
  ["Modern操作はClassic操作から自動変換していますか？", "していません。Modern操作のコマンドは、公式情報などで確認できたものだけを掲載します。確認できないものをClassic操作から推測して補うことはしません。"],
  ["AIコーチは自由に攻略を生成しますか？", "現在は、SF6DNA内で出典を確認できる情報の検索・提示を中心にしています。根拠が不足している攻略内容を自由に補って断定しない設計です。"],
  ["お気に入りやランク記録はアカウントに保存されますか？", "現在のマイ機能は、このブラウザ内に保存されます。同じアカウントでも、別端末・別ブラウザには自動同期されません。"],
  ["データはどのパッチ基準ですか？", "パッチによって変わる情報は対象期間を分けて管理し、旧パッチの情報を現在の値として扱わない方針です。"],
];

export default function FaqPage() {
  return (
    <div className="site-shell page-stack">
      <section className="hero"><p className="eyebrow">FAQ</p><h1>よくある質問</h1><p>SF6DNAのデータ品質・保存・AI機能についての基本事項です。</p></section>
      <section className="guide-stack">
        {items.map(([question, answer]) => <article className="info-panel" key={question}><h2>{question}</h2><p>{answer}</p></article>)}
      </section>
    </div>
  );
}
