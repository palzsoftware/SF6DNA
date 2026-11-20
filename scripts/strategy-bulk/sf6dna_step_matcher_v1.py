"""SF6DNA unified strategy-step matcher v1 (Claude Code① / ② shared spec). Pure, deterministic, no inference.
Inputs: official TXT canonical records, confirmed alias dictionary (single-move rows only).
A card is MATCHED only if every own-character step resolves to exactly one official row or is pure vocabulary.
"""
import re, unicodedata, collections
N=lambda s: re.sub(r'\s+','',unicodedata.normalize('NFKC',s or ''))
WS={'dee-jay':'deejay'}
S2={'弱':'L','中':'M','強':'H'}
OPP=re.compile(r'^相手の技[:：]')
# condition vocabulary (removed before move resolution; recorded as tags)
COND=[('PUNISH_COUNTER',r'[（(]?(PC|CH|パニカン|パニッシュカウンター|カウンターヒット)[）)]?$'),
      ('WHIFF',r'[（(]?空振り[）)]?'),('MEATY_LAST_ACTIVE',r'最終持続重ね'),('MEATY',r'持続重ね|持続当て|^持続(?=\S)'),
      ('OKI_OVERLAP',r'重ね'),('FASTEST',r'最速'),('BUFFER',r'仕込み'),('DELAY',r'遅らせ|ディレイ'),('REPEAT_N',r'×\d+'),('WALL',r'壁$')]
PRE=[('DRIVE_RUSH_CANCEL',r'^(キャンセルドライブラッシュ|キャンセルラッシュ|Cラッシュ|CDR|CR)'),('DRIVE_RUSH_PARRY',r'^(パリィドライブラッシュ|パリィラッシュ|生ラッシュ)'),
     ('DRIVE_RUSH_UNSPECIFIED',r'^(ドライブラッシュ|ラッシュ|DR)(?!$)')]
SYSTEM={'歩き':'WALK','微歩き':'WALK_SHORT','前歩き':'WALK_FORWARD','ガード':'GUARD','しゃがみガード':'GUARD_CROUCH','前ステ':'FORWARD_STEP','前ステップ':'FORWARD_STEP',
        '前方ステップ':'FORWARD_STEP','バックステップ':'BACK_STEP','後方ステップ':'BACK_STEP','前ジャンプ':'JUMP_FORWARD','垂直ジャンプ':'JUMP_NEUTRAL','後ろジャンプ':'JUMP_BACK',
        'ドライブラッシュ':'DRIVE_RUSH_UNSPECIFIED','ラッシュ':'DRIVE_RUSH_UNSPECIFIED','パリィドライブラッシュ':'DRIVE_RUSH_PARRY','生ラッシュ':'DRIVE_RUSH_PARRY','キャンセルドライブラッシュ':'DRIVE_RUSH_CANCEL','CDR':'DRIVE_RUSH_CANCEL','Cラッシュ':'DRIVE_RUSH_CANCEL','ドライブパリィ':'DRIVE_PARRY'}
POS={'立ち':'5','しゃがみ':'2','屈':'2','前':'6','後ろ':'4','後':'4'}
class Matcher:
    def __init__(self, records, alias_rows):
        self.r=records; self.names=collections.defaultdict(set); self.labels=collections.defaultdict(set); self.cmd=collections.defaultdict(list)
        for k,v in records.items():
            ch=k.split(':')[0]; sk=v['raw'].get('skill') or ''
            self.names[(ch,N(sk))].add(k); self.names[(ch,N(re.sub(r'[（(][^）)]*[）)]$','',sk)))].add(k)
            self.labels[(ch,(v['raw'].get('name') or '').upper())].add(k); self.cmd[ch].append((k,v['raw'].get('command') or '',(v['raw'].get('name') or '').upper()))
        self.alias={(a['character'],N(a['alias'])):a['ws5Key'] for a in alias_rows if a.get('resolution','SINGLE_MOVE')=='SINGLE_MOVE' and ';' not in a['ws5Key']}
    def step(self, slug, raw):
        ch=WS.get(slug,slug); s=unicodedata.normalize('NFKC',raw).strip(); tags=[]
        if OPP.match(s): return {'kind':'OPPONENT_MOVE','tags':[],'key':None,'reason':'相手の技（対策対象）。自キャラ手順から分離'}
        for tag,p in PRE:
            m=re.match(p,s)
            if m: tags.append(tag); s=s[m.end():].strip(); break
        for tag,p in COND:
            if re.search(p,s): tags.append(tag); s=re.sub(p,'',s).strip()
        t=N(s).replace('+','').replace('＋','')
        if re.fullmatch(r'DI',t):
            hit={k for k,c,l in self.cmd[ch] if l.startswith('(D_IMPACT')}
            return self._ok(tags,hit,'DI＝公式ドライブインパクト行') if len(hit)==1 else {'kind':'HOLD','tags':tags,'key':None,'reason':'DI行が一意でない'}
        m0=re.fullmatch(r'(SA[123]|CA)',t)
        if m0:
            hit={k for k in self.r if k.startswith(ch+':') and N(self.r[k]['raw'].get('skill')).startswith(m0.group(1)) and not re.search(r'\[|【|Lv',self.r[k]['raw'].get('skill') or '')}
            return self._ok(tags,hit,'SA段の公式行が一意') if len(hit)==1 else {'kind':'HOLD','tags':tags,'key':None,'reason':'SA/CAの段・Lv違いが複数（特定不可）'}
        mp=re.fullmatch(r'([1-9](弱|中|強)(P|K))[（(][^）)]+[）)]',t)
        if mp: t=mp.group(1)
        if not t: return {'kind':'VOCAB_ONLY','tags':tags,'key':None,'reason':'条件/システム語彙のみ'}
        if t in SYSTEM: return {'kind':'SYSTEM_ACTION','tags':tags+[SYSTEM[t]],'key':None,'reason':'システム行動（技IDではない）'}
        hit=self.names.get((ch,t),set())
        if len(hit)==1: return self._ok(tags,hit,'公式名完全一致')
        if len(hit)>1: return {'kind':'HOLD','tags':tags,'key':None,'reason':'同名の公式行が複数（段/版を特定できない）'}
        if (slug,t) in self.alias: return self._ok(tags,{self.alias[(slug,t)]},'確定別名（単一技）')
        m=re.fullmatch(r'(立ち|しゃがみ|屈|前|後ろ|後)?([1-9])?(弱|中|強)(P|K)',t)
        if m:
            d=m.group(2) or (POS[m.group(1)] if m.group(1) else None)
            if d is None: return {'kind':'HOLD','tags':tags,'key':None,'reason':'位置未指定のボタン単体（推測で立ちにしない）'}
            hit=self.labels.get((ch,f'({d}{S2[m.group(3)]}{m.group(4)})'),set())
            return self._ok(tags,hit,'テンキー/位置語→公式ラベル') if len(hit)==1 else {'kind':'HOLD','tags':tags,'key':None,'reason':'公式ラベルが0件または複数'}
        if t in ('前投げ','後ろ投げ'):
            want='4 +' if t=='後ろ投げ' else 'N or 6'
            hit={k for k,c,l in self.cmd[ch] if l.startswith('(THROW') and want in c}
            return self._ok(tags,hit,'公式コマンドで投げ方向を特定') if len(hit)==1 else {'kind':'HOLD','tags':tags,'key':None,'reason':'投げを一意特定できない'}
        return {'kind':'HOLD','tags':tags,'key':None,'reason':'通称・強度/段/派生未指定・部分一致（根拠なし）'}
    def _ok(self,tags,hit,why): return {'kind':'MOVE','tags':tags,'key':next(iter(hit)),'reason':why} if len(hit)==1 else {'kind':'HOLD','tags':tags,'key':None,'reason':'候補なし'}
    def card(self, slug, command):
        steps=[x.strip() for x in re.split(r'→|＞|>',command or '') if x.strip()]
        res=[(st,self.step(slug,st)) for st in steps]
        own=[r for _,r in res if r['kind']!='OPPONENT_MOVE']
        verdict='COUNTER_TARGET_ONLY' if not own and res else 'MATCHED' if own and all(r['kind'] in ('MOVE','VOCAB_ONLY','SYSTEM_ACTION') for r in own) else 'NOT_MATCHED'
        return verdict,res
