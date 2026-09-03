import { legacyCharacterImageUrl } from "@/lib/legacy-character-images";
import {
  getDevicePreviewBundle,
  getDevicePreviewCharacterMoveGlossary,
} from "@/lib/device-preview";
import { localizeCharacterGuideText } from "@/lib/detail-localization";
import { getPublicEntitySources } from "@/lib/public-source-links";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type {
  CharacterDetail,
  CharacterGuideSection,
  CharacterSummary,
  SourceReference,
} from "@/types/character";

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function toSummary(row: Record<string, unknown>): CharacterSummary {
  const slug = String(row.slug);

  return {
    id: String(row.id),
    slug,
    name: String(row.name_ja),
    nameEn:
      typeof row.name_en === "string"
        ? row.name_en
        : null,
    shortDescription:
      typeof row.summary === "string"
        ? String(localizeCharacterGuideText(row.summary))
        : null,
    imageUrl:
      typeof row.image_url === "string" && row.image_url.trim()
        ? row.image_url
        : legacyCharacterImageUrl(slug),
    difficulty:
      typeof row.difficulty === "number"
        ? row.difficulty
        : null,
    rangeLabel:
      typeof row.preferred_range === "string"
        ? row.preferred_range
        : null,
    archetypeLabel:
      typeof row.archetype === "string"
        ? row.archetype
        : null,
    releaseDate:
      typeof row.release_date === "string"
        ? row.release_date
        : null,
    updatedAt:
      typeof row.updated_at === "string"
        ? row.updated_at
        : null,
  };
}

export async function listCharacters(): Promise<CharacterSummary[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("characters")
    .select(
      "id, slug, name_ja, name_en, summary, image_url, difficulty, preferred_range, archetype, release_date, updated_at",
    )
    .eq("status", "published")
    .eq("is_playable", true)
    .order("display_order", {
      ascending: true,
      nullsFirst: false,
    })
    .order("name_ja", {
      ascending: true,
    });

  if (error) {
    console.error("[characters] list failed", error.message);
    return [];
  }

  return (data ?? []).map((row) => toSummary(row));
}

export async function getCharacterBySlug(
  slug: string,
  previewToken?: string | null,
): Promise<CharacterDetail | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = getSupabaseServerClient();

  const { data: character, error } = await supabase
    .from("characters")
    .select(
      "id, slug, name_ja, name_en, summary, image_url, difficulty, preferred_range, archetype, release_date, updated_at, strengths_summary, weaknesses_summary",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .eq("is_playable", true)
    .maybeSingle();

  if (error || !character) {
    if (error) {
      console.error(
        "[characters] detail failed",
        error.message,
      );
    }

    return null;
  }

  const [
    { data: sections, error: sectionError },
    sourceLinks,
    previewBundle,
    moveGlossary,
  ] = await Promise.all([
    supabase
      .from("character_guide_sections")
      .select(
        "id, section_type, title, body, display_order",
      )
      .eq("character_id", character.id)
      .eq("status", "published")
      .eq("verification_status", "verified")
      .order("display_order", {
        ascending: true,
      }),

    getPublicEntitySources(
      ["character"],
      [String(character.id)],
    ),

    getDevicePreviewBundle(
      String(character.id),
      previewToken,
    ),

    getDevicePreviewCharacterMoveGlossary(
      String(character.id),
      previewToken,
    ),
  ]);

  if (sectionError) {
    console.error(
      "[characters] guide sections failed",
      sectionError.message,
    );
  }

  const guideSections: CharacterGuideSection[] = previewBundle
    ? previewBundle.guideSections.map((row) => ({
        id: String(row.id),
        sectionKey: String(row.sectionType),
        title: String(
          localizeCharacterGuideText(
            row.title,
            moveGlossary,
          ),
        ),
        body: String(
          localizeCharacterGuideText(
            row.body,
            moveGlossary,
          ),
        ),
        sortOrder: Number(row.displayOrder ?? 0),
      }))
    : (sections ?? []).map((row) => ({
        id: String(row.id),
        sectionKey: String(row.section_type),
        title: String(
          localizeCharacterGuideText(row.title),
        ),
        body: String(
          localizeCharacterGuideText(row.body),
        ),
        sortOrder: Number(row.display_order ?? 0),
      }));

  const sources: SourceReference[] = sourceLinks.map(
    (row) => ({
      id: row.sourceId,
      title: row.title,
      url: row.url,
      publisher: row.publisher,
      sourceType: row.sourceType,
      relationship: row.relationship,
    }),
  );

  const base = toSummary(character);

  const previewOverview =
    previewBundle?.guideSections.find(
      (section) => section.sectionType === "overview",
    );

  return {
    ...base,

    shortDescription:
      base.shortDescription ??
      (previewOverview?.summary
        ? String(
            localizeCharacterGuideText(
              previewOverview.summary,
              moveGlossary,
            ),
          )
        : null),

    strengthsSummary:
      typeof character.strengths_summary === "string"
        ? String(
            localizeCharacterGuideText(
              character.strengths_summary,
              moveGlossary,
            ),
          )
        : null,

    weaknessesSummary:
      typeof character.weaknesses_summary === "string"
        ? String(
            localizeCharacterGuideText(
              character.weaknesses_summary,
              moveGlossary,
            ),
          )
        : null,

    guideSections,
    sources,
  };
}

export function characterDataSourceStatus() {
  return isSupabaseConfigured()
    ? "connected"
    : "unconfigured";
}