# Beginner media integration preparation

Base: dbc4564ba94b4f6630489b5a4ef7b66b9c27852d. Status: infrastructure ready; gameplay integration INPUT_PENDING. Release remains NO-GO.

Dedicated manifest: v2-web/src/app/beginner/media-manifest.ts. Dedicated renderer: media.tsx. Eight stable IDs match existing tutorial steps exactly. Manifest currently empty; absent assets return null, preserving existing text and diagrams. Removed the eight placeholder badges and their future-video note. No giant empty media box or fake playback controls remain.

Entry contract: id, tutorialStep, mediaType, local mediaUrl, optional posterUrl (required for video), intrinsic width/height, alt, caption, USER_CAPTURED_GAMEPLAY, status. Draft is hidden everywhere; approved_for_preview is visible only when VERCEL_ENV=preview; approved_for_public is eligible for public render. Production approval requires separate footage review and usage-policy review. Empty manifest is safe in Preview and Production.

Video: native controls, muted, loop, playsInline, preload=none, poster, no autoplay. Users explicitly start and pause each clip. Reduced-motion users also receive no automatic motion. No client observer, timer or new library needed. Static images use Next/Image, lazy loading and intrinsic dimensions. Animated GIF is intentionally rejected by this renderer until pause/reduced-motion handling is implemented; GIF source may instead be converted using the existing encoder. Animated WebP must also not be approved as a static image.

DI=impact, DR=rush, CDR=cancel-rush; mismatched step IDs fail validation. URL prefix restricted to /media/beginner/; character move assets cannot be referenced. Invalid manifest fails closed; test validates all installed paths. Future additions must pass real file existence checks before commit.

Preserved: all 12 step data, order, game explanations, diagrams, checklist, Diagnosis and Daily15 destinations. No Character files, DB, Production, auth, retention, navigation, publication flags or game facts changed. Existing uncommitted old freeze documents remain untouched and excluded.

Rights: expected source USER_CAPTURED_GAMEPLAY; source not yet received. Public usage eligibility is UNVERIFIED pending alignment with existing gameplay/fan-content policy. Chibi derivative rights are separate and unchanged. JP SA2 remains MEDIA_INPUT_REQUIRED.
