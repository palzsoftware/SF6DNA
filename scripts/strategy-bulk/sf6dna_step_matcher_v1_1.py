"""SF6DNA step matcher v1.1 CANDIDATE (separate from v1; v1 stays the current spec until approved).
Changes vs v1:
 1. Exact full official name is resolved first; the "name without trailing (…)" index is only a fallback.
    → base name 「強 キャノンスパイク」 no longer collides with 「強 キャノンスパイク（ホールド）」. Version rows keep their own names.
 2. Standalone 「DR」 = SYSTEM_ACTION DRIVE_RUSH_UNSPECIFIED (same as ドライブラッシュ/ラッシュ alone).
 3. Counter conditions split: CH/カウンター/カウンターヒット → COUNTER_HIT ; PC/パニカン/パニッシュカウンター → PUNISH_COUNTER (v1 merged them).
 4. Same-label hits that are a known duplicate listing of one move (normal list + special list) resolve to the normal-list row.
 5. Derivation strength inheritance (opt-in): a derived step without strength resolves only if the official TXT has exactly
    one row named "<parent strength> <derived name>" for the strength of the immediately preceding resolved step. Otherwise HOLD.
"""
import re, csv, collections
from sf6dna_step_matcher_v1 import Matcher as V1, N, WS
COND11=[('PUNISH_COUNTER',r'[（(]?(PC|パニカン|パニッシュカウンター)[）)]?$'),('COUNTER_HIT',r'[（(]?(CH|カウンターヒット|カウンター)[）)]?$')]
class Matcher(V1):
    def __init__(self, records, alias_rows, duplicate_pairs_csv=None):
        super().__init__(records, alias_rows)
        self.exact=collections.defaultdict(set)
        for k,v in records.items(): self.exact[(k.split(':')[0],N(v['raw'].get('skill')))].add(k)
        self.dup_keep={}
        if duplicate_pairs_csv:
            for p in csv.DictReader(open(duplicate_pairs_csv)):
                if p['class'].startswith('SAME_MOVE'):
                    a,b=p['keyA'],p['keyB']; full=a if ('（' in p['nameA'] or '(' in p['nameA']) else b
                    self.dup_keep[frozenset((a,b))]=full
    def step(self, slug, raw, prev_key=None):
        ch=WS.get(slug,slug); s=raw.strip(); tags=[]
        for tag,p in COND11:
            if re.search(p,s): tags.append(tag); s=re.sub(p,'',s).strip(); break
        if N(s)=='DR': return {'kind':'SYSTEM_ACTION','tags':tags+['DRIVE_RUSH_UNSPECIFIED'],'key':None,'reason':'システム行動（DR単独）'}
        hit=self.exact.get((ch,N(s)),set())
        if len(hit)==1: return {'kind':'MOVE','tags':tags,'key':next(iter(hit)),'reason':'公式名完全一致（全文）'}
        r=super().step(slug,s)
        r['tags']=tags+r['tags']
        if r['kind']=='HOLD' and r['reason'].startswith('公式ラベルが0件または複数'):
            m=re.fullmatch(r'(立ち|しゃがみ|屈|前|後ろ|後)?([1-9])?(弱|中|強)(P|K)',N(s))
            if m:
                d=m.group(2) or {'立ち':'5','しゃがみ':'2','屈':'2','前':'6','後ろ':'4','後':'4'}.get(m.group(1) or '')
                S2={'弱':'L','中':'M','強':'H'};hits=self.labels.get((ch,f'({d}{S2[m.group(3)]}{m.group(4)})'),set())
                keep=self.dup_keep.get(frozenset(hits)) if len(hits)==2 else None
                if keep: return {'kind':'MOVE','tags':r['tags']+['DUPLICATE_LISTING'],'key':keep,'reason':'重複掲載の同一技→通常技一覧の行'}
        if r['kind']=='HOLD' and prev_key:
            pm=re.match(r'^(OD|弱|中|強)',N(self.r[prev_key]['raw'].get('skill')))
            if pm and not re.match(r'^(OD|弱|中|強)',N(s)):
                inh=self.exact.get((ch,N(pm.group(1)+s)),set())
                if len(inh)==1: return {'kind':'MOVE','tags':r['tags']+['STRENGTH_INHERITED'],'key':next(iter(inh)),'reason':'派生の強度引継ぎ（公式に強度別の派生行が1つ）'}
        return r
    def card(self, slug, command):
        steps=[x.strip() for x in re.split(r'→|＞|>',command or '') if x.strip()]
        res=[];prev=None
        for st in steps:
            x=self.step(slug,st,prev);res.append((st,x))
            if x['kind']=='MOVE': prev=x['key']
        own=[r for _,r in res if r['kind']!='OPPONENT_MOVE']
        v='COUNTER_TARGET_ONLY' if not own and res else 'MATCHED' if own and all(r['kind'] in ('MOVE','VOCAB_ONLY','SYSTEM_ACTION') for r in own) else 'NOT_MATCHED'
        return v,res
