-- Re-audit expansion for Blanka, Dhalsim and E. Honda.
-- Concrete written/image routes only; no video-derived claims.

create temporary table p25f_combo(
  cslug text, slug text, name text, typ text, notation text, starter text,
  pos text, diff int, purpose text, conditions text, src text
) on commit drop;

insert into p25f_combo values
-- Blanka: light, rush, punish, wall, stun and Modern branches.
('blanka','blanka-2lk-light-ball','小足弱バチカ締め','basic','2LK > 2LP > 2LP > Lバーチカルローリング','2LK','any',2,'小足確認と起き攻め','Source +33 claim; current capture required.','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-2lk-medium-ball','小足中ロリ締め','basic','2LK > 2LP > 2LP > Mローリングアタック','2LK','any',2,'小足確認と運び','Source +14 claim; current capture required.','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-corner-light-od-thunder','端小技OD電撃ODバチカ','corner','2LK > 2LP > ODエレクトリックサンダー > ODバーチカルローリング','2LK','corner',4,'端小技火力','Drive 4; corner only.','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-4mk-thunder','4中K電撃締め','basic','4MK > 5MK > エレクトリックサンダー','4MK','any',2,'近距離確認','Standing/crouching consistency required.','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-4mk-od-airball','4中KODロリエアロリ','drive','4MK > 2MK > ODローリングアタック > j.MP > Hエアローリング','4MK','any',4,'運びと状況','Source +20 claim.','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-4mk-od-vertical','4中KODロリ中バチカ','drive','4MK > 2MK > ODローリングアタック > Mバーチカルローリング','4MK','any',4,'起き攻め移行','Source +48 claim.','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-6mk-light-ball','前中K小技弱バチカ','basic','6MK > 2LP > 2LP > Lバーチカルローリング','6MK','any',3,'前進技確認','Spacing dependent.','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-dr-5lk-thunder','DR弱K中K電撃','drive_rush','DR 5LK > 5MK > エレクトリックサンダー','DR 5LK','any',3,'DR小技確認','Drive Rush starter.','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-dr-5lk-pc-lift','DR弱Kカウンターリフト','punish_counter','DR 5LK(CH/PC) > 5HP > フィアーダウン > ワイルドリフト > ender','DR 5LK CH/PC','any',4,'暴れ潰し追撃','Counter state required.','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-dr-4mk-lift','DR4中Kリフト','drive_rush','DR 4MK > 5HP > フィアーダウン > ワイルドリフト > ender','DR 4MK','any',4,'中距離DR火力','Range check required.','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-dr-5hk-lift','DR強Kリフト','drive_rush','DR 5HK > 5HP > フィアーダウン > ワイルドリフト > ender','DR 5HK','any',4,'DR大技火力','Hit-confirm required.','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-cdr-2mp-3hp','中Pラッシュ3強P締め','drive_rush','2MP > CDR 5HK > 5HP > フィアーダウン > ワイルドリフト > 3HP','2MP','any',4,'位置入れ替え候補','Ender position must be captured.','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-cdr-2mp-sa1','中PラッシュSA1','super','2MP > CDR 5HK > 5HP > フィアーダウン > ワイルドリフト > SA1','2MP','any',4,'SA1火力','Drive 3 + SA1.','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-cdr-2mp-sa3','中PラッシュSA3','super','2MP > CDR 5HK > 5HP > フィアーダウン > ワイルドリフト > Mローリング > SA3','2MP','any',5,'リーサル','Drive 3 + SA3.','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-di-wall-od-vertical','DI壁ODロリ強バチカ','wall_splat','DI wall splat > 5HP > ODローリングアタック > Hバーチカルローリング > ODバーチカルローリング / SA1','DI wall splat','corner',5,'端DI火力','Ender branch and gauge must be recorded.','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-di-wall-sa3','DI壁強ロリSA3','wall_splat','DI wall splat > 5HP > Hローリングアタック > SA3','DI wall splat','corner',4,'端DIリーサル','SA3 cancel timing required.','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-5hk-pc-od-airball','強KPC ODロリエアロリ','punish_counter','5HK(PC) > 5HP > ODローリングアタック > j.MP > Hエアローリング','5HK punish counter','any',5,'無敵反撃と運び','Punish Counter only.','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-modern-assist-l-cdr','モダン弱アシストDR電撃','modern_only','Assist L x2 > CDR Assist L > 6M > Assist L > エレクトリックサンダー','Modern Assist L','any',3,'モダン小技火力','Drive 3; exact assist mapping capture.','https://kamigame.jp/streetfighter6/page/309118534259105537.html'),
('blanka','blanka-modern-assist-m-sa3','モダン中アシストSA3','modern_only','Assist M x3 > ODバックステップローリング > SA3','Modern Assist M','any',4,'モダンリーサル','Drive 4 + SA3 claim.','https://kamigame.jp/streetfighter6/page/309118534259105537.html'),
('blanka','blanka-modern-punish-max','モダン最大反撃','modern_only','H(PC) > Assist H > CDR H > Assist H > CDR H > Assist H x2 > Mローリング > SA3','Modern H punish counter','any',5,'モダン最大候補','Drive 6 + SA3; current capture required.','https://kamigame.jp/streetfighter6/page/309118534259105537.html'),

-- Dhalsim: close confirms, rush, corner, anti-air, DI and Modern branches.
('dhalsim','dhalsim-lp-od-fire','小技ODファイア','drive','5LP > 2LP > ODヨガファイア','5LP','any',2,'小技攻め継続','Drive 2.','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-lp-hblast','小技強ブラスト','basic','5LP > 2LP > Hヨガブラスト','5LP','any',2,'小技ノーゲージ','Range check required.','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-lp-dr-hblast','小技DR強ブラスト','drive_rush','5LP > 2LP > CDR 2LP > 4MP > Hヨガブラスト','5LP','any',4,'小技火力','Drive 3.','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-lk-dr-flame','弱KDR中フレイム','drive_rush','5LK > CDR 2LP > 4MK > Mヨガフレイム','5LK','any',3,'下段近距離確認','Drive 3.','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-1hp-hflame','近距離1強P強フレイム','basic','1HP(close) > Hヨガフレイム','1HP close','any',3,'大技確認','Close range only.','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-1hp-dr-flame','1強Pラッシュ中フレイム','drive_rush','1HP > CDR 1HP > 4MK > Mヨガフレイム','1HP','any',4,'大技DR火力','Spacing dependent.','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-2mp-dr-hflame','しゃがみ中Pラッシュ強フレイム','drive_rush','2MP > CDR 4MK > Hヨガフレイム','2MP','any',4,'差し返し火力','Drive 3.','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-2mp-dr-double-mk','しゃがみ中Pラッシュ中K二段','drive_rush','2MP > CDR 4MK > 4MK > Mヨガフレイム','2MP','any',4,'差し返し運び','Distance and crouch state required.','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-dr-slide-flame','DR中スラ中フレイム','drive_rush','DR 2MK(tip) > 4MK > Mヨガフレイム','DR 2MK tip','any',3,'遠距離DR差し込み','Tip spacing required.','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-dr-slide-odfire','DR中スラ小技ODファイア','drive_rush','DR 2MK > 5LP > 2LP > ODヨガファイア','DR 2MK','any',4,'近距離継続','Drive 3+2.','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-corner-odfire-hk','端ODファイア1強K','corner','ODヨガファイア > 1HK','OD fire hit','corner',3,'端追撃','Corner only.','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-corner-hblast-hk','端強ブラスト1強K','corner','Hヨガブラスト > 1HK','H blast hit','corner',3,'端追撃','Corner only.','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-corner-arch-odblast','端アーチODブラスト','corner','4MK > Hヨガアーチ > 5LP > 2LP > ODヨガブラスト > 1HK','4MK','corner',5,'端設置弾コンボ','Arch timing required.','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-aa-4hp-sa1','4強P対空SA1','anti_air','4HP(CH) > DR 4MP > Mヨガブラスト > SA1','anti-air 4HP CH','any',5,'対空SA1','Counter-hit height required.','https://note.com/nikotarosun/n/n4de225c4e4a9'),
('dhalsim','dhalsim-aa-4hp-sa3','4強P対空SA3','anti_air','4HP(CH) > DR 4MP > Mヨガフレイム > SA3','anti-air 4HP CH','any',5,'対空SA3','Counter-hit height required.','https://note.com/nikotarosun/n/n4de225c4e4a9'),
('dhalsim','dhalsim-aa-dr-mp-sa1','DR中P対空SA1','anti_air','DR 4MP > Mヨガブラスト > DR 4MP > Mヨガブラスト > L SA1','anti-air DR 4MP','any',5,'対空高火力','Height and SA strength required.','https://note.com/nikotarosun/n/n4de225c4e4a9'),
('dhalsim','dhalsim-jmp-headbutt-sa1','J中P頭突きSA1','anti_air','j.MP > ヨガマミー > M SA1','air-to-air j.MP','any',4,'空対空SA1','Air height required.','https://note.com/nikotarosun/n/n4de225c4e4a9'),
('dhalsim','dhalsim-wall-di-hflame','DI壁1強P強フレイム','wall_splat','DI wall splat > 1HP > Hヨガフレイム','DI wall splat','corner',3,'端DI反撃','Wall splat only.','https://note.com/kuwana_fgc/n/ncf7a73b03a7f'),
('dhalsim','dhalsim-modern-assist-sa2','モダン中アシストSA2','modern_only','Assist M x2 > ODヨガフレイム > SA2','Modern Assist M','any',3,'モダンSA2','Drive 2 + SA2.','https://note.com/kuwana_fgc/n/ncf7a73b03a7f'),
('dhalsim','dhalsim-modern-assist-sa3','モダン中アシストSA3','modern_only','Assist M x2 > ODヨガフレイム > close SA3','Modern Assist M close','any',4,'モダンSA3','Close range required.','https://note.com/kuwana_fgc/n/ncf7a73b03a7f'),

-- E. Honda: current 2026.08 enders, DI, anti-air, stun and Modern branches.
('e-honda','honda-cannon-hheadbutt','大砲強頭突き締め','basic','5HP > 相撲ステップ > 大砲 > Hスーパー頭突き','5HP','any',3,'頭突き後起き攻め','Source +45 claim.','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-corner-cannon-stomp-headbutt','端大砲四股頭突き','corner','5HP > 相撲ステップ > 大砲 > 四股 > Hスーパー頭突き','5HP','corner',4,'端火力と詐欺飛び','Source +42 claim.','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-corner-cannon-stomp-mheadbutt','端大砲四股中頭突き','corner','5HP > 相撲ステップ > 大砲 > 四股 > Mスーパー頭突き','5HP','corner',4,'端持続重ね','Source +43 claim.','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-cannon-dr-mp-stomp','大砲DR中P四股TC','drive_rush','5HP > 相撲ステップ > 大砲 > DR 5MP > 四股 target combo','5HP','any',4,'運びと肩屋入り','Source +13 claim.','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-cannon-teppo-sa1','大砲鉄砲SA1','super','5MP > CDR 5MP > 5HP > 大砲 > DR 5HP > 鉄砲 > SA1','5MP','any',5,'SA1リーサル','Source 3854 claim.','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-stock-max-sa3','肩屋入り最大SA3','super','大砲 > DR 5HP > CDR 四股 > DR 5HK > CDR 四股 > 猫騙し > 強化M張り手 > H頭突き > SA3','launcher with shoulder stock','any',5,'最大リーサル候補','Source 6000 claim; Drive 6 + stock + SA3.','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-di-pc-cannon-butt','DIパニカン大砲百貫','punish_counter','DI(PC) > 5HP > 相撲ステップ > 大砲 > H百貫','DI punish counter','any',3,'DI基本反撃','Source 3080 claim.','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-di-pc-od-cannon-sa1','DIパニカンOD大砲SA1','punish_counter','DI(PC) > 5HP > OD大砲 > 5HK > 鉄砲(high) > SA1','DI punish counter','any',5,'DI高火力','Source 3820 claim.','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-di-stock-hands-sa3','DI肩屋入り張り手SA3','punish_counter','DI(PC) > 5HP > OD大砲 > 5HK > 猫騙し > 強化H張り手 > M頭突き > SA3','DI punish counter with shoulder stock','any',5,'DI最大候補','Source 5700 claim.','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-di-wall-cannon-stomp','端DI大砲四股頭突き','wall_splat','DI(PC/wall) > 5HP(or 5HK) > 大砲 > 四股 > H頭突き','DI wall splat','corner',4,'端DI起き攻め','Source 3320/+42 claim.','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-di-wall-hands-odhead','端DI張り手OD頭突き','wall_splat','DI wall splat > crumple > 5HK > H張り手 > OD頭突き','DI wall splat','corner',4,'端DIダメージ','Source 3400/+36 claim.','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-di-switch-throw','DIパニカン後ろ投げ入れ替え','side_switch','DI(PC) > back throw','DI punish counter','any',2,'位置入れ替え','Source 1680/+24 claim.','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-di-switch-stomp','DIパニカン四股入れ替え','side_switch','DI(PC) > 四股','DI punish counter','any',3,'位置入れ替え詐欺飛び','Source 1600/+59 claim.','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-air-pc-cannon-butt','空中PC強P大砲百貫','anti_air','5HP air punish counter > 相撲ステップ > 大砲 > H百貫','air 5HP punish counter','any',5,'空中反撃','Source 3000 claim.','https://note.com/denndenn/n/nc96680b2ff78'),
('e-honda','honda-dr-hp-aa-sa3','DR強P対空SA3','anti_air','DR 5HP anti-air > SA3','anti-air DR 5HP','any',3,'対空SA3','Source 4100 claim.','https://note.com/denndenn/n/nc96680b2ff78'),
('e-honda','honda-dr-hp-aa-cannon','DR強P対空大砲百貫','anti_air','DR 5HP anti-air > 相撲ステップ > 大砲 > H百貫','anti-air DR 5HP','any',5,'対空起き攻め','Source 2820 claim.','https://note.com/denndenn/n/nc96680b2ff78'),
('e-honda','honda-stun-gain-sa2','端スタンSA2ゲージ回収','stun','corner stun > 肩屋入り > j.HK > 5HP > 猫騙し > OD強化張り手 > 5LK > 猫騙し > 5LP > CDR 2LP > 2MP > 猫騙し > 5LP > CDR 5LP > 2MP > 猫騙し > 連ね張り手 > SA2','corner stun','corner',5,'SAゲージ回収とSA2','Large-body route differs.','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-stun-odhands-sa3','端スタンOD張り手SA3','stun','corner stun > 肩屋入り > j.HP > 5HP > OD大砲 > OD強化張り手 > OD張り手 > M頭突き > SA3','corner stun','corner',5,'スタン最大候補','Source 5835 claim.','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-modern-light-teppo','モダン小技TC鉄砲','modern_only','5L > target combo > 鉄砲 first hit','Modern 5L','any',3,'モダン詐欺飛び締め','Exact target combo input capture.','https://note.com/namayuki7/n/ndf95c894f805'),
('e-honda','honda-modern-2l-cdr-max','モダン小技DR大砲','modern_only','2L x2 > CDR 2L > Assist H > CDR M > H > 相撲ステップ > 大砲 > H百貫','Modern 2L','any',5,'モダン小技最大候補','Drive 6; exact assist mapping capture.','https://kamigame.jp/streetfighter6/page/349685318493964984.html');

insert into combos(character_id,slug,name,combo_type,notation,starter_text,position,difficulty,purpose,conditions,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,r.typ,r.notation,r.starter,r.pos,r.diff,r.purpose,r.conditions,
       'Written/image-confirmed claim; no video playback. Current capture required.',
       p.id,'unverified',case when r.typ='modern_only' then 'modern_only' else 'strategy' end,'draft'
from p25f_combo r join characters c on c.slug=r.cslug
cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'combo',x.id,s.id,'supporting','Written/image claim; current capture required.'
from p25f_combo r join combos x on x.slug=r.slug join sources s on s.url=r.src
on conflict(entity_type,entity_id,source_id) do nothing;

create temporary table p25f_setup(
  cslug text, slug text, name text, typ text, starter text, seq text,
  adv text, pos text, descr text, src text
) on commit drop;

insert into p25f_setup values
-- Blanka setup branches.
('blanka','blanka-oki-thunder-dr4mk','電撃後DR4中K','meaty','エレクトリックサンダー +39','dash > DR 4MK','Source timing claim','any','持続打撃重ね。','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-oki-thunder-dr2mk','電撃後DR下段','meaty','エレクトリックサンダー +39','dash > DR 2MK meaty','Source timing claim','any','下段持続重ね。','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-oki-thunder-throw','電撃後DR投げ','throw_oki','エレクトリックサンダー +39','dash > DR > throw / shimmy','Source timing claim','any','DR打撃対の投げ。','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-oki-lvertical-low','弱バチカ後下段','oki','Lバーチカルローリング +33','サプライズフォワード > 2MK > エレクトリックサンダー','Source timing claim','any','前進後の下段。','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-oki-lvertical-overhead','弱バチカ後中段','oki','Lバーチカルローリング +33','delayed DR 6MP > confirm','Source timing claim','any','遅らせ中段。','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-oki-lvertical-framekill','弱バチカ後中P消費','frame_kill','Lバーチカルローリング +33','corner 2MP whiff > throw / shimmy / 4MK','Source +4 claim','corner','端のフレーム消費。','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-oki-mrolling-trade','中ロリ後DR強K相打ち','trade_setup','Mローリングアタック +14','DR 5HK > trade follow-up','4F trade claim','corner','4F暴れとの相打ち追撃。','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-oki-airball-walk','強エアロリ後歩き三択','oki','Hエアローリング +20','walk throw / walk 5HP / shimmy','Source timing claim','any','歩き投げ・打撃・シミー。','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-oki-mvertical-framekill','中バチカ後中ロリ消費','frame_kill','Mバーチカルローリング +48','Mローリング whiff > 4MK / throw / shimmy','Source timing claim','any','中ロリ空振り後の三択。','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-oki-thunder-mvertical-safejump','端電撃中バチカ詐欺飛び','safe_jump','corner thunder > Mバーチカルローリング +42','forward jump attack / empty jump throw','+42 claim','corner','端の詐欺飛び。','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-oki-sa3-mroll','SA3後中ロリ消費','frame_kill','SA3 +50','Mローリング whiff > 4MK / throw / shimmy','Source timing claim','any','SA3後の三択。','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-oki-doll-guarded','人形ガード起爆択','doll','doll activation on block','strike / throw / shimmy / anti-air / re-placement','Projectile cover','corner','人形をガードさせた後の分岐。','https://note.com/long_quail5230/n/n80d8c1f42f73'),

-- Dhalsim setup branches.
('dhalsim','dhalsim-oki-mflame-fire','中フレイム後弱ファイア','fireball','Mヨガフレイム hit','Lヨガファイア > long normal / slide / anti-air','Source knockdown claim','any','弾を重ねて遠距離継続。','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-oki-mflame-drslide','中フレイム後DR中スラ','meaty','Mヨガフレイム hit','DR 2MK meaty > throw / 4MK','Source +4 hit claim','any','持続スライディング。','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-oki-hflame-teleport-strike','強フレイム後遅らせテレポ打撃','teleport','Hヨガフレイム hit','delayed air teleport > j.LK / j.HP','Source timing claim','any','テレポート打撃。','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-oki-hflame-teleport-throw','強フレイム後空テレポ投げ','teleport','Hヨガフレイム hit','air teleport > empty landing throw','Source timing claim','any','テレポ打撃対の投げ。','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-oki-hblast-teleport','強ブラスト後テレポ三択','teleport','Hヨガブラスト hit','air teleport > strike / empty throw / j.HK','Source timing claim','any','ブラスト後の三択。','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-oki-odflame-slide','ODフレイム後強スラ消費','frame_kill','ODヨガフレイム > 2HK','2LK > 4MK / j.LK drill','Source timing claim','any','スラ締め後の打撃とドリル。','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-oki-odflame-hk','ODフレイム後強K','oki','ODヨガフレイム > 5HK','Lヨガファイア / teleport offense','Source +18 claim','any','強K締めからの弾・テレポ。','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-oki-backthrow-arch','後ろ投げアーチ','throw_oki','back throw','2MP > ODヨガアーチ / 5MK spacing','Source timing claim','any','後ろ投げ後の設置弾。','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-oki-corner-mflame','端中フレイム重ね','meaty','corner Mヨガフレイム hit','Hヨガフレイム meaty / 2LK > throw / 2LK > 4MK > Hアーチ','Source +4 claim','corner','端の打撃・投げ・アーチ。','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-oki-corner-hblast','端強ブラスト1強K重ね','meaty','corner Hヨガブラスト > 1HK','Hヨガフレイム / 2MK > throw / 2MK > 4MK','Source +11 claim','corner','端ブラスト追撃後の三択。','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-oki-modern-33f-teleport','モダン33Fテレポ弱P','modern_oki','Mフレイム等 +33','fastest front air teleport > j.LP','Source hit +47/block +10 claim','any','33Fダウンからのテレポ弱P。','https://gomokugenmai.digick.jp/2025/07/01/%E3%80%90%E3%83%A2%E3%83%80%E3%83%B3%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%E3%81%AE%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E6%8A%80/'),
('dhalsim','dhalsim-oki-modern-42f-float','モダン42F浮遊強P','modern_oki','Hブラスト +42 / Hフレイム +45','yoga float > j.HP','Source hit +12/+15 block +8/+11 claims','any','42/45Fダウンからの浮遊強P。','https://gomokugenmai.digick.jp/2025/07/01/%E3%80%90%E3%83%A2%E3%83%80%E3%83%B3%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%E3%81%AE%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E6%8A%80/'),

-- E. Honda setup branches.
('e-honda','honda-oki-butt-normal-throw','百貫後通常投げ','throw_oki','H百貫 +23','2LP whiff > delayed normal throw / backwalk shimmy','Source +7 claim','any','大銀杏対の通常投げ。','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-oki-butt-hk','百貫後強K重ね','meaty','H百貫 +23','2LP whiff > 5HK > H頭突き / 張り手 / OD大砲','Source +7 claim','any','ジャンプ狩りと確認。','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-oki-butt-stomp','百貫後四股持続','meaty','H百貫 +23','四股 meaty > hit confirm / cancel H百貫','Source hit +5/block -1 claim','any','四股持続と百貫キャンセル。','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-oki-butt-dash','百貫後前ステ三択','oki','H百貫 +23','dash > light / normal throw / 大銀杏','Source +4 claim','any','同一モーションからの三択。','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-oki-butt-dr-mk','百貫後DR中K','meaty','H百貫 +23','DR 5MK > 5HK / 大銀杏 / shimmy','Source hit +11/block +4 claim','any','Dリバガード候補。','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-oki-butt-dr-stop','百貫後DR急停止','bait','H百貫 +23','DR stop > block / punish parry or invincible','Source -3 claim','any','無敵・パリィ誘い。','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-oki-headbutt-framekill','強頭突き後強P消費','frame_kill','cannon > H頭突き +45','2HP whiff > 5MP meaty','Source hit +9/block +4 claim','corner','強P空振りから中P持続。','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-oki-headbutt-backdash-stomp','強頭突き後バクステ四股','frame_kill','cannon > H頭突き +45','backdash > 四股 meaty / 四股 cancel 大銀杏','Source hit +4/block -2 claim','corner','四股持続とコマ投げ。','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-oki-corner-stomp-headbutt','端四股頭突き後中P','meaty','cannon > 四股 > H/M頭突き +42/+43','5MP meaty > 5HK / 2MP confirm / shimmy','Source hit +8/block +4 claim','corner','2026.08端主力重ね。','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-oki-teppo-dash-command','鉄砲後前ステ二回','safe_jump','鉄砲 +41','dash x2 > strike / 大銀杏','Source +3 claim','any','詐欺飛び対の地上択。','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-oki-high-teppo-dr-stomp','高め鉄砲後DR四股','trade_setup','high 鉄砲 hit','dash > DR 四股 / DR light / DR stop / DR 5LK > 大銀杏','Source +7 and trade claims','any','高め鉄砲固有の分岐。','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-oki-corner-ground-headbutt','端地上頭突き弱K消費','frame_kill','corner grounded headbutt +40','5LK whiff > 四股 meaty / dash > 大銀杏 / DI','Source +26 then +7 claims','corner','端地上頭突きのフレーム消費。','https://note.com/bonmoko_3/n/n8257f7cd418f');

insert into setups(character_id,slug,name,setup_type,starter_condition,sequence_text,frame_advantage,position,description,counter_notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,r.typ,r.starter,r.seq,r.adv,r.pos,r.descr,
       'Verify normal/back rise, 4F, jump, backdash, parry, D-reversal, DI and invincible options.',
       p.id,'unverified',case when r.typ like 'modern%' then 'modern_only' else 'strategy' end,'draft'
from p25f_setup r join characters c on c.slug=r.cslug
cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'setup',x.id,s.id,'supporting','Written/image claim; current capture required.'
from p25f_setup r join setups x on x.slug=r.slug join sources s on s.url=r.src
on conflict(entity_type,entity_id,source_id) do nothing;

create temporary table p25f_seq(cslug text,slug text,name text,seq text,notes text,src text) on commit drop;
insert into p25f_seq values
('blanka','blanka-seq-thunder-39','電撃+39分岐','エレクトリックサンダー > dash > DR 4MK / DR 2MK / DR throw / DR stop','打撃・下段・投げ・無敵誘いを別々に確認。','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-seq-lvertical-33','弱バチカ+33分岐','Lバーチカルローリング > サプライズフォワード 2MK / delayed DR 6MP / corner frame kill','中央と端、受け身を分ける。','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-seq-lift-ender','リフト締め選択','ワイルドリフト > 2HK / 3HP / Mバチカ / SA1 / MロリSA3 / doll','位置・ゲージ・人形残数で締めを選ぶ。','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-seq-wall-resource','端DI資源選択','DI wall splat > H/ODロリ > バチカ / ODバチカ / SA1 / SA3 / doll','Drive・SA・人形残数を記録。','https://note.com/kch_/n/n8bb3b56378a6'),
('blanka','blanka-seq-modern-assist-branch','モダンアシスト分岐','Assist L confirm / Assist M OD route / Assist H punish > oki or SA3','簡易補正と手動必殺技の差を確認。','https://kamigame.jp/streetfighter6/page/309118534259105537.html'),
('dhalsim','dhalsim-seq-flame-ender','フレイム締め分岐','M/Hフレイム > fire setup / DR slide / teleport strike / empty throw / float','強度・位置で起き攻めを選ぶ。','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-seq-blast-ender','ブラスト締め分岐','Hブラスト > teleport strike / empty throw / j.HK / corner 1HK','中央と端、ブラスト高度を分ける。','https://bkyo.blog.shinobi.jp/%E6%A0%BC%E9%97%98%E3%82%B2%E3%83%BC%E3%83%A0/%E3%80%90sf6%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%20%E3%82%B3%E3%83%B3%E3%83%9C%E2%80%A2%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E2%80%A2%E7%AB%8B%E3%81%A1%E5%9B%9E%E3%82%8A'),
('dhalsim','dhalsim-seq-odfire-teleport','ODファイア追走分岐','ODヨガファイア > delayed front/back teleport > strike / throw / retreat','弾の到達とテレポ方向を確認。','https://note.com/kuwana_fgc/n/ncf7a73b03a7f'),
('dhalsim','dhalsim-seq-antiair-resource','対空資源選択','4HP/DR 4MP/j.MP anti-air > blast / flame > SA1 / SA3 / oki','高さ・カウンター・ゲージで分岐。','https://note.com/nikotarosun/n/n4de225c4e4a9'),
('dhalsim','dhalsim-seq-modern-knockdown','モダンダウンF別分岐','33F > teleport j.LP / slide; 42-45F > teleport j.LP / float j.HP / ground teleport throw','33Fと42/45Fを混ぜずに確認。','https://gomokugenmai.digick.jp/2025/07/01/%E3%80%90%E3%83%A2%E3%83%80%E3%83%B3%E3%80%91%E3%83%80%E3%83%AB%E3%82%B7%E3%83%A0%E3%81%AE%E8%B5%B7%E3%81%8D%E6%94%BB%E3%82%81%E6%8A%80/'),
('e-honda','honda-seq-cannon-ender','大砲締め選択','大砲 > 百貫 / 頭突き / 四股頭突き / DR中P四股 / 鉄砲 / SA','中央・端・肩屋入り・ゲージで選ぶ。','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-seq-butt-23','百貫+23分岐','H百貫 > 2LP whiff strike/throw/大銀杏 / 四股 / dash / DR 5MK / DR stop','通常投げと大銀杏、Dリバ・無敵誘いを分ける。','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-seq-corner-headbutt','端頭突き分岐','corner headbutt > frame kill 5LK/2MK/6HK/5HK/2HP > meaty / throw / shimmy / DI','有利Fごとにフレーム消費を記録。','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-seq-di-choice','DI反撃選択','DI PC/wall > basic cannon butt / OD cannon SA1 / stock hands SA3 / side switch','位置・肩屋入り・Drive・SAで選ぶ。','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-seq-antiair-force-down','フォースダウン対空分岐','air PC/force down > 鉄砲 / DR中P or DR弱P pickup / 大砲百貫 / SA','高さと画面位置で拾いを変える。','https://note.com/denndenn/n/nc96680b2ff78');

insert into sequences(character_id,slug,name,sequence_type,sequence_text,is_true_blockstring,mash_point,throw_point,shimmy_point,jump_option,parry_option,drive_reversal_option,invincible_option,notes,valid_from_patch_id,verification_status,content_kind,status)
select c.id,r.slug,r.name,'pressure',r.seq,false,'4F check','throw branch','backwalk branch','jump check','parry check','D-reversal check','invincible check',r.notes,p.id,'unverified',
       case when r.slug like '%modern%' then 'modern_only' else 'strategy' end,'draft'
from p25f_seq r join characters c on c.slug=r.cslug
cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'sequence',x.id,s.id,'supporting','Written/image claim; current capture required.'
from p25f_seq r join sequences x on x.slug=r.slug join sources s on s.url=r.src
on conflict(entity_type,entity_id,source_id) do nothing;

-- Three additional reusable beginner clips per character.
create temporary table p25f_media(cslug text,slug text,name text,method text,src text) on commit drop;
insert into p25f_media values
('blanka','blanka-media-surprise-side','【初心者素材】サプライズフォワードと入れ替え','中央・端での移動距離、投げ間合い、表裏と停止位置を比較撮影。','https://www.streetfighter.com/6/ja-jp/character/blanka/movelist'),
('blanka','blanka-media-doll-wakeup','【初心者素材】人形起爆の起き攻め分岐','打撃・投げ・シミー・対空・再設置を同じ開始位置から短尺比較。','https://note.com/long_quail5230/n/n80d8c1f42f73'),
('blanka','blanka-media-modern-manual','【初心者素材】モダン手動技とアシスト差','同じ始動でアシスト、手動必殺技、簡易SAの入力と補正を比較。','https://kamigame.jp/streetfighter6/page/309118534259105537.html'),
('dhalsim','dhalsim-media-fire-strength','【初心者素材】ファイアとアーチ強度差','弱中強・ODの軌道、速度、到達時間を固定位置から比較。','https://www.streetfighter.com/6/ja-jp/character/dhalsim/movelist'),
('dhalsim','dhalsim-media-antiair-toolbox','【初心者素材】ダルシム対空使い分け','4HP、4MP、4HK、ブラスト、空対空を同じ飛びに対して比較。','https://note.com/nikotarosun/n/n4de225c4e4a9'),
('dhalsim','dhalsim-media-modern-classic-input','【初心者素材】クラシックとモダン入力差','フレイム、テレポ、SAの手動入力と簡易入力を入力履歴付きで比較。','https://note.com/kuwana_fgc/n/ncf7a73b03a7f'),
('e-honda','honda-media-command-throw-strength','【初心者素材】大銀杏投げ強度差','弱中強・ODの間合い、ダメージ、失敗時の位置を比較。','https://note.com/nanatyuya/n/n22121584dc64'),
('e-honda','honda-media-cannon-ender','【初心者素材】大砲後の締め選択','百貫、頭突き、四股頭突き、鉄砲のダメージ・位置・有利Fを比較。','https://note.com/bonmoko_3/n/n8257f7cd418f'),
('e-honda','honda-media-butt-meaty','【初心者素材】百貫後のフレーム消費','2LP空振り、前ステ、DR中K、DR急停止を同じ百貫締めから比較。','https://note.com/bonmoko_3/n/n8257f7cd418f');

insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select r.slug,r.name,'instructional_media','初心者ページとキャラページで再利用する。','beginner',10,c.id,
       '720p60fps以上。入力履歴・フレーム・ダメージ・Drive/SA・固有資源表示ON。','必要な動作だけ個別再生。','CPU OFF。',r.method,
       '入力、条件、結果の差が短尺で判別できる。',5,'短尺ループと説明クリップへ分割。',p.id,'unverified','training','draft'
from p25f_media r join characters c on c.slug=r.cslug
cross join lateral(select id from patches where is_current=true order by released_at desc limit 1)p
on conflict(slug) do nothing;

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'supporting','Written/image or official command reference.'
from p25f_media r join trainings t on t.slug=r.slug join sources s on s.url=r.src
on conflict(entity_type,entity_id,source_id) do nothing;

-- Verification Training for every newly added strategy item.
with e as(
  select r.cslug,'combo' typ,x.id,x.slug,x.name,x.notation method from p25f_combo r join combos x on x.slug=r.slug
  union all
  select r.cslug,'setup',x.id,x.slug,x.name,x.starter_condition||' > '||x.sequence_text from p25f_setup r join setups x on x.slug=r.slug
  union all
  select r.cslug,'sequence',x.id,x.slug,x.name,x.sequence_text from p25f_seq r join sequences x on x.slug=r.slug
), p as(select id from patches where is_current=true order by released_at desc limit 1)
insert into trainings(slug,name,training_type,purpose,level,duration_minutes,player_character_id,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,content_kind,status)
select 'training-'||e.slug,'【'||c.name_ja||'撮影待ち】'||e.name,
       case when e.typ='combo' then 'combo_retest' when e.typ='setup' then 'oki_retest' else 'pressure_retest' end,
       '文章・画像から収集した攻略を現行版で確定する。','advanced',15,c.id,
       '入力履歴・フレーム・ダメージ・Drive/SA・固有資源表示。操作方式、位置、受け身を指定。',
       '4F、ジャンプ、バクステ、パリィ、Dリバ、DI、無敵を必要時に録画。','CPU OFF。',e.method,
       '左右各10回で成立、数値、位置、受け身、キャラ条件を記録。',20,'成立ならverified候補。不成立ならarchived。',
       p.id,'unverified','strategy','draft'
from e join characters c on c.slug=e.cslug cross join p
where not exists(select 1 from trainings t where t.slug='training-'||e.slug)
on conflict(slug) do nothing;

insert into training_relations(training_id,related_type,related_id)
select t.id,e.typ,e.id
from trainings t join(
  select 'combo' typ,x.id,x.slug from p25f_combo r join combos x on x.slug=r.slug
  union all select 'setup',x.id,x.slug from p25f_setup r join setups x on x.slug=r.slug
  union all select 'sequence',x.id,x.slug from p25f_seq r join sequences x on x.slug=r.slug
)e on t.slug='training-'||e.slug
on conflict(training_id,related_type,related_id) do nothing;

with e as(
  select 'combo' typ,x.id,x.slug from p25f_combo r join combos x on x.slug=r.slug
  union all select 'setup',x.id,x.slug from p25f_setup r join setups x on x.slug=r.slug
  union all select 'sequence',x.id,x.slug from p25f_seq r join sequences x on x.slug=r.slug
)
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,es.source_id,'supporting','Inherited from related strategy.'
from e
join trainings t on t.slug='training-'||e.slug
join entity_sources es on es.entity_type=e.typ and es.entity_id=e.id
on conflict(entity_type,entity_id,source_id) do nothing;

insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',
       case when t.training_type='instructional_media' then 10
            when t.name ilike '%SA2%' or t.name ilike '%SA3%' or t.name ilike '%最大%' then 20
            when t.training_type='oki_retest' then 30
            when t.training_type='combo_retest' then 35 else 45 end,
       case when t.training_type='instructional_media' then '初心者ページ兼キャラページ用の短尺素材。'
            else '現行成立、入力、数値、位置、受け身、固有資源、キャラ条件を確認。' end
from trainings t
where t.player_character_id in(select id from characters where slug in('blanka','dhalsim','e-honda'))
  and (t.slug in(select 'training-'||slug from p25f_combo)
       or t.slug in(select 'training-'||slug from p25f_setup)
       or t.slug in(select 'training-'||slug from p25f_seq)
       or t.slug in(select slug from p25f_media))
on conflict(training_id) do nothing;

update character_content_packages ccp
set rollout_status='complete',
    notes=concat_ws(E'\n',nullif(ccp.notes,''),'2026-09-01: Re-audited written/image sources and expanded previously compressed combo, setup and sequence branches. Video analysis excluded.'),
    updated_at=now()
from characters c
where c.id=ccp.character_id and c.slug in('blanka','dhalsim','e-honda');
