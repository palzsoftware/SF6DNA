// Offline review planner only. It has no network, SQL, or public-app adapter.
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function httpsUrl(value) {
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}

export function buildSourceApplicationPlan(proposals, snapshot) {
  if (proposals.length !== 30 || new Set(proposals.map((row) => row.source_id)).size !== 30) {
    throw new Error("exact_30_distinct_source_ids_required");
  }
  const sources = new Map(snapshot.sources.map((row) => [row.id, row]));
  const links = snapshot.relations ?? [];
  const supported = new Set(snapshot.schema.source_columns);
  const rows = proposals.map((proposal) => {
    const current = sources.get(proposal.source_id);
    const relations = links.filter((link) => link.source_id === proposal.source_id);
    const blockers = [];
    const holds = [];
    if (!uuidPattern.test(proposal.source_id)) blockers.push("INVALID_SOURCE_ID");
    if (!current) blockers.push("SOURCE_NOT_IN_FRESH_SNAPSHOT");
    if (!supported.has("title") || !supported.has("publisher") || !supported.has("url")) blockers.push("SCHEMA_INCOMPATIBLE");
    if (!proposal.proposed_title?.trim() || !proposal.proposed_publisher?.trim()) blockers.push("MISSING_ATTRIBUTION_METADATA");
    if (current && !httpsUrl(current.url)) blockers.push("NON_HTTPS_URL");
    if (current && (current.title !== proposal.old_title || current.publisher !== proposal.old_publisher)) holds.push("BASE_METADATA_CHANGED_REVIEW_DIFF");
    if (current && proposal.expected_url && current.url !== proposal.expected_url) holds.push("BASE_URL_CHANGED_REVIEW_DIFF");
    if (!relations.length) holds.push("NO_EXISTING_ENTITY_RELATIONSHIP");
    if (relations.some((link) => !uuidPattern.test(link.entity_id) || !link.entity_type || !link.relationship)) blockers.push("INVALID_RELATIONSHIP_IDENTITY");
    const status = blockers.length ? "BLOCKED" : holds.length ? "HOLD" : "READY_TO_APPLY";
    return {
      source_id: proposal.source_id,
      row_readiness: status,
      blockers,
      holds,
      before: current ? { title: current.title, publisher: current.publisher, url: current.url } : null,
      proposed_metadata: { title: proposal.proposed_title, publisher: proposal.proposed_publisher, url: current?.url ?? null },
      proposed_usage: proposal.proposed_usage,
      adoption_status: proposal.adoption_status,
      existing_relations: relations.map((link) => ({ entity_type: link.entity_type, entity_id: link.entity_id, relationship: link.relationship, ...(link.entity_label ? { entity_label: link.entity_label } : {}) })),
      relationship_changes: [],
      source_type_changes: [],
      reliability_changes: [],
      publication_changes: [],
      execution_status: "BLOCKED",
      execution_blockers: ["DB_WRITE_PROHIBITED", "PUBLIC_APPLICATION_APPROVAL_REQUIRED"],
      applied: false,
      game_facts_verified_by_link: false,
    };
  });
  return {
    total: rows.length,
    readiness_counts: Object.fromEntries(["READY_TO_APPLY", "BLOCKED", "HOLD"].map((status) => [status, rows.filter((row) => row.row_readiness === status).length])),
    execution_blocked: rows.length,
    applied: 0,
    rows,
  };
}
