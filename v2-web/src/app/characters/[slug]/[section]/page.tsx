import Link from "next/link";
import { notFound } from "next/navigation";
import { CharacterTabs } from "@/components/character-tabs";
import { listCharacterSectionItems } from "@/lib/character-sections";
import {
  appendDevicePreviewToken,
  isDevicePreviewRequest,
  normalizeDevicePreviewToken,
  type DevicePreviewMoveCommand,
} from "@/lib/device-preview";
import { getCharacterBySlug } from "@/lib/characters";
import { listMoveCommandsForCharacter } from "@/lib/move-commands";
import {
  listMoveMotionMediaForCharacter,
  type MoveMotionMedia,
} from "@/lib/move-motion-media";
import {
  CHARACTER_SECTION_KEYS,
  type CharacterSectionKey,
} from "@/types/character";
import styles from "./page.module.css";
import moveStyles from "./move-list.module.css";

const sectionMeta: Record<Exclude<CharacterSectionKey, "overview">, { title: string; description: string }> = {
  moves: {
    title: "技・フレーム",
    description: "技名・コマンド・重要フレームを一覧で確認し、必要なときだけ詳細を開けます。",
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
  drive: "ドライブシステム",
  throw: "投げ",
  command_throw: "コマンド投げ",
  target_combo: "ターゲットコンボ",
  taunt: "アピール",
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

const moveKindOrder = [
  "normal",
  "unique",
  "target_combo",
  "special",
  "command_throw",
  "throw",
  "super",
  "drive",
  "taunt",
  "other",
] as const;
const moveKindLabels: Record<string, string> = {
  normal: "通常技",
  unique: "特殊技",
  special: "必殺技",
  command_throw: "コマンド投げ",
  throw: "投げ",
  super: "スーパーアーツ",
  drive: "ドライブシステム",
  target_combo: "ターゲットコンボ",
  taunt: "アピール",
  other: "その他",
};

const stateLabels: Record<string, string> = {
  draft: "下書き",
  reviewed: "内容確認済み",
  verified: "検証済み",
  unverified: "未検証",
  published: "公開済み",
};

const commandSchemeLabels: Record<string, string> = {
  classic: "クラシック",
  modern: "モダン",
};

type DisplayMeta = {
  preview: boolean;
  kind: string | null;
  stats: Array<{ label: string; value: string }>;
  chips: string[];
  internal: string[];
};

type PreparedMove = {
  item: Awaited<ReturnType<typeof listCharacterSectionItems>>[number];
  display: DisplayMeta;
  subtitle: string | null;
  commands: DevicePreviewMoveCommand[];
  media: MoveMotionMedia | null;
  hasClassic: boolean;
  hasModern: boolean;
  kindKey: string;
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

function rawMoveKind(meta: string | null) {
  if (!meta) return "other";
  const parts = meta.split(" / ").map((part) => part.trim());
  for (const key of moveKindOrder) {
    if (key !== "other" && parts.includes(key)) return key;
  }
  return "other";
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

function normalizeSearch(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim().slice(0, 80) ?? "";
}

function normalizeKind(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw && moveKindOrder.includes(raw as (typeof moveKindOrder)[number]) ? raw : "all";
}

function isSection(value: string): value is Exclude<CharacterSectionKey, "overview"> {
  return value !== "overview" && CHARACTER_SECTION_KEYS.includes(value as CharacterSectionKey);
}

function renderMotion(media: MoveMotionMedia, title: string, compact = false) {
  const mediaClass = compact ? `${styles.motionMedia} ${moveStyles.motionMediaCompact}` : styles.motionMedia;
  if (media.mediaType === "gif") {
    return (
      <img
        alt={`${title}のモーション`}
        className={mediaClass}
        height={360}
        loading="lazy"
        src={media.mediaUrl}
        width={640}
      />
    );
  }

  return (
    <video
      className={mediaClass}
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

function buildMoveFilterHref(
  slug: string,
  previewToken: string | null,
  query: string,
  kind: string
) {
  const params = new URLSearchParams();
  if (previewToken) params.set("preview", previewToken);
  if (query) params.set("q", query);
  if (kind !== "all") params.set("kind", kind);
  const suffix = params.toString();
  return `/characters/${slug}/moves${suffix ? `?${suffix}` : ""}`;
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
  searchParams: Promise<{
    preview?: string | string[];
    q?: string | string[];
    kind?: string | string[];
  }>;
}) {
  const [{ slug, section }, query] = await Promise.all([params, searchParams]);
  if (!isSection(section)) notFound();

  const previewToken = normalizeDevicePreviewToken(query.preview);
  const character = await getCharacterBySlug(slug, previewToken);
  if (!character) notFound();

  const meta = sectionMeta[section];
  const previewActive = isDevicePreviewRequest(previewToken);
  const searchQuery = section === "moves" ? normalizeSearch(query.q) : "";
  const selectedKind = section === "moves" ? normalizeKind(query.kind) : "all";

  const [items, moveCommands, motionMedia] = await Promise.all([
    listCharacterSectionItems(character.id, section, previewToken),
    section === "moves"
      ? listMoveCommandsForCharacter(character.id, previewToken)
      : Promise.resolve([] as DevicePreviewMoveCommand[]),
    section === "moves"
      ? listMoveMotionMediaForCharacter(character.id, previewToken)
      : Promise.resolve([] as MoveMotionMedia[]),
  ]);

  const commandsByMove = new Map<string, DevicePreviewMoveCommand[]>();
  for (const command of moveCommands) {
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

  const officialMovelistUrl = character.sources.find(
    (source) => source.sourceType === "official_movelist"
  )?.url ?? null;

  const preparedMoves: PreparedMove[] = section === "moves"
    ? items.map((item) => {
        const display = parseMeta(item.meta);
        const commands = commandsByMove.get(item.id) ?? [];
        const media = (mediaByMove.get(item.id) ?? [])[0] ?? null;
        return {
          item,
          display,
          subtitle: displaySubtitle(item.subtitle, previewActive),
          commands,
          media,
          hasClassic: commands.some((command) => command.scheme === "classic"),
          hasModern: commands.some((command) => command.scheme === "modern"),
          kindKey: rawMoveKind(item.meta),
        };
      })
    : [];

  const normalizedQuery = searchQuery.toLocaleLowerCase("ja");
  const filteredMoves = preparedMoves.filter((move) => {
    if (selectedKind !== "all" && move.kindKey !== selectedKind) return false;
    if (!normalizedQuery) return true;
    const searchable = [
      move.item.title,
      move.subtitle,
      ...move.commands.flatMap((command) => [
        command.commandText,
        command.numericNotation,
        command.buttonNotation,
        command.conditionText,
      ]),
    ]
      .filter((value): value is string => Boolean(value))
      .join(" ")
      .toLocaleLowerCase("ja");
    return searchable.includes(normalizedQuery);
  });

  const kindCounts = new Map<string, number>();
  for (const move of preparedMoves) {
    kindCounts.set(move.kindKey, (kindCounts.get(move.kindKey) ?? 0) + 1);
  }

  const groupedMoves = moveKindOrder.flatMap((kind) => {
    const groupItems = filteredMoves.filter((move) => move.kindKey === kind);
    return groupItems.length ? [{ kind, label: moveKindLabels[kind], items: groupItems }] : [];
  });

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">{character.name}</p>
        <h1>{meta.title}</h1>
        <p>{meta.description}</p>
        {section === "moves" && officialMovelistUrl ? (
          <div className="section-actions">
            <a className="section-action-link" href={officialMovelistUrl} rel="noopener noreferrer" target="_blank">
              CAPCOM公式ムーブリスト ↗
            </a>
          </div>
        ) : null}
      </section>

      {previewActive ? (
        <aside className={styles.previewNotice}>
          <strong>実機確認プレビュー</strong>
          <span>未公開データを確認用に表示しています。DBの公開状態は変更していません。</span>
        </aside>
      ) : null}

      <CharacterTabs slug={character.slug} active={section} previewToken={previewToken} />

      {section === "moves" && preparedMoves.length ? (
        <>
          <section className={moveStyles.moveToolbar} aria-label="技の検索と絞り込み">
            <form className={moveStyles.moveSearch} action={`/characters/${character.slug}/moves`}>
              {previewToken ? <input type="hidden" name="preview" value={previewToken} /> : null}
              {selectedKind !== "all" ? <input type="hidden" name="kind" value={selectedKind} /> : null}
              <input
                aria-label="技名またはコマンドで検索"
                defaultValue={searchQuery}
                name="q"
                placeholder="技名・コマンドで検索 例: 波動拳 / 236P"
              />
              <button type="submit">検索</button>
            </form>
            <div className={moveStyles.kindFilters} aria-label="技種別で絞り込む">
              <Link
                className={selectedKind === "all" ? moveStyles.kindFilterActive : moveStyles.kindFilter}
                href={buildMoveFilterHref(character.slug, previewToken, searchQuery, "all")}
              >
                すべて <span>{preparedMoves.length}</span>
              </Link>
              {moveKindOrder.map((kind) => {
                const count = kindCounts.get(kind) ?? 0;
                if (!count) return null;
                return (
                  <Link
                    className={selectedKind === kind ? moveStyles.kindFilterActive : moveStyles.kindFilter}
                    href={buildMoveFilterHref(character.slug, previewToken, searchQuery, kind)}
                    key={kind}
                  >
                    {moveKindLabels[kind]} <span>{count}</span>
                  </Link>
                );
              })}
            </div>
            <p className={moveStyles.resultSummary}>
              {searchQuery || selectedKind !== "all"
                ? `${filteredMoves.length} / ${preparedMoves.length}件を表示`
                : `${preparedMoves.length}件の技データ`}
            </p>
          </section>

          {filteredMoves.length ? (
            <div className={moveStyles.moveGroups}>
              {groupedMoves.map((group) => (
                <section className={moveStyles.moveGroup} key={group.kind}>
                  <div className={moveStyles.moveGroupHeading}>
                    <h2>{group.label}</h2>
                    <span>{group.items.length}件</span>
                  </div>
                  <div className={moveStyles.moveList}>
                    {group.items.map((move) => (
                      <article className={moveStyles.moveRow} key={move.item.id}>
                        <div className={moveStyles.moveIdentity}>
                          <div className={moveStyles.moveTitleRow}>
                            <strong>{move.item.title}</strong>
                            {move.display.preview ? <span className={moveStyles.previewDot}>確認用</span> : null}
                          </div>
                          {move.subtitle ? <p>{move.subtitle}</p> : null}
                          {previewActive && move.display.internal.length ? (
                            <small>確認状態: {move.display.internal.join("・")}</small>
                          ) : null}
                        </div>

                        <div className={moveStyles.moveCommandArea} aria-label={`${move.item.title} コマンド`}>
                          {move.commands.length ? move.commands.map((command, index) => {
                            const primary = commandPrimary(command);
                            const secondary = commandSecondary(command);
                            if (!primary) return null;
                            return (
                              <div className={moveStyles.moveCommand} key={`${command.scheme}-${command.sortOrder ?? index}-${index}`}>
                                <span>{commandSchemeLabels[command.scheme] ?? command.scheme}</span>
                                <div>
                                  <strong>{primary}</strong>
                                  {secondary ? <code>{secondary}</code> : null}
                                  {command.conditionText ? <small>{command.conditionText}</small> : null}
                                </div>
                              </div>
                            );
                          }) : <span className={moveStyles.commandPending}>コマンド確認中</span>}
                          {move.hasClassic && !move.hasModern ? (
                            <div className={moveStyles.modernUnavailable} role="note">
                              モダン操作では使用できません
                            </div>
                          ) : null}
                        </div>

                        <div className={moveStyles.moveStats}>
                          {move.display.stats.length ? move.display.stats.map((stat) => (
                            <span key={`${stat.label}-${stat.value}`}>
                              <small>{stat.label}</small>
                              <strong>{stat.value}</strong>
                            </span>
                          )) : <small className={moveStyles.statPending}>フレーム確認中</small>}
                        </div>

                        {move.media ? (
                          <div className={moveStyles.moveMotion}>
                            {renderMotion(move.media, move.item.title, true)}
                          </div>
                        ) : null}

                        <Link
                          className={moveStyles.moveMore}
                          href={appendDevicePreviewToken(move.item.href, previewToken)}
                          aria-label={`${move.item.title}の詳細を見る`}
                        >
                          詳細 →
                        </Link>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <section className="empty-state">
              <h2>条件に合う技がありません</h2>
              <p>技名やコマンドを短くするか、種別を「すべて」に戻してください。</p>
              <Link className="inline-button button-secondary" href={buildMoveFilterHref(character.slug, previewToken, "", "all")}>絞り込みを解除</Link>
            </section>
          )}
        </>
      ) : items.length ? (
        <section className={styles.dataGrid} aria-label={`${character.name} ${meta.title}`}>
          {items.map((item) => {
            const display = parseMeta(item.meta);
            const subtitle = displaySubtitle(item.subtitle, previewActive);

            return (
              <article className={styles.dataCard} key={item.id}>
                <div className={styles.cardTop}>
                  <div className={styles.cardTitleBlock}>
                    {display.kind ? <span className={styles.kind}>{display.kind}</span> : null}
                    <strong className={styles.title}>{item.title}</strong>
                  </div>
                  {display.preview ? <span className={styles.previewBadge}>未公開・確認用</span> : null}
                </div>

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
