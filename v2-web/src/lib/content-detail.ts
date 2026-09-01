import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  getDevicePreviewContentDetail,
  type DevicePreviewContentDetail,
} from "@/lib/device-preview";
import { localizeComboText, localizeDifficulty } from "@/lib/detail-localization";

function configured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export type DetailSource = {
  id: string;
  title: string;
  url: string;
  publisher: string | null;
  sourceType: string;
  relationship: string;
};

export type SimpleDetail = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body: Array<[string, string | number | null]>;
  sources?: DetailSource[];
};

function previewValue(record: Record<string, unknown>, key: string): string | number | null {
  const value = record[key];
  if (typeof value === "string" || typeof value === "number") return value;
  return null;
}

function previewBoolean(record: Record<string, unknown>, key: string): boolean | null {
  const value = record[key];
  return typeof value === "boolean" ? value : null;
}

function previewVerificationLabel(record: Record<string, unknown>) {
  return previewValue(record, "verification_status") === "verified" ? "確認済み" : "撮影・実機確認待ち";
}

function previewReleaseRows(detail: DevicePreviewContentDetail): Array<[string, string | number | null]> {
  return [
    ["公開状態", localizeComboText(previewValue(detail.record, "status"))],
    ["検証状態", localizeComboText(previewValue(detail.record, "verification_status"))],
    ["実機確認", previewVerificationLabel(detail.record)],
    ["対応バージョン", detail.patchLabel],
  ];
}

type SourceLinkRow = {
  relationship?: string | null;
  sources?: {
    id?: string;
    title?: string;
    url?: string;
    publisher?: string | null;
    source_type?: string;
  } | null;
};

function toSources(rows: unknown[] | null | undefined): DetailSource[] {
  return (rows ?? []).flatMap((raw) => {
    const row = raw as SourceLinkRow;
    const source = row.sources;
    if (!source?.id || !source.title || !source.url || !source.source_type) return [];
    return [{
      id: source.id,
      title: source.title,
      url: source.url,
      publisher: source.publisher ?? null,
      sourceType: source.source_type,
      relationship: String(row.relationship ?? "supporting"),
    }];
  });
}

function dedupeSources(sources: DetailSource[]): DetailSource[] {
  const map = new Map<string, DetailSource>();
  for (const source of sources) {
    const key = `${source.url}::${source.title}`;
    if (!map.has(key)) map.set(key, source);
  }
  return [...map.values()];
}

function commandLabel(command: {
  command_text?: string | null;
  numeric_notation?: string | null;
  button_notation?: string | null;
  condition_text?: string | null;
}) {
  const primary = command.command_text ?? command.numeric_notation ?? command.button_notation ?? null;
  if (!primary) return null;
  return command.condition_text ? `${primary}（${command.condition_text}）` : primary;
}

async function getReleaseMetadata(
  entityType: "combo" | "setup" | "sequence" | "counter" | "training",
  entityId: string,
  patchId: string | null,
  verificationStatus: string | null
): Promise<{ body: Array<[string, string | null]>; sources: DetailSource[] }> {
  const supabase = getSupabaseServerClient();
  const [patchResult, sourceResult] = await Promise.all([
    patchId
      ? supabase.from("patches").select("version_label, name").eq("id", patchId).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    supabase
      .from("entity_sources")
      .select("relationship, sources!inner(id, title, url, publisher, source_type)")
      .eq("entity_type", entityType)
      .eq("entity_id", entityId),
  ]);

  if (patchResult.error) console.error(`[content-detail] ${entityType} patch failed`, patchResult.error.message);
  if (sourceResult.error) console.error(`[content-detail] ${entityType} sources failed`, sourceResult.error.message);

  const patch = patchResult.data as { version_label?: string; name?: string | null } | null;
  const patchLabel = patch?.version_label
    ? `${patch.version_label}${patch.name ? ` / ${patch.name}` : ""}`
    : null;

  return {
    body: [
      ["Verification", verificationStatus],
      ["Patch", patchLabel],
    ],
    sources: dedupeSources(toSources(sourceResult.data as unknown[] | null)),
  };
}

export async function getMoveBySlug(slug: string): Promise<SimpleDetail | null> {
  if (!configured()) return null;
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("moves")
    .select("id, slug, name_ja, name_en, move_type, strength_variant, description, usage_summary, characters(name_ja)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error || !data) return null;

  const [{ data: commands, error: commandError }, { data: frame, error: frameError }, { data: moveSourceLinks, error: moveSourceError }] = await Promise.all([
    supabase
      .from("move_commands")
      .select("id, control_scheme, command_text, numeric_notation, button_notation, condition_text, sort_order")
      .eq("move_id", data.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("move_frame_data")
      .select("id, startup, active, recovery, on_hit, on_block, damage, drive_damage, super_gain, cancel_type, hit_level, invincibility, notes, valid_from_patch_id, verification_status")
      .eq("move_id", data.id)
      .eq("verification_status", "verified")
      .is("valid_to_patch_id", null)
      .limit(1)
      .maybeSingle(),
    supabase
      .from("entity_sources")
      .select("relationship, sources!inner(id, title, url, publisher, source_type)")
      .eq("entity_type", "move")
      .eq("entity_id", data.id),
  ]);

  if (commandError) console.error("[content-detail] move commands failed", commandError.message);
  if (frameError) console.error("[content-detail] move frame failed", frameError.message);
  if (moveSourceError) console.error("[content-detail] move sources failed", moveSourceError.message);

  let patch: { version_label?: string; name?: string | null } | null = null;
  let frameSources: DetailSource[] = [];

  if (frame) {
    const frameQueries = await Promise.all([
      frame.valid_from_patch_id
        ? supabase.from("patches").select("version_label, name").eq("id", frame.valid_from_patch_id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      supabase
        .from("entity_sources")
        .select("relationship, sources!inner(id, title, url, publisher, source_type)")
        .in("entity_type", ["frame", "move_frame_data"])
        .eq("entity_id", frame.id),
    ]);

    const [patchResult, frameSourceResult] = frameQueries;
    if (patchResult.error) console.error("[content-detail] move patch failed", patchResult.error.message);
    if (frameSourceResult.error) console.error("[content-detail] move frame sources failed", frameSourceResult.error.message);
    patch = patchResult.data;
    frameSources = toSources(frameSourceResult.data as unknown[] | null);
  }

  const classicCommands = (commands ?? [])
    .filter((command) => command.control_scheme === "classic")
    .map(commandLabel)
    .filter((value): value is string => Boolean(value));
  const modernCommands = (commands ?? [])
    .filter((command) => command.control_scheme === "modern")
    .map(commandLabel)
    .filter((value): value is string => Boolean(value));

  const c = data.characters as unknown as { name_ja?: string } | null;
  return {
    id: String(data.id),
    slug: String(data.slug),
    title: String(data.name_ja),
    summary: data.usage_summary ?? data.description ?? null,
    body: [
      ["キャラクター", c?.name_ja ?? null],
      ["英語名", data.name_en ?? null],
      ["技種別", data.move_type ?? null],
      ["強度", data.strength_variant ?? null],
      ["Classic Command", classicCommands.length ? classicCommands.join(" / ") : null],
      ["Modern Command", modernCommands.length ? modernCommands.join(" / ") : null],
      ["Frame Verification", frame?.verification_status ?? null],
      ["Patch", patch?.version_label ? `${patch.version_label}${patch.name ? ` / ${patch.name}` : ""}` : null],
      ["発生", frame?.startup ?? null],
      ["持続", frame?.active ?? null],
      ["硬直", frame?.recovery ?? null],
      ["ヒット", frame?.on_hit ?? null],
      ["ガード", frame?.on_block ?? null],
      ["ダメージ", frame?.damage ?? null],
      ["Dゲージダメージ", frame?.drive_damage ?? null],
      ["SAゲージ増加", frame?.super_gain ?? null],
      ["キャンセル", frame?.cancel_type ?? null],
      ["判定", frame?.hit_level ?? null],
      ["無敵", frame?.invincibility ?? null],
      ["Frame補足", frame?.notes ?? null],
    ],
    sources: dedupeSources([
      ...toSources(moveSourceLinks as unknown[] | null),
      ...frameSources,
    ]),
  };
}

export async function getComboBySlug(slug: string, previewToken?: string | null): Promise<SimpleDetail | null> {
  if (!configured()) return null;
  const preview = await getDevicePreviewContentDetail("combo", slug, previewToken);
  if (preview) {
    const data = preview.record;
    const glossary = preview.moveGlossary ?? [];
    return {
      id: String(data.id),
      slug: String(data.slug),
      title: localizeComboText(String(data.name), glossary) as string,
      summary: localizeComboText(previewValue(data, "purpose"), glossary) as string | null,
      body: [
        ["キャラクター", preview.characterName],
        ...previewReleaseRows(preview),
        ["入力", localizeComboText(previewValue(data, "notation"), glossary)],
        ["始動", localizeComboText(previewValue(data, "starter_text"), glossary)],
        ["ダメージ", previewValue(data, "damage")],
        ["Dゲージ", previewValue(data, "drive_cost")],
        ["SA", previewValue(data, "sa_cost")],
        ["位置", localizeComboText(previewValue(data, "position"), glossary)],
        ["難易度", localizeDifficulty(previewValue(data, "difficulty"))],
        ["条件", localizeComboText(previewValue(data, "conditions"), glossary)],
        ["補足", localizeComboText(previewValue(data, "notes"), glossary)],
      ],
      sources: preview.sources,
    };
  }
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("combos")
    .select("id, slug, name, notation, starter_text, damage, drive_cost, sa_cost, position, difficulty, purpose, conditions, notes, valid_from_patch_id, verification_status, characters(name_ja)")
    .eq("slug", slug)
    .eq("status", "published")
    .eq("verification_status", "verified")
    .maybeSingle();
  if (error || !data) return null;
  const c = data.characters as unknown as { name_ja?: string } | null;
  const release = await getReleaseMetadata("combo", String(data.id), data.valid_from_patch_id ?? null, data.verification_status ?? null);
  return {
    id: String(data.id),
    slug: String(data.slug),
    title: String(data.name),
    summary: data.purpose ?? null,
    body: [
      ["キャラクター", c?.name_ja ?? null],
      ...release.body,
      ["入力", data.notation ?? null],
      ["始動", data.starter_text ?? null],
      ["ダメージ", data.damage ?? null],
      ["Dゲージ", data.drive_cost ?? null],
      ["SA", data.sa_cost ?? null],
      ["位置", data.position ?? null],
      ["難易度", data.difficulty ?? null],
      ["条件", data.conditions ?? null],
      ["補足", data.notes ?? null],
    ],
    sources: release.sources,
  };
}

export async function getSetupBySlug(slug: string, previewToken?: string | null): Promise<SimpleDetail | null> {
  if (!configured()) return null;
  const preview = await getDevicePreviewContentDetail("setup", slug, previewToken);
  if (preview) {
    const data = preview.record;
    return {
      id: String(data.id),
      slug: String(data.slug),
      title: String(data.name),
      summary: previewValue(data, "description") as string | null,
      body: [
        ["キャラクター", preview.characterName],
        ...previewReleaseRows(preview),
        ["種類", previewValue(data, "setup_type")],
        ["始動条件", previewValue(data, "starter_condition")],
        ["手順", previewValue(data, "sequence_text")],
        ["有利F", previewValue(data, "frame_advantage")],
        ["位置", previewValue(data, "position")],
        ["ゲージ条件", previewValue(data, "meter_condition")],
        ["対策メモ", previewValue(data, "counter_notes")],
      ],
      sources: preview.sources,
    };
  }
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("setups")
    .select("id, slug, name, setup_type, starter_condition, sequence_text, frame_advantage, position, meter_condition, description, counter_notes, valid_from_patch_id, verification_status, characters(name_ja)")
    .eq("slug", slug)
    .eq("status", "published")
    .eq("verification_status", "verified")
    .maybeSingle();
  if (error || !data) return null;
  const c = data.characters as unknown as { name_ja?: string } | null;
  const release = await getReleaseMetadata("setup", String(data.id), data.valid_from_patch_id ?? null, data.verification_status ?? null);
  return {
    id: String(data.id),
    slug: String(data.slug),
    title: String(data.name),
    summary: data.description ?? null,
    body: [
      ["キャラクター", c?.name_ja ?? null],
      ...release.body,
      ["種類", data.setup_type ?? null],
      ["始動条件", data.starter_condition ?? null],
      ["手順", data.sequence_text ?? null],
      ["有利F", data.frame_advantage ?? null],
      ["位置", data.position ?? null],
      ["ゲージ条件", data.meter_condition ?? null],
      ["対策メモ", data.counter_notes ?? null],
    ],
    sources: release.sources,
  };
}

export async function getSequenceBySlug(slug: string, previewToken?: string | null): Promise<SimpleDetail | null> {
  if (!configured()) return null;
  const preview = await getDevicePreviewContentDetail("sequence", slug, previewToken);
  if (preview) {
    const data = preview.record;
    const trueBlockstring = previewBoolean(data, "is_true_blockstring");
    return {
      id: String(data.id),
      slug: String(data.slug),
      title: String(data.name),
      summary: previewValue(data, "notes") as string | null,
      body: [
        ["キャラクター", preview.characterName],
        ...previewReleaseRows(preview),
        ["種類", previewValue(data, "sequence_type")],
        ["連携", previewValue(data, "sequence_text")],
        ["連続ガード", trueBlockstring === true ? "はい" : trueBlockstring === false ? "いいえ" : null],
        ["暴れどころ", previewValue(data, "mash_point")],
        ["投げ択", previewValue(data, "throw_point")],
        ["シミー", previewValue(data, "shimmy_point")],
        ["ジャンプ", previewValue(data, "jump_option")],
        ["パリィ", previewValue(data, "parry_option")],
        ["Dリバーサル", previewValue(data, "drive_reversal_option")],
        ["無敵技", previewValue(data, "invincible_option")],
        ["補足", previewValue(data, "notes")],
      ],
      sources: preview.sources,
    };
  }
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("sequences")
    .select("id, slug, name, sequence_type, sequence_text, is_true_blockstring, mash_point, throw_point, shimmy_point, jump_option, parry_option, drive_reversal_option, invincible_option, notes, valid_from_patch_id, verification_status, characters(name_ja)")
    .eq("slug", slug)
    .eq("status", "published")
    .eq("verification_status", "verified")
    .maybeSingle();
  if (error || !data) return null;
  const c = data.characters as unknown as { name_ja?: string } | null;
  const release = await getReleaseMetadata("sequence", String(data.id), data.valid_from_patch_id ?? null, data.verification_status ?? null);
  return {
    id: String(data.id),
    slug: String(data.slug),
    title: String(data.name),
    summary: data.notes ?? null,
    body: [
      ["キャラクター", c?.name_ja ?? null],
      ...release.body,
      ["種類", data.sequence_type ?? null],
      ["連携", data.sequence_text ?? null],
      ["連続ガード", data.is_true_blockstring === true ? "はい" : data.is_true_blockstring === false ? "いいえ" : null],
      ["暴れどころ", data.mash_point ?? null],
      ["投げ択", data.throw_point ?? null],
      ["シミー", data.shimmy_point ?? null],
      ["ジャンプ", data.jump_option ?? null],
      ["パリィ", data.parry_option ?? null],
      ["Dリバーサル", data.drive_reversal_option ?? null],
      ["無敵技", data.invincible_option ?? null],
      ["補足", data.notes ?? null],
    ],
    sources: release.sources,
  };
}

export async function getCounterBySlug(slug: string): Promise<SimpleDetail | null> {
  if (!configured()) return null;
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("counters")
    .select("id, slug, title, summary, method, benefit, risk, difficulty, conditions, situation, valid_from_patch_id, verification_status")
    .eq("slug", slug)
    .eq("status", "published")
    .eq("verification_status", "verified")
    .maybeSingle();
  if (error || !data) return null;
  const release = await getReleaseMetadata("counter", String(data.id), data.valid_from_patch_id ?? null, data.verification_status ?? null);
  return {
    id: String(data.id),
    slug: String(data.slug),
    title: String(data.title),
    summary: data.summary ?? null,
    body: [
      ...release.body,
      ["状況", data.situation ?? null],
      ["方法", data.method ?? null],
      ["利点", data.benefit ?? null],
      ["リスク", data.risk ?? null],
      ["難易度", data.difficulty ?? null],
      ["条件", data.conditions ?? null],
    ],
    sources: release.sources,
  };
}

export async function getTrainingBySlug(slug: string, previewToken?: string | null): Promise<SimpleDetail | null> {
  if (!configured()) return null;
  const preview = await getDevicePreviewContentDetail("training", slug, previewToken);
  if (preview) {
    const data = preview.record;
    return {
      id: String(data.id),
      slug: String(data.slug),
      title: String(data.name),
      summary: previewValue(data, "purpose") as string | null,
      body: [
        ["操作キャラクター", preview.characterName],
        ["ダミー", preview.dummyCharacterName ?? null],
        ...previewReleaseRows(preview),
        ["種類", previewValue(data, "training_type")],
        ["レベル", previewValue(data, "level")],
        ["目安時間", previewValue(data, "duration_minutes")],
        ["録画", previewValue(data, "recording_instructions")],
        ["再生設定", previewValue(data, "playback_settings")],
        ["CPU設定", previewValue(data, "cpu_settings")],
        ["方法", previewValue(data, "method")],
        ["成功条件", previewValue(data, "success_criteria")],
        ["回数", previewValue(data, "recommended_reps")],
        ["次の練習", previewValue(data, "next_step")],
      ],
      sources: preview.sources,
    };
  }
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("trainings")
    .select("id, slug, name, training_type, purpose, level, duration_minutes, recording_instructions, playback_settings, cpu_settings, method, success_criteria, recommended_reps, next_step, valid_from_patch_id, verification_status")
    .eq("slug", slug)
    .eq("status", "published")
    .eq("verification_status", "verified")
    .maybeSingle();
  if (error || !data) return null;
  const release = await getReleaseMetadata("training", String(data.id), data.valid_from_patch_id ?? null, data.verification_status ?? null);
  return {
    id: String(data.id),
    slug: String(data.slug),
    title: String(data.name),
    summary: data.purpose ?? null,
    body: [
      ...release.body,
      ["種類", data.training_type ?? null],
      ["レベル", data.level ?? null],
      ["目安時間", data.duration_minutes ?? null],
      ["録画", data.recording_instructions ?? null],
      ["再生設定", data.playback_settings ?? null],
      ["CPU設定", data.cpu_settings ?? null],
      ["方法", data.method ?? null],
      ["成功条件", data.success_criteria ?? null],
      ["回数", data.recommended_reps ?? null],
      ["次の練習", data.next_step ?? null],
    ],
    sources: release.sources,
  };
}
