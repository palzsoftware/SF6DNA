#!/usr/bin/env python3
"""JP22本を除く、技IDなし53本の再分類(読み取り専用。新規技データは作らない)。
分類:  A 既存技の別表記の可能性 / B 強度違い・OD違い・区分違い / C 派生技 / D 技データ不足 / E 素材名称だけでは識別不能 / F 共通システム技(今回の主対象外) / G 検証用画面・旧版(保留)
どれも『候補』であり、技IDの確定や承認ではない。出力: scripts/gif-intake/remaining-53-classification-20261116.json"""
import json,os,re,collections
ROOT=os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..')); D=ROOT+'/v2-web/src/data/'
J=lambda p:json.load(open(p,encoding='utf-8-sig'))
FIX=J(D+'ALL_CHARACTER_RELEASE_FIXTURE_20261004.json')['characters']; BYSLUG={m['slug']:m for c in FIX.values() for m in c['moves']}
ANA=[a for a in J(ROOT+'/scripts/gif-intake/no-move-id-analysis-20261116.json') if not(a['character']=='jp' and a['category']=='識別名不一致')]
REG=J(D+'SF6DNA_WS5_MEDIA_KEY_REGISTRY_20261026.json'); OFF=J(D+'SF6DNA_WS5_OFFICIAL_TXT_CANONICAL_20261026.json')
def official_same_command(ch,cmd):
    out=[]
    for x in REG:
        if x['characterSlug']==ch and ':web:' in x['sourceRecordKey'] and (OFF.get(x['sourceRecordKey'],{}).get('raw',{}) or {}).get('command')==cmd: out.append(x['officialMoveName'])
    return out
A,B,C,Dd,E,Fz,G='A 既存技の別表記の可能性','B 強度違い・OD違い・区分違い','C 派生技','D 技データ不足','E 素材名称だけでは識別不能','F 共通システム技(今回対象外)','G 検証用画面・旧版(保留)'
U_ALIAS='公式名・コマンドを公式リストで再確認し、別名表(jp-move-aliases.tsと同形式)へ登録する承認。映像で技の動きを確認'
U_NEW='該当する技行を公開用データへ追加する方針の承認(今回は追加しない)、または既存カードへ統合する判断'
U_VIS='映像で技を特定する(目視)'
RULE={ # file -> (分類, 候補slug, 根拠, 解除条件)
 # ---- Luke ----
 **{f:(C,s,'公式名の（ホールド）/（ジャスト）は溜め派生。公開用データには基本技のみで派生の行がない',U_NEW) for f,s in [('22_36-luke-light-flash-knuckle-charged.gif','luke-flash-knuckle-l'),('22_37-luke-light-flash-knuckle-perfect.gif','luke-flash-knuckle-l'),('22_39-luke-medium-flash-knuckle-charged.gif','luke-flash-knuckle-m'),('22_40-luke-medium-flash-knuckle-perfect.gif','luke-flash-knuckle-m'),('22_42-luke-heavy-flash-knuckle-charged.gif','luke-flash-knuckle-h'),('22_43-luke-heavy-flash-knuckle-perfect.gif','luke-flash-knuckle-h'),('22_48-luke-aerial-flash-knuckle-charged.gif','luke-aerial-flash-knuckle')]},
 '22_49-luke-od-aerial-flash-knuckle.gif':(B,'luke-aerial-flash-knuckle','公開用データにはエアリアルフラッシュナックルの非OD版のみ。OD版の行がない',U_NEW),
 'luke-od-avenger.gif':(B,'luke-avenger','公開用データのアベンジャーに強度/OD区分がない(OD版が別カードか同一カードか未確認)',U_NEW),
 'luke-od-no-chaser.gif':(B,'luke-no-chaser','同上(OD版の区分なし)',U_NEW),
 'luke-od-impaler.gif':(B,'luke-impaler','OD版の区分なし。公式表記「インパラー」と公開用データ「インペイラー」の表記差もあり',U_NEW),
 '22_64-luke-ca-pale-rider.gif':(B,'luke-sa3-pale-rider','CAはSA3と同コマンドだが体力25%以下の条件つき。公開用データにはSA3のみでCAの区分がない',U_NEW),
 '22_23-luke-double-impact-followup.gif':(A,'luke-forward-hp-hp','公式「ダブルインパクト（2段目）」6+HP>HP と、公開用データ「前強P・強P」→ + 強P ＞ 強P はコマンドが同一(名称は不一致)',U_ALIAS),
 '22_65-luke-sweeper.gif':(A,'luke-forward-throw','公式「スウィーパー」(近距離でN or 6+LPLK)=前投げの入力。公開用データ「前投げ」は弱P+弱K。名称不一致',U_ALIAS),
 '22_66-luke-scrapper.gif':(A,'luke-back-throw','公式「スクラッパー」(近距離で4+LPLK)=後ろ投げの入力。公開用データ「後ろ投げ」は←+弱P+弱K。名称不一致',U_ALIAS),
 **{f:(Fz,None,'共通システム技(公開用データに該当行なし)。今回の主対象外',U_VIS+'(システム素材の扱いを別途決める)') for f in ['22_67-luke-forward-dash.gif','22_69-luke-muzzle-flash.gif','22_72-luke-drive-parry.gif','22_75-luke-parry-drive-rush.gif','22_76-luke-cancel-drive-rush.gif']},
 # ---- Manon ----
 **{f:(A,s,'公式名の括弧注記（メダルLvに応じて動作が変化）を除くと、公開用データの技名と区分(弱/中/強/OD)まで一致。ファイル名のslugだけが異なる',U_ALIAS) for f,s in [('manon-light-manege-dore.gif','manon-manege-l'),('manon-medium-manege-dore.gif','manon-manege-m'),('manon-heavy-manege-dore.gif','manon-manege-h'),('manon-od-manege-dore.gif','manon-manege-od'),('manon-od-renverse.gif','manon-renverse-od')]},
 'manon-grand-fouette-whiff.gif':(G,'manon-grand-fouette','制作台帳に「空振り・技カード採用保留」。ヒット版が必要(再撮影/再切出し候補)',U_VIS+'+ ヒット版の取得'),
 'manon-renverse-hit.gif':(E,None,'制作台帳に「強度未確定(投げ成立)」。弱/中/強 ランヴェルセのどれか不明',U_VIS+'(強度の特定)'),
 # ---- JP ----
 'jp-abnimach.gif':(A,'jp-embrace','公式「アブニマーチ」214+LK|MK|HK と公開用データ「エンブレイス」↓↙←+K はコマンドが同じ。名称は不一致(要公式確認)',U_ALIAS),
 'jp-od-abnimach.gif':(A,'jp-embrace-od','公式「OD アブニマーチ」214+LKMKHK と公開用データ「OD エンブレイス」↓↙←+KK。名称は不一致',U_ALIAS),
 'jp-od-departure-lp-mp.gif':(A,'jp-departure-od-l','ファイル名のボタン(LP+MP)が公開用データ「OD 弱 ヴィーハト」↓↙←+弱P+中P と同じ。名称の記載なし',U_ALIAS),
 'jp-od-departure-lp-hp.gif':(A,'jp-departure-od-m','ボタン(LP+HP)が「OD 中 ヴィーハト」↓↙←+弱P+強P と同じ',U_ALIAS),
 'jp-od-departure-mp-hp.gif':(A,'jp-departure-od-h','ボタン(MP+HP)が「OD 強 ヴィーハト」↓↙←+中P+強P と同じ',U_ALIAS),
 'jp-torbalan-feint.gif':(Dd,None,'フェイントの行が公開用データにも公式リストにも見当たらない',U_NEW+'、または映像で何の技かを特定'),
 '9_57-jp-ravina.gif':(A,'jp-forward-throw','公式「ラヴィーナ」(近距離でN or 6+LPLK)=前投げの入力。公開用データ「前投げ」。名称不一致',U_ALIAS),
 '9_58-jp-uragan.gif':(A,'jp-back-throw','公式「ウラガーン」(近距離で4+LPLK)=後ろ投げの入力。名称不一致',U_ALIAS),
 # ---- Juri ----
 '17_70-juri-sa1-sakkai-fuhazan.gif':(A,'juri-sa1','公開用データ「SA1 Sakkai Fuhazan」(ローマ字)とファイル名のローマ字が一致。公式「SA1 殺界風破斬」。コマンド表記が公開用データ(SP+H)と公式(236236+K)で異なる',U_ALIAS+'(コマンド表記の差の確認を含む)'),
 # ---- Ryu ----
 **{f:(Fz,None,'共通システム技(公開用データに該当行なし)。今回の主対象外',U_VIS+'(システム素材の扱いを別途決める)') for f in ['ryu-drive-impact.gif','ryu-drive-reversal.gif','ryu-drive-rush.gif','ryu-drive-parry.gif','ryu-cancel-drive-rush.gif']},
 **{f:(G,None,'フレームデータ/Modern「M」表示入りの検証用画面。技カード素材として不適の可能性',U_VIS+'(使用可否の判断)') for f in ['ryu-light-burnout-stats.gif','ryu-medium-burnout-stats.gif','ryu-heavy-burnout-stats.gif']},
 'ryu-jump-normal-hit.gif':(E,None,'通常技ヒット素材(今回の主対象外)。どのジャンプ技か不明',U_VIS),
 # ---- Jamie ----
 'jamie-the-devil-inside-held.gif':(C,'jamie-frame-039','公開用データ「魔身」(MP4あり)のホールド派生とみられるが、ホールド派生の行がない',U_NEW+'。MP4が優先されるためGIFは上乗せ不可'),
 **{f:(E,None,'流酔拳の複数段(1〜3段目)を連続収録した映像。単一の技行に対応づけられない。公開用データには段ごとの行(frame-041/043/045 ほか)がある',U_VIS+'+ 段ごとの切り出し') for f in ['jamie-lv4-light-freeflow-strikes-full.gif','jamie-lv4-medium-freeflow-strikes-full.gif','jamie-lv4-heavy-freeflow-strikes-full.gif']},
 **{f:(G,None,'旧版/候補の疑い(SUPERSEDED/candidate)。解像度・fpsが現行仕様と異なり、後継 jamie-lv4-flowing-drunken-fist-{lp,mp,hp}.gif がある',U_VIS+'(旧版として破棄してよいかの判断)') for f in ['SUPERSEDED_strength-unknown_Jamie_Lv4_FlowingDrunkenFist_CANDIDATE.gif','Jamie_Lv4_FlowingDrunkenFist_HP_candidate.gif','Jamie_Lv4_FlowingDrunkenFist_MP_candidate.gif','Jamie_Lv4_FlowingDrunkenFist_LP_candidate.gif']},
}
rows=[]
for a in ANA:
    cat,slug,why,unlock=RULE[a['file']]
    m=BYSLUG.get(slug) if slug else None
    rows.append(dict(character=a['character'],file=a['file'],originalGroup=a['category'].split('(')[0],officialName=a.get('officialName'),officialCommand=a.get('officialCommand'),
        subcategory=cat,candidateSlug=slug,candidateMoveId=m and m['id'],candidateName=m and m['name'],candidateCommand=m and (m['commands'] or [{}])[0].get('commandText'),
        officialSameCommandOthers=[n for n in official_same_command(a['character'],a.get('officialCommand')) if n!=a.get('officialName')] if a.get('officialCommand') else [],
        evidence=why,unlockCondition=unlock,status='HOLD'))   # 全件HOLD(候補)。技IDの確定・承認はしない
out=dict(generated='2026-11-16',note='全件HOLD。分類は候補であり、技IDの確定や公開承認ではない',total=len(rows),
    bySubcategory=dict(collections.Counter(r['subcategory'] for r in rows)),byOriginalGroup=dict(collections.Counter(r['originalGroup'] for r in rows)),rows=rows)
json.dump(out,open(ROOT+'/scripts/gif-intake/remaining-53-classification-20261116.json','w'),ensure_ascii=False,indent=1)
print(len(rows),out['bySubcategory'],out['byOriginalGroup'])
for r in rows:
    if r['officialSameCommandOthers']: print('同コマンドの他の公式技:',r['file'],r['officialSameCommandOthers'])
