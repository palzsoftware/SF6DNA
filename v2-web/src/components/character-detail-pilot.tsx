import Image from "next/image";
import Link from "next/link";
import { PilotComboCard } from "@/components/pilot-combo-card";
import { VideoCard } from "@/components/video-card";
import { MoveMotionMedia } from "@/components/move-motion-media";
import type { CharacterDetailV21Profile } from "@/lib/character-detail-v21";
import { appendDevicePreviewToken, type DevicePreviewBundle } from "@/lib/device-preview";
import { formatVideoPublishedDate, type VideoSummary } from "@/lib/event-media";
import { presentSource } from "@/lib/source-presentation";
import { isInternalMoveNote, normalizePublicCopy } from "@/lib/public-copy";
import type { SourceReference } from "@/types/character";
import type { PlayerDetail } from "@/types/player";
import styles from "./character-detail-pilot.module.css";

function socialLinks(player: PlayerDetail) {
  return [["X", player.xUrl], ["YouTube", player.youtubeUrl], ["Twitch", player.twitchUrl], ["Webサイト", player.websiteUrl]]
    .filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].startsWith("https://"));
}

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
  special: "必殺技",
  super: "スーパーアーツ",
  throw: "投げ",
  system: "共通システム",
};

function commandLabel(command: NonNullable<DevicePreviewBundle["moves"][number]["commands"]>[number]) {
  const scheme = command.scheme === "classic" ? "クラシック" : command.scheme === "modern" ? "モダン" : command.scheme;
  const input = command.commandText ?? command.numericNotation ?? command.buttonNotation;
  return { scheme, input: input || "コマンドを確認中" };
}

export function CharacterDetailPilot({
  characterName, characterSlug, previewToken, bundle, players, videos,
  archetypeLabel, rangeLabel, difficulty, sources, profile,
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
}) {
  const comboSamples = bundle.combos.slice(0, 3);
  const setupSamples = bundle.setups.slice(0, 3);
  const sequenceSamples = bundle.sequences.slice(0, 3);
  const sourceSamples = sources.slice(0, 8);
  const moveGroups = Object.entries(bundle.moves.reduce<Record<string, DevicePreviewBundle["moves"]>>((groups, move) => {
    const type = move.moveType ?? "other";
    (groups[type] ??= []).push(move);
    return groups;
  }, {}));

  return (
    <section className={styles.pilot} aria-label={`${characterName} Character Detail V2.2`}>
      <section className={styles.overview} id="pilot-overview">
        <div className={styles.overviewLead}>
          <p className="eyebrow">基本ガイド</p>
          <h2>{normalizePublicCopy(profile.tagline)}</h2>
          <p>{normalizePublicCopy(profile.winPath)}</p>
          <div className={styles.previewNote}>この攻略情報は掲載前の確認用です。</div>
        </div>
        <dl className={styles.quickFacts} aria-label="基本情報">
          <div><dt>得意距離</dt><dd>{rangeLabel ?? "確認中"}</dd></div>
          <div><dt>タイプ</dt><dd>{archetypeLabel ?? "確認中"}</dd></div>
          <div><dt>難易度</dt><dd>{difficulty ? `${difficulty} / 5` : "未評価"}</dd></div>
          <div><dt>最初の練習</dt><dd>{normalizePublicCopy(profile.firstLesson)}</dd></div>
        </dl>
      </section>

      <section className={styles.comparison} aria-labelledby="pilot-profile-heading">
        <div className={styles.sectionTitle}><p className="eyebrow">特徴</p><h2 id="pilot-profile-heading">強みと注意点</h2></div>
        <div className={styles.strength}><span>強み</span><h3>活かしたい強み</h3><p>{normalizePublicCopy(profile.strength)}</p></div>
        <div className={styles.weakness}><span>注意点</span><h3>崩されやすい状況</h3><p>{normalizePublicCopy(profile.weakness)}</p></div>
      </section>

      <section className={styles.gameplan} aria-labelledby="pilot-gameplan-heading">
        <div className={styles.sectionTitle}><p className="eyebrow">基本方針</p><h2 id="pilot-gameplan-heading">基本の勝ち筋</h2><p>使う技、得意な距離、注意点を順に紹介します。</p></div>
        {profile.gameplan.length ? <ol className={styles.gameplanSteps}>
          {profile.gameplan.map((step, index) => <li key={step.label}><span>手順 {index + 1}</span><div><h3>{normalizePublicCopy(step.title)}</h3><p>{normalizePublicCopy(step.body)}</p><small>{normalizePublicCopy(step.caution)}</small></div></li>)}
        </ol> : <div className="empty-state"><p>表示できる基本方針はありません。</p></div>}
        {sourceSamples.length ? <div className={styles.inlineSources} tabIndex={0} aria-label="基本方針の情報源（横スクロール）">{sourceSamples.map((source) => {
          const presentation = presentSource(source.sourceType, source.publisher, source.url);
          return <a href={source.url} target="_blank" rel="noopener noreferrer" key={source.id}><span>{presentation.badge}</span>{presentation.cta} ↗</a>;
        })}</div> : null}
      </section>

      <section className={styles.moveSection} id="pilot-moves" aria-labelledby="pilot-moves-heading">
        <div className={styles.subheading}>
          <div>
            <p className="eyebrow">技データ</p>
            <h2 id="pilot-moves-heading">技一覧・コマンド・主要フレーム</h2>
            <p>クラシックとモダンのコマンド、確認済みの発生・ガード時・ダメージを見られます。数値が未確認の項目は「確認中」と表示します。</p>
          </div>
          {characterSlug === "jp" ? <a href="https://www.streetfighter.com/6/ja-jp/character/jp/frame" target="_blank" rel="noopener noreferrer">CAPCOM公式フレームを見る ↗</a> : null}
        </div>
        {moveGroups.length ? <div className={styles.moveGroups}>{moveGroups.map(([type, moves], groupIndex) => (
          <details className={styles.moveGroup} key={type} open={groupIndex === 0}>
            <summary><strong>{moveTypeLabels[type] ?? "その他"}</strong><span>{moves.length}技</span></summary>
            <div className={styles.moveTable} role="table" aria-label={`${moveTypeLabels[type] ?? "その他"}の技データ`}>
              {moves.map((move) => (
                <article className={styles.moveRow} role="row" key={move.id}>
                  <div className={styles.moveIdentity} role="cell">
                    <span>{verificationLabel(move.frame?.verificationStatus ?? null)}</span>
                    <h3>{move.name}</h3>
                    {publicMoveSummary(move.usageSummary) ? <p>{publicMoveSummary(move.usageSummary)}</p> : null}
                  </div>
                  <div className={styles.moveMedia} role="cell">
                    {move.media ? <MoveMotionMedia media={move.media} title={move.name} className={styles.moveMediaAsset} /> : <span aria-label={`${move.name}の動作メディアは未登録`} />}
                  </div>
                  <div className={styles.moveCommands} role="cell" aria-label={`${move.name}のコマンド`}>
                    {move.commands?.length ? move.commands.map((command, index) => {
                      const label = commandLabel(command);
                      return <div key={`${command.scheme}-${command.sortOrder ?? index}-${index}`}><span>{label.scheme}</span><code>{label.input}</code>{command.conditionText ? <small>{command.conditionText}</small> : null}</div>;
                    }) : <span className={styles.movePending}>コマンドを確認中</span>}
                  </div>
                  <dl className={styles.moveFrame} role="cell">
                    <div><dt>発生</dt><dd>{valueOrUnknown(move.frame?.startup, "確認中")}</dd></div>
                    <div><dt>ガード時</dt><dd>{valueOrUnknown(move.frame?.onBlock, "確認中")}</dd></div>
                    <div><dt>ダメージ</dt><dd>{valueOrUnknown(move.frame?.damage, "確認中")}</dd></div>
                  </dl>
                  <Link className={styles.moveDetailLink} href={appendDevicePreviewToken(`/moves/${move.slug}`, previewToken)}>技の詳細を見る →</Link>
                </article>
              ))}
            </div>
          </details>
        ))}</div> : <div className="empty-state"><p>技データは未掲載です。</p></div>}
      </section>

      <section className={styles.comboSection} id="pilot-combos" aria-labelledby="pilot-combos-heading">
        <div className={styles.subheading}><div><p className="eyebrow">コンボ</p><h2 id="pilot-combos-heading">まず確認するコンボ</h2><p>用途と消費ゲージを比べ、気になるコンボの詳細を開けます。</p></div><Link href={appendDevicePreviewToken(`/characters/${characterSlug}/combos`, previewToken)}>コンボ一覧を見る →</Link></div>
        {comboSamples.length ? <div className={styles.comboList}>{comboSamples.map((combo) => <PilotComboCard key={combo.id} previewToken={previewToken} combo={{ id: combo.id, href: `/combos/${combo.slug}`, name: combo.name, category: combo.category, purpose: combo.purpose ? normalizePublicCopy(combo.purpose) : null, damage: combo.damage, drive: combo.driveCost, sa: combo.saCost, difficulty: numericDifficulty(combo.difficulty), verificationStatus: combo.verificationStatus, preview: true, command: combo.command ? normalizePublicCopy(combo.command) : null, startCondition: combo.startCondition ? normalizePublicCopy(combo.startCondition) : null, endCondition: combo.endCondition ? normalizePublicCopy(combo.endCondition) : null, position: combo.position, patch: combo.patch, sourceLabel: combo.sourceLabel, sourceUrl: combo.sourceUrl }} />)}</div> : <div className="empty-state"><p>コンボは未掲載です。</p></div>}
      </section>

      <section className={styles.strategySplit}>
        <div id="pilot-setplay">
          <div className={styles.subheading}><div><p className="eyebrow">セットプレイ</p><h2>セットプレイ</h2><p>始める状況から順に手順を紹介します。</p></div><Link href={appendDevicePreviewToken(`/characters/${characterSlug}/setups`, previewToken)}>セットプレイ一覧を見る →</Link></div>
          <div className={styles.timelineList}>{setupSamples.map((setup) => {
            const steps = setupSteps(setup.description);
            return <details key={setup.id} open={setup === setupSamples[0]}><summary><span>{verificationLabel(setup.verificationStatus)}</span><strong>{setup.name}</strong><small>ダメージ {valueOrUnknown(setup.damage)}</small><small>ドライブ {valueOrUnknown(setup.driveCost)}</small></summary><div>{steps.length ? <ol>{steps.map((step, index) => <li key={`${setup.id}-${index}`}>{normalizePublicCopy(step)}</li>)}</ol> : <p>手順は未確認です。</p>}<dl><div><dt>コマンド</dt><dd>{valueOrUnknown(setup.command, "コマンド未確認")}</dd></div><div><dt>開始条件</dt><dd>{valueOrUnknown(setup.startCondition)}</dd></div><div><dt>成功条件</dt><dd>{valueOrUnknown(setup.successCondition)}</dd></div><div><dt>相手の選択肢</dt><dd>{valueOrUnknown(setup.opponentOptions)}</dd></div><div><dt>失敗条件</dt><dd>{valueOrUnknown(setup.failureCondition)}</dd></div><div><dt>位置</dt><dd>{valueOrUnknown(setup.position)}</dd></div><div><dt>有利状況</dt><dd>{valueOrUnknown(setup.frameAdvantage)}</dd></div><div><dt>ダメージ</dt><dd>{valueOrUnknown(setup.damage)}</dd></div><div><dt>ドライブゲージ使用量</dt><dd>{valueOrUnknown(setup.driveCost)}</dd></div><div><dt>SAゲージ使用量</dt><dd>{valueOrUnknown(setup.saCost)}</dd></div><div><dt>対応バージョン</dt><dd>{valueOrUnknown(setup.patch)}</dd></div><div><dt>情報源</dt><dd>{sourceLink(setup.sourceLabel, setup.sourceUrl)}</dd></div></dl></div></details>;
          })}{!setupSamples.length ? <div className="empty-state"><p>セットプレイは未掲載です。</p></div> : null}</div>
        </div>

        <div id="pilot-sequences">
          <div className={styles.subheading}><div><p className="eyebrow">連携</p><h2>連携・対策</h2><p>入力、目的、注意点を項目ごとに開けます。</p></div><Link href={appendDevicePreviewToken(`/characters/${characterSlug}/sequences`, previewToken)}>連携・対策一覧を見る →</Link></div>
          <div className={styles.sequenceList}>{sequenceSamples.map((sequence) => <details key={sequence.id} open={sequence === sequenceSamples[0]}><summary><span>{verificationLabel(sequence.verificationStatus)}</span><strong>{sequence.name}</strong><small>ダメージ {valueOrUnknown(sequence.damage)}</small><small>ドライブ {valueOrUnknown(sequence.driveCost)}</small></summary><div><p className={styles.command}>{valueOrUnknown(sequence.sequenceText, "コマンド未確認")}</p>{sequence.purpose ? <p>{normalizePublicCopy(sequence.purpose)}</p> : null}{sequence.notes ? <p>{normalizePublicCopy(sequence.notes)}</p> : null}<dl><div><dt>連係の隙間</dt><dd>{valueOrUnknown(sequence.gap)}</dd></div><div><dt>投げ</dt><dd>{valueOrUnknown(sequence.throwOption)}</dd></div><div><dt>打撃</dt><dd>{valueOrUnknown(sequence.strikeOption)}</dd></div><div><dt>ドライブインパクトへの対応</dt><dd>{valueOrUnknown(sequence.driveImpactOption)}</dd></div><div><dt>反撃可否</dt><dd>{valueOrUnknown(sequence.punishability)}</dd></div><div><dt>成立条件</dt><dd>{valueOrUnknown(sequence.condition)}</dd></div><div><dt>ダメージ</dt><dd>{valueOrUnknown(sequence.damage)}</dd></div><div><dt>ドライブゲージ使用量</dt><dd>{valueOrUnknown(sequence.driveCost)}</dd></div><div><dt>SAゲージ使用量</dt><dd>{valueOrUnknown(sequence.saCost)}</dd></div><div><dt>対応バージョン</dt><dd>{valueOrUnknown(sequence.patch)}</dd></div><div><dt>情報源</dt><dd>{sourceLink(sequence.sourceLabel, sequence.sourceUrl)}</dd></div></dl></div></details>)}{!sequenceSamples.length ? <div className="empty-state"><p>連携・対策は未掲載です。</p></div> : null}</div>
        </div>
      </section>

      <section className={styles.rangeSection} id="pilot-neutral-defense" aria-labelledby="pilot-range-heading">
        <div className={styles.sectionTitle}><p className="eyebrow">立ち回り・防御</p><h2 id="pilot-range-heading">距離別の立ち回り</h2><p>相手視点の対策ではなく、まず自分が選ぶ行動を距離ごとに整理しています。</p></div>
        {profile.ranges.length ? <div className={styles.rangeTable} role="table" aria-label={`${characterName}の距離別行動`}>{profile.ranges.map((row) => <div role="row" key={row.range}><strong role="rowheader">{row.range}</strong><p role="cell"><span>主に使う技</span>{normalizePublicCopy(row.actions)}</p><p role="cell"><span>目的</span>{normalizePublicCopy(row.purpose)}</p><p role="cell"><span>注意点</span>{normalizePublicCopy(row.caution)}</p></div>)}</div> : <div className="empty-state"><p>距離別の攻略情報は未掲載です。</p></div>}
      </section>

      <section className={styles.related} id="related-players">
        <div className={styles.subheading}><div><p className="eyebrow">プレイヤー</p><h2>関連プレイヤー</h2></div></div>
        {players.length ? <div className={styles.playerGrid} tabIndex={0} aria-label="関連プレイヤー（横スクロール）">{players.slice(0, 6).map((player) => <article className={styles.playerCard} key={player.id}>{player.imageUrl ? <Image src={player.imageUrl} alt={player.displayName} width={96} height={96} sizes="64px" /> : <div className={styles.playerFallback}><span aria-hidden="true">{player.displayName.slice(0, 1)}</span><small>選手ビジュアルは今後のアップデートで追加予定です</small></div>}<div><h3><Link href={`/players/${player.slug}`}>{player.displayName}</Link></h3><dl><div><dt>チーム</dt><dd>{player.teamName ?? "未登録"}</dd></div><div><dt>メインキャラクター</dt><dd>{player.characters.find((item) => item.role === "main")?.characterName ?? "未登録"}</dd></div><div><dt>地域</dt><dd>{player.region ?? player.countryCode ?? "未登録"}</dd></div></dl>{socialLinks(player).length ? <div className={styles.socials}>{socialLinks(player).map(([label, url]) => <a href={url} target="_blank" rel="noopener noreferrer" key={label}>{label} ↗</a>)}</div> : null}</div></article>)}</div> : <div className="empty-state"><p>関連プレイヤーは未掲載です。</p></div>}
      </section>

      <section className={styles.related} id="related-videos">
        <div className={styles.subheading}><div><p className="eyebrow">動画</p><h2>おすすめ動画</h2></div><Link href={appendDevicePreviewToken(`/characters/${characterSlug}/videos`, previewToken)}>動画一覧 →</Link></div>
        {videos.length ? <div className={styles.videoList} tabIndex={0} aria-label="おすすめ動画（横スクロール）">{videos.slice(0, 6).map((video) => <VideoCard video={video} publishedDate={formatVideoPublishedDate(video.publishedAt)} key={video.id} />)}</div> : <div className="empty-state"><p>関連動画は未掲載です。</p></div>}
      </section>
    </section>
  );
}
