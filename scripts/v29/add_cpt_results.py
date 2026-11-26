#!/usr/bin/env python3
"""V29: Capcom公式(CPT)順位ページ2件で2026-11-26に再確認した個人成績を、既存の『主要大会の個人成績』欄へ追加する。
- 既存Player行(team-bindings.json、環境別)のみ。新規Player行・新規欄は作らない(欄が無い行は既存titleで新設)。
- 冪等(researchId重複なら追加しない)。publicationApprovalは既存のまま(PENDING)。チーム成績は個人順位へ変換しない。
- 順位は公式ページの記載どおり(同順位は「同率N位」)。使用キャラ・日付は付けない(ページに日付記載なし)。"""
import json,sys,pathlib
P=pathlib.Path(__file__).resolve().parents[2]/'v2-web/src/data/player-research/team-bindings.json'
EVO='https://sf.esports.capcom.com/cpt/news/230816_evo.html'; CCX='https://sf.esports.capcom.com/cpt/news/240314_cpt2024.html'
CHECKED='2026-11-26'; TITLE='主要大会の個人成績'
ROWS=[('angrybird','EVO 2023: 優勝',EVO,'R20261126-EVO23-01'),('menard','EVO 2023: 2位',EVO,'R20261126-EVO23-02'),('punk','EVO 2023: 3位',EVO,'R20261126-EVO23-03'),
('tokido','EVO 2023: 4位',EVO,'R20261126-EVO23-04'),('kakeru','EVO 2023: 同率5位',EVO,'R20261126-EVO23-05'),('haitani','EVO 2023: 同率5位',EVO,'R20261126-EVO23-06'),('fujimura','EVO 2023: 同率7位',EVO,'R20261126-EVO23-07'),
('gachikun','CAPCOM CUP X: 3位',CCX,'R20261126-CCX-03'),('nl','CAPCOM CUP X: 4位',CCX,'R20261126-CCX-04'),('leshar','CAPCOM CUP X: 5位',CCX,'R20261126-CCX-05'),('kawano','CAPCOM CUP X: 同率7位',CCX,'R20261126-CCX-07')]
d=json.loads(P.read_text(encoding='utf-8')); added=0; per={}
for slug,text,url,rid in ROWS:
    for row in d:
        if row['playerSlug']!=slug: continue
        secs=row['display']['sections']; sec=next((s for s in secs if s['title']==TITLE),None)
        if sec is None: sec={'title':TITLE,'items':[]}; secs.append(sec)
        if any(i.get('researchId')==rid for i in sec['items']): continue
        sec['items'].append({'text':text,'sourceUrl':url,'researchId':rid,'sourceCheckedOn':CHECKED}); added+=1; per[(slug,row['environment'][:6])]=1
P.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('added',added,'rows touched',sorted(per))
