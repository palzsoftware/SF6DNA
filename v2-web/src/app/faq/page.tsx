export const metadata = { title: "FAQ" };

const items = [
  ["SF6DNAの攻略情報はすべて確定情報ですか？", "いいえ。DB内部にはdraft・reviewed・unverifiedの候補データもあります。Public画面では各コンテンツの公開Gateを満たしたデータだけを表示します。"],
  ["Modern操作はClassic操作から自動変換していますか？", "していません。Modern Commandは現在の一次情報などで確認できたものだけを登録します。"],
  ["AIコーチは自由に攻略を生成しますか？", "現在はGenerationを無効化し、SF6DNA内のSource付きEvidenceを検索・提示するRetrievalを中心にしています。"],
  ["お気に入りやランク記録はアカウントに保存されますか？", "現在のマイ機能はブラウザのlocalStorageに保存されます。同じアカウントでも別端末・別ブラウザには自動同期されません。"],
  ["データはどのパッチ基準ですか？", "Patch依存データはvalid-from / valid-toを持ち、Current Patchと区別して管理します。画面上で未確認の旧データを現行値として扱わない方針です。"],
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
