import Link from "next/link";
import { notFound } from "next/navigation";
import { listTrainingLibrary } from "@/lib/knowledge";
import { releaseFeatures } from "@/lib/release-features";
import type { TrainingListItem } from "@/types/knowledge";
import styles from "./page.module.css";

export const metadata = { title: "トレーニング" };

const typeLabels: Record<string, string> = {
  anti_air: "対空",
  reaction: "反応",
  punish: "確定反撃",
  defense: "守り",
  offense: "攻め",
  pressure: "固め・攻め継続",
  oki: "起き攻め",
  confirm: "ヒット確認",
  combo: "コンボ",
  combo_confirm: "コンボ確認",
  execution: "操作精度",
  spacing: "間合い",
  footsies: "差し合い",
  neutral: "立ち回り",
  resource: "ゲージ管理",
  decision: "判断",
  super: "SA",
  sa2: "SA2",
  setup: "セットプレイ",
  patch: "変更点確認",
  general: "基礎",
};

const levelLabels: Record<string, string> = {
  beginner: "初心者向け",
  intermediate: "中級者向け",
  advanced: "上級者向け",
  all: "全レベル",
};

function labelFor(value: string | null, labels: Record<string, string>) {
  if (!value) return null;
  return labels[value] ?? value;
}

function TrainingCard({ item }: { item: TrainingListItem }) {
  const type = labelFor(item.trainingType, typeLabels);
  const level = labelFor(item.level, levelLabels);

  return (
    <Link className={styles.card} href={`/training/${item.slug}`}>
      <div className={styles.cardTop}>
        <div className={styles.badges}>
          {type ? <span className={styles.badge}>{type}</span> : null}
          {level ? <span className={styles.badge}>{level}</span> : null}
        </div>
        <span className={styles.more}>詳細を見る →</span>
      </div>
      <strong className={styles.cardTitle}>{item.title}</strong>
      {item.summary ? <p className={styles.cardSummary}>{item.summary}</p> : null}
      <div className={styles.cardMeta}>
        {item.durationMinutes ? <span className={styles.meta}>目安 {item.durationMinutes}分</span> : <span />}
        {item.characterName ? <span className={styles.meta}>{item.characterName}</span> : <span className={styles.meta}>全キャラ共通</span>}
      </div>
    </Link>
  );
}

export default async function TrainingPage() {
  if (!releaseFeatures.training) notFound();
  const items = await listTrainingLibrary();
  const common = items.filter((item) => !item.characterSlug);
  const characterSpecific = items.filter((item) => item.characterSlug);

  const grouped = new Map<string, { slug: string; name: string; items: TrainingListItem[] }>();
  for (const item of characterSpecific) {
    if (!item.characterSlug || !item.characterName) continue;
    const current = grouped.get(item.characterSlug) ?? {
      slug: item.characterSlug,
      name: item.characterName,
      items: [],
    };
    current.items.push(item);
    grouped.set(item.characterSlug, current);
  }

  const characterGroups = [...grouped.values()].sort((a, b) =>
    a.name.localeCompare(b.name, "ja")
  );

  return (
    <div className="site-shell page-stack">
      <section className="hero">
        <p className="eyebrow">TRAINING</p>
        <h1>トレーニング</h1>
        <p>最初に共通基礎を固め、その後に使用キャラ固有の実戦メニューへ進める構成です。検証済み・公開済みのメニューだけを表示します。</p>
      </section>

      <section className={styles.overview} aria-label="トレーニングの種類">
        <a className={styles.overviewCard} href="#common-training">
          <div className={styles.overviewTop}>
            <span className={styles.overviewTitle}>共通基礎</span>
            <span className={styles.count}>{common.length}件</span>
          </div>
          <p>対空、DI反応、確定反撃、ゲージ管理など、どのキャラでも必要になる土台を練習します。</p>
        </a>
        <a className={styles.overviewCard} href="#character-training">
          <div className={styles.overviewTop}>
            <span className={styles.overviewTitle}>キャラ別実践</span>
            <span className={styles.count}>{characterSpecific.length}件</span>
          </div>
          <p>固有技、リソース、起き攻め、立ち回りなど、使用キャラごとに実戦で再現するメニューです。</p>
        </a>
      </section>

      <section className={styles.section} id="common-training">
        <header className={styles.sectionHeader}>
          <h2>共通基礎</h2>
          <p className={styles.sectionLead}>キャラを変えても使い続ける基本練習です。迷った場合はここから始めます。</p>
        </header>
        {common.length ? (
          <div className={styles.grid}>
            {common.map((item) => <TrainingCard item={item} key={item.id} />)}
          </div>
        ) : (
          <div className={styles.empty}>
            <strong>公開準備中です。</strong>
            <p>検証が完了した共通基礎メニューから順に表示されます。</p>
          </div>
        )}
      </section>

      <section className={styles.section} id="character-training">
        <header className={styles.sectionHeader}>
          <h2>キャラ別実践</h2>
          <p className={styles.sectionLead}>使用キャラを選び、そのキャラで必要になる操作・判断・状況再現を練習します。</p>
        </header>
        {characterGroups.length ? (
          <div className={styles.characterGroups}>
            {characterGroups.map((group) => (
              <section className={styles.characterGroup} key={group.slug}>
                <header className={styles.characterHeader}>
                  <h3>{group.name}</h3>
                  <span className={styles.characterCount}>{group.items.length}メニュー</span>
                </header>
                <div className={styles.grid}>
                  {group.items.map((item) => <TrainingCard item={item} key={item.id} />)}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <strong>公開準備中です。</strong>
            <p>検証が完了したキャラ別実践メニューから順に表示されます。</p>
          </div>
        )}
      </section>
    </div>
  );
}
