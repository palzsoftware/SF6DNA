import type { ReferenceKind } from "@/lib/admin-reference";

type Row = Record<string, string | number | boolean | null | undefined>;
type Props = { kind: ReferenceKind; action: (formData: FormData) => void | Promise<void>; value?: Row | null };
const input = (value: unknown) => value === null || value === undefined ? "" : String(value);

export function AdminReferenceForm({ kind, action, value }: Props) {
  return (
    <form action={action} className="admin-form">
      <div className="admin-form-grid">
        {kind !== "videos" ? <label><span>Slug *</span><input name="slug" required defaultValue={input(value?.slug)} /></label> : <label><span>Slug</span><input name="slug" defaultValue={input(value?.slug)} /></label>}
        {kind === "players" ? <PlayerFields value={value} /> : null}
        {kind === "tournaments" ? <TournamentFields value={value} /> : null}
        {kind === "videos" ? <VideoFields value={value} /> : null}
        {kind === "glossary" ? <GlossaryFields value={value} /> : null}
        <label><span>公開状態</span><select name="status" defaultValue={input(value?.status) || "draft"}><option value="draft">draft</option><option value="published">published</option><option value="archived">archived</option></select></label>
      </div>
      <button className="button-primary" type="submit">{value ? "保存" : "draftで作成"}</button>
    </form>
  );
}

function PlayerFields({ value }: { value?: Row | null }) { return <>
  <label><span>表示名 *</span><input name="display_name" required defaultValue={input(value?.display_name)} /></label>
  <label><span>本名</span><input name="real_name" defaultValue={input(value?.real_name)} /></label>
  <label><span>国コード</span><input name="country_code" defaultValue={input(value?.country_code)} placeholder="JP" /></label>
  <label><span>地域</span><input name="region" defaultValue={input(value?.region)} /></label>
  <label><span>Player type *</span><input name="player_type" required defaultValue={input(value?.player_type)} placeholder="pro / specialist / streamer / coach" /></label>
  <label><span>チーム</span><input name="team_name" defaultValue={input(value?.team_name)} /></label>
  <label className="admin-span-2"><span>Bio</span><textarea name="bio" rows={4} defaultValue={input(value?.bio)} /></label>
  <label className="admin-span-2"><span>画像URL</span><input name="image_url" type="url" defaultValue={input(value?.image_url)} /></label>
  <label><span>YouTube</span><input name="youtube_url" type="url" defaultValue={input(value?.youtube_url)} /></label>
  <label><span>Twitch</span><input name="twitch_url" type="url" defaultValue={input(value?.twitch_url)} /></label>
  <label><span>X</span><input name="x_url" type="url" defaultValue={input(value?.x_url)} /></label>
  <label><span>Website</span><input name="website_url" type="url" defaultValue={input(value?.website_url)} /></label>
  <label className="admin-check"><input name="is_active" type="checkbox" defaultChecked={value ? Boolean(value.is_active) : true} /><span>現役</span></label>
</>; }

function TournamentFields({ value }: { value?: Row | null }) { return <>
  <label><span>大会名 *</span><input name="name" required defaultValue={input(value?.name)} /></label>
  <label><span>シリーズ</span><input name="series_name" defaultValue={input(value?.series_name)} /></label>
  <label><span>開始日</span><input name="start_date" type="date" defaultValue={input(value?.start_date)} /></label>
  <label><span>終了日</span><input name="end_date" type="date" defaultValue={input(value?.end_date)} /></label>
  <label><span>地域</span><input name="region" defaultValue={input(value?.region)} /></label>
  <label><span>会場</span><input name="venue" defaultValue={input(value?.venue)} /></label>
  <label><span>形式</span><input name="event_type" defaultValue={input(value?.event_type)} placeholder="offline / online / hybrid" /></label>
  <label><span>規模</span><input name="scale" defaultValue={input(value?.scale)} /></label>
  <label className="admin-span-2"><span>公式URL</span><input name="official_url" type="url" defaultValue={input(value?.official_url)} /></label>
  <label className="admin-span-2"><span>補足</span><textarea name="notes" rows={3} defaultValue={input(value?.notes)} /></label>
</>; }

function VideoFields({ value }: { value?: Row | null }) { return <>
  <label><span>Platform *</span><input name="platform" required defaultValue={input(value?.platform) || "youtube"} /></label>
  <label><span>External ID</span><input name="external_id" defaultValue={input(value?.external_id)} /></label>
  <label className="admin-span-2"><span>URL *</span><input name="url" type="url" required defaultValue={input(value?.url)} /></label>
  <label className="admin-span-2"><span>タイトル *</span><input name="title" required defaultValue={input(value?.title)} /></label>
  <label className="admin-span-2"><span>説明</span><textarea name="description" rows={4} defaultValue={input(value?.description)} /></label>
  <label className="admin-span-2"><span>サムネイルURL</span><input name="thumbnail_url" type="url" defaultValue={input(value?.thumbnail_url)} /></label>
  <label><span>チャンネル</span><input name="channel_name" defaultValue={input(value?.channel_name)} /></label>
  <label><span>公開日時</span><input name="published_at" type="datetime-local" defaultValue={input(value?.published_at).slice(0,16)} /></label>
  <label><span>動画種別</span><input name="video_type" defaultValue={input(value?.video_type)} placeholder="guide / combo / counter / tournament" /></label>
  <label><span>秒数</span><input name="duration_seconds" type="number" defaultValue={input(value?.duration_seconds)} /></label>
</>; }

function GlossaryFields({ value }: { value?: Row | null }) { return <>
  <label><span>用語 *</span><input name="term" required defaultValue={input(value?.term)} /></label>
  <label><span>カテゴリ</span><input name="category" defaultValue={input(value?.category)} /></label>
  <label><span>初心者レベル</span><input name="beginner_level" defaultValue={input(value?.beginner_level)} /></label>
  <label className="admin-span-2"><span>短い説明</span><textarea name="short_definition" rows={2} defaultValue={input(value?.short_definition)} /></label>
  <label className="admin-span-2"><span>定義 *</span><textarea name="definition" required rows={5} defaultValue={input(value?.definition)} /></label>
</>; }
