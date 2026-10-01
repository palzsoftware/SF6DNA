import test from "node:test";
import assert from "node:assert/strict";
import { buildSourceApplicationPlan } from "./source-application-plan.mjs";

function fixture() {
  const proposals = Array.from({ length: 30 }, (_, n) => ({ source_id: `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`, old_title: `Candidate ${n}`, old_publisher: null, proposed_title: `Reference ${n}`, proposed_publisher: "Author", expected_url: `https://www.youtube.com/watch?v=${n}`, proposed_usage: "LINK_ONLY + ATTRIBUTION", adoption_status: "candidate; not adopted" }));
  return { proposals, snapshot: { schema: { source_columns: ["title", "publisher", "url"] }, sources: proposals.map((row) => ({ id: row.source_id, title: row.old_title, publisher: null, url: row.expected_url })), relations: proposals.map((row) => ({ source_id: row.source_id, entity_type: "character", entity_id: "10000000-0000-4000-8000-000000000000", relationship: "candidate" })) } };
}

test("ready metadata proposals remain execution-blocked and preserve candidate links", () => {
  const { proposals, snapshot } = fixture();
  const before = JSON.stringify(snapshot);
  const plan = buildSourceApplicationPlan(proposals, snapshot);
  assert.equal(plan.readiness_counts.READY_TO_APPLY, 30);
  assert.equal(plan.execution_blocked, 30);
  assert.equal(plan.applied, 0);
  assert.equal(plan.rows[0].existing_relations[0].relationship, "candidate");
  assert.deepEqual(plan.rows[0].relationship_changes, []);
  assert.equal(plan.rows[0].game_facts_verified_by_link, false);
  assert.equal(JSON.stringify(snapshot), before);
});

test("exact source IDs reject duplicate or incomplete application scope", () => {
  const { proposals, snapshot } = fixture();
  assert.throws(() => buildSourceApplicationPlan(proposals.slice(1), snapshot), /exact_30/);
  proposals[1].source_id = proposals[0].source_id;
  assert.throws(() => buildSourceApplicationPlan(proposals, snapshot), /exact_30/);
});

test("missing source, incompatible schema and unsafe URLs block preparation", () => {
  const { proposals, snapshot } = fixture();
  snapshot.sources.pop();
  snapshot.sources[0].url = "http://example.com";
  assert.equal(buildSourceApplicationPlan(proposals, snapshot).readiness_counts.BLOCKED, 2);
  snapshot.schema.source_columns = ["title", "url"];
  assert.equal(buildSourceApplicationPlan(proposals, snapshot).readiness_counts.BLOCKED, 30);
});

test("fresh title or URL drift holds affected exact-ID rows instead of overwriting", () => {
  const { proposals, snapshot } = fixture();
  snapshot.sources[0].title = "Already reviewed title";
  snapshot.sources[1].url = "https://example.com/changed";
  const plan = buildSourceApplicationPlan(proposals, snapshot);
  assert.equal(plan.readiness_counts.HOLD, 2);
  assert.equal(plan.readiness_counts.READY_TO_APPLY, 28);
});

test("missing or malformed entity mappings cannot silently invent adoption", () => {
  const { proposals, snapshot } = fixture();
  snapshot.relations.pop();
  snapshot.relations[0].entity_id = "missing-entity";
  const plan = buildSourceApplicationPlan(proposals, snapshot);
  assert.equal(plan.readiness_counts.HOLD, 1);
  assert.equal(plan.readiness_counts.BLOCKED, 1);
});
