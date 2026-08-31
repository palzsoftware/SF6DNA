-- Phase23: final triage of remaining unverified Training rows.
-- reviewed != verified. draft != published. No deletion and no publication.

-- A) Superseded generic rows: canonical foundation drills and practical character drills replace them.
update public.trainings
set status='archived', updated_at=now()
where status='draft' and verification_status='unverified'
  and slug in (
    'juri-training-burnout','juri-training-dr-check','juri-training-lethal','juri-training-meter',
    'juri-training-oki','juri-training-parry','juri-training-sa','juri-training-shimmy','juri-training-throw-defense',
    'ken-training-burnout','ken-training-dr-check','ken-training-hitconfirm','ken-training-lethal','ken-training-meter',
    'ken-training-oki','ken-training-parry','ken-training-sa','ken-training-shimmy','ken-training-throw-defense'
  );

-- B) JP exact setup/combo candidates supported only by a pre-2026.08.03 source.
-- Keep them archived as historical candidates instead of treating exact +F/routes as current.
update public.trainings
set status='archived', updated_at=now()
where status='draft' and verification_status='unverified'
  and slug in (
    'jp-training-basic-light-confirm','jp-training-di-pc-plus15','jp-training-di-wall-safejump',
    'jp-training-od-amnesia-202608','jp-training-sa2-route','jp-training-vihhat-conversion'
  );

-- C) Current-source JP drills are practical enough for editorial review state.
update public.trainings
set verification_status='reviewed', updated_at=now()
where status='draft' and verification_status='unverified'
  and slug in (
    'jp-training-sa1','jp-training-sa3','jp-training-stribog','jp-training-torbalan','jp-training-zoning-cycle'
  );

-- D) Luke current-source drills: add reproducible Training Mode settings, then mark reviewed.
update public.trainings set
  recording_instructions='ダミーに-4F/-6F/-8F程度の代表技を個別スロットへ記録。近距離/先端距離を分ける。',
  playback_settings='ランダム再生。ガード固定。入力履歴・フレーム表示ON。',
  cpu_settings='CPU OFF。ダミー記録/再生を使用。',
  verification_status='reviewed',updated_at=now()
where status='draft' and verification_status='unverified' and slug='luke-training-4f-punish';

update public.trainings set
  recording_instructions='相手をバーンアウト状態にし、ガード、前ジャンプ、SA、DIを防御候補として記録。',
  playback_settings='ランダム再生。Drive/SAゲージ表示・フレーム表示ON。',
  cpu_settings='CPU OFF。相手バーンアウト固定。',
  verification_status='reviewed',updated_at=now()
where status='draft' and verification_status='unverified' and slug='luke-training-burnout-pressure';

update public.trainings set
  recording_instructions='画面端で打撃、投げ、遅らせ打撃/シミー、DIを4スロットへ記録。',
  playback_settings='4スロットをランダム再生。入力履歴ON。',
  cpu_settings='CPU OFF。起き上がり状況を統一。',
  verification_status='reviewed',updated_at=now()
where status='draft' and verification_status='unverified' and slug='luke-training-corner-escape';

update public.trainings set
  recording_instructions='ダミーのガード設定をRandomにし、しゃがみ中Kが届く距離へ固定。',
  playback_settings='Random Guard。入力履歴・ダメージ表示ON。',
  cpu_settings='CPU OFF。',
  verification_status='reviewed',updated_at=now()
where status='draft' and verification_status='unverified' and slug='luke-training-crmk-dr';

update public.trainings set
  recording_instructions='しゃがみ中Pガード後の4F、小技、投げ、無敵技をリバーサル候補として記録。',
  playback_settings='ランダム再生。ガード固定・フレーム表示ON。',
  cpu_settings='CPU OFF。',
  verification_status='reviewed',updated_at=now()
where status='draft' and verification_status='unverified' and slug='luke-training-crmp-pressure';

update public.trainings set
  recording_instructions='中距離から通常技、前歩き、前ジャンプ、Drive Impactを別スロットへ記録。',
  playback_settings='ランダム再生。再生情報表示OFF・入力履歴ON。',
  cpu_settings='CPU OFF。',
  verification_status='reviewed',updated_at=now()
where status='draft' and verification_status='unverified' and slug='luke-training-di-reaction';

update public.trainings set
  recording_instructions='代表的なOD無敵技を1本ずつ記録し、ガード後の距離を統一。',
  playback_settings='通常/ランダム再生。ダメージ・入力履歴ON。',
  cpu_settings='CPU OFF。ゲージ条件を0/Drive使用/SA使用で切替。',
  verification_status='reviewed',updated_at=now()
where status='draft' and verification_status='unverified' and slug='luke-training-dp-punish';

update public.trainings set
  recording_instructions='相手体力を複数値に設定し、自分のDrive/SAを0・中間・最大の条件に切り替える。',
  playback_settings='ダメージ・Drive・SA表示ON。',
  cpu_settings='CPU OFF。',
  verification_status='reviewed',updated_at=now()
where status='draft' and verification_status='unverified' and slug='luke-training-lethal';

update public.trainings set
  recording_instructions='ダミー立ち・ガードOFF。弱/中/強Flash Knuckleをそれぞれ通常/チャージ/Perfectで反復。',
  playback_settings='入力履歴・フレーム表示ON。',
  cpu_settings='CPU OFF。',
  verification_status='reviewed',updated_at=now()
where status='draft' and verification_status='unverified' and slug='luke-training-perfect-knuckle';

update public.trainings set
  recording_instructions='前歩き、前ジャンプ、パリィ、Drive Rushを4スロットへ記録。',
  playback_settings='ランダム再生。再生情報表示OFF・入力履歴ON。',
  cpu_settings='CPU OFF。',
  verification_status='reviewed',updated_at=now()
where status='draft' and verification_status='unverified' and slug='luke-training-sandblast-aa';

update public.trainings set
  recording_instructions='中距離で長い通常技の空振り、前歩き、後ろ歩き、待機を別スロットへ記録。',
  playback_settings='ランダム再生。入力履歴ON。',
  cpu_settings='CPU OFF。',
  verification_status='reviewed',updated_at=now()
where status='draft' and verification_status='unverified' and slug='luke-training-whiff-punish';

-- E) Ryu current-source specific drills: fill missing settings and mark reviewed.
update public.trainings set
  recording_instructions='相手をバーンアウト状態にし、ガード、前ジャンプ、SA、DIを防御候補として記録。',
  playback_settings='ランダム再生。Drive/SA・フレーム表示ON。',
  cpu_settings='CPU OFF。相手バーンアウト固定。',
  verification_status='reviewed',updated_at=now()
where status='draft' and verification_status='unverified' and slug='ryu-training-burnout-pressure';

update public.trainings set
  recording_instructions='電刃錬気を取れる代表ノックダウン/連係状況を複数用意し、起き上がり4F・前ジャンプを記録。',
  playback_settings='ランダム再生。入力履歴・Drive/SA表示ON。',
  cpu_settings='CPU OFF。',
  verification_status='reviewed',updated_at=now()
where status='draft' and verification_status='unverified' and slug='ryu-training-denjin-routing';

update public.trainings set
  recording_instructions='同じ始動を固定し、SA2の溜め段階と追撃候補を個別に反復できる状態にする。',
  playback_settings='ダメージ・入力履歴・SAゲージ表示ON。',
  cpu_settings='CPU OFF。ダミーは通常受け身。',
  verification_status='reviewed',updated_at=now()
where status='draft' and verification_status='unverified' and slug='ryu-training-sa2-route';
