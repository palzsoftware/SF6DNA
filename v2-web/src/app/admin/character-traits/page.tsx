import { archiveCharacterTraitScore, saveCharacterTraitScore } from "./actions";
import { requireAdmin } from "@/lib/admin";

const asText = (value: unknown) => typeof value === "string" ? value : "";
const asNumber = (value: unknown) => typeof value === "number" ? value : Number(value ?? 0);

export const metadata = { title: "キャラクター適性マッピング管理 | SF6DNA" };

export default async function CharacterTraitsAdminPage() {
  const { supabase } = await requireAdmin();
  const [charactersRes, traitsRes, sourcesRes, scoresRes] = await Promise.all([
    supabase.from("characters").select("id,name_ja").eq("is_playable", true).neq("status", "archived").order("display_order"),
    supabase.from("character_traits").select("id,trait_key,label").eq("status", "published").order("display_order"),
    supabase.from("sources").select("id,title,publisher").order("published_at", { ascending: false }).limit(200),
    supabase.from("character_trait_scores").select("id,character_id,trait_id,score,verification_status,source_id,note,status").neq("status", "archived").order("updated_at", { ascending: false }).limit(500),
  ]);
  const firstError = [charactersRes, traitsRes, sourcesRes, scoresRes].find((r) => r.error)?.error;
  if (firstError) throw new Error(firstError.message);

  const characters = charactersRes.data ?? [];
  const traits = traitsRes.data ?? [];
  const sources = sourcesRes.data ?? [];
  const scores = scoresRes.data ?? [];
  const characterMap = new Map(characters.map((row) => [asText(row.id), asText(row.name_ja)]));
  const traitMap = new Map(traits.map((row) => [asText(row.id), asText(row.label)]));
  const sourceMap = new Map(sources.map((row) => [asText(row.id), `${asText(row.publisher)} / ${asText(row.title)}`]));

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">ADMIN / CHARACTER FIT</p>
        <h1>キャラクター適性マッピング</h1>
        <p>診断軸とキャラクターの相性スコアを0〜5で管理します。公開にはverifiedとSourceが必須です。</p>
      </section>

      <section className="info-panel">
        <h2>マッピング追加・更新</h2>
        <form action={saveCharacterTraitScore} className="admin-form-grid">
          <label><span>Character *</span><select name="character_id" required><option value="">選択</option>{characters.map((row) => <option key={asText(row.id)} value={asText(row.id)}>{asText(row.name_ja)}</option>)}</select></label>
          <label><span>Trait *</span><select name="trait_id" required><option value="">選択</option>{traits.map((row) => <option key={asText(row.id)} value={asText(row.id)}>{asText(row.label)} ({asText(row.trait_key)})</option>)}</select></label>
          <label><span>Score 0-5 *</span><input name="score" type="number" min="0" max="5" required /></label>
          <label><span>Verification</span><select name="verification_status" defaultValue="unverified"><option value="unverified">unverified</option><option value="reviewed">reviewed</option><option value="verified">verified</option></select></label>
          <label className="admin-span-2"><span>Source</span><select name="source_id"><option value="">未設定</option>{sources.map((row) => <option key={asText(row.id)} value={asText(row.id)}>{sourceMap.get(asText(row.id))}</option>)}</select></label>
          <label className="admin-span-2"><span>Note</span><textarea name="note" rows={3} /></label>
          <label><span>Status</span><select name="status" defaultValue="draft"><option value="draft">draft</option><option value="published">published</option><option value="archived">archived</option></select></label>
          <div className="admin-actions"><button className="button-primary" type="submit">保存</button></div>
        </form>
      </section>

      <section className="admin-table-wrap">
        <h2>登録済みマッピング</h2>
        <table className="admin-table">
          <thead><tr><th>Character</th><th>Trait</th><th>Score</th><th>Verification</th><th>Source</th><th>Status</th><th /></tr></thead>
          <tbody>
            {scores.map((row) => (
              <tr key={asText(row.id)}>
                <td>{characterMap.get(asText(row.character_id)) ?? asText(row.character_id)}</td>
                <td>{traitMap.get(asText(row.trait_id)) ?? asText(row.trait_id)}</td>
                <td>{asNumber(row.score)}</td>
                <td>{asText(row.verification_status)}</td>
                <td>{sourceMap.get(asText(row.source_id)) ?? (row.source_id ? asText(row.source_id) : "-")}</td>
                <td>{asText(row.status)}</td>
                <td><form action={archiveCharacterTraitScore.bind(null, asText(row.id))}><button className="button-secondary" type="submit">Archive</button></form></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
