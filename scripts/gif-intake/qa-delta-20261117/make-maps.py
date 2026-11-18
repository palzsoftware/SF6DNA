#!/usr/bin/env python3
"""対応表3点を作る(読み取りのみ)。使い方: python3 -I make-maps.py <repo_root>
 1) DeeJay fixture97技 ↔ 公式TXT106行  2) dee-jay(fixture) ↔ deejay(メディアキー)  3) アルジュンTXT77行 ↔ GIF(未受領なら空欄)"""
import json,re,csv,collections,sys,os
R=sys.argv[1]; D=R+'/v2-web/src/data/'; O=R+'/scripts/gif-intake/qa-delta-20261117/'
fx=json.load(open(D+'ALL_CHARACTER_RELEASE_FIXTURE_20261004.json'))['characters']
txt=json.load(open(D+'SF6DNA_WS5_OFFICIAL_TXT_CANONICAL_20261026.json'))
raw=lambda v:v['raw'] if isinstance(v['raw'],dict) else {}
sp=lambda s:re.sub(r'\s','',s or '')
T=[(k,raw(v)) for k,v in txt.items() if k.startswith('deejay:')]; TD=dict(T)
used=set(); out=[]
for m in fx['dee-jay']['moves']:
    st=str(m['frame'].get('startup'))
    c1=[k for k,r in T if sp(r.get('skill'))==sp(m['name']) and k not in used]          # 技名(別名込み)完全一致
    c2=[k for k in c1 if str(TD[k].get('startup_frame'))==st]                           # +発生フレーム一致
    pick,meth=(c2[0],'NAME+STARTUP') if len(c2)==1 else ((c1[0],'NAME_ONLY') if len(c1)==1 else (None,'AMBIGUOUS' if c1 else 'NO_MATCH'))
    if pick: used.add(pick)
    r=TD.get(pick,{})
    out.append({'fixture_move_id':m['id'],'fixture_slug':m['slug'],'fixture_name':m['name'],'txt_key':pick or '','txt_skill':r.get('skill',''),'txt_command':r.get('command',''),'match':meth,'fixture_startup':st,'txt_startup':r.get('startup_frame','')})
for k,r in T:
    if k not in used: out.append({'fixture_move_id':'','fixture_slug':'','fixture_name':'','txt_key':k,'txt_skill':r.get('skill',''),'txt_command':r.get('command',''),'match':'TXT_ONLY','fixture_startup':'','txt_startup':r.get('startup_frame','')})
def wcsv(p,rows):
    with open(p,'w',newline='',encoding='utf-8') as f: w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
wcsv(O+'MAP_DEEJAY_FIXTURE97_TXT106_20261117.csv',out)
keys=set(re.findall(r'sf6dna-preview:deejay:[^"\s,]+',json.dumps(json.load(open(D+'SF6DNA_WS5_MEDIA_KEY_REGISTRY_20261026.json')))))
mk=[]
for o in out:
    c=[k for k in keys if k.endswith(o['txt_key'].replace(':','%3A'))]
    mk.append({'fixture_slug':o['fixture_slug'],'fixture_character':'dee-jay','txt_key':o['txt_key'],'media_key':c[0] if len(c)==1 else '','registry_character':'deejay','status':'MATCHED' if len(c)==1 else ('NOT_IN_REGISTRY' if not c else 'AMBIGUOUS')})
wcsv(O+'MAP_DEEJAY_MEDIA_KEY_20261117.csv',mk)
A=[(k,raw(v)) for k,v in txt.items() if k.startswith('arjun:')]
wcsv(O+'MAP_ARJUN_TXT77_GIF_20261117.csv',[{'txt_key':k,'skill':r.get('skill',''),'command':r.get('command',''),'startup':r.get('startup_frame',''),'active':r.get('active_frame',''),'recovery':r.get('recovery_frame',''),'gif_file':'','gif_sha256':'','status':'GIF_NOT_RECEIVED'} for k,r in A])
print('deejay',collections.Counter(o['match'] for o in out),'| mediakey',collections.Counter(x['status'] for x in mk),'| arjun',len(A))
for o in out:
    if o['match'] in('NO_MATCH','AMBIGUOUS','TXT_ONLY','NAME_ONLY'): print(' ',o['match'],o['fixture_name'] or o['txt_skill'],o['fixture_startup'],o['txt_startup'])
