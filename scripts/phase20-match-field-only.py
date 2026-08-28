import importlib.util
import json
import os
import urllib.request
from pathlib import Path

spec = importlib.util.spec_from_file_location('groups', 'scripts/phase20-match-same-name-groups.py')
groups = importlib.util.module_from_spec(spec)
spec.loader.exec_module(groups)
base = groups.base

JA_ROOT = Path('artifacts/phase20-official-frame-snapshots-ja-jp')
OUT = Path('artifacts/phase20-field-only')
OUT.mkdir(parents=True, exist_ok=True)


def get_db():
    url=os.environ['SUPABASE_URL'].rstrip('/')+'/rest/v1/rpc/_phase20_frame_audit_fingerprints'
    req=urllib.request.Request(url,data=b'{}',method='POST',headers={'apikey':os.environ['SUPABASE_PUBLISHABLE_KEY'],'Content-Type':'application/json'})
    with urllib.request.urlopen(req,timeout=30) as r:
        return json.load(r)


def main():
    official={}
    for p in JA_ROOT.glob('*.md'):
        rows=[]
        for i,r in enumerate(base.parse_file(p)):
            rr=dict(r); rr['kind']=groups.SECTION_KIND.get(r.get('section')); rr['_index']=i
            rows.append(rr)
        official[p.stem]=rows

    db=get_db()
    reviewed=[x for x in db if x.get('verification_status')=='reviewed' and x.get('move_type')!='taunt']
    safe=[]; ambiguous=[]
    for item in reviewed:
        pairs=[]
        for row in official.get(item['slug'],[]):
            if not groups.compatible(item,row): continue
            comparable,matched,conflicts,missing=groups.score_pair(item,row)
            score=matched*20-len(conflicts)*6-len(missing)*12
            pairs.append({
                'official_index':row['_index'],'official_name':row.get('name'),
                'official':{f:groups.official_value(row,f) for f in groups.FIELDS},
                'comparable':comparable,'matched':matched,'conflicts':conflicts,
                'missing_official':missing,'score':score,
            })
        pairs.sort(key=lambda x:(x['score'],x['matched'],-len(x['conflicts'])) ,reverse=True)
        if not pairs: continue
        best=pairs[0]; second=pairs[1] if len(pairs)>1 else None
        margin=999 if second is None else best['score']-second['score']
        exact_all=(best['comparable']>=4 and best['matched']==best['comparable'] and not best['missing_official'] and not best['conflicts'])
        near_all=(best['comparable']>=6 and best['matched']>=5 and not best['missing_official'] and len(best['conflicts'])<=1)
        eligible=(exact_all and margin>=10) or (near_all and margin>=20)
        rec={
            'frame_id':item['frame_id'],'move_id':item['move_id'],'slug':item['slug'],
            'display_order':item.get('display_order'),'move_type':item.get('move_type'),
            'name_ja':item.get('name_ja'),'name_en':item.get('name_en'),
            'db':{f:item.get(f) for f in groups.FIELDS},
            'best':best,'second':second,'margin':margin,
        }
        (safe if eligible else ambiguous).append(rec)

    # One official row may verify at most one DB row in this automatic pass.
    by_official={}
    for rec in safe:
        key=(rec['slug'],rec['best']['official_index'])
        by_official.setdefault(key,[]).append(rec)
    final=[]; collisions=[]
    for recs in by_official.values():
        if len(recs)==1: final.append(recs[0])
        else: collisions.extend(recs)
    ambiguous.extend(collisions)

    result={'reviewed_input':len(reviewed),'safe_count':len(final),'ambiguous_count':len(ambiguous),'safe':final,'ambiguous':ambiguous}
    (OUT/'field-only-matches.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({k:result[k] for k in ['reviewed_input','safe_count','ambiguous_count']},ensure_ascii=False))
    by_slug={}
    for r in final: by_slug[r['slug']]=by_slug.get(r['slug'],0)+1
    print('safe_by_slug',json.dumps(by_slug,ensure_ascii=False,sort_keys=True))

if __name__=='__main__': main()
