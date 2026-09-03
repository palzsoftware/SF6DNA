-- Phase23: expand Chun-Li and Jamie practical Training libraries to 40+ reviewed drills.
-- All rows stay reviewed/draft. Exact game reproduction is still required before verified/published.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select '春麗 セットプレイまとめ Year4','https://takukakugamer.com/sf6-chun-li-setup/','community_guide',
       '格ゲーブログ、略してかくぶろ','2026-08-17 00:00:00+00'::timestamptz,now(),'community',
       '2026-08-17更新。Phase23 reviewed Training根拠。実機再現前にverifiedへ昇格しない。'
where not exists(select 1 from sources where url='https://takukakugamer.com/sf6-chun-li-setup/');

with ctx as (
 select (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), data(character_slug,slug,name,training_type,purpose,level,method,criteria,reps,next_step,guide_url) as (
values
-- Chun-Li +26
('chun-li','chun-lib-light-cdr-air','【コンボ】弱始動Cラッシュ空中ルート','combo','弱攻撃始動からSA回収量を意識した空中コンボへ繋ぐ','advanced','しゃがみ弱K ＞ しゃがみ弱P ＞ 立ち弱P ＞ Cラッシュ ＞ 立ち弱P ＞ 発勁(4強P) ＞ 行雲流水・天空脚 ＞ 鷹爪脚×2 ＞ 鷹嘴連拳(J強P＞J強P)。','同じ密着始動で10回中8回以上完走する。',20,'リーサル以外でDriveを使う価値を比較する','https://takukakugamer.com/sf6-chun-li-combo/'),
('chun-li','chun-lib-lp-ch-fmp-hyakuretsu','【コンボ】立ち弱P CH→追突拳→中百裂','combo','弱Pカウンターから溜め不要の妥協ルートを固定する','intermediate','立ち弱Pカウンター ＞ 追突拳 ＞ 中百裂脚。','通常ヒット/CHを混ぜ、CH時だけ20回中15回以上完走する。',30,'下溜めが作れた時は中スピバ版へ切り替える','https://takukakugamer.com/sf6-chun-li-combo/'),
('chun-li','chun-lib-lp-ch-crmk-sbk','【コンボ】立ち弱P CH→中足→中スピバ','combo','弱Pカウンターから高めのリターンを取る','advanced','立ち弱Pカウンター ＞ しゃがみ中K ＞ 中スピニングバードキック。','下溜めを先行し、CH時10回中8回以上成立させる。',30,'溜め不足時の中百裂フォローと比較する','https://takukakugamer.com/sf6-chun-li-combo/'),
('chun-li','chun-lib-crmk-cdr-air-route','【コンボ】中足Cラッシュ→天空脚空中ルート','combo','中足ラッシュからSA回収と起き攻めを重視する','advanced','しゃがみ中K ＞ Cラッシュ ＞ 発勁(4強P) ＞ 行雲流水・天空脚 ＞ 鷹爪脚 ＞ 鷹嘴連拳(J強P＞J強P)。','10回中8回以上完走し、コンボ後の有利を記録する。',20,'+46Fを作れた場合は詐欺飛びTrainingへ進む','https://takukakugamer.com/sf6-chun-li-combo/'),
('chun-li','chun-lib-crouch-only-crmk-air','【コンボ】しゃがみ食らい限定・中足空中ルート','combo','しゃがみ食らい限定の高リターンルートを使い分ける','advanced','相手しゃがみ食らい：しゃがみ中K または 追突拳 ＞ Cラッシュ立ち中P ＞ 発勁 ＞ 行雲流水・天空脚 ＞ 鷹爪脚×2 ＞ 鷹嘴連拳。','立ち/しゃがみをランダムにし、しゃがみ時だけ正しいルートを20回中15回以上選ぶ。',30,'立ち食らい用ルートと交互に反復する','https://takukakugamer.com/sf6-chun-li-combo/'),
('chun-li','chun-lib-5hp-pc-senpu-sbk','【確反】立ち強P PC→仙風→強スピバ','punish','大きな隙へ立ち強Pパニカン始動を入れる','advanced','立ち強Pパニッシュカウンター ＞ 行雲流水・仙風 ＞ 強スピニングバードキック。','無敵技など大きな隙を10回録画し8回以上完走する。',20,'SA締めが必要な場合のルートへ分岐する','https://takukakugamer.com/sf6-chun-li-combo/'),
('chun-li','chun-lib-m-hazanshu-pc','【確反】中覇山蹴PC→2中P→中スピバ','punish','中覇山蹴パニカン時の追撃を固定する','intermediate','中覇山蹴パニッシュカウンター ＞ しゃがみ中P ＞ 中スピニングバードキック。','10回中8回以上完走する。',20,'強覇山蹴PC版との始動差を覚える','https://takukakugamer.com/sf6-chun-li-combo/'),
('chun-li','chun-lib-h-hazanshu-pc','【確反】強覇山蹴PC→中足→中スピバ','punish','強覇山蹴パニカン時の追撃を固定する','intermediate','強覇山蹴パニッシュカウンター ＞ しゃがみ中K ＞ 中スピニングバードキック。','10回中8回以上完走する。',20,'距離で中足が届く条件を記録する','https://takukakugamer.com/sf6-chun-li-combo/'),
('chun-li','chun-lib-od-hazanshu-sa2-air','【コンボ】OD覇山蹴PC→SA2空中ルート','combo','OD覇山蹴弾抜けPCからSA2で伸ばす','advanced','OD覇山蹴パニッシュカウンター ＞ SA2 ＞ 前ジャンプキャンセル ＞ 降り際J中P ＞ 着地 ＞ 昇り鷹爪脚×2 ＞ 鷹嘴連拳。','10回中8回以上空中追撃を完走する。',30,'SAを使わない強天昇/弱スピバ版と比較する','https://takukakugamer.com/sf6-chun-li-combo/'),
('chun-li','chun-lib-stance-ranka-cdr','【コンボ】行雲流水・蘭華→Cラッシュ','combo','構え暴れ潰しからコンボへ変換する','advanced','行雲流水・蘭華(P派生) ＞ Cラッシュ立ち中P ＞ 発勁 ＞ 行雲流水・前突 ＞ 中スピニングバードキック。','録画4F暴れに対して成立条件を確認し、ヒット時10回中8回完走する。',30,'ガード時は確定連携と読み合いを分離する','https://takukakugamer.com/sf6-chun-li-combo/'),
('chun-li','chun-lib-stance-hp-msbk','【コンボ】構え強P→中スピバ','combo','構え中段から簡単なノーゲージ追撃を固定する','intermediate','行雲流水・強P派生 ＞ 中スピニングバードキック。','左右10回ずつ8割以上完走する。',20,'ODスピバ版へ進む','https://takukakugamer.com/sf6-chun-li-combo/'),
('chun-li','chun-lib-stance-hp-odsbk','【コンボ】構え強P→ODスピバ→弱スピバ','combo','構え中段ヒット時にDriveを使って伸ばす','advanced','行雲流水・強P派生 ＞ ODスピニングバードキック ＞ 弱スピニングバードキック。','10回中8回以上完走する。',20,'Drive残量でノーゲージ版へ切り替える','https://takukakugamer.com/sf6-chun-li-combo/'),
('chun-li','chun-lib-stance-hp-cdr-air','【コンボ】構え強P→Cラッシュ空中ルート','combo','構え中段から高火力・SA回収ルートへ繋ぐ','advanced','行雲流水・強P派生 ＞ Cラッシュ立ち中P ＞ 発勁 ＞ 行雲流水・天空脚 ＞ 鷹爪脚×2 ＞ 鷹嘴連拳。','10回中8回以上完走する。',30,'SA締めと位置入れ替えを比較する','https://takukakugamer.com/sf6-chun-li-combo/'),
('chun-li','chun-lib-od-hyakuretsu-pc','【確反】OD百裂PC→前ステ→発勁','punish','OD百裂脚PCから前ステ追撃を固定する','advanced','OD百裂脚パニッシュカウンター ＞ 前方ステップ ＞ 発勁 ＞ 行雲流水・仙風 ＞ 強天昇脚。','10回中8回以上前ステ後まで完走する。',20,'始動距離別の安定度を記録する','https://takukakugamer.com/sf6-chun-li-combo/'),
('chun-li','chun-lib-low-air-hyakuretsu-pc','【投げ読み】低空弱百裂PC→密着コンボ','combo','投げ読み低空百裂がPCした時の追撃を固定する','advanced','昇り際 弱空中百裂脚パニッシュカウンター ＞ 立ち弱P ＞ 立ち中P ＞ しゃがみ中P ＞ 中スピニングバードキック。','投げ録画へ20回試し、PC時15回以上完走する。',30,'失敗時の被反撃も記録してリスクを把握する','https://takukakugamer.com/sf6-chun-li-combo/'),
('chun-li','chun-lib-sa2-air-chain','【コンボ】SA2→ジャンプキャンセル空中追撃','combo','SA2後の代表空中追撃を安定させる','advanced','SA2 ＞ 前ジャンプキャンセル ＞ 低空J中P ＞ 着地 ＞ 昇り鷹爪脚×2 ＞ 鷹嘴連拳(J強P＞J強P)。','10回中8回以上完走する。',30,'SA1追加締めが必要な体力だけ分岐する','https://takukakugamer.com/sf6-chun-li-combo/'),
('chun-li','chun-lib-side-switch-hakkei-air','【位置入替】発勁→天空脚→鷹爪×2→遅らせJ強P','corner_combo','端背負いから空中追撃で位置を入れ替える','advanced','発勁 ＞ 行雲流水・天空脚 ＞ 鷹爪脚×2を早めに当てる ＞ 降り際J強Pを遅らせる ＞ 前方ステップで下を潜る。','端背負いで10回中8回以上位置入れ替えまで成功する。',30,'弱始動版へ進む','https://takukakugamer.com/sf6-chun-li-combo/'),
('chun-li','chun-lib-side-switch-light-cdr','【位置入替】弱始動Cラッシュ→空中入替','corner_combo','弱暴れ始動から位置入れ替えへ繋ぐ','advanced','しゃがみ弱K ＞ 立ち弱P ＞ Cラッシュ ＞ 立ち弱P ＞ 発勁 ＞ 行雲流水・天空脚 ＞ 鷹爪脚×2早め ＞ 降り際J強P遅らせ ＞ 前ステ。','端背負いで10回中8回以上位置入れ替えに成功する。',30,'Driveが少ない時は短い脱出ルートへ切り替える','https://takukakugamer.com/sf6-chun-li-combo/'),
('chun-li','chun-lib-di-clean-side-switch','【位置入替】DIクリーン→2強P→天空脚','corner_combo','DIクリーンヒットから位置入れ替えを狙う','advanced','DIクリーンヒット ＞ しゃがみ強P ＞ 行雲流水・天空脚 ＞ 鷹爪脚×2早め ＞ 降り際J強P遅らせ ＞ 前ステ。','10回中8回以上位置入れ替えまで完走する。',30,'通常ダメージ重視DIルートと比較する','https://takukakugamer.com/sf6-chun-li-combo/'),
('chun-li','chun-lib-di-clean-crane-sbk','【コンボ】DIクリーン→鶴脚落→弱スピバ','combo','DIクリーン後の状況重視短ルートを固定する','intermediate','DIクリーンヒット ＞ 鶴脚落(3強K) ＞ 弱スピニングバードキック。','10回中8回以上完走する。',20,'端背負い時の位置入替版と比較する','https://takukakugamer.com/sf6-chun-li-combo/'),
('chun-li','chun-lib-di-clean-backcorner','【位置入替】完全端背負いDI→鶴脚落','corner_combo','完全端背負いからDIクリーンで位置を入れ替える','advanced','完全端背負い：DIクリーンヒット ＞ 鶴脚落(3強K) ＞ 弱百裂脚 ＞ 強天昇脚。','端背負い固定で10回中8回以上完走し位置を確認する。',20,'Drive使用版と比較する','https://takukakugamer.com/sf6-chun-li-combo/'),
('chun-li','chun-lib-di-clean-dr-crlp','【コンボ】DIクリーン→鶴脚落→DR弱P','combo','DI後にDriveを使って運び・起き攻めを伸ばす','advanced','DIクリーンヒット ＞ 鶴脚落 ＞ パリィラッシュしゃがみ弱P ＞ 強百裂脚 ＞ 強天昇脚。','10回中8回以上完走する。',30,'ゲージ節約版と位置・火力を比較する','https://takukakugamer.com/sf6-chun-li-combo/'),
('chun-li','chun-lib-msbk-dash-oki','【起き攻め】中スピバ+34→前ステ+15','oki','中央中スピバ後の歩き投げ・打撃・シミーを整理する','intermediate','中スピニングバードキック(+34) ＞ 前ステ(+15) ＞ 歩き投げ / 歩き立ち中P / 歩き後ろ歩き。','3択を各10回、相手4F/投げ抜け/ガードへランダム再生して結果を記録する。',30,'弱/強スピバ+33版と比較する','https://takukakugamer.com/sf6-chun-li-setup/'),
('chun-li','chun-lib-sbk-dr-overhead-meaty','【持続重ね】弱/強スピバ+33→DR水蓮掌','oki_meaty','スピバ後にDR中段を持続重ねする','advanced','弱または強スピニングバードキック地上ヒット(+33) ＞ パリィラッシュ ＞ 水蓮掌(3強P)持続重ね。','トレモ表示でヒット/ガード有利を各10回確認し、4F暴れへの成立を記録する。',30,'ヒット時2MP/2MK追撃へ繋ぐ','https://takukakugamer.com/sf6-chun-li-setup/'),
('chun-li','chun-lib-corner-msbk-crmp-whiff-hakkei','【持続重ね】端中スピバ→2中P空振り→発勁','oki_meaty','端中スピバ後に発勁を持続重ねする','advanced','画面端 中スピニングバードキック(+34) ＞ しゃがみ中P空振り ＞ 発勁持続重ね。','10回中8回以上同じ有利を再現し、4F暴れ録画への結果を確認する。',30,'ガード後の継続と投げ択へ進む','https://takukakugamer.com/sf6-chun-li-setup/'),
('chun-li','chun-lib-corner-air46-safejump','【詐欺飛び】J強P連拳空中ヒット+46','safe_jump','+46F空中締めから最速前J強K詐欺飛びを再現する','advanced','鷹嘴連拳(J強P＞J強P)を高めに空中ヒット(+46) ＞ 最速前ジャンプ ＞ J強K。','OD無敵技を録画し10回中10回、重ねと着地ガードを両立できる条件を確認する。',30,'鷹爪脚→下段、遅らせジャンプ択も別途比較する','https://takukakugamer.com/sf6-chun-li-setup/'),

-- Jamie +26
('jamie','jamie-lib-close-light-arrow','【コンボ】密着2弱P→2弱K→5弱K→強張弓腿','combo','密着時に刻み回数を増やして酔い上昇へ繋ぐ','beginner','ド密着：しゃがみ弱P ＞ しゃがみ弱K ＞ 立ち弱K ＞ 強張弓腿。','左右10回ずつ8割以上完走する。',20,'通常距離では2LP×2版へ戻す','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-lib-2lp-ch-crmk-arrow','【コンボ】2弱P CH→中足→強張弓腿','combo','遠め弱Pカウンターから酔い上昇へ繋ぐ','intermediate','しゃがみ弱Pカウンター ＞ しゃがみ中K ＞ 強張弓腿。','通常/CHを混ぜ20回中15回以上CH時だけ完走する。',30,'相手暴れを読む連係から実戦確認へ進む','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-lib-5mp-2mp-arrow','【コンボ】立ち中P→2中P→強張弓腿','combo','Lv0から使える中P始動酔い上昇を固定する','beginner','立ち中P ＞ しゃがみ中P ＞ 強張弓腿。','左右10回ずつ8割以上完走する。',20,'距離が離れた場合のルートを確認する','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-lib-2mp-5lk-arrow','【コンボ】2中P→5弱K→強張弓腿','combo','2中P始動の簡単な酔い上昇を固定する','beginner','しゃがみ中P ＞ 立ち弱K ＞ 強張弓腿。','10回中8回以上完走する。',20,'CH時は中足ルートへ伸ばす','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-lib-2mp-pc-2hp-arrow','【確反】2中P PC→2強P→強張弓腿','punish','Dリバ等へのパニカン反撃を固定する','intermediate','しゃがみ中Pパニッシュカウンター ＞ しゃがみ強P ＞ 強張弓腿。','Dリバ等を10回録画し8回以上完走する。',20,'酔いLvに応じた高火力版へ進む','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-lib-5mp-ch-crmk-swagger','【コンボ】立ち中P CH→中足→弱酔疾歩','combo','中Pカウンター時に起き攻め寄りの締めを選ぶ','intermediate','立ち中Pカウンター ＞ しゃがみ中K ＞ 弱酔疾歩。','通常/CHを混ぜ20回中15回以上CH時だけ完走する。',30,'強張弓腿締めとの飲酒価値を比較する','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-lib-2mp-ch-crmk-swagger','【コンボ】2中P CH→中足→弱酔疾歩','combo','2中Pカウンター時の起き攻め重視ルートを固定する','intermediate','しゃがみ中Pカウンター ＞ しゃがみ中K ＞ 弱酔疾歩。','20回中15回以上CH確認して完走する。',30,'距離で中足が届かないケースを記録する','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-lib-lv1-light-tc-arrow','【Lv1コンボ】弱刻み→鋭鍾打→強張弓腿','combo','Lv1以上で弱攻撃からTCを使って酔いを伸ばす','intermediate','しゃがみ弱P ＞ 立ち弱K ＞ しゃがみ弱P ＞ 鋭鍾打 ＞ 強張弓腿。','Lv1固定で10回中8回以上完走する。',20,'Lv2では弱爆廻締めと比較する','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-lib-lv1-2mp-light-tc-arrow','【Lv1コンボ】2中P→弱P→鋭鍾打→強張弓腿','combo','2中P始動からLv1TCへ繋ぐ','intermediate','しゃがみ中P ＞ しゃがみ弱P ＞ 鋭鍾打 ＞ 強張弓腿。','Lv1固定で10回中8回以上完走する。',20,'ダメージとSA回収を記録する','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-lib-lv1-fhk-ch-tc-arrow','【Lv1コンボ】前強K CH→鋭鍾打→強張弓腿','combo','前強KカウンターからLv1TCで伸ばす','intermediate','前強Kカウンター ＞ 鋭鍾打 ＞ 強張弓腿。','20回中15回以上CH時のみ完走する。',30,'Lv2以上の爆廻締めへ進む','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-lib-lv1-dr-bhp-arrow','【Lv1コンボ】DR後強P→TC→強張弓腿','combo','生DR始動で酔いレベルを優先する','advanced','生ドライブラッシュ ＞ 後ろ強P ＞ 立ち弱K ＞ しゃがみ弱P ＞ 鋭鍾打 ＞ 強張弓腿。','10回中8回以上完走する。',20,'Lv4時の後強P専用ルートと混同しない','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-lib-lv1-dr-fmk-arrow','【Lv1コンボ】DR前中K→弱刻み→強張弓腿','combo','ラッシュ中段ヒットから酔い上昇へ繋ぐ','advanced','生ドライブラッシュ ＞ 前中K ＞ しゃがみ弱P ＞ 立ち弱K ＞ しゃがみ弱P ＞ 鋭鍾打 ＞ 強張弓腿。','ランダムガードで中段ヒット時だけ20回中15回以上完走する。',30,'ガード時は投げ・打撃へ切り替える','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-lib-od-divekick-arrow','【Lv1コンボ】OD無影蹴→強張弓腿','combo','OD無影蹴ヒットから酔い上昇へ繋ぐ','intermediate','OD無影蹴 ＞ 強張弓腿。','高さを変えて10回中8回以上成立する条件を記録する。',20,'端では追撃ルートと比較する','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-lib-air-mp-od-divekick','【空対空コンボ】J中P→OD無影蹴→強張弓腿','anti_air_conversion','空対空からOD無影蹴へ変換する','advanced','ジャンプ中P空中ヒット ＞ OD無影蹴 ＞ 強張弓腿。','ダミー前ジャンプ20回に15回以上空対空変換する。',30,'高さ別に失敗条件を記録する','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-lib-corner-divekick-3hp-arrow','【端コンボ】低め無影蹴→5強P3hit→弱張弓腿','corner_combo','端で低め無影蹴から起き攻め重視へ繋ぐ','advanced','画面端 低め無影蹴 ＞ 立ち強P3ヒット ＞ ノーキャンセル弱張弓腿。','高さを固定し10回中8回以上完走する。',30,'SA3がある場合の2hitルートと比較する','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-lib-corner-divekick-sa3','【端コンボ】低め無影蹴→5強P2hit→弱酔疾歩→SA3','corner_combo','端無影蹴からSA3へ繋ぐ','advanced','画面端 低め無影蹴 ＞ 立ち強P2ヒット ＞ 弱酔疾歩 ＞ SA3。','10回中8回以上SA3まで完走する。',30,'SAが不要なら弱張弓腿版を選ぶ','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-lib-lv2-2hp-bakkai','【Lv2コンボ】2強P→強爆廻','combo','Lv2以降の高ダメージノーゲージ締めを固定する','intermediate','しゃがみ強P ＞ 強爆廻。','Lv2以上固定で10回中8回以上完走する。',20,'中央では飲酒・起き攻め価値を比較する','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-lib-lv2-light-bakkai','【Lv2コンボ】弱刻み→鋭鍾打→弱爆廻','combo','Lv2以降で起き攻め重視の弱始動を固定する','intermediate','しゃがみ弱P ＞ 立ち弱K ＞ しゃがみ弱P ＞ 鋭鍾打 ＞ 弱爆廻。','Lv2以上で10回中8回以上完走する。',20,'強張弓腿との状況差を比較する','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-lib-lv2-5mp-ch-bakkai','【Lv2コンボ】立ち中P CH→2中P→弱爆廻','combo','中Pカウンターから起き攻めへ繋ぐ','intermediate','立ち中Pカウンター ＞ しゃがみ中P ＞ 弱爆廻。','20回中15回以上CH確認で完走する。',30,'酔いLv上昇優先時は張弓腿へ切り替える','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-lib-lv3-commandgrab-arrow','【Lv3コンボ】点辰→2中P→鋭鍾打→強張弓腿','command_throw_mix','コマ投げから酔いレベル上昇を優先する','intermediate','点辰 ＞ しゃがみ中P ＞ 鋭鍾打 ＞ 強張弓腿。','Lv3固定で10回中8回以上完走する。',20,'起き攻め重視弱爆廻版と比較する','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-lib-lv3-commandgrab-bakkai','【Lv3コンボ】点辰→2中P→鋭鍾打→弱爆廻','command_throw_mix','コマ投げから起き攻めを優先する','intermediate','点辰 ＞ しゃがみ中P ＞ 鋭鍾打 ＞ 弱爆廻。','10回中8回以上完走し、詐欺飛びへ移行する。',20,'飲酒優先版との状況差を記録する','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-lib-od-commandgrab-damage','【Lv3コンボ】OD点辰→2強P→Cラッシュ高火力','combo','ODコマ投げからダメージを伸ばす','advanced','OD点辰 ＞ しゃがみ強P ＞ Cラッシュ ＞ 立ち中P ＞ しゃがみ強P ＞ 強爆廻 または SA1。','Drive/SA条件を固定して10回中8回以上完走する。',30,'リーサルでなければゲージ節約版へ切り替える','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-lib-corner-commandgrab-odswag','【端Lv3コンボ】点辰→2中P→OD酔疾歩→大足TC','corner_combo','端コマ投げから酔いレベルと位置を取る','advanced','画面端 点辰 ＞ しゃがみ中P ＞ OD酔疾歩 ＞ しゃがみ強K・強K・強P。','10回中8回以上完走する。',30,'OD点辰版とゲージ効率を比較する','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-lib-lv4-5mp-swagger-punch','【Lv4コンボ】立ち中P→鋭鍾打→弱酔疾歩・疾歩仙掌','combo','Lv4限定のノーゲージ高火力を固定する','advanced','立ち中P ＞ 鋭鍾打 ＞ 弱酔疾歩・疾歩仙掌。','Lv4固定で10回中8回以上完走する。',20,'Lv4到達前は選択しない判断も確認する','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-lib-lv4-2hp-strong-swagger','【Lv4コンボ】2強P→強酔疾歩・疾歩仙掌','combo','Lv4で2強P始動の高火力を取る','advanced','しゃがみ強P ＞ 強酔疾歩・疾歩仙掌。','10回中8回以上完走する。',20,'CA締めが必要な状況へ分岐する','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-lib-sa2-light-route','【SA2】弱攻撃→絶唱魔身→中足→疾歩仙掌','combo','低酔いからSA2でLv4へ移行してコンボを完走する','advanced','しゃがみ弱P ＞ しゃがみ弱P ＞ SA2 絶唱魔身 ＞ しゃがみ中K ＞ 弱酔疾歩・疾歩仙掌。','10回中8回以上SA2後まで完走する。',30,'SA2使用価値を残体力と酔いLvで判断する','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-lib-sa2-medium-route','【SA2】中攻撃→絶唱魔身→2強P→強疾歩仙掌','combo','中攻撃始動からSA2を使う高火力を固定する','advanced','しゃがみ中P / しゃがみ中K / 鋭鍾打 ＞ SA2 ＞ しゃがみ強P ＞ 強酔疾歩・疾歩仙掌。','各始動で10回中8回以上完走する。',30,'SA2を使わない通常ルートと比較する','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-lib-corner-forward-throw-dash','【端起き攻め】前投げ→前ステ+4','oki','端前投げ後の柔道と打撃を固定する','beginner','画面端 前投げ ＞ 前方ステップ(+4) ＞ 投げ / しゃがみ中P / シミー。','各択10回、相手4F/投げ抜け/ジャンプへの結果を記録する。',30,'前投げ派生+7版へ進む','https://takukakugamer.com/sf6-jamie-setup/'),
('jamie','jamie-lib-weak-swagger-plus39-meaty','【持続重ね】弱酔疾歩+39→5中K空振り→5中P','oki_meaty','弱酔疾歩後に時間消費して立ち中Pを持続重ねする','advanced','弱酔疾歩(+39) ＞ 立ち中K空振り ＞ 立ち中P持続重ね。','トレモ表示でヒット/ガード有利を各10回確認し、4F暴れへの成立を記録する。',30,'投げ/シミーと組み合わせる','https://takukakugamer.com/sf6-jamie-setup/')
)
insert into trainings(
 slug,name,training_type,purpose,level,duration_minutes,player_character_id,
 recording_instructions,playback_settings,method,success_criteria,recommended_reps,next_step,
 valid_from_patch_id,verification_status,content_kind,status
)
select d.slug,d.name,d.training_type,d.purpose,d.level,10,c.id,
 case when d.training_type in ('oki','oki_meaty','safe_jump','punish','command_throw_mix','anti_air_conversion') then '相手側に4F・投げ・無敵技・受け身等を必要に応じて録画する。' else null end,
 case when d.training_type in ('oki','oki_meaty','safe_jump','command_throw_mix') then '防御行動をランダム再生し、確定と読み合いを区別する。' else null end,
 d.method,d.criteria,d.reps,d.next_step,ctx.patch_id,'reviewed','training','draft'
from data d join characters c on c.slug=d.character_slug cross join ctx
on conflict(slug) do nothing;

-- Link each new drill to its dedicated current guide + CAPCOM current patch + CAPCOM frame page.
with maps(character_slug,combo_url,setup_url,patch_url,frame_url) as (
values
('chun-li','https://takukakugamer.com/sf6-chun-li-combo/','https://takukakugamer.com/sf6-chun-li-setup/','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/chunli','https://www.streetfighter.com/6/ja-jp/character/chunli/frame'),
('jamie','https://takukakugamer.com/sf6-jamie-combo/','https://takukakugamer.com/sf6-jamie-setup/','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/jamie','https://www.streetfighter.com/6/ja-jp/character/jamie/frame')
), selected as (
 select tr.id,tr.slug,tr.training_type,c.slug character_slug
 from trainings tr join characters c on c.id=tr.player_character_id
 where tr.slug like 'chun-lib-%' or tr.slug like 'jamie-lib-%'
)
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',x.id,s.id,'supporting','Phase23 current practical Training evidence'
from selected x join maps m on m.character_slug=x.character_slug
join sources s on s.url in (
 case when x.training_type in ('oki','oki_meaty','safe_jump','setup','pressure') then m.setup_url else m.combo_url end,
 m.patch_url,m.frame_url
)
on conflict(entity_type,entity_id,source_id) do nothing;