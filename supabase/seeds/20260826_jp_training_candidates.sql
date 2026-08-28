-- JP training candidates based on current August 2026 JP mechanics/frame data.
-- Editorial training content: draft + unverified until hands-on in-game review.
with ctx as (
  select c.id character_id,p.id patch_id,s.id source_id
  from public.characters c cross join public.patches p cross join public.sources s
  where c.slug='jp' and p.is_current=true and s.url='https://ultimateframedata.com/sf6/jp'
), vals(slug,name,training_type,purpose,level,duration_minutes,recording_instructions,playback_settings,method,success_criteria,recommended_reps,next_step) as (
 values
 ('jp-training-4f-check','JP 4F反撃確認','punish','しゃがみ弱Pの4F反撃を安定させる','beginner',5,'ダミーに-4以上の技を記録し、ガード後にしゃがみ弱Pを返す。','ガード後ランダム再生。','まず単発2LPを確実にし、その後キャンセル先を追加する。','10回中9回以上、遅れず確定させる。',20,'実戦で確反対象ごとに反撃を使い分ける。'),
 ('jp-training-aa-2hp','JP しゃがみ強P対空','anti_air','通常技対空の反応と間合いを安定させる','beginner',8,'前ジャンプ攻撃、空ジャンプ、地上待機を3枠以上に記録。','ランダム再生。','飛びを見て2HP。地上行動には振らない。','20回中16回以上対空し、地上行動への空振りを3回以下にする。',20,'空対空・SA1・距離別対空を混ぜる。'),
 ('jp-training-amnesia','JP アムネジア使い分け','defense','通常アムネジアとODアムネジアの対象差を覚える','intermediate',8,'打撃、通常投げ、遅らせ打撃をそれぞれ記録。','ランダム再生。','打撃には通常/OD、投げにはODのみが成立する差を確認する。','選んだ防御手段の成立・不成立理由を毎回説明できる。',20,'画面端の防御レコードへ統合する。'),
 ('jp-training-torbalan','JP トルバラン上下段・フェイント認識','offense','中/強トルバランとフェイントの用途を整理する','intermediate',8,'ダミーはガード固定。必要に応じてパリィも記録。','通常再生。','中段・下段・弱・OD・ホールドフェイントを順に確認し、距離で有利不利が変わることを把握する。','各派生の用途を入力を見ずに言える。',15,'ヴィーハト設置と組み合わせた攻めへ進む。'),
 ('jp-training-departure','JP ヴィーハト設置・ワープ操作','setup','設置位置とWindow/Shadow派生の操作を安定させる','intermediate',10,'ダミーは立ちガード。','通常再生。','距離別設置→Window→ジャンプ攻撃、設置→Shadowを反復する。','左右・距離を変えて10回連続で意図した派生を出す。',20,'実戦セットプレイへ接続する。'),
 ('jp-training-stribog','JP ストリボーグ強度使い分け','spacing','弱/中/強/ODストリボーグの発生・硬直差・用途差を覚える','intermediate',8,'ダミーはガード固定。','通常再生。','同じ距離で各強度をガードさせ、弱-10/中-8/強+4/OD+2の差を確認する。','各強度を見ずに選び、狙った状況を5回連続で再現する。',20,'確反距離と端状況を追加確認する。'),
 ('jp-training-triglav','JP トリグラフ距離選択','zoning','P強度で落下位置を変える操作を安定させる','beginner',8,'ダミーに前歩き、後ろ歩き、ジャンプを記録。','ランダム再生。','相手位置を見て適切なP強度を選択。ODも混ぜる。','20回中16回以上、狙った位置へ出す。',20,'トルバランとの遠距離択へ統合する。'),
 ('jp-training-sa1','JP SA1切り返し確認','super','7F SA1の切り返し・確反用途を確認する','intermediate',6,'隙の大きい技、密着連携、投げを記録。','ランダム再生。','確定場面と読み合い場面を分けてSA1を使う。','誤発動を抑えながら確定場面10回中9回成功。',15,'リーサル判断練習へ進む。'),
 ('jp-training-sa3','JP SA3最大反撃','punish','大きな隙へのSA3確反を安定させる','intermediate',6,'無敵技など大きな隙のある技を記録。','通常再生。','ガード後に最適な始動からSA3へ繋ぐ準備をする。コンボ未検証部分は個別に実機確認する。','SA3入力自体を10回連続成功。',15,'正式Comboデータ完成後に最大反撃ルートへ置換する。'),
 ('jp-training-zoning-cycle','JP 遠距離択ローテーション','decision','トリグラフ・トルバラン・ヴィーハトを単調にしない','advanced',10,'ダミーに前歩き、前ジャンプ、パリィ、待機を記録。','ランダム再生。','3種の遠距離手段と前後歩きを混ぜ、同じ行動を3回以上連続させない。','30秒間、相手行動に応じて3種類以上を使い分ける。',10,'対キャラ別レコードへ発展させる。')
), ins as (
 insert into public.trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
 select v.slug,v.name,v.training_type,v.purpose,v.level,v.duration_minutes,ctx.character_id,v.recording_instructions,v.playback_settings,v.method,v.success_criteria,v.recommended_reps,v.next_step,ctx.patch_id,'unverified','editorial','draft'
 from vals v cross join ctx
 on conflict(slug) do update set name=excluded.name,purpose=excluded.purpose,method=excluded.method,success_criteria=excluded.success_criteria,recommended_reps=excluded.recommended_reps,next_step=excluded.next_step,updated_at=now()
 returning id
), links as (
 insert into public.entity_sources(entity_type,entity_id,source_id,relationship,note)
 select 'training',i.id,ctx.source_id,'supporting','Underlying JP mechanics/frame data source; training procedure still requires hands-on review.' from ins i cross join ctx
 where not exists(select 1 from public.entity_sources es where es.entity_type='training' and es.entity_id=i.id and es.source_id=ctx.source_id)
 returning id
)
select (select count(*) from ins) trainings_touched,(select count(*) from links) source_links_added;
