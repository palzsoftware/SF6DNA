-- Final five written/image-only strategy collections: Sagat, C.Viper, Alex, Ingrid and Yasmine.
-- 2026-08-03 patch baseline. No video-derived inputs. All rows remain draft/unverified.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select * from(values
('SAGAT バトル変更リスト 2026.08.03','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/sagat','official_patch','CAPCOM','2026-08-03 00:00:00+00'::timestamptz,now(),'official','Current Sagat patch baseline.'),
('サガット 基本コンボと起き攻め','https://note.com/bonmoko_3/n/n21ed46db0cdf','community_guide','ボンモコ','2025-12-16 00:00:00+00'::timestamptz,now(),'community','Detailed written/image routes, frame families and position checks.'),
('サガット セットプレイまとめ','https://takukakugamer.com/sf6-sagat-setup/','community_guide','格ゲーブロガー拓',null::timestamptz,now(),'community','Written/image knockdown and meaty catalog.'),
('モダンサガット Year4','https://www.sukoreru.com/sf6-modern-sagat','community_guide','スコれる',null::timestamptz,now(),'community','Modern command, combo and oki guide.'),
('C.VIPER バトル変更リスト 2026.08.03','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/cviper','official_patch','CAPCOM','2026-08-03 00:00:00+00'::timestamptz,now(),'official','Current C.Viper patch baseline.'),
('今夜勝ちたいC.ヴァイパー攻略','https://goziline.com/archives/64321','community_guide','ゴジライン','2025-10-16 00:00:00+00'::timestamptz,now(),'community','Written/image Classic combos, oki, safe jumps and pressure.'),
('C.ヴァイパー Year4セットプレイ','https://tatsujin.blog/sf6/c-viper/setplay/','community_guide','格ゲーの達人','2026-08-05 00:00:00+00'::timestamptz,now(),'community','Post-patch written/image setup catalog.'),
('モダンC.ヴァイパー コンボメモ','https://note.com/emesirna/n/n941607718414','community_guide','さーな','2026-08-03 00:00:00+00'::timestamptz,now(),'community','Post-patch Modern routes and Assist branches.'),
('モダンC.ヴァイパー 起き攻めメモ','https://note.com/emesirna/n/n192205d3ea1f','community_guide','さーな','2026-03-19 00:00:00+00'::timestamptz,now(),'community','Written Modern frame families and pressure branches.'),
('モダンC.ヴァイパー攻略','https://www.sukoreru.com/sf6-modern-viper','community_guide','スコれる','2025-10-16 00:00:00+00'::timestamptz,now(),'community','Modern command availability, combo and defense guide.'),
('ALEX バトル変更リスト 2026.08.03','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/alex','official_patch','CAPCOM','2026-08-03 00:00:00+00'::timestamptz,now(),'official','Current Alex patch baseline.'),
('アレックス 基本コンボ・基本連係','https://note.com/dadasuke/n/n9ade212b1831','community_guide','原田ダダスケ','2026-03-22 00:00:00+00'::timestamptz,now(),'community','Detailed written Classic combos, stance branches and oki.'),
('モダンアレックス攻略','https://www.sukoreru.com/sf6-modern-alex','community_guide','スコれる','2026-08-06 00:00:00+00'::timestamptz,now(),'community','Post-patch Modern command, combo and oki guide.'),
('アレックス初心者攻略','https://momiageryo.com/2026/05/08/sf6_alex/','community_guide','もみあげりょう','2026-05-08 00:00:00+00'::timestamptz,now(),'community','Written/image practical combos and strike-command-throw oki.'),
('INGRID バトル変更リスト 2026.08.03','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/ingrid','official_patch','CAPCOM','2026-08-03 00:00:00+00'::timestamptz,now(),'official','Current Ingrid patch baseline.'),
('イングリッド コンボ・起き攻めまとめ','https://note.com/dos236236/n/nd3f3300416b7','community_guide','ドス','2026-05-29 00:00:00+00'::timestamptz,now(),'community','Detailed Classic routes, stock levels, SA2 and oki tables.'),
('イングリッド コンボまとめ','https://takukakugamer.com/sf6-ingrid-combo/','community_guide','格ゲーブロガー拓','2026-08-09 00:00:00+00'::timestamptz,now(),'community','Post-patch written/image combo catalog.'),
('イングリッド セットプレイまとめ','https://takukakugamer.com/st6-ingrid-setup/','community_guide','格ゲーブロガー拓','2026-08-22 00:00:00+00'::timestamptz,now(),'community','Post-patch written/image setup catalog.'),
('モダンイングリッド メモ','https://note.com/emesirna/n/nfd93068da0ae','community_guide','さーな','2026-06-04 00:00:00+00'::timestamptz,now(),'community','Modern missing normals, symbol, SA2 and oki branches.'),
('YASMINE バトル変更リスト 2026.08.03','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/yasmine','official_patch','CAPCOM','2026-08-03 00:00:00+00'::timestamptz,now(),'official','Current Yasmine patch baseline.'),
('ヤスミン コンボ・起き攻めまとめ','https://note.com/dos236236/n/nf495faf8df1e','community_guide','ドス','2026-08-04 00:00:00+00'::timestamptz,now(),'community','Post-patch Classic routes, Bayani, SA2 and oki tables.'),
('モダンヤスミン コンボ・起き攻めメモ','https://note.com/emesirna/n/n054284d8a51d','community_guide','さーな','2026-08-03 00:00:00+00'::timestamptz,now(),'community','Post-patch Modern routes and enhanced branches.'),
('モダンヤスミン 実戦メモ','https://note.com/emesirna/n/n961d0dd5ae36','community_guide','さーな','2026-08-05 00:00:00+00'::timestamptz,now(),'community','Modern Assist and Pangil setup notes.'),
('Mヤスミン立ち回り・コンボ・起き攻め','https://note.com/ohaieman1274499/n/nadd81c2d5ca8','community_guide','アッシー','2026-08-06 00:00:00+00'::timestamptz,now(),'community','Modern practical routes and Assist branches.'),
('クラシックヤスミン コンボ・起き攻め','https://note.com/tigrex/n/nc9406949bc5b','community_guide','tigrex',null::timestamptz,now(),'community','Post-patch Classic normals, confirms and route notes.')
)s(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
where not exists(select 1 from sources x where x.url=s.url);

create temporary table p33_combo(char_slug text,slug text,name text,cat text,notation text,starter text,pos text,diff int,purpose text,conditions text,ck text,src text) on commit drop;
create temporary table p33_setup(char_slug text,slug text,name text,starter text,seq text,adv text,pos text,descr text,ck text,src text) on commit drop;
create temporary table p33_seq(char_slug text,slug text,name text,seq text,notes text,ck text,src text) on commit drop;

insert into p33_combo values
('sagat','sagat-y4-lights-mupper','小技中アパカ','light','2LP/2LK > 5LP > M Tiger Uppercut','light','any',2,'小技基本','刻み数と距離。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-lights-lupper','小技弱アパカ','light','2LP/2LK > 5LP > L Tiger Uppercut','light','any',2,'+32締め','端で空振り消費。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-light-nexus-might','小技ネクサスマイト','light','2LK > 5LP > L Tiger Nexus > Might','2LK','any',3,'密着+3攻め','刻み3回時は距離差。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-light-nexus-greed','小技ネクサスグリード','light','2LK > 5LP > L Tiger Nexus > Greed','2LK, standing opponent','any',3,'DR起き攻め','立ち限定。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-light-knee','小技弱ニー','light','2LK > 5LP > L Tiger Knee Crush','2LK','any',2,'運び重視','小技3回は不可候補。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-2mp-hupper','屈中P強アパカ','medium','2MP > H Tiger Uppercut','2MP','any',3,'中技基本','ヒット確認。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-2mp-cdr-carry','屈中Pラッシュ運び','drive','2MP > CDR Monolith > M Nexus > Nova > Step High > H Uppercut','2MP','midscreen',5,'端運び','Drive3。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-2mp-cdr-knee-upper','屈中Pラッシュ端到達','drive','2MP > CDR Monolith > M Nexus > Nova > H Knee > L Uppercut','2MP','near corner',5,'端到達+32','開始位置制限。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-2mp-cdr-corner-framekill','屈中P端フレーム消費','drive','2MP > CDR Monolith > M Nexus > Nova > whiff 2LP > Monolith > H Knee > M/L Uppercut','2MP','corner',5,'端火力と起き攻め','アパカ強度で+27/+34。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-2mp-cdr-charged-upper','屈中P溜めアパカ','drive','2MP > CDR 5MP > Monolith > M Shot > delayed DR Monolith > charged H Uppercut','2MP','any',5,'高火力Drive','遅らせ入力。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-5mp-ch-monolith','中P CHモノリス','counter','5MP(CH) > Monolith > H Knee > L Uppercut','5MP counter, close','any',4,'CH確認','密着限定。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-5mp-ch-shot-upper','中P CH弾ラッシュ','counter','5MP(CH) > Monolith > M Shot > DR 5MP~HP > H Uppercut','5MP counter','any',4,'運びと+28','Drive1。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-5mp-ch-safejump','中P CHニー詐欺飛び','counter','5MP(CH) > Monolith > M Shot > DR 5MP~HP > H Knee','5MP counter','any',4,'+42詐欺飛び','高度と位置。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-5mp-ch-2mp-upper','中P CH屈中P','counter','5MP(CH) > 2MP > H Uppercut','5MP counter','any',3,'距離安定','非密着用。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-5mp-pc-hk-nexus','中P PC強Kネクサス','punish','5MP(PC) > 5HK(1) > H Nexus > Nova > DR 5HK > H Uppercut','5MP punish counter','midscreen',5,'Dリバ反撃','端距離。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-5mp-pc-corner','中P PC端弾アパカ','punish','5MP(PC) > Monolith > M Shot > Step High > M Uppercut','5MP punish counter','corner',4,'端反撃','SA分岐。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-2hp-hupper','屈強P強アパカ','heavy','2HP > H Tiger Uppercut','2HP','any',3,'強攻撃基本','確認難度。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-corner-2hp-odshot','端屈強P OD弾','drive','2HP > OD Tiger Shot > Step High > M Uppercut/SA','2HP','corner',4,'端火力','OD弾ヒット数。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-sting-target','タイガースティング','heavy','5HP~HK Tiger Sting','5HP','any',2,'牽制確認','先端とニー追撃。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-step-high-pc-oki','ステハイPC起き攻め','punish','Step High(PC) > Monolith > H Knee > L Uppercut','Step High punish counter','any',4,'無敵技反撃','+34候補。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-step-high-pc-max','ステハイPC火力','punish','Step High(PC) > 5HK(2) > OD Nexus > Nova > DR Monolith > charged H Uppercut','Step High punish counter','any',5,'最大候補','起き攻めとの交換。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-step-high-pc-carry','ステハイPC端運び','punish','Step High(PC) > DR Monolith > M Nexus > Nova > H Knee > L Uppercut','Step High punish counter','midscreen',5,'端運び+32','開始位置。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-lp-pc-2mp','弱P PC屈中P','punish','LP(PC) > 2MP > H Uppercut','4F/5F punish','any',3,'小確反','先端は直接アパカ。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-lp-pc-monolith','弱P PC密着モノリス','punish','LP(PC) > Monolith > H Knee > L Uppercut','4F/5F punish, close','any',4,'密着確反','距離。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-di-central','中央DIアパカ','impact','DI(PC) > 2HP > H Uppercut','DI punish counter','midscreen',3,'中央DI','間合い。','strategy','https://www.sukoreru.com/sf6-modern-sagat'),
('sagat','sagat-y4-di-wall','端DIニーアパカ','impact','DI wall splat > 2HP > H Knee > M Uppercut','DI wall splat','corner',4,'端DI','壁高さ。','strategy','https://www.sukoreru.com/sf6-modern-sagat'),
('sagat','sagat-y4-aa-upper','アパカ対空','anti_air','L/M/H Tiger Uppercut anti-air','opponent jump','any',2,'基本対空','距離強度。','strategy','https://www.sukoreru.com/sf6-modern-sagat'),
('sagat','sagat-y4-aa-hk','立ち強K対空','anti_air','5HK anti-air > follow-up Uppercut/SA','opponent jump','any',3,'通常技対空','高度。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-sa1-route','SA1弾締め','sa','medium confirm > Nexus/Nova > Step High > SA1','medium confirm','any',4,'SA1リーサル','キャンセル段階。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-sa2-route','SA2ステハイ','sa','Monolith > M Shot > DR 5HK > CDR 5HK > Step High > SA2','medium confirm, SA2','any',5,'SA2最大候補','Drive量。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-sa3-route','SA3最大候補','sa','Monolith > M Shot > DR 5HK > CDR 5HK > CDR 5HK > H Uppercut > SA3','medium confirm, full Drive, SA3','any',5,'SA3最大候補','位置と補正。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-modern-assist-l','M弱アシスト','assist','Assist L confirm > M Uppercut','Modern Assist L','any',1,'M小技','自動確認。','modern_only','https://www.sukoreru.com/sf6-modern-sagat'),
('sagat','sagat-y4-modern-assist-m','M中アシスト','assist','Assist M > Nexus branch > Uppercut/SA','Modern Assist M','any',3,'M中技','派生選択。','modern_only','https://www.sukoreru.com/sf6-modern-sagat'),
('sagat','sagat-y4-modern-assist-h','M強アシスト','assist','Assist H > shot/DR route > automatic SA3','Modern Assist H','any',4,'M強技','ゲージ自動消費。','modern_only','https://www.sukoreru.com/sf6-modern-sagat'),
('sagat','sagat-y4-modern-aa','Mワンボタンアパカ','anti_air','one-button Tiger Uppercut anti-air','opponent jump','any',2,'M対空','簡易補正。','modern_only','https://www.sukoreru.com/sf6-modern-sagat');

insert into p33_setup values
('sagat','sagat-y4-might-plus3','マイト密着+3','Nexus > Might','throw / 5MP / shimmy / delayed low','Source +3','any','小技刻み数で距離が変わる。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-might-ch25','マイトCH+25','Might counter hit','dash(+2) > strike / throw spacing / DR high-low','Source +25','any','端ではDIも候補。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-greed-dr','グリード後ラッシュ','Nexus > Greed','DR strike / throw / shimmy','Route-specific','any','立ち限定。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-corner-greed-upper33','端グリード弱アパカ','corner Greed > L Uppercut +32~33','whiff 5LK > 5MP meaty / shimmy','Source +8 after whiff','corner','アパカ高度差。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-corner-greed-2mp','端グリード屈中P消費','corner Greed > L Uppercut','whiff 2MP > 5MP meaty > Monolith/2MP','Source +7','corner','ガード+4候補。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-lupper32','弱アパカ+32','L Uppercut +32','whiff 5MP > +8 strike/shimmy','Source +8','any','投げ距離。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-mupper27','中アパカ+27','M Uppercut +27','dash(+4) > 5MP meaty / micro-walk throw','Source +4','any','中央投げ間合い外。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-hupper27','強アパカ+27','H Uppercut +27~28','dash(+4~5) > 5MP / DR Step Low / throw by rise','Source family','any','後方受け身もラッシュ投げ候補。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-plus34-overhead','+34持続中段','L Uppercut route +34','DR 6MP(meaty) > Monolith','Source hit +9','any','持続段階。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-plus34-low','+34ラッシュ下段','L Uppercut route +34','extended DR 2MK(meaty) > combo','Source guard +2~4','any','投げ間合い差。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-plus34-di','+34ラッシュDI','L Uppercut route +34','DR Drive Impact','Meaty claim','any','ジャンプ不可主張を確認。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-plus34-whiff-low','+34弱K空振り','L Uppercut route +34','DR 2LK whiff > close +4 block/reversal bait','Source +4','any','無敵ガード候補。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-plus42-safejump','+42詐欺飛び','H Knee ender +42','forward jump attack / empty jump guard','5F safe-jump family','any','ジャンプ攻撃種類。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-plus42-overhead','+42持続中段','H Knee ender +42','whiff 2LK > 6MP(meaty)','Source meaty claim','any','ヒット確認。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-light-knee-corner21','弱ニー端+21','corner L Knee ender','whiff 2LP > M/H Shot meaty / DI / 5MK','Source +21','corner','中弾guard+9候補。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-light-knee-5mk','弱ニー立中K+3','corner L Knee ender','5MK meaty > throw / shimmy / low','Source +3','corner','バクステ反撃差。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-light-knee-2mk','弱ニー屈中K+7','corner L Knee ender','2MK meaty > 5MP last-active / shimmy','Source +7','corner','無敵ケア不可候補。','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-knee-plus','ニー先端有利','spaced M/H Knee guard','5MP / whiff-punish bait / DI return','Distance-dependent','any','持続で+2~4。','strategy','https://takukakugamer.com/sf6-sagat-setup/'),
('sagat','sagat-y4-5mk-hk-knee38','中KTC+38ニー重ね','5MK~HK +38','H Knee meaty > +4 pressure','Source +4 guard','any','ニー持続位置。','strategy','https://takukakugamer.com/sf6-sagat-setup/'),
('sagat','sagat-y4-5hp-hk-knee39','強PTC+39ニー重ね','5HP~HK +39','H Knee meaty > +5 pressure','Source +5 guard','any','先端TC。','strategy','https://takukakugamer.com/sf6-sagat-setup/'),
('sagat','sagat-y4-modern-throw','M投げ後ラッシュ','Modern forward throw','DR Assist M / low / overhead / throw','Rise-specific','any','簡易入力択。','modern_only','https://www.sukoreru.com/sf6-modern-sagat'),
('sagat','sagat-y4-modern-upper','Mアパカ後起き攻め','Modern Uppercut ender','dash Assist M / DR high-low / one-button reversal bait','Strength-specific','any','簡易補正。','modern_only','https://www.sukoreru.com/sf6-modern-sagat');

insert into p33_seq values
('sagat','sagat-y4-shot-tree','上下弾分岐','High/Low Tiger Shot > speed strength / feint rhythm / anti-jump Uppercut / DR approach','Track standing/crouching, jump and parry.','strategy','https://www.sukoreru.com/sf6-modern-sagat'),
('sagat','sagat-y4-nexus-tree','ネクサス派生','L/M/H Nexus > Might +3 / Greed standing-only / Nova launch / stop','Position, stance and resource.','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-upper-tree','アパカ締め分岐','L +32/+34 / M-H +27~28 / corner follow-up > frame-family oki','Do not merge height-dependent knockdowns.','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-knee-tree','ニー分岐','L carry / M-H meaty plus / corner Uppercut follow-up / DI and parry risk','Record tip and last-active hits.','strategy','https://takukakugamer.com/sf6-sagat-setup/'),
('sagat','sagat-y4-5mp-tree','立ち中P確認','5MP normal > light; CH > Monolith/2MP; PC > 5HK; guard > 2MP-L Shot / spacing','Confirm window and distance.','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-step-high-tree','ステハイ確認','Step High hit > 2MP; CH > Monolith; PC > 5HK/DR/max; guard +4 > strike-throw','Standing-only and spacing.','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-dr-tree','ラッシュ中下','DR > 6MP overhead / 2MK low / 5MP pressure / throw / DI','Frame-family-specific timing.','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-aa-tree','対空選択','Uppercut strength / 5HK / Step High / air-to-air / SA','Height and cross-up.','strategy','https://www.sukoreru.com/sf6-modern-sagat'),
('sagat','sagat-y4-corner-tree','端起き攻め循環','Uppercut/Knee knockdown > frame kill > 5MP meaty / throw / shimmy / shot / DI','Record both rises and reversals.','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-resource-tree','ゲージ判断','no Drive Upper/Nexus / Drive1 shot-DR / Drive3 CDR / SA1 / SA2 / SA3','Compare damage, carry and oki.','strategy','https://note.com/bonmoko_3/n/n21ed46db0cdf'),
('sagat','sagat-y4-modern-assist-tree','Mアシスト停止','Assist L/M/H > stop on block / manual Nexus ender / automatic SA','Resource automation.','modern_only','https://www.sukoreru.com/sf6-modern-sagat'),
('sagat','sagat-y4-modern-shot-tree','M弾撃ち分け','one-button/manual high-low Shot > strength / anti-air ready / DR','Missing normals and scaling.','modern_only','https://www.sukoreru.com/sf6-modern-sagat'),
('sagat','sagat-y4-modern-defense-tree','M防御選択','jump > one-button Uppercut/SA1; pressure > OD Uppercut/block; DI > return','Input scaling and invulnerability.','modern_only','https://www.sukoreru.com/sf6-modern-sagat'),
('sagat','sagat-y4-modern-resource-tree','Mゲージ分岐','Assist hit > basic / CDR / OD Nexus / automatic SA / burnout-safe','Track simple-input scaling.','modern_only','https://www.sukoreru.com/sf6-modern-sagat');

insert into p33_combo values
('c-viper','viper-y4-lights-hthunder','小技強サンダー','light','2LP xN > 5LK > H Thunder Slap > Trace','light','any',3,'小技基本','遠距離で前ステ+5。','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-5mp-2mp-saving','中Pセービング','medium','5MP > 2MP > Saving Force','5MP','any',3,'ノーDrive起き攻め','密着で前ステ+3。','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-2mp-lburn-chase','屈中P弱バニ派生','medium','2MP > L Burning Kick > Chase Knuckle','2MP','any',3,'+23締め','端持続中段。','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-2mp-odthunder','屈中P ODサンダー','drive','2MP > OD Thunder Slap','2MP','any',3,'+42詐欺飛び','Drive2。','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-2hp-seismo-airburn','屈強Pセイスモ空バニ','heavy','2HP > L Seismo Hammer > HJC H air Burning Kick > H Thunder > Trace','2HP','any',5,'主力運び','端到達で5HK追加。','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-2hp-seismo-jhp-switch','セイスモJ強P入れ替え','special','2HP > L Seismo > HJC j.HP','2HP, close','any',4,'入れ替え','+14以上候補。','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-2hp-seismo-airburn-switch','セイスモ空バニ入れ替え','special','2HP > L Seismo > HJC M air Burning Kick > H Burning Kick','2HP, close','any',5,'入れ替え+5','高度。','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-2hp-seismo-tf-switch','セイスモTF入れ替え','special','2HP > L Seismo > HJC Saving Force > dash > H Thunder > Trace','2HP, close','any',5,'入れ替え+23','入力難度。','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-2hp-seismo-odtf-sa1','セイスモODTF SA1','sa','2HP > L Seismo > HJC OD Saving Force > dash > 5HK > SA1','2HP, close','any',5,'入れ替えSA1','+22候補。','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-air-mp-burn-sa2','空対空SA2','anti_air','j.MP > H air Burning Kick > OD Burning Kick > SA2','air-to-air','any',5,'空対空高火力','高度でOD省略。','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-dr-overhead','ラッシュ中段','drive','DR 6MP > 2MP > 5LK > H Thunder > Trace','DR 6MP','any',4,'中段始動','持続差。','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-dr-low','ラッシュ下段','drive','DR 2MK > 2HP > H Thunder Feint > 2MP > L Burning > Chase','DR 2MK','any',5,'下段始動','フェイント確認。','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-5hk-pc-seismo-sa2','強K PC SA2','punish','5HK(PC) > 2HP > M Seismo > HJC H air Burning > 5HK > SA2','5HK punish counter','any',5,'無敵反撃','距離で5HP代用。','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-5hk-pc-airburn-sa2','強K PC空バニSA2','punish','5HK(PC) > HJC j.HK > 2HP > L Seismo > H air Burning > 5HK > OD Burning > SA2','5HK punish counter','any',5,'シミー最大候補','高度。','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-di-wall','端DIセイスモSA1','impact','DI wall splat > 2HP > Seismo > HJC H air Burning > 5HK > SA1','DI wall splat','corner',5,'端DI','セイスモ強度。','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-stun-max','スタン最大候補','stun','stun > OD Saving Force max > 2HP > OD Seismo > HJC H air Burning > OD Burning > SA3','opponent stun','corner',5,'スタンSA3','Drive残量。','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-pc-feint-loop-sa3','PCフェイントループSA3','punish','2HP(PC) > H Thunder Feint loops > CDR extensions > M Thunder > SA3','2HP punish counter, full resources','any',5,'ゲージ回収最大候補','反復回数。','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-seismo-airburn-safejump','セイスモ空バニ詐欺飛び','special','L Seismo > HJC j.MP > L Burning Kick','Seismo hit','any',5,'+45詐欺飛び','中央〜端寄り。','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-seismo-dr-thunder-safejump','セイスモDR弱サンダー','special','Seismo > H Thunder Feint > DR 2HP > L Thunder','Seismo hit','any',5,'+42詐欺飛び','フェイント入力。','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-sa1-seismo-pressure','SA1セイスモ重ね','sa','confirm > SA1 > H Seismo meaty','SA1 hit','any',4,'SA1起点','+22~23。','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-modern-light-hthunder','M立弱強サンダー','light','Modern 5L x1~3 > H Thunder > Trace','Modern 5L','any',2,'M小技','Drive使用。','modern_only','https://note.com/emesirna/n/n941607718414'),
('c-viper','viper-y4-modern-low-assist','M下段アシスト弱','light','Modern 2L > Assist L x2 > Trace','Modern 2L','any',2,'M下段','連続下段派生。','modern_only','https://note.com/emesirna/n/n941607718414'),
('c-viper','viper-y4-modern-assist-m-burn','M中アシスト弱バニ','assist','Assist M > L Burning Kick > Chase','Modern Assist M','any',3,'M中技','ジャスパ時Drive節約。','modern_only','https://note.com/emesirna/n/n941607718414'),
('c-viper','viper-y4-modern-assist-m-odthunder-sa2','M中アシストSA2','sa','Assist M > OD Thunder > SA2','Modern Assist M','any',4,'M SA2約4000候補','Drive2 SA2。','modern_only','https://note.com/emesirna/n/n941607718414'),
('c-viper','viper-y4-modern-5m-thunder','M立中サンダー','medium','Modern 5M > HJC M Thunder > Trace','Modern 5M','any',4,'M中技基本','hjc入力。','modern_only','https://note.com/emesirna/n/n941607718414'),
('c-viper','viper-y4-modern-2m-odseismo','M屈中ODセイスモ','drive','Modern 2M(CH) > OD Seismo > HJC Burning > H Thunder > Trace','Modern 2M counter','any',5,'M CH火力','Drive量。','modern_only','https://note.com/emesirna/n/n941607718414'),
('c-viper','viper-y4-modern-6m-meaty','M持続中段','medium','Modern 6M(meaty) > 5L x2 > H Thunder > Trace','Modern 6M meaty','any',4,'M中段','+23始動。','modern_only','https://note.com/emesirna/n/n941607718414'),
('c-viper','viper-y4-modern-assist-h-basic','M強アシスト基本','assist','Assist H > built-in Seismo/HJC Burning > H/M Thunder > Trace','Modern Assist H','any',4,'M主力','追撃高度安定。','modern_only','https://note.com/emesirna/n/n941607718414'),
('c-viper','viper-y4-modern-assist-h-sa3','M強アシストSA3','sa','Assist H > H Thunder Feint > Assist M > OD Seismo > HJC OD Burning > OD Burning > SA3','Modern Assist H, full resources','any',5,'M最大候補','約6000候補。','modern_only','https://note.com/emesirna/n/n941607718414'),
('c-viper','viper-y4-modern-odseismo-3h','M ODセイスモ前強','drive','OD Seismo > 3H follow-up','Modern OD Seismo','any',3,'安定追撃','ノーキャンセル。','modern_only','https://note.com/emesirna/n/n941607718414'),
('c-viper','viper-y4-modern-di','Mインパクト強アシスト','impact','DI wall/PC > delayed Assist H route','DI punish/wall','any',4,'M DI','浮き高度差。','modern_only','https://note.com/emesirna/n/n941607718414'),
('c-viper','viper-y4-modern-side-switch','M端背負い入れ替え','impact','DI(PC), corner back > Assist H x3 > H Burning whiff','DI punish counter, corner back','corner',4,'M入れ替え+5','密着候補。','modern_only','https://note.com/emesirna/n/n941607718414'),
('c-viper','viper-y4-modern-stun','MスタンODセビ','stun','stun > OD Saving Force max > Assist H route','Modern, opponent stun','corner',5,'Mスタン最大候補','Drive/SA別。','modern_only','https://note.com/emesirna/n/n941607718414'),
('c-viper','viper-y4-modern-aa','Mワンボタン対空','anti_air','one-button Thunder/air Burning anti-air > follow-up','opponent jump','any',3,'M対空','技選択と補正。','modern_only','https://www.sukoreru.com/sf6-modern-viper');

insert into p33_setup values
('c-viper','viper-y4-hthunder-dash','強サンダー前ステ','H Thunder > Trace','dash(+4/+5) > strike / throw / shimmy by distance','Source +4/+5','any','その場受け身シミー不可。','strategy','https://tatsujin.blog/sf6/c-viper/setplay/'),
('c-viper','viper-y4-saving-dash','セービング前ステ','Saving Force hit','dash(+3) > throw / strike / shimmy','Source +3','any','密着始動のみ投げ間合い。','strategy','https://tatsujin.blog/sf6/c-viper/setplay/'),
('c-viper','viper-y4-saving-drhp','セービングラッシュ強P','Saving Force hit','DR 5HP last-active > 2HP hit-confirm / shimmy','Source guard +4','any','持続当て。','strategy','https://tatsujin.blog/sf6/c-viper/setplay/'),
('c-viper','viper-y4-burn-chase-walk','バニ派生歩き投げ','ground Burning > Chase','walk throw / 5MP / backstep bait','Route-specific','any','中攻撃基本締め。','strategy','https://tatsujin.blog/sf6/c-viper/setplay/'),
('c-viper','viper-y4-corner-throw-mburn','端前投げ中バニ','corner forward throw +28','M Burning meaty(+2) > throw / strike / double burn','Source +2','corner','バーニング柔道。','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-corner-throw-walk','端前投げ歩き択','corner forward throw +28','walk throw / strike / shimmy','Manual timing','corner','前ステ+7はシミー差。','strategy','https://note.com/emesirna/n/n192205d3ea1f'),
('c-viper','viper-y4-backthrow-lburn','端側後ろ投げ弱バニ','corner-side back throw +19','L Burning > Double Burn > +2 mix','Source +2','near corner','大柄6体非対応候補。','strategy','https://note.com/emesirna/n/n192205d3ea1f'),
('c-viper','viper-y4-corner-trace-framekill','端トレース弱K消費','corner H Thunder > Trace','whiff 5LK(+8~10) > 5MP meaty','Source +8~10','corner','投げ・シミー。','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-safejump42-odthunder','ODサンダー+42','2MP > OD Thunder','forward jump attack / empty jump guard','+42 safe-jump','any','先端差。','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-safejump42-drthunder','弱サンダー+42','Seismo > TF > DR 2HP > L Thunder','forward jump attack / empty jump guard','+42 safe-jump','any','ルート難度。','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-safejump45-airburn','空バニ+45','Seismo > HJC j.MP > L Burning','high jump attack / empty jump guard','+45 HJ safe-jump','any','めくり強K候補。','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-plus23-overhead','+23持続中段','L Burning > Chase +23','6MP last-active > lights > H Thunder','Source hit +4 guard -1','any','端/中央ルート別。','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-plus23-doubleburn','+23弱バニ重ね','+23 knockdown','L Burning meaty > Double Burn','DI return possible claim','any','1F無敵に弱い。','strategy','https://note.com/emesirna/n/n192205d3ea1f'),
('c-viper','viper-y4-plus25-mburn','+25中バニ重ね','+25 knockdown','M Burning meaty > Double Burn','DI return possible claim','any','持続位置。','strategy','https://note.com/emesirna/n/n192205d3ea1f'),
('c-viper','viper-y4-plus27-hburn','+27強バニ重ね','+27 knockdown','H Burning meaty > Double Burn','DI return possible claim','any','持続位置。','strategy','https://note.com/emesirna/n/n192205d3ea1f'),
('c-viper','viper-y4-sweep34','大足+34','2HK +34','dash > 5HP/DR 6MP/extended throw','Source family','any','受け身差。','strategy','https://note.com/emesirna/n/n192205d3ea1f'),
('c-viper','viper-y4-sweep-pc45','大足PC+45','2HK punish counter +45','dash x2(+3) / DR high-low / shimmy','Source +45','any','密着+3候補。','strategy','https://note.com/emesirna/n/n192205d3ea1f'),
('c-viper','viper-y4-throw-seismo','中央投げセイスモ','forward throw +28','M/H Seismo meaty or feint > anti-parry response','Source +1','midscreen','受け身と弾抜け。','strategy','https://note.com/emesirna/n/n192205d3ea1f'),
('c-viper','viper-y4-sa1-pressure','SA1後攻め','SA1 hit +22~23','H Seismo / DR 5HP-TF / +23 overhead','Source +22~23','any','強化時間中。','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-modern-trace','Mトレース後','Modern H Thunder > Trace','dash(+5) > Assist M / throw / shimmy','Source +5','any','中央シミー候補。','modern_only','https://note.com/emesirna/n/n941607718414'),
('c-viper','viper-y4-modern-burn-rps','M空バニ投げ抜け狩り','Modern micro-plus knockdown','L/air M/OD Burning > Double / landing strike','Branch-specific','any','シミー不可環境向け。','modern_only','https://note.com/emesirna/n/n192205d3ea1f'),
('c-viper','viper-y4-modern-plus23','M+23中段','Modern +23 ender','one-button 6M meaty > Assist/light confirm','Source hit +4','any','簡易入力。','modern_only','https://note.com/emesirna/n/n192205d3ea1f'),
('c-viper','viper-y4-modern-corner','M端起き攻め','Modern corner Trace/Burning ender','frame kill Assist H / throw / shimmy / one-button reversal bait','Route-specific','corner','自動SA停止。','modern_only','https://note.com/emesirna/n/n192205d3ea1f');

insert into p33_seq values
('c-viper','viper-y4-thunder-tree','サンダー派生','L/M/H/OD Thunder > Trace / feint / SA cancel / oki','Ground and air follow-up frames differ.','strategy','https://note.com/emesirna/n/n941607718414'),
('c-viper','viper-y4-seismo-tree','セイスモ分岐','Seismo > HJC air Burning / TF dash / Thunder / OD Burning-SA / side switch','Height, distance and Drive.','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-burning-tree','バニ派生','ground/air Burning > Chase / Double Burn / OD extension / SA','Meaty strength controls true gap.','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-tf-tree','セービング分岐','Saving Force tap/charge/OD > dash +3 / DR 5HP / launch / side switch','Charge level and PC.','strategy','https://tatsujin.blog/sf6/c-viper/setplay/'),
('c-viper','viper-y4-hjc-tree','ハイジャンプキャンセル','cancelable normal > HJC Thunder feint / air Burning / Seismo / SA','Record input, direction and side switch.','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-plus-family','バニ持続F管理','+23 L / +25 M / +27 H for DI-safe claim; +26/+28/+30 for +2','Do not merge active-frame families.','strategy','https://note.com/emesirna/n/n192205d3ea1f'),
('c-viper','viper-y4-sa1-tree','SA1強化運用','SA1 hit > Seismo meaty / HJC movement / TF pressure / +23 mix','Track timer and Drive savings.','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-aa-tree','対空選択','anti-air Thunder / air-to-air j.MP > Burning-SA2 / HJC movement / SA','Height and cross-up.','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-corner-tree','端攻め循環','throw/Trace/Seismo ender > frame kill 5MP / Burning / throw / shimmy / safe jump','Both rises and reversal classes.','strategy','https://tatsujin.blog/sf6/c-viper/setplay/'),
('c-viper','viper-y4-resource-tree','ゲージ判断','Saving no Drive / Thunder-Trace / OD Seismo / CDR feint loop / SA1 mode / SA2-SA3','Damage, carry and oki.','strategy','https://goziline.com/archives/64321'),
('c-viper','viper-y4-modern-assist-tree','Mアシスト停止','Assist L/M/H > stop on block / manual Thunder ender / automatic SA','No automatic hit-confirm warning.','modern_only','https://www.sukoreru.com/sf6-modern-viper'),
('c-viper','viper-y4-modern-hjc-tree','Mハイジャンプ入力','Modern normal > HJC Burning/Thunder/TF > Assist follow-up','Button overlap can cause Burning.','modern_only','https://note.com/emesirna/n/n941607718414'),
('c-viper','viper-y4-modern-defense-tree','M防御選択','jump > one-button anti-air/SA; pressure > OD response/block; DI > return','Scaling and missing normals.','modern_only','https://www.sukoreru.com/sf6-modern-viper'),
('c-viper','viper-y4-modern-resource-tree','Mゲージ分岐','Assist hit > H Thunder oki / OD Seismo / OD Burning-SA / automatic SA3','Track forced Drive use.','modern_only','https://note.com/emesirna/n/n941607718414');

insert into p33_combo values
('alex','alex-y4-lights-laxe','小技弱アックス','light','2LK/LP > LP > LP > L Flash Axe','light','any',2,'小技安全','ガード-4。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-lights-hknee','小技強エアニー','light','LP x3 > H Air Knee Smash','light','any',3,'小技火力','Drive余裕時。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-mp-maxe-stance','中P中アックス構え','medium','5MP/2MP > M Flash Axe > Breaker Stance','medium','any',3,'ノーDrive主力','+39から構え。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-holdhp-chop','最大溜め強Pフラチョ','heavy','held 5HP > Flash Chop','held 5HP','any',3,'強攻撃基本','ヒット+5。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-dr2hp-chop','ラッシュ屈強Pフラチョ','drive','DR 2HP > Flash Chop','DR 2HP','any',3,'ラッシュ確認','パワーボム分岐。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-chop-odpb-sa2','フラチョOD投げSA2','sa','Flash Chop hit > OD Power Bomb(Power Drop) > SA2 Omega Wing Buster','Flash Chop hit, close','any',5,'SA2高火力','記事5190候補。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-chop-hyperbomb-safejump','フラチョハイパーボム','special','Flash Chop > OD Power Bomb > Hyper Bomb','Flash Chop hit','any',4,'詐欺飛び締め','j.HKへ。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-chop-powerdrop-switch','フラチョパワードロップ','special','Flash Chop > OD Power Bomb > Power Drop','Flash Chop hit','any',4,'入れ替え','DR 4MP起き攻め。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-chop-oblique','フラチョオブリーク','special','Flash Chop > 4MK Oblique Stomp branch','Flash Chop hit','any',3,'位置維持','DR 4MKへ。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-hp-ch-lk-knee','強P CH強エアニー','counter','5HP(CH) > 5LK > H Air Knee Smash','5HP counter','any',3,'CH確認','先端不可。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-2hp-stance-basic','屈強P構え基本','heavy','2HP > Breaker > LP Palm > HP Lariat > LK > H Air Knee','2HP','any',5,'A定食','入力順。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-2hp-stance-carry','屈強P構え運び','heavy','2HP > Breaker > LP Palm > HK~HK Sweep > Step In > Hyper Lift/Palm/Lariat','2HP','any',5,'運び分岐','締め選択。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-shimmy-2hp','シミー屈強P','punish','2HP(PC) > Breaker > L Slash Elbow > H Air Knee','throw whiff punish','any',5,'投げ抜け狩り','下がり距離。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-shimmy-2mk','シミー屈中K','punish','2MK(PC) > 2MP > H Air Knee','throw whiff punish','any',3,'妥協反撃','距離安定。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-reversal-punish','無敵反撃A定食','punish','Flash Chop(PC) > 2HP > Breaker > LP > HP > LK > H Air Knee','blocked invincible move','midscreen',5,'無敵最大候補','SA3分岐。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-reversal-punish-corner','端無敵反撃','punish','held 5HK > held 5HP > M Flash Axe > Breaker > L Slash Elbow > M Air Knee','blocked invincible move','corner',5,'端ノーDrive','溜め時間。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-odchop-sa2-wall','ODフラチョSA2壁追撃','sa','OD Flash Chop > SA2 wall > DR 2HP/2MP > M Flash Axe > Breaker > Shoulder Launcher > H Air Knee','near wall, SA2','near corner',5,'壁SA2','拾える距離。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-air-stamp-pc','エアスタンピートPC','punish','Air Stampede(PC) > H Air Knee','stance M kick punish counter','any',3,'派生PC基本','高さ。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-air-stamp-pc-sa1','エアスタンピートPC SA1','sa','Air Stampede(PC) > DR 2HP > M Flash Axe > Breaker > M Slash Elbow > SA1','stance M kick punish counter','any',5,'SA1火力','中央。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-air-stamp-pc-corner','端エアスタンピートPC','punish','Air Stampede(PC) > DR 2HP > M Flash Axe > Breaker > M Slash Elbow > M Air Knee','stance M kick punish counter','corner',5,'端火力','SA3分岐。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-target-stance','中P強PTC構え','medium','5MP~HP > Breaker > Step In > Palm/Lariat/Hyper Lift','5MP','any',4,'TC始動','ヒット時のみ構え。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-di-central','中央DI構え','impact','DI(PC) > j.HK > held 5HP > M Flash Axe > Breaker > Step In x2','DI punish counter','midscreen',5,'中央DI','前進回数。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-di-sa2','DI SA2最大','impact','DI(PC) > DR 2HP > Flash Chop > OD Power Bomb > Power Drop > SA2','DI punish counter, SA2','any',5,'DI SA2','距離。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-cdr-mp-4k','中Pラッシュ背中K','drive','5MP > CDR 4MK > 2HP > Breaker route','5MP','any',4,'主力Drive','ガード時投げ分岐。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-cdr-2mp-4k','屈中Pラッシュ背中K','drive','2MP > CDR 4MK > 5MP > H Air Knee','2MP','any',4,'中技Drive','位置。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-max-sa3','最大リーサルSA3','sa','j.HP/HK > [2HP > CDR 4MK]xN > 2HP > Breaker > LP > HP > LK > L Flash Axe > SA3','full resources','any',5,'SA3最大候補','反復回数とDrive。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-aa-knee','エアニー対空','anti_air','L/M/H Air Knee Smash anti-air','opponent jump','any',2,'基本対空','距離で強度。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-modern-assist-l','M弱アシスト','assist','Assist L confirm > L Flash Axe/H Air Knee','Modern Assist L','any',2,'M小技','自動確認。','modern_only','https://www.sukoreru.com/sf6-modern-alex'),
('alex','alex-y4-modern-assist-m','M中アシスト','assist','Assist M > Breaker route > ender','Modern Assist M','any',4,'M中技','構え自動移行。','modern_only','https://www.sukoreru.com/sf6-modern-alex'),
('alex','alex-y4-modern-assist-h','M強アシスト','assist','Assist H > held heavy/Flash Chop > Power Bomb/automatic SA','Modern Assist H','any',4,'M強技','自動ゲージ消費。','modern_only','https://www.sukoreru.com/sf6-modern-alex'),
('alex','alex-y4-modern-onebutton-pb','Mワンボタンパワーボム','special','tick > one-button Power Bomb/OD Power Bomb','Modern command throw','any',3,'M投げ択','簡易補正と間合い。','modern_only','https://www.sukoreru.com/sf6-modern-alex'),
('alex','alex-y4-modern-aa','Mワンボタンエアニー','anti_air','one-button L Air Knee anti-air > oki','opponent jump','any',2,'M対空','距離。','modern_only','https://www.sukoreru.com/sf6-modern-alex'),
('alex','alex-y4-modern-di','M端DI','impact','DI wall > Assist H/2H > M Flash Axe > Breaker > M Air Knee','DI wall splat','corner',5,'M端DI','簡易補正。','modern_only','https://www.sukoreru.com/sf6-modern-alex'),
('alex','alex-y4-modern-sa3','M強アシストSA3','sa','Assist H > Breaker route > automatic SA3/CA','Modern Assist H, SA3','any',4,'Mリーサル','停止点。','modern_only','https://www.sukoreru.com/sf6-modern-alex');

insert into p33_setup values
('alex','alex-y4-laxe-plus3','弱アックス+3','L Flash Axe hit +3','5MP / 5LK frame trap / L-OD Power Bomb / block','Source +3','any','通常投げ間合い外。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-maxe-stance-stamp','中アックス構え中K','M Flash Axe +39','Breaker > Step In > M Air Stampede meaty','Source +39','any','遅らせで無敵ガード。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-maxe-stance-elbow','中アックス構え強肘','M Flash Axe +39','Breaker > Step In > H Slash Elbow > 2MP/2MK/2HK','Source +7 after elbow','any','遅らせ投げ間合い差。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-chop-plus5','フラチョ+5','Flash Chop hit +5','OD/L/M Power Bomb by spacing / strike / DI-SA3 cancel','Source +5','any','距離でコマ投げ空振り。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-odchop-safejump','ODフラチョ詐欺飛び','OD Flash Chop +41','forward j.HK / empty jump guard > 2MP','Source +41','any','先端ヒット不可。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-odchop-parrythrow','ODフラチョパリィ狩り','OD Flash Chop +41','forward j.HK > micro-walk Power Bomb','Source +41','any','パリィ対応。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-odknee-dash','ODエアニー前ステ','OD Air Knee +27','dash(+5) > H Power Bomb / 2HP / shimmy','Source +5','any','4F相打ち追撃。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-knee-dr','通常エアニーラッシュ','Air Knee +29','DR 5MP > strike / command throw / stance TC / shimmy','Source +29','any','その場受け身シミー不可。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-knee-corner-dash','端エアニー前ステ','corner Air Knee +29','dash(+7) > M Power Bomb / 2HP / shimmy','Source +7','corner','後ろ受け身。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-stamp-dash','エアスタンピート前ステ','Breaker M Air Stampede','dash(+6) > 5MP / timed L Power Bomb','Source +6','any','最速投げは後退に届かない。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-downthrow','下投げ構え択','Dangerous Approach','held 5HP > Chop / walk 5MP / DR Power Bomb / DR 4MK','Route-specific','any','PC DDT分岐。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-target-plus21','中P強PTC+21','5MP~HP hit +21','Breaker > Step In > Tactical Leap / Hyper Lift / Lariat / Palm','Source +21','any','分岐多。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-sa1-corner','端SA1+8','corner SA1','dash(+8) > L Power Bomb / 2HP / shimmy frame kill','Source +8','corner','空中ヒット+10~12差。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-sa2-ground','SA2地上+19','SA2 ground hit +19','held 5HP > Chop / 6MP overhead / walk 5MP','Source +19','any','壁ヒット分離。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-sa3-ca','CA後ラッシュ択','CA','DR 4MK > 2HP / DR stop shimmy / OD Power Bomb','Route-specific','any','SA3通常版は立ち回り戻り。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-forwardthrow-drhk','前投げラッシュ強K','forward throw','DR 5HK > 5MP-H Air Knee / throw / shimmy','Rise-specific','any','その場/後方で下がり差。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-corner-throw-dash','端前投げ前ステ','corner forward throw','dash(+6) > 5MP / L Power Bomb / shimmy','Source +6','corner','埋まるコマ投げ。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-backthrow-reset','後ろ投げ立ち回り','back throw','spacing reset / anti-jump / walk pressure','No direct oki','any','無理に攻めない。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-corner-downthrow','端下投げOD投げ','corner down throw','walk OD Power Bomb meaty','Manual timing','corner','Modern推奨候補。','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-oblique-plus2','オブリーク+2','Oblique Stomp guard','light frame trap / Power Bomb / backwalk / reversal bait','Source +2','any','投げ強度別。','strategy','https://momiageryo.com/2026/05/08/sf6_alex/'),
('alex','alex-y4-modern-knee','Mエアニー後','Modern Air Knee ender','dash Assist M/2H / one-button Power Bomb / shimmy','Frame-specific','any','簡易投げ。','modern_only','https://www.sukoreru.com/sf6-modern-alex'),
('alex','alex-y4-modern-stamp','M構えスタンプ','Modern Breaker > M Stampede','dash Assist M / one-button Power Bomb / reversal bait','Source +6 family','any','簡易入力。','modern_only','https://www.sukoreru.com/sf6-modern-alex'),
('alex','alex-y4-modern-throw','M端前投げ','Modern corner forward throw','dash Assist L/M / one-button Power Bomb / shimmy','Source +6','corner','自動SA停止。','modern_only','https://www.sukoreru.com/sf6-modern-alex');

insert into p33_seq values
('alex','alex-y4-flashaxe-tree','フラッシュアックス強度','L safe +3 / M +39 stance / H carry-damage / OD +41 safe jump','Hit, guard and distance.','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-chop-tree','フラッシュチョップ','hit +5 > Power Bomb branches / guard +2 pressure / SA3 DI answer','Distance can make throw whiff.','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-breaker-tree','ブレイカースタンス','entry > Step In / Palm / Lariat / Sweep / Stampede / Slash Elbow / Hyper Lift','Record cancels, gaps and side switch.','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-powerbomb-tree','パワーボム強度','L/M/H/OD > range-speed choice > Power Drop/Hyper Bomb/SA2','Jump, backwalk and 4F answers.','strategy','https://momiageryo.com/2026/05/08/sf6_alex/'),
('alex','alex-y4-knee-tree','エアニー分岐','normal +29 DR / OD +27 dash+5 / corner dash+7 / anti-air strength','Rise and distance.','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-target-tree','中P強PTC分岐','5MP~HP hit > Breaker Step In > leap / throw / Palm / Lariat; block stop','Hit-only stance cancel.','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-dr-tree','ラッシュ択','DR 4MK/5HK/5MP > 2HP combo / command throw / shimmy / frame trap','Guard and hit branches.','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-aa-tree','対空選択','Air Knee strengths / 2HP stance / air throw route / SA','Cross-up and range.','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-corner-tree','端ループ','throw/Knee/OD Chop > dash or safe jump > strike / Power Bomb / shimmy / stance','Both rises and reversal classes.','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-resource-tree','ゲージ判断','L Axe safe / H Knee damage / OD Chop safejump / CDR stance / SA2 grab / SA3 lethal','Damage versus oki.','strategy','https://note.com/dadasuke/n/n9ade212b1831'),
('alex','alex-y4-modern-assist-tree','Mアシスト停止','Assist L/M/H > stop on block / manual stance ender / automatic SA','Resource automation.','modern_only','https://www.sukoreru.com/sf6-modern-alex'),
('alex','alex-y4-modern-throw-tree','Mワンボタン投げ','micro-plus > one-button L/H/OD Power Bomb / strike / shimmy','Scaling and range.','modern_only','https://www.sukoreru.com/sf6-modern-alex'),
('alex','alex-y4-modern-defense-tree','M防御選択','jump > one-button Air Knee/SA; pressure > OD option/block; DI > return','Input advantage and scaling.','modern_only','https://www.sukoreru.com/sf6-modern-alex'),
('alex','alex-y4-modern-resource-tree','Mゲージ判断','Assist hit > basic / OD Chop / OD Power Bomb-SA2 / automatic SA3 / BO route','Track automatic spending.','modern_only','https://www.sukoreru.com/sf6-modern-alex');

insert into p33_combo values
('ingrid','ingrid-y4-lights-mrise','小技中ライズ','light','2LP x2~3 > M Sunrize','2LP','any',2,'小技基本','記事+38。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-lp-lk-mrise','弱P弱K中ライズ','light','5LP > 5LK > M Sunrize','5LP','any',2,'小技距離','記事+38。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-lk-pc-mrise','弱K PC中ライズ','punish','5LK(PC) > M Sunrize','5LK punish counter','any',2,'5F確反','記事+38。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-lk-pc-lv2flare','弱K PC Lv2フレア','punish','5LK(PC) > OD Sunflare(Lv2) > 6KKK','5LK punish counter, stock1','any',4,'ストック1反撃','記事+44。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-lk-pc-lv3flare','弱K PC Lv3フレア','punish','5LK(PC) > OD Sunflare(Lv3) > 2KKK > M Sunrize','5LK punish counter, stock2','any',5,'ストック2反撃','記事+38。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-lights-sa1','小技SA1','sa','2LP x2 > CDR LP > 5MK > CDR 2HP > H Sunrize > j.MP > SA1','light, Drive3+','any',5,'SA1リーサル','SA1 Lv別。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-lights-sa3','小技SA3','sa','2LP x2 > CDR LP > 5MK > CDR 2HP > H Sunrize > j.MP > SA3','light, full resources','any',5,'SA3リーサル','Drive量。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-mptc-mrise','中PTC中ライズ','medium','5MP~MK > M Sunrize','5MP','any',2,'中技基本','記事+38。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-mptc-cdr-lairflare','中PTC弱空フレア','drive','5MP~MK > CDR 2HP > H Sunrize > L Solar Flare','5MP','any',4,'+25締め','ストック回収。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-mptc-cdr-mairflare','中PTC中空フレア','drive','5MP~MK > CDR 2HP > H Sunrize > M Solar Flare','5MP','any',4,'+49~50締め','設置/回収分岐。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-mptc-lv2flare','中PTC Lv2フレア','special','5MP~MK > OD Sunflare(Lv2) > 6KKK','5MP, stock1','any',4,'ストック1火力','記事+44。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-mptc-lv3flare','中PTC Lv3フレア','special','5MP~MK > OD Sunflare(Lv3) > 2KKK > M Sunrize','5MP, stock2','any',5,'ストック2火力','記事+38。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-4mktc','引中KTC','medium','4MK~HP','4MK','any',2,'牽制確認','記事+44。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-4mk-pc','引中K PC','punish','4MK(PC) > 2MK > M Sunrize','4MK punish counter','any',3,'差し返し','記事+38。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-2mp-cdr','屈中Pラッシュ','drive','2MP > CDR 2HP > H Sunrize > M Solar Flare','2MP','any',4,'主力Drive','記事2623候補。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-2mk-cdr','中足ラッシュ','drive','2MK > CDR 5HK > 5MP~MK > M Sunrize','2MK','any',4,'中足基本','5HKに4F隙間。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-hk-pc','強K PC中ライズ','punish','5HK(PC) > 5MP~MK > M Sunrize','5HK punish counter','any',3,'差し返し','記事2840。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-hk-pc-lv3','強K PCストック2','punish','5HK(PC) > 5MK > OD Sunflare(Lv3) > 2KKK > M Sunrize','5HK punish counter, stock2','any',5,'ストック2火力','記事4240候補。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-2hp-lv3-mrise','屈強P Lv3ライズ','special','2HP > OD Sunflare(Lv3) > 2KKK > M Sunrize','2HP, stock2','any',5,'ストック2基本','記事3970。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-2hp-lv3-sa3','屈強P Lv3 SA3','sa','2HP > OD Sunflare(Lv3) > 2KKK > OD Sunrize > SA3','2HP, stock2, SA3','any',5,'最大候補','記事5820。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-hp-pc','強P PCラッシュ','punish','5HP(PC) > DR 2HP > H Sunrize > M Solar Flare','5HP punish counter','any',4,'強P反撃','記事+49~50。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-6hp-lv3','前強P Lv3空フレア','special','6HP > OD Solar Flare(Lv3) > 6HP > M Solar Flare','6HP, stock2','any',5,'固有ストック火力','記事+40。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-6hp-lv3-max','前強Pストック4','special','6HP > OD Solar Flare(Lv3) > 6HP > OD Solar Flare(Lv3) > DR 2HP > CDR 2HP > M Sunflare > SA3','6HP, stock4, full resources','any',5,'最大候補','記事7376/7556。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-punish-stock','無敵反撃ストック','punish','2HP(PC) > H Sunrize > OD Solar Flare(Lv2/3) > M Sunrize/SA1/SA3','blocked invincible, stock1/2','any',5,'ストック別最大','ダメージ分岐。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-aa-lrise','弱ライズ対空','anti_air','L Sunrize anti-air','opponent jump','any',2,'基本対空','記事+36以上。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-aa-airtc','空対空TC','anti_air','j.HK~HK > M Sunrize','air-to-air','any',4,'空対空火力','派生ディレイ。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-aa-4hp','対空引強PTC','anti_air','4HP~HP > 6KKK','anti-air high hit','any',4,'高め拾い','記事+44。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-di-guard','端DIガード','impact','DI wall > 4HP~HP > M Sunflare > M Sunrize','DI wall splat','corner',4,'端DI基本','記事+37。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-di-pc-safejump','DI PC詐欺飛び','impact','DI(PC) > neutral j.HP > DR 5MP~MK > M Sunrize','DI punish counter','any',4,'+42詐欺飛び','記事ルート。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-stun-basic','スタン基本','stun','L Sunflare follow-up > 6HP > OD Solar Flare(Lv3) > 4HP~HP > forward warp','opponent stun','corner',5,'+44締め','Drive残量。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-stun-sa3','スタンSA3','stun','L Sunflare follow-up > 6HP > OD Solar Flare(Lv3) > 4HP~HP > M Sunflare > H Shoot > SA3','opponent stun, stock/SA3','corner',5,'スタン最大候補','ストック段階。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-sa2-basic','SA2基本回収','sa','M/H SA2(Lv1) > medium route > L Sunflare > H Sunrize > OD Solar Flare > M Sunrize/SA1','SA2, low stock','any',5,'SA2攻め起点','中/強版差。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-sa2-switch','SA2入れ替え','sa','M SA2 > 5MP~MK > L Sunflare > forward jump switch > H Sunrize','SA2','any',5,'入れ替え','前ジャンプ方向。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-sa2-stock3','SA2ストック3回収','sa','M SA2(Lv1) > 5MP~MK > L Sunflare follow-up > H Sunrize > L Sunrize','SA2','any',5,'3ストック回収','記事+24。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-modern-assist-l','M弱アシスト','assist','Assist L confirm > M Sunrize','Modern Assist L','any',2,'M小技','始動屈弱P欠落。','modern_only','https://note.com/emesirna/n/nfd93068da0ae'),
('ingrid','ingrid-y4-modern-assist-m','M中アシスト','assist','Assist M > Sunflare/Sunrize symbol route','Modern Assist M','any',4,'M中技','ストック別。','modern_only','https://note.com/emesirna/n/nfd93068da0ae'),
('ingrid','ingrid-y4-modern-assist-h','M強アシスト','assist','Assist H > Air Toss > stock route > automatic SA','Modern Assist H','any',4,'M強技','自動消費。','modern_only','https://note.com/emesirna/n/nfd93068da0ae'),
('ingrid','ingrid-y4-modern-sa2','M SA2回収','sa','Modern confirm > SA2 > Assist H/5M route > L Flare > H Sunrize','Modern SA2','any',5,'Mストック回収','方向SA2。','modern_only','https://note.com/emesirna/n/nfd93068da0ae');

insert into p33_setup values
('ingrid','ingrid-y4-throw21-drhp','中央投げラッシュ強P','forward throw +21','DR 5HP meaty / 7F walk 6HP / enhanced Flare','Source rise-specific','midscreen','その場受け身限定。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-throw-shoot','中央投げ設置','forward throw +21','Sun Shoot placement > zoning reset','Source -28~-27','midscreen','後方受け身は直接攻めなし。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-corner-throw-dash','端投げ前ステ','corner forward throw +21','dash(+1) > lights / throw timing / shimmy','Source +1','corner','4Fに投げ負け。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-corner-throw-drhk','端投げラッシュ強K','corner forward throw +21','DR 5HK meaty > +2 guard / +9 hit / shimmy','Source guard +2','corner','最速投げシミー。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-corner-throw-dr2hp','端投げラッシュ屈強P','corner forward throw +21','DR 2HP meaty > +3 guard / +5 hit','Source guard +3','corner','起き上がり2F目。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-corner-throw-shoot','端投げ弱シュート','corner forward throw +21','L Sun Shoot > walk throw / strike','Source +35~36 vs block','corner','無敵ガード可否。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-backthrow','端背後ろ投げ','corner-back throw +20','dash(+0) > LP trade / shared corner options','Source +0','near corner','4F相打ち。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-sweep30','大足+30','2HK +30','dash(+10) > 5HK / DR overhead','Source family','any','中段2F目。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-sweep-pc45','大足PC+45','2HK punish counter +45','dash > whiff 2LK > 5MP last-active / shimmy','Source guard +4 hit +5','any','投げ埋まらず。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-sweep-pc-overhead','大足PC持続中段','2HK punish counter +45','dash > delayed 6MP meaty > LP-LK confirm','Source persistent hit','any','2~4Fディレイ。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-mrise38','中ライズ+38','M Sunrize +38','dash > walk throw / DR pressure','Source +38','any','2F目押し投げ。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-mrise-corner-shoot','端中ライズ弱シュート','corner M Sunrize +38','whiff LP > L Sun Shoot meaty','Source guard +3','corner','設置攻め。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-mrise-overhead','端中ライズ持続中段','corner M Sunrize +38','whiff 2LK > 6MP meaty','Source hit +5 guard -1','corner','現行値確認。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-plus37-overhead','+37持続中段','+37 knockdown','whiff 2LP > 6MP last-active','Source hit +6','any','フレーム消費。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-plus44-overhead','+44持続中段','+44 knockdown','whiff 5MP or LP~LP > 6MP last-active','Source hit +4/+5','any','二経路。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-plus50-overhead','+50持続中段','+49~50 knockdown','whiff 5MK or DR 2LK > 6MP last-active','Source hit +6','any','+49差。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-safejump42','DIルート詐欺飛び','DI PC route +42','forward jump attack / empty jump guard','+42 safe-jump','any','受け身両対応。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-flare25','弱空フレア+25','H Sunrize > L Solar Flare +25','resource action / delayed pressure / Shoot','Source +25','any','起き攻めか回収。','strategy','https://takukakugamer.com/st6-ingrid-setup/'),
('ingrid','ingrid-y4-flare50','中空フレア+50','H Sunrize > M Solar Flare +49~50','Sun symbol / placement / dash x2 strike-throw','Source +49~50','any','選択目的を分離。','strategy','https://takukakugamer.com/st6-ingrid-setup/'),
('ingrid','ingrid-y4-sa2-stock-oki','SA2回収後+24','SA2 stock-recovery ender','dash/DR pressure / Shoot / next SA2 loop','Source +24~28','any','ストック2/3回収差。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-sa2-di','SA2削りDI','SA2 active sequence','2HP/Flare strings > DI with level-specific frame kill','Level-specific','corner','BO削り。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-sa3-bo','端SA3 BO連携','corner SA3 +30, opponent BO','DR 5MK > DI > follow-up frame kill','Source gap claim','corner','SA3/CA差。','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-modern-symbol','Mシンボル回収','Modern knockdown','L Flare / Shoot / vertical L Solar > keep oki or stock','Resource choice','any','使えない溜め弱中シュート。','modern_only','https://note.com/emesirna/n/nfd93068da0ae'),
('ingrid','ingrid-y4-modern-sa2-central','M中央SA2','Modern SA2 central','5M > M Sunrize > L Flare x2 > H Sunrize > L/M Solar','Source +2~5 families','midscreen','方向SA2とLv。','modern_only','https://note.com/emesirna/n/nfd93068da0ae'),
('ingrid','ingrid-y4-modern-sa2-corner','M端SA2','Modern SA2 corner','Assist H > L Shoot > L Flare > M Flare > L Shoot meaty','Projectile cover','corner','レベル別。','modern_only','https://note.com/emesirna/n/nfd93068da0ae'),
('ingrid','ingrid-y4-modern-warp-mix','M SA2ワープ表裏','Modern SA2 novelty route','warp/frame kills > jump Assist M/H left-right','Button side-switch claim','any','撮影優先。','modern_only','https://note.com/emesirna/n/nfd93068da0ae');

insert into p33_seq values
('ingrid','ingrid-y4-symbol-cycle','シンボル循環','0 stock safe ender > L Flare/Shoot gain > Lv2/Lv3 spend > SA2 regain > oki','Track stock before and after.','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-flare-level-tree','フレアLv分岐','Lv1 no stock / Lv2 one / Lv3 two > 6KKK / 2KKK / warp / SA','Ground and air versions.','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-rise-tree','ライズ締め','M +38 oki / H launch > Solar +25 or +50 / OD-SA2 / anti-air','Damage, stock and oki.','strategy','https://takukakugamer.com/st6-ingrid-setup/'),
('ingrid','ingrid-y4-shoot-tree','サンシュート設置','tap/held/returning Shoot > stock gain / projectile cover / corner +35 / anti-jump','Strength and hold availability.','strategy','https://note.com/emesirna/n/nfd93068da0ae'),
('ingrid','ingrid-y4-warp-tree','サンバニッシュ','forward/back/down/up warp > combo extension / side switch / resource escape / frame kill','Track punish windows.','strategy','https://note.com/emesirna/n/nfd93068da0ae'),
('ingrid','ingrid-y4-sa2-tree','SA2方向・Lv分岐','M/H and Lv1-3 SA2 > damage / side switch / stock recovery / DI drain / true blockstrings','Level-specific routes must stay separate.','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-frame-family','ダウンF管理','+21 throw / +25 Solar / +30 sweep-SA3 / +37 / +38 Rise / +42 / +44 / +49~50','Do not merge frame kills.','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-dr-tree','ラッシュ択','DR 5HK / 6MP overhead / 2LK low / 2HP plus / throw / shimmy','Gap and rise behavior.','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-aa-tree','対空選択','L Rise / air target / 4HP target / Shoot-Solar control / SA1','Height and stock.','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-corner-tree','端シンボル攻め','throw/Rise/Solar > Shoot cover / meaty / throw / shimmy / DI BO route','Reversal and projectile interaction.','strategy','https://takukakugamer.com/st6-ingrid-setup/'),
('ingrid','ingrid-y4-resource-tree','ゲージ判断','no Drive M Rise / Drive2 OD Flare / Drive3 CDR / SA1 / SA2 loop / SA3 lethal','Track stock and Drive together.','strategy','https://note.com/dos236236/n/nd3f3300416b7'),
('ingrid','ingrid-y4-modern-assist-tree','Mアシスト停止','Assist L/M/H > stop on block / manual stock ender / automatic SA','Missing 2LP/5HP.','modern_only','https://note.com/emesirna/n/nfd93068da0ae'),
('ingrid','ingrid-y4-modern-symbol-tree','Mシンボル分岐','s0-s4 > Assist route / Flare level / SA2 direction / preserve or spend','Wide route matrix.','modern_only','https://note.com/emesirna/n/nfd93068da0ae'),
('ingrid','ingrid-y4-modern-shoot-tree','Mシュート分岐','one-button/manual Shoot > no held L/M / held H / return cover / stock gain','Input availability.','modern_only','https://note.com/emesirna/n/nfd93068da0ae'),
('ingrid','ingrid-y4-modern-defense-tree','M防御選択','jump > one-button Rise/SA1; projectile > veil/warp; pressure > OD Rise/block','Scaling and stock.','modern_only','https://note.com/emesirna/n/nfd93068da0ae'),
('ingrid','ingrid-y4-modern-resource-tree','Mゲージ判断','Assist hit > basic / OD Flare / SA2 recover / automatic SA3 / BO stock route','Automatic spending.','modern_only','https://note.com/emesirna/n/nfd93068da0ae');

insert into p33_combo values
('yasmine','yasmine-y4-lights-mdaloy','小技中ダロイ','light','2LP > 5LP~LP > M Daloy~Aron','light','any',2,'小技基本','記事+30。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-bayani-lights-ldaloy','バヤニ小技強化アロン','light','[Bayani] 2LP > 5LP~LP > L Daloy~enhanced Aron','light, Bayani','any',3,'+42締め','詐欺飛び。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-bayani-lights-rise','バヤニ小技昇龍','light','[Bayani] 2LP > 5LP~LP > M Daloy~enhanced Aron > M Ripa','light, Bayani','any',4,'小技火力','記事+20。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-lp-ch-hdaloy','弱P CH強ダロイ','counter','2LP(CH) > 2MP > H Daloy~Aron','2LP counter','any',3,'CH確認','記事+44。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-lp-ch-mtalim','弱P CH中タリム','counter','2LP(CH) > 2MP > M Talim','2LP counter','any',3,'密着+2','打撃投げ。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-lk-pc','弱K PC中ダロイ','punish','5LK(PC) > M Daloy~Aron','5LK punish counter','any',2,'5F確反','記事+30。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-lights-sa2','小技SA2','sa','2LP x2 > OD Daloy~Aron > SA2 > H Talim > HP > H Ripa','light, SA2','any',5,'SA2リーサル','強化締め分岐。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-lights-sa3','小技SA3','sa','2LP > 5LP~LP > OD Daloy~Aron > SA3','light, SA3','any',4,'SA3リーサル','Bayani差。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-2mp-hdaloy','屈中P強ダロイ','medium','2MP > H Daloy~Aron','2MP','any',2,'中技基本','記事+44。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-2mp-mtalim','屈中P中タリム','medium','2MP > M Talim','2MP','any',2,'+2攻め','Drive節約。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-2mp-odtalim','屈中P ODタリム','drive','2MP > OD Talim > HP > H Ripa','2MP','any',4,'運び火力','Drive2。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-2mp-odtalim-oddaloy','屈中P ODタリムOD弾','drive','2MP > OD Talim > HP > OD Daloy~Aron','2MP','any',5,'Drive火力','記事+40。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-bayani-2mp-loop','バヤニ中技ラッシュ循環','special','[Bayani] 2MP > H Daloy~Aron > DR 2MP > H Talim > HP > H Ripa','2MP, Bayani','any',5,'強化循環','記事+19。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-corner-2mp-rise','端中技弱昇龍','medium','2MP > H Daloy~Aron > L Ripa','2MP','corner',4,'端+18締め','2LP空振り+4。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-mptc','中PTC中ダロイ','medium','5MP~MP > M Daloy~Aron','5MP','any',2,'固め確認','記事+38。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-bayani-mptc','バヤニ中PTC昇龍','medium','[Bayani] 5MP~MP > M Daloy~enhanced Aron > HP > H Ripa','5MP, Bayani','any',4,'強化火力','記事+19。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-mktc','中KTC','medium','5MK~MK~HK','5MK','any',2,'TC基本','記事+33。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-sa2-mktc','SA2中KTC居合','sa','[SA2 active] 5MK~MK~HK > Linya > OD Daloy~enhanced Aron','5MK, SA2 active','any',5,'SA2強化コンボ','記事3350候補。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-2mk-cdr','中足ラッシュ','drive','2MK > CDR 2MP > 2HP > H Daloy~Aron','2MK','any',4,'中足基本','記事+44。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-2mk-cdr-talim','中足ラッシュタリム','drive','2MK > CDR HP > 2MP > M/H Talim','2MK','any',4,'起き攻め選択','+2/+37。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-jhp-hdaloy','飛び強ダロイ','heavy','j.HP > 2HP > H Daloy~Aron','j.HP','any',3,'飛び基本','記事+44。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-hp-pc','強P PC ODタリム','punish','HP(PC) > 2MP > OD Talim > HP > H Ripa','HP punish counter','any',4,'無敵反撃','記事3260。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-bayani-hp-pc','バヤニ無敵反撃','punish','[Bayani] HP(PC) > 2MP > H Daloy~Aron > DR 2MP > H Talim > HP > H Ripa','HP punish counter, Bayani','any',5,'強化最大候補','記事3639。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-pangil-punish','パンギル確反','punish','2MP(PC) > 2HP > OD L Pangil > 5LK > H Talim > HP > H Ripa','close punish counter','any',5,'設置反撃','記事3450。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-side-switch','パンギル入れ替え','punish','2MP(PC) > 2HP > OD L Pangil > 5LK > L Muka > delayed Ulan > M Ripa','close punish counter','any',5,'入れ替え','百鬼派生。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-dr-overhead','ラッシュ中段','drive','DR 6MP > 2MP > OD Talim > HP > H Ripa','DR 6MP','any',4,'中段始動','記事+21。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-dr-low','ラッシュ下段','drive','DR 2LK > 2MP > OD Talim > HP > H Ripa','DR 2LK','any',4,'下段始動','記事+21。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-di-wall','端DIタリム昇龍','impact','DI wall > 2HP > M Talim > HP > H Ripa','DI wall splat','corner',4,'端DI','記事+19。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-di-pc','DI PCタリム昇龍','impact','DI(PC) > H Talim > HP > H Ripa','DI punish counter','any',4,'DI基本','記事+19。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-di-pc-jump','DI PC飛び運び','impact','DI(PC) > j.HK > DR 2MP > H Talim > HP > H Ripa','DI punish counter','any',5,'DI運び','高さ。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-stun-basic','スタン手裏剣','stun','stun > j.HK > 2HP > L Pangil > 2LP > H Talim > HP > H Ripa','opponent stun','corner',5,'スタン基本','記事+20。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-stun-sa3','スタンSA3','stun','stun > j.HK > 2HP > L Pangil > 2LP > H Talim > HP > OD Daloy~Aron > SA3','opponent stun, SA3','corner',5,'スタンリーサル','記事4480候補。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-aa-ripa','昇龍対空','anti_air','L/M/H/OD Ripa anti-air','opponent jump','any',2,'基本対空','記事+19~23。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-modern-assist-l','M弱アシスト','assist','Assist L confirm > M Daloy~Aron','Modern Assist L','any',2,'M小技','強化分岐。','modern_only','https://note.com/emesirna/n/n054284d8a51d'),
('yasmine','yasmine-y4-modern-assist-m','M中アシストSA2','assist','Assist M complete > SA2 follow-up > enhanced state','Modern Assist M','any',4,'M主力','記事3850候補。','modern_only','https://note.com/ohaieman1274499/n/nadd81c2d5ca8'),
('yasmine','yasmine-y4-modern-assist-h','M強アシストSA3','assist','Assist H > OD route > automatic SA3','Modern Assist H','any',4,'Mリーサル','記事4320候補。','modern_only','https://note.com/ohaieman1274499/n/nadd81c2d5ca8'),
('yasmine','yasmine-y4-modern-di','Mインパクト','impact','DI wall/PC > 2H/H Talim > Assist H(2) > H Aguila','Modern DI','any',4,'M DI','端/PC差。','modern_only','https://note.com/emesirna/n/n054284d8a51d'),
('yasmine','yasmine-y4-modern-pangil','M端パンギル締め','special','corner Talim > Assist H(2) > L Pangil','Modern corner route','corner',4,'M設置起き攻め','+2候補。','modern_only','https://note.com/emesirna/n/n961d0dd5ae36');

insert into p33_setup values
('yasmine','yasmine-y4-throw29','中央投げ+29','forward throw +29','back rise DR HP; quick rise DR throw / 2MP / 6MP','Rise-specific','midscreen','歩き投げは1F不足。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-corner-throw','端投げ+29','corner forward throw +29','dash(+10) > timed throw / 5MP / DR 6MP / DR 2MP','Source +10','corner','持続2MPは投げミス注意。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-corner-throw-whiff','端投げ弱P空振り','corner forward throw +29','DR 2LP whiff > +4 spacing / reversal bait','Source +4','corner','少し離れる。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-backthrow','端背後ろ投げ','corner-back throw +24','extended DR 2MP / dash(+5) 2MK','Source +5','near corner','ラッシュ投げ1F不足。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-sweep40','大足+40','2HK +40','dash x2(+2) > strike / throw timing / shimmy','Source +2','any','両受け身。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-sweep-pc46','大足PC+46','2HK punish counter +46','dash > whiff 5LK(+9) / whiff 5MP(+11) / whiff 2LPx2(+22)','Source families','any','シミー/五分DR/持続中段。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-sweep-pc-overhead','大足PC持続中段','2HK punish counter +46','whiff 2LP x2 > 6MP last-active','Source hit +4','any','弱技追撃。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-sa3-bo','SA3端BO連携','SA3 +42, opponent BO','dash > extended DR 2MP > DI','Source 1F gap','corner','端限定。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-ca-bo','CA BO連携','CA +20, opponent BO','extended DR 2MP > DI / raw DI','Source 1F gap','corner','投げ暴れ差。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-mktc33','中KTC+33','5MK~MK~HK +33','DR 6MP last-active / DR pressure','Source hit +8','any','後方受け身投げ不可。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-2mkhk30','中足TC+30','2MK~HK +30','DR 6MP meaty / DR pressure','Source third-active','any','後方受け身投げ不可。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-ldaloy-plus1','弱ダロイ+1','L Daloy~Aron +1','2LP frame trap / throw / shimmy / low','Source +1','any','双方の投げと後退。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-mdaloy30','中ダロイ+30','M Daloy~Aron +30','dash(+11) > walk throw / neutral DR / DR 6MP','Source +30','any','中段3F目。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-hdaloy44','強ダロイ+44','H Daloy~Aron +44','dash x2(+6) > 2MP meaty / throw / shimmy','Source guard +1','any','受け身別シミー。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-hdaloy-muka','強ダロイ百鬼','H Daloy~Aron +44','L Muka~H Krog > +3 pressure','Source +3 guard','any','両受け身。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-hdaloy-pangil','強ダロイパンギル','H Daloy~Aron +44','M Pangil placement > adaptive strike/throw','Source -6','any','戻り弾時刻。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-oddaloy40','ODダロイ+40','OD Daloy~Aron +40','dash x2(+2) / j.HK vs no DP / M Pangil placement','Source +40','any','対空無敵有無。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-enhanced42-safejump','強化アロン+42','L Daloy~enhanced Aron +42','forward jump attack / empty jump guard','+42 safe-jump','any','両受け身。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-enhanced42-overhead','強化アロン持続中段','L Daloy~enhanced Aron +42','dash(+23) > 6MP last-active > LP/LK','Source hit +5','any','弱技接続。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-mtalim-plus2','中タリム+2','M Talim +2','throw / delayed shimmy / 2LK frame trap','Source +2','any','ディレイ1F投げシミー。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-htalim37','強タリム+37','H Talim +37','dash(+18) > walk throw / DR 2MP / DR DI / shimmy','Source +37','any','DR2MP guard+6候補。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-corner-pangil','端パンギル+2~5','corner HP > Pangil','throw / vertical jump punish / 2MP > L Daloy > returning Pangil','Source +2~5','corner','弾戻り時コンボ。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-corner-pangil-block','端パンギル連ガ削り','corner HP > H Pangil','2MP > L Daloy > returning Pangil > 2HP > L Daloy~enhanced Aron','True-block claim','corner','Drive約2本削り候補。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-bo-loop','BO中タリムループ','opponent burnout','[2LP > 2MP > M Talim] repeat','Mash-proof claim','any','Dリバ/SA/DI確認。','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-modern-assistm-oki','M中アシスト後','Modern Assist M complete','central DR Assist H; corner strike/throw/shimmy','Route-specific','any','強化維持。','modern_only','https://note.com/emesirna/n/n961d0dd5ae36'),
('yasmine','yasmine-y4-modern-pangil-oki','Mパンギル端択','Modern corner L Pangil ender','throw / vertical jump / 2L > H Talim under returning blade','Source +2','corner','アシスト強拾い。','modern_only','https://note.com/emesirna/n/n961d0dd5ae36');

insert into p33_seq values
('yasmine','yasmine-y4-bayani-cycle','バヤニ循環','normal state > Daloy-Aron gain > Bayani enhanced Aron/Ripa > preserve or spend > regain','Track state before and after.','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-daloy-tree','ダロイ強度分岐','L +1 / M +30 / H +44 / OD +40 / enhanced +42 > damage or oki','Do not merge knockdown families.','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-talim-tree','タリム強度分岐','M +2 strike-throw / H +37 carry / OD launch / SA2 extension','Drive and position.','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-muka-tree','ムカ派生','Muka > Krog cross-up / Ulan delay side switch / empty landing / Ripa follow-up','Left-right and anti-air response.','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-pangil-tree','パンギル設置','L/M/H/OD Pangil > throw / vertical bait / returning-blade combo / blockstring','Track outbound and return hits.','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-sa2-tree','SA2リニャ分岐','SA2 active > target Linya > OD Daloy enhanced / carry / damage / Bayani oki','Timer and hit count.','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-frame-family','ダウンF管理','+1 L Daloy / +2 M Talim-Pangil / +19 Ripa / +30 / +33 / +37 / +40 / +42 / +44 / +46','Do not merge frame kills.','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-dr-tree','ラッシュ択','DR HP / 6MP overhead / 2LK low / 2MP plus / throw / shimmy','State-specific conversions.','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-aa-tree','対空選択','Ripa strength / normal anti-air / Muka movement / SA1','Height and cross-up.','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-corner-tree','端パンギル循環','throw/Daloy/Talim > Pangil cover > strike / throw / shimmy / returning-blade confirm','Reversal and projectile interaction.','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-bo-tree','バーンアウト連携','2LP > 2MP > M Talim loop / Pangil true blocks / normal > DI from SA knockdown','Record gaps and supers.','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-resource-tree','ゲージ判断','no Drive Daloy/Talim / Drive2 OD Talim / Drive3 CDR / SA1 / SA2 mode / SA3 lethal','Bayani and Drive together.','strategy','https://note.com/dos236236/n/nf495faf8df1e'),
('yasmine','yasmine-y4-modern-assist-tree','Mアシスト停止','Assist L/M/H > stop on block / manual Bayani ender / automatic SA','Assist M SA2 support.','modern_only','https://note.com/ohaieman1274499/n/nadd81c2d5ca8'),
('yasmine','yasmine-y4-modern-bayani-tree','Mバヤニ分岐','normal/Bayani > Assist route / enhanced Aron / Aguila / Pangil setup','Track automatic state changes.','modern_only','https://note.com/emesirna/n/n054284d8a51d'),
('yasmine','yasmine-y4-modern-defense-tree','M防御選択','jump > one-button Ripa/SA1; pressure > OD Ripa/block; DI > return','Scaling and missing normals.','modern_only','https://note.com/ohaieman1274499/n/nadd81c2d5ca8'),
('yasmine','yasmine-y4-modern-resource-tree','Mゲージ判断','Assist hit > basic / OD Talim / Assist M SA2 / Assist H SA3 / BO safe route','Automatic spending and Bayani.','modern_only','https://note.com/ohaieman1274499/n/nadd81c2d5ca8');

insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,r.cat,r.notation,r.starter,r.pos,r.diff,r.purpose,r.conditions,'Written/image-only collection; current capture required.',p.id,'unverified',r.ck,'draft'
from p33_combo r join characters c on c.slug=r.char_slug cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p on conflict(slug) do nothing;

insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,'oki',r.starter,r.seq,r.adv,r.pos,r.descr,'Verify rises, 4F, jump, backdash, parry, D-reversal, DI and invincible options.',p.id,'unverified',r.ck,'draft'
from p33_setup r join characters c on c.slug=r.char_slug cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p on conflict(slug) do nothing;

insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,mash_point,throw_point,shimmy_point,jump_option,parry_option,drive_reversal_option,invincible_option,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,'pressure',r.seq,false,'record 4F gaps','record throw point','record shimmy spacing','record jump escape','record parry answer','record D-reversal','record reversal',r.notes,p.id,'unverified',r.ck,'draft'
from p33_seq r join characters c on c.slug=r.char_slug cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'combo',x.id,s.id,'supporting','Written/image claim; capture required.' from p33_combo r join combos x on x.slug=r.slug join sources s on s.url=r.src on conflict(entity_type,entity_id,source_id) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'setup',x.id,s.id,'supporting','Written/image claim; capture required.' from p33_setup r join setups x on x.slug=r.slug join sources s on s.url=r.src on conflict(entity_type,entity_id,source_id) do nothing;
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'sequence',x.id,s.id,'supporting','Written decision tree; capture required.' from p33_seq r join sequences x on x.slug=r.slug join sources s on s.url=r.src on conflict(entity_type,entity_id,source_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select e.typ,e.id,s.id,'patch_context','2026-08-03 official character baseline.'
from(
 select 'combo' typ,x.id,r.char_slug from p33_combo r join combos x on x.slug=r.slug
 union all select 'setup',x.id,r.char_slug from p33_setup r join setups x on x.slug=r.slug
 union all select 'sequence',x.id,r.char_slug from p33_seq r join sequences x on x.slug=r.slug
)e join sources s on s.url=case e.char_slug
 when 'sagat' then 'https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/sagat'
 when 'c-viper' then 'https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/cviper'
 when 'alex' then 'https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/alex'
 when 'ingrid' then 'https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/ingrid'
 when 'yasmine' then 'https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/yasmine' end
on conflict(entity_type,entity_id,source_id) do nothing;

with e as(
 select 'combo' typ,x.id,x.slug,x.name,x.notation method,x.content_kind,r.char_slug from p33_combo r join combos x on x.slug=r.slug
 union all select 'setup',x.id,x.slug,x.name,x.starter_condition||' > '||x.sequence_text,x.content_kind,r.char_slug from p33_setup r join setups x on x.slug=r.slug
 union all select 'sequence',x.id,x.slug,x.name,x.sequence_text,x.content_kind,r.char_slug from p33_seq r join sequences x on x.slug=r.slug
),p as(select id from patches where is_current=true order by released_at desc limit 1)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,'【'||c.name_ja||'撮影待ち】'||e.name,case when e.typ='combo' then 'combo_retest' when e.typ='setup' then 'oki_retest' else 'pressure_retest' end,
'文章・画像から収集した攻略の現行成立を確定する。','advanced',15,c.id,
'入力履歴・フレーム・ダメージ・Drive/SA・固有状態を表示。操作、位置、受け身、CH/PC、技強度を指定。',
'4F、ジャンプ、バクステ、パリィ、Dリバ、DI、無敵を必要時に録画。','CPU OFF。',e.method,
'左右各10回で成立、数値、位置、受け身、固有条件、簡易補正、キャラ条件を記録。',20,
'成立ならverified候補。不成立ならarchived。',p.id,'unverified',e.content_kind,'draft'
from e join characters c on c.slug=e.char_slug cross join p on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,e.typ,e.id from trainings t join(
 select 'combo' typ,x.id,x.slug from p33_combo r join combos x on x.slug=r.slug
 union all select 'setup',x.id,x.slug from p33_setup r join setups x on x.slug=r.slug
 union all select 'sequence',x.id,x.slug from p33_seq r join sequences x on x.slug=r.slug
)e on t.slug='training-'||e.slug on conflict(training_id,related_type,related_id) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Inherited from related strategy.'
from trainings t join training_relations tr on tr.training_id=t.id join entity_sources es on es.entity_type=tr.related_type and es.entity_id=tr.related_id
where t.slug in(select 'training-'||slug from p33_combo union all select 'training-'||slug from p33_setup union all select 'training-'||slug from p33_seq)
on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',case when t.name ilike '%SA2%' or t.name ilike '%SA3%' or t.name ilike '%最大%' or t.name ilike '%シンボル%' or t.name ilike '%バヤニ%' or t.name ilike '%パンギル%' then 20 when t.training_type='oki_retest' then 30 when t.training_type='combo_retest' then 35 else 45 end,
'2026-08-03版の成立、入力、数値、位置、受け身、固有状態、技強度、簡易補正、Classic/Modern差を確認。'
from trainings t where t.slug in(select 'training-'||slug from p33_combo union all select 'training-'||slug from p33_setup union all select 'training-'||slug from p33_seq)
on conflict(training_id) do nothing;

update character_content_packages p set rollout_status='complete',combo_status='complete',setup_status='complete',sequence_status='complete',training_status='complete',source_status='complete',patch_status='complete',verification_status='review',
notes=concat_ws(E'\n',nullif(p.notes,''),'2026-09-01 phase33: written/image-only Classic and Modern collection completed; character-specific states, resource and frame families separated; all draft/unverified.'),updated_at=now()
where p.character_id in(select id from characters where slug in('sagat','c-viper','alex','ingrid','yasmine'));
