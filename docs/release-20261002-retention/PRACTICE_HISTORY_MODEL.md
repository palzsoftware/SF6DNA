# Practice history and return paths

`/me/training/history` shows browser-local practice sessions, separate from `/diagnosis/history` and account DB persistence. Compact timeline: local date/time, theme, three task checks, incomplete/completed status, optional known main character, completion time, resume/view and repeat actions. First 10 sessions; next-10 control; storage max 50 (see persistence contract).

Return paths: Home Continue → latest unfinished; otherwise today's completed menu / previous practice → history. Daily15 → history. History → saved session, new Daily15, known Character Detail and diagnosis history. Completed Daily15 → history / repeat / Home. Existing diagnosis-result → Daily15 links unchanged.

Deterministic stored-state presentation only; no AI, external notifications or generated gameplay facts. Optional character is retained only when one valid main character is set. A local diagnosis reference is recorded only when an actual matching local diagnosis is available; no inference from absent records. A diagnosis-link menu retains its existing source/theme/reason, without fabricating a result ID.

Weekly Goal / Weekly Review / streak / charts / XP / account sync: deferred. Companion: foundation only through the typed session reader and simple stored-state presentation, no new widget. Existing generic vector helpers reused; no new character illustration or media asset. Retention also works with character chibi disabled in a Production-target build. Derivative rights remain unverified for Production.
