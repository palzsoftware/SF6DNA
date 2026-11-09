import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { CharacterMoveExplorer } from "./character-move-explorer";
import { Sf6CommandInput } from "./sf6-command-input";
import { MoveMotionMedia } from "./move-motion-media";
import { CharacterPlayerCard } from "./character-player-card";
import { CharacterRelatedVideos } from "./character-related-videos";
import type { VideoRetrievalState } from "@/lib/video-retrieval-state";
import { CharacterStrategySlot } from "./character-strategy-slot";
import type { StrategyCardView } from "./strategy-card-explorer";
import { CharacterPreferenceActions } from "./character-preference-actions";
import { moveCardAnchorId } from "@/lib/move-card-reference";
import { moveCommandSearchTerms } from "@/lib/move-command-format";
import { sf6CommandSearchTerms } from "@/lib/sf6-command-tokens";
import { isInternalMoveNote, normalizePublicCopy } from "@/lib/public-copy";
import { presentSource } from "@/lib/source-presentation";
import { safeExternalUrl } from "@/lib/safe-external-url";
import { UNIFIED_MEDIA_PLACEHOLDER, unifiedCommandRows, unifiedCommandText, unifiedConditionRows, unifiedFrameValue,
  unifiedInputPathLabel, unifiedOtherCommandRows, unifiedMoveMedia, unifiedPlayers, unifiedSources,
  unifiedControlInputFallback, unifiedMoveFilterSchemes, unifiedCommandDisplay,
  type UnifiedMove, type UnifiedMoveEvidence } from "@/lib/character-unified-contract";
import { getOfficialTxtPreviewDisplayCategory } from "@/lib/official-txt-device-preview-adapter.mjs";
import type { DevicePreviewBundle } from "@/lib/device-preview";
import type { CharacterDetail, SourceReference } from "@/types/character";
import type { PlayerDetail } from "@/types/player";
import { type VideoSummary } from "@/lib/event-media";
import { officialMoveDisplayNotes, trailingCommandCondition, simultaneousButtonHint } from "@/lib/official-move-display-notes";
import { characterOverviewCopy } from "@/lib/character-overview-copy";
import styles from "./character-unified-page.module.css";

const labels: Record<string, string> = { normal: "通常技", unique: "特殊技", target_combo: "特殊技",
  special: "必殺技", super: "SA", super_art: "SA", throw: "投げ", system: "必殺技", drive: "必殺技" };
const officialCategories = [
  { type: "normal", label: "通常技" }, { type: "unique", label: "特殊技" },
  { type: "special", label: "必殺技" }, { type: "throw", label: "投げ" }, { type: "super", label: "SA" },
];
const showLocalTxtCandidateValues = process.env.NODE_ENV === "development" && process.env.SF6DNA_WS5_TXT_PREVIEW === "1";
function displayMoveKind(move: UnifiedMove): string {
  const local = showLocalTxtCandidateValues ? getOfficialTxtPreviewDisplayCategory(move) : null;
  if (local) return local;
  if (move.moveType === "target_combo") return "unique";
  if (move.moveType === "super_art") return "super";
  if (move.moveType === "system" || move.moveType === "drive") return "special";
  return officialCategories.some(item => item.type === move.moveType) ? move.moveType! : "other";
}
function frameDisplayUnit(value: string, field: string): string {
  if (field === "damage") return value;
  const trimmed = value.trim();
  // Display-only suffix. Preserve multi-part notes, state labels and existing units.
  return /^[+\-−]?\d+(?:\.\d+)?(?:\s*[-~〜～–]\s*[+\-−]?\d+(?:\.\d+)?)*$/.test(trimmed)
    ? `${trimmed}F` : value;
}
const fields = [["startup", "発生"], ["active", "持続"], ["recovery", "硬直"],
  ["onHit", "ヒット時"], ["onBlock", "ガード時"], ["damage", "ダメージ"]] as const;
const publicText = (value: string | null | undefined, fallback: string) =>
  value?.trim() && !isInternalMoveNote(value) ? normalizePublicCopy(value) : fallback;

function SourceLinks({ sources }: { sources: SourceReference[] }) {
  const safe = unifiedSources(sources);
  return safe.length ? <ul className={styles.sources}>{safe.map(source => {
    const presentation = presentSource(source.sourceType, source.publisher, source.url);
    const sourceLabel = source.title?.trim() || source.publisher?.trim() || new URL(source.url).hostname.replace(/^www\./, "");
    return <li key={source.id}>
      <a href={source.url} target="_blank" rel="noopener noreferrer"
        aria-label={`${sourceLabel}：${presentation.cta}`}>{sourceLabel} · {presentation.cta} ↗</a>
    </li>;
  })}</ul> : <p>情報源を確認中です。</p>;
}

export function UnifiedMoveCard({ move, variants = [move], evidence }: { move: UnifiedMove; variants?: UnifiedMove[]; evidence?: UnifiedMoveEvidence }) {
  const media = unifiedMoveMedia(move);
  const variantLabel = (item: UnifiedMove, index: number) => item.name.match(/^[\[［（(【「]([^\]］）)】」]+)[\]］）)】」]/)?.[1] ?? (variants.length > 1 ? `条件${index + 1}` : "");
  const cardTitle = variants.length > 1 ? move.name.replace(/^[\[［（(【「][^\]］）)】」]+[\]］）)】」]\s*/, "").trim() : move.name;
  const conditions = variants.flatMap((item, index) => {
    const stored = unifiedConditionRows(item).flatMap(row => row.values.map(value => ({
      scheme: row.scheme, text: value, label: variantLabel(item, index),
    })));
    const command = (["classic", "modern"] as const).flatMap(scheme => unifiedCommandRows(item, scheme).flatMap(row => {
      const raw = unifiedCommandText(row);
      const match = raw.match(/^（([^）]+)）/);
      return match ? [{ scheme, text: match[1], label: variantLabel(item, index) }] : [];
    }));
    return [...stored, ...command].filter((row, rowIndex, all) =>
      all.findIndex(other => other.scheme === row.scheme && other.text === row.text && other.label === row.label) === rowIndex)
      .filter(row => !isInternalMoveNote(row.text)).map(row => ({ ...row, text: normalizePublicCopy(row.text) }));
  });
  return <article id={moveCardAnchorId(move.slug) ?? undefined} tabIndex={-1} className={styles.moveCard}
    data-move-id={move.id} data-move-slug={move.slug} data-move-type={move.moveType ?? "other"}
    data-has-media={Boolean(media)}>
    {variants.slice(1).map(item => {
      const aliasId = moveCardAnchorId(item.slug);
      return aliasId && aliasId !== moveCardAnchorId(move.slug) ? <span id={aliasId} className={styles.anchorAlias} tabIndex={-1} aria-hidden="true" key={aliasId} /> : null;
    })}
    <header><span className={styles.tag}>{labels[displayMoveKind(move)] ?? "分類確認中"}</span><h3>{cardTitle}</h3></header>
    <div className={styles.mediaSlot} data-media-move-id={move.id}>
      {media ? <MoveMotionMedia media={media} title={move.name} className={styles.mediaAsset} />
        : <span>{UNIFIED_MEDIA_PLACEHOLDER}</span>}
    </div>
    <dl className={styles.commands}>{(["classic", "modern"] as const).map(scheme => <div key={scheme}><dt>{scheme === "classic" ? "Classic" : "Modern"}</dt><dd>
      {variants.map((item, variantIndex) => {
        const commands = unifiedCommandRows(item, scheme).filter(row => Boolean(unifiedCommandText(row).trim()));
        return commands.length ? <div className={styles.commandVariant} key={`${item.id}-${scheme}`}>
          {variants.length > 1 ? <small>入力{variantIndex + 1}</small> : null}
          {commands.map((command, index) => {
            const display = unifiedCommandDisplay(item, command);
            const presented = showLocalTxtCandidateValues ? { value: display.value, condition: trailingCommandCondition(unifiedCommandText(command)).condition } : { value: display.value, condition: null };
            return <div className={styles.commandLine} key={`${command.scheme}-${index}`}>
              {unifiedInputPathLabel(command.scheme) ? <small>{unifiedInputPathLabel(command.scheme)}</small> : null}
              <Sf6CommandInput value={presented.value} scheme={scheme} />
              {presented.condition ? <small>{presented.condition}</small> : null}
              {(simultaneousButtonHint(unifiedCommandText(command), scheme) ?? display.hint) ? <small style={{ flexBasis: "100%" }}>{simultaneousButtonHint(unifiedCommandText(command), scheme) ?? display.hint}</small> : null}
            </div>;
          })}
        </div> : null;
      })}
      {!variants.some(item => unifiedCommandRows(item, scheme).some(row => Boolean(unifiedCommandText(row).trim()))) ? (scheme === "modern" && unifiedControlInputFallback(scheme, move).startsWith("技入力なし") ? "モダン技入力なし" : unifiedControlInputFallback(scheme, move)) : null}
    </dd></div>)}</dl>
    {unifiedOtherCommandRows(move).length ? <div className={styles.commandLine}><strong>入力経路確認中</strong>
      {unifiedOtherCommandRows(move).map((row, index) => <Sf6CommandInput key={index} value={unifiedCommandText(row)} scheme="unknown" />)}
    </div> : null}
    {variants.map((item, variantIndex) => <section className={styles.frameVariant} key={`${item.id}-frames`} data-frame-move-id={item.id}>
      {variants.length > 1 ? <strong>数値セット{variantIndex + 1}</strong> : null}
      <dl className={styles.frames}>{fields.map(([field, label]) => <div key={field}><dt>{label}</dt>
        <dd>{frameDisplayUnit(unifiedFrameValue(item, field, showLocalTxtCandidateValues), field)}</dd></div>)}</dl>
    </section>)}
    <details className={styles.moveDetails}><summary>詳細（条件・Patch・照合・出典）</summary>
      <dl className={styles.notes}>
        <div><dt>Condition / 条件</dt><dd>{conditions.length ? conditions.map((row, index) => <div key={`${row.scheme}-${index}`} data-condition-control={row.scheme}>
          {row.label ? `${row.label}・` : ""}{row.scheme === "classic" ? "Classic" : "Modern"}：{row.text}
        </div>) : "条件確認中"}</dd></div>
        {showLocalTxtCandidateValues ? variants.map(item => {
          const notes = officialMoveDisplayNotes(item);
          return notes.length ? <div key={`${item.id}-official-notes`}><dt>公式備考</dt><dd>{notes.map((note, index) => <p key={index}>{note}</p>)}</dd></div> : null;
        }) : null}
        <div><dt>Patch</dt><dd>{evidence?.patch ?? "対応バージョン確認中"}</dd></div>
        <div><dt>Verification</dt><dd>{evidence?.verification ?? (move.releaseFixture ? "保存データ・公式照合状態を確認中" : "照合状態を確認中")}</dd></div>
      </dl>
      <div className={styles.cardSources}><strong>Source / 情報源</strong><SourceLinks sources={evidence?.sources ?? []} /></div>
    </details>
  </article>;
}

export function CharacterUnifiedPage({ character, bundle, players, videos, videoState, moveEvidence = {}, localReferences, localMoveReferences, automaticVideos, showPreferences = true, strategyCards = [], strategyCardsAuthorized = false, previewComboCards = [], previewComboNotice, previewSetplayCards = [], previewSetplayNotice }: {
  character: CharacterDetail; bundle: DevicePreviewBundle | null; players: PlayerDetail[]; videos: VideoSummary[];
  videoState?: VideoRetrievalState; moveEvidence?: Record<string, UnifiedMoveEvidence>; localReferences?: ReactNode; localMoveReferences?: ReactNode; automaticVideos?: ReactNode; showPreferences?: boolean;
  /** Pre-authorized cards only; never pass raw research fixtures from a public route. */
  strategyCards?: StrategyCardView[];
  /** Must be asserted by the existing server-side publication/Preview authorization gate. */
  strategyCardsAuthorized?: boolean;
  /** Only populated by the server route for an explicit Preview-only Ryu candidate view. */
  previewComboCards?: StrategyCardView[];
  /** Renders only when the Ryu candidate-only Preview view is active. */
  previewComboNotice?: ReactNode;
  /** Only populated by the server route for an explicit Preview-only Ryu candidate view. */
  previewSetplayCards?: StrategyCardView[];
  previewSetplayNotice?: ReactNode;
}) {
  const overview = characterOverviewCopy[character.slug] ?? character;
  const visibleStrategyCards = strategyCardsAuthorized && process.env.VERCEL_ENV !== "production" ? strategyCards : [];
  const moves = bundle?.moves ?? [];
  const dReversalCondition = (move: UnifiedMove): "guard" | "wakeup" | null => {
    const evidence = (move.commands ?? []).filter(row => row.moveId === move.id)
      .map(row => row.conditionText ?? "").join(" ");
    const source = `${move.name} ${evidence}`;
    if (!/ドライブリバーサル|drive\s*reversal/i.test(source)) return null;
    if (/ガード中|ガード時|ドライブパリィ(?:成功|成立)中/i.test(source)) return "guard";
    if (/起き上がり(?:時|中)/i.test(source)) return "wakeup";
    return null;
  };
  const dReversalBase = (move: UnifiedMove) => move.name
    .replace(/^[\[［（(【「]([^\]］）)】」]+)[\]］）)】」]\s*/, "")
    .replace(/\s+/g, " ").trim();
  const reversalBuckets = new Map<string, { guard: UnifiedMove[]; wakeup: UnifiedMove[] }>();
  for (const move of moves) {
    const condition = dReversalCondition(move);
    if (!condition) continue;
    const key = dReversalBase(move);
    const bucket = reversalBuckets.get(key) ?? { guard: [], wakeup: [] };
    bucket[condition].push(move);
    reversalBuckets.set(key, bucket);
  }
  const reversalPairs = new Map<string, UnifiedMove[]>();
  const hiddenReversalIds = new Set<string>();
  for (const bucket of reversalBuckets.values()) {
    if (bucket.guard.length !== 1 || bucket.wakeup.length !== 1) continue;
    const [guard, wakeup] = [bucket.guard[0], bucket.wakeup[0]];
    const pair = [guard, wakeup];
    reversalPairs.set(guard.id, pair);
    hiddenReversalIds.add(wakeup.id);
  }
  const displayMoves = moves.filter(move => !hiddenReversalIds.has(move.id))
    .map(move => ({ move, variants: reversalPairs.get(move.id) ?? [move] }));
  const groups = Object.entries(displayMoves.reduce<Record<string, typeof displayMoves>>((result, entry) => {
    const kind = displayMoveKind(entry.move);
    (result[kind] ??= []).push(entry); return result;
  }, {}));
  const connectedPlayers = unifiedPlayers(character, players);
  const connectedVideos = videos.filter((video, index) => safeExternalUrl(video.url) && videos.findIndex(row => row.id === video.id) === index);
  return <div className={`site-shell ${styles.page}`} data-character-template="unified-v1" data-character-slug={character.slug}>
    <section className={styles.hero} aria-labelledby="character-title">
      <div><p className="eyebrow">キャラクター</p><h1 id="character-title">{character.name}</h1>
        <p className={styles.english} aria-label="英名">{character.nameEn ?? "英名確認中"}</p>
        <p>{publicText(overview.shortDescription, "概要は確認中です。")}</p>
        {showPreferences ? <CharacterPreferenceActions slug={character.slug} /> : null}
      </div>
      {character.imageUrl ? <Image src={character.imageUrl} alt={character.name} width={540} height={540}
        sizes="(max-width: 640px) 180px, 280px" className={styles.portrait} priority />
        : <div className={styles.imageFallback} aria-label={`${character.name}の画像は準備中`}>キャラクター画像は準備中</div>}
    </section>
    <nav className={styles.navigation} aria-label="キャラクターページ内の移動">
      <a href="#pilot-overview">基本情報</a><a href="#pilot-moves">技カード</a><a href="#character-players">使用プレイヤー</a>
      <a href="#character-videos">関連動画</a><a href="#sources">情報源</a>
    </nav>
    <section id="pilot-overview" className={styles.section}><h2>基本情報</h2>
      <dl className={styles.facts}>
        <div><dt>得意距離</dt><dd>{publicText(character.rangeLabel, "確認中")}</dd></div>
        <div><dt>戦い方のタイプ</dt><dd>{publicText(character.archetypeLabel, "確認中")}</dd></div>
        <div><dt>難易度</dt><dd>{character.difficulty !== null && character.difficulty >= 1 && character.difficulty <= 5 ? `${character.difficulty} / 5` : "確認中"}</dd></div>
      </dl>
      <div className={styles.profileGrid}><div><h3>強み</h3><p>{publicText(overview.strengthsSummary, "強みは確認中です。")}</p></div>
        <div><h3>苦手な状況・注意点</h3><p>{publicText(overview.weaknessesSummary, "注意点は確認中です。")}</p></div></div>
    </section>
    <section id="pilot-moves" className={styles.section}><h2>技カード</h2>
      <p>「—」は公式資料のN/A、「公式資料に記載なし」は未記載、「確認中」は未確認項目です。「ダウン」はヒット時に相手がダウンする意味です。ClassicとModernは別の入力として表示します。</p>
      {showLocalTxtCandidateValues ? <p className={styles.localCandidateNotice}>ローカル確認表示：10/23公式TXTを優先した候補値です。公開承認・Patch照合済みを意味しません。</p> : null}
      {groups.length ? <CharacterMoveExplorer className={styles.explorer} groupClassName={styles.moveGroup} listClassName={styles.moveGrid}
        categories={officialCategories}
        groups={groups.map(([kind, items]) => ({ type: kind, label: labels[kind] ?? "分類確認中", items: items.map(entry => ({
          id: entry.move.id, name: entry.move.name, anchorId: moveCardAnchorId(entry.move.slug) ?? undefined,
          aliasAnchorIds: entry.variants.slice(1).map(move => moveCardAnchorId(move.slug)).filter((id): id is string => Boolean(id)),
          schemes: [...new Set(entry.variants.flatMap(unifiedMoveFilterSchemes))],
          commands: entry.variants.flatMap(move => (move.commands ?? []).filter(row => row.moveId === move.id)
            .flatMap(row => [...moveCommandSearchTerms(unifiedCommandText(row)), ...sf6CommandSearchTerms(unifiedCommandText(row))])),
          content: <UnifiedMoveCard move={entry.move} variants={entry.variants} evidence={moveEvidence[entry.move.id]} />,
        })) }))} /> : <p className={styles.empty}>技データは確認中です。確認できた技から掲載します。</p>}
    </section>
    {character.slug === "luke" && ["development", "preview"].includes(process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "") ? localMoveReferences : null}
    <section className={styles.relatedSections} aria-label="参考になるプレイヤーと動画">
      <section id="character-players" className={`${styles.section} ${styles.relatedPanel}`}><h2>使用プレイヤー</h2>
        {connectedPlayers.length ? <div className={styles.relatedGrid}>{connectedPlayers.map(player =>
          <CharacterPlayerCard player={player} characterSlug={character.slug} key={player.id} />)}</div>
          : <p>使用プレイヤーの情報を確認中です。</p>}
        <Link className={styles.relatedLink} href="/players">プレイヤー図鑑を見る →</Link>
      </section>
      <section id="character-videos" className={`${styles.section} ${styles.relatedPanel} ${styles.videoPanel} experience-video`}><h2>関連動画</h2>
        <CharacterRelatedVideos videos={connectedVideos} state={videoState} />
        {automaticVideos}
      </section>
    </section>
    <CharacterStrategySlot kind="combo" items={previewComboCards.length ? previewComboCards : visibleStrategyCards.filter(card => card.kind === "combo")} previewContent={character.slug === "luke" ? localReferences : null} previewNotice={character.slug === "ryu" && previewComboCards.length ? previewComboNotice : null} /><CharacterStrategySlot kind="setplay" items={previewSetplayCards?.length ? previewSetplayCards : visibleStrategyCards.filter(card => card.kind === "setplay")} previewNotice={character.slug === "ryu" && previewSetplayCards?.length ? previewSetplayNotice : null} /><CharacterStrategySlot kind="sequence" items={visibleStrategyCards.filter(card => card.kind === "sequence")} /><CharacterStrategySlot kind="counter" items={visibleStrategyCards.filter(card => card.kind === "counter")} />
    <section id="sources" className={styles.section}><h2>情報源</h2><SourceLinks sources={character.sources} /></section>
    {/* Strategy reference media is retained in source, hidden for Ver.1.0. */}
  </div>;
}
