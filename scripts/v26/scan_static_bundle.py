#!/usr/bin/env python3
"""P0-5 local scan of client-delivered files (.next/static + public). Prints kinds and counts only, never matched values. Exit 1 on any finding."""
import re,sys,pathlib,base64,json
PAT={'sb_secret':r'sb_secret_[A-Za-z0-9_-]{8,}','service_role_word':r'service_role','db_url':r'postgres(?:ql)?://[^\s"\'`]+:[^\s"\'`]+@','private_key':r'-----BEGIN [A-Z ]*PRIVATE KEY-----',
 'server_env_name':r'SF6DNA_(?:ARJUN_QA_PASSWORD|ARJUN_QA_SIGNING_KEY|WS5_TXT_PREVIEW)|SUPABASE_SERVICE_ROLE_KEY|YOUTUBE_DATA_API_KEY','generic_api_key':r'(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{16,}|AIza[0-9A-Za-z_-]{35}|ghp_[A-Za-z0-9]{36}'}
JWT=re.compile(r'eyJ[A-Za-z0-9_-]{10,}\.(eyJ[A-Za-z0-9_-]{10,})\.[A-Za-z0-9_-]{10,}')
roots=[pathlib.Path(a) for a in sys.argv[1:]]; n=0; size=0; found={}; refs=set(); jwt_roles={}
for root in roots:
    for f in root.rglob('*'):
        if not f.is_file() or f.suffix in ('.png','.jpg','.jpeg','.gif','.webp','.mp4','.webm','.woff','.woff2','.ico','.avif'): continue
        t=f.read_text('utf-8','replace'); n+=1; size+=len(t)
        for k,p in PAT.items():
            c=len(re.findall(p,t))
            if c: found[k]=found.get(k,0)+c; found.setdefault('_files',set()).add(str(f)[-70:]+':'+k)
        for m in JWT.finditer(t):
            try: role=json.loads(base64.urlsafe_b64decode(m.group(1)+'=='*1)).get('role','?')
            except Exception: role='undecodable'
            jwt_roles[role]=jwt_roles.get(role,0)+1
        refs|=set(re.findall(r'([a-z0-9]{20})\.supabase\.co',t))
bad={k:v for k,v in found.items() if k!='_files'}
if any(r!='anon' for r in jwt_roles): bad['jwt_non_anon']=jwt_roles
print('files',n,'chars',size,'| supabase refs',sorted(refs),'| jwt roles',jwt_roles or 'none','| findings',bad or 'none')
for x in sorted(found.get('_files',[])): print('  at',x)
print('RESULT:','PASS' if not bad else 'FAIL'); sys.exit(1 if bad else 0)
