# Illustration rights / usage gate — 2026-10-02

CHARACTER_DERIVATIVE_RIGHTS_STATUS = UNVERIFIED_FOR_PRODUCTION

JP, Ryu and Luke are generated derivative fan-art pilots, not official Capcom assets. Creating new image bytes does not establish permission to use the underlying character designs commercially. No Production deployment, alias or environment modification was performed.

## Evidence and unknowns

Official primary reference: https://www.capcom-games.com/ja-jp/fan-content-guidelines/ (official search result confirms the guideline exists; direct retrieval returned HTTP 403 on 2026-10-02). The complete current terms were therefore not verified. The video policy at https://www.capcomusa.com/video-policy/ concerns game footage and specific creator uses; it does not establish permission for this website's generated character illustrations.

Before any Production use, verify applicability to this operator and website, commercial/monetization conditions, AI-generated derivative treatment, copyright/trademark notices, third-party rights, and character artwork distribution. These are pending, not legally approved. User style approval is separate from permission.

## Technical separation / fallback

The three WebP files live outside `public`, in `v2-web/src/data/illustration-pilot/`. The dedicated dynamic delivery route returns 404 unless VERCEL_ENV is `preview`, the slug is one of JP/Ryu/Luke, and the request hostname equals VERCEL_URL (immutable Preview URL). No-store headers prevent shared caching. Next/Image is unoptimized for these small, already optimized files, avoiding optimizer cache copies. The UI omits them in a Production build. Original geometric icons and mini illustrations are independent and remain usable without the chibis.

Do not directly promote this Preview build as a Production artifact: Preview build environment remains Preview after alias promotion. Before release, either approve the character rights and deliberately revise the eligibility policy, or make a Production-target build with chibis omitted. The request-host guard also denies delivery on a promoted Production alias, but that does not make a directly promoted UI an approved fallback.

No legal clearance or rights holder endorsement is claimed. 31-character rollout remains deferred.
