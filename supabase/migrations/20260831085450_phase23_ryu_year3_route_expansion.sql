-- Additional concrete Ryu Year3 routes found in the full 19-route catalog.
-- All remain legacy_candidate/unverified/draft pending current-patch reproduction.
with ctx as(select (select id from characters where slug='ryu') cid,(select id from patches where is_current=true order by released_at desc limit 1) pid),
r(slug,name,ctype,notation,starter,pos,purpose,conditions,notes) as(values
('ryu-y3-crmk-hhasho-mdonkey-charge','中足DR→強波掌撃→中足刀→電刃','resource','しゃがみ中K ＞ Cラッシュしゃがみ強P ＞ 強波掌撃 ＞ 中足刀 ＞ 電刃錬気','しゃがみ中K','any','電刃取得','Year3。','相手の起き上がり弾へ強化SA1候補。相手技別確認。'),
('ryu-y3-crmk-hhasho-corner-lhasho-ldp','中足DR端→弱波掌撃→弱昇龍','corner','しゃがみ中K ＞ Cラッシュしゃがみ強P ＞ 強波掌撃 ＞ 弱波掌撃 ＞ 弱昇龍拳','しゃがみ中K','corner','端火力と起き攻め','端到達時。','現行技変更後のつながり確認。'),
('ryu-y3-crmk-hhasho-corner-overhead','中足DR端→弱昇龍→持続中段','overhead','しゃがみ中K ＞ Cラッシュしゃがみ強P ＞ 強波掌撃 ＞ 弱波掌撃 ＞ 弱昇龍拳 ＞ しゃがみ弱K空振り ＞ 鎖骨割り','しゃがみ中K','corner','持続中段','Year3。','Sourceはヒット+4/ガード0。'),
('ryu-y3-crmk-hhasho-corner-dirty-di','中足DR端→弱昇龍→DI','setup','しゃがみ中K ＞ Cラッシュしゃがみ強P ＞ 強波掌撃 ＞ 弱波掌撃 ＞ 弱昇龍拳 ＞ しゃがみ弱K空振り ＞ ドライブインパクト','しゃがみ中K','corner','パリィ対策DI','読み合い。','確定連携ではない。DI返し/パリィ/無敵を確認。'),
('ryu-y3-crmk-corner-hp-donkey-mdp','中足DR端→強足刀中昇龍','corner','しゃがみ中K ＞ Cラッシュ立ち強P ＞ 引き強P ＞ 強足刀 ＞ 中昇龍拳','しゃがみ中K','corner','端火力','端付近。','距離限定。'),
('ryu-y3-crmk-corner-meaty-mp','中足DR端→中昇龍→中P持続','oki','しゃがみ中K ＞ Cラッシュ立ち強P ＞ 引き強P ＞ 強足刀 ＞ 中昇龍拳 ＞ しゃがみ中P空振り ＞ 立ち中P','しゃがみ中K','corner','持続立ち中P','Year3。','持続ヒット/ガード値を確認。'),
('ryu-y3-crmk-corner-gosho-trade','中足DR端→中昇龍→大ゴス相打ち','oki','しゃがみ中K ＞ Cラッシュ立ち強P ＞ 引き強P ＞ 強足刀 ＞ 中昇龍拳 ＞ しゃがみ弱K空振り ＞ 鳩尾砕き','しゃがみ中K','corner','4F相打ち起き攻め','Year3。','DI返し可能とのSource主張を確認。'),
('ryu-y3-gosho-cmp-mtatsu','鳩尾砕き通常ヒット→中竜巻','basic','鳩尾砕き ＞ しゃがみ中P ＞ 中竜巻旋風脚','鳩尾砕き','any','通常ヒット安定','近距離。','遠目は立ち弱K代用候補。'),
('ryu-y3-gosho-ch-crmk-mtatsu','鳩尾砕きCH→中足→中竜巻','counter_hit','鳩尾砕き(CH) ＞ しゃがみ中K ＞ 中竜巻旋風脚','鳩尾砕き(CH)','any','CH確認','Year3。','現行ヒット硬直確認。'),
('ryu-y3-gosho-pc-hp-mtatsu','鳩尾砕きPC→強P→中竜巻','punish_counter','鳩尾砕き(PC) ＞ 立ち強P ＞ 中竜巻旋風脚','鳩尾砕き(PC)','any','PC確認','Year3。','距離差を確認。'),
('ryu-y3-gosho-od-donkey-senpu','鳩尾砕き→OD足刀→旋風竜巻','drive','鳩尾砕き ＞ しゃがみ中P ＞ OD足刀 ＞ 旋風脚 ＞ 空中竜巻','鳩尾砕き','any','Drive運び','Year3。','2026-08-03旋風脚変更の影響確認。'),
('ryu-y3-gosho-odhasho-charge','鳩尾砕き→OD波掌撃→大足→電刃','resource','鳩尾砕き ＞ しゃがみ中P ＞ OD波掌撃 ＞ 歩きしゃがみ強P ＞ 弱波掌撃 ＞ しゃがみ強K ＞ 電刃錬気','鳩尾砕き','any','Drive効率と電刃取得','電刃状態候補。','歩き量・ストック条件確認。'),
('ryu-y3-gosho-odhasho-sa1','鳩尾砕き→OD波掌撃→SA1','sa','鳩尾砕き ＞ しゃがみ中P ＞ OD波掌撃 ＞ 歩きしゃがみ強P ＞ 弱波掌撃 ＞ SA1','鳩尾砕き','any','SA1効率','Year3。','現行Damage確認。'),
('ryu-y3-pc-hk-charge','立ち強K PC→大足→電刃','punish_counter','立ち強K(PC) ＞ 歩きしゃがみ強P ＞ 弱波掌撃 ＞ しゃがみ強K ＞ 電刃錬気','立ち強K(PC)','any','ノーDrive確反と電刃','Year3。','歩き量確認。'),
('ryu-y3-pc-corner-odhasho-mdp','端OD波掌撃PC→中昇龍','punish_counter','OD波掌撃(PC) ＞ 引き強P ＞ 強足刀 ＞ 中昇龍拳','OD波掌撃(PC)','corner','端低コスト確反','端。','実質Drive回収値は未確定。'),
('ryu-y3-pc-corner-donkey-max','端強足刀PC最大候補','max_punish','強足刀(PC) ＞ DRしゃがみ強P ＞ Cラッシュしゃがみ強P ＞ 強足刀 ＞ 強昇龍拳 ＞ SA3','強足刀(PC)','corner','端最大SA3','Drive+SA3。','Sourceは6200超候補。現行Damage不明。'),
('ryu-y3-di-wall-basic','DI壁やられ→中波掌撃強昇龍','wall','ドライブインパクト壁やられ ＞ しゃがみ強P ＞ 中波掌撃 ＞ 強昇龍拳','DI壁やられ','corner','ノーゲージ壁コンボ','Year3。','既存5HP始動との差を保持。'),
('ryu-y3-di-counter-od-donkey-side','DI返し→OD足刀旋風竜巻','drive_impact','ドライブインパクト返し ＞ 立ち強K ＞ しゃがみ中K ＞ OD足刀 ＞ 旋風脚 ＞ 空中竜巻','DI返し','any','Drive運びと起き攻め','Year3。','2026-08-03後の旋風脚/空中竜巻を確認。'),
('ryu-y3-stun-sa2-sa1','スタン→電刃SA2→OD竜巻SA1','stun','ドライブインパクト(スタン) ＞ 電刃錬気 ＞ SA2 ＞ 旋風脚 ＞ OD竜巻 ＞ SA1','スタン','corner','簡易スタン高火力','SA2+SA1。','SA2溜め量・Drive条件確認。'),
('ryu-y3-stun-jump-sa1','スタン→電刃強化波掌撃→SA1','stun','DIスタン ＞ 電刃錬気 ＞ ジャンプ攻撃 ＞ 立ち強K ＞ しゃがみ中K ＞ 強化波掌撃 ＞ 旋風脚 ＞ OD竜巻 ＞ SA1','スタン','corner','SA1スタン最大候補','電刃あり。','各追撃の高さ確認。'),
('ryu-y3-stun-ca','スタン→OD竜巻→CA','stun','DIスタン ＞ 電刃錬気 ＞ ジャンプ攻撃 ＞ しゃがみ強P ＞ OD竜巻 ＞ 強昇龍拳 ＞ CA','スタン','corner','CAスタンルート','CA利用。','現行キャンセル/補正確認。'),
('ryu-y3-denjin-crmk-dr-hp-hdp','強化波掌撃→DR引き強P→強昇龍','resource','しゃがみ中K ＞ 強化波掌撃 ＞ ドライブラッシュ引き強P ＞ 強昇龍拳','しゃがみ中K','any','電刃中央詐欺飛び候補','電刃あり。','Sourceは6F安全飛び。5F弱昇龍には負ける候補。'),
('ryu-y3-denjin-heel-loop','強化波掌撃→DRかかとループ→SA','lethal','しゃがみ中K ＞ 強化波掌撃 ＞ DR引き強K ＞ Cラッシュ引き強K ＞ Cラッシュ引き強K ＞ SA1/SA2/SA3','しゃがみ中K','any','リーサル判断簡略化','電刃・Drive使用。','各SAへの接続と補正確認。'),
('ryu-y3-rush-overhead-dp','ラッシュ中段→中P→強昇龍','overhead','ドライブラッシュ鎖骨割り ＞ しゃがみ中P ＞ 強昇龍拳','DR中段','any','中段基本確認','Year3。','しゃがみ食らい時派生あり。'),
('ryu-y3-rush-overhead-od-donkey','ラッシュ中段→OD足刀旋風竜巻','overhead','DR鎖骨割り ＞ しゃがみ中P ＞ OD足刀 ＞ 旋風脚 ＞ 空中竜巻 ＞ 前ステップ×2','DR中段','any','中段Drive運び','Year3。','旋風脚変更後確認。'),
('ryu-y3-rush-overhead-crouch-max','ラッシュ中段しゃがみ食らい最大','overhead','DR鎖骨割り ＞ 引き強P ＞ Cラッシュ立ち強K ＞ しゃがみ強P ＞ 強昇龍拳','DR中段','any','しゃがみ限定火力','相手しゃがみ食らい。','立ち食らい不可候補。'),
('ryu-y3-rush-low-mtatsu','ラッシュ下段→中竜巻','mixup','DRしゃがみ弱K ＞ しゃがみ中P ＞ 立ち弱K ＞ 中竜巻旋風脚','DR下段','any','中段ジャスパ対策','Year3。','中下択として保持。'),
('ryu-y3-rush-low-donkey','ラッシュ下段確認→強足刀','mixup','DRしゃがみ弱K ＞ 引き強P ＞ 強足刀 ＞ 中昇龍拳','DR下段','any','下段高火力確認','ヒット確認。','引き強P接続距離確認。'),
('ryu-y3-side-switch-pc-hk','立ち強K PC入れ替え','side_switch','立ち強K(PC) ＞ 歩きしゃがみ強P ＞ OD足刀 ＞ 前ステップ ＞ 中昇龍拳','立ち強K(PC)','any','画面入れ替え','Year3。','前ステ方向と昇龍位置確認。'),
('ryu-y3-side-switch-denjin-tatsu','電刃中足入れ替え','side_switch','しゃがみ中K ＞ 強化波掌撃 ＞ DRしゃがみ中P ＞ 強竜巻旋風脚','しゃがみ中K','any','電刃入れ替え','電刃あり。','強竜巻での左右入れ替えを確認。'),
('ryu-y3-burnout-crmk-lhasho-sa3','バーンアウト中足弱波掌撃SA3','burnout','しゃがみ中K ＞ 弱波掌撃 ＞ ヒット時SA3','しゃがみ中K','any','バーンアウト時確認','自分バーンアウト/CA候補。','ガード-3とのSource主張を現行確認。')
)
insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.cid,r.slug,r.name,r.ctype,r.notation,r.starter,r.pos,4,r.purpose,r.conditions,r.notes,ctx.pid,'unverified','legacy_candidate','draft' from r cross join ctx on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'combo',c.id,s.id,'supporting','Full Year3 route catalog; current-patch reproduction pending.' from combos c cross join sources s
where c.slug like 'ryu-y3-%' and s.url='https://punipunigame.com/sf6-ryu-year3-combo/'
on conflict(entity_type,entity_id,source_id) do nothing;

with ctx as(select (select id from characters where slug='ryu') cid,(select id from patches where is_current=true order by released_at desc limit 1) pid),candidates as(
 select id,slug,name,notation from combos,ctx where character_id=ctx.cid and slug like 'ryu-y3-%'
),ins as(
 insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
 select 'training-'||c.slug,'【旧版成立確認】'||c.name,'combo_retest','直近1年間の実戦ルートを現行版で再現する。','advanced',10,ctx.cid,'Sourceと同じ位置・ゲージ・CH/PC・立ち/しゃがみ条件を設定。','入力履歴・フレーム・ダメージ表示ON。','CPU OFF。',c.notation,'左右各10回で成立可否、Damage、Drive/SA消費、終了F、キャラ差を記録。',20,'成立ならreviewed、非成立ならarchivedへ。',ctx.pid,'unverified','legacy_candidate','draft'
 from candidates c cross join ctx on conflict(slug) do nothing returning id,slug)
select count(*) from ins;

insert into training_relations(training_id,related_type,related_id)
select t.id,'combo',c.id from trainings t join combos c on t.slug='training-'||c.slug where c.slug like 'ryu-y3-%'
on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'supporting','Year3 route evidence; current-patch reproduction pending.' from trainings t cross join sources s
where t.slug like 'training-ryu-y3-%' and s.url='https://punipunigame.com/sf6-ryu-year3-combo/'
on conflict(entity_type,entity_id,source_id) do nothing;
