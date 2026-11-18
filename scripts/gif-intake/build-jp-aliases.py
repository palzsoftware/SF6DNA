#!/usr/bin/env python3
"""JP「識別名不一致」22本の別名対応表(jp-move-aliases.ts)を生成する。読み取り専用で公開用データ等を照合し、
v2-web/src/data/gif-intake/jp-move-aliases.ts と scripts/gif-intake/jp-alias-verification-20261116.json を出力する。
既存の技データは変更しない。ステータスの自動昇格(APPROVED)は行わない。"""
import json,re,os,collections,hashlib
ROOT=os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..'))
D=os.path.join(ROOT,'v2-web/src/data/')
J=lambda p:json.load(open(p,encoding='utf-8-sig'))
FIXALL=J(D+'ALL_CHARACTER_RELEASE_FIXTURE_20261004.json')['characters']
FIX={m['slug']:m for m in FIXALL['jp']['moves']}
ALLIDS={m['id']:ch for ch,c in FIXALL.items() for m in c['moves']}
REG=J(D+'SF6DNA_WS5_MEDIA_KEY_REGISTRY_20261026.json'); OFF=J(D+'SF6DNA_WS5_OFFICIAL_TXT_CANONICAL_20261026.json')
ANA=[a for a in J(os.path.join(ROOT,'scripts/gif-intake/no-move-id-analysis-20261116.json')) if a['character']=='jp' and a['category']=='識別名不一致']
REP={r['file']:r for r in J(os.path.join(ROOT,'scripts/gif-intake/gif-intake-report-20261116.json'))['records']}
web=sorted([x for x in REG if x['characterSlug']=='jp' and ':web:' in x['sourceRecordKey']],key=lambda x:int(x['sourceRecordKey'].split(':')[-1]))
mp4ids=set()
for f in os.listdir(D):
    if re.match(r'^SF6DNA_VER1_.*_MEDIA_MANIFEST_.*\.json$',f):
        for c in J(D+f).get('clips',[]):
            if c.get('verification_status')=='approved_for_preview': mp4ids.add(c['move_id'])
TAGS=('OD','弱','中','強','CA','SA1','SA2','SA3')
def parse(n):
    tags=set(re.findall(r'（(SA[123]|CA)）',n)); n=re.sub(r'（(SA[123]|CA)）','',n); n=re.sub(r'\s*/\s*[A-Za-z].*$','',n); t=n.split(); pre=set()
    while t and t[0] in TAGS: pre.add(t.pop(0))
    return frozenset(pre|tags),''.join(t)
def strength(tags):
    return 'od' if 'OD' in tags else 'light' if '弱' in tags else 'medium' if '中' in tags else 'heavy' if '強' in tags else 'sa1' if 'SA1' in tags else 'sa2' if 'SA2' in tags else 'sa3' if 'SA3' in tags else 'none'
def motion_of_official(c):   # 公式コマンドの方向入力 → 方向クラス
    c=c.replace('（ヴィーハト設置中に）','').split('+')[0].strip().split('|')[0].strip()
    return {'5252':'22','214':'214','236':'236','23626':'236236','26236':'236236','21424':'214214','24214':'214214'}.get(c.replace(' ',''),c)
def motion_of_fix(t):
    t=t.replace('ヴィーハト後','').strip().split('+')[0].strip(); return t.replace('↓↘→ ↓↘→','236236').replace('↓↙← ↓↙←','214214').replace('↓↘→','236').replace('↓↙←','214').replace('↓↓','22').replace(' ','')
def btn_class(s):
    s=s.split('+',1)[1] if '+' in s else ''; return 'K' if re.search(r'K',s) and not re.search(r'P',s) else 'P' if re.search(r'P',s) and not re.search(r'K',s) else 'PK'
rows=[]; seenMove=collections.defaultdict(list); seenSha=collections.defaultdict(list)
for a in ANA:
    f=a['file']; slug=a['candidateSlug']; m=FIX[slug]; r=REP[f]; ev=[]; hold=[]
    rec=[w for w in web if re.sub(r'\s','',w['officialMoveName'])==re.sub(r'\s','',a['officialName'])]
    ocmd=a['officialCommand'] or ''; fcmd=(m['commands'] or [{}])[0].get('commandText') or ''
    # 1 正式名・強度/OD/SA区分: 公式名と公開用データ名が(括弧の英語名を除いて)完全一致
    if parse(a['officialName'])==parse(m['name']): ev.append('公式名=公開用データ名(強度/OD/SA区分も一致)')
    else: hold.append('NAME_OR_TAG_MISMATCH')
    # 2 唯一性: 同じ(区分,名称)を持つ公開用データの技が1件だけ
    same=[x for x in FIX.values() if parse(x['name'])==parse(m['name'])]
    if len(same)==1: ev.append('公開用データ内で区分+名称が一意')
    else: hold.append('AMBIGUOUS_MATCH:'+','.join(x['slug'] for x in same))
    # 3 技ID実在・JP限定
    if m['id'] in ALLIDS and ALLIDS[m['id']]=='jp': ev.append('技IDはJPの公開用データに実在')
    else: hold.append('MOVE_ID_NOT_JP')
    # 3b ファイル名の強度/OD/SAトークン ↔ 公開用データの区分(別の強度の技を取り違えていないか)
    toks=set(re.sub(r'^9_\d+-jp-','',f[:-4]).split('-')); want={t for t,k in (('od','OD'),('light','弱'),('medium','中'),('heavy','強'),('sa1','SA1'),('sa2','SA2'),('sa3','SA3')) if t in toks and (t!='od' or True) and k}
    have={ {'OD':'od','弱':'light','中':'medium','強':'heavy','SA1':'sa1','SA2':'sa2','SA3':'sa3'}[t] for t in parse(m['name'])[0] }
    if want==have: ev.append('ファイル名の区分トークン(%s)=公開用データの区分'%('+'.join(sorted(want)) or 'なし'))
    else: hold.append('FILENAME_TAG_MISMATCH file=%s fixture=%s'%(sorted(want),sorted(have)))
    # 4 コマンド: 方向入力クラスとボタン種別(P/K)
    if motion_of_official(ocmd)==motion_of_fix(fcmd) and btn_class(ocmd.replace('LPorMP','LP|MP'))==btn_class(fcmd): ev.append(f'コマンド一致: 公式「{ocmd}」/公開用データ「{fcmd}」')
    else: hold.append(f'COMMAND_MISMATCH official={ocmd} fixture={fcmd}')
    # 5 撮影順序: ファイル番号 9_N = 公式一覧(webId順)の通番
    mm=re.match(r'^9_(\d+)-',f); pos=[i+1 for i,w in enumerate(web) if rec and w is rec[0]]
    if mm and pos and int(mm.group(1))==pos[0]: ev.append(f'ファイル番号9_{mm.group(1)}=公式一覧の通番{pos[0]}')
    elif mm: hold.append('FILE_ORDER_MISMATCH')
    mp4=m['id'] in mp4ids
    cond='設置中' in ocmd
    status='HOLD' if hold else 'NEEDS_VISUAL_QA' if cond else 'MATCHED_STATIC'
    note=('ヴィーハト設置中の入力が条件。映像で設置後の派生であることを確認') if cond and not hold else None
    rows.append(dict(sourceFile=f,sha256=r['inspect']['sha256'],moveId=m['id'],moveSlug=slug,fixtureName=m['name'],officialName=a['officialName'],officialCommand=ocmd,fixtureCommand=fcmd,
        category=m['moveType'],strength=strength(parse(m['name'])[0]),existingMp4=mp4,status=status,evidence=ev,holdReasons=hold,visualQaNote=note))
    seenMove[m['id']].append(f); seenSha[r['inspect']['sha256']].append(f)
dupm={k:v for k,v in seenMove.items() if len(v)>1}; dups={k:v for k,v in seenSha.items() if len(v)>1}
for row in rows:
    if row['moveId'] in dupm: row['holdReasons'].append('DUPLICATE_MOVE_ID:'+','.join(dupm[row['moveId']])); row['status']='HOLD'
    if row['sha256'] in dups: row['holdReasons'].append('DUPLICATE_CONTENT'); row['status']='HOLD'
rows.sort(key=lambda x:int(re.match(r'^9_(\d+)',x['sourceFile']).group(1)))
js=lambda v:json.dumps(v,ensure_ascii=False)
ts=['// JP「識別名不一致」22本の別名対応表(ファイル名の素材識別子 → 公開用データの既存技ID)。',
'// 生成: scripts/gif-intake/build-jp-aliases.py (読み取り専用の静的照合。新規技データは作らない)',
'// 状態: MATCHED_STATIC=既存データと一意に対応 / NEEDS_VISUAL_QA=静的には対応、映像で確認すべき条件あり / HOLD=対応を確定できない / APPROVED=別途明示承認済み',
'// 注意: 静的に対応しても全件「映像・コマンド一致の目視確認」は未実施。APPROVED へは自動昇格しない(今回は0件)。',
'export type JpAliasStatus = "MATCHED_STATIC" | "NEEDS_VISUAL_QA" | "HOLD" | "APPROVED";','',
'export type JpMoveAlias = {','  sourceFile: string; // 素材識別子(GIFファイル名)','  sha256: string;','  moveId: string; // 公開用データの既存技ID','  moveSlug: string;','  fixtureName: string;','  officialName: string;','  officialCommand: string;','  fixtureCommand: string;','  category: string;',
'  strength: "light" | "medium" | "heavy" | "od" | "sa1" | "sa2" | "sa3" | "none";','  existingMp4: boolean; // trueなら表示はMP4優先(GIFは上乗せしない)','  status: JpAliasStatus;','  evidence: readonly string[];','  holdReasons: readonly string[];','  visualQaNote: string | null;','};','',
'export const JP_MOVE_ALIASES: readonly JpMoveAlias[] = [']
for r in rows: ts.append('  '+js(r)+',')
ts+=['];','']
open(D+'gif-intake/jp-move-aliases.ts','w',encoding='utf-8').write('\n'.join(ts))
json.dump(dict(generated='2026-11-16',summary=dict(collections.Counter(r['status'] for r in rows)),rows=rows),open(os.path.join(ROOT,'scripts/gif-intake/jp-alias-verification-20261116.json'),'w'),ensure_ascii=False,indent=1)
print(collections.Counter(r['status'] for r in rows),len(rows),'mp4',[r['moveSlug'] for r in rows if r['existingMp4']])
for r in rows:
    if r['holdReasons'] or r['status']!='MATCHED_STATIC': print(r['sourceFile'],r['status'],r['holdReasons'],r['visualQaNote'])
