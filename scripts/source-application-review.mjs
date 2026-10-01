#!/usr/bin/env node
// Generates an offline plan from explicitly supplied JSON. Never applies it.
import { readFileSync } from "node:fs";
import { buildSourceApplicationPlan } from "./source-application-plan.mjs";

const [proposalPath, snapshotPath] = process.argv.slice(2);
if (!proposalPath || !snapshotPath) {
  throw new Error("usage: node scripts/source-application-review.mjs PROPOSAL_JSON SNAPSHOT_JSON");
}
const input = JSON.parse(readFileSync(proposalPath, "utf8"));
const snapshot = JSON.parse(readFileSync(snapshotPath, "utf8"));
const plan = buildSourceApplicationPlan(input.proposals, snapshot);
process.stdout.write(`${JSON.stringify(plan, null, 2)}\n`);
