type Option = { id: string; label: string };

type MoveValue = {
  character_id?: string | null;
  slug?: string | null;
  name_ja?: string | null;
  name_en?: string | null;
  move_type?: string | null;
  strength_variant?: string | null;
  description?: string | null;
  usage_summary?: string | null;
  description_ja?: string | null;
  usage_summary_ja?: string | null;
  display_order?: number | null;
  status?: string | null;
};

export function AdminMoveForm({
  action,
  characters,
  patches,
  sources,
  value = {},
  includeEvidence = true,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  characters: Option[];
  patches: Option[];
  sources: Option[];
  value?: MoveValue;
  includeEvidence?: boolean;
  submitLabel: string;
}) {
  return (
    <form action={action} className="admin-form">
      <section className="info-panel">
        <h2>技基本情報</h2>
        <div className="admin-form__grid">
          <Select label="キャラクター" name="character_id" options={characters} defaultValue={value.character_id} required />
          <Field label="Slug" name="slug" defaultValue={value.slug} required />
          <Field label="日本語名" name="name_ja" defaultValue={value.name_ja} required />
          <Field label="英語名" name="name_en" defaultValue={value.name_en} />
          <Select label="技種別" name="move_type" defaultValue={value.move_type ?? "normal"} required options={[
            { id: "normal", label: "normal" },
            { id: "special", label: "special" },
            { id: "target_combo", label: "target_combo" },
            { id: "super_art", label: "super_art" },
            { id: "throw", label: "throw" },
            { id: "unique", label: "unique" },
          ]} />
          <Field label="強度・派生" name="strength_variant" defaultValue={value.strength_variant} placeholder="弱 / 中 / 強 / OD 等" />
          <Field label="表示順" name="display_order" type="number" defaultValue={value.display_order ?? 0} min={0} />
          <Select label="公開状態" name="status" defaultValue={value.status ?? "draft"} options={[
            { id: "draft", label: "draft" },
            { id: "published", label: "published" },
            { id: "archived", label: "archived" },
          ]} />
        </div>
        <Textarea label="技の説明（日本語・画面表示用）" name="description_ja" defaultValue={value.description_ja} />
        <Textarea label="使いどころ（日本語・画面表示用）" name="usage_summary_ja" defaultValue={value.usage_summary_ja} />
        <Textarea label="取り込み元の説明・検証メモ" name="description" defaultValue={value.description} />
        <Textarea label="取り込み元の用途メモ" name="usage_summary" defaultValue={value.usage_summary} />
      </section>

      {includeEvidence ? (
        <>
          <section className="info-panel">
            <h2>コマンド</h2>
            <div className="admin-form__grid">
              <Field label="Classic command" name="classic_command_text" placeholder="例: ↓↘→ + P" />
              <Field label="Classic numpad" name="classic_numeric_notation" placeholder="例: 236P" />
              <Field label="Classic button" name="classic_button_notation" />
              <Field label="Classic condition" name="classic_condition_text" />
              <Field label="Modern command" name="modern_command_text" />
              <Field label="Modern numpad" name="modern_numeric_notation" />
              <Field label="Modern button" name="modern_button_notation" />
              <Field label="Modern condition" name="modern_condition_text" />
            </div>
          </section>

          <section className="info-panel">
            <h2>フレーム・性能</h2>
            <div className="admin-form__grid">
              <Field label="発生" name="startup" placeholder="例: 7" />
              <Field label="持続" name="active" placeholder="例: 3" />
              <Field label="硬直" name="recovery" placeholder="例: 20" />
              <Field label="ヒット時" name="on_hit" placeholder="例: +3" />
              <Field label="ガード時" name="on_block" placeholder="例: -4" />
              <Field label="ダメージ" name="damage" type="number" min={0} />
              <Field label="Dゲージダメージ" name="drive_damage" type="number" min={0} />
              <Field label="SAゲージ増加" name="super_gain" type="number" min={0} />
              <Field label="攻撃判定" name="hit_level" placeholder="high / low / overhead 等" />
              <Field label="キャンセル" name="cancel_type" />
              <Field label="無敵" name="invincibility" />
              <Select label="有効Patch" name="valid_from_patch_id" options={patches} />
              <Select label="検証状態" name="verification_status" defaultValue="unverified" options={[
                { id: "unverified", label: "unverified" },
                { id: "official", label: "official" },
                { id: "verified", label: "verified" },
              ]} />
            </div>
            <Textarea label="フレーム補足" name="frame_notes" />
          </section>

          <section className="info-panel">
            <h2>根拠Source</h2>
            <p>ここで選択したSourceは、新規登録するMove本体・入力済みCommand・FrameのEvidenceとして紐付けます。publishedで登録する場合はofficial Source、Classic Command、Current Patchのverified Frameが必須です。</p>
            <div className="admin-form__grid">
              <Select label="Source" name="source_id" options={sources} />
            </div>
            <Textarea label="Sourceメモ" name="source_note" />
          </section>
        </>
      ) : null}

      <div className="admin-actions"><button className="button-primary" type="submit">{submitLabel}</button></div>
    </form>
  );
}

function Field({ label, name, defaultValue, type = "text", required = false, min, placeholder }: { label: string; name: string; defaultValue?: string | number | null; type?: string; required?: boolean; min?: number; placeholder?: string }) {
  return <label className="admin-field"><span>{label}</span><input name={name} type={type} defaultValue={defaultValue ?? ""} required={required} min={min} placeholder={placeholder} /></label>;
}

function Textarea({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string | null }) {
  return <label className="admin-field admin-field--wide"><span>{label}</span><textarea name={name} defaultValue={defaultValue ?? ""} rows={4} /></label>;
}

function Select({ label, name, options, defaultValue, required = false }: { label: string; name: string; options: Option[]; defaultValue?: string | null; required?: boolean }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <select name={name} defaultValue={defaultValue ?? ""} required={required}>
        {!required ? <option value="">未指定</option> : null}
        {options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
      </select>
    </label>
  );
}
