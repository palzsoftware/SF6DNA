# Device review handoff

Browser-verified snapshot: `a7da42b5d48ee35a519c52ef3764505628e2f467`, Preview https://sf-6-mcdhgqs8v-somas11620-9368.vercel.app/, deployment `dpl_BpwvZgWYRvA1pKt99iwNq7zB3vWw`, READY / branch / SHA match.

Use the newest RC Preview whose deployment Git SHA equals current branch HEAD; the final follow-up adjusts nameplate spacing and excludes screen-edge context from the distance strip. The final report records that exact deployment.

Desktop Cloud Browser: Home, Characters, JP, Diagnosis, Players, Videos, Search, Favorites render in Light; no document width overflow observed (1348px). Base Card browser checks confirmed all31 use contain/center/no enlargement; offscreen images remain lazy-loaded, so not all31 were loaded at once. Search input distinct tint and 2px border confirmed in Dark and Light. Final Dark/Light regression follows deployment. This environment does not expose mobile viewport resizing; 320/375/390/430 measurements remain NOT_VERIFIED.

Review only Search / Characters / JP in one smartphone session:
1. Search: field identifiable at a glance, focus visible, input usable in Dark/Light.
2. Characters: representative JP/Ryu/Luke/Ken/Zangief and wide/tall portraits remain centered with meaningful content visible.
3. JP: compact Hero feels balanced; distance strip and expandable points are understandable.

No all-31 manual review requested. Static contracts, routes, accessibility semantics and build checks are Work-side checks. Browser desktop evidence does not establish mobile/device PASS.

JP SA2 source recording remains MEDIA_INPUT_REQUIRED; this review does not close that media issue.

Production / DB / main / sf6dna-v2 / Ver1.1 unchanged. Release remains NO-GO until the remaining device/Auth/guard/promotion decisions are complete. Scope-dependent unpublished content is not promoted to a Core blocker.
