import Image from "next/image";
import Link from "next/link";
import { PilotComboCard } from "@/components/pilot-combo-card";
import { getCharacterDetailV21Profile } from "@/lib/character-detail-v21";
import { appendDevicePreviewToken, type DevicePreviewBundle } from "@/lib/device-preview";
import type { VideoSummary } from "@/lib/event-media";
import { presentSource } from "@/lib/source-presentation";
import type { SourceReference } from "@/types/character";
import type { PlayerDetail } from "@/types/player";
import styles from "./character-detail-pilot.module.css";

function socialLinks(player: PlayerDetail) {
  return [["X", player.xUrl], ["YouTube", player.youtubeUrl], ["Twitch", player.twitchUrl], ["Web", player.websiteUrl]]
    .filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].startsWith("https://"));
}

function numericDifficulty(value: string | null) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 5 ? parsed : null;
}

function verificationLabel(value: string | null) {
  return value === "verified" ? "確認済み" : "確認用候補";
}

function setupSteps(description: string | null) {
  if (!description) return [];
  return description.split(/(?:\r?\n|\s*(?:→|＞|>)\s*)/)
    .map((step) => step.replace(/^\s*\d+[.)、]\s*/, "").trim()).filter(Boolean).slice(0, 5);
}

export function CharacterDetailPilot({
  characterName, characterSlug, previewToken, bundle, players, videos,
  archetypeLabel, rangeLabel, difficulty, sources,
}: {
  characterName: string;
  characterSlug: string;
  previewToken: string;
  bundle: DevicePreviewBundle;
  players: PlayerDetail[];
  videos: VideoSummary[];
  archetypeLabel: string | null;
  rangeLabel: string | null;
  difficulty: number | null;
  sources: SourceReference[];
}) {
  const profile = getCharacterDetailV21Profile(characterSlug);
  if (!profile) return null;
  const comboSamples = bundle.combos.slice(0, 3);
  const setupSamples = bundle.setups.slice(0, 3);
  const sequenceSamples = bundle.sequences.slice(0, 3);
  const sourceSamples = sources.slice(0, 3);

  return (
    <section className={styles.pilot} aria-label={`${characterName} Character Detail V2.1`}>
      <section className={styles.overview} id="pilot-overview">
        <div className={styles.overviewLead}>
          <p className="eyebrow">HOW TO PLAY</p>
          <h2>{profile.tagline}</h2>
          <p>{profile.winPath}</p>
          <div className={styles.previewNote}>Preview限定・攻略候補の公開ステータスは変更していません</div>
        </div>
        <dl className={styles.quickFacts} aria-label="クイックファクト">
          <div><dt>得意距離</dt><dd>{rangeLabel ?? "確認中"}</dd></div>
          <div><dt>タイプ</dt><dd>{archetypeLabel ?? "確認中"}</dd></div>
          <div><dt>難易度</dt><dd>{difficulty ? `${difficulty} / 5` : "未評価"}</dd></div>
          <div><dt>最初の練習</dt><dd>{profile.firstLesson}</dd></div>
        </dl>
      </section>

      <section className={styles.comparison} aria-labelledby="pilot-profile-heading">
        <div className={styles.sectionTitle}><p className="eyebrow">PROFILE</p><h2 id="pilot-profile-heading">強みと注意点</h2></div>
        <div className={styles.strength}><span>STRENGTH</span><h3>活かしたい強み</h3><p>{profile.strength}</p></div>
        <div className={styles.weakness}><span>CAUTION</span><h3>崩されやすい状況</h3><p>{profile.weakness}</p></div>
      </section>

      <section className={styles.gameplan} aria-labelledby="pilot-gameplan-heading">
        <div className={styles.sectionTitle}><p className="eyebrow">BASIC GAMEPLAN</p><h2 id="pilot-gameplan-heading">基本の勝ち筋</h2><p>何を使うか、どの距離で使うか、何に注意するかを順番に確認します。</p></div>
        <ol className={styles.gameplanSteps}>
          {profile.gameplan.map((step) => <li key={step.label}><span>{step.label}</span><div><h3>{step.title}</h3><p>{step.body}</p><small>{step.caution}</small></div></li>)}
        </ol>
        {sourceSamples.length ? <div className={styles.inlineSources} aria-label="基本方針の情報源">{sourceSamples.map((source) => {
          const presentation = presentSource(source.sourceType, source.publisher, source.url);
          return <a href={source.url} target="_blank" rel="noopener noreferrer" key={source.id}><span>{presentation.badge}</span>{presentation.cta} ↗</a>;
        })}</div> : null}
      </section>

      <section className={styles.comboSection} id="pilot-combos" aria-labelledby="pilot-combos-heading">
        <div className={styles.subheading}><div><p className="eyebrow">COMBO</p><h2 id="pilot-combos-heading">まず確認するコンボ</h2><p>用途と消費ゲージを一覧で比べ、詳細をその場で展開できます。</p></div><Link href={appendDevicePreviewToken(`/characters/${characterSlug}/combos`, previewToken)}>すべて確認する →</Link></div>
        {comboSamples.length ? <div className={styles.comboList}>{comboSamples.map((combo) => <PilotComboCard key={combo.id} previewToken={previewToken} combo={{ id: combo.id, href: `/combos/${combo.slug}`, name: combo.name, purpose: combo.purpose, damage: combo.damage, drive: combo.driveCost, sa: combo.saCost, difficulty: numericDifficulty(combo.difficulty), verificationStatus: combo.verificationStatus, preview: true }} />)}</div> : <div className="empty-state"><p>確認対象のコンボ候補はありません。</p></div>}
      </section>

      <section className={styles.strategySplit}>
        <div id="pilot-setplay">
          <div className={styles.subheading}><div><p className="eyebrow">SETPLAY</p><h2>セットプレイ</h2><p>文章ではなく、起点からの手順で確認します。</p></div><Link href={appendDevicePreviewToken(`/characters/${characterSlug}/setups`, previewToken)}>一覧 →</Link></div>
          <div className={styles.timelineList}>{setupSamples.map((setup) => {
            const steps = setupSteps(setup.description);
            return <details key={setup.id} open={setup === setupSamples[0]}><summary><span>{verificationLabel(setup.verificationStatus)}</span><strong>{setup.name}</strong></summary><div>{steps.length ? <ol>{steps.map((step, index) => <li key={`${setup.id}-${index}`}>{step}</li>)}</ol> : <p>手順データは個別画面で確認してください。</p>}<dl><div><dt>位置</dt><dd>{setup.position ?? "未記録"}</dd></div><div><dt>有利状況</dt><dd>{setup.frameAdvantage ?? "未記録"}</dd></div></dl></div></details>;
          })}{!setupSamples.length ? <div className="empty-state"><p>確認対象のセットプレイ候補はありません。</p></div> : null}</div>
        </div>

        <div id="pilot-sequences">
          <div className={styles.subheading}><div><p className="eyebrow">PRESSURE</p><h2>連携・対策</h2><p>入力、目的、注意点を一つずつ展開します。</p></div><Link href={appendDevicePreviewToken(`/characters/${characterSlug}/sequences`, previewToken)}>一覧 →</Link></div>
          <div className={styles.sequenceList}>{sequenceSamples.map((sequence) => <details key={sequence.id} open={sequence === sequenceSamples[0]}><summary><span>{verificationLabel(sequence.verificationStatus)}</span><strong>{sequence.name}</strong></summary><div><p className={styles.command}>{sequence.sequenceText ?? "入力は個別画面で確認"}</p>{sequence.notes ? <p>{sequence.notes}</p> : null}<small>{sequence.sequenceType ?? "連携"}</small></div></details>)}{!sequenceSamples.length ? <div className="empty-state"><p>確認対象の連携候補はありません。</p></div> : null}</div>
        </div>
      </section>

      <section className={styles.rangeSection} id="pilot-neutral-defense" aria-labelledby="pilot-range-heading">
        <div className={styles.sectionTitle}><p className="eyebrow">NEUTRAL / DEFENSE</p><h2 id="pilot-range-heading">距離別の立ち回り</h2><p>相手視点の対策ではなく、まず自分が選ぶ行動を距離ごとに整理しています。</p></div>
        <div className={styles.rangeTable} role="table" aria-label={`${characterName}の距離別行動`}>{profile.ranges.map((row) => <div role="row" key={row.range}><strong role="rowheader">{row.range}</strong><p role="cell"><span>主に使う技</span>{row.actions}</p><p role="cell"><span>目的</span>{row.purpose}</p><p role="cell"><span>注意点</span>{row.caution}</p></div>)}</div>
      </section>

      <section className={styles.related} id="related-players">
        <div className={styles.subheading}><div><p className="eyebrow">PLAYERS</p><h2>関連プレイヤー</h2></div></div>
        {players.length ? <div className={styles.playerGrid}>{players.slice(0, 6).map((player) => <article className={styles.playerCard} key={player.id}>{player.imageUrl ? <Image src={player.imageUrl} alt={player.displayName} width={96} height={96} sizes="64px" /> : <div className={styles.playerFallback}><span aria-hidden="true">{player.displayName.slice(0, 1)}</span><small>選手ビジュアルは今後のアップデートで追加予定です</small></div>}<div><h3><Link href={`/players/${player.slug}`}>{player.displayName}</Link></h3><p>{[player.teamName, player.region ?? player.countryCode].filter(Boolean).join(" / ") || "公開プロフィール"}</p>{socialLinks(player).length ? <div className={styles.socials}>{socialLinks(player).map(([label, url]) => <a href={url} target="_blank" rel="noopener noreferrer" key={label}>{label} ↗</a>)}</div> : null}</div></article>)}</div> : <div className="empty-state"><p>表示できる関連プレイヤーはありません。</p></div>}
      </section>

      <section className={styles.related} id="related-videos">
        <div className={styles.subheading}><div><p className="eyebrow">VIDEOS</p><h2>おすすめ動画</h2></div><Link href={appendDevicePreviewToken(`/characters/${characterSlug}/videos`, previewToken)}>動画一覧 →</Link></div>
        {videos.length ? <div className={styles.videoList}>{videos.slice(0, 6).map((video) => <a href={video.url} target="_blank" rel="noopener noreferrer" key={video.id}><span>YouTube</span><strong>{video.title}</strong><small>{video.channelName ?? "公開動画"}</small><b>YouTubeで見る ↗</b></a>)}</div> : <div className="empty-state"><p>表示できる関連動画はありません。</p></div>}
      </section>
    </section>
  );
}
