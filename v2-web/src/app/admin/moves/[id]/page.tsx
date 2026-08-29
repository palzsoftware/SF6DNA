import { notFound } from "next/navigation";
import { AdminMoveForm } from "@/components/admin-move-form";
import { requireAdmin } from "@/lib/admin";
import { addFrameVersion, attachMoveEvidenceSource, updateMove } from "../actions";
import { addMoveMotionMedia, archiveMoveMotionMedia } from "./motion-actions";

export default async function EditMovePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const [
    { data: move, error: moveError },
    { data: characters, error: characterError },
    { data: commands, error: commandError },
    { data: frames, error: frameError },
    { data: patches, error: patchError },
    { data: sources, error: sourceError },
    { data: motionMedia, error: motionMediaError },
  ] = await Promise.all([
    supabase.from("moves").select("id, character_id, slug, name_ja, name_en, move_type, strength_variant, description, usage_summary, display_order, status").eq("id", id).maybeSingle(),
    supabase.from("characters").select("id, name_ja").neq("status", "archived").order("display_order"),
    supabase.from("move_commands").select("id, control_scheme, command_text, numeric_notation, button_notation, condition_text, sort_order").eq("move_id", id).order("sort_order"),
    supabase.from("move_frame_data").select("id, startup, active, recovery, on_hit, on_block, damage, drive_damage, super_gain, hit_level, cancel_type, invincibility, notes, valid_from_patch_id, valid_to_patch_id, verification_status, created_at").eq("move_id", id).order("created_at", { ascending: false }),
    supabase.from("patches").select("id, version_label, name, released_at, is_current").order("released_at", { ascending: false, nullsFirst: false }),
    supabase.from("sources").select("id, title, publisher, url, reliability_level").order("published_at", { ascending: false, nullsFirst: false }).limit(200),
    supabase.from("move_motion_media").select("id, media_type, media_url, poster_url, source_url, source_label, status, display_order, created_at").eq("move_id", id).neq("status", "archived").order("display_order").order("created_at"),
  ]);
  if (moveError) throw new Error(moveError.message);
  if (characterError) throw new Error(characterError.message);
  if (commandError) throw new Error(commandError.message);
  if (frameError) throw new Error(frameError.message);
  if (patchError) throw new Error(patchError.message);
  if (sourceError) throw new Error(sourceError.message);
  if (motionMediaError) throw new Error(motionMediaError.message);
  if (!move) notFound();

  const patchMap = new Map((patches ?? []).map((patch) => [patch.id, patch]));
  const sourceMap = new Map((sources ?? []).map((source) => [source.id, source]));
  const evidenceTargets = [
    { value: `move:${id}`, label: `Move本体: ${move.name_ja}` },
    ...(commands ?? []).map((command) => ({
      value: `move_command:${command.id}`,
      label: `${command.control_scheme === "classic" ? "Classic" : "Modern"} Command: ${command.command_text}`,
    })),
    ...(frames ?? []).map((frame) => {
      const patch = frame.valid_from_patch_id ? patchMap.get(frame.valid_from_patch_id) : null;
      return {
        value: `move_frame_data:${frame.id}`,
        label: `Frame: ${patch?.version_label ?? "Patch未指定"} / ${frame.verification_status}`,
      };
    }),
  ];
  const targetLabelMap = new Map(evidenceTargets.map((target) => [target.value, target.label]));
  const evidenceIds = evidenceTargets.map((target) => target.value.slice(target.value.indexOf(":") + 1));
  const { data: evidenceLinks, error: evidenceLinkError } = evidenceIds.length
    ? await supabase
      .from("entity_sources")
      .select("id, entity_type, entity_id, source_id, relationship, note")
      .in("entity_type", ["move", "move_command", "frame", "move_frame_data"])
      .in("entity_id", evidenceIds)
    : { data: [], error: null };
  if (evidenceLinkError) throw new Error(evidenceLinkError.message);

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">ADMIN / MOVES</p>
        <h1>{move.name_ja}を編集</h1>
        <p>基本情報と、履歴として保持するFrame / Patch / Source / Motion Mediaを分けて管理します。</p>
      </section>

      <AdminMoveForm
        action={updateMove.bind(null, id)}
        submitLabel="基本情報を保存"
        value={move}
        includeEvidence={false}
        characters={(characters ?? []).map((item) => ({ id: item.id, label: item.name_ja }))}
        patches={[]}
        sources={[]}
      />

      <section className="info-panel">
        <h2>登録済みコマンド</h2>
        {commands?.length ? (
          <div className="admin-table-wrap admin-table-wrap--nested">
            <table className="admin-table">
              <thead><tr><th>Control</th><th>Command</th><th>Numpad</th><th>Button</th><th>Condition</th></tr></thead>
              <tbody>{commands.map((command) => <tr key={command.id}><td>{command.control_scheme}</td><td>{command.command_text}</td><td>{command.numeric_notation ?? "-"}</td><td>{command.button_notation ?? "-"}</td><td>{command.condition_text ?? "-"}</td></tr>)}</tbody>
            </table>
          </div>
        ) : <p>コマンド未登録です。</p>}
      </section>

      <section className="info-panel">
        <h2>技モーション / GIF・短尺動画</h2>
        <p>確認用素材はdraft / reviewedで登録できます。publishedにする場合はMove本体の公開と、素材のSource URL / Source Labelが必須です。</p>
        {motionMedia?.length ? (
          <div className="admin-table-wrap admin-table-wrap--nested">
            <table className="admin-table">
              <thead><tr><th>Type</th><th>Status</th><th>Media</th><th>Source</th><th>Order</th><th>Action</th></tr></thead>
              <tbody>
                {motionMedia.map((media) => (
                  <tr key={media.id}>
                    <td>{media.media_type}</td>
                    <td>{media.status}</td>
                    <td><a className="text-link" href={media.media_url} target="_blank" rel="noopener noreferrer">素材を開く</a></td>
                    <td>{media.source_url ? <a className="text-link" href={media.source_url} target="_blank" rel="noopener noreferrer">{media.source_label ?? "Source"}</a> : "-"}</td>
                    <td>{media.display_order}</td>
                    <td><form action={archiveMoveMotionMedia.bind(null, id, media.id)}><button className="button-secondary" type="submit">Archive</button></form></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p>Motion Mediaはまだ登録されていません。</p>}

        <h3>Motion Mediaを追加</h3>
        <form action={addMoveMotionMedia.bind(null, id)} className="admin-form">
          <div className="admin-form__grid">
            <label className="admin-field"><span>Media Type</span><select name="media_type" defaultValue="video"><option value="video">video</option><option value="gif">gif</option></select></label>
            <label className="admin-field"><span>Status</span><select name="status" defaultValue="reviewed"><option value="draft">draft</option><option value="reviewed">reviewed</option><option value="published">published</option></select></label>
            <label className="admin-field"><span>Display Order</span><input name="display_order" type="number" defaultValue="0" /></label>
            <label className="admin-field"><span>Source Label</span><input name="source_label" placeholder="例: 自前実機キャプチャ / CAPCOM公式" /></label>
          </div>
          <label className="admin-field admin-field--wide"><span>Media URL</span><input name="media_url" type="url" inputMode="url" placeholder="https://..." required /></label>
          <label className="admin-field admin-field--wide"><span>Poster URL（動画のみ・任意）</span><input name="poster_url" type="url" inputMode="url" placeholder="https://..." /></label>
          <label className="admin-field admin-field--wide"><span>Source URL</span><input name="source_url" type="url" inputMode="url" placeholder="https://..." /></label>
          <div className="admin-actions"><button className="button-primary" type="submit">Motion Mediaを追加</button></div>
        </form>
      </section>

      <section className="info-panel">
        <h2>Frame履歴</h2>
        {frames?.length ? (
          <div className="admin-table-wrap admin-table-wrap--nested">
            <table className="admin-table">
              <thead><tr><th>Patch</th><th>発生</th><th>持続</th><th>硬直</th><th>Hit</th><th>Block</th><th>Damage</th><th>Verify</th></tr></thead>
              <tbody>
                {frames.map((frame) => {
                  const patch = frame.valid_from_patch_id ? patchMap.get(frame.valid_from_patch_id) : null;
                  return <tr key={frame.id}><td>{patch?.version_label ?? "未指定"}</td><td>{frame.startup ?? "-"}</td><td>{frame.active ?? "-"}</td><td>{frame.recovery ?? "-"}</td><td>{frame.on_hit ?? "-"}</td><td>{frame.on_block ?? "-"}</td><td>{frame.damage ?? "-"}</td><td>{frame.verification_status}</td></tr>;
                })}
              </tbody>
            </table>
          </div>
        ) : <p>Frame Dataはまだありません。</p>}

        <h3>新しいPatch版Frameを追加</h3>
        <form action={addFrameVersion.bind(null, id)} className="admin-form">
          <div className="admin-form__grid">
            <Input name="startup" label="発生" />
            <Input name="active" label="持続" />
            <Input name="recovery" label="硬直" />
            <Input name="on_hit" label="Hit" />
            <Input name="on_block" label="Block" />
            <Input name="damage" label="Damage" type="number" />
            <Input name="drive_damage" label="Dゲージダメージ" type="number" />
            <Input name="super_gain" label="SAゲージ増加" type="number" />
            <Input name="hit_level" label="判定" />
            <Input name="cancel_type" label="Cancel" />
            <Input name="invincibility" label="無敵" />
            <label className="admin-field"><span>有効Patch</span><select name="valid_from_patch_id" defaultValue=""><option value="">未指定</option>{(patches ?? []).map((patch) => <option key={patch.id} value={patch.id}>{patch.version_label}{patch.is_current ? " / CURRENT" : ""}</option>)}</select></label>
            <label className="admin-field"><span>検証状態</span><select name="verification_status" defaultValue="unverified"><option value="unverified">unverified</option><option value="official">official</option><option value="verified">verified</option></select></label>
          </div>
          <label className="admin-field admin-field--wide"><span>補足</span><textarea name="frame_notes" rows={3} /></label>
          <div className="admin-actions"><button className="button-primary" type="submit">Frame版を追加</button></div>
        </form>
      </section>

      <section className="info-panel">
        <h2>Evidence Source</h2>
        <p>Move本体・Classic/Modern Command・各FrameにSourceを個別に紐付けます。公開にはMove本体、Classic Command、Current verified Frameそれぞれのofficial Sourceが必要です。</p>
        {evidenceLinks?.length ? (
          <ul className="admin-source-list">
            {evidenceLinks.map((link) => {
              const normalizedType = link.entity_type === "frame" ? "move_frame_data" : link.entity_type;
              const targetLabel = targetLabelMap.get(`${normalizedType}:${link.entity_id}`) ?? `${link.entity_type}:${link.entity_id}`;
              const source = sourceMap.get(link.source_id);
              return (
                <li key={link.id}>
                  <strong>{targetLabel}</strong> — {source ? <a className="text-link" href={source.url} target="_blank" rel="noopener noreferrer">[{source.reliability_level}] {source.publisher ? `${source.publisher} / ` : ""}{source.title}</a> : link.source_id}
                  {link.note ? <span> / {link.note}</span> : null}
                </li>
              );
            })}
          </ul>
        ) : <p>Evidence Source未登録です。</p>}

        <form action={attachMoveEvidenceSource.bind(null, id)} className="admin-form">
          <div className="admin-form__grid">
            <label className="admin-field"><span>Evidence対象</span><select name="evidence_target" defaultValue="" required><option value="" disabled>選択</option>{evidenceTargets.map((target) => <option key={target.value} value={target.value}>{target.label}</option>)}</select></label>
            <label className="admin-field"><span>Source</span><select name="source_id" defaultValue="" required><option value="" disabled>選択</option>{(sources ?? []).map((source) => <option key={source.id} value={source.id}>[{source.reliability_level}] {source.publisher ? `${source.publisher} / ` : ""}{source.title}</option>)}</select></label>
          </div>
          <label className="admin-field admin-field--wide"><span>Sourceメモ</span><textarea name="source_note" rows={2} /></label>
          <div className="admin-actions"><button className="button-secondary" type="submit">Evidence Sourceを追加</button></div>
        </form>
      </section>
    </div>
  );
}

function Input({ name, label, type = "text" }: { name: string; label: string; type?: string }) {
  return <label className="admin-field"><span>{label}</span><input name={name} type={type} /></label>;
}
