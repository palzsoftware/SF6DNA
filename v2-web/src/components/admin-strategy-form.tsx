import type { StrategyKind } from "@/lib/admin-strategy";

type Option = { id: string; label: string };
type Row = Record<string, string | number | boolean | null | undefined>;

type Props = {
  kind: StrategyKind;
  action: (formData: FormData) => void | Promise<void>;
  value?: Row | null;
  characters: Option[];
  patches: Option[];
  sources: Option[];
};

const input = (value: unknown) => value === null || value === undefined ? "" : String(value);

export function AdminStrategyForm({ kind, action, value, characters, patches, sources }: Props) {
  return (
    <form action={action} className="admin-form">
      <div className="admin-form-grid">
        <label><span>Slug *</span><input name="slug" required defaultValue={input(value?.slug)} /></label>
        {kind === "combos" || kind === "setups" || kind === "sequences" ? (
          <CharacterSelect name="character_id" label="キャラクター *" options={characters} value={input(value?.character_id)} required />
        ) : null}
        {kind === "counters" ? <>
          <CharacterSelect name="defender_character_id" label="自キャラ" options={characters} value={input(value?.defender_character_id)} />
          <CharacterSelect name="opponent_character_id" label="相手キャラ" options={characters} value={input(value?.opponent_character_id)} />
        </> : null}
        {kind === "trainings" ? <>
          <CharacterSelect name="player_character_id" label="自キャラ" options={characters} value={input(value?.player_character_id)} />
          <CharacterSelect name="dummy_character_id" label="ダミーキャラ" options={characters} value={input(value?.dummy_character_id)} />
        </> : null}

        {kind === "combos" ? <ComboFields value={value} /> : null}
        {kind === "setups" ? <SetupFields value={value} /> : null}
        {kind === "sequences" ? <SequenceFields value={value} /> : null}
        {kind === "counters" ? <CounterFields value={value} /> : null}
        {kind === "trainings" ? <TrainingFields value={value} /> : null}

        <Select name="valid_from_patch_id" label="有効開始Patch" options={patches} value={input(value?.valid_from_patch_id)} />
        <Select name="valid_to_patch_id" label="有効終了Patch" options={patches} value={input(value?.valid_to_patch_id)} />
        <label><span>検証状態</span><select name="verification_status" defaultValue={input(value?.verification_status) || "unverified"}><option value="unverified">unverified</option><option value="candidate">candidate</option><option value="verified">verified</option></select></label>
        <label><span>公開状態</span><select name="status" defaultValue={input(value?.status) || "draft"}><option value="draft">draft</option><option value="published">published</option><option value="archived">archived</option></select></label>
        {kind !== "trainings" ? <label><span>Content kind</span><select name="content_kind" defaultValue={input(value?.content_kind) || "verified_strategy"}><option value="verified_strategy">verified_strategy</option><option value="editorial">editorial</option></select></label> : null}
      </div>

      <fieldset className="admin-fieldset">
        <legend>出典</legend>
        <div className="admin-form-grid">
          <Select name="source_id" label="Source" options={sources} value="" />
          <label><span>関係</span><select name="source_relationship" defaultValue="primary"><option value="primary">primary</option><option value="supporting">supporting</option><option value="candidate">candidate</option></select></label>
          <label className="admin-span-2"><span>Source note</span><textarea name="source_note" rows={3} /></label>
        </div>
      </fieldset>

      <button className="button-primary" type="submit">{value ? "保存" : "draftで作成"}</button>
    </form>
  );
}

function ComboFields({ value }: { value?: Row | null }) { return <>
  <label><span>名前 *</span><input name="name" required defaultValue={input(value?.name)} /></label>
  <label><span>種別 *</span><input name="combo_type" required defaultValue={input(value?.combo_type)} placeholder="basic / punish / corner / SA" /></label>
  <label className="admin-span-2"><span>入力 *</span><textarea name="notation" required rows={3} defaultValue={input(value?.notation)} /></label>
  <label><span>始動</span><input name="starter_text" defaultValue={input(value?.starter_text)} /></label>
  <label><span>ダメージ</span><input name="damage" type="number" defaultValue={input(value?.damage)} /></label>
  <label><span>D消費</span><input name="drive_cost" type="number" step="0.01" defaultValue={input(value?.drive_cost)} /></label>
  <label><span>D回収</span><input name="drive_gain" type="number" step="0.01" defaultValue={input(value?.drive_gain)} /></label>
  <label><span>SA消費</span><input name="sa_cost" type="number" defaultValue={input(value?.sa_cost)} /></label>
  <label><span>位置</span><input name="position" defaultValue={input(value?.position)} /></label>
  <label><span>左右条件</span><input name="side_requirement" defaultValue={input(value?.side_requirement)} /></label>
  <label><span>難易度 1-5</span><input name="difficulty" type="number" min="1" max="5" defaultValue={input(value?.difficulty)} /></label>
  <label className="admin-span-2"><span>用途</span><textarea name="purpose" rows={2} defaultValue={input(value?.purpose)} /></label>
  <label className="admin-span-2"><span>条件</span><textarea name="conditions" rows={2} defaultValue={input(value?.conditions)} /></label>
  <label className="admin-span-2"><span>補足</span><textarea name="notes" rows={3} defaultValue={input(value?.notes)} /></label>
  <label className="admin-span-2"><span>動画URL</span><input name="video_url" type="url" defaultValue={input(value?.video_url)} /></label>
</>; }

function SetupFields({ value }: { value?: Row | null }) { return <>
  <label><span>名前 *</span><input name="name" required defaultValue={input(value?.name)} /></label>
  <label><span>種別</span><input name="setup_type" defaultValue={input(value?.setup_type)} /></label>
  <label className="admin-span-2"><span>始動条件</span><textarea name="starter_condition" rows={2} defaultValue={input(value?.starter_condition)} /></label>
  <label className="admin-span-2"><span>手順 *</span><textarea name="sequence_text" required rows={4} defaultValue={input(value?.sequence_text)} /></label>
  <label><span>有利F</span><input name="frame_advantage" type="number" defaultValue={input(value?.frame_advantage)} /></label>
  <label><span>位置</span><input name="position" defaultValue={input(value?.position)} /></label>
  <label><span>ゲージ条件</span><input name="meter_condition" defaultValue={input(value?.meter_condition)} /></label>
  <label className="admin-span-2"><span>説明</span><textarea name="description" rows={3} defaultValue={input(value?.description)} /></label>
  <label className="admin-span-2"><span>対策メモ</span><textarea name="counter_notes" rows={3} defaultValue={input(value?.counter_notes)} /></label>
</>; }

function SequenceFields({ value }: { value?: Row | null }) { return <>
  <label><span>名前 *</span><input name="name" required defaultValue={input(value?.name)} /></label>
  <label><span>種別</span><input name="sequence_type" defaultValue={input(value?.sequence_type)} /></label>
  <label className="admin-span-2"><span>連携 *</span><textarea name="sequence_text" required rows={4} defaultValue={input(value?.sequence_text)} /></label>
  <label><span>連続ガード</span><select name="is_true_blockstring" defaultValue={input(value?.is_true_blockstring)}><option value="">不明</option><option value="true">はい</option><option value="false">いいえ</option></select></label>
  <label><span>暴れどころ</span><input name="mash_point" defaultValue={input(value?.mash_point)} /></label>
  <label><span>投げ択</span><input name="throw_point" defaultValue={input(value?.throw_point)} /></label>
  <label><span>シミー</span><input name="shimmy_point" defaultValue={input(value?.shimmy_point)} /></label>
  <label><span>ジャンプ</span><input name="jump_option" defaultValue={input(value?.jump_option)} /></label>
  <label><span>パリィ</span><input name="parry_option" defaultValue={input(value?.parry_option)} /></label>
  <label><span>Dリバーサル</span><input name="drive_reversal_option" defaultValue={input(value?.drive_reversal_option)} /></label>
  <label><span>無敵技</span><input name="invincible_option" defaultValue={input(value?.invincible_option)} /></label>
  <label className="admin-span-2"><span>補足</span><textarea name="notes" rows={3} defaultValue={input(value?.notes)} /></label>
</>; }

function CounterFields({ value }: { value?: Row | null }) { return <>
  <label><span>タイトル *</span><input name="title" required defaultValue={input(value?.title)} /></label>
  <label><span>対象種別 *</span><input name="target_type" required defaultValue={input(value?.target_type)} placeholder="move / sequence / situation" /></label>
  <label><span>対象ID</span><input name="target_id" defaultValue={input(value?.target_id)} /></label>
  <label><span>対策種別 *</span><input name="counter_type" required defaultValue={input(value?.counter_type)} placeholder="guard / punish / parry / jump" /></label>
  <label className="admin-span-2"><span>状況</span><textarea name="situation" rows={2} defaultValue={input(value?.situation)} /></label>
  <label className="admin-span-2"><span>要約</span><textarea name="summary" rows={2} defaultValue={input(value?.summary)} /></label>
  <label className="admin-span-2"><span>方法 *</span><textarea name="method" required rows={4} defaultValue={input(value?.method)} /></label>
  <label><span>利点</span><textarea name="benefit" rows={2} defaultValue={input(value?.benefit)} /></label>
  <label><span>リスク</span><textarea name="risk" rows={2} defaultValue={input(value?.risk)} /></label>
  <label><span>難易度 1-5</span><input name="difficulty" type="number" min="1" max="5" defaultValue={input(value?.difficulty)} /></label>
  <label className="admin-span-2"><span>条件</span><textarea name="conditions" rows={2} defaultValue={input(value?.conditions)} /></label>
</>; }

function TrainingFields({ value }: { value?: Row | null }) { return <>
  <label><span>名前 *</span><input name="name" required defaultValue={input(value?.name)} /></label>
  <label><span>種別 *</span><input name="training_type" required defaultValue={input(value?.training_type)} /></label>
  <label className="admin-span-2"><span>目的 *</span><textarea name="purpose" required rows={2} defaultValue={input(value?.purpose)} /></label>
  <label><span>レベル</span><input name="level" defaultValue={input(value?.level)} /></label>
  <label><span>目安時間（分）</span><input name="duration_minutes" type="number" defaultValue={input(value?.duration_minutes)} /></label>
  <label className="admin-span-2"><span>録画設定</span><textarea name="recording_instructions" rows={3} defaultValue={input(value?.recording_instructions)} /></label>
  <label><span>再生設定</span><textarea name="playback_settings" rows={2} defaultValue={input(value?.playback_settings)} /></label>
  <label><span>CPU設定</span><textarea name="cpu_settings" rows={2} defaultValue={input(value?.cpu_settings)} /></label>
  <label className="admin-span-2"><span>方法 *</span><textarea name="method" required rows={4} defaultValue={input(value?.method)} /></label>
  <label className="admin-span-2"><span>成功条件</span><textarea name="success_criteria" rows={2} defaultValue={input(value?.success_criteria)} /></label>
  <label><span>推奨回数</span><input name="recommended_reps" type="number" defaultValue={input(value?.recommended_reps)} /></label>
  <label className="admin-span-2"><span>次の練習</span><textarea name="next_step" rows={2} defaultValue={input(value?.next_step)} /></label>
</>; }

function Select({ name, label, options, value }: { name: string; label: string; options: Option[]; value: string }) {
  return <label><span>{label}</span><select name={name} defaultValue={value}><option value="">未指定</option>{options.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>;
}

function CharacterSelect({ name, label, options, value, required = false }: { name: string; label: string; options: Option[]; value: string; required?: boolean }) {
  return <label><span>{label}</span><select name={name} required={required} defaultValue={value}><option value="">未指定</option>{options.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>;
}
