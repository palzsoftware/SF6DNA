# Kakeru Player Record Candidate

Status: `READY_FOR_REVIEW`; DB write: `NO`.

| Field | Candidate | Confidence / source |
|---|---|---|
| slug / name | `kakeru` / `Kakeru` | PRIMARY, CAPCOM |
| aliases | `翔`, `Sho`; `Kakerugo`, `Uzura` queued | first two primary; latter cross-check |
| country / region | JP / Japan | PRIMARY |
| categories | pro, competitive_player | review required |
| character | JP / main | PRIMARY |
| result | CAPCOM CUP 11, 2025, 1st | PRIMARY |
| X / Twitch | `Kakerugo` / `kakeru_fgc` candidates | cross-check before publish |
| YouTube / website / team | unknown | do not infer |

Primary source: https://sf.esports.capcom.com/. Any legacy Sho entity must be checked read-only for duplicate aliases and relations before insert. Do not merge, rename, or delete without separate approval.
