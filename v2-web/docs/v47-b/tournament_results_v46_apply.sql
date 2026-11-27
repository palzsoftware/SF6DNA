-- SF6DNA V46 大会実績10件（開発DB vvsknbmlfvvnrmgtyhbf 専用・未実行・要個別承認）。
-- 実行時に RETURNING の結果を receipt として保存する（tournament_results_v46_receipt.csv）。
BEGIN;
WITH ins AS (INSERT INTO tournament_results(tournament_id,player_id,placement,note) SELECT v.t::uuid,v.p::uuid,v.pl,v.n FROM (VALUES
('d6b91b96-cf08-4f54-b2b9-256735daf0c5','b1d6c5b4-9157-455a-84b5-6b5c2ecb80ee',5,'V46R 主催者Top6記事（11/25確認） https://evo.gg/news/evo-2023-top-6-results-street-fighter-6'),
('46ae8cc9-e995-4897-8e5c-7b16c4d5aa38','f219456a-9a27-4fae-a874-f52b12c9160d',5,'V46R 主催者記事で5位タイ https://evo.gg/news/evo-2024-top-6-recap---street-fighter-6'),
('46ae8cc9-e995-4897-8e5c-7b16c4d5aa38','19fc9bdb-bd77-443e-b67e-2434731ff758',5,'V46R 主催者記事で5位タイ https://evo.gg/news/evo-2024-top-6-recap---street-fighter-6'),
('257a33ff-d698-4254-8cc0-bdf71d884a04','b1d6c5b4-9157-455a-84b5-6b5c2ecb80ee',2,'V46R 主催者記事 https://evo.gg/news/evo-2025-street-fighter-6-recap'),
('257a33ff-d698-4254-8cc0-bdf71d884a04','77d50854-04a2-46be-88fb-f86fe9d9177d',5,'V46R 主催者記事（既存台帳と一致） https://evo.gg/news/evo-2025-street-fighter-6-recap'),
('257a33ff-d698-4254-8cc0-bdf71d884a04','15140d85-7ef7-4fea-b49f-60d3006ce0eb',7,'V46R 既存台帳（P6 Top8）で官記事出典。LeSharの7位は推定のため不採用 https://evo.gg/news/evo-2025-street-fighter-6-recap'),
('3293dcbe-a84f-4332-9fd5-f3cc4e46ec10','e3cb3bf2-9ec9-4b40-a89a-e33361211cf4',4,'V46R Saiga NAK全順位＋既存台帳と一致（決勝は主催者で確認） https://saiganak.com/event/evo-2026-streetfighter-6-result/amp/'),
('939c6ea5-d49c-40ba-ade7-880c2156be26','60a080e8-e127-478b-9672-166289f38d00',2,'V46R 主催者記事で準優勝 https://evo.gg/news/yamaguchi-takes-biggest-street-fighter-tournament-ever-at-evo-japan-2026'),
('aa4a4756-f588-496b-84fa-49a6837d5df5','fde7c095-b6fc-40ad-a287-6a8f8d3e3444',5,'V46R CPT公式ニュース（11/25確認） https://sf.esports.capcom.com/cpt/news/240314_cpt2024.html'),
('dca71b7c-fd64-4971-8dee-e309eac64d67','830621f4-38aa-49e3-a320-31621e983fb5',2,'V46R 主催者記事で決勝相手 https://esportsworldcup.com/en/news/zeng-xiao-hai-zhuojun-retains-his-crown-as-street-fighter6-at-2025-ewc-champion-in-a-thrilling-final-round-finale')) AS v(t,p,pl,n) WHERE NOT EXISTS (SELECT 1 FROM tournament_results x WHERE x.tournament_id=v.t::uuid AND x.player_id=v.p::uuid) RETURNING tournament_id,player_id,placement,note)
SELECT * FROM ins;
COMMIT;
