# Yasmine normals recovery — 2026-10-03

BASE_SHA = 2c1934cbcc21c2dac3bcde994ee59f103bd9d298. Fresh remote matched; working tree was clean.

## Source and review

Only the directly attached `yasmine-normals(3).mp4` was read. Source preserved: 136,363,686 bytes; 47.533333 seconds; 2560×1440; 60 fps; HEVC video/AAC audio. Full-source FFmpeg decode succeeded while generating sequential frames. SHA-256: `c20e61b210382cbfad62c62e71eb6425605b113b3bc91c146324803f0787381c`, identical to the previous normals source.

Fresh read-only DB confirmed 25 normal identities, all with Classic commands, matching the existing snapshot IDs/slugs/categories. DB classification, numeric data and verification rules were preserved.

Full timeline reviewed at 4 fps; selected motions and neighboring frames at 10 fps. Twelve standing/crouching basic P/K motions matched using stance, limb, blade sweep count/direction, kick silhouette, DB name/Classic command, repeated motions and recorded sequence. Sequence was supporting evidence only; DB order differs. Input history and move-name overlays are absent: command evidence is matched identity, not a visible button readout. Structural validation does not certify gameplay identity; device acceptance remains required.

NORMAL_EXPECTED = 25; NORMAL_CAPTURED/MAPPED = 12 identifiable moves; NORMAL_UNRESOLVED = 13. No missing-input assertion. Six jump commands (j.LP/j.MP/j.HP/j.LK/j.MK/j.HK) and seven directional/chain commands (6MP/4HK/5LP~LP/5MP~MP/5MK~MK/5MK~MK~HK/2MK~HK) remain unresolved in this one-file review. The jump around 2.3s has no uniquely identifiable attack. No substitution or other original retrieval.

## Outputs and containment

Twelve MP4/WebP pairs re-encoded from the source: 640×360, 60fps, H.264/yuv420p, CRF23, no audio, faststart; WebP quality85. New `-normal-recovery` filenames preserve every old asset. Selected cuts contain player-one stance before attack and recovery afterward, without another player-one attack. Crouching MP uses the second demonstration at 19.000–19.900; the old 18.450 boundary was not adopted as approved.

Only twelve normal entries/source alias changed. Other manifest entries remain identical to base. All 73 cards, 25 normal cards, numeric snapshot, JP/Ryu media, Beginner/Daily15 and held special/unique/throw/SA state are unchanged. Runtime renderer/CSS remain unchanged: preserve approximately 499px desktop media area, poster-first, preload-none and reduced-motion behavior.

Validator rejects absent normal motion/command evidence, unknown source, invalid intervals and another category approved from a normals source. Tests preserve Preview-only identities and verified numeric gates.

## Acceptance

Fresh automated and Preview/browser results will be appended. Release remains NO-GO: thirteen identities unresolved; device acceptance pending. Production/DB/main/sf6dna-v2/Ver.1.1 unchanged. Game facts and frame values not guessed or edited.

## Fresh verification / report

Implementation commit: `79f13fdc047a707679c9bb538ef77b8b893a2671` (`fix: recover reviewed yasmine basic normal motion media`). Implementation tree `02e33c4edb17c1807bc9b9709089dc26d032bc2a`. Subsequent handoff commit is docs-only; final SHA is reported with the deployment handoff. Total batch files: 30 (24 assets, manifest, validator, test, 3 documents).

| Field | Result |
|---|---|
| SOURCE_FILE / FILE_ACCESS / PLAYABLE | yasmine-normals(3).mp4 / PASS / YES |
| SOURCE_SIZE / SOURCE_DURATION | 136363686 bytes / 47.533333 seconds |
| NORMAL_EXPECTED / NORMAL_CAPTURED / NORMAL_MAPPED / NORMAL_UNRESOLVED | 25 / 12 / 12 / 13 |
| WRONG_MAPPING / DUPLICATE_MAPPING | 0 observed in reviewed subset / 0 |
| MP4_OUTPUT / WEBP_OUTPUT / MEDIA_OUTPUT_SIZE | 12 / 12 / 1619179 bytes |
| NORMAL_MEDIA_COVERAGE / DISPLAY | 12/25, PARTIAL / PASS for restored subset |
| NORMAL_CARD_COUNT / ALL_MOVE_CARD_COUNT | 25 / 73, unchanged |
| OTHER_CATEGORY_MEDIA_CHANGE | 0; base non-normal objects compared exactly |
| DESKTOP_MEDIA_WIDTH | 499.296875px measured at 1363px viewport |
| 375_QA | USER_REQUIRED: browser has no viewport resizing capability; no synthetic claim |
| DARK_THEME / LIGHT_THEME | PASS, screenshots reviewed; document overflow false |
| JP_REGRESSION | PASS observed: 59 cards, 26 videos, no overflow/broken images |
| RYU_REGRESSION | PASS observed: 57 cards, 4 videos, no overflow/broken images |
| BROKEN_MEDIA / POSTER | 0 observed; all 12 MP4 decode and 12 WebP decode / PASS |
| BROWSER_PLAYBACK | 12/12 reached readyState 4, currentTime advanced, no media error |
| CONSOLE_ERRORS | 0 application errors observed; Chrome-extension metadata transport errors excluded |
| PERFORMANCE | preload=none on all 12; initially only 3 viewport-near clips reached readyState4, other 9 readyState0; no all-MP4 eager download observed; network byte transfer not measured |
| DB_WRITE / PRODUCTION / VER1_1 | 0 / NO_CHANGE / NO_CHANGE |
| TYPECHECK / LINT | PASS / PASS |
| TESTS / RELEASE_GATES | PASS 464/464 / PASS 14/14 |
| BUILD / DIFF_CHECK | PASS / PASS |
| MEDIA_VALIDATOR | PASS, errors0/warnings0; 12 approved,14 old held |
| IMPLEMENTATION_PREVIEW | READY; dpl_Egix7cC5xVdFZEssuAAA4iQH774J; exact implementation SHA + branch |
| NEW_P0 / NEW_P1 | 0 observed in tested delta; incomplete media is an existing scope hold |
| USER_DEVICE_QA_REQUIRED | YASMINE_NORMALS_ONLY |
| RELEASE_STATUS | NO-GO |
| NEXT_SINGLE_ACTION | Accept/reject the twelve restored normal clips on the Yasmine page; keep thirteen unresolved identities hidden pending a separate mapping clarification |

Build-generated next-env.d.ts and tsconfig.json changes were inspected and excluded, then typecheck re-run successfully. Test/release-gate checks used fresh counts. No successful file access was inferred from filenames: original decoded, output files decoded, poster images reviewed, all twelve mappings visited in browser. Frame confirming labels remain intentionally unchanged in this media-only task.

The verified implementation Preview was `https://sf-6-7dbov2g15-somas11620-9368.vercel.app/characters/yasmine`. A final docs-only deployment must be checked for READY and exact final SHA before handoff; authenticated share query parameters are not retained here.
