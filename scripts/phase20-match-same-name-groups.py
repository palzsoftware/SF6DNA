import importlib.util
import json
import os
import re
import urllib.request
from pathlib import Path

spec = importlib.util.spec_from_file_location('base', 'scripts/phase20-crosscheck-official-frames.py')
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)

JA_ROOT = Path('artifacts/phase20-official-frame-snapshots-ja-jp')
OUT = Path('artifacts/phase20-same-name-groups')
OUT.mkdir(parents=True, exist_ok=True)

SECTION_KIND = {
    '通常技':'normal', '特殊技':'unique', '必殺技':'special',
    'スーパーアーツ':'super', '通常投げ':'throw', '投げ':'throw',
    '共通システム':'drive',
}
TYPE_KINDS = {
    'normal':{'normal'}, 'unique':{'unique'}, 'target_combo':{'unique'},
    'special':{'special'}, 'super':{'super'}, 'throw':{'throw'},
    'drive':{'drive'},
}
FIELDS = ['startup','active','recovery','on_hit','on_block','damage']


def get_db():
    url=os.environ['SUPABASE_URL'].rstrip('/')+'/rest/v1/rpc/_phase20_frame_audit_fingerprints'
    req=urllib.request.Request(url,data=b'{}',method='POST',headers={
        'apikey':os.environ['SUPABASE_PUBLISHABLE_KEY'],
        'Content-Type':'application/json',
    })
    with urllib.request.urlopen(req,timeout=30) as r:
        return json.load(r)


def compact(s):
    return re.sub(r'[\s　・･_\-]+','',str(s or '')).lower()


def group_key_ja(s):
    s=str(s or '').strip()
    s=re.sub(r'^(?:SA[123]|CA)\s*','',s,flags=re.I)
    s=re.sub(r'^(?:OD|弱|中|強)\s*','',s,flags=re.I)
    s=re.sub(r'[（(](?:弱|中|強|OD|ライト|ミディアム|ヘビー|オーバードライブ|L|M|H)[^）)]*[）)]$','',s,flags=re.I)
    return compact(s)


def group_key_en(s):
    s=str(s or '').strip()
    s=re.sub(r'^(?:SA[123]|CA|OD|L|M|H)\s+','',s,flags=re.I)
    s=re.sub(r'\s*\((?:Light|Medium|Heavy|Overdrive|L|M|H|OD)\)\s*$','',s,flags=re.I)
    return compact(s)


def norm_recovery(v):
    return base.normalize_recovery(v)


def norm_adv(v):
    return base.normalize_adv(v)


def active_equiv(db_startup,db_active,off_active):
    a=str(db_active or '').strip(); b=str(off_active or '').strip()
    if not a or not b: return False
    if a==b: return True
    if re.fullmatch(r'\d+',str(db_startup or '').strip()) and re.fullmatch(r'\d+',a) and re.fullmatch(r'\d+-\d+',b):
        st=int(str(db_startup).strip()); dur=int(a)
        return b==f'{st}-{st+dur-1}'
    if re.fullmatch(r'\d+-\d+',a) and re.fullmatch(r'\d+',b) and re.fullmatch(r'\d+',str(db_startup or '').strip()):
        st=int(str(db_startup).strip()); dur=int(b)
        return a==f'{st}-{st+dur-1}'
    return False


def field_equal(item,row,f):
    a=item.get(f); b=row.get(f)
    if a is None or b in (None,''): return False
    if f=='recovery': return norm_recovery(a)==norm_recovery(b)
    if f in ('on_hit','on_block'):
        na,nb=norm_adv(a),norm_adv(b)
        if na==nb: return True
        # D and D+N/KD+N share knockdown state, but exact advantage is not proven.
        if f=='on_hit' and na=='D' and re.match(r'^(?:D|KD)\s*\+?\d+',str(a),re.I): return True
        return False
    if f=='active': return active_equiv(item.get('startup'),a,b)
    return str(a).strip()==str(b).strip()


def official_value(row,f):
    v=row.get(f)
    if v in (None,''): return None
    if f=='recovery': return norm_recovery(v)
    if f in ('on_hit','on_block'): return norm_adv(v)
    return str(v).strip()


def compatible(item,row):
    return row.get('kind') in TYPE_KINDS.get(item.get('move_type'),set())


def score_pair(item,row):
    comparable=0; matched=0; conflicts=[]; missing_official=[]
    for f in FIELDS:
        dv=item.get(f); ov=row.get(f)
        if dv is None:
            continue
        comparable+=1
        if ov in (None,''):
            missing_official.append(f)
        elif field_equal(item,row,f):
            matched+=1
        else:
            conflicts.append(f)
    return comparable,matched,conflicts,missing_official


def main():
    official={}
    for p in JA_ROOT.glob('*.md'):
        rows=[]
        for r in base.parse_file(p):
            rr=dict(r); rr['kind']=SECTION_KIND.get(r.get('section'))
            rr['group_ja']=group_key_ja(r.get('name'))
            rows.append(rr)
        official[p.stem]=rows

    db=get_db()
    reviewed=[x for x in db if x.get('verification_status')=='reviewed' and x.get('move_type')!='taunt']
    safe=[]; ambiguous=[]; no_name_group=[]

    for item in reviewed:
        rows=[r for r in official.get(item['slug'],[]) if compatible(item,r)]
        gj=group_key_ja(item.get('name_ja'))
        ge=group_key_en(item.get('name_en'))
        candidates=[]
        for idx,row in enumerate(rows):
            same_name=(gj and gj==row.get('group_ja'))
            if not same_name and ge:
                same_name=(ge==group_key_en(row.get('name')))
            if not same_name: continue
            comparable,matched,conflicts,missing=score_pair(item,row)
            candidates.append({
                'official_index':idx,
                'official_name':row.get('name'),
                'official':{f:official_value(row,f) for f in FIELDS},
                'comparable':comparable,'matched':matched,
                'conflicts':conflicts,'missing_official':missing,
                'score':matched*10-len(conflicts)*3-len(missing)*5,
            })
        if not candidates:
            no_name_group.append({'frame_id':item['frame_id'],'slug':item['slug'],'name_ja':item.get('name_ja'),'name_en':item.get('name_en'),'move_type':item.get('move_type')})
            continue
        candidates.sort(key=lambda x:(x['score'],x['matched'],-len(x['conflicts'])) ,reverse=True)
        best=candidates[0]; second=candidates[1] if len(candidates)>1 else None
        unique_margin = second is None or best['score']-second['score']>=10
        # Require enough pre-existing factual agreement to distinguish strength/OD variants.
        # Every populated DB field must also exist in the official row before automatic normalization.
        eligible=(best['matched']>=3 and best['comparable']>=3 and not best['missing_official'] and unique_margin)
        rec={
            'frame_id':item['frame_id'],'move_id':item['move_id'],'slug':item['slug'],
            'display_order':item.get('display_order'),'move_type':item.get('move_type'),
            'name_ja':item.get('name_ja'),'name_en':item.get('name_en'),
            'db':{f:item.get(f) for f in FIELDS},
            'best':best,'second':second,
        }
        (safe if eligible else ambiguous).append(rec)

    # Prevent accidental many-to-one assignment within the same character and official row signature.
    seen={}; dedup_safe=[]
    for rec in safe:
        key=(rec['slug'],rec['best']['official_name'],json.dumps(rec['best']['official'],ensure_ascii=False,sort_keys=True))
        seen.setdefault(key,[]).append(rec)
    for key,recs in seen.items():
        if len(recs)==1:
            dedup_safe.append(recs[0])
        else:
            ambiguous.extend(recs)

    result={
        'reviewed_input':len(reviewed),
        'safe_count':len(dedup_safe),
        'ambiguous_count':len(ambiguous),
        'no_name_group_count':len(no_name_group),
        'safe':dedup_safe,
        'ambiguous':ambiguous,
        'no_name_group':no_name_group,
    }
    (OUT/'same-name-group-matches.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({k:result[k] for k in ['reviewed_input','safe_count','ambiguous_count','no_name_group_count']},ensure_ascii=False))
    per_slug={}
    for r in dedup_safe: per_slug[r['slug']]=per_slug.get(r['slug'],0)+1
    print('safe_by_slug',json.dumps(per_slug,ensure_ascii=False,sort_keys=True))

if __name__=='__main__':
    main()
