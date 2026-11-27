-- 復旧（V45で追加した10行だけを対象。既存61行は削除しない）
BEGIN;
DELETE FROM tournament_results WHERE tournament_id='d6b91b96-cf08-4f54-b2b9-256735daf0c5' AND player_id='b1d6c5b4-9157-455a-84b5-6b5c2ecb80ee' AND placement=5 AND note LIKE 'V44 %';
DELETE FROM tournament_results WHERE tournament_id='46ae8cc9-e995-4897-8e5c-7b16c4d5aa38' AND player_id='f219456a-9a27-4fae-a874-f52b12c9160d' AND placement=5 AND note LIKE 'V44 %';
DELETE FROM tournament_results WHERE tournament_id='46ae8cc9-e995-4897-8e5c-7b16c4d5aa38' AND player_id='19fc9bdb-bd77-443e-b67e-2434731ff758' AND placement=5 AND note LIKE 'V44 %';
DELETE FROM tournament_results WHERE tournament_id='257a33ff-d698-4254-8cc0-bdf71d884a04' AND player_id='b1d6c5b4-9157-455a-84b5-6b5c2ecb80ee' AND placement=2 AND note LIKE 'V44 %';
DELETE FROM tournament_results WHERE tournament_id='257a33ff-d698-4254-8cc0-bdf71d884a04' AND player_id='77d50854-04a2-46be-88fb-f86fe9d9177d' AND placement=5 AND note LIKE 'V44 %';
DELETE FROM tournament_results WHERE tournament_id='257a33ff-d698-4254-8cc0-bdf71d884a04' AND player_id='15140d85-7ef7-4fea-b49f-60d3006ce0eb' AND placement=7 AND note LIKE 'V44 %';
DELETE FROM tournament_results WHERE tournament_id='3293dcbe-a84f-4332-9fd5-f3cc4e46ec10' AND player_id='e3cb3bf2-9ec9-4b40-a89a-e33361211cf4' AND placement=4 AND note LIKE 'V44 %';
DELETE FROM tournament_results WHERE tournament_id='939c6ea5-d49c-40ba-ade7-880c2156be26' AND player_id='60a080e8-e127-478b-9672-166289f38d00' AND placement=2 AND note LIKE 'V44 %';
DELETE FROM tournament_results WHERE tournament_id='aa4a4756-f588-496b-84fa-49a6837d5df5' AND player_id='fde7c095-b6fc-40ad-a287-6a8f8d3e3444' AND placement=5 AND note LIKE 'V44 %';
DELETE FROM tournament_results WHERE tournament_id='dca71b7c-fd64-4971-8dee-e309eac64d67' AND player_id='830621f4-38aa-49e3-a320-31621e983fb5' AND placement=2 AND note LIKE 'V44 %';
COMMIT;
