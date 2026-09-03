import { getPublicEntitySources } from "@/lib/public-source-links";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  getDevicePreviewCharacterMoveGlossary,
  getDevicePreviewContentDetail,
  getDevicePreviewMoveMotionMedia,
  type DevicePreviewContentDetail,
} from "@/lib/device-preview";
import {
  localizeBlockstring,
  localizeComboText,
  localizeCounterType,
  localizeCounterText,
  localizeDifficulty,
  localizeMoveCancelType,
  localizeMoveHitLevel,
  localizeMoveInvincibility,
  localizeMoveStrength,
  localizeMoveText,
  localizeMoveType,
  localizeSetupDetail,
  localizeSetupType,
  localizeSequenceDetail,
  localizeSequenceType,
  localizeTrainingLevel,
  localizeTrainingText,
  localizeTrainingType,
} from "@/lib/detail-localization";

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
  media?: DetailMedia[];
};

export type DetailMedia = {
  id: string;
  mediaType: "gif" | "video";
  mediaUrl: string;
  posterUrl: string | null;
  sourceUrl: string | null;
  sourceLabel: string | null;
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
  const [patchResult, sourceRows] = await Promise.all([
    patchId
      ? supabase.from("patches").select("version_label, name").eq("id", patchId).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    getPublicEntitySources(
      [entityType],
      [entityId],
    ),
  ]);

  if (patchResult.error) console.error(`[content-detail] ${entityType} patch failed`, patchResult.error.message);

  const patch = patchResult.data as { version_label?: string; name?: string | null } | null;
  const patchLabel = patch?.version_label
    ? `${patch.version_label}${patch.name ? ` / ${patch.name}` : ""}`
    : null;

  return {
    body: [
      ["検証状態", localizeComboText(verificationStatus) as string | null],
      ["対応バージョン", patchLabel],
    ],
    sources: dedupeSources(
      sourceRows.map((row) => ({
        id: row.sourceId,
        title: row.title,
        url: row.url,
        publisher: row.publisher,
        sourceType: row.sourceType,
        relationship: row.relationship,
      })),
    ),
  };
}

export async function getMoveBySlug(
  slug: string,
  previewToken?: string | null
): Promise<SimpleDetail | null> {
  if (!configured()) return null;
  const preview = await getDevicePreviewContentDetail("move", slug, previewToken);
  if (preview) {
    const data = preview.record;
    const frame = preview.frame ?? null;
    const commands = preview.commands ?? [];
    const classicCommands = commands
      .filter((command) => command.scheme === "classic")
      .map((command) => command.commandText ?? command.numericNotation ?? command.buttonNotation)
      .filter((value): value is string => Boolean(value));
    const modernCommands = commands
      .filter((command) => command.scheme === "modern")
      .map((command) => command.commandText ?? command.numericNotation ?? command.buttonNotation)
      .filter((value): value is string => Boolean(value));
    const frameStatus = previewValue(frame ?? {}, "verification_status");
    const characterId = previewValue(data, "character_id");
    const motionMedia = typeof characterId === "string"
      ? await getDevicePreviewMoveMotionMedia(characterId, previewToken)
      : [];

    return {
      id: String(data.id),
      slug: String(data.slug),
      title: String(data.name_ja),
      summary: localizeMoveText(
        previewValue(data, "usage_summary_ja")
          ?? previewValue(data, "description_ja")
          ?? previewValue(data, "usage_summary")
          ?? previewValue(data, "description")
      ) as string | null,
      body: [
        ["キャラクター", preview.characterName],
        ["公開状態", localizeComboText(previewValue(data, "status"))],
        ["フレーム検証状態", localizeComboText(frameStatus)],
        ["実機確認", frameStatus === "verified" ? "確認済み" : "実機確認待ち"],
        ["対応バージョン", preview.patchLabel],
        ["公式英語名", previewValue(data, "name_en")],
        ["技種別", localizeMoveType(previewValue(data, "move_type"))],
        ["強度", localizeMoveStrength(previewValue(data, "strength_variant"))],
        ["技の説明", previewValue(data, "description_ja")],
        ["クラシック入力", classicCommands.length ? classicCommands.join(" / ") : null],
        ["モダン入力", modernCommands.length ? modernCommands.join(" / ") : null],
        ["発生", previewValue(frame ?? {}, "startup")],
        ["持続", previewValue(frame ?? {}, "active")],
        ["硬直", previewValue(frame ?? {}, "recovery")],
        ["ヒット時", previewValue(frame ?? {}, "on_hit")],
        ["ガード時", previewValue(frame ?? {}, "on_block")],
        ["ダメージ", previewValue(frame ?? {}, "damage")],
        ["Dゲージダメージ", previewValue(frame ?? {}, "drive_damage")],
        ["SAゲージ増加", previewValue(frame ?? {}, "super_gain")],
        ["キャンセル", localizeMoveCancelType(previewValue(frame ?? {}, "cancel_type"))],
        ["攻撃判定", localizeMoveHitLevel(previewValue(frame ?? {}, "hit_level"))],
        ["無敵", localizeMoveInvincibility(previewValue(frame ?? {}, "invincibility"))],
        ["フレーム補足", localizeMoveText(previewValue(frame ?? {}, "notes"))],
      ],
      sources: dedupeSources(preview.sources),
      media: motionMedia
        .filter((item) => item.moveId === String(data.id))
        .map((item) => ({
          id: item.id,
          mediaType: item.mediaType,
          mediaUrl: item.mediaUrl,
          posterUrl: item.posterUrl,
          sourceUrl: item.sourceUrl,
          sourceLabel: item.sourceLabel,
        })),
    };
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("moves")
    .select("id, slug, name_ja, name_en, move_type, strength_variant, description_ja, usage_summary_ja, description, usage_summary, characters(name_ja)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error || !data) return null;

  const [
    { data: commands, error: commandError },
    { data: frame, error: frameError },
    moveSourceLinks,
    { data: motionMedia, error: motionMediaError },
  ] = await Promise.all([
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
    getPublicEntitySources(
      ["move"],
      [String(data.id)],
    ),
    supabase
      .from("move_motion_media")
      .select("id, media_type, media_url, poster_url, source_url, source_label")
      .eq("move_id", data.id)
      .eq("status", "published")
      .order("display_order", { ascending: true }),
  ]);

  if (commandError) console.error("[content-detail] move commands failed", commandError.message);
  if (frameError) console.error("[content-detail] move frame failed", frameError.message);
  if (motionMediaError) console.error("[content-detail] move motion media failed", motionMediaError.message);

  let patch: { version_label?: string; name?: string | null } | null = null;
  let frameSources: DetailSource[] = [];

  if (frame) {
    const frameQueries = await Promise.all([
      frame.valid_from_patch_id
        ? supabase.from("patches").select("version_label, name").eq("id", frame.valid_from_patch_id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      getPublicEntitySources(
        ["frame", "move_frame_data"],
        [String(frame.id)],
      ),
    ]);

    const [patchResult, frameSourceRows] = frameQueries;
    if (patchResult.error) console.error("[content-detail] move patch failed", patchResult.error.message);
    patch = patchResult.data;
    frameSources = frameSourceRows.map((row) => ({
      id: row.sourceId,
      title: row.title,
      url: row.url,
      publisher: row.publisher,
      sourceType: row.sourceType,
      relationship: row.relationship,
    }));
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
    summary: localizeMoveText(data.usage_summary_ja ?? data.description_ja ?? data.usage_summary ?? data.description ?? null) as string | null,
    body: [
      ["キャラクター", c?.name_ja ?? null],
      ["英語名", data.name_en ?? null],
      ["技種別", localizeMoveType(data.move_type ?? null)],
      ["強度", localizeMoveStrength(data.strength_variant ?? null)],
      ["技の説明", data.description_ja ?? null],
      ["クラシック入力", classicCommands.length ? classicCommands.join(" / ") : null],
      ["モダン入力", modernCommands.length ? modernCommands.join(" / ") : null],
      ["フレーム検証状態", localizeComboText(frame?.verification_status ?? null)],
      ["対応バージョン", patch?.version_label ? `${patch.version_label}${patch.name ? ` / ${patch.name}` : ""}` : null],
      ["発生", frame?.startup ?? null],
      ["持続", frame?.active ?? null],
      ["硬直", frame?.recovery ?? null],
      ["ヒット時", frame?.on_hit ?? null],
      ["ガード時", frame?.on_block ?? null],
      ["ダメージ", frame?.damage ?? null],
      ["Dゲージダメージ", frame?.drive_damage ?? null],
      ["SAゲージ増加", frame?.super_gain ?? null],
      ["キャンセル", localizeMoveCancelType(frame?.cancel_type ?? null)],
      ["攻撃判定", localizeMoveHitLevel(frame?.hit_level ?? null)],
      ["無敵", localizeMoveInvincibility(frame?.invincibility ?? null)],
      ["フレーム補足", localizeMoveText(frame?.notes ?? null)],
    ],
    sources: dedupeSources([
      ...moveSourceLinks.map((row) => ({
        id: row.sourceId,
        title: row.title,
        url: row.url,
        publisher: row.publisher,
        sourceType: row.sourceType,
        relationship: row.relationship,
      })),
      ...frameSources,
    ]),
    media: (motionMedia ?? []).map((item) => ({
      id: String(item.id),
      mediaType: item.media_type === "gif" ? "gif" : "video",
      mediaUrl: String(item.media_url),
      posterUrl: typeof item.poster_url === "string" ? item.poster_url : null,
      sourceUrl: typeof item.source_url === "string" ? item.source_url : null,
      sourceLabel: typeof item.source_label === "string" ? item.source_label : null,
    })),
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
    const glossary = preview.moveGlossary ?? [];
    return {
      id: String(data.id),
      slug: String(data.slug),
      title: localizeComboText(String(data.name), glossary) as string,
      summary: localizeSetupDetail("description", previewValue(data, "description"), glossary) as string | null,
      body: [
        ["キャラクター", preview.characterName],
        ...previewReleaseRows(preview),
        ["種類", localizeSetupType(previewValue(data, "setup_type"))],
        ["始動条件", localizeSetupDetail("starter_condition", previewValue(data, "starter_condition"), glossary)],
        ["手順", localizeSetupDetail("sequence_text", previewValue(data, "sequence_text"), glossary)],
        ["フレーム状況", localizeSetupDetail("frame_advantage", previewValue(data, "frame_advantage"), glossary)],
        ["菴咲ｽｮ", localizeSetupDetail("position", previewValue(data, "position"), glossary)],
        ["ゲージ条件", localizeSetupDetail("meter_condition", previewValue(data, "meter_condition"), glossary)],
        ["対策メモ", localizeSetupDetail("counter_notes", previewValue(data, "counter_notes"), glossary)],
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
    title: localizeComboText(String(data.name)) as string,
    summary: localizeSetupDetail("description", data.description ?? null) as string | null,
    body: [
      ["キャラクター", c?.name_ja ?? null],
      ...release.body,
      ["種類", localizeSetupType(data.setup_type ?? null)],
      ["始動条件", localizeSetupDetail("starter_condition", data.starter_condition ?? null)],
      ["手順", localizeSetupDetail("sequence_text", data.sequence_text ?? null)],
      ["フレーム状況", localizeSetupDetail("frame_advantage", data.frame_advantage ?? null)],
      ["菴咲ｽｮ", localizeSetupDetail("position", data.position ?? null)],
      ["ゲージ条件", localizeSetupDetail("meter_condition", data.meter_condition ?? null)],
      ["対策メモ", localizeSetupDetail("counter_notes", data.counter_notes ?? null)],
    ],
    sources: release.sources,
  };
}

export async function getSequenceBySlug(slug: string, previewToken?: string | null): Promise<SimpleDetail | null> {
  if (!configured()) return null;
  const preview = await getDevicePreviewContentDetail("sequence", slug, previewToken);
  if (preview) {
    const data = preview.record;
    const glossary = preview.moveGlossary ?? [];
    const trueBlockstring = previewBoolean(data, "is_true_blockstring");
    return {
      id: String(data.id),
      slug: String(data.slug),
      title: localizeComboText(String(data.name), glossary) as string,
      summary: localizeComboText(previewValue(data, "notes"), glossary) as string | null,
      body: [
        ["キャラクター", preview.characterName],
        ...previewReleaseRows(preview),
        ["種類", localizeSequenceType(previewValue(data, "sequence_type"))],
        ["連携", localizeComboText(previewValue(data, "sequence_text"), glossary)],
        ["ガード時の状態", localizeBlockstring(trueBlockstring)],
        ["割り込み", localizeSequenceDetail("mash_point", previewValue(data, "mash_point"), glossary)],
        ["投げ択", localizeSequenceDetail("throw_point", previewValue(data, "throw_point"), glossary)],
        ["シミー／様子見", localizeSequenceDetail("shimmy_point", previewValue(data, "shimmy_point"), glossary)],
        ["ジャンプへの対応", localizeSequenceDetail("jump_option", previewValue(data, "jump_option"), glossary)],
        ["パリィへの対応", localizeSequenceDetail("parry_option", previewValue(data, "parry_option"), glossary)],
        ["ドライブリバーサルへの対応", localizeSequenceDetail("drive_reversal_option", previewValue(data, "drive_reversal_option"), glossary)],
        ["無敵技への対応", localizeSequenceDetail("invincible_option", previewValue(data, "invincible_option"), glossary)],
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
    title: localizeComboText(String(data.name)) as string,
    summary: localizeComboText(data.notes ?? null) as string | null,
    body: [
      ["キャラクター", c?.name_ja ?? null],
      ...release.body,
      ["種類", localizeSequenceType(data.sequence_type ?? null)],
      ["連携", localizeComboText(data.sequence_text ?? null)],
      ["ガード時の状態", localizeBlockstring(data.is_true_blockstring)],
      ["割り込み", localizeSequenceDetail("mash_point", data.mash_point ?? null)],
      ["投げ択", localizeSequenceDetail("throw_point", data.throw_point ?? null)],
      ["シミー／様子見", localizeSequenceDetail("shimmy_point", data.shimmy_point ?? null)],
      ["ジャンプへの対応", localizeSequenceDetail("jump_option", data.jump_option ?? null)],
      ["パリィへの対応", localizeSequenceDetail("parry_option", data.parry_option ?? null)],
      ["ドライブリバーサルへの対応", localizeSequenceDetail("drive_reversal_option", data.drive_reversal_option ?? null)],
      ["無敵技への対応", localizeSequenceDetail("invincible_option", data.invincible_option ?? null)],
    ],
    sources: release.sources,
  };
}

export async function getCounterBySlug(slug: string, previewToken?: string | null): Promise<SimpleDetail | null> {
  if (!configured()) return null;
  const preview = await getDevicePreviewContentDetail("counter", slug, previewToken);
  if (preview) {
    const data = preview.record;
    const glossary = preview.moveGlossary ?? [];
    return {
      id: String(data.id),
      slug: String(data.slug),
      title: localizeCounterText(String(data.title), glossary) as string,
      summary: localizeCounterText(previewValue(data, "summary"), glossary) as string | null,
      body: [
        ["使用キャラクター", preview.characterName],
        ["対戦相手", preview.opponentCharacterName ?? null],
        ...previewReleaseRows(preview),
        ["種類", localizeCounterType(previewValue(data, "counter_type"))],
        ["状況", localizeCounterText(previewValue(data, "situation"), glossary)],
        ["対策", localizeCounterText(previewValue(data, "method"), glossary)],
        ["狙い", localizeCounterText(previewValue(data, "benefit"), glossary)],
        ["注意点", localizeCounterText(previewValue(data, "risk"), glossary)],
        ["難易度", localizeDifficulty(previewValue(data, "difficulty"))],
        ["条件", localizeCounterText(previewValue(data, "conditions"), glossary)],
      ],
      sources: preview.sources,
    };
  }
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("counters")
    .select("id, slug, title, summary, counter_type, method, benefit, risk, difficulty, conditions, situation, valid_from_patch_id, verification_status")
    .eq("slug", slug)
    .eq("status", "published")
    .eq("verification_status", "verified")
    .maybeSingle();
  if (error || !data) return null;
  const release = await getReleaseMetadata("counter", String(data.id), data.valid_from_patch_id ?? null, data.verification_status ?? null);
  return {
    id: String(data.id),
    slug: String(data.slug),
    title: localizeCounterText(String(data.title)) as string,
    summary: localizeCounterText(data.summary ?? null) as string | null,
    body: [
      ...release.body,
      ["種類", localizeCounterType(data.counter_type ?? null)],
      ["状況", localizeCounterText(data.situation ?? null)],
      ["対策", localizeCounterText(data.method ?? null)],
      ["狙い", localizeCounterText(data.benefit ?? null)],
      ["注意点", localizeCounterText(data.risk ?? null)],
      ["難易度", localizeDifficulty(data.difficulty ?? null)],
      ["条件", localizeCounterText(data.conditions ?? null)],
    ],
    sources: release.sources,
  };
}

export async function getTrainingBySlug(slug: string, previewToken?: string | null): Promise<SimpleDetail | null> {
  if (!configured()) return null;
  const preview = await getDevicePreviewContentDetail("training", slug, previewToken);
  if (preview) {
    const data = preview.record;
    const glossary = await getDevicePreviewCharacterMoveGlossary(
      typeof data.player_character_id === "string" ? data.player_character_id : null,
      previewToken
    );
    return {
      id: String(data.id),
      slug: String(data.slug),
      title: String(localizeTrainingText("name", String(data.name), glossary)),
      summary: localizeTrainingText("purpose", previewValue(data, "purpose"), glossary) as string | null,
      body: [
        ["操作キャラクター", preview.characterName],
        ["ダミー", preview.dummyCharacterName ?? null],
        ...previewReleaseRows(preview),
        ["練習内容", localizeTrainingType(previewValue(data, "training_type"))],
        ["対象レベル", localizeTrainingLevel(previewValue(data, "level"))],
        ["目安時間", typeof data.duration_minutes === "number" ? `${data.duration_minutes}分` : null],
        ["準備・録画設定", localizeTrainingText("recording_instructions", previewValue(data, "recording_instructions"), glossary)],
        ["再生設定", localizeTrainingText("playback_settings", previewValue(data, "playback_settings"), glossary)],
        ["CPU設定", localizeTrainingText("cpu_settings", previewValue(data, "cpu_settings"), glossary)],
        ["練習方法", localizeTrainingText("method", previewValue(data, "method"), glossary)],
        ["成功の目安", localizeTrainingText("success_criteria", previewValue(data, "success_criteria"), glossary)],
        ["推奨回数", typeof data.recommended_reps === "number" ? `${data.recommended_reps}回` : null],
        ["次に進む練習", localizeTrainingText("next_step", previewValue(data, "next_step"), glossary)],
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
    title: String(localizeTrainingText("name", data.name)),
    summary: localizeTrainingText("purpose", data.purpose ?? null) as string | null,
    body: [
      ...release.body,
      ["練習内容", localizeTrainingType(data.training_type ?? null)],
      ["対象レベル", localizeTrainingLevel(data.level ?? null)],
      ["目安時間", typeof data.duration_minutes === "number" ? `${data.duration_minutes}分` : null],
      ["準備・録画設定", localizeTrainingText("recording_instructions", data.recording_instructions ?? null)],
      ["再生設定", localizeTrainingText("playback_settings", data.playback_settings ?? null)],
      ["CPU設定", localizeTrainingText("cpu_settings", data.cpu_settings ?? null)],
      ["練習方法", localizeTrainingText("method", data.method ?? null)],
      ["成功の目安", localizeTrainingText("success_criteria", data.success_criteria ?? null)],
      ["推奨回数", typeof data.recommended_reps === "number" ? `${data.recommended_reps}回` : null],
      ["次に進む練習", localizeTrainingText("next_step", data.next_step ?? null)],
    ],
    sources: release.sources,
  };
}
