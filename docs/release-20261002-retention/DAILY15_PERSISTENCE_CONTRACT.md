# Daily15 persistence contract — 2026-10-02

Storage: `sf6dna_v2_daily15_v1`, envelope `{ version: 1, sessions: PracticeSession[] }`. Guest browser-local storage; no account sync, remote transmission, API, database write or auth requirement.

Session: UUID, stable planId (`dateKey:source:itemIds`), snapshot of the three existing 5-minute items including the detail needed to restore the original screen, optional single main character slug / actual local diagnosis record ID, ISO startedAt / updatedAt / completedAt and unique completed item IDs. No answers, scores, tokens, account ID or unrelated gameplay DB rows are copied. Unknown character/diagnosis references remain null.

Explicit Start creates a session. Completing an item can also start one. Saves upsert by UUID. Three completed IDs set completedAt; undo clears it. Duplicate writes do not append rows. Repeat creates a new UUID using the original plan snapshot. New-menu action uses the unchanged Daily15 generator. No one-session-per-day limit.

Resume: explicit valid `session` query selects that browser-local session; `new=1` creates a fresh session when Start is pressed. Repeating an explicit session preserves its menu. Without a diagnosis request or explicit session, latest unfinished is resumed first, including prior days; otherwise the current matching plan is restored. Diagnosis links select only the matching requested plan, so an unrelated unfinished plan does not replace the requested focus. Old unfinished records are not marked complete.

The existing Japan-time date key and task generation are unchanged. History displays started/completed timestamps in the browser's local time. Overnight completion retains the original plan date and session ID. Clock rollback never decreases updatedAt.

At most 50 recent sessions, matching the existing diagnosis-history cap. The storage envelope is additionally capped at 1,500,000 JSON characters (at most roughly 3 MB UTF-16); oldest snapshots are dropped if needed. History initially renders 10 rows. Snapshots are limited to the three displayed tasks rather than the entire catalog.

Absent data: new menu. Invalid JSON / fields / impossible completion / duplicate IDs: usable records only, safe notice, no automatic write. A subsequent explicit action may recover corrupt JSON. Unsupported version: no overwrite; saving reports failure. Blocked storage/quota: progress remains in memory with visible warning and retry button, without claiming persistence.

Home/history refresh on browser storage, same-tab practice-change and pageshow events. Item actions reread the current session before updating. Simultaneous same-item actions remain last-action-wins; localStorage is not a transactional multi-user database.

Flags unchanged: aiCoach=false, training=false, publicStrategyContent=false. Daily15 is separate from the Training Library. Diagnosis questions/options/scoring/recommendation/save/idempotency and task generation untouched.
