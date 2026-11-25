import { safeExternalUrl } from "../lib/safe-external-url";

export type ProfileSupplementSns = { kind: "X" | "YouTube" | "Twitch"; url: string; basis: string };
export type ProfileSupplementFact = {
  field: string; label: string; value: string | readonly ProfileSupplementSns[];
  basis: string; sourceUrl: string; checkedOn: string; state?: "HISTORICAL";
};
export type PlayerProfileSupplement = {
  playerSlug: string; displayName: string; publicationApproval: "PENDING" | "APPROVED";
  identities: readonly { environment: string; playerId: string }[];
  facts: readonly ProfileSupplementFact[];
};

/** Matching requires environment + real player ID + slug. Pending rows stay hidden unless local preview is on. */
export function boundProfileSupplement(player: { id: string; slug: string }, environment: string,
  rows: readonly PlayerProfileSupplement[], preview = false): PlayerProfileSupplement | null {
  const matches = rows.filter(row => row.playerSlug === player.slug &&
    row.identities.some(id => id.environment === environment && id.playerId === player.id));
  if (matches.length !== 1) return null;
  return preview || matches[0].publicationApproval === "APPROVED" ? matches[0] : null;
}

const SNS_LABEL = { X: "本人のXを見る", YouTube: "YouTubeチャンネルを見る", Twitch: "Twitchを見る" } as const;

export function PlayerProfileSupplementSection({ row, draftPreview = false }: { row: PlayerProfileSupplement; draftPreview?: boolean }) {
  const facts = row.facts.filter(fact => safeExternalUrl(fact.sourceUrl));
  if (!facts.length) return null;
  const text = facts.filter(fact => typeof fact.value === "string");
  const sns = facts.find(fact => fact.field === "sns");
  const links = Array.isArray(sns?.value) ? (sns.value as readonly ProfileSupplementSns[]).filter(link => safeExternalUrl(link.url)) : [];
  return <section className="info-panel" aria-label="プロフィール" data-profile-supplement={row.playerSlug}>
    <h2>プロフィール</h2>
    {draftPreview ? <p>掲載前の確認用です。出典と確認日を添えています。</p> : null}
    <dl>
      {text.map(fact => <div key={fact.field} data-profile-field={fact.field}>
        <dt>{fact.label}{fact.state === "HISTORICAL" ? "（過去・参考）" : ""}</dt>
        <dd>{fact.field === "selfComment" ? <>本人コメント:「{fact.value as string}」</> : fact.value as string}
          {" "}<small>（{fact.basis}・確認日 {fact.checkedOn}・<a href={fact.sourceUrl} target="_blank" rel="noopener noreferrer">出典</a>）</small></dd>
      </div>)}
    </dl>
    {links.length ? <div data-profile-field="sns"><h3>SNS・外部リンク</h3><ul>
      {links.map(link => <li key={link.url}><a href={link.url} target="_blank" rel="noopener noreferrer">{SNS_LABEL[link.kind]} ↗</a> <small>（{link.basis}）</small></li>)}
    </ul></div> : null}
  </section>;
}
