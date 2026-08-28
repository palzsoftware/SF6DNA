type CharacterFormValue = {
  id?: string;
  slug?: string | null;
  name_ja?: string | null;
  name_en?: string | null;
  short_name?: string | null;
  summary?: string | null;
  archetype?: string | null;
  preferred_range?: string | null;
  difficulty?: number | null;
  release_date?: string | null;
  display_order?: number | null;
  image_url?: string | null;
  strengths_summary?: string | null;
  weaknesses_summary?: string | null;
  is_playable?: boolean | null;
  status?: string | null;
};

export function AdminCharacterForm({
  action,
  value = {},
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  value?: CharacterFormValue;
  submitLabel: string;
}) {
  return (
    <form action={action} className="admin-form">
      <div className="admin-form__grid">
        <Field label="Slug" name="slug" defaultValue={value.slug} required />
        <Field label="日本語名" name="name_ja" defaultValue={value.name_ja} required />
        <Field label="英語名" name="name_en" defaultValue={value.name_en} />
        <Field label="短縮名" name="short_name" defaultValue={value.short_name} />
        <Field label="アーキタイプ" name="archetype" defaultValue={value.archetype} />
        <Field label="得意距離" name="preferred_range" defaultValue={value.preferred_range} />
        <Field label="難易度" name="difficulty" type="number" defaultValue={value.difficulty} min={1} max={5} />
        <Field label="表示順" name="display_order" type="number" defaultValue={value.display_order} min={0} />
        <Field label="実装日" name="release_date" type="date" defaultValue={value.release_date} />
        <Field label="画像URL" name="image_url" defaultValue={value.image_url} />
      </div>

      <Textarea label="概要" name="summary" defaultValue={value.summary} />
      <Textarea label="強み" name="strengths_summary" defaultValue={value.strengths_summary} />
      <Textarea label="弱み" name="weaknesses_summary" defaultValue={value.weaknesses_summary} />

      <div className="admin-form__grid">
        <label className="admin-field">
          <span>公開状態</span>
          <select name="status" defaultValue={value.status ?? "draft"}>
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
        </label>
        <label className="admin-check">
          <input type="checkbox" name="is_playable" defaultChecked={value.is_playable ?? true} />
          <span>プレイアブル</span>
        </label>
      </div>

      <div className="admin-actions">
        <button className="button-primary" type="submit">{submitLabel}</button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required = false,
  min,
  max,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  min?: number;
  max?: number;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <input name={name} type={type} defaultValue={defaultValue ?? ""} required={required} min={min} max={max} />
    </label>
  );
}

function Textarea({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string | null }) {
  return (
    <label className="admin-field admin-field--wide">
      <span>{label}</span>
      <textarea name={name} defaultValue={defaultValue ?? ""} rows={4} />
    </label>
  );
}
