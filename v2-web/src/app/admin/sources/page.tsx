import { requireAdmin } from "@/lib/admin";
import { createPatch, createSource, setCurrentPatch } from "./actions";

export const metadata = { title: "Patch・Source管理 | SF6DNA" };

export default async function AdminSourcesPage() {
  const { supabase } = await requireAdmin();
  const [{ data: patches, error: patchError }, { data: sources, error: sourceError }] = await Promise.all([
    supabase.from("patches").select("id, version_label, name, released_at, official_url, is_current, notes").order("released_at", { ascending: false, nullsFirst: false }),
    supabase.from("sources").select("id, title, url, source_type, publisher, published_at, reliability_level").order("published_at", { ascending: false, nullsFirst: false }).limit(200),
  ]);
  if (patchError) throw new Error(patchError.message);
  if (sourceError) throw new Error(sourceError.message);

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">ADMIN / PATCH & SOURCE</p>
        <h1>Patch・Source管理</h1>
        <p>攻略データを公開する前に、適用Patchと根拠Sourceを登録します。</p>
      </section>

      <section className="info-panel">
        <h2>Patchを追加</h2>
        <form action={createPatch} className="admin-form">
          <div className="admin-form__grid">
            <AdminInput name="version_label" label="Version label" required />
            <AdminInput name="name" label="名称" />
            <AdminInput name="released_at" label="公開日時" type="datetime-local" />
            <AdminInput name="official_url" label="公式URL" type="url" />
          </div>
          <AdminTextarea name="notes" label="メモ" />
          <label className="admin-check"><input type="checkbox" name="is_current" /><span>Current Patchに設定</span></label>
          <div className="admin-actions"><button className="button-primary" type="submit">Patchを登録</button></div>
        </form>
      </section>

      <section className="admin-table-wrap">
        <h2>Patch一覧</h2>
        <table className="admin-table">
          <thead><tr><th>Version</th><th>名称</th><th>公開日時</th><th>Current</th><th>操作</th></tr></thead>
          <tbody>
            {(patches ?? []).map((patch) => (
              <tr key={patch.id}>
                <td><strong>{patch.version_label}</strong></td>
                <td>{patch.name ?? "-"}</td>
                <td>{patch.released_at ? new Date(patch.released_at).toLocaleString("ja-JP") : "-"}</td>
                <td>{patch.is_current ? "Current" : ""}</td>
                <td>{!patch.is_current ? <form action={setCurrentPatch.bind(null, patch.id)}><button className="button-secondary" type="submit">Currentにする</button></form> : null}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="info-panel">
        <h2>Sourceを追加</h2>
        <form action={createSource} className="admin-form">
          <div className="admin-form__grid">
            <AdminInput name="title" label="タイトル" required />
            <AdminInput name="url" label="URL" type="url" required />
            <AdminInput name="source_type" label="Source type" required placeholder="official_patch_notes" />
            <AdminInput name="publisher" label="Publisher" placeholder="CAPCOM" />
            <AdminInput name="published_at" label="公開日時" type="datetime-local" />
            <label className="admin-field"><span>信頼レベル</span><select name="reliability_level" defaultValue="official"><option value="official">official</option><option value="verified">verified</option><option value="community">community</option><option value="unverified">unverified</option></select></label>
          </div>
          <AdminTextarea name="notes" label="メモ" />
          <div className="admin-actions"><button className="button-primary" type="submit">Sourceを登録</button></div>
        </form>
      </section>

      <section className="admin-table-wrap">
        <h2>Source一覧</h2>
        <table className="admin-table">
          <thead><tr><th>タイトル</th><th>Type</th><th>Publisher</th><th>Reliability</th><th>公開日時</th></tr></thead>
          <tbody>
            {(sources ?? []).map((source) => (
              <tr key={source.id}>
                <td><a href={source.url} target="_blank" rel="noreferrer"><strong>{source.title}</strong></a></td>
                <td>{source.source_type}</td>
                <td>{source.publisher ?? "-"}</td>
                <td>{source.reliability_level ?? "-"}</td>
                <td>{source.published_at ? new Date(source.published_at).toLocaleDateString("ja-JP") : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function AdminInput({ name, label, type = "text", required = false, placeholder }: { name: string; label: string; type?: string; required?: boolean; placeholder?: string }) {
  return <label className="admin-field"><span>{label}</span><input name={name} type={type} required={required} placeholder={placeholder} /></label>;
}

function AdminTextarea({ name, label }: { name: string; label: string }) {
  return <label className="admin-field admin-field--wide"><span>{label}</span><textarea name={name} rows={3} /></label>;
}
