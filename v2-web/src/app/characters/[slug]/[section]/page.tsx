import Link from "next/link";
import { notFound } from "next/navigation";
import { CharacterTabs } from "@/components/character-tabs";
import { listCharacterSectionItems } from "@/lib/character-sections";
import {
  appendDevicePreviewToken,
  getDevicePreviewMoveCommands,
  isDevicePreviewRequest,
  normalizeDevicePreviewToken,
  type DevicePreviewMoveCommand,
} from "@/lib/device-preview";
import { getCharacterBySlug } from "@/lib/characters";
import {
  listMoveMotionMediaForCharacter,
  type MoveMotionMedia,
} from "@/lib/move-motion-media";
import {
  CHARACTER_SECTION_KEYS,
  type CharacterSectionKey,
} from "@/types/character";
import styles from "./page.module.css";

const sectionMeta: Record<Exclude<CharacterSectionKey, "overview">, { title: string; description: string }> = {
  moves: {
    title: "技・フレーム",
    description: "技名・コマンド・モーション・重要フレームを一覧で確認し、必要なときだけ詳細を開けます。",
  },
  combos: {
    title: "コンボ",
    description: "基本・中央・画面端・確反・SA・リーサルなど目的別のコンボを確認できます。",
  },
  setups: {
    title: "セットプレイ",
    description: "起き攻め、セットプレイと条件・対処方法を確認できます。",
  },
  sequences: {
    title: "連携",
    description: "攻め継続、連携手順、割り込み・投げ・シミーなどの対応関係を確認できます。",
  },
  matchups: {
    title: "対策",
    description: "キャラ対策、技対策、連携対策と自キャラ側の回答を確認できます。",
  },
  training: {
    title: "トレーニング",
    description: "トレモの設定、練習手順、成功条件を確認できます。",
  },
  players: {
    title: "参考プレイヤー",
    description: "このキャラクターを使用するプロ、強豪、専門プレイヤーを確認できます。",
  },
  videos: {
    title: "関連動画",
    description: "攻略、コンボ、対策、大会試合など関連動画を確認できます。",
  },
};

const tokenLabels: Record<string, string> = {
  normal: "通常技",
  unique: "特殊技",
  special: "必殺技",
  super: "スーパーアーツ",
  throw: "投げ",
  command_throw: "コマンド投げ",
  basic: "基本",
  punish: "確定反撃",
  anti_air: "対空",
  corner: "画面端",
  midscreen: "中央",
  mid_screen: "中央",
  offense: "攻め",
  defense: "守り",
  matchup: "対策",
  beginner: "初心者向け",
  intermediate: "中級者向け",
  advanced: "上級者向け",
};

const stateLabels: Record<string, string> = {
  draft: "下書き",
  reviewed: "レビュー済み",
  verified: "検証済み",
  unverified: "未検証",
  published: "公開済み",
};

const commandSchemeLabels: Record<string, string> = {
  classic: "Classic",
  modern: "Modern",
};

const officialMovelistUrls: Record<string, string> = {
  ryu: "https://www.streetfighter.com/6/ja-jp/character/ryu/movelist",
};

type DisplayMeta = {
  preview: boolean;
  kind: string | null;
  stats: Array<{ label: string; value: string }>;
  chips: string[];
  internal: string[];
};

function withFrame(value: string) {
  return /F$/i.test(value) ? value : `${value}F`;
}

function parseMeta(meta: string | null): DisplayMeta {
  const result: DisplayMeta = { preview: false, kind: null, stats: [], chips: [], internal: [] };
  if (!meta) return result;

  for (const rawPart of meta.split(" / ").map((part) => part.trim()).filter(Boolean)) {
    if (rawPart === "未公開プレビュー") {
      result.preview = true;
      continue;
    }

    if (stateLabels[rawPart]) {
      result.internal.push(stateLabels[rawPart]);
      continue;
    }

    const startup = rawPart.match(/^発生\s+(.+)$/);
    if (startup) {
      result.stats.push({ label: "発生", value: withFrame(startup[1]) });
      continue;
    }

    const guard = rawPart.match(/^G\s+(.+)$/);
    if (guard) {
      result.stats.push({ label: "ガード", value: withFrame(guard[1]) });
      continue;
    }

    const damage = rawPart.match(/^(\d+)\s*dmg$/i);
    if (damage) {
      result.stats.push({ label: "ダメージ", value: damage[1] });
      continue;
    }

    const drive = rawPart.match(/^D\s+(.+)$/);
    if (drive) {
      result.stats.push({ label: "Dゲージ", value: drive[1] });
      continue;
    }

    const sa = rawPart.match(/^SA\s+(.+)$/);
    if (sa) {
      result.stats.push({ label: "SAゲージ", value: sa[1] });
      continue;
    }

    const difficulty = rawPart.match(/^難易度\s+(.+)$/);
    if (difficulty) {
      result.stats.push({ label: "難易度", value: difficulty[1] });
      continue;
    }

    if (/^\d+分$/.test(rawPart)) {
      result.stats.push({ label: "目安", value: rawPart });
      continue;
    }

    const localized = tokenLabels[rawPart] ?? null;
    if (localized && !result.kind) {
      result.kind = localized;
      continue;
    }

    result.chips.push(localized ?? rawPart.replaceAll("_", " "));
  }

  return result;
}

function displaySubtitle(subtitle: string | null, previewActive: boolean) {
  if (!subtitle) return null;
  if (previewActive && subtitle.trim() === "Awaiting official/game verification before publication.") {
    return null;
  }
  return subtitle;
}

function commandPrimary(command: DevicePreviewMoveCommand) {
  return command.commandText ?? command.numericNotation ?? command.buttonNotation ?? null;
}

function commandSecondary(command: DevicePreviewMoveCommand) {
  if (!command.numericNotation) return null;
  if (command.commandText?.trim() === command.numericNotation.trim()) return null;
  return command.numericNotation;
}

function isSection(value: string): value is Exclude<CharacterSectionKey, "overview"> {
  return value !== "overview" && CHARACTER_SECTION_KEYS.includes(value as CharacterSectionKey);
}

function renderMotion(media: MoveMotionMedia, title: string) {
  if (media.mediaType === "gif") {
    return (
      <img
        alt={`${title}のモーション`}
        className={styles.motionMedia}
        loading="lazy"
        src={media.mediaUrl}
      />
    );
  }

  return (
    <video
      className={styles.motionMedia}
      controls
      loop
      muted
      playsInline
      poster={media.posterUrl ?? undefined}
      preload="none"
    >
      <source src={media.mediaUrl} />
      このブラウザでは動画を再生できません。
    </video>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; section: string }> }) {
  const { slug, section } = await params;
  if (!isSection(section)) return {};
  const character = await getCharacterBySlug(slug);
  if (!character) return {};
  return {
    title: `${character.name} ${sectionMeta[section].title} | SF6DNA`,
    description: `${character.name}の${sectionMeta[section].description}`,
  };
}

export default async function CharacterSectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; section: string }>;
  searchParams: Promise<{ preview?: string | string[] }>;
}) {
  const [{ slug, section }, query] = await Promise.all([params, searchParams]);
  if (!isSection(section)) notFound();

  const previewToken = normalizeDevicePreviewToken(query.preview);
  const character = await getCharacterBySlug(slug, previewToken);
  if (!character) notFound();

  const meta = sectionMeta[section];
  const previewActive = isDevicePreviewRequest(previewToken);
  const [items, previewCommands, motionMedia] = await Promise.all([
    listCharacterSectionItems(character.id, section, previewToken),
    section === "moves" && previewActive
      ? getDevicePreviewMoveCommands(character.id, previewToken)
      : Promise.resolve([] as DevicePreviewMoveCommand[]),
    section === "moves"
      ? listMoveMotionMediaForCharacter(character.id, previewToken)
      : Promise.resolve([] as MoveMotionMedia[]),
  ]);

  const commandsByMove = new Map<string, DevicePreviewMoveCommand[]>();
  for (const command of previewCommands) {
    const list = commandsByMove.get(command.moveId) ?? [];
    list.push(command);
    commandsByMove.set(command.moveId, list);
  }

  const mediaByMove = new Map<string, MoveMotionMedia[]>();
  for (const media of motionMedia) {
    const list = mediaByMove.get(media.moveId) ?? [];
    list.push(media);
    mediaByMove.set(media.moveId, list);
  }

  const officialMovelistUrl = officialMovelistUrls[character.slug] ?? null;

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">{character.name}</p>
        <h1>{meta.title}</h1>
        <p>{meta.description}</p>
      </section>

      {previewActive ? (
        <aside className={styles.previewNotice}>
          <strong>実機確認プレビュー</strong>
          <span>未公開データを確認用に表示しています。DBの公開状態は変更していません。</span>
        </aside>
      ) : null}

      <CharacterTabs slug={character.slug} active={section} previewToken={previewToken} />

      {items.length ? (
        <section className={styles.dataGrid} aria-label={`${character.name} ${meta.title}`}>
          {items.map((item) => {
            const display = parseMeta(item.meta);
            const subtitle = displaySubtitle(item.subtitle, previewActive);
            const commands = section === "moves" ? (commandsByMove.get(item.id) ?? []) : [];
            const moveMedia = section === "moves" ? (mediaByMove.get(item.id) ?? []) : [];
            const primaryMotion = moveMedia[0] ?? null;
            const hasClassic = commands.some((command) => command.scheme === "classic");
            const hasModern = commands.some((command) => command.scheme === "modern");

            return (
              <article className={styles.dataCard} key={item.id}>
                <div className={styles.cardTop}>
                  <div className={styles.cardTitleBlock}>
                    {display.kind ? <span className={styles.kind}>{display.kind}</span> : null}
                    <strong className={styles.title}>{item.title}</strong>
                  </div>
                  {display.preview ? <span className={styles.previewBadge}>未公開・確認用</span> : null}
                </div>

                {commands.length ? (
                  <div className={styles.commands} aria-label={`${item.title} コマンド`}>
                    {commands.map((command, index) => {
                      const primary = commandPrimary(command);
                      const secondary = commandSecondary(command);
                      if (!primary) return null;
                      return (
                        <div className={styles.commandRow} key={`${command.scheme}-${command.sortOrder ?? index}-${index}`}>
                          <span className={styles.commandScheme}>{commandSchemeLabels[command.scheme] ?? command.scheme}</span>
                          <span className={styles.commandContent}>
                            <strong className={styles.commandText}>{primary}</strong>
                            {secondary ? <code className={styles.numericNotation}>{secondary}</code> : null}
                            {command.conditionText ? <small className={styles.commandCondition}>{command.conditionText}</small> : null}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                {section === "moves" && hasClassic && !hasModern ? (
                  <div className={styles.modernUnavailable} role="note">
                    <strong>注意</strong>
                    <span>モダン操作ではこの技を使用できません。</span>
                  </div>
                ) : null}

                {section === "moves" ? (
                  primaryMotion ? (
                    <div className={styles.motionBlock}>
                      <span className={styles.motionLabel}>技モーション</span>
                      {renderMotion(primaryMotion, item.title)}
                      {(primaryMotion.sourceUrl || primaryMotion.sourceLabel) ? (
                        <div className={styles.motionSource}>
                          <span>{primaryMotion.sourceLabel ?? "モーション出典"}</span>
                          {primaryMotion.sourceUrl ? (
                            <a href={primaryMotion.sourceUrl} rel="noreferrer" target="_blank">出典を開く ↗</a>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className={styles.motionFallback}>
                      <span>
                        <strong>技モーション</strong>
                        <small>GIF / 短尺動画は準備中です。</small>
                      </span>
                      {officialMovelistUrl ? (
                        <a href={officialMovelistUrl} rel="noreferrer" target="_blank">CAPCOM公式で動きを確認 ↗</a>
                      ) : null}
                    </div>
                  )
                ) : null}

                {subtitle ? <p className={styles.summary}>{subtitle}</p> : null}

                {display.stats.length ? (
                  <div className={styles.stats}>
                    {display.stats.map((stat) => (
                      <span className={styles.stat} key={`${stat.label}-${stat.value}`}>
                        <span className={styles.statLabel}>{stat.label}</span>
                        <span className={styles.statValue}>{stat.value}</span>
                      </span>
                    ))}
                  </div>
                ) : null}

                {display.chips.length ? (
                  <div className={styles.chips}>
                    {display.chips.map((chip) => <span className={styles.chip} key={chip}>{chip}</span>)}
                  </div>
                ) : null}

                <div className={styles.cardFooter}>
                  {previewActive && display.internal.length ? (
                    <span className={styles.internalState}>確認状態: {display.internal.join("・")}</span>
                  ) : <span />}
                  <Link className={styles.more} href={appendDevicePreviewToken(item.href, previewToken)}>詳細を見る →</Link>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="empty-state">
          <h2>公開済みデータはまだありません</h2>
          <p>出典・パッチ・検証状態を確認できたデータから公開します。</p>
        </section>
      )}
    </div>
  );
}
