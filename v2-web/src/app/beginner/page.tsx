import type { Metadata } from "next";
import Link from "next/link";
import { VisualIcon } from "@/components/visual-icon";
import { beginnerSteps, beginnerGlossary, beginnerSources, type BeginnerStep } from "./content";
import styles from "./page.module.css";
import { BeginnerMedia } from "./media";

export const metadata: Metadata = {
  title: "スト6を始めたら、まずこれ",
  description: "移動・ガード・対空から、インパクトとラッシュの違いまで。Street Fighter 6の基本を図解で少しずつ覚え、実戦・診断・今日の15分練習につなげます。",
};

function Flow({ items }: { items: readonly string[] }) {
  return <ol className={styles.flow}>{items.map((item, index) => <li key={item}><span className={styles.node}>{index + 1}</span><span>{item}</span></li>)}</ol>;
}

function Diagram({ step }: { step: BeginnerStep }) {
  if (step.id === "move") return <figure className={styles.diagram}><div className={styles.movement}><span className={styles.fighter}>自分</span><div className={styles.directionPad}><span><kbd>↑</kbd>ジャンプ</span><span><kbd>←</kbd>後ろ</span><span><kbd>→</kbd>前</span><span><kbd>↓</kbd>しゃがみ</span></div><span className={styles.opponent}>相手</span></div><figcaption>相手が右側にいるとき</figcaption></figure>;
  if (step.id === "guard") return <figure className={styles.diagram}><div className={styles.guardRows}><div><kbd>←</kbd><strong>立ちガード</strong><span>ジャンプ攻撃・中段</span></div><div><kbd>↙</kbd><strong>しゃがみガード</strong><span>下段</span></div></div><figcaption>ガード方向を使い分ける。投げは別の選択肢。</figcaption></figure>;
  if (step.id === "normal") return <figure className={styles.diagram}><div className={styles.attackKeys}>{["弱", "中", "強"].map((strength) => <span key={strength}><b>{strength}</b><small>立ち / しゃがみ</small></span>)}</div><figcaption>距離と使いやすさを見比べる</figcaption></figure>;
  if (step.id === "throw") return <figure className={styles.diagram}><div className={styles.closeRange}><span className={styles.fighter}>自分</span><span className={styles.rangeMark}>近距離</span><span className={styles.opponent}>相手</span></div><figcaption>ガードを続ける相手には、通常投げも選択肢</figcaption></figure>;
  if (step.id === "anti-air") return <figure className={styles.diagram}><div className={styles.airDiagram}><svg viewBox="0 0 260 90" fill="none" aria-hidden="true" focusable="false"><path d="M220 65Q155 -12 85 54" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5"/><circle cx="146" cy="22" r="10" stroke="currentColor" strokeWidth="3"/><path d="M50 75L92 39m-17 5 17-5-4 17" stroke="currentColor" strokeWidth="4"/><path d="M12 78H247" stroke="currentColor" strokeWidth="1"/></svg><span>飛んでくる相手</span><b>自分の対空技</b></div><figcaption>迎え撃つ技を1つ決める</figcaption></figure>;
  if (step.id === "impact") return <figure className={`${styles.diagram} ${styles.impactDiagram}`}><div className={styles.impactSymbol}><b>DI</b><span>受け止めて攻撃</span></div><Flow items={["相手のDI", "動ける状態で自分もDI", "間に合えば返せる"]}/><figcaption>「移動」のラッシュとは別のシステム</figcaption></figure>;
  if (step.id === "parry") return <figure className={`${styles.diagram} ${styles.parryDiagram}`}><div className={styles.parrySymbol}><VisualIcon kind="check"/><b>PARRY</b><span>攻撃を受け止める</span></div><figcaption>クラシック：中P＋中K / モダン：パリィボタン</figcaption></figure>;
  if (step.id === "rush") return <figure className={`${styles.diagram} ${styles.rushDiagram}`}><Flow items={["パリィの構え", "前を素早く2回", "相手に近づく"]}/><figcaption>DR = パリィから始めるラッシュ</figcaption></figure>;
  if (step.id === "cancel-rush") return <figure className={`${styles.diagram} ${styles.rushDiagram}`}><Flow items={["対応する通常技を当てる", "キャンセル中に前を2回", "次の攻撃を狙う"]}/><figcaption>CDR = 技から始めるラッシュ。続く攻撃の成立は技ごとに確認。</figcaption></figure>;
  if (step.id === "super") return <figure className={styles.diagram}><div className={styles.attackKeys}>{["SA1", "SA2", "SA3"].map((level) => <span key={level}><b>{level}</b><small>キャラごとの技</small></span>)}</div><figcaption>SAゲージとコマンドを確認</figcaption></figure>;
  if (step.id === "combo") return <figure className={styles.diagram}><Flow items={["ゲーム内トライアル", "短いコンボを1つ", "実戦で1回試す"]}/><figcaption>自分のキャラ・操作タイプに合わせて選ぶ</figcaption></figure>;
  return <figure className={styles.diagram}><Flow items={["倒された", "起き上がりにガード", "相手の攻めを見て考える"]}/><figcaption>ガードだけで全部防げるわけではありません</figcaption></figure>;
}

function StepContent({ step }: { step: BeginnerStep }) {
  return <div className={styles.stepBody}><p className={styles.description}>{step.description}</p><Diagram step={step}/><div className={styles.tryRow}><p className={styles.tryThis}><VisualIcon kind="training"/><span><strong>まず試す</strong>{step.tryThis}</span></p></div>{step.media ? <BeginnerMedia id={step.media}/> : null}<p className={styles.caution}>{step.caution}</p>{step.id === "anti-air" || step.id === "combo" ? <Link className={styles.textLink} href="/characters">使うキャラの特徴と技を見る <span aria-hidden="true">↗</span></Link> : null}</div>;
}

export default function BeginnerPage() {
  const firstSteps = beginnerSteps.slice(0, 5);
  const laterSteps = beginnerSteps.slice(5, 10);
  const closingSteps = beginnerSteps.slice(10);
  return <div className={`site-shell ${styles.page}`}>
    <header className={styles.hero}>
      <div><p className="eyebrow">BEGINNER QUICK START</p><h1>スト6を始めたら、<br/><span>まずこれ。</span></h1><p className={styles.lead}>今日は、動く・守る・ジャンプを落とす。<br/>1つ試せたら、対戦へ。全部覚えなくて大丈夫。</p><div className={styles.heroActions}><a className="button-primary" href="#move">最初の一歩から</a><a className="button-secondary" href="#first-match">対戦前のチェックへ</a></div></div>
      <div className={styles.heroVisual} aria-label="学んで、試して、振り返って、練習する"><span className={styles.dnaLine} aria-hidden="true"/><div><b>LEARN</b><span>まず1つ</span></div><div><b>TRY</b><span>対戦で試す</span></div><div><b>DIAGNOSE</b><span>課題を見つける</span></div><div><b>PRACTICE</b><span>15分練習</span></div></div>
    </header>
    <aside className={styles.startNote}><VisualIcon kind="attention"/><p>ゲームを開いたら、使うキャラと操作タイプを選び、ボタン設定を確認。操作に迷ったら、ゲーム内チュートリアルも使えます。</p></aside>
    <nav className={styles.jumpNav} aria-label="初心者ガイドの目次"><a href="#first-basics">まずはここから</a><a href="#drive-systems">システムを知る</a><a href="#combo">コンボと起き上がり</a><a href="#first-match">実戦へ</a></nav>
    <section id="first-basics" className={styles.group} aria-labelledby="basics-heading"><div className={styles.groupHeading}><p className="eyebrow">FIRST STEPS / 01–05</p><h2 id="basics-heading">まずは、動く・守る。</h2><p>ここから1つ選んで試すだけでも、今日の一歩です。</p></div><div className={styles.stepGrid}>{firstSteps.map((step, index) => <article className={styles.step} id={step.id} key={step.id}><div className={styles.stepHeading}><span className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</span><div><p>{step.label}</p><h3>{step.title}</h3></div></div><StepContent step={step}/></article>)}</div></section>
    <section id="drive-systems" className={styles.group} aria-labelledby="systems-heading"><div className={styles.groupHeading}><p className="eyebrow">NEXT / 06–10</p><h2 id="systems-heading">システムは、1つずつ。</h2><p>慣れてからで大丈夫。気になる項目を開いてみましょう。</p></div><p className={styles.caution}>Driveゲージが空の「バーンアウト」中は、ゲージが回復しきるまでDrive系の操作を使えません。</p><div className={styles.systemKey} aria-label="インパクトとラッシュの違い"><span><b>DI</b>受け止めて打つ</span><span><b>DR</b>パリィから近づく</span><span><b>CDR</b>技から近づく</span></div><div className={styles.systems}>{laterSteps.map((step, index) => <details className={styles.system} id={step.id} key={step.id} data-system={step.label}><summary><span className={styles.stepNumber}>{String(index + 6).padStart(2, "0")}</span><h3>{step.title}</h3><span className={styles.summaryLabel}>{step.label}</span></summary><StepContent step={step}/></details>)}</div></section>
    <section className={styles.group} aria-labelledby="practice-heading"><div className={styles.groupHeading}><p className="eyebrow">PUT IT TO USE / 11–12</p><h2 id="practice-heading">攻めは1つ、守りは落ち着いて。</h2></div><div className={styles.stepGrid}>{closingSteps.map((step, index) => <article className={styles.step} id={step.id} key={step.id}><div className={styles.stepHeading}><span className={styles.stepNumber}>{index + 11}</span><div><p>{step.label}</p><h3>{step.title}</h3></div></div><StepContent step={step}/></article>)}</div></section>
    <section id="first-match" className={styles.match} aria-labelledby="match-heading"><p className="eyebrow">TRY A MATCH</p><h2 id="match-heading">全部できなくても、対戦へ。</h2><p>今日はこの中から1つだけ。CPU戦や、気軽に遊べる対戦で試しましょう。</p><ul className={styles.checklist}>{["守る場面でガードする", "ジャンプに対空を1回狙う", "動けるときにインパクト返しを狙う", "練習した攻撃を1回使う", "終わったら、困った場面を1つ思い出す"].map((item) => <li key={item}><VisualIcon kind="check"/>{item}</li>)}</ul><div className={styles.nextActions}><Link href="/diagnosis"><VisualIcon kind="diagnosis"/><span><small>次の一歩</small><strong>課題を診断する</strong><em>対戦で困ったことを整理</em></span><span aria-hidden="true">↗</span></Link><Link href="/me/training"><VisualIcon kind="training"/><span><small>課題が決まったら</small><strong>今日の15分練習へ</strong><em>5分ずつ、3つのメニュー</em></span><span aria-hidden="true">↗</span></Link></div></section>
    <details className={styles.glossary}><summary>言葉に迷ったら：短い用語集</summary><dl>{beginnerGlossary.map(([word, definition]) => <div key={word}><dt>{word}</dt><dd>{definition}</dd></div>)}</dl></details>
    <section className={styles.sources} aria-labelledby="sources-heading"><h2 id="sources-heading">基本操作をもっと見る</h2><p>ボタン配置やキャラごとの操作は、ゲーム内リスト・公式案内で確認できます。</p><ul>{beginnerSources.map((source) => <li key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title} <span aria-hidden="true">↗</span><span className={styles.externalLabel}>（外部サイト）</span></a></li>)}</ul></section>
  </div>;
}
