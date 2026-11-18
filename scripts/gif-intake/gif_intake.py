#!/usr/bin/env python3
"""全キャラ共通 GIF取り込み検査ツール（読み取り専用。リポジトリは変更しない）。

使い方:
  既存分の検査     : python3 gif_intake.py --existing LEDGER_JSON --made MANIFEST_JSON --out OUTDIR
  ChatGPT等の受領分: python3 gif_intake.py --incoming DIR --out OUTDIR
      DIR には GIF と intake.json を置く。intake.json は
      [{"file":"luke-light-flash-knuckle.gif","character":"luke","moveSlug":"luke-flash-knuckle-lp","sourceVideo":"luke_hissatsu1.mp4"}, ...]
判定(connectionClass):
  CONNECTABLE_CANDIDATE : 技IDが公開用データに実在・検査合格・重複なし・MP4未保有 → 接続候補(目視未承認)
  MP4_KEPT              : その技には既にMP4がある → MP4を維持しGIFは上乗せしない
  BLOCKED               : 検査不合格/重複/コマンド不一致
  HOLD_*                : 技ID未確定・未検査・目視前提など
注意: ここで合格しても承認ではない。承認は目視後に人が記録する。"""
import json,sys,os,re,struct,hashlib,collections,argparse,subprocess
REPO=os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..'))+'/' if os.path.exists(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','v2-web')) else '/home/claude/work/repo/'
FIX=json.load(open(REPO+'v2-web/src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json'))['characters']
MOVES={}                       # id -> (character, move)
for ch,c in FIX.items():
    for m in c['moves']: MOVES[m['id']]=(ch,m)
BYSLUG={m['slug']:(ch,m) for ch,c in FIX.items() for m in c['moves']}
tracked=subprocess.check_output(['git','-C',REPO,'ls-files'],text=True).split('\n')
MP4SLUG={os.path.basename(f)[:-4] for f in tracked if f.endswith('.mp4')}

def inspect_gif(path):
    """GIFヘッダを直接読み、寸法・フレーム数・ループ拡張・総時間(ms)を返す。"""
    b=open(path,'rb').read(); r=dict(sha256=hashlib.sha256(b).hexdigest(),bytes=len(b),errors=[])
    if b[:6] not in(b'GIF87a',b'GIF89a'): r['errors'].append('NOT_GIF'); return r
    r['width'],r['height']=struct.unpack('<HH',b[6:10]); i=13
    if b[10]&0x80: i+=3*(2<<(b[10]&7))
    frames=0; dur=0; loop=None
    while i<len(b):
        t=b[i]
        if t==0x3B: break
        if t==0x21:
            lab=b[i+1]; j=i+2
            if lab==0xF9: dur+=struct.unpack('<H',b[j+2:j+4])[0]*10
            if lab==0xFF and b[j+1:j+12]==b'NETSCAPE2.0': loop=struct.unpack('<H',b[j+14:j+16])[0]
            while b[j]!=0: j+=b[j]+1
            i=j+1
        elif t==0x2C:
            flags=b[i+9]; j=i+10
            if flags&0x80: j+=3*(2<<(flags&7))
            j+=1
            while b[j]!=0: j+=b[j]+1
            i=j+1; frames+=1
        else: r['errors'].append('BAD_BLOCK'); break
    r.update(frames=frames,durationMs=dur,loopCount=loop); return r

STRENGTH={'弱':'light','中':'medium','強':'heavy','OD':'od'}
def strength_in_name(n):
    n=n or ''
    for k,v in(('OD','od'),('弱','light'),('中','medium'),('強','heavy')):
        if re.search(r'(^|\s|\[)'+k+r'(\s|$)',n) or n.startswith(k+' '): return v
    return None
def strength_in_slug(s):
    for k in('light','medium','heavy'):
        if re.search(r'(^|-)'+k+r'(-|$)',s): return k
    if re.search(r'(^|-)od(-|$)',s): return 'od'
    return None
CLASS={'normal':'通常技','special':'必殺技','unique':'特殊技','super':'SA/CA','throw':'投げ','target_combo':'ターゲットコンボ'}

def classify(rec,bysha):
    """rec: dict(character,file,path?,moveId?,moveSlug?, inspect=...)  -> connectionClass と理由"""
    why=[]; fx=None
    if rec.get('moveId') in MOVES: fx=MOVES[rec['moveId']]
    elif rec.get('moveSlug') in BYSLUG: fx=BYSLUG[rec['moveSlug']]
    ins=rec['inspect']
    rec['fixtureMove']=dict(id=fx[1]['id'],slug=fx[1]['slug'],name=fx[1]['name'],moveType=fx[1]['moveType'],category=CLASS.get(fx[1]['moveType']),
        command=(fx[1]['commands'] or [{}])[0].get('commandText'),hasMedia=bool(fx[1].get('media'))) if fx else None
    if fx and fx[0]!=rec['character']: why.append('CHARACTER_MISMATCH')
    if ins.get('notInspected'): return 'HOLD_NOT_INSPECTED',['取得上限(10MB)超で未検査']
    if rec.get('role') in('unconfirmed_mapping','suspected_old','alt_version'): return 'HOLD_'+rec['role'].upper(),['Stage1でHOLD判定済み']
    if not fx and ins.get('frames') is None: return 'HOLD_NO_FIXTURE_MOVE',['公開用データに対応する技IDなし(実体は未取得: 取得してもカードが無く接続不可)']
    if ins.get('errors'): why+=ins['errors']
    if ins.get('frames') is None: why.append('NO_INSPECTION_DATA')
    elif ins['frames']<2: why.append('SINGLE_FRAME')
    elif ins.get('loopCount') is None: why.append('NO_LOOP')
    if ins.get('sha256') and len(bysha[ins['sha256']])>1: why.append('DUPLICATE:'+','.join(x for x in bysha[ins['sha256']] if x!=rec['file']))
    if not fx: return ('BLOCKED' if why else 'HOLD_NO_FIXTURE_MOVE'),why+['公開用データに対応する技IDなし']
    # 強度(弱/中/強/OD)の整合: ファイル名/slugと公式技名
    a=strength_in_slug(rec['file'].lower()); b=strength_in_name(fx[1]['name'])
    if a and b and a!=b: why.append(f'STRENGTH_MISMATCH:file={a},official={b}')
    if why: return 'BLOCKED',why
    if rec.get('role') in('unconfirmed_mapping','suspected_old','alt_version','no_move_match'): return 'HOLD_'+rec['role'].upper(),[]
    if rec.get('origin')=='made_from_approved_mp4' or fx[1]['slug'] in MP4SLUG or fx[1].get('media'): return 'MP4_KEPT',['MP4あり: GIFは上乗せしない']
    return 'CONNECTABLE_CANDIDATE',[]

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--existing'); ap.add_argument('--made'); ap.add_argument('--incoming'); ap.add_argument('--out',required=True); a=ap.parse_args()
    recs=[]
    if a.existing:
        for e in json.load(open(a.existing))['entries']:
            if e['assetType']!='gif' or e['source']!='drive': continue
            ni=e.get('inspection')=='not_inspected_over_10MB'
            ins=dict(notInspected=True) if ni else dict(sha256=e.get('sha256'),frames=e.get('frames'),width=e.get('width'),height=e.get('height'),durationMs=e.get('durationMs'),loopCount=e.get('loop'),errors=[])
            if e['character']=='luke' and not ni and ins['loopCount'] is None and e.get('stage1Status'): ins['loopCount']=0   # Stage1検査で確認済み
            recs.append(dict(origin='drive_existing',character=e['character'],file=e['fileName'],moveId=e.get('moveId'),moveSlug=e.get('moveSlug'),inspect=ins,
                             role={'NO_MOVE_MATCH':'no_move_match','HOLD_UNCONFIRMED_MAPPING':'unconfirmed_mapping','EXCLUDED_SUSPECTED_OLD':'suspected_old','NOT_USED_ALT_VERSION':'alt_version'}.get(e.get('stage1Status'))))
    if a.made:
        for i in json.load(open(a.made))['items']:
            ins=inspect_gif('/mnt/user-data/outputs/gif-production-20261116/'+i['gif'])
            recs.append(dict(origin='made_from_approved_mp4',character=i['character'],file=os.path.basename(i['gif']),moveId=i['moveId'],moveSlug=i['moveSlug'],inspect=ins,sourceVideo=i['sourceMp4']))
    if a.incoming:
        for it in json.load(open(os.path.join(a.incoming,'intake.json'))):
            recs.append(dict(origin='incoming',character=it['character'],file=it['file'],moveId=it.get('moveId'),moveSlug=it.get('moveSlug'),sourceVideo=it.get('sourceVideo'),inspect=inspect_gif(os.path.join(a.incoming,it['file']))))
    bysha=collections.defaultdict(list)
    for r in recs:
        if r['inspect'].get('sha256'): bysha[r['inspect']['sha256']].append(r['file'])
    for r in recs: r['connectionClass'],r['reasons']=classify(r,bysha)
    os.makedirs(a.out,exist_ok=True)
    json.dump(dict(generated='2026-11-16',note='検査合格は承認ではない。目視未承認のまま。',count=len(recs),summary=dict(collections.Counter(r['connectionClass'] for r in recs)),records=recs),open(a.out+'/gif-intake-report.json','w'),ensure_ascii=False,indent=1)
    print(len(recs),dict(collections.Counter(r['connectionClass'] for r in recs)))
    return recs
if __name__=='__main__': main()
