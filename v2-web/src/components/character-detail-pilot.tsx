import Link from "next/link";
import { CharacterGamePlan, CharacterRangeGuide } from "@/components/character-game-guide";
import { CharacterQuickStart } from "@/components/character-quick-start";
import { CharacterMoveExplorer } from "@/components/character-move-explorer";
import { formatMoveCommand, moveCommandSearchTerms } from "@/lib/move-command-format";
import { PilotComboCard } from "@/components/pilot-combo-card";
import { CharacterPlayerCard } from "@/components/character-player-card";
import { CharacterVideoReferenceCard } from "@/components/character-video-reference-card";
import { characterVideoReferences, uniqueCharacterVideos } from "@/lib/character-video-references";
import { VideoCard } from "@/components/video-card";
import { MoveMotionMedia } from "@/components/move-motion-media";
import type { CharacterDetailV21Profile } from "@/lib/character-detail-v21";
import { appendDevicePreviewToken, isDevicePreviewRequest, type DevicePreviewBundle } from "@/lib/device-preview";
import { formatVideoPublishedDate, type VideoSummary } from "@/lib/event-media";
import { presentSource } from "@/lib/source-presentation";
import { isInternalMoveNote, normalizePublicCopy } from "@/lib/public-copy";
import { CHARACTER_VIDEO_GROUP_LABELS, CHARACTER_VIDEO_GROUP_ORDER, classifyCharacterVideo } from "@/lib/character-learning-structure";
import { releaseFeatures } from "@/lib/release-features";
import type { SourceReference } from "@/types/character";
import type { PlayerDetail } from "@/types/player";
import styles from "./character-detail-pilot.module.css";

function numericDifficulty(value: string | null) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 5 ? parsed : null;
}

function verificationLabel(value: string | null) {
  if (value === "verified") return "確認済み";
  if (value === "reviewed") return "編集確認済み・実戦検証前";
  return "内容を確認中・実戦検証前";
}

function setupSteps(description: string | null) {
  if (!description) return [];
  return description.split(/(?:\r?\n|\s*(?:→|＞|>)\s*)/)
    .map((step) => step.replace(/^\s*\d+[.)、]\s*/, "").trim()).filter(Boolean).slice(0, 5);
}

function valueOrUnknown(value: string | number | null | undefined, fallback = "未確認") {
  return value === null || value === undefined || value === "" ? fallback : String(value);
}

function publicMoveSummary(value: string | null) {
  if (!value) return null;
  if (isInternalMoveNote(value)) return null;
  return normalizePublicCopy(value);
}

function sourceLink(label: string | null | undefined, url: string | null | undefined) {
  return label && url ? <a href={url} target="_blank" rel="noopener noreferrer">{label} ↗</a> : <span>参考リンクなし</span>;
}

const moveTypeLabels: Record<string, string> = {
  normal: "通常技",
  unique: "特殊技",
  target_combo: "特殊技",
  special: "必殺技",
  super: "SA",
  throw: "投げ",
  system: "システム",
  drive: "システム",
};

function commandLabel(command: NonNullable<DevicePreviewBundle["moves"][number]["commands"]>[number]) {
  const scheme = command.scheme === "classic" ? "クラシック" : command.scheme === "modern" ? "モダン" : command.scheme;
  const input = command.commandText ?? command.numericNotation ?? command.buttonNotation;
  return { scheme, input: input ? formatMoveCommand(input) : "コマンドを確認中" };
}

export function CharacterDetailPilot({
  characterName, characterSlug, previewToken, bundle, players, videos,
  archetypeLabel, rangeLabel, difficulty, sources, profile, preRelease = false,
}: {
  characterName: string;
  characterSlug: string;
  previewToken: string | null;
  bundle: DevicePreviewBundle;
  players: PlayerDetail[];
  videos: VideoSummary[];
  archetypeLabel: string | null;
  rangeLabel: string | null;
  difficulty: number | null;
  sources: SourceReference[];
  profile: CharacterDetailV21Profile;
  preRelease?: boolean;
}) {
  const previewActive = isDevicePreviewRequest(previewToken);
  const canShowStrategy = (item: { status: string; verificationStatus: string | null }) =>
    previewActive || (releaseFeatures.publicStrategyContent && item.status === "published" && item.verificationStatus === "verified");
  const comboSamples = bundle.combos.filter(canShowStrategy).slice(0, 3);
  const setupSamples = bundle.setups.filter(canShowStrategy).slice(0, 3);
  const sequenceSamples = bundle.sequences.filter(canShowStrategy).slice(0, 3);
  const publicSources = sources.filter((source) => source.relationship !== "candidate");
  const sourceSamples = publicSources.slice(0, 8);
  const strategyListAvailable = releaseFeatures.publicStrategyContent || previewActive;
  const videoSamples = uniqueCharacterVideos(videos);
  const videoReferences = characterVideoReferences(publicSources, videos.map((video) => video.url));
  const videoGroups = CHARACTER_VIDEO_GROUP_ORDER.flatMap((group) => {
    const items = videoSamples.filter((video) => classifyCharacterVideo(video) === group);
    return items.length ? [{ group, items }] : [];
  });
  const moveGroups = Object.entries(bundle.moves.reduce<Record<string, DevicePreviewBundle["moves"]>>((groups, move) => {
    const type = move.moveType === "target_combo" ? "unique" : move.moveType ?? "other";
    (groups[type] ??= []).push(move);
    return groups;
  }, {}));

  return (
    <section className={styles.pilot} aria-label={`${characterName}のキャラクター情報`}>
      {!preRelease ? <CharacterQuickStart characterSlug={characterSlug} /> : null}
      {!preRelease ? <section className={styles.overview} id="pilot-overview">
        <div className={styles.overviewLead}>
          <p className="eyebrow">基本ガイド</p>
          <h2>{normalizePublicCopy(profile.tagline)}</h2>
          <p>{normalizePublicCopy(profile.winPath)}</p>
          {previewActive ? <div className={styles.previewNote}>この攻略情報は掲載前の確認用です。</div> : null}
        </div>
        <dl className={styles.quickFacts} aria-label="基本情報">
          <div><dt>得意距離</dt><dd>{rangeLabel ?? "確認中"}</dd></div>
          <div><dt>タイプ</dt><dd>{archetypeLabel ?? "確認中"}</dd></div>
          <div><dt>難易度</dt><dd>{difficulty ? `${difficulty} / 5` : "未評価"}</dd></div>
          <div id="pilot-first-lesson"><dt>最初の練習</dt><dd>{normalizePublicCopy(profile.firstLesson)}</dd></div>
        </dl>
      </section> : null}

      {!preRelease ? <section className={styles.comparison} aria-labelledby="pilot-profile-heading">
        <div className={styles.sectionTitle}><p className="eyebrow">特徴</p><h2 id="pilot-profile-heading">強みと注意点</h2></div>
        <div className={styles.strength}><span>強み</span><h3>活かしたい強み</h3><p>{normalizePublicCopy(profile.strength)}</p></div>
        <div className={styles.weakness}><span>注意点</span><h3>崩されやすい状況</h3><p>{normalizePublicCopy(profile.weakness)}</p></div>
      </section> : null}

      {!preRelease ? <section className={styles.gameplan} aria-labelledby="pilot-gameplan-heading">
        <div className={styles.sectionTitle}><p className="eyebrow">基本方針</p><h2 id="pilot-gameplan-heading">試合の組み立て方</h2></div>
        <CharacterGamePlan steps={profile.gameplan} />
        {sourceSamples.length ? <div className={styles.inlineSources} tabIndex={0} aria-label="基本方針の情報源（横スクロール）">{sourceSamples.map((source) => {
          const presentation = presentSource(source.sourceType, source.publisher, source.url);
          return <a href={source.url} target="_blank" rel="noopener noreferrer" key={source.id}><span>{presentation.badge}</span>{presentation.cta} ↗</a>;
        })}</div> : null}
      </section> : null}

      <section className={styles.moveSection} id="pilot-moves" aria-labelledby="pilot-moves-heading">
        <div className={styles.subheading}>
          <div>
            <p className="eyebrow">技データ</p>
            <h2 id="pilot-moves-heading">技一覧・コマンド・主要フレーム</h2>
            <p>{bundle.moves.some(move => move.frameFieldStatus) ? "2026年10月6日に取得したCAPCOM公式フレーム表の値を掲載しています。Battle Version番号は未確認です。「—」は公式N/A、「確認中」は保留項目です。公開審査前のPreview候補です。" : characterSlug === "yasmine" && process.env.VERCEL_ENV === "preview" ? "公式画面と照合した技データです。資料の対象バージョンは確認中です。「—」は資料に値や直接入力の記載がない項目です。" : preRelease ? "公式発表済みの技名です。入力コマンドとフレームは公式一覧を照合してから掲載します。" : "コマンドと主要フレームを技ごとに掲載。数値の「確認中」は未確定の項目です。"}</p>
          </div>
          {characterSlug === "jp" ? <a href="https://www.streetfighter.com/6/ja-jp/character/jp/frame" target="_blank" rel="noopener noreferrer">CAPCOM公式フレームを見る ↗</a> : null}
        </div>
        {moveGroups.length ? <CharacterMoveExplorer className={styles.moveGroups} groupClassName={styles.moveGroup} listClassName={styles.moveTable} table enabled={!preRelease} groups={moveGroups.map(([type, moves]) => ({
          type, label: moveTypeLabels[type] ?? "その他", items: moves.map(move => ({
            id: move.id, name: move.name,
            commands: (move.commands ?? []).flatMap(command => moveCommandSearchTerms(command.commandText ?? command.numericNotation ?? command.buttonNotation ?? "")),
            content: <article className={styles.moveRow} role="row" key={move.id} data-move-id={move.id} data-move-slug={move.slug} data-has-media={Boolean(move.media)}>
                  <div className={styles.moveIdentity} role="cell">
                    <span>{move.releaseFixture ? "DB収録データ・公開審査前" : verificationLabel(move.frame?.verificationStatus ?? null)}</span>
                    <h3>{move.name}</h3>
                    {publicMoveSummary(move.usageSummary) ? <p>{publicMoveSummary(move.usageSummary)}</p> : null}
                  </div>
                  <div className={styles.moveMedia} role="cell">
                    {move.media ? <MoveMotionMedia media={move.media} title={move.name} className={styles.moveMediaAsset} /> : <span className={styles.moveMediaFallback} aria-label={`${move.name}の動作メディアは未登録`}>動作映像は未掲載</span>}
                  </div>
                  <div className={styles.moveCommands} role="cell" aria-label={`${move.name}のコマンド`}>
                    {move.commands?.length ? move.commands.map((command, index) => {
                      const label = commandLabel(command);
                      return <div key={`${command.scheme}-${command.sortOrder ?? index}-${index}`}><span>{label.scheme}</span><code>{label.input}</code>{command.conditionText && !isInternalMoveNote(command.conditionText) ? <small>{normalizePublicCopy(command.conditionText)}</small> : null}</div>;
                    }) : <span className={styles.movePending}>コマンドを確認中</span>}
                  </div>
                  <dl className={styles.moveFrame} role="cell">
                    <div><dt>発生</dt><dd>{valueOrUnknown(move.frame?.startup, move.frameFieldStatus?.startup === "OFFICIAL_NA" ? "—" : "確認中")}</dd></div>
                    {move.frame?.active !== null && move.frame?.active !== undefined && move.frame.active !== "" ? <div><dt>持続</dt><dd>{move.frame.active}</dd></div> : null}
                    {move.frame?.recovery !== null && move.frame?.recovery !== undefined && move.frame.recovery !== "" ? <div><dt>硬直</dt><dd>{move.frame.recovery}</dd></div> : null}
                    <div><dt>ヒット時</dt><dd>{valueOrUnknown(move.frame?.onHit, move.frameFieldStatus?.onHit === "OFFICIAL_NA" ? "—" : "確認中")}</dd></div>
                    <div><dt>ガード時</dt><dd>{valueOrUnknown(move.frame?.onBlock, move.frameFieldStatus?.onBlock === "OFFICIAL_NA" ? "—" : "確認中")}</dd></div>
                    <div><dt>ダメージ</dt><dd>{valueOrUnknown(move.frame?.damage, move.frameFieldStatus?.damage === "OFFICIAL_NA" ? "—" : "確認中")}</dd></div>
                  </dl>
                  {!preRelease && releaseFeatures.publicStrategyContent ? <Link className={styles.moveDetailLink} href={appendDevicePreviewToken(`/moves/${move.slug}`, previewToken)}>技の詳細を見る →</Link> : null}
                </article>,
          })),
        }))} /> : <div className="empty-state"><p>技データは未掲載です。</p></div>}
      </section>

      {!preRelease ? <section className={styles.comboSection} id="pilot-combos" aria-labelledby="pilot-combos-heading">
        <div className={styles.subheading}><div><p className="eyebrow">コンボ</p><h2 id="pilot-combos-heading">まず確認するコンボ</h2>{comboSamples.length ? <p>用途と消費ゲージを比較。気になるコンボの詳細を確認。</p> : null}</div>{strategyListAvailable ? <Link href={appendDevicePreviewToken(`/characters/${characterSlug}/combos`, previewToken)}>コンボ一覧を見る →</Link> : null}</div>
        {comboSamples.length ? <div className={styles.comboList}>{comboSamples.map((combo) => <PilotComboCard key={combo.id} previewToken={previewToken} combo={{ id: combo.id, href: `/combos/${combo.slug}`, name: combo.name, category: combo.category, purpose: combo.purpose ? normalizePublicCopy(combo.purpose) : null, damage: combo.damage, drive: combo.driveCost, sa: combo.saCost, difficulty: numericDifficulty(combo.difficulty), verificationStatus: combo.verificationStatus, preview: previewActive, rawRecipe: combo.command, command: combo.command ? normalizePublicCopy(combo.command) : null, startCondition: combo.startCondition ? normalizePublicCopy(combo.startCondition) : null, endCondition: combo.endCondition ? normalizePublicCopy(combo.endCondition) : null, position: combo.position, patch: combo.patch, sourceLabel: combo.sourceLabel, sourceUrl: combo.sourceUrl }} />)}</div> : <div className="empty-state"><p>確認済みのコンボはまだありません。</p></div>}
      </section> : null}

      {!preRelease ? <section className={styles.strategySplit}>
        <div id="pilot-setplay">
          <div className={styles.subheading}><div><p className="eyebrow">セットプレイ</p><h2>セットプレイ</h2>{setupSamples.length ? <p>始める状況から順に手順を紹介します。</p> : null}</div>{strategyListAvailable ? <Link href={appendDevicePreviewToken(`/characters/${characterSlug}/setups`, previewToken)}>セットプレイ一覧を見る →</Link> : null}</div>
          <div className={styles.timelineList}>{setupSamples.map((setup) => {
            const steps = setupSteps(setup.description);
            return <details key={setup.id} open={setup === setupSamples[0]}><summary><span>{verificationLabel(setup.verificationStatus)}</span><strong>{setup.name}</strong><small>ダメージ {valueOrUnknown(setup.damage)}</small><small>ドライブ {valueOrUnknown(setup.driveCost)}</small></summary><div>{steps.length ? <ol>{steps.map((step, index) => <li key={`${setup.id}-${index}`}>{normalizePublicCopy(step)}</li>)}</ol> : <p>手順は未確認です。</p>}<dl><div><dt>コマンド</dt><dd>{valueOrUnknown(setup.command, "コマンド未確認")}</dd></div><div><dt>開始条件</dt><dd>{valueOrUnknown(setup.startCondition)}</dd></div><div><dt>成功条件</dt><dd>{valueOrUnknown(setup.successCondition)}</dd></div><div><dt>相手の選択肢</dt><dd>{valueOrUnknown(setup.opponentOptions)}</dd></div><div><dt>失敗条件</dt><dd>{valueOrUnknown(setup.failureCondition)}</dd></div><div><dt>位置</dt><dd>{valueOrUnknown(setup.position)}</dd></div><div><dt>有利状況</dt><dd>{valueOrUnknown(setup.frameAdvantage)}</dd></div><div><dt>ダメージ</dt><dd>{valueOrUnknown(setup.damage)}</dd></div><div><dt>ドライブゲージ使用量</dt><dd>{valueOrUnknown(setup.driveCost)}</dd></div><div><dt>SAゲージ使用量</dt><dd>{valueOrUnknown(setup.saCost)}</dd></div><div><dt>対応バージョン</dt><dd>{valueOrUnknown(setup.patch)}</dd></div><div><dt>情報源</dt><dd>{sourceLink(setup.sourceLabel, setup.sourceUrl)}</dd></div></dl></div></details>;
          })}{!setupSamples.length ? <div className="empty-state"><p>確認済みのセットプレイはまだありません。</p></div> : null}</div>
        </div>

        <div id="pilot-sequences">
          <div className={styles.subheading}><div><p className="eyebrow">連携</p><h2>連携・対策</h2>{sequenceSamples.length ? <p>入力、目的、注意点を項目ごとに開けます。</p> : null}</div>{strategyListAvailable ? <Link href={appendDevicePreviewToken(`/characters/${characterSlug}/sequences`, previewToken)}>連携・対策一覧を見る →</Link> : null}</div>
          <div className={styles.sequenceList}>{sequenceSamples.map((sequence) => <details key={sequence.id} open={sequence === sequenceSamples[0]}><summary><span>{verificationLabel(sequence.verificationStatus)}</span><strong>{sequence.name}</strong><small>ダメージ {valueOrUnknown(sequence.damage)}</small><small>ドライブ {valueOrUnknown(sequence.driveCost)}</small></summary><div><p className={styles.command}>{valueOrUnknown(sequence.sequenceText, "コマンド未確認")}</p>{sequence.purpose ? <p>{normalizePublicCopy(sequence.purpose)}</p> : null}{sequence.notes ? <p>{normalizePublicCopy(sequence.notes)}</p> : null}<dl><div><dt>連係の隙間</dt><dd>{valueOrUnknown(sequence.gap)}</dd></div><div><dt>投げ</dt><dd>{valueOrUnknown(sequence.throwOption)}</dd></div><div><dt>打撃</dt><dd>{valueOrUnknown(sequence.strikeOption)}</dd></div><div><dt>ドライブインパクトへの対応</dt><dd>{valueOrUnknown(sequence.driveImpactOption)}</dd></div><div><dt>反撃可否</dt><dd>{valueOrUnknown(sequence.punishability)}</dd></div><div><dt>成立条件</dt><dd>{valueOrUnknown(sequence.condition)}</dd></div><div><dt>ダメージ</dt><dd>{valueOrUnknown(sequence.damage)}</dd></div><div><dt>ドライブゲージ使用量</dt><dd>{valueOrUnknown(sequence.driveCost)}</dd></div><div><dt>SAゲージ使用量</dt><dd>{valueOrUnknown(sequence.saCost)}</dd></div><div><dt>対応バージョン</dt><dd>{valueOrUnknown(sequence.patch)}</dd></div><div><dt>情報源</dt><dd>{sourceLink(sequence.sourceLabel, sequence.sourceUrl)}</dd></div></dl></div></details>)}{!sequenceSamples.length ? <div className="empty-state"><p>確認済みの連携・対策はまだありません。</p></div> : null}</div>
        </div>
      </section> : null}

      {!preRelease ? <section className={styles.rangeSection} id="pilot-neutral-defense" aria-labelledby="pilot-range-heading">
        <div className={styles.sectionTitle}><p className="eyebrow">立ち回り・防御</p><h2 id="pilot-range-heading">距離別の立ち回り</h2><p>距離ごとに、狙い・使う技・注意点をまとめました。</p></div>
        <CharacterRangeGuide ranges={profile.ranges} />
      </section> : null}

      {!preRelease ? <section className={styles.related} id="related-players">
        <div className={styles.subheading}><div><p className="eyebrow">プレイヤー</p><h2>関連プレイヤー</h2></div></div>
        {players.length ? <div className={styles.playerGrid} aria-label="関連プレイヤー">{players.slice(0, 6).map((player) => <CharacterPlayerCard key={player.id} player={player} characterSlug={characterSlug} />)}</div> : <div className="empty-state"><p>関連プレイヤーは未掲載です。</p></div>}
      </section> : null}

      {!preRelease ? <section className={styles.related} id="related-videos">
        <div className={styles.subheading}><div><p className="eyebrow">動画</p><h2>関連動画</h2></div><Link href={appendDevicePreviewToken(`/characters/${characterSlug}/videos`, previewToken)}>このキャラの動画を探す →</Link></div>
        {videoGroups.length ? videoGroups.map(({ group, items }) => <div className={styles.videoGroup} key={group}><h3>{CHARACTER_VIDEO_GROUP_LABELS[group]}</h3><div className={styles.videoList} aria-label={CHARACTER_VIDEO_GROUP_LABELS[group]}>{items.map((video) => <VideoCard video={video} publishedDate={formatVideoPublishedDate(video.publishedAt)} key={video.id} />)}</div></div>) : !videoReferences.length ? <div className="empty-state"><p>関連動画は未掲載です。</p></div> : null}
        {videoReferences.length ? <div className={styles.videoGroup}><h3>動画の参照元</h3><div className={styles.videoList}>{videoReferences.map((source) => <CharacterVideoReferenceCard key={source.id} source={source} characterName={characterName} />)}</div></div> : null}
      </section> : null}
      <section className={styles.related} id="sources">
        <div className={styles.subheading}><div><p className="eyebrow">情報源</p><h2>参照した資料</h2></div></div>
        {publicSources.length ? <ul className={styles.sourceGrid}>{publicSources.map((source) => {
          const item = presentSource(source.sourceType, source.publisher, source.url);
          return <li key={source.id}><span>{item.badge}</span><strong>{source.title}</strong>{source.publisher ? <small>{source.publisher}</small> : null}<a href={source.url} target="_blank" rel="noopener noreferrer">{item.cta} ↗</a></li>;
        })}</ul> : <p>情報源は未掲載です。</p>}
      </section>
    </section>
  );
}
