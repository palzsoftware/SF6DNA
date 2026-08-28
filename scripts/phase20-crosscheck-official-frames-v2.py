import hashlib
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
EN_ROOT = Path('artifacts/phase20-official-frame-snapshots-en-uk')
OUT = Path('artifacts/phase20-frame-crosscheck-v2')
OUT.mkdir(parents=True, exist_ok=True)

EN_SECTIONS = {'Normal Moves','Unique Attacks','Special Moves','Super Arts','Throws','Common Moves','Drive System','Drive Reversal','Drive Impact'}
SECTION_KIND = {
    '通常技':'normal','Normal Moves':'normal',
    '特殊技':'unique','Unique Attacks':'unique',
    '必殺技':'special','Special Moves':'special',
    'スーパーアーツ':'super','Super Arts':'super',
    '通常投げ':'throw','投げ':'throw','Throws':'throw',
    '共通システム':'drive','Common Moves':'drive','Drive System':'drive','Drive Reversal':'drive','Drive Impact':'drive',
}
TYPE_KINDS = {'normal':{'normal'},'unique':{'unique'},'target_combo':{'unique'},'special':{'special'},'super':{'super'},'throw':{'throw'},'drive':{'drive'},'taunt':{'taunt'}}
IMG_RE = re.compile(r'!\[[^\]]*\]\([^)]*\)')


def clean(s):
    return re.sub(r'\s+', ' ', IMG_RE.sub(' ', str(s or ''))).strip()


def en_hash(s):
    return hashlib.md5(re.sub(r'[^a-zA-Z0-9]+','',str(s or '')).lower().encode()).hexdigest()


def en_base_hash(s):
    s = clean(s)
    s = re.sub(r'\s*\([^)]*\)$','',s)
    return en_hash(s)


def preprocess_en_stats(s):
    s = clean(s).replace('*','*')
    s = re.sub(r'(\d+)\+(\d+) frame\(s\) after landing', r'\1+着地後\2', s, flags=re.I)
    s = re.sub(r'(\d+) frame\(s\) after landing', r'着地後\1', s, flags=re.I)
    s = re.sub(r'(\d+) total frames?', r'全体 \1', s, flags=re.I)
    return s


def parse_en(path):
    lines = path.read_text(encoding='utf-8').splitlines()
    out=[]; section=None
    for i,line in enumerate(lines):
        st=line.strip()
        if st in EN_SECTIONS:
            section=st; continue
        if section is None or not st or st.startswith(('*','![','|','Title:','URL Source:','#')) or st=='Markdown Content:':
            continue
        j=i+1
        while j<len(lines) and not lines[j].strip(): j+=1
        if j>=len(lines): continue
        nxt=lines[j].strip()
        if '![Image' not in nxt and not nxt.startswith('(During') and not nxt.startswith('(After'):
            continue
        parsed=base.parse_stat_line(preprocess_en_stats(nxt))
        if parsed:
            out.append({'section':section,'kind':SECTION_KIND.get(section),'name':st,**parsed})
    return out


def get_db():
    url=os.environ['SUPABASE_URL'].rstrip('/')+'/rest/v1/rpc/_phase20_frame_audit_fingerprints'
    req=urllib.request.Request(url,data=b'{}',method='POST',headers={'apikey':os.environ['SUPABASE_PUBLISHABLE_KEY'],'Content-Type':'application/json'})
    with urllib.request.urlopen(req,timeout=30) as r: return json.load(r)


def compatible(item,row):
    return row.get('kind') in TYPE_KINDS.get(item.get('move_type'), set())


def main():
    ja={p.stem:[dict(r,kind=SECTION_KIND.get(r['section'])) for r in base.parse_file(p)] for p in JA_ROOT.glob('*.md')}
    en={p.stem:parse_en(p) for p in EN_ROOT.glob('*.md')}
    db=get_db(); matches=[]; unresolved=[]; summaries={}
    for item in db:
        slug=item['slug']; mask=item['mask']; candidates=[]
        for locale,rows in [('ja',ja.get(slug,[])),('en',en.get(slug,[]))]:
            for row in rows:
                if not compatible(item,row): continue
                if base.canonical_for_mask(row,mask)!=item['fp']: continue
                name_ok=False
                if locale=='ja':
                    nh=hashlib.md5(base.norm_name(row['name']).encode()).hexdigest(); bh=hashlib.md5(base.base_name(row['name']).encode()).hexdigest()
                    name_ok=item['name_hash'] in (nh,bh)
                elif item.get('name_en_hash'):
                    name_ok=item['name_en_hash'] in (en_hash(row['name']),en_base_hash(row['name']))
                if name_ok: candidates.append((locale,'name+fields'))
        method=None
        if candidates:
            method='bilingual-name+fields'
        else:
            # Field-only fallback is accepted only when unique within the expected move category across both locales.
            fps=[]
            for locale,rows in [('ja',ja.get(slug,[])),('en',en.get(slug,[]))]:
                for row in rows:
                    if compatible(item,row) and base.canonical_for_mask(row,mask)==item['fp']:
                        key=(row.get('kind'),base.canonical_for_mask(row,mask))
                        fps.append(key)
            if len(set(fps))==1 and len(fps)>0:
                # Require enough populated factual fields to avoid weak one-field coincidences.
                if mask.count('1')>=3:
                    method='category-unique-fields'
        rec={'slug':slug,'name_hash':item['name_hash'],'name_en_hash':item.get('name_en_hash'),'move_type':item.get('move_type'),'display_order':item.get('display_order'),'mask':mask,'fp':item['fp'],'verification_status':item['verification_status'],'method':method}
        (matches if method else unresolved).append(rec)
    for slug in sorted({x['slug'] for x in db}):
        d=[x for x in db if x['slug']==slug]; m=[x for x in matches if x['slug']==slug]; u=[x for x in unresolved if x['slug']==slug]
        summaries[slug]={'db_total':len(d),'ja_parsed':len(ja.get(slug,[])),'en_parsed':len(en.get(slug,[])),'concordant':len(m),'unresolved':len(u),'verified_before':sum(x['verification_status']=='verified' for x in d),'verified_unresolved':sum(x['verification_status']=='verified' for x in u)}
    result={'total_db':len(db),'total_concordant':len(matches),'total_unresolved':len(unresolved),'verified_unresolved':sum(x['verification_status']=='verified' for x in unresolved),'summary':summaries,'matches':matches,'unresolved':unresolved}
    (OUT/'crosscheck-v2.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({k:result[k] for k in ['total_db','total_concordant','total_unresolved','verified_unresolved']},ensure_ascii=False))
    for slug,s in summaries.items(): print(slug,s)

if __name__=='__main__': main()
