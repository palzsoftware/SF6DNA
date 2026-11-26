#!/usr/bin/env python3
"""V26: approved-14 Player bindings (Development drafts only). Idempotent. Usage: build_player14.py <PLAYER14_CONSOLIDATED_REVIEW.json>
Rules: main only when the official profile states it; dated/long-time main carries its basis; no sub; no SNS; current team and event team are separate facts;
achievements/videos/research stay out of runtime (HOLD: event-ID dedup, playback check). All rows PENDING. Production UUIDs are never used."""
import json,sys,pathlib
DEV='vvsknbmlfvvnrmgtyhbf'; NOTE='V26承認14名(2026-11-26)。'
ROOT=pathlib.Path(__file__).resolve().parents[2]/'v2-web/src/data/player-research'
# Development draft UUIDs read from the Development DB on 2026-11-26 (read-only SELECT).
DEV_ID={'xiaohai':'77d50854-04a2-46be-88fb-f86fe9d9177d','vxbao':'7e1a49d6-e495-488b-b8ff-629f45dcc8f8','haitani':'6fcc0db3-10bc-4d23-8701-2b00349ccab0',
'angrybird':'15140d85-7ef7-4fea-b49f-60d3006ce0eb','nl':'4447cd18-265a-4c06-8fa5-b771b06d4cb9','nuckledu':'6838bbb3-6c71-4170-bb7e-15d25717fc7e','juicyjoe':'5f568260-4453-49f5-882b-fe0f3dd30da3'}
DEV_NAME={'haitani':'ハイタニ / HAITANI'}
src=json.load(open(sys.argv[1],encoding='utf-8'))
p=ROOT/'team-bindings.json'; rows=json.load(open(p,encoding='utf-8'))
rows=[r for r in rows if not str(r.get('note','')).startswith(NOTE)]
pending=[]
for s in src:
    slug=s['targetSlug']
    if not s.get('approvedForPageCreation'): continue
    facts=[]; other=[]
    for u in s.get('usageEvidence',[]):
        role=u['role']; ch='、'.join(u['characters'])
        if role=='OFFICIAL_PROFILE_MAIN': facts.append({'label':'メインキャラクター','value':ch})
        elif role=='OFFICIAL_PROFILE_LONGTIME_MAIN': facts.append({'label':'メインキャラクター','value':ch+'（公式プロフィールの記載・2026-11-26確認）'})
        elif role.startswith('DATED_MAIN'): pass  # kakeru: existing user-provided row is kept as is
        elif role.endswith('EVENT_USAGE'): other+= [c for c in u['characters'] if c not in other]  # existing label contract: event usage only
        # profile "other/representative" usage and reported/showmatch usage stay HOLD (no existing label; never promoted to main/sub)
    mains={c for f in facts for c in f['value'].split('（')[0].split('、')}
    other=[c for c in other if c not in mains]
    if other: facts.append({'label':'主要大会での使用キャラクター','value':'、'.join(other)})
    if s.get('currentTeam'): facts.append({'label':'現在の所属','value':s['currentTeam']})
    et=s.get('eventTeamEvidence') or {}
    if et.get('team'): facts.append({'label':f"大会登録チーム（{et['event']}）",'value':et['team']})
    if slug=='kakeru': continue   # existing Development row (user-provided main) stays unchanged
    if slug in DEV_ID:
        rows.append({'playerId':DEV_ID[slug],'playerSlug':slug,'publicationApproval':'PENDING','environment':DEV,
          'display':{'slug':slug,'name':DEV_NAME.get(slug,s['displayName']),'intro':None,'facts':facts,'sections':[]},
          'note':NOTE+'開発draftを再利用。本番UUIDなし。subは正式確認なし、大会実績・動画・研究は照合待ちのため未接続。PENDINGのため非表示。'})
    else:
        pending.append({'targetSlug':slug,'displayName':s['displayName'],'countryCodeCandidate':s.get('countryCodeCandidate'),'identityReview':s.get('identityReview'),
          'state':'HOLD_NO_DEV_ROW','factsCandidate':facts,'publicationApproval':'PENDING'})
json.dump(rows,open(p,'w',encoding='utf-8'),ensure_ascii=False,indent=2); open(p,'a').write('\n')
out=ROOT.parents[2]/'docs/v26'; out.mkdir(parents=True,exist_ok=True)
json.dump(pending,open(out/'player14-pending-registration.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
print('bound',sum(1 for r in rows if str(r.get('note','')).startswith(NOTE)),'pending',[x['targetSlug'] for x in pending])
