import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

type CountCard = { label: string; total: number; published?: number; verified?: number };
type CoverageRow = { id: string; name: string; moves: number; frames: number; combos: number; setups: number; sequences: number; counters: number; trainings: number; players: number };

async function countTable(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  table: string,
  filter?: { column: string; value: string },
) {
  let query = supabase.from(table).select("id", { count: "exact", head: true });
  if (filter) query = query.eq(filter.column, filter.value);
  const { count, error } = await query;
  if (error) throw new Error(`${table}: ${error.message}`);
  return count ?? 0;
}

export default async function DataQualityPage() {
  const { supabase } = await requireAdmin();
  const tableSpecs = [
    ["moves", "技"], ["combos", "コンボ"], ["setups", "セットプレイ"], ["sequences", "連携"],
    ["counters", "対策"], ["trainings", "トレーニング"], ["players", "プレイヤー"], ["tournaments", "大会"],
    ["matches", "試合"], ["videos", "動画"], ["glossary", "用語"], ["diagnoses", "診断"],
  ] as const;

  const cards: CountCard[] = await Promise.all(tableSpecs.map(async ([table, label]) => ({
    label,
    total: await countTable(supabase, table),
    published: await countTable(supabase, table, { column: "status", value: "published" }),
  })));

  const verificationTables = ["move_frame_data", "combos", "setups", "sequences", "counters", "trainings"] as const;
  const verification = await Promise.all(verificationTables.map(async (table) => ({
    table,
    total: await countTable(supabase, table),
    verified: await countTable(supabase, table, { column: "verification_status", value: "verified" }),
  })));

  const [
    charactersRes, movesRes, framesRes, combosRes, setupsRes, sequencesRes, countersRes, trainingsRes, playerCharactersRes,
    entitySourcesCount, entityVideosCount, tournamentResultsCount, participantsCount, aliasesCount,
  ] = await Promise.all([
    supabase.from("characters").select("id, name_ja").eq("status", "published").eq("is_playable", true).order("display_order"),
    supabase.from("moves").select("id, character_id").neq("status", "archived"),
    supabase.from("move_frame_data").select("move_id, verification_status"),
    supabase.from("combos").select("character_id").neq("status", "archived"),
    supabase.from("setups").select("character_id").neq("status", "archived"),
    supabase.from("sequences").select("character_id").neq("status", "archived"),
    supabase.from("counters").select("defender_character_id, opponent_character_id").neq("status", "archived"),
    supabase.from("trainings").select("player_character_id").neq("status", "archived"),
    supabase.from("player_characters").select("character_id"),
    countTable(supabase, "entity_sources"),
    countTable(supabase, "entity_videos"),
    countTable(supabase, "tournament_results"),
    countTable(supabase, "match_participants"),
    Promise.all([countTable(supabase, "character_aliases"), countTable(supabase, "move_aliases"), countTable(supabase, "player_aliases"), countTable(supabase, "glossary_aliases")]).then((values) => values.reduce((a, b) => a + b, 0)),
  ]);

  const queryError = [charactersRes, movesRes, framesRes, combosRes, setupsRes, sequencesRes, countersRes, trainingsRes, playerCharactersRes].find((result) => result.error)?.error;
  if (queryError) throw new Error(queryError.message);

  const moveCharacter = new Map((movesRes.data ?? []).map((row) => [String(row.id), String(row.character_id)]));
  const coverage: CoverageRow[] = (charactersRes.data ?? []).map((character) => {
    const id = String(character.id);
    const moveIds = new Set((movesRes.data ?? []).filter((row) => String(row.character_id) === id).map((row) => String(row.id)));
    return {
      id,
      name: String(character.name_ja),
      moves: moveIds.size,
      frames: (framesRes.data ?? []).filter((row) => moveIds.has(String(row.move_id))).length,
      combos: (combosRes.data ?? []).filter((row) => String(row.character_id) === id).length,
      setups: (setupsRes.data ?? []).filter((row) => String(row.character_id) === id).length,
      sequences: (sequencesRes.data ?? []).filter((row) => String(row.character_id) === id).length,
      counters: (countersRes.data ?? []).filter((row) => String(row.defender_character_id) === id || String(row.opponent_character_id) === id).length,
      trainings: (trainingsRes.data ?? []).filter((row) => String(row.player_character_id) === id).length,
      players: (playerCharactersRes.data ?? []).filter((row) => String(row.character_id) === id).length,
    };
  });

  const movesWithFrames = new Set((framesRes.data ?? []).map((row) => String(row.move_id))).size;
  const verifiedFrameMoves = new Set((framesRes.data ?? []).filter((row) => row.verification_status === "verified").map((row) => String(row.move_id))).size;
  const orphanFrameCount = (framesRes.data ?? []).filter((row) => !moveCharacter.has(String(row.move_id))).length;

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">ADMIN / DATA QUALITY</p>
        <h1>データ品質・網羅率</h1>
        <p>「画面がある」と「信頼できるデータが揃っている」を分離して確認します。AI Coachの生成回答解禁判断にも使用します。</p>
      </section>

      <section>
        <div className="section-heading"><h2>公開状況</h2><p>総件数とpublished件数。</p></div>
        <div className="data-status-grid">{cards.map((card) => <article className="info-panel" key={card.label}><h3>{card.label}</h3><p className="data-count">{card.total}</p><p>published: {card.published ?? 0}</p></article>)}</div>
      </section>

      <section className="character-columns">
        <article className="info-panel"><h2>検証状態</h2><div className="detail-list">{verification.map((item) => <div key={item.table}><dt>{item.table}</dt><dd>{item.verified} / {item.total} verified</dd></div>)}</div></article>
        <article className="info-panel"><h2>関係データ</h2><div className="detail-list"><div><dt>Entity Sources</dt><dd>{entitySourcesCount}</dd></div><div><dt>Entity Videos</dt><dd>{entityVideosCount}</dd></div><div><dt>Tournament Results</dt><dd>{tournamentResultsCount}</dd></div><div><dt>Match Participants</dt><dd>{participantsCount}</dd></div><div><dt>Aliases</dt><dd>{aliasesCount}</dd></div></div></article>
      </section>

      <section className="data-notice">
        <h2>Frame健全性</h2>
        <p>Move {movesRes.data?.length ?? 0}件のうちFrameあり {movesWithFrames}件、verified Frameあり {verifiedFrameMoves}件。存在しないMoveを参照するFrameは {orphanFrameCount}件です。</p>
      </section>

      <section className="admin-table-wrap">
        <div className="admin-section-heading"><div><h2>31キャラ網羅率</h2><p>0の列は未投入領域です。未検証候補も含むため、件数だけで公開可否は判断しません。</p></div><Link className="button-secondary" href="/admin/relations">関連データ管理</Link></div>
        <table className="admin-table data-quality-table"><thead><tr><th>Character</th><th>Move</th><th>Frame</th><th>Combo</th><th>Setup</th><th>Sequence</th><th>Counter</th><th>Training</th><th>Players</th></tr></thead><tbody>
          {coverage.map((row) => <tr key={row.id}><td>{row.name}</td><td>{row.moves}</td><td>{row.frames}</td><td>{row.combos}</td><td>{row.setups}</td><td>{row.sequences}</td><td>{row.counters}</td><td>{row.trainings}</td><td>{row.players}</td></tr>)}
        </tbody></table>
      </section>
    </div>
  );
}
