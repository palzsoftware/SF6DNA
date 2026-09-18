# Release Critical Final Read-only

No production/environment/auth/legal mutation.

| Area | State | Required close condition |
|---|---|---|
| Contact | `PENDING_DEVICE_QA` | Preview/production candidate route and submitted destination check |
| Privacy / Terms / Disclaimer | `PENDING_DEVICE_QA` | final owner/legal review and route smoke |
| canonical / metadataBase | `PARTIAL` | Preview shows branch alias; production target domain verification required |
| Auth redirect | `PENDING_DEVICE_QA` | real login/callback/save/reload/logout |
| Production env | `BLOCKED` | explicit production review; no secret values exposed |
| Feature flags | `READY_RC_ONLY` | production matrix approval |
| rollback | `READY` | revert target SHA + no DB migration in this batch |
| Production smoke plan | `READY` | core routes, auth, persistence, legal/contact |
| Production target candidate | `7747cc67…` plus later evidence-only commit | final RC HEAD after device QA |
| Preview→Production difference | `PARTIAL` | env/domain/auth callback and protection differences remain |

Release Readyではない。Code/Data/DB-ready候補とProduction承認を分離する。
