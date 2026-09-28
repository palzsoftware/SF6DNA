import assert from "node:assert/strict";
import { test } from "node:test";
import { matchesResource } from "../src/lib/combo-resource.ts";

test("resource filters do not classify unknown costs as zero", () => {
  const unknown = { drive: null, sa: null };
  assert.equal(matchesResource(unknown, "all"), true);
  assert.equal(matchesResource(unknown, "meterless"), false);
  assert.equal(matchesResource(unknown, "no-sa"), false);
  assert.equal(matchesResource(unknown, "drive"), false);
  assert.equal(matchesResource(unknown, "sa"), false);
  assert.equal(matchesResource({ drive: 0, sa: null }, "meterless"), false);
  assert.equal(matchesResource({ drive: null, sa: 0 }, "no-sa"), true);
});

test("resource filters retain known zero and positive costs", () => {
  const free = { drive: 0, sa: 0 };
  assert.equal(matchesResource(free, "meterless"), true);
  assert.equal(matchesResource(free, "no-sa"), true);
  assert.equal(matchesResource({ drive: 2, sa: 0 }, "drive"), true);
  assert.equal(matchesResource({ drive: 0, sa: 1 }, "sa"), true);
  assert.equal(matchesResource({ drive: 0, sa: 1 }, "no-sa"), false);
});
