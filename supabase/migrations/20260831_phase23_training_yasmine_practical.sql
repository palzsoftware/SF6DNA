-- Phase23: add current-patch practical Yasmine Training drills from post-2026.08.03 sources.
-- All rows remain reviewed/draft. No automated verification or publication.

insert into public.sources (title, url, source_type, publisher, published_at, accessed_at, reliability_level, notes)
select v.title, v.url, 'character_guide', v.publisher, v.published_at, now(), 'community', v.notes
from (values
  ('ヤスミン攻略 コンボ・起き攻めまとめ', 'https://note.com/dos236236/n/nf495faf8df1e', 'ドス', '2026-08-04T01:16:00+09:00'::timestamptz, '2026-08-06/08にコンボ・起き攻め更新。2026.08.03以降の実戦候補。'),
  ('ヤスミンの実戦向けとりこれコンボ11選', 'https://note.com/takukakugamer/n/n8b72e9c71afc', '拓@かくぶろ管理人', '2026-08-03T17:59:00+09:00'::timestamptz, '2026.08.03時点の初心者向け実戦コンボ候補。')
) as v(title, url, publisher, published_at, notes)
where not exists (select 1 from public.sources s where s.url = v.url);

with current_patch as (
  select id from public.patches where is_current = true order by created_at desc limit 1
), yasmine as (
  select id from public.characters where slug = 'yasmine' and status = 'published' and is_playable = true limit 1
), rows(slug, name, training_type, purpose, level, duration_minutes,
       recording_instructions, playback_settings, cpu_settings, method,
       success_criteria, recommended_reps, next_step) as (
values
  ('yasmine-practical-light-bnb', 'ヤスミン 小技始動BnB', 'execution',
   '近距離の小技ヒットから安定してダウンと起き攻め状況を取る基本ルートを手癖にする。', 'beginner', 6,
   'ダミーは立ち、Guard OFF。1P側と2P側を交互に練習する。',
   '入力履歴・ダメージ表示ON。', 'CPU操作: OFF。',
   '2弱P > 弱P~弱P > 中ダロイ~アロンを左右それぞれ10回。連打でごまかさず、どこで入力が抜けたかを確認する。',
   '1P側・2P側それぞれ10回連続で完走できる。', 20,
   '安定後はGuard Randomにして、小技がヒットした時だけ完走する確認練習へ進む。'),

  ('yasmine-practical-crmk-dr', 'ヤスミン 中足ラッシュ基本ルート', 'hit_confirm',
   '実戦で触りに使いやすい中足キャンセルラッシュから、基本コンボを安定させる。', 'intermediate', 8,
   'ダミーは立ち、最初はGuard OFF。慣れたらGuard Randomへ切り替える。',
   '入力履歴・ダメージ表示ON。', 'CPU操作: OFF。',
   '中足 > キャンセルDrive Rush > 2中P > 2強P > 強ダロイ~アロンを反復する。まずコンボだけを安定させ、その後ヒット確認へ分ける。',
   'コンボ単独10回連続成功後、Guard Random 20試行でヒット時の完走とガード時の停止を分けて記録できる。', 30,
   'ガード時の安全な継続択は別メニューで確認し、未確認の入れ込みを増やさない。'),

  ('yasmine-practical-punish-counter', 'ヤスミン 無敵技ガード後PC反撃', 'punish',
   '大きな隙をガードした時に、Punish Counter始動の高い反撃を取り切る。', 'intermediate', 8,
   'Counter設定をPunish Counterにするか、十分な隙のある確認済み技をダミーへ記録する。',
   '入力履歴・ダメージ表示ON。', 'CPU操作: OFF。',
   '強P(PC) > 2中P > ODタリム > 強P > 強リパを10回ずつ反復する。実戦用の相手技を使う場合は、確定することを別途確認済みの技だけにする。',
   '10回連続で完走でき、始動のPunish Counter表示を毎回確認する。', 20,
   'ゲージ不足時のノーゲージ反撃を別ルートとして追加する。'),

  ('yasmine-practical-di-pc', 'ヤスミン DIパニッシュカウンター反撃', 'reaction_di',
   'Drive Impact返し成功後に迷わず安定反撃へ移行する。', 'beginner', 6,
   '簡単練習設定のDrive Impact対応練習、またはDIを出すダミーレコードを使用する。',
   '再生情報表示OFF。入力履歴ON。', 'CPU操作: OFF。',
   'DI返し成功後、強タリム > 強P > 強リパまで完走する。反応練習とコンボ練習を分け、最初はコンボ部分だけ練習してよい。',
   'DI返し成功後の10回中9回以上で同じ反撃を完走できる。', 20,
   '安定後は飛び・前歩きを混ぜたDI複合練習へ移行する。'),

  ('yasmine-practical-strong-daloy-oki', 'ヤスミン 強ダロイ~アロン後の起き攻め再現', 'oki',
   '基本コンボ締め後に毎回同じ起き攻めへ移り、受け身の違いも確認する。', 'intermediate', 10,
   'ダウンリバーサルに「最速小技」と「何もしない」を設定。受け身はその場/後方をそれぞれ確認する。',
   '入力履歴・Frame Meter ON。', 'CPU操作: OFF。',
   '強ダロイ~アロンで締めた後、前ステ2回 > 2中Pを再現する。出典記載の状況が現行版でも同じになるかを、その場受け身・後方受け身で個別に記録する。',
   '各受け身10回ずつ同じ手順を再現し、打撃重ね・空振り・暴れ被弾の結果を混同せず記録できる。', 20,
   '実機で成立を確認できた後にのみverified候補とし、投げ・シミー派生は別Trainingへ分ける。')
)
insert into public.trainings (
  slug, name, training_type, purpose, level, duration_minutes,
  player_character_id, dummy_character_id,
  recording_instructions, playback_settings, cpu_settings, method,
  success_criteria, recommended_reps, next_step,
  valid_from_patch_id, valid_to_patch_id, verification_status, content_kind, status
)
select r.slug, r.name, r.training_type, r.purpose, r.level, r.duration_minutes,
       y.id, null,
       r.recording_instructions, r.playback_settings, r.cpu_settings, r.method,
       r.success_criteria, r.recommended_reps, r.next_step,
       p.id, null, 'reviewed', 'verified_strategy', 'draft'
from rows r cross join current_patch p cross join yasmine y
on conflict (slug) do nothing;

with mapping(training_slug, source_url) as (
values
  ('yasmine-practical-light-bnb', 'https://note.com/dos236236/n/nf495faf8df1e'),
  ('yasmine-practical-light-bnb', 'https://note.com/takukakugamer/n/n8b72e9c71afc'),
  ('yasmine-practical-crmk-dr', 'https://note.com/dos236236/n/nf495faf8df1e'),
  ('yasmine-practical-crmk-dr', 'https://note.com/takukakugamer/n/n8b72e9c71afc'),
  ('yasmine-practical-punish-counter', 'https://note.com/dos236236/n/nf495faf8df1e'),
  ('yasmine-practical-di-pc', 'https://note.com/dos236236/n/nf495faf8df1e'),
  ('yasmine-practical-strong-daloy-oki', 'https://note.com/dos236236/n/nf495faf8df1e')
)
insert into public.entity_sources (entity_type, entity_id, source_id, relationship, note)
select 'training', t.id, s.id, 'primary', 'Post-2026.08.03 Yasmine combo/oki practice reference; reviewed, not verified.'
from mapping m
join public.trainings t on t.slug = m.training_slug
join public.sources s on s.url = m.source_url
on conflict (entity_type, entity_id, source_id) do nothing;
