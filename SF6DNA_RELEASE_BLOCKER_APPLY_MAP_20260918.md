# Release Blocker Apply Map

| Blocker | Static state | Exact apply surface | Close evidence |
|---|---|---|---|
| Contact | `PENDING_VALUE` | `v2-web/src/app/contact/page.tsx` placeholder/CTA only | provided value, route test, 375/desktop |
| Legal | `READY_COPY` | no safe change identified | owner device review of 4 routes |
| canonical | `READY_CODE` | `layout.tsx` + `NEXT_PUBLIC_SITE_URL` | Production origin and generated HTML |
| robots | `READY_PREVIEW_SAFE` | `robots.ts`; no current change | Production crawl policy |
| sitemap | `READY_PREVIEW_SAFE` | `sitemap.ts`; no current change | Production origin/routes |
| Auth | `READY_STATIC` | Auth form/client config; no current change | login/save/reload/history/logout |
| Production env | `READY_FOR_APPROVAL` | Supabase URL/anon key/site URL scopes | missing/extra key check without values |
| Motion media | `READY_FOR_SOURCE_VIDEO` | manifest + existing `MoveMotionMedia` | Ryu/JP Pilot validation |
| DB package | `READY_FOR_APPROVAL` | explicit transaction only | dry-run/count/rollback/readback |

AI Coach、Strategy、Training LibraryはOFFを維持。Player画像は許諾取得までユーザー撮影/公式許諾素材以外を追加しない。
