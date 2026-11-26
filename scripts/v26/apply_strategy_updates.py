#!/usr/bin/env python3
"""V26: apply updateExistingCard rows of STRATEGY_MERGED_V13_V15 to the V7 reviewed-card file. Each row applies only when every `expect` field equals the
current value (or the card already equals `set` = already applied). Anything else is reported as HOLD and left untouched. legacyRouteReview is never applied here."""
import json,sys
P='src/data/strategy-v7-reviewed-cards-20261126.json'
raw=open(P,encoding='utf-8').read(); data=json.loads(raw)
merged=json.load(open(sys.argv[1],encoding='utf-8'))
def cards(o):
    if isinstance(o,dict):
        if 'id' in o and ('title' in o or 'commandRaw' in o): yield o
        for v in o.values(): yield from cards(v)
    elif isinstance(o,list):
        for v in o: yield from cards(v)
idx={}
for c in cards(data): idx.setdefault(c['id'],[]).append(c)
res=[]
for u in merged['updateExistingCard']:
    hit=idx.get(u['targetCardId'],[])
    if len(hit)!=1: res.append((u['targetCardId'],'HOLD_ID_NOT_UNIQUE',len(hit))); continue
    c=hit[0]
    if all(c.get(k)==v for k,v in u['set'].items()): res.append((c['id'],'ALREADY_APPLIED','')); continue
    bad=[k for k,v in u['expect'].items() if c.get(k)!=v]
    if bad: res.append((c['id'],'HOLD_EXPECT_MISMATCH',bad)); continue
    c.update(u['set']); res.append((c['id'],'APPLIED',list(u['set'])))
if any(r[1]=='APPLIED' for r in res):
    compact = '\n' not in raw.strip()
    out=json.dumps(data,ensure_ascii=False,separators=(',',':')) if compact else json.dumps(data,ensure_ascii=False,indent=2)
    open(P,'w',encoding='utf-8').write(out+('\n' if raw.endswith('\n') else ''))
for r in res: print(*r)
