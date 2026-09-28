import Image from "next/image";
import Link from "next/link";
import { CharacterPreferenceActions } from "@/components/character-preference-actions";
import { CharacterTabs } from "@/components/character-tabs";
import { MoveMotionMedia } from "@/components/move-motion-media";
import { PilotComboCard } from "@/components/pilot-combo-card";
import { VideoCard } from "@/components/video-card";
import { appendDevicePreviewToken, type DevicePreviewBundle } from "@/lib/device-preview";
import { formatVideoPublishedDate, type VideoSummary } from "@/lib/event-media";
import type { CharacterDetailV21Profile } from "@/lib/character-detail-v21";
import { isInternalMoveNote, normalizePublicCopy } from "@/lib/public-copy";
import { releaseFeatures } from "@/lib/release-features";
import { presentSource } from "@/lib/source-presentation";
import type { CharacterDetail } from "@/types/character";
import type { PlayerDetail } from "@/types/player";
import styles from "./jp-character-detail.module.css";

type Move = DevicePreviewBundle["moves"][number];

const moveLabels: Record<string, string> = {
  normal: "通常技", unique: "特殊技", target_combo: "ターゲットコンボ",
  special: "必殺技", throw: "投げ", super: "スーパーアーツ", system: "共通システム",
};

function verifiedLabel(status: string | null | undefined) {
  if (status === "verified") return "確認済み";
  if (status === "reviewed") return "編集確認済み・実戦検証前";
  return "内容を確認中・実戦検証前";
}

function known(value: string | number | null | undefined, fallback = "未確認") {
  return value === null || value === undefined || value === "" ? fallback : String(value);
}

function moveSummary(value: string | null) {
  return value && !isInternalMoveNote(value) ? normalizePublicCopy(value) : null;
}

function MoveCard({ move }: { move: Move }) {
  return <article className={styles.moveCard}>
    <div className={styles.moveHead}>
      <div><small>{verifiedLabel(move.frame?.verificationStatus)}</small><h3>{move.name}</h3>
        {moveSummary(move.usageSummary) ? <p>{moveSummary(move.usageSummary)}</p> : null}</div>
      <div className={styles.motion}>
        {move.media ? <MoveMotionMedia media={move.media} title={move.name} className={styles.motionAsset} />
          : <span aria-label={`${move.name}の動作メディアは未登録`}>動作映像は未掲載</span>}
      </div>
    </div>
    <div className={styles.commands} aria-label={`${move.name}のコマンド`}>
      {move.commands?.length ? move.commands.map((command, index) =>
        <div key={`${command.scheme}-${command.sortOrder ?? index}-${index}`}>
          <span>{command.scheme === "classic" ? "クラシック" : command.scheme === "modern" ? "モダン" : command.scheme}</span>
          <code>{command.commandText ?? command.numericNotation ?? command.buttonNotation ?? "コマンドを確認中"}</code>
          {command.conditionText ? <small>{command.conditionText}</small> : null}
        </div>) : <p>コマンドを確認中</p>}
    </div>
    <dl className={styles.frames}>
      <div><dt>発生</dt><dd>{known(move.frame?.startup, "確認中")}</dd></div>
      <div><dt>ガード時</dt><dd>{known(move.frame?.onBlock, "確認中")}</dd></div>
      <div><dt>ダメージ</dt><dd>{known(move.frame?.damage, "確認中")}</dd></div>
    </dl>
  </article>;
}

export function JpCharacterDetail({ character, previewToken, previewActive, bundle, profile, players, videos }: {
  character: CharacterDetail;
  previewToken: string | null;
  previewActive: boolean;
  bundle: DevicePreviewBundle;
  profile: CharacterDetailV21Profile;
  players: PlayerDetail[];
  videos: VideoSummary[];
}) {
  const groups = Object.entries(bundle.moves.reduce<Record<string, Move[]>>((result, move) => {
    (result[move.moveType ?? "other"] ??= []).push(move);
    return result;
  }, {}));
  const showStrategyLinks = releaseFeatures.publicStrategyContent || previewActive;
  const localLink = (path: string) => appendDevicePreviewToken(path, previewToken);

  return <div className={`site-shell ${styles.page}`}>
    <header className={styles.hero}>
      <div>
        <p className="eyebrow">キャラクター</p><h1>{character.name}</h1>
        {character.nameEn ? <p>{character.nameEn}</p> : null}
        <p className={styles.lead}>{normalizePublicCopy(profile.tagline)}</p>
        <div className={styles.chips}>
          {character.archetypeLabel ? <span>{character.archetypeLabel}</span> : null}
          {character.rangeLabel ? <span>{character.rangeLabel}</span> : null}
          {character.difficulty ? <span>難易度 {character.difficulty}/5</span> : null}
          {character.releaseDate ? <span>参戦日 {character.releaseDate}</span> : null}
        </div>
        <CharacterPreferenceActions slug={character.slug} />
      </div>
      {character.imageUrl ? <div className={styles.portrait}>
        <Image src={character.imageUrl} alt={character.name} width={760} height={760} sizes="(max-width: 720px) 100vw, 42vw" priority />
      </div> : null}
    </header>

    {previewActive ? <aside className={styles.notice}><strong>実機確認プレビュー</strong><p>この画面には掲載前の情報も含まれます。掲載前の内容は一般公開には反映されていません。</p></aside> : null}
    <CharacterTabs slug={character.slug} active="overview" previewToken={previewToken} />

    <div className={styles.sections}>
      <section id="pilot-overview" className={styles.section}>
        <p className="eyebrow">基本ガイド</p><h2>{normalizePublicCopy(profile.tagline)}</h2>
        <p>{normalizePublicCopy(profile.winPath)}</p>
        <div className={styles.facts}>
          <div><strong>得意距離</strong><span>{character.rangeLabel ?? "確認中"}</span></div>
          <div><strong>タイプ</strong><span>{character.archetypeLabel ?? "確認中"}</span></div>
          <div><strong>難易度</strong><span>{character.difficulty ? `${character.difficulty} / 5` : "未評価"}</span></div>
          <div><strong>最初の練習</strong><span>{normalizePublicCopy(profile.firstLesson)}</span></div>
        </div>
        <div className={styles.duo}>
          <article><h3>強み</h3><p>{normalizePublicCopy(profile.strength)}</p></article>
          <article><h3>注意点</h3><p>{normalizePublicCopy(profile.weakness)}</p></article>
        </div>
      </section>

      <section className={styles.section}>
        <h2>基本の勝ち筋</h2>
        <ol className={styles.steps}>{profile.gameplan.map((step, index) => <li key={`${step.label}-${index}`}>
          <span>手順 {index + 1}</span><div><h3>{normalizePublicCopy(step.title)}</h3><p>{normalizePublicCopy(step.body)}</p><small>{normalizePublicCopy(step.caution)}</small></div>
        </li>)}</ol>
        {character.sources.length ? <div className={styles.rail} tabIndex={0} aria-label="基本方針の情報源（横スクロール）">
          {character.sources.slice(0, 8).map(source => {
            const item = presentSource(source.sourceType, source.publisher, source.url);
            return <a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer">{item.badge}・{item.cta} ↗</a>;
          })}
        </div> : null}
      </section>

      <section id="pilot-moves" className={styles.section}>
        <div className={styles.heading}><div><p className="eyebrow">技データ</p><h2>技一覧・コマンド・主要フレーム</h2>
          <p>数値の「確認中」は未確定の項目です。</p></div>
          <a href="https://www.streetfighter.com/6/ja-jp/character/jp/frame" target="_blank" rel="noopener noreferrer">CAPCOM公式フレームを見る ↗</a>
        </div>
        {groups.length ? groups.map(([type, moves], index) => <details className={styles.group} key={type} open={index === 0}>
          <summary><strong>{moveLabels[type] ?? "その他"}</strong><span>{moves.length}技</span></summary>
          <div className={styles.moveList}>{moves.map(move => <MoveCard key={move.id} move={move} />)}</div>
        </details>) : <p>技データは未掲載です。</p>}
      </section>

      <section id="pilot-combos" className={styles.section}>
        <div className={styles.heading}><h2>まず確認するコンボ</h2>
          {showStrategyLinks ? <Link href={localLink(`/characters/jp/combos`)}>コンボ一覧を見る →</Link> : null}</div>
        {bundle.combos.length ? <div className={styles.comboRail} tabIndex={0} aria-label="コンボ（横スクロール）">
          {bundle.combos.slice(0, 3).map(combo => <PilotComboCard key={combo.id} previewToken={previewToken} combo={{
            id: combo.id, href: `/combos/${combo.slug}`, name: combo.name, category: combo.category,
            purpose: combo.purpose ? normalizePublicCopy(combo.purpose) : null, damage: combo.damage,
            drive: combo.driveCost, sa: combo.saCost,
            difficulty: Number.isInteger(Number(combo.difficulty)) && Number(combo.difficulty) >= 1 && Number(combo.difficulty) <= 5 ? Number(combo.difficulty) : null,
            verificationStatus: combo.verificationStatus, preview: true,
            command: combo.command ? normalizePublicCopy(combo.command) : null,
            startCondition: combo.startCondition ? normalizePublicCopy(combo.startCondition) : null,
            endCondition: combo.endCondition ? normalizePublicCopy(combo.endCondition) : null,
            position: combo.position, patch: combo.patch, sourceLabel: combo.sourceLabel, sourceUrl: combo.sourceUrl,
          }} />)}
        </div> : <p>コンボは未掲載です。</p>}
      </section>

      <section className={styles.duo} aria-label="セットプレイと連携">
        <div id="pilot-setplay" className={styles.section}>
          <div className={styles.heading}><h2>セットプレイ</h2>{showStrategyLinks ? <Link href={localLink("/characters/jp/setups")}>セットプレイ一覧を見る →</Link> : null}</div>
          {bundle.setups.slice(0, 3).map(setup => <details className={styles.entry} key={setup.id}>
            <summary>{setup.name} <small>{verifiedLabel(setup.verificationStatus)}</small></summary>
            <p>{known(setup.description, "手順は未確認です。")}</p>
            <dl><div><dt>コマンド</dt><dd>{known(setup.command)}</dd></div><div><dt>開始条件</dt><dd>{known(setup.startCondition)}</dd></div>
              <div><dt>成功条件</dt><dd>{known(setup.successCondition)}</dd></div><div><dt>相手の選択肢</dt><dd>{known(setup.opponentOptions)}</dd></div>
              <div><dt>失敗条件</dt><dd>{known(setup.failureCondition)}</dd></div><div><dt>位置</dt><dd>{known(setup.position)}</dd></div>
              <div><dt>有利状況</dt><dd>{known(setup.frameAdvantage)}</dd></div><div><dt>ダメージ</dt><dd>{known(setup.damage)}</dd></div>
              <div><dt>ドライブゲージ使用量</dt><dd>{known(setup.driveCost)}</dd></div><div><dt>SAゲージ使用量</dt><dd>{known(setup.saCost)}</dd></div>
              <div><dt>対応バージョン</dt><dd>{known(setup.patch)}</dd></div>
              <div><dt>情報源</dt><dd>{setup.sourceUrl ? <a href={setup.sourceUrl} target="_blank" rel="noopener noreferrer">{known(setup.sourceLabel, "情報源")} ↗</a> : "参考リンクなし"}</dd></div></dl>
          </details>)}
          {!bundle.setups.length ? <p>セットプレイは未掲載です。</p> : null}
        </div>
        <div id="pilot-sequences" className={styles.section}>
          <div className={styles.heading}><h2>連携・対策</h2>{showStrategyLinks ? <Link href={localLink("/characters/jp/sequences")}>連携・対策一覧を見る →</Link> : null}</div>
          {bundle.sequences.slice(0, 3).map(sequence => <details className={styles.entry} key={sequence.id}>
            <summary>{sequence.name} <small>{verifiedLabel(sequence.verificationStatus)}</small></summary>
            <p>{known(sequence.sequenceText, "コマンド未確認")}</p>
            {sequence.purpose ? <p>{normalizePublicCopy(sequence.purpose)}</p> : null}
            {sequence.notes ? <p>{normalizePublicCopy(sequence.notes)}</p> : null}
            <dl><div><dt>成立条件</dt><dd>{known(sequence.condition)}</dd></div><div><dt>連係の隙間</dt><dd>{known(sequence.gap)}</dd></div>
              <div><dt>投げ</dt><dd>{known(sequence.throwOption)}</dd></div><div><dt>打撃</dt><dd>{known(sequence.strikeOption)}</dd></div>
              <div><dt>ドライブインパクトへの対応</dt><dd>{known(sequence.driveImpactOption)}</dd></div>
              <div><dt>反撃可否</dt><dd>{known(sequence.punishability)}</dd></div><div><dt>ダメージ</dt><dd>{known(sequence.damage)}</dd></div>
              <div><dt>ドライブゲージ使用量</dt><dd>{known(sequence.driveCost)}</dd></div><div><dt>SAゲージ使用量</dt><dd>{known(sequence.saCost)}</dd></div>
              <div><dt>対応バージョン</dt><dd>{known(sequence.patch)}</dd></div>
              <div><dt>情報源</dt><dd>{sequence.sourceUrl ? <a href={sequence.sourceUrl} target="_blank" rel="noopener noreferrer">{known(sequence.sourceLabel, "情報源")} ↗</a> : "参考リンクなし"}</dd></div></dl>
          </details>)}
          {!bundle.sequences.length ? <p>連携・対策は未掲載です。</p> : null}
        </div>
      </section>

      <section id="pilot-neutral-defense" className={styles.section}>
        <h2>距離別の立ち回り</h2>
        {profile.ranges.length ? <div className={styles.rangeList}>{profile.ranges.map(row => <article key={row.range}>
          <h3>{row.range}</h3><p><strong>主に使う技</strong>{normalizePublicCopy(row.actions)}</p>
          <p><strong>目的</strong>{normalizePublicCopy(row.purpose)}</p><p><strong>注意点</strong>{normalizePublicCopy(row.caution)}</p>
        </article>)}</div> : <p>距離別の攻略情報は未掲載です。</p>}
      </section>

      <section id="related-players" className={styles.section}>
        <h2>関連プレイヤー</h2>
        {players.length ? <div className={styles.rail} tabIndex={0} aria-label="関連プレイヤー（横スクロール）">
          {players.slice(0, 6).map(player => <Link className={styles.player} key={player.id} href={`/players/${player.slug}`}>
            {player.imageUrl ? <Image src={player.imageUrl} alt="" width={64} height={64} sizes="64px" /> : null}
            <strong>{player.displayName}</strong><span>{player.teamName ?? ""}</span>
          </Link>)}
        </div> : <p>関連プレイヤーは未掲載です。</p>}
      </section>
      <section id="related-videos" className={styles.section}>
        <div className={styles.heading}><h2>関連動画</h2><Link href={localLink("/characters/jp/videos")}>このキャラの動画を探す →</Link></div>
        {videos.length ? <div className={styles.videoRail} tabIndex={0} aria-label="関連動画（横スクロール）">
          {videos.slice(0, 6).map(video => <VideoCard key={video.id} video={video} publishedDate={formatVideoPublishedDate(video.publishedAt)} />)}
        </div> : <p>関連動画は未掲載です。</p>}
      </section>
      <section id="sources" className={styles.section}>
        <h2>情報源</h2>
        {character.sources.length ? <ul className={styles.sources}>{character.sources.map(source => {
          const item = presentSource(source.sourceType, source.publisher, source.url);
          return <li key={source.id}><span>{item.badge}</span><strong>{source.title}</strong>
            <a href={source.url} target="_blank" rel="noopener noreferrer">{item.cta} ↗</a></li>;
        })}</ul> : <p>公開済みの出典情報はまだありません。</p>}
      </section>
    </div>
  </div>;
}
