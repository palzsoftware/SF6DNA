import Image from "next/image";
import Link from "next/link";
import { PilotComboCard } from "@/components/pilot-combo-card";
import { VideoCard } from "@/components/video-card";
import { appendDevicePreviewToken, type DevicePreviewBundle } from "@/lib/device-preview";
import { formatVideoPublishedDate, type VideoSummary } from "@/lib/event-media";
import type { PlayerDetail } from "@/types/player";
import styles from "./character-detail-pilot.module.css";

const sectionCards = [
  ["moves", "技", "技名・用途・フレーム", "moves"],
  ["combos", "コンボ", "始動・用途・リソース", "combos"],
  ["setups", "セットプレイ / 起き攻め", "開始条件・手順・終了状況", "setups"],
  ["sequences", "連携", "入力・狙い・リスク", "sequences"],
] as const;

function socialLinks(player: PlayerDetail) {
  return [
    ["X", player.xUrl],
    ["YouTube", player.youtubeUrl],
    ["Twitch", player.twitchUrl],
    ["Web", player.websiteUrl],
  ].filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].startsWith("https://"));
}

function numericDifficulty(value: string | null) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 5 ? parsed : null;
}

export function CharacterDetailPilot({
  characterName,
  characterSlug,
  previewToken,
  bundle,
  players,
  videos,
}: {
  characterName: string;
  characterSlug: string;
  previewToken: string;
  bundle: DevicePreviewBundle;
  players: PlayerDetail[];
  videos: VideoSummary[];
}) {
  const counts = {
    moves: bundle.moves.length,
    combos: bundle.combos.length,
    setups: bundle.setups.length,
    sequences: bundle.sequences.length,
  };
  const comboSamples = bundle.combos.slice(0, 3);

  return (
    <section className={styles.pilot} aria-labelledby="pilot-heading">
      <div className={styles.heading}>
        <div>
          <p className="eyebrow">CHARACTER DETAIL PILOT</p>
          <h2 id="pilot-heading">{characterName} 詳細情報</h2>
        </div>
        <span>Preview限定</span>
      </div>

      <p className={styles.lead}>
        公開条件を満たしていない攻略データは、公開ページに出さず、この確認画面だけで構成と操作を検証します。
      </p>

      <div className={styles.sectionGrid}>
        {sectionCards.map(([key, title, description, path]) => (
          <Link
            href={appendDevicePreviewToken(`/characters/${characterSlug}/${path}`, previewToken)}
            className={styles.sectionCard}
            key={key}
          >
            <span>{counts[key]}件</span>
            <strong>{title}</strong>
            <small>{description}</small>
            <b>確認画面を開く →</b>
          </Link>
        ))}
        <article className={styles.sectionCard} id="pilot-neutral-defense">
          <span>STRUCTURE</span>
          <strong>立ち回り / 防御</strong>
          <small>距離・状況・リスク単位で整理する共通枠です。</small>
          <b>検証済み情報から順次表示</b>
        </article>
      </div>

      <section className={styles.comboSection} id="pilot-combos">
        <div className={styles.subheading}>
          <div>
            <p className="eyebrow">COMBO CARD</p>
            <h3>コンボカード操作</h3>
          </div>
          <Link href={appendDevicePreviewToken(`/characters/${characterSlug}/combos`, previewToken)}>
            すべて確認する →
          </Link>
        </div>
        {comboSamples.length ? (
          <div className={styles.comboList}>
            {comboSamples.map((combo) => (
              <PilotComboCard
                key={combo.id}
                previewToken={previewToken}
                combo={{
                  id: combo.id,
                  href: `/combos/${combo.slug}`,
                  name: combo.name,
                  purpose: combo.purpose,
                  damage: combo.damage,
                  drive: combo.driveCost,
                  sa: combo.saCost,
                  difficulty: numericDifficulty(combo.difficulty),
                  verificationStatus: combo.verificationStatus,
                  preview: true,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state"><p>確認対象のコンボ候補はありません。</p></div>
        )}
      </section>

      <section className={styles.mediaPolicy} id="pilot-motion-media">
        <div>
          <p className="eyebrow">MOTION MEDIA</p>
          <h3>動作メディア</h3>
        </div>
        <p>
          GIF・WebP・動画がある項目だけカード内に表示します。未収録時は大きな空枠を出さず、poster・読込中・エラー・reduced motionを共通仕様で扱います。
        </p>
      </section>

      <section id="related-players">
        <div className={styles.subheading}>
          <div><p className="eyebrow">PLAYERS</p><h3>関連プレイヤー</h3></div>
          <Link href={appendDevicePreviewToken(`/characters/${characterSlug}/players`, previewToken)}>一覧を見る →</Link>
        </div>
        {players.length ? (
          <div className={styles.playerGrid}>
            {players.map((player) => (
              <article className={styles.playerCard} key={player.id}>
                {player.imageUrl ? (
                  <Image src={player.imageUrl} alt={player.displayName} width={160} height={160} sizes="96px" />
                ) : (
                  <div className={styles.playerFallback}>
                    <span aria-hidden="true">{player.displayName.slice(0, 1)}</span>
                    <small>選手ビジュアルは今後のアップデートで追加予定です</small>
                  </div>
                )}
                <div className={styles.playerBody}>
                  <h4><Link href={`/players/${player.slug}`}>{player.displayName}</Link></h4>
                  <p>{[player.teamName, player.region ?? player.countryCode].filter(Boolean).join(" / ") || "公開プロフィール"}</p>
                  {socialLinks(player).length ? (
                    <div className={styles.socials}>
                      {socialLinks(player).map(([label, url]) => (
                        <a href={url} target="_blank" rel="noopener noreferrer" key={label}>{label} ↗</a>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state"><p>表示できる関連プレイヤーはありません。</p></div>
        )}
      </section>

      <section id="related-videos">
        <div className={styles.subheading}>
          <div><p className="eyebrow">VIDEOS</p><h3>関連動画</h3></div>
          <Link href={appendDevicePreviewToken(`/characters/${characterSlug}/videos`, previewToken)}>一覧を見る →</Link>
        </div>
        {videos.length ? (
          <div className={styles.videoGrid}>
            {videos.map((video) => (
              <VideoCard video={video} publishedDate={formatVideoPublishedDate(video.publishedAt)} key={video.id} />
            ))}
          </div>
        ) : (
          <div className="empty-state"><p>表示できる関連動画はありません。</p></div>
        )}
      </section>
    </section>
  );
}
