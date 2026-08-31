-- Phase23 Ryu-only strategy expansion (2026-08-03 current patch).
-- Community recipes are preserved as reviewed/draft. Unknown damage/frame values stay NULL.
-- No publication or verification promotion is performed here.

insert into public.sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select v.* from (values
('リュウ、始めました～攻略～コンボと起き攻め','https://note.com/bonmoko_3/n/n6f0e26063ea9','community_guide','ボンモコ',null::timestamptz,now(),'secondary','Recipe-level combo, oki and frame claims; requires current-patch device reproduction.'),
('リュウ セットプレイ・起き攻め・固め連係まとめ','https://takukakugamer.com/sf6-ryu-setup/','community_guide','格ゲーブログ、略してかくぶろ',null::timestamptz,now(),'secondary','Structured Ryu oki, pressure and burnout recipes.'),
('リュウのセットプレイあれこれ','https://edanoarticle.com/ryu-set-play','community_guide','枝の書き物','2026-08-11'::timestamptz,now(),'secondary','Updated after the 2026-08-03 patch; exact recipes retained as reviewed candidates.'),
('モダンリュウ立ち回り・コンボ・起き攻め Year4対応版','https://www.sukoreru.com/sf6-modern-ryu','community_guide','すこれるブログ（仮）','2026-08-05'::timestamptz,now(),'secondary','Year4 Modern-specific routes and video links; do not infer Classic compatibility.'),
('リュウで勝つ 立ち回り・コンボ・起き攻め','https://momiageryo.com/2026/07/21/sf6_ryu_master/','community_guide','カルコラ','2026-07-21'::timestamptz,now(),'secondary','Current-year neutral and Denjin strategy reference.')
) v(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists (select 1 from public.sources s where s.url=v.url);

with ctx as (
 select (select id from public.characters where slug='ryu') ryu_id,
        (select id from public.patches where is_current=true order by released_at desc limit 1) patch_id
), rows(slug,name,combo_type,notation,starter,damage,drive_cost,sa_cost,position,difficulty,purpose,conditions,notes,source_url) as (
 values
('ryu-y4-light-hdonkey','小技3発→弱足刀 +42詐欺飛び締め','oki','小技×3 ＞ 弱上段足刀蹴り','小技',1100,null,0,'corner',2,'小技確認から詐欺飛び','画面端。記事記載+42F。','Damage/FはSource記載値。現行実機未検証。','https://note.com/bonmoko_3/n/n6f0e26063ea9'),
('ryu-y4-light-crdr-lethal','小技→Cラッシュ高火力SA3','lethal','弱P×3 ＞ Cラッシュ立ち弱P ＞ 引き強P ＞ Cラッシュ立ち強K ＞ 立ち強P ＞ 強昇龍拳 ＞ SA3','小技',3983,6,3,'any',5,'小技始動リーサル','Drive全消費候補。','Damage/成立はSource記載。','https://note.com/bonmoko_3/n/n6f0e26063ea9'),
('ryu-y4-cmp-od-donkey-tatsu','中攻撃→OD足刀→前強K→竜巻','drive','しゃがみ中P ＞ OD上段足刀蹴り ＞ 旋風脚(6強K) ＞ 竜巻旋風脚','しゃがみ中P',2585,2,0,'any',3,'低コスト運び・起き攻め','立ち強P始動候補もSourceに記載。','使用する竜巻強度と終端Fは実機確認待ち。','https://note.com/bonmoko_3/n/n6f0e26063ea9'),
('ryu-y4-cmp-od-donkey-sa2-tatsu','中攻撃→OD足刀→溜めSA2→強竜巻','sa','しゃがみ中P ＞ OD上段足刀蹴り ＞ SA2溜め ＞ 強竜巻旋風脚','しゃがみ中P',3850,2,2,'any',4,'SA2端運び','SA2を早めに当てる。','SourceはSA2後+7～10候補。正確な溜め段階/Fは未検証。','https://note.com/bonmoko_3/n/n6f0e26063ea9'),
('ryu-y4-crmk-drc-hhasho-mtatsu','中足ラッシュ→強波掌撃→中竜巻','drive_rush','しゃがみ中K ＞ Cラッシュしゃがみ強P ＞ 強波掌撃 ＞ 中竜巻旋風脚','しゃがみ中K',2026,3,0,'any',3,'中足始動・運び・起き攻め','中竜巻後前ステ。','Source記載+8。端到達時の弱波動重ねへ派生。','https://note.com/bonmoko_3/n/n6f0e26063ea9'),
('ryu-y4-crmk-drc-hhasho-dr-bhk-mtatsu','中足ラッシュ→強波掌撃→DR引き強K→中竜巻','drive_rush','しゃがみ中K ＞ Cラッシュしゃがみ強P ＞ 強波掌撃 ＞ ドライブラッシュ引き強K ＞ 中竜巻旋風脚','しゃがみ中K',null,4,0,'any',4,'運びと密着起き攻め','中竜巻後前ステ。','Source記載+5。Damage未記載。','https://note.com/bonmoko_3/n/n6f0e26063ea9'),
('ryu-y4-crmk-drc-hhasho-dr-bhk-lhasho','中足ラッシュ→弱波掌撃 +42締め','oki','しゃがみ中K ＞ Cラッシュしゃがみ強P ＞ 強波掌撃 ＞ ドライブラッシュ引き強K ＞ 弱波掌撃','しゃがみ中K',null,4,0,'any',4,'中足始動詐欺飛び','Source記載+42F。','詐欺飛び・持続立ち中Pへ移行。','https://note.com/bonmoko_3/n/n6f0e26063ea9'),
('ryu-y4-pc-5hk-lhasho-sa1','立ち強K PC→弱波掌撃→SA1','punish_counter','立ち強K(PC) ＞ 微歩き ＞ しゃがみ強P ＞ 弱波掌撃 ＞ SA1','立ち強K(PC)',3840,0,1,'any',4,'SA1確反・起き攻め','微歩きが必要。','Source記載+24、DI重ね候補。','https://note.com/bonmoko_3/n/n6f0e26063ea9'),
('ryu-y4-pc-5hk-lhasho-sweep','立ち強K PC ノーSA大足締め','punish_counter','立ち強K(PC) ＞ 微歩き ＞ しゃがみ強P ＞ 弱波掌撃 ＞ しゃがみ強K','立ち強K(PC)',3070,0,0,'any',3,'ノーゲージ確反','微歩きが必要。','DamageはSource記載。','https://note.com/bonmoko_3/n/n6f0e26063ea9'),
('ryu-y4-pc-5hk-od-donkey-tatsu','立ち強K PC→OD足刀→旋風脚→竜巻','punish_counter','立ち強K(PC) ＞ 立ち強P ＞ OD上段足刀蹴り ＞ 旋風脚 ＞ 竜巻旋風脚','立ち強K(PC)',3535,2,0,'any',4,'運び確反','竜巻強度は状況選択。','中竜巻版は前ステ+5/DI候補。','https://note.com/bonmoko_3/n/n6f0e26063ea9'),
('ryu-y4-pc-5hp-hhasho-dr-mtatsu','立ち強P PC→強波掌撃→中竜巻','punish_counter','立ち強P(PC) ＞ 強波掌撃 ＞ ドライブラッシュ引き強K ＞ 中竜巻旋風脚','立ち強P(PC)',2894,1,0,'any',3,'低Drive確反','中竜巻後前ステ。','Source記載+5、シミー不可。','https://note.com/bonmoko_3/n/n6f0e26063ea9'),
('ryu-y4-pc-5hp-max-sa3','立ち強P PC 中央最大級SA3','max_punish','立ち強P(PC) ＞ 強波掌撃 ＞ ドライブラッシュ引き強K ＞ 中竜巻 ＞ Cラッシュ引き強K ＞ Cラッシュ引き強K ＞ 強昇龍拳 ＞ SA3','立ち強P(PC)',5772,null,3,'any',5,'中央最大火力候補','画面端以外。','Drive costは複数ラッシュ種別が本文だけでは曖昧なためNULL。','https://note.com/bonmoko_3/n/n6f0e26063ea9'),
('ryu-y4-corner-5hk-denjin-6450','端立ち強K→OD電刃波掌撃→SA2→OD竜巻→SA1','max_punish','立ち強K ＞ 立ち強P ＞ OD電刃波掌撃 ＞ SA2溜め ＞ 旋風脚 ＞ OD竜巻 ＞ SA1','立ち強K',6450,4,3,'corner',5,'端Drive効率最大候補','電刃あり・SA1+SA2。','SA2溜め段階と入力猶予は実機確認待ち。','https://note.com/bonmoko_3/n/n6f0e26063ea9'),
('ryu-y4-di-pc-jhp-dr-bhk','DI中央PC→J強P→DR引き強K','drive_impact','ドライブインパクト(中央PC) ＞ ジャンプ強P ＞ ドライブラッシュ引き強K ＞ 弱波掌撃 または 中竜巻','DI(中央PC)',null,1,0,'mid',4,'DI後の詐欺飛び/起き攻め分岐','締めで分岐。','Damage未記載。','https://note.com/bonmoko_3/n/n6f0e26063ea9'),
('ryu-y4-di-wall-hp-mhasho-hdp','DI壁やられ基本','wall','DI壁やられ ＞ 立ち強P ＞ 中波掌撃 ＞ 強昇龍拳','DI壁やられ',2840,0,0,'corner',2,'壁やられ安定','壁やられ。','Source記載+29。','https://note.com/bonmoko_3/n/n6f0e26063ea9'),
('ryu-y4-di-wall-reset-di','DI壁やられ→TC→再DI','setup','DI壁やられ ＞ ドライブラッシュ立ち強P ＞ 立ち強K(TC) ＞ 立ち弱K ＞ ドライブインパクト','DI壁やられ',null,null,0,'corner',4,'再DIセットプレイ','確定連携ではない。','相手のDI返し/無敵/パリィを含む読み合いとして保持。','https://note.com/bonmoko_3/n/n6f0e26063ea9'),
('ryu-y4-di-corner-pc-hp-hdp','端DIパニカン基本','drive_impact','DI(画面端PC) ＞ 前ステップ ＞ しゃがみ強P ＞ 中波掌撃 ＞ 強昇龍拳','DI(端PC)',3000,0,0,'corner',3,'端DI安定','SA1/SA3へ分岐可。','SourceにSA1 3360/SA3 5000派生記載。','https://note.com/bonmoko_3/n/n6f0e26063ea9'),
('ryu-y4-di-side-switch','被画面端DI PC入れ替え','drive_impact','DI(被画面端PC) ＞ 前ステップ ＞ しゃがみ強P ＞ OD上段足刀蹴り ＞ 前ステップ ＞ 中昇龍拳','DI(被画面端PC)',2820,2,0,'corner',4,'画面入れ替え','自分が端を背負う。','弱昇龍は低火力候補。','https://note.com/bonmoko_3/n/n6f0e26063ea9'),
('ryu-y4-corner-senpukyaku-odtatsu-sa3','端旋風脚→OD竜巻→強昇龍→SA3','corner','旋風脚(画面端) ＞ OD竜巻 ＞ 強昇龍拳 ＞ SA3','旋風脚',5210,2,3,'corner',4,'端中段/打撃始動リーサル','画面端。','DamageはSource記載。','https://note.com/bonmoko_3/n/n6f0e26063ea9'),
('ryu-y4-denjin-hasho-dr-bhp-hdp','電刃波掌撃→DR引き強P→強昇龍','resource','しゃがみ中K ＞ 電刃強波掌撃 ＞ ドライブラッシュ引き強P ＞ 強昇龍拳','しゃがみ中K',null,1,0,'any',3,'電刃中足確認','電刃ストックあり。','Source記載の前ステ×2 +3起き攻めへ。','https://momiageryo.com/2026/07/21/sf6_ryu_master/')
)
insert into public.combos(character_id,slug,name,combo_type,notation,starter_text,damage,drive_cost,sa_cost,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.ryu_id,r.slug,r.name,r.combo_type,r.notation,r.starter,r.damage,r.drive_cost,r.sa_cost,r.position,r.difficulty,r.purpose,r.conditions,r.notes,ctx.patch_id,'reviewed','strategy','draft'
from rows r cross join ctx on conflict(slug) do nothing;

with ctx as (select (select id from characters where slug='ryu') ryu_id,(select id from patches where is_current=true order by released_at desc limit 1) patch_id),
rows(slug,name,setup_type,starter,sequence_text,frame_advantage,position,meter,description,counter_notes,source_url) as (values
('ryu-y4-sj-light-donkey','弱足刀+42→前J強K詐欺飛び','safe_jump','画面端：弱足刀地上ヒット','最速前ジャンプ ＞ ジャンプ強K','+42','corner','none','通常起きには重ね、無敵技には着地ガード。','遅らせ打撃には着地直前空中竜巻候補。実機で4F/各無敵を確認。','https://note.com/bonmoko_3/n/n6f0e26063ea9'),
('ryu-y4-sj-hdonkey-air','強足刀空中ヒット+42→前J強K','safe_jump','強足刀空中ヒット','最速前ジャンプ ＞ ジャンプ強K','+42','any','none','空中ヒット締めから詐欺飛び。','空中ヒット高度・キャラ差を要検証。','https://takukakugamer.com/sf6-ryu-setup/'),
('ryu-y4-sj-hhasho-dr-bhk-lhasho','強波掌撃ルート→弱波掌撃+42','safe_jump','強波掌撃 ＞ DR引き強K ＞ 弱波掌撃','最速前ジャンプ ＞ ジャンプ強K','+42','any','drive','中央から狙える詐欺飛び候補。','無敵技と受け身条件を実機確認。','https://note.com/bonmoko_3/n/n6f0e26063ea9'),
('ryu-y4-corner-forwardthrow-shimmy','端前投げ+17シミー','corner_oki','画面端前投げ','即後ろ歩き ＞ 継続シミー / 立ち中P / 前投げ','+17','corner','none','投げ後の打撃・投げ・シミー。','後ろ歩きが遅いと投げ暴れを避けられない。','https://takukakugamer.com/sf6-ryu-setup/'),
('ryu-y4-corner-forwardthrow-5lp','端前投げ→立ち弱P空振り+4','corner_oki','画面端前投げ','立ち弱P空振り ＞ 立ち中P / 前投げ / バクステ','+4','corner','none','自動タイミングの打撃投げ択。','シミー不可。バクステ時は投げ空振りに+11候補。','https://takukakugamer.com/sf6-ryu-setup/'),
('ryu-y4-mtatsu-dash-oki','中竜巻+23→前ステ+4','oki','中竜巻地上ヒット','前ステップ ＞ 前投げ / 打撃','+4','corner','none','端到達時の密着起き攻め。','中央ではノーゲージ起き攻め不可。','https://takukakugamer.com/sf6-ryu-setup/'),
('ryu-y4-ltatsu-5lp-overhead','弱竜巻→立ち弱P空振り→中段','meaty','画面端：弱竜巻','立ち弱P空振り ＞ 鎖骨割り ＞ 立ち弱P ＞ 真空竜巻','source-described','corner','sa_optional','鎖骨割り2段目の持続当て中段コンボ。','成立F・SA/昇龍締めを実機確認。','https://edanoarticle.com/ryu-set-play'),
('ryu-y4-ltatsu-crmp-hp-meaty','弱竜巻→しゃがみ中P空振り→強P持続','meaty','画面端：弱竜巻','しゃがみ中P空振り ＞ 立ち強P','source-described','corner','none','立ち強Pの持続重ね。','ヒット/ガードFを実機確認。','https://edanoarticle.com/ryu-set-play'),
('ryu-y4-hdp-lk-hp-meaty','強昇龍→弱K空振り→強P持続','meaty','画面端：強昇龍拳','立ち弱K空振り ＞ 立ち強P','source-described','corner','none','強昇龍締めからの持続重ね。','キャラ/受け身差を実機確認。','https://edanoarticle.com/ryu-set-play'),
('ryu-y4-ltatsu-dash-lhasho','弱竜巻→前ステ→弱波掌撃持続','meaty','弱竜巻地上ヒット','前ステップ ＞ 弱波掌撃','+2 on block claim','any','none','弱波掌撃の持続重ね。','CH回転吹き飛び後2強P追撃候補。','https://edanoarticle.com/ryu-set-play'),
('ryu-y4-hdp-crmk-whiff-shimmy','強昇龍→中足空振り+2間合い外','oki','画面端：強昇龍拳','しゃがみ中K空振り ＞ 後退 / 投げ / 打撃','+2 claim','corner','none','投げ間合い外からのシミー候補。','相手の投げ間合い差を確認。','https://note.com/bonmoko_3/n/n6f0e26063ea9'),
('ryu-y4-hdonkey-ldp-clp-fireball','強足刀→弱昇龍→しゃがみ弱P空振り','meaty','画面端：強足刀 ＞ 弱昇龍','しゃがみ弱P空振り ＞ 弱波動拳 / 鳩尾砕き','source-described','corner','none','持続弾または大ゴス重ね。','引き強Pループ・無敵対応を確認。','https://note.com/bonmoko_3/n/n6f0e26063ea9'),
('ryu-y4-hdonkey-ldp-5hk-whiff','強足刀→弱昇龍→立ち強K空振り択','oki','画面端：強足刀 ＞ 弱昇龍','立ち強K空振り ＞ 後ろ下がり / 投げ / 打撃','source-described','corner','none','端の投げ打撃シミー分岐。','各キャラ投げ間合いと4Fを確認。','https://note.com/bonmoko_3/n/n6f0e26063ea9'),
('ryu-y4-corner-denjin-tc-charge','波掌撃→DR上段二連撃→電刃','charge_oki','画面端：強/電刃波掌撃','DR立ち強P・強P(TC) ＞ 電刃錬気','+9 claim','corner','drive','コンボ後に電刃を再取得して密着起き攻め。','Modern記事。Classic入力との互換を推測しない。','https://www.sukoreru.com/sf6-modern-ryu'),
('ryu-y4-corner-hhasho-6hp-tatsu','強波掌撃→6強P→竜巻→前ステ×2','corner_oki','画面端：強/電刃波掌撃','旋風脚を少し遅らせ ＞ 竜巻 ＞ 前ステップ×2','+5 claim','corner','none','密着+5または6F無敵への安全飛び候補。','遅らせ量と安全飛び成立条件を動画/実機確認。','https://www.sukoreru.com/sf6-modern-ryu')
)
insert into public.setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,meter_condition,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.ryu_id,r.slug,r.name,r.setup_type,r.starter,r.sequence_text,r.frame_advantage,r.position,r.meter,r.description,r.counter_notes,ctx.patch_id,'reviewed','strategy','draft' from rows r cross join ctx on conflict(slug) do nothing;

with ctx as (select (select id from characters where slug='ryu') ryu_id,(select id from patches where is_current=true order by released_at desc limit 1) patch_id),
rows(slug,name,sequence_type,sequence_text,is_true,mash,throw_point,shimmy,jump_opt,parry_opt,drev,invincible,notes,source_url) as (values
('ryu-y4-seq-5lp-options','立ち弱Pガード後の3分岐','pressure','立ち弱Pガード ＞ 連打立ち弱P / しゃがみ弱K / 様子見',false,'連打弱Pは最速打ち返しへのCH候補','様子見からパリィ空振りを投げる',null,'後ろ歩きには2弱K','様子見でパリィ空振り確認','要検証','無敵技は全派生への回答','確定固めではなく読み合い。','https://takukakugamer.com/sf6-ryu-setup/'),
('ryu-y4-seq-dr-mp-plus3','DR立ち中P+3 打撃投げ','drive_rush','ドライブラッシュ立ち中Pガード ＞ 投げ / 立ち中P / 後ろ歩き',false,'4Fには打撃重ね','距離内のみ投げ','後ろ歩き',null,'遅らせ投げでパリィ対策','要検証','無敵読みはガード','ガード距離により投げが届かない。','https://takukakugamer.com/sf6-ryu-setup/'),
('ryu-y4-seq-lhasho-plus2','弱波掌撃持続+2後の択','pressure','弱波掌撃持続ガード(+2) ＞ 前投げ / しゃがみ中P / 後ろ歩き',false,'2中Pで暴れ潰し候補','先端以外は投げ候補','後ろ歩き',null,'投げでパリィ対策','要検証','無敵読みはガード','持続の当たり方により状況変化。','https://takukakugamer.com/sf6-ryu-setup/'),
('ryu-y4-seq-burnout-lhasho','BO弱波掌撃2F隙間','burnout','弱波掌撃ガード(+1) ＞ しゃがみ弱P',false,'Source記載2F隙間',null,null,'要検証','ジャスパ/パリィ可否を確認','要検証','SA割り込みを確認','相手バーンアウト時。真の連続ガードではない。','https://takukakugamer.com/sf6-ryu-setup/'),
('ryu-y4-seq-burnout-crlp-lhasho','BOしゃがみ弱P→弱波掌撃連ガ','burnout','しゃがみ弱Pガード ＞ 弱波掌撃',true,null,null,null,null,'連ガ中は不可','要検証','連ガ中は不可','Sourceはバーンアウト時連続ガードと記載。実機確認待ち。','https://takukakugamer.com/sf6-ryu-setup/'),
('ryu-y4-seq-burnout-odhasho-bhp','BO OD波掌撃→引き強P連ガ','burnout','OD波掌撃ガード(+7) ＞ 引き強P',true,null,null,null,null,'連ガ中は不可','要検証','連ガ中は不可','相手BO、自分Drive消費。Source記載の連ガ。','https://takukakugamer.com/sf6-ryu-setup/'),
('ryu-y4-seq-burnout-loop','BO引き強P↔OD波掌撃削り','burnout','引き強P ＞ OD波掌撃 ＞ 引き強P',null,'隙間は個別確認',null,null,'ジャンプ/DIを確認','パリィ/ジャスパを確認','要検証','SA割り込みを確認','ゲージ消費が激しい。各区間の確定/読みを分離検証。','https://takukakugamer.com/sf6-ryu-setup/'),
('ryu-y4-seq-denjin-crmk-hhasho','電刃中足→強化波掌撃','resource_pressure','しゃがみ中K ＞ 電刃強波掌撃 ＞ ヒット時DR引き強P / ガード時攻め継続',null,'2中P始動は割り込まれないとのSource主張',null,null,'要検証','パリィ対応を確認','要検証','無敵/SA割り込みを確認','中足始動の隙間と2中P始動を分けて検証。','https://momiageryo.com/2026/07/21/sf6_ryu_master/'),
('ryu-y4-seq-hp-hhasho','立ち強P→強波掌撃先端連携','neutral_pressure','立ち強P ＞ 強波掌撃',false,'先端は4F暴れへのCH候補',null,null,'要検証','パリィ対応を確認','要検証','無敵/SAを確認','DIに弱い。確定連携ではない。','https://momiageryo.com/2026/07/21/sf6_ryu_master/'),
('ryu-y4-seq-mtatsu-di','中竜巻後最速DI','oki_pressure','中竜巻地上ヒット ＞ 最速ドライブインパクト',false,'4FではなくDI返し/無敵を検証',null,null,'ジャンプ可否を確認','パリィに弱いとのSource','DI返しを確認','無敵技に負ける','奇襲セットプレイ。確定扱い禁止。','https://edanoarticle.com/ryu-set-play')
)
insert into public.sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,mash_point,throw_point,shimmy_point,jump_option,parry_option,drive_reversal_option,invincible_option,notes,valid_from_patch_id,verification_status,content_kind,status)
select ctx.ryu_id,r.slug,r.name,r.sequence_type,r.sequence_text,r.is_true,r.mash,r.throw_point,r.shimmy,r.jump_opt,r.parry_opt,r.drev,r.invincible,r.notes,ctx.patch_id,'reviewed','strategy','draft' from rows r cross join ctx on conflict(slug) do nothing;

-- Every new strategy item becomes a directly reproducible Training entry.
with ctx as (select (select id from characters where slug='ryu') ryu_id,(select id from patches where is_current=true order by released_at desc limit 1) patch_id), candidates as (
 select 'combo' entity_type,id,slug,name,notation recipe,purpose from combos,ctx where character_id=ctx.ryu_id and slug like 'ryu-y4-%'
 union all select 'setup',id,slug,name,starter_condition||' ＞ '||sequence_text,description from setups,ctx where character_id=ctx.ryu_id and slug like 'ryu-y4-%'
 union all select 'sequence',id,slug,name,sequence_text,notes from sequences,ctx where character_id=ctx.ryu_id and slug like 'ryu-y4-%'
), ins as (
 insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
 select 'training-'||c.slug,'【実機確認】'||c.name,case c.entity_type when 'combo' then 'combo' when 'setup' then 'oki' else 'pressure' end,
        coalesce(c.purpose,'現行版でレシピの成立条件を確定する。'),'intermediate',10,ctx.ryu_id,
        'ダミーに4F、ガード、投げ、ジャンプ、OD無敵技を必要に応じて記録。位置・受け身・カウンター設定をSource条件に合わせる。',
        'Random playback。入力履歴・フレーム・ダメージ・Drive/SA表示ON。','CPU OFF。',c.recipe,
        '同一条件10回で成立を確認し、ダメージ、消費ゲージ、終了F、距離、受け身、キャラ差を記録する。成立しない場合も結果を保存する。',20,
        '結果確認後に元'||c.entity_type||'のverificationを個別更新する。',ctx.patch_id,'reviewed','training','draft'
 from candidates c cross join ctx on conflict(slug) do nothing returning id,slug
)
select count(*) from ins;

-- Link each strategy item and generated Training to its recipe source plus the current official patch source.
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select x.entity_type,x.id,s.id,'supporting','Current Ryu recipe source; reviewed, not device-verified.'
from (
 select 'combo' entity_type,id,case when slug='ryu-y4-denjin-hasho-dr-bhp-hdp' then 'https://momiageryo.com/2026/07/21/sf6_ryu_master/' else 'https://note.com/bonmoko_3/n/n6f0e26063ea9' end url from combos where slug like 'ryu-y4-%'
 union all select 'setup',id,case when slug in ('ryu-y4-sj-hdonkey-air','ryu-y4-corner-forwardthrow-shimmy','ryu-y4-corner-forwardthrow-5lp','ryu-y4-mtatsu-dash-oki') then 'https://takukakugamer.com/sf6-ryu-setup/' when slug like '%denjin-tc%' or slug like '%hhasho-6hp%' then 'https://www.sukoreru.com/sf6-modern-ryu' when slug in ('ryu-y4-ltatsu-5lp-overhead','ryu-y4-ltatsu-crmp-hp-meaty','ryu-y4-hdp-lk-hp-meaty','ryu-y4-ltatsu-dash-lhasho') then 'https://edanoarticle.com/ryu-set-play' else 'https://note.com/bonmoko_3/n/n6f0e26063ea9' end from setups where slug like 'ryu-y4-%'
 union all select 'sequence',id,case when slug like '%burnout%' or slug in ('ryu-y4-seq-5lp-options','ryu-y4-seq-dr-mp-plus3','ryu-y4-seq-lhasho-plus2') then 'https://takukakugamer.com/sf6-ryu-setup/' when slug like '%denjin%' or slug='ryu-y4-seq-hp-hhasho' then 'https://momiageryo.com/2026/07/21/sf6_ryu_master/' else 'https://edanoarticle.com/ryu-set-play' end from sequences where slug like 'ryu-y4-%'
) x join sources s on s.url=x.url on conflict(entity_type,entity_id,source_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select z.entity_type,z.entity_id,s.id,'supporting','CAPCOM 2026-08-03 Ryu change list; recipe remains reviewed pending reproduction.'
from (
 select 'combo' entity_type,id entity_id from combos where slug like 'ryu-y4-%'
 union all select 'setup',id from setups where slug like 'ryu-y4-%'
 union all select 'sequence',id from sequences where slug like 'ryu-y4-%'
 union all select 'training',id from trainings where slug like 'training-ryu-y4-%'
) z cross join sources s where s.url in ('https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/ryu','https://www.streetfighter.com/6/buckler/en/battle_change/20260803/ryu')
on conflict(entity_type,entity_id,source_id) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,'combo',c.id from trainings t join combos c on t.slug='training-'||c.slug where c.slug like 'ryu-y4-%'
union all select t.id,'setup',s.id from trainings t join setups s on t.slug='training-'||s.slug where s.slug like 'ryu-y4-%'
union all select t.id,'sequence',s.id from trainings t join sequences s on t.slug='training-'||s.slug where s.slug like 'ryu-y4-%'
on conflict(training_id,related_type,related_id) do nothing;
