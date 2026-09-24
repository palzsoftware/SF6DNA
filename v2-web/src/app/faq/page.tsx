export const metadata = { title: "FAQ" };

import { FaqBrowser, type FaqItem } from "@/components/faq-browser";
import { PUBLIC_CONTACT_EMAIL } from "@/lib/contact";

const items: FaqItem[] = [
  { category: "情報と出典", question: "SF6DNAの攻略情報はすべて確定情報ですか？", answer: "出典や対象パッチを確認できた情報を掲載しています。十分に確認できていない内容を、確定情報として掲載することはありません。" },
  { category: "情報と出典", question: "データはどのパッチ基準ですか？", answer: "パッチによって変わる情報は対象期間を分けて管理し、旧パッチの情報を現在の値として扱わない方針です。ページに対象パッチや確認状態がある場合は、あわせて確認してください。" },
  { category: "情報と出典", question: "情報の出典はどこにありますか？", answer: "各ページの情報源リンク、または情報源ページから開けます。ゲーム内での確認が必要な内容は、確かめるまで確定情報として掲載しません。" },
  { category: "操作と機能", question: "Modern操作はClassic操作から自動変換していますか？", answer: "していません。Modern操作のコマンドは、公式情報などで確認できたものだけを掲載します。確認できないものをClassic操作から推測して補うことはしません。" },
  { category: "操作と機能", question: "AIコーチは利用できますか？", answer: "AIコーチは現在公開していません。公開する場合も、SF6DNA内で出典を確認できる情報を中心に扱い、根拠が不足する攻略内容を補って断定しない方針です。" },
  { category: "操作と機能", question: "診断結果は勝率やランクを保証しますか？", answer: "保証しません。診断は回答内容から相性のよい選択肢を整理する補助機能です。実際のプレイ感や最新のゲーム内情報もあわせて判断してください。" },
  { category: "保存とアカウント", question: "お気に入りやランク記録はアカウントに保存されますか？", answer: "現在のマイ機能は、このブラウザ内に保存されます。同じアカウントでも、別端末・別ブラウザには自動同期されません。" },
  { category: "保存とアカウント", question: "ブラウザの保存データを消すとどうなりますか？", answer: "お気に入りなど、この端末のブラウザにだけ保存されているデータは消える場合があります。別の端末には自動で引き継がれません。" },
  { category: "不具合と連絡", question: "表示崩れや誤りを見つけた場合は？", answer: `フィードバックページで報告内容を整理し、${PUBLIC_CONTACT_EMAIL} へお送りください。` },
];

export default function FaqPage() {
  return (
    <div className="site-shell page-stack">
      <section className="hero"><p className="eyebrow">FAQ</p><h1>よくある質問</h1><p>掲載情報、診断、保存についての疑問をまとめました。</p></section>
      <FaqBrowser items={items} />
    </div>
  );
}
