import importlib.util
import json
import os
import re
import unicodedata
import urllib.request
from pathlib import Path

spec = importlib.util.spec_from_file_location('base', 'scripts/phase20-crosscheck-official-frames.py')
base = importlib.util.module_from_spec(spec); spec.loader.exec_module(base)

JA_ROOT=Path('artifacts/phase20-official-frame-snapshots-ja-jp')
EN_ROOT=Path('artifacts/phase20-official-frame-snapshots-en-uk')
OUT=Path('artifacts/phase20-en-name-ja-values'); OUT.mkdir(parents=True,exist_ok=True)
FIELDS=['startup','active','recovery','on_hit','on_block','damage']
JA_SECTIONS={'通常技':'normal','特殊技':'unique','必殺技':'special','スーパーアーツ':'super','通常投げ':'throw','投げ':'throw','共通システム':'drive'}
EN_SECTIONS={'Normal Moves':'normal','Unique Attacks':'unique','Special Moves':'special','Super Arts':'super','Throws':'throw','Common Moves':'drive','Drive System':'drive','Drive Reversal':'drive','Drive Impact':'drive'}
TYPE_KINDS={'normal':{'normal'},'unique':{'unique'},'target_combo':{'unique'},'special':{'special'},'super':{'super'},'throw':{'throw'},'drive':{'drive'}}
IMG_RE=re.compile(r'!\[[^\]]*\]\([^)]*\)')


def get_db():
    url=os.environ['SUPABASE_URL'].rstrip('/')+'/rest/v1/rpc/_phase20_frame_audit_fingerprints'
    req=urllib.request.Request(url,data=b'{}',method='POST',headers={'apikey':os.environ['SUPABASE_PUBLISHABLE_KEY'],'Content-Type':'application/json'})
    with urllib.request.urlopen(req,timeout=30) as r:return json.load(r)


def clean(s):return re.sub(r'\s+',' ',IMG_RE.sub(' ',str(s or ''))).strip()

def key(s):
    s=unicodedata.normalize('NFKC',str(s or '')).casefold()
    s=re.sub(r'\boverdrive\b','od',s)
    s=re.sub(r'\blevel\s*([123])\b',r'lv\1',s)
    return re.sub(r'[^0-9a-z]+','',s)


def raw_rows(path,sections,locale):
    lines=path.read_text(encoding='utf-8').splitlines(); section=None; out=[]; ords={}
    headings=set(sections)
    for i,line in enumerate(lines):
        st=line.strip()
        if st in headings: section=st; continue
        if section is None or not st or st.startswith(('*','![','|','Title:','URL Source:','#')) or st=='Markdown Content:':continue
        j=i+1
        while j<len(lines) and not lines[j].strip():j+=1
        if j>=len(lines):continue
        nxt=lines[j].strip()
        if '![Image' not in nxt and '![画像' not in nxt and not nxt.startswith(('（','(During','(After')):continue
        kind=sections[section]; ords[kind]=ords.get(kind,0)+1
        parsed=base.parse_stat_line(nxt) if locale=='ja' else None
        out.append({'kind':kind,'ordinal':ords[kind],'section':section,'name':st,'raw':nxt,'parsed':parsed})
    return out


def norm_adv(v):
    v=base.normalize_adv(v)
    if str(v).upper()=='KD':return 'D'
    if re.match(r'^(?:KD|D)\s*\+?\d+',str(v),re.I):return 'D'
    return v


def active_eq(ds,da,oa):
    ds=str(ds or '').strip();da=str(da or '').strip();oa=str(oa or '').strip()
    if da==oa:return True
    if re.fullmatch(r'\d+',ds) and re.fullmatch(r'\d+',da) and re.fullmatch(r'\d+-\d+',oa):
        st=int(ds);dur=int(da);return oa==f'{st}-{st+dur-1}'
    return False


def eq(item,row,f):
    dv=item.get(f);ov=row.get(f)
    if dv is None or ov in (None,''):return False
    if f=='active':return active_eq(item.get('startup'),dv,ov)
    if f=='recovery':return base.normalize_recovery(dv)==base.normalize_recovery(ov)
    if f in ('on_hit','on_block'):return norm_adv(dv)==norm_adv(ov)
    return str(dv).strip()==str(ov).strip()


def canon(row,f):
    v=row.get(f)
    if v in (None,''):return None
    if f=='recovery':return base.normalize_recovery(v)
    if f in ('on_hit','on_block'):return base.normalize_adv(v)
    return str(v).strip()


def main():
    ja={};en={};paired={};pairing_report={}
    for p in JA_ROOT.glob('*.md'):ja[p.stem]=raw_rows(p,JA_SECTIONS,'ja')
    for p in EN_ROOT.glob('*.md'):en[p.stem]=raw_rows(p,EN_SECTIONS,'en')
    for slug in set(ja)|set(en):
        jm={};em={}
        for r in ja.get(slug,[]):jm.setdefault(r['kind'],[]).append(r)
        for r in en.get(slug,[]):em.setdefault(r['kind'],[]).append(r)
        pairs=[];rep={}
        for kind in set(jm)|set(em):
            jr=jm.get(kind,[]);er=em.get(kind,[]);rep[kind]={'ja':len(jr),'en':len(er),'paired':0}
            if len(jr)!=len(er):continue
            for a,b in zip(jr,er):
                if a['parsed']:
                    pairs.append({'kind':kind,'ordinal':a['ordinal'],'ja':a,'en':b});rep[kind]['paired']+=1
        paired[slug]=pairs;pairing_report[slug]=rep

    safe=[];ambiguous=[];no_match=[]
    for item in get_db():
        if item.get('verification_status')!='reviewed' or item.get('move_type')=='taunt' or not item.get('name_en'):continue
        k=key(item['name_en']);cands=[]
        for pr in paired.get(item['slug'],[]):
            if pr['kind'] not in TYPE_KINDS.get(item.get('move_type'),set()):continue
            if key(pr['en']['name'])!=k:continue
            row=pr['ja']['parsed'];matched=[f for f in FIELDS if eq(item,row,f)]
            populated=[f for f in FIELDS if item.get(f) is not None]
            missing=[f for f in populated if row.get(f) in (None,'')]
            conflicts=[f for f in populated if row.get(f) not in (None,'') and f not in matched]
            cands.append({'official_name_en':pr['en']['name'],'official_name_ja':pr['ja']['name'],'kind':pr['kind'],'ordinal':pr['ordinal'],'official':{f:canon(row,f) for f in FIELDS},'matched':matched,'missing':missing,'conflicts':conflicts})
        if not cands:
            no_match.append({'frame_id':item['frame_id'],'slug':item['slug'],'name_en':item['name_en']});continue
        # exact English name must identify exactly one paired official row
        unique=len(cands)==1
        best=sorted(cands,key=lambda c:(len(c['matched']),-len(c['missing']),-len(c['conflicts'])),reverse=True)[0]
        eligible=unique and len(best['matched'])>=2 and not best['missing']
        rec={'frame_id':item['frame_id'],'move_id':item['move_id'],'slug':item['slug'],'display_order':item.get('display_order'),'move_type':item.get('move_type'),'name_ja':item.get('name_ja'),'name_en':item.get('name_en'),'db':{f:item.get(f) for f in FIELDS},'best':best,'candidate_count':len(cands)}
        (safe if eligible else ambiguous).append(rec)
    result={'safe_count':len(safe),'ambiguous_count':len(ambiguous),'no_match_count':len(no_match),'pairing_report':pairing_report,'safe':safe,'ambiguous':ambiguous,'no_match':no_match}
    (OUT/'en-name-ja-value-matches.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({k:result[k] for k in ['safe_count','ambiguous_count','no_match_count']},ensure_ascii=False))
    by={}
    for r in safe:by[r['slug']]=by.get(r['slug'],0)+1
    print('safe_by_slug',json.dumps(by,ensure_ascii=False,sort_keys=True))

if __name__=='__main__':main()
