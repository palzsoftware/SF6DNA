
update public.trainings
set purpose=case purpose
 when 'Source記載の有利F・持続当て・距離条件を確定する。' then '資料に記載された有利フレーム、持続当て、距離条件を確認します。'
 when '既存reviewed連携を、確定連携と読み合いを区別しながら反復する。' then '内容確認済みの連携を、確定連携と読み合いに分けて反復します。'
 else purpose end,
recording_instructions=case recording_instructions
 when 'ダミーに4F、ガード、投げ、ジャンプ、OD無敵技を必要に応じて記録。位置・受け身・カウンター設定をSource条件に合わせる。' then '必要に応じて、ダミーに4F技、ガード、投げ、ジャンプ、OD無敵技を記録します。位置、受け身、カウンター設定は出典の条件に合わせます。'
 when '相手側に対象行動を録画し、通常/後方受け身・4F・投げ・無敵技・DI等を必要に応じて切り替える。' then '相手側に対象行動を記録し、その場／後方受け身、4F技、投げ、無敵技、ドライブインパクトなどを必要に応じて切り替えます。'
 when '720p60fps以上。入力履歴・フレーム・ダメージ・Drive/SA表示ON。成功例と必要な失敗例を分ける。' then '720p・60fps以上で、入力履歴、フレームメーター、ダメージ、Dゲージ、SAゲージを表示します。成功例と、確認に必要な失敗例は分けて記録します。'
 when '720p60fps以上。入力履歴・フレーム・ダメージ・Drive/SA・固有資源表示ON。' then '720p・60fps以上で、入力履歴、フレームメーター、ダメージ、Dゲージ、SAゲージ、キャラクター固有のリソースを表示します。'
 when '720p60fps以上。入力履歴・フレーム・ダメージ・Drive/SA・メダルLvを表示。' then '720p・60fps以上で、入力履歴、フレームメーター、ダメージ、Dゲージ、SAゲージ、メダルレベルを表示します。'
 when '+5候補・要再現 / 密着候補 / 後ろ歩き' then '資料記載値は+5Fです。実機での再現確認が必要です。密着時と後ろ歩きを記録します。'
 when '+6候補・要再現 / 前ステ後 / 歩き調整' then '資料記載値は+6Fです。実機での再現確認が必要です。前方ステップ後と歩き調整を記録します。'
 else recording_instructions end,
playback_settings=case playback_settings
 when 'Random playback。入力履歴・フレーム・ダメージ・Drive/SA表示ON。' then 'ランダム再生。入力履歴、フレームメーター、ダメージ、Dゲージ、SAゲージを表示します。'
 when '通常ガード、4F暴れ、投げ、ジャンプ、パリィ、Dリバ、無敵技を必要に応じてランダム再生する。' then '通常ガード、4F技、投げ、ジャンプ、パリィ、ドライブリバーサル、無敵技を必要に応じてランダム再生します。'
 else playback_settings end,
cpu_settings=case cpu_settings
 when 'CPU OFF。' then 'CPU操作：オフ。'
 when 'CPU操作: OFF。' then 'CPU操作：オフ。'
 when 'CPU操作: OFF。ダミー記録/再生を使用。' then 'CPU操作：オフ。ダミーの記録／再生を使用します。'
 when 'CPU操作は使用せず録画再生を優先。' then 'CPU操作は使用せず、ダミーの記録再生を使用します。'
 when 'CPU Lv7。体力は有限または反復しやすい設定。' then 'CPUレベル7。体力は、実戦と同じ有限設定または反復しやすい設定にします。'
 when 'CPU Lv7。ゲージ類Normal。SAゲージ0。' then 'CPUレベル7。ゲージ類は通常設定、SAゲージは0にします。'
 else cpu_settings end,
success_criteria=case success_criteria
 when 'トレモ表示でヒット/ガード有利を各10回確認し、4F暴れへの成立を記録する。' then 'トレーニングモードの表示で、ヒット時とガード時の有利フレームを各10回確認し、4F技に対する結果を記録します。'
 when '通常/CHを混ぜ20回中15回以上CH時だけ完走する。' then '通常ヒットとカウンターヒットを混ぜ、カウンターヒット時だけ20回中15回以上完走します。'
 else success_criteria end,
next_step=case next_step
 when '成立しない相手行動が見つかった場合は、その行動専用の対策Trainingへ分離する。' then '成立しない相手行動が見つかった場合は、その行動専用の対策練習に分けます。'
 when '実機で成立を確認できた後にのみverified候補とし、投げ・シミー派生は別Trainingへ分ける。' then '実機で成立を確認できた場合のみ検証候補とし、投げ・シミーの派生は別の練習に分けます。'
 when '実機再現が一致したルートだけverified候補にする。' then '実機で同じ結果を再現できたルートだけを検証候補とします。'
 else next_step end,
updated_at=now()
where status='draft' and valid_to_patch_id is null
and content_kind in ('training','editorial','verified_strategy');

do $verify$
declare remaining integer;
begin
 select count(*) into remaining from public.trainings
 where status='draft' and valid_to_patch_id is null
 and content_kind in ('training','editorial','verified_strategy')
 and (
 purpose in ('Source記載の有利F・持続当て・距離条件を確定する。','既存reviewed連携を、確定連携と読み合いを区別しながら反復する。')
 or recording_instructions in ('ダミーに4F、ガード、投げ、ジャンプ、OD無敵技を必要に応じて記録。位置・受け身・カウンター設定をSource条件に合わせる。','相手側に対象行動を録画し、通常/後方受け身・4F・投げ・無敵技・DI等を必要に応じて切り替える。','720p60fps以上。入力履歴・フレーム・ダメージ・Drive/SA表示ON。成功例と必要な失敗例を分ける。','720p60fps以上。入力履歴・フレーム・ダメージ・Drive/SA・固有資源表示ON。','720p60fps以上。入力履歴・フレーム・ダメージ・Drive/SA・メダルLvを表示。','+5候補・要再現 / 密着候補 / 後ろ歩き','+6候補・要再現 / 前ステ後 / 歩き調整')
 or playback_settings in ('Random playback。入力履歴・フレーム・ダメージ・Drive/SA表示ON。','通常ガード、4F暴れ、投げ、ジャンプ、パリィ、Dリバ、無敵技を必要に応じてランダム再生する。')
 or cpu_settings in ('CPU OFF。','CPU操作: OFF。','CPU操作: OFF。ダミー記録/再生を使用。','CPU操作は使用せず録画再生を優先。','CPU Lv7。体力は有限または反復しやすい設定。','CPU Lv7。ゲージ類Normal。SAゲージ0。')
 or success_criteria in ('トレモ表示でヒット/ガード有利を各10回確認し、4F暴れへの成立を記録する。','通常/CHを混ぜ20回中15回以上CH時だけ完走する。')
 or next_step in ('成立しない相手行動が見つかった場合は、その行動専用の対策Trainingへ分離する。','実機で成立を確認できた後にのみverified候補とし、投げ・シミー派生は別Trainingへ分ける。','実機再現が一致したルートだけverified候補にする。')
 );
 if remaining<>0 then raise exception 'training exact copy remained: %',remaining; end if;
end
$verify$;

