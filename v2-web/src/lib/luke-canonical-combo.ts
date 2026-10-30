/* Existing observed variant only; no DB insertion or public verification. */
export const lukeCanonicalCombo = {
  "schema_version": "ws5-canonical-combo/1",
  "character_id": "1e4e3f57-7ba0-454c-86d7-72b1deeb3713",
  "character_slug": "luke",
  "combo_id": "qa-sample:luke-crmk-rush-20261011",
  "id_namespace": "EXISTING_LOCAL_QA_SAMPLE_NOT_DB_UUID",
  "parent_candidate_id": "LUK-REC-C03",
  "variant_key": "existing_sample_ends_after_light_flash",
  "combo_slug": "luke-crmk-rush-20261011",
  "slug_state": "ASSIGNED_LOCAL_CANDIDATE_NOT_DB",
  "formal_card_name": "しゃがみ中K始動・キャンセルラッシュ",
  "starter": "しゃがみ中K",
  "recipe": [
    "しゃがみ中K",
    "Cancel Drive Rush",
    "しゃがみ中P",
    "しゃがみ強P",
    "中フラッシュナックル",
    "弱フラッシュナックル"
  ],
  "raw_recipe": "しゃがみ中K → Cancel Drive Rush → しゃがみ中P → しゃがみ強P → 中フラッシュナックル → 弱フラッシュナックル",
  "typed_steps": [
    {
      "step_id": "qa-sample:luke-crmk-rush-20261011:step-1",
      "kind": "move",
      "move_name": "しゃがみ中K",
      "move_id": null,
      "move_id_state": "UNKNOWN",
      "control": "CLASSIC",
      "input_path": "manual",
      "raw_command": null,
      "command_state": "HOLD_NOT_TOKENIZED",
      "relation_to_next": "unknown"
    },
    {
      "step_id": "qa-sample:luke-crmk-rush-20261011:step-2",
      "kind": "system",
      "move_name": "Cancel Drive Rush",
      "move_id": null,
      "move_id_state": "UNKNOWN",
      "control": "CLASSIC",
      "input_path": "manual",
      "raw_command": null,
      "command_state": "HOLD_NOT_TOKENIZED",
      "relation_to_next": "unknown"
    },
    {
      "step_id": "qa-sample:luke-crmk-rush-20261011:step-3",
      "kind": "move",
      "move_name": "しゃがみ中P",
      "move_id": null,
      "move_id_state": "UNKNOWN",
      "control": "CLASSIC",
      "input_path": "manual",
      "raw_command": null,
      "command_state": "HOLD_NOT_TOKENIZED",
      "relation_to_next": "unknown"
    },
    {
      "step_id": "qa-sample:luke-crmk-rush-20261011:step-4",
      "kind": "move",
      "move_name": "しゃがみ強P",
      "move_id": null,
      "move_id_state": "UNKNOWN",
      "control": "CLASSIC",
      "input_path": "manual",
      "raw_command": null,
      "command_state": "HOLD_NOT_TOKENIZED",
      "relation_to_next": "unknown"
    },
    {
      "step_id": "qa-sample:luke-crmk-rush-20261011:step-5",
      "kind": "move",
      "move_name": "中フラッシュナックル",
      "move_id": null,
      "move_id_state": "UNKNOWN",
      "control": "CLASSIC",
      "input_path": "manual",
      "raw_command": null,
      "command_state": "HOLD_NOT_TOKENIZED",
      "relation_to_next": "unknown"
    },
    {
      "step_id": "qa-sample:luke-crmk-rush-20261011:step-6",
      "kind": "move",
      "move_name": "弱フラッシュナックル",
      "move_id": null,
      "move_id_state": "UNKNOWN",
      "control": "CLASSIC",
      "input_path": "manual",
      "raw_command": null,
      "command_state": "HOLD_NOT_TOKENIZED",
      "relation_to_next": "end"
    }
  ],
  "renderer_typed_steps": [],
  "renderer_policy": "WHOLE_TEXT_FALLBACK; semantic steps above do not claim verified commands or Move UUIDs",
  "control": "CLASSIC",
  "input_path": "manual",
  "condition": "Classic・しゃがみ中Kの通常ヒットからキャンセルラッシュ・弱フラッシュナックルで終了",
  "condition_state": "OBSERVED_SCOPE_ONLY; precise distance/opponent/timing compatibility HOLD",
  "position": null,
  "position_state": "UNKNOWN",
  "damage": 2210,
  "drive_cost": 3,
  "sa_cost": 0,
  "end_frame": 56,
  "end_state": "相手ダウン（Evidenceで観測）",
  "difficulty": null,
  "difficulty_state": "UNKNOWN",
  "purpose": "しゃがみ中K始動のラッシュ接続を練習するサンプル",
  "reason": "今回のEvidenceではSAを使用せず完走。効率・安定性・起き攻めの優劣は未評価。",
  "patch": null,
  "patch_state": "HOLD_OBSERVED_BUILD_UNKNOWN",
  "patch_note": "C03親候補の2026.08.03をSampleへ転記しない。SampleのDB patchとの対応も未確認。",
  "verification": "GAME_OBSERVED",
  "verification_scope": "Recipe structure and values in Evidence only; not public verification",
  "just": {
    "user_attested_medium_just": true,
    "user_attested_light_just": true,
    "user_response_verbatim": "両方Just成功",
    "source": "本チャットの本人確認回答",
    "applies_to": "luke_combo_crmk_basic_001_evidence.mp4の実行",
    "objective_medium_just_verification": "HOLD",
    "objective_light_just_verification": "HOLD",
    "not_transferred_as_objective_verification_to_clean": true
  },
  "source": [
    {
      "artifact": "SF6DNA_WS1_LUKE_JUST_STRUCTURE_PAIRING_20261011.zip",
      "file": "SAMPLE_CARD_DATA_CANDIDATE.json",
      "sha256": "d26e3a0d6dbe2991ce6188ee102658f43e87c97a33f128e68bb913d64891e6a0"
    },
    {
      "artifact": "SF6DNA_WS1_LUKE_CLEAN_LEADIN_ACCEPTANCE_20261011.zip",
      "file": "CHECKPOINT.json",
      "sha256": "fe07b9037f84247453144591231d89c7722b14481d6bbddf5cef5fac74d4f9e1"
    }
  ],
  "media_state": "PAIR_STRUCTURE_CONFIRMED; CLEAN_ASSET_HASH_MATCHED; BROWSER_NOT_RUN",
  "media": {
    "candidate_id": "qa-sample:luke-crmk-rush-20261011",
    "evidence": {
      "path": "media/luke-crmk-evidence-0350-6850.mp4",
      "sha256": "4b4892ae097c153787b90ff2a4ed838b6a0c8305930ab89b15c60acee58e3bdc",
      "original_file": "luke_combo_crmk_basic_001_evidence.mp4",
      "numeric_scope": "EVIDENCE_TAKE_ONLY"
    },
    "clean": {
      "path": "/media/qa/luke/combo-clean-20261011.mp4",
      "sha256": "b10581e09f351dcafe32a86bbb6510519a8b97368ca23916657051cb9bdda33f",
      "original_file": "luke_combo3.mp4",
      "interval": [
        45.3,
        50.0
      ]
    },
    "lead_in_seconds_approx": 0.4,
    "lead_in_state": "ACCEPTABLE_REUSED",
    "same_execution": false,
    "numeric_transfer_to_clean": false
  },
  "safe_href": "/characters/luke#combo-luke-crmk-rush-20261011",
  "anchor_id": "combo-luke-crmk-rush-20261011",
  "anchor_state": "LOCAL_COMPONENT_CANDIDATE_CREATED; CHARACTER_ROUTE_MOUNT_NOT_APPLIED",
  "LUKE_CANONICAL_COMBO_COUNT": 1,
  "READY_FOR_WS7_CANDIDATE": false,
  "COMBO_RELATION_STATE": "LOCAL_HOLD_WS7_ADMISSION_AND_ROUTE",
  "publication_approved": false,
  "direct_recommendation_adopted": false,
  "local_hold": [
    "Exact observed build / patch",
    "Objective Just",
    "Precise distance / opponent / timing conditions",
    "Modern",
    "Semantic step Move UUID / verified raw input"
  ],
  "integration_blockers": [
    "WS7 Combo payload requires game_verification=VERIFIED and non-empty patch; GAME_OBSERVED/null patch is rejected",
    "Character page currently has no unique Combo slug anchor for this Sample; local component requires explicit mount and browser confirmation"
  ],
  "USER_ACTION_REQUIRED": "NO"
} as const;
