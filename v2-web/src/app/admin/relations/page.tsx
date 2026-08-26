import {
  addComboMove,
  addEntityVideo,
  addGlossaryAlias,
  addMatchParticipant,
  addPlayerAlias,
  addPlayerCharacter,
  addSetupMove,
  addTournamentResult,
  addTrainingRelation,
  archiveMatch,
  createMatch,
  deleteComboMove,
  deleteEntityVideo,
  deleteGlossaryAlias,
  deleteMatchParticipant,
  deletePlayerAlias,
  deletePlayerCharacter,
  deleteSetupMove,
  deleteTournamentResult,
  deleteTrainingRelation,
} from "./actions";
import { requireAdmin } from "@/lib/admin";

type Option = { id: string; label: string };
type AliasRow = { id: string; ownerId: string; alias: string; ownerLabel: string };
type PlayerCharacterRow = { playerId: string; characterId: string; role: string; player: string; character: string; note: string | null };
type TournamentResultRow = { tournamentId: string; playerId: string; tournament: string; player: string; placement: number | null };
type MatchRow = { id: string; label: string; status: string };
type MatchParticipantRow = { matchId: string; side: number; player: string; character: string; winner: boolean | null };
type EntityVideoRow = { id: string; entityType: string; entityId: string; video: string; relationship: string };
type StepRow = { ownerId: string; stepOrder: number; owner: string; move: string; note: string | null };
type TrainingRelationRow = { trainingId: string; relatedType: string; relatedId: string; training: string; relationship: string | null };

const asText = (value: unknown) => typeof value === "string" ? value : "";
const asNumber = (value: unknown) => typeof value === "number" ? value : null;
const asBoolean = (value: unknown) => typeof value === "boolean" ? value : null;

export default async function RelationsAdminPage() {
  const { supabase } = await requireAdmin();
  const [
    playersRes, charactersRes, patchesRes, tournamentsRes, videosRes, glossaryRes,
    combosRes, setupsRes, movesRes, trainingsRes, countersRes, sequencesRes,
    playerAliasesRes, glossaryAliasesRes, playerCharactersRes, resultsRes,
    matchesRes, participantsRes, entityVideosRes, comboMovesRes, setupMovesRes, trainingRelationsRes,
  ] = await Promise.all([
    supabase.from("players").select("id, display_name").neq("status", "archived").order("display_name"),
    supabase.from("characters").select("id, name_ja").neq("status", "archived").order("display_order"),
    supabase.from("patches").select("id, version_label").order("released_at", { ascending: false }),
    supabase.from("tournaments").select("id, name").neq("status", "archived").order("start_date", { ascending: false }),
    supabase.from("videos").select("id, title").neq("status", "archived").order("created_at", { ascending: false }).limit(200),
    supabase.from("glossary").select("id, term").neq("status", "archived").order("term"),
    supabase.from("combos").select("id, name").neq("status", "archived").order("created_at", { ascending: false }).limit(200),
    supabase.from("setups").select("id, name").neq("status", "archived").order("created_at", { ascending: false }).limit(200),
    supabase.from("moves").select("id, name_ja").neq("status", "archived").order("name_ja").limit(500),
    supabase.from("trainings").select("id, name").neq("status", "archived").order("created_at", { ascending: false }).limit(200),
    supabase.from("counters").select("id, title").neq("status", "archived").order("created_at", { ascending: false }).limit(200),
    supabase.from("sequences").select("id, name").neq("status", "archived").order("created_at", { ascending: false }).limit(200),
    supabase.from("player_aliases").select("id, player_id, alias").order("created_at", { ascending: false }).limit(100),
    supabase.from("glossary_aliases").select("id, glossary_id, alias").limit(100),
    supabase.from("player_characters").select("player_id, character_id, role, note").limit(200),
    supabase.from("tournament_results").select("tournament_id, player_id, placement").limit(200),
    supabase.from("matches").select("id, tournament_id, round_name, score_text, status, played_at").order("played_at", { ascending: false }).limit(100),
    supabase.from("match_participants").select("match_id, player_id, side, character_id, is_winner").limit(200),
    supabase.from("entity_videos").select("id, entity_type, entity_id, video_id, relationship").order("created_at", { ascending: false }).limit(200),
    supabase.from("combo_moves").select("combo_id, move_id, step_order, note").order("step_order").limit(300),
    supabase.from("setup_moves").select("setup_id, move_id, step_order, note").order("step_order").limit(300),
    supabase.from("training_relations").select("training_id, related_type, related_id, relationship").limit(300),
  ]);

  const allResults = [playersRes, charactersRes, patchesRes, tournamentsRes, videosRes, glossaryRes, combosRes, setupsRes, movesRes, trainingsRes, countersRes, sequencesRes, playerAliasesRes, glossaryAliasesRes, playerCharactersRes, resultsRes, matchesRes, participantsRes, entityVideosRes, comboMovesRes, setupMovesRes, trainingRelationsRes];
  const firstError = allResults.find((result) => result.error)?.error;
  if (firstError) throw new Error(firstError.message);

  const players = (playersRes.data ?? []).map((row) => ({ id: asText(row.id), label: asText(row.display_name) }));
  const characters = (charactersRes.data ?? []).map((row) => ({ id: asText(row.id), label: asText(row.name_ja) }));
  const patches = (patchesRes.data ?? []).map((row) => ({ id: asText(row.id), label: asText(row.version_label) }));
  const tournaments = (tournamentsRes.data ?? []).map((row) => ({ id: asText(row.id), label: asText(row.name) }));
  const videos = (videosRes.data ?? []).map((row) => ({ id: asText(row.id), label: asText(row.title) }));
  const glossary = (glossaryRes.data ?? []).map((row) => ({ id: asText(row.id), label: asText(row.term) }));
  const combos = (combosRes.data ?? []).map((row) => ({ id: asText(row.id), label: asText(row.name) }));
  const setups = (setupsRes.data ?? []).map((row) => ({ id: asText(row.id), label: asText(row.name) }));
  const moves = (movesRes.data ?? []).map((row) => ({ id: asText(row.id), label: asText(row.name_ja) }));
  const trainings = (trainingsRes.data ?? []).map((row) => ({ id: asText(row.id), label: asText(row.name) }));
  const counters = (countersRes.data ?? []).map((row) => ({ id: asText(row.id), label: asText(row.title) }));
  const sequences = (sequencesRes.data ?? []).map((row) => ({ id: asText(row.id), label: asText(row.name) }));

  const playerMap = new Map(players.map((item) => [item.id, item.label]));
  const characterMap = new Map(characters.map((item) => [item.id, item.label]));
  const tournamentMap = new Map(tournaments.map((item) => [item.id, item.label]));
  const videoMap = new Map(videos.map((item) => [item.id, item.label]));
  const glossaryMap = new Map(glossary.map((item) => [item.id, item.label]));
  const comboMap = new Map(combos.map((item) => [item.id, item.label]));
  const setupMap = new Map(setups.map((item) => [item.id, item.label]));
  const moveMap = new Map(moves.map((item) => [item.id, item.label]));
  const trainingMap = new Map(trainings.map((item) => [item.id, item.label]));

  const playerAliases: AliasRow[] = (playerAliasesRes.data ?? []).map((row) => ({ id: asText(row.id), ownerId: asText(row.player_id), alias: asText(row.alias), ownerLabel: playerMap.get(asText(row.player_id)) ?? asText(row.player_id) }));
  const glossaryAliases: AliasRow[] = (glossaryAliasesRes.data ?? []).map((row) => ({ id: asText(row.id), ownerId: asText(row.glossary_id), alias: asText(row.alias), ownerLabel: glossaryMap.get(asText(row.glossary_id)) ?? asText(row.glossary_id) }));
  const playerCharacters: PlayerCharacterRow[] = (playerCharactersRes.data ?? []).map((row) => ({ playerId: asText(row.player_id), characterId: asText(row.character_id), role: asText(row.role), player: playerMap.get(asText(row.player_id)) ?? asText(row.player_id), character: characterMap.get(asText(row.character_id)) ?? asText(row.character_id), note: row.note ?? null }));
  const tournamentResults: TournamentResultRow[] = (resultsRes.data ?? []).map((row) => ({ tournamentId: asText(row.tournament_id), playerId: asText(row.player_id), tournament: tournamentMap.get(asText(row.tournament_id)) ?? asText(row.tournament_id), player: playerMap.get(asText(row.player_id)) ?? asText(row.player_id), placement: asNumber(row.placement) }));
  const matches: MatchRow[] = (matchesRes.data ?? []).map((row) => ({ id: asText(row.id), label: `${tournamentMap.get(asText(row.tournament_id)) ?? "大会なし"} / ${asText(row.round_name) || "Round未設定"} / ${asText(row.score_text) || "score未設定"}`, status: asText(row.status) }));
  const matchMap = new Map(matches.map((item) => [item.id, item.label]));
  const participants: MatchParticipantRow[] = (participantsRes.data ?? []).map((row) => ({ matchId: asText(row.match_id), side: asNumber(row.side) ?? 0, player: playerMap.get(asText(row.player_id)) ?? asText(row.player_id), character: characterMap.get(asText(row.character_id)) ?? "未設定", winner: asBoolean(row.is_winner) }));
  const entityVideos: EntityVideoRow[] = (entityVideosRes.data ?? []).map((row) => ({ id: asText(row.id), entityType: asText(row.entity_type), entityId: asText(row.entity_id), video: videoMap.get(asText(row.video_id)) ?? asText(row.video_id), relationship: asText(row.relationship) }));
  const comboSteps: StepRow[] = (comboMovesRes.data ?? []).map((row) => ({ ownerId: asText(row.combo_id), stepOrder: asNumber(row.step_order) ?? 0, owner: comboMap.get(asText(row.combo_id)) ?? asText(row.combo_id), move: moveMap.get(asText(row.move_id)) ?? asText(row.move_id), note: row.note ?? null }));
  const setupSteps: StepRow[] = (setupMovesRes.data ?? []).map((row) => ({ ownerId: asText(row.setup_id), stepOrder: asNumber(row.step_order) ?? 0, owner: setupMap.get(asText(row.setup_id)) ?? asText(row.setup_id), move: moveMap.get(asText(row.move_id)) ?? asText(row.move_id), note: row.note ?? null }));
  const trainingRelations: TrainingRelationRow[] = (trainingRelationsRes.data ?? []).map((row) => ({ trainingId: asText(row.training_id), relatedType: asText(row.related_type), relatedId: asText(row.related_id), training: trainingMap.get(asText(row.training_id)) ?? asText(row.training_id), relationship: row.relationship ?? null }));

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">ADMIN / RELATIONS</p>
        <h1>関連データ管理</h1>
        <p>Player・Character・Tournament・Match・Video・攻略データをIDで接続します。表示名ではなく内部IDを関係の正本として扱います。</p>
      </section>

      <RelationSection title="Player ↔ Character" description="メイン・サブ・専門キャラなどをPatch期間付きで記録します。">
        <form action={addPlayerCharacter} className="admin-inline-form">
          <Select name="player_id" label="Player" options={players} required />
          <Select name="character_id" label="Character" options={characters} required />
          <Field name="role" label="Role" placeholder="main / sub / specialist" required />
          <Select name="valid_from_patch_id" label="From Patch" options={patches} empty="未設定" />
          <Select name="valid_to_patch_id" label="To Patch" options={patches} empty="現行" />
          <Field name="note" label="Note" />
          <button className="button-primary" type="submit">保存</button>
        </form>
        <Rows>{playerCharacters.map((row) => <Row key={`${row.playerId}-${row.characterId}-${row.role}`} cells={[row.player, row.character, row.role, row.note ?? "-"]} action={<form action={deletePlayerCharacter.bind(null, row.playerId, row.characterId, row.role)}><button className="button-secondary">削除</button></form>} />)}</Rows>
      </RelationSection>

      <div className="character-columns">
        <RelationSection title="Player Alias"><form action={addPlayerAlias} className="admin-inline-form"><Select name="player_id" label="Player" options={players} required /><Field name="alias" label="Alias" required /><button className="button-primary">追加</button></form><Rows>{playerAliases.map((row) => <Row key={row.id} cells={[row.ownerLabel, row.alias]} action={<form action={deletePlayerAlias.bind(null, row.id)}><button className="button-secondary">削除</button></form>} />)}</Rows></RelationSection>
        <RelationSection title="Glossary Alias"><form action={addGlossaryAlias} className="admin-inline-form"><Select name="glossary_id" label="Glossary" options={glossary} required /><Field name="alias" label="Alias" required /><button className="button-primary">追加</button></form><Rows>{glossaryAliases.map((row) => <Row key={row.id} cells={[row.ownerLabel, row.alias]} action={<form action={deleteGlossaryAlias.bind(null, row.id)}><button className="button-secondary">削除</button></form>} />)}</Rows></RelationSection>
      </div>

      <RelationSection title="Tournament Results">
        <form action={addTournamentResult} className="admin-inline-form"><Select name="tournament_id" label="Tournament" options={tournaments} required /><Select name="player_id" label="Player" options={players} required /><Field name="placement" label="Placement" type="number" /><Field name="note" label="Note" /><button className="button-primary">保存</button></form>
        <Rows>{tournamentResults.map((row) => <Row key={`${row.tournamentId}-${row.playerId}`} cells={[row.tournament, row.player, row.placement?.toString() ?? "-"]} action={<form action={deleteTournamentResult.bind(null, row.tournamentId, row.playerId)}><button className="button-secondary">削除</button></form>} />)}</Rows>
      </RelationSection>

      <RelationSection title="Match">
        <form action={createMatch} className="admin-inline-form">
          <Select name="tournament_id" label="Tournament" options={tournaments} empty="大会なし" />
          <Field name="round_name" label="Round" placeholder="Top 8 Winners" />
          <Field name="played_at" label="Played at" type="datetime-local" />
          <Field name="best_of" label="Best of" type="number" />
          <Select name="winner_player_id" label="Winner" options={players} empty="未確定" />
          <Field name="score_text" label="Score" placeholder="3-2" />
          <Select name="video_id" label="Video" options={videos} empty="なし" />
          <Field name="notes" label="Notes" />
          <label className="admin-field"><span>Status</span><select name="status" defaultValue="draft"><option value="draft">draft</option><option value="published">published</option></select></label>
          <button className="button-primary">作成</button>
        </form>
        <Rows>{matches.map((row) => <Row key={row.id} cells={[row.label, row.status]} action={<form action={archiveMatch.bind(null, row.id)}><button className="button-secondary">Archive</button></form>} />)}</Rows>
      </RelationSection>

      <RelationSection title="Match Participants">
        <form action={addMatchParticipant} className="admin-inline-form">
          <Select name="match_id" label="Match" options={matches.map((item) => ({ id: item.id, label: item.label }))} required />
          <Select name="player_id" label="Player" options={players} required />
          <Field name="side" label="Side" type="number" defaultValue="1" required />
          <Select name="character_id" label="Character" options={characters} empty="未設定" />
          <label className="admin-field"><span>Winner</span><select name="is_winner" defaultValue=""><option value="">未設定</option><option value="true">勝者</option><option value="false">敗者</option></select></label>
          <button className="button-primary">保存</button>
        </form>
        <Rows>{participants.map((row) => <Row key={`${row.matchId}-${row.side}`} cells={[matchMap.get(row.matchId) ?? row.matchId, `Side ${row.side}`, row.player, row.character, row.winner === null ? "-" : row.winner ? "Win" : "Lose"]} action={<form action={deleteMatchParticipant.bind(null, row.matchId, row.side)}><button className="button-secondary">削除</button></form>} />)}</Rows>
      </RelationSection>

      <RelationSection title="Video ↔ Entity" description="実DBは個別video_*テーブルではなくentity_videosで統一されています。">
        <form action={addEntityVideo} className="admin-inline-form">
          <label className="admin-field"><span>Entity type</span><select name="entity_type" required><option value="character">character</option><option value="move">move</option><option value="combo">combo</option><option value="setup">setup</option><option value="sequence">sequence</option><option value="counter">counter</option><option value="training">training</option><option value="player">player</option><option value="tournament">tournament</option><option value="match">match</option></select></label>
          <Field name="entity_id" label="Entity ID" required placeholder="UUID" />
          <Select name="video_id" label="Video" options={videos} required />
          <Field name="relationship" label="Relationship" defaultValue="reference" required />
          <Field name="display_order" label="Order" type="number" defaultValue="0" />
          <Field name="note" label="Note" />
          <button className="button-primary">追加</button>
        </form>
        <Rows>{entityVideos.map((row) => <Row key={row.id} cells={[row.entityType, row.entityId, row.video, row.relationship]} action={<form action={deleteEntityVideo.bind(null, row.id)}><button className="button-secondary">削除</button></form>} />)}</Rows>
      </RelationSection>

      <div className="character-columns">
        <RelationSection title="Combo Move Steps"><form action={addComboMove} className="admin-inline-form"><Select name="combo_id" label="Combo" options={combos} required /><Select name="move_id" label="Move" options={moves} required /><Field name="step_order" label="Step" type="number" defaultValue="1" required /><Field name="note" label="Note" /><button className="button-primary">保存</button></form><Rows>{comboSteps.map((row) => <Row key={`${row.ownerId}-${row.stepOrder}`} cells={[row.owner, `${row.stepOrder}. ${row.move}`, row.note ?? "-"]} action={<form action={deleteComboMove.bind(null, row.ownerId, row.stepOrder)}><button className="button-secondary">削除</button></form>} />)}</Rows></RelationSection>
        <RelationSection title="Setup Move Steps"><form action={addSetupMove} className="admin-inline-form"><Select name="setup_id" label="Setup" options={setups} required /><Select name="move_id" label="Move" options={moves} required /><Field name="step_order" label="Step" type="number" defaultValue="1" required /><Field name="note" label="Note" /><button className="button-primary">保存</button></form><Rows>{setupSteps.map((row) => <Row key={`${row.ownerId}-${row.stepOrder}`} cells={[row.owner, `${row.stepOrder}. ${row.move}`, row.note ?? "-"]} action={<form action={deleteSetupMove.bind(null, row.ownerId, row.stepOrder)}><button className="button-secondary">削除</button></form>} />)}</Rows></RelationSection>
      </div>

      <RelationSection title="Training Relations" description="TrainingをMove / Combo / Setup / Sequence / Counter等へ接続します。">
        <form action={addTrainingRelation} className="admin-inline-form">
          <Select name="training_id" label="Training" options={trainings} required />
          <label className="admin-field"><span>Related type</span><select name="related_type" required><option value="move">move</option><option value="combo">combo</option><option value="setup">setup</option><option value="sequence">sequence</option><option value="counter">counter</option><option value="character">character</option></select></label>
          <Field name="related_id" label="Related ID" placeholder="UUID" required />
          <Field name="relationship" label="Relationship" placeholder="practice / prerequisite / followup" />
          <button className="button-primary">保存</button>
        </form>
        <details className="data-notice"><summary>Related ID参照候補</summary><p className="muted">Character {characters.length} / Move {moves.length} / Combo {combos.length} / Setup {setups.length} / Sequence {sequences.length} / Counter {counters.length}</p></details>
        <Rows>{trainingRelations.map((row) => <Row key={`${row.trainingId}-${row.relatedType}-${row.relatedId}`} cells={[row.training, row.relatedType, row.relatedId, row.relationship ?? "-"]} action={<form action={deleteTrainingRelation.bind(null, row.trainingId, row.relatedType, row.relatedId)}><button className="button-secondary">削除</button></form>} />)}</Rows>
      </RelationSection>
    </div>
  );
}

function RelationSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return <section className="info-panel admin-relation-section"><h2>{title}</h2>{description ? <p>{description}</p> : null}{children}</section>;
}

function Select({ name, label, options, required = false, empty }: { name: string; label: string; options: Option[]; required?: boolean; empty?: string }) {
  return <label className="admin-field"><span>{label}</span><select name={name} required={required} defaultValue="">{empty !== undefined ? <option value="">{empty}</option> : <option value="" disabled>選択</option>}{options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>;
}

function Field({ name, label, required = false, type = "text", placeholder, defaultValue }: { name: string; label: string; required?: boolean; type?: string; placeholder?: string; defaultValue?: string }) {
  return <label className="admin-field"><span>{label}</span><input name={name} required={required} type={type} placeholder={placeholder} defaultValue={defaultValue} /></label>;
}

function Rows({ children }: { children: React.ReactNode }) { return <div className="admin-relation-rows">{children}</div>; }
function Row({ cells, action }: { cells: string[]; action: React.ReactNode }) { return <div className="admin-relation-row"><div>{cells.map((cell, index) => <span key={`${index}-${cell}`}>{cell}</span>)}</div>{action}</div>; }
