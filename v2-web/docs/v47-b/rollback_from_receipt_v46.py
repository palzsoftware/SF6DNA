"""receipt（apply実行時のRETURNING結果CSV: tournament_id,player_id,placement,note）に載った行だけを削除するSQLを生成。既存行は対象外。"""
import csv,sys
rows=list(csv.DictReader(open(sys.argv[1])))
L=['BEGIN;']
for r in rows:
    assert r['note'].startswith('V46R '),'receipt外の行は削除しない'
    n=r['note'].replace("'","''")
    L.append(f"DELETE FROM tournament_results WHERE tournament_id='{r['tournament_id']}' AND player_id='{r['player_id']}' AND placement={int(r['placement'])} AND note='{n}';")
L.append('COMMIT;');print('\n'.join(L))
