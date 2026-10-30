import type { Relation } from './character-consultation';
import type { ConsultationCardPayload } from './consultation-card-payload';
// WS3 exact receipt; candidate only, public flags remain false.
export const lukeSafeMoveRelation: Relation = {
  "id": "40d7e3a8-5e6c-49b1-9e88-3cdb830f8ce0",
  "revision": "ws3-luke-crouching-lp-classic-source-20261012",
  "kind": "Move",
  "character": "luke",
  "control": "CLASSIC",
  "inputPath": "manual",
  "patch": "2026.08.03",
  "issue": "combo",
  "detail": "light",
  "condition": "Classic・しゃがみ弱P・公式Frame表の通常行",
  "verification": "SOURCE_SUPPORTED",
  "sourceRefs": [
    "CAPCOM:LUK-FRAME-CLASSIC:20261006:normal-row-7:sha256:d71d25fd77a38376953ea7691905074d9dd29cbdde10305833f48fed106e5537"
  ],
  "fieldEvidenceComplete": false,
  "publicationAllowed": false,
  "routeConfirmed": false,
  "href": "/characters/luke#move-luke-crouching-lp"
};
export const lukeSafeMovePayload: ConsultationCardPayload = {
  "characterId": "luke",
  "cardType": "Move",
  "cardId": "40d7e3a8-5e6c-49b1-9e88-3cdb830f8ce0",
  "revision": "ws3-luke-crouching-lp-classic-source-20261012",
  "title": "しゃがみ弱P（ファストジャブ）",
  "reason": "小技始動で迷う場合は、まず「↓＋弱P」の入力と連打キャンセル対応を確認しましょう。",
  "verification": "SOURCE_SUPPORTED",
  "control": "CLASSIC",
  "inputPath": "manual",
  "condition": "Classic・しゃがみ弱P・公式Frame表の通常行",
  "patch": "2026.08.03",
  "mediaState": "PENDING",
  "moveId": "40d7e3a8-5e6c-49b1-9e88-3cdb830f8ce0",
  "input": {
    "context": {
      "characterId": "luke",
      "moveId": "40d7e3a8-5e6c-49b1-9e88-3cdb830f8ce0",
      "formalMoveName": "しゃがみ弱P（ファストジャブ）",
      "control": "classic",
      "inputPath": "manual",
      "condition": {
        "state": "EXACT",
        "text": "Classic・しゃがみ弱P・公式Frame表の通常行"
      },
      "rawCommand": "↓ + 弱P",
      "spokenCommand": null,
      "evidenceState": "VERIFIED",
      "tokenizationState": "NOT_TOKENIZED",
      "officialSourceVerified": true,
      "identityMatch": true
    },
    "patch": "2026.08.03",
    "commandEvidence": "CAPCOM:LUK-FRAME-CLASSIC:20261006:normal-row-7:sha256:d71d25fd77a38376953ea7691905074d9dd29cbdde10305833f48fed106e5537"
  },
  "localReference": {
    "character_slug": "luke",
    "character_id": "1e4e3f57-7ba0-454c-86d7-72b1deeb3713",
    "move_id": "40d7e3a8-5e6c-49b1-9e88-3cdb830f8ce0",
    "move_slug": "luke-crouching-lp",
    "safe_href": "/characters/luke#move-luke-crouching-lp",
    "control": "CLASSIC",
    "input_path": "manual",
    "verification": "SOURCE_SUPPORTED",
    "patch_state": "CURRENT_DB_ONLY",
    "media_state": "PENDING",
    "modern_state": "LOCAL_HOLD_NOT_ADMITTED",
    "scope": "RC_PREVIEW_LOCAL_CANDIDATE_ONLY",
    "anchor_state": "IMPLEMENTED_LOCAL_CANDIDATE"
  }
};
