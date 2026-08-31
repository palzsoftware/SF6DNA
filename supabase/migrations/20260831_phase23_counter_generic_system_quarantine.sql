-- Phase23: archive repeated generic system Counter templates that contain no character-specific answer.
-- Keep concrete unverified Counter candidates available for later review; do not promote anything.

update public.counters
set status = 'archived',
    updated_at = now()
where status = 'draft'
  and verification_status = 'unverified'
  and counter_type = 'system'
  and target_type = 'system'
  and method = 'Trainingで複数回答を比較し、距離・ゲージ・画面位置を記録する。'
  and benefit = '汎用対応の基準化'
  and risk = '相手の派生・遅らせにより読み合い化する。'
  and conditions = 'exact値は実機再現後に確定。';
