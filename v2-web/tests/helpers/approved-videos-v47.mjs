import { readFileSync } from "node:fs";
// Approved-video list from Claude B (review_v46 / approval_candidate_keys_v46), user approval 2026-11-27 15:31.
// Tests derive the expected approval state from this list instead of assuming "everything is PENDING".
const fx = JSON.parse(readFileSync(new URL("../fixtures/approved-videos-v47.json", import.meta.url), "utf8"));
export const approvedRowKeys = new Set(fx.readyRowKeys);
export const readyIds = new Set(fx.readyYoutubeIds);
export const holdIds = new Set(fx.holdYoutubeIds);
export const excludedIds = new Set(fx.excludedYoutubeIds);
export const expectedApproval = key => (approvedRowKeys.has(key) ? "APPROVED" : "PENDING");
/** The same data as before the 2026-11-27 approval: every approved row turned back to PENDING (keeps the original non-public contract under test). */
export const preApproval = rows => rows.map(r => (approvedRowKeys.has(r.key) ? { ...r, publicationApproval: "PENDING" } : r));
