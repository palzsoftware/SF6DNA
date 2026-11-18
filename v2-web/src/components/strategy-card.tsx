import type { ReactNode } from "react";
import type { CardRecipe } from "../lib/card-command-gauge-contract";
import styles from "./strategy-card.module.css";

export type StrategyCardKind = "combo" | "setplay" | "sequence" | "counter";
const KIND_LABEL: Record<StrategyCardKind, { command: string; body: string }> = {
  combo: { command: "コンボコマンド", body: "コンボ解説" },
  setplay: { command: "セットプレイ手順", body: "セットプレイ解説" },
  sequence: { command: "連携コマンド", body: "連携解説" },
  counter: { command: "対策コマンド", body: "対策解説" },
};

export type StrategyCardMedia = { type: "gif" | "webp" | "video"; url: string; posterUrl?: string | null; loop?: boolean; credit?: string | null };

/** Japanese move-name route ("しゃがみ中P → 強フラッシュナックル") from a verified recipe; never guessed. */
export function japaneseRouteFromRecipe(recipe: CardRecipe | null | undefined): string | null {
  const names = (recipe?.steps ?? []).map(step => step.move_name?.trim()).filter((name): name is string => Boolean(name));
  return names.length ? names.join(" → ") : null;
}

/**
 * Shared strategy card (combo / setplay / sequence / counter).
 * Fixed order: 1 name+category, 2 demo GIF, 3 facts, 4 command icons, 5 Japanese route,
 * 6 explanation, 7 conditions/patch/sources (collapsible). Presentation only: it never decides publication.
 */
export function StrategyCard({ kind, title, category, control, media, mediaAction, facts, commandIcons, commandJa, body, details, detailsExtra }: {
  kind: StrategyCardKind;
  title: string;
  category: string;
  control?: string | null;
  media?: StrategyCardMedia | null;
  mediaAction?: ReactNode;
  facts: readonly (readonly [string, string])[];
  commandIcons?: ReactNode;
  commandJa?: string | null;
  body?: string | null;
  details: readonly (readonly [string, ReactNode])[];
  detailsExtra?: ReactNode;
}) {
  const labels = KIND_LABEL[kind];
  return (
    <article className={styles.card} data-strategy-kind={kind}>
      <header className={styles.head}>
        <div className={styles.meta}><span>{category}</span>{control ? <span className={styles.control}>{control}</span> : null}</div>
        <h3 className={styles.title}>{title}</h3>
      </header>

      {media ? (
        <div className={styles.media}>
          {media.type === "video" ? (
            <video controls playsInline loop={media.loop} muted={media.loop} preload="none" poster={media.posterUrl ?? undefined}><source src={media.url} /></video>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- demo media can be GIF/WebP and is not an optimized asset.
            <img src={media.url} alt={`${title}の実演`} width="960" height="540" loading="lazy" />
          )}
          {mediaAction ? <div className={styles.mediaAction}>{mediaAction}</div> : null}
          {media.credit ? <span className={styles.credit}>{media.credit}</span> : null}
        </div>
      ) : (
        <div className={styles.mediaPending}><span>実演GIF追加予定</span>{mediaAction ? <div className={styles.pendingAction}>{mediaAction}</div> : null}</div>
      )}

      <dl className={styles.facts}>
        {facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
      </dl>

      <section className={styles.block} aria-label={labels.command}>
        <h4>{labels.command}</h4>
        <div className={styles.icons}>{commandIcons ?? <span className={styles.muted}>コマンド確認中</span>}</div>
        <p className={styles.route}>{commandJa ?? "技名表記確認中"}</p>
      </section>

      <section className={styles.block} aria-label={labels.body}>
        <h4>{labels.body}</h4>
        <p className={styles.body}>{body ?? "解説は追加予定です。"}</p>
      </section>

      <details className={styles.details}>
        <summary>成立条件・詳細情報</summary>
        <dl>{details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        {detailsExtra}
      </details>
    </article>
  );
}
