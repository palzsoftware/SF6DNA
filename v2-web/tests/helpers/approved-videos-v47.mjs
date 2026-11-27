import { readFileSync, existsSync } from "node:fs";
// Approved-video list from Claude B (review_v46 / approval_candidate_keys_v46), user approval 2026-11-27 15:31.
// Tests derive the expected approval state from this list instead of assuming "everything is PENDING".
const read = name => JSON.parse(readFileSync(new URL(`../fixtures/${name}`, import.meta.url), "utf8"));
// V51: additional approval lists are merged when their fixture exists (applied together with their data rows).
const lists = [read("approved-videos-v47.json"), ...["approved-videos-v51.json"].filter(n => existsSync(new URL(`../fixtures/${n}`, import.meta.url))).map(read)];
const fx = Object.fromEntries(["readyRowKeys", "readyYoutubeIds", "holdYoutubeIds", "excludedYoutubeIds"].map(k => [k, lists.flatMap(l => l[k])]));
/** Row keys added after V47 (kept apart for tests that pin the original V47 rows). */
export const laterRowKeys = new Set(lists.slice(1).flatMap(l => l.readyRowKeys));
export const approvedRowKeys = new Set(fx.readyRowKeys);
export const readyIds = new Set(fx.readyYoutubeIds);
export const holdIds = new Set(fx.holdYoutubeIds);
export const excludedIds = new Set(fx.excludedYoutubeIds);
export const expectedApproval = key => (approvedRowKeys.has(key) ? "APPROVED" : "PENDING");
/** The same data as before the 2026-11-27 approval: every approved row turned back to PENDING (keeps the original non-public contract under test). */
export const preApproval = rows => rows.map(r => (approvedRowKeys.has(r.key) ? { ...r, publicationApproval: "PENDING" } : r));
