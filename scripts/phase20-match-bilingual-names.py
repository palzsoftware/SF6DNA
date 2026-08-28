import importlib.util
import json
import os
import re
import unicodedata
import urllib.request
from pathlib import Path

spec = importlib.util.spec_from_file_location('v2', 'scripts/phase20-crosscheck-official-frames-v2.py')
v2 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(v2)
base=v2.base

JA_ROOT=Path('artifacts/phase20-official-frame-snapshots-ja-jp')
EN_ROOT=Path('artifacts/phase20-official-frame-snapshots-en-uk')
OUT=Path('artifacts/phase20-bilingual-names')
OUT.mkdir(parents=True,exist_ok=True)
FIELDS=['startup','active','recovery','on_hit','on_block','damage']


def get_db():
    url=os.environ['SUPABASE_URL'].rstrip('/')+'/rest/v1/rpc/_phase20_frame_audit_fingerprints'
    req=urllib.request.Request(url,data=b'{}',method='POST',headers={'apikey':os.environ['SUPABASE_PUBLISHABLE_KEY'],'Content-Type':'application/json'})
    with urllib.request.urlopen(req,timeout=30) as r:return json.load(r)


def fold(s):
    s=unicodedata.normalize('NFKC',str(s or '')).casefold()
    return re.sub(r'[^0-9a-zA-Zぁ-んァ-ヶ一-龠]+','',s)


def strip_explanatory_ja(s):
    s=str(s or '').strip()
    # Remove only clearly explanatory suffixes; preserve Lv/stock/strength/hold variants.
    s=re.sub(r'[（(](?:メダルLvに応じて動作が変化|ヒット時にメダルLvが上昇|クラシック操作|モダン操作)[^）)]*[）)]\s*$','',s)
    return s


def strict_ja(s):return fold(strip_explanatory_ja(s))

def strict_en(s):
    s=str(s or '').strip()
    # Normalize common DB naming syntax without discarding strength/OD/stock identity.
    s=re.sub(r'\bLevel\s*([123])\b',r'Lv\1',s,flags=re.I)
    s=re.sub(r'\bOverdrive\b','OD',s,flags=re.I)
    return fold(s)


def active_eq(ds,da,oa):
    da=str(da or '').strip(); oa=str(oa or '').strip(); ds=str(ds or '').strip()
    if da==oa:return True
    if re.fullmatch(r'\d+',ds) and re.fullmatch(r'\d+',da) and re.fullmatch(r'\d+-\d+',oa):
        st=int(ds);dur=int(da);return oa==f'{st}-{st+dur-1}'
    return False


def adv_norm(v):
    v=base.normalize_adv(v)
    if re.match(r'^(?:KD|D)\s*\+?\d+',str(v),re.I):return 'D'
    if str(v).upper()=='KD':return 'D'
    return v


def eq(item,row,f):
    dv=item.get(f);ov=row.get(f)
    if dv is None or ov in (None,''):return False
    if f=='active':return active_eq(item.get('startup'),dv,ov)
    if f=='recovery':return base.normalize_recovery(dv)==base.normalize_recovery(ov)
    if f in ('on_hit','on_block'):return adv_norm(dv)==adv_norm(ov)
    return str(dv).strip()==str(ov).strip()


def public_row(locale,row):
    return {'locale':locale,'name':row.get('name'),'section':row.get('section'),**{f:row.get(f) for f in FIELDS}}


def main():
    ja={p.stem:[dict(r,kind=v2.SECTION_KIND.get(r.get('section'))) for r in base.parse_file(p)] for p in JA_ROOT.glob('*.md')}
    en={p.stem:v2.parse_en(p) for p in EN_ROOT.glob('*.md')}
    db=get_db(); safe=[]; ambiguous=[]; no_name=[]
    for item in db:
        if item.get('verification_status')!='reviewed' or item.get('move_type')=='taunt':continue
        candidates=[]
        jkey=strict_ja(item.get('name_ja'))
        ekey=strict_en(item.get('name_en')) if item.get('name_en') else ''
        for locale,rows in [('ja',ja.get(item['slug'],[])),('en',en.get(item['slug'],[]))]:
            for row in rows:
                if not v2.compatible(item,row):continue
                key=strict_ja(row.get('name')) if locale=='ja' else strict_en(row.get('name'))
                target=jkey if locale=='ja' else ekey
                if not target or key!=target:continue
                matched=[f for f in FIELDS if eq(item,row,f)]
                populated=[f for f in FIELDS if item.get(f) is not None]
                missing=[f for f in populated if row.get(f) in (None,'')]
                conflicts=[f for f in populated if row.get(f) not in (None,'') and f not in matched]
                candidates.append({'locale':locale,'row':row,'matched':matched,'missing':missing,'conflicts':conflicts})
        # Collapse JA+EN candidates only when their normalized factual values agree on overlapping populated fields.
        if not candidates:
            no_name.append({'frame_id':item['frame_id'],'slug':item['slug'],'name_ja':item.get('name_ja'),'name_en':item.get('name_en')});continue
        # Unique by locale/name+factual signature; equivalent JA/EN representations count as one identity.
        def sig(c):
            r=c['row']
            return tuple(str(r.get(f) or '') for f in FIELDS)
        # Prefer candidate with most matched DB facts and fewest missing/conflicts.
        candidates.sort(key=lambda c:(len(c['matched']),-len(c['missing']),-len(c['conflicts'])),reverse=True)
        best=candidates[0]
        best_score=(len(best['matched']),len(best['missing']),len(best['conflicts']))
        peers=[c for c in candidates if (len(c['matched']),len(c['missing']),len(c['conflicts']))==best_score]
        # Multiple peers are OK only if all official factual values are identical.
        peer_sigs={sig(c) for c in peers}
        unique=len(peer_sigs)==1
        populated=[f for f in FIELDS if item.get(f) is not None]
        # Exact official name is strong identity evidence; require >=2 factual matches and no missing official
        # for automatic canonicalization. Conflict fields are replaced by official values.
        eligible=unique and len(best['matched'])>=2 and not best['missing'] and len(populated)>=2
        rec={'frame_id':item['frame_id'],'move_id':item['move_id'],'slug':item['slug'],'display_order':item.get('display_order'),'move_type':item.get('move_type'),'name_ja':item.get('name_ja'),'name_en':item.get('name_en'),'db':{f:item.get(f) for f in FIELDS},'best':public_row(best['locale'],best['row']),'matched':best['matched'],'conflicts':best['conflicts'],'candidate_count':len(candidates),'equivalent_peer_count':len(peers)}
        (safe if eligible else ambiguous).append(rec)
    result={'safe_count':len(safe),'ambiguous_count':len(ambiguous),'no_name_count':len(no_name),'safe':safe,'ambiguous':ambiguous,'no_name':no_name}
    (OUT/'bilingual-name-matches.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({k:result[k] for k in ['safe_count','ambiguous_count','no_name_count']},ensure_ascii=False))
    by={}
    for r in safe:by[r['slug']]=by.get(r['slug'],0)+1
    print('safe_by_slug',json.dumps(by,ensure_ascii=False,sort_keys=True))

if __name__=='__main__':main()
