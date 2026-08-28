import importlib.util
import json
import re
from pathlib import Path

spec=importlib.util.spec_from_file_location('pair','scripts/phase20-match-en-name-ja-values.py')
pair=importlib.util.module_from_spec(spec);spec.loader.exec_module(pair)

OUT=Path('artifacts/phase20-exact-en-any-category');OUT.mkdir(parents=True,exist_ok=True)
FIELDS=pair.FIELDS

def ikey(s):
    s=re.sub(r'<[^>]+>',' ',str(s or ''))
    return pair.key(s)

def sane(row):
    for f in ('recovery','on_hit','on_block'):
        v=str(row.get(f) or '')
        if re.fullmatch(r'[+-]?\d+',v) and abs(int(v))>200:return False
    v=str(row.get('damage') or '')
    if re.fullmatch(r'\d+',v) and int(v)>5000:return False
    return True

def main():
    ja={p.stem:pair.raw_rows(p,pair.JA_SECTIONS,'ja') for p in pair.JA_ROOT.glob('*.md')}
    en={p.stem:pair.raw_rows(p,pair.EN_SECTIONS,'en') for p in pair.EN_ROOT.glob('*.md')}
    paired={}
    for slug in set(ja)|set(en):
        jm={};em={}
        for r in ja.get(slug,[]):jm.setdefault(r['kind'],[]).append(r)
        for r in en.get(slug,[]):em.setdefault(r['kind'],[]).append(r)
        ps=[]
        for kind in set(jm)|set(em):
            jr=jm.get(kind,[]);er=em.get(kind,[])
            if len(jr)!=len(er):continue
            for a,b in zip(jr,er):
                if a.get('parsed'):ps.append({'kind':kind,'ja':a,'en':b})
        paired[slug]=ps
    safe=[];amb=[];none=[]
    for item in pair.get_db():
        if item.get('verification_status')!='reviewed' or item.get('move_type')=='taunt' or not item.get('name_en'):continue
        k=ikey(item['name_en'])
        cs=[p for p in paired.get(item['slug'],[]) if ikey(p['en']['name'])==k]
        if not cs:none.append({'frame_id':item['frame_id'],'slug':item['slug'],'name_en':item['name_en']});continue
        # exact English name must be unique across the whole character, regardless of DB move_type classification
        if len(cs)!=1:
            amb.append({'frame_id':item['frame_id'],'slug':item['slug'],'name_en':item['name_en'],'reason':'duplicate_official_name','candidate_count':len(cs)});continue
        pr=cs[0];row=pr['ja']['parsed']
        matched=[f for f in FIELDS if pair.eq(item,row,f)]
        populated=[f for f in FIELDS if item.get(f) is not None]
        missing=[f for f in populated if row.get(f) in (None,'')]
        conflicts=[f for f in populated if row.get(f) not in (None,'') and f not in matched]
        rec={'frame_id':item['frame_id'],'move_id':item['move_id'],'slug':item['slug'],'display_order':item.get('display_order'),'db_move_type':item.get('move_type'),'official_kind':pr['kind'],'name_ja':item.get('name_ja'),'name_en':item.get('name_en'),'official_name_en':pr['en']['name'],'official_name_ja':pr['ja']['name'],'db':{f:item.get(f) for f in FIELDS},'official':{f:pair.canon(row,f) for f in FIELDS},'matched':matched,'missing':missing,'conflicts':conflicts}
        if sane(row) and len(matched)>=1 and not missing:safe.append(rec)
        else:amb.append(rec)
    result={'safe_count':len(safe),'ambiguous_count':len(amb),'no_match_count':len(none),'safe':safe,'ambiguous':amb,'no_match':none}
    (OUT/'exact-en-any-category.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({k:result[k] for k in ['safe_count','ambiguous_count','no_match_count']},ensure_ascii=False))
    by={}
    for r in safe:by[r['slug']]=by.get(r['slug'],0)+1
    print('safe_by_slug',json.dumps(by,ensure_ascii=False,sort_keys=True))
if __name__=='__main__':main()
