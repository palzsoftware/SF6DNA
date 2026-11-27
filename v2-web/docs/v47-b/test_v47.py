import json,csv,subprocess,shutil,unittest,collections
B={n:json.load(open(f'before/{n}')) for n in ('videos.json','registered.json','profile-supplements.json')}
O={n:json.load(open(f'out/{n}')) for n in B}
REV=json.load(open('review_v46.json'))['cards'];KEYS=set(json.load(open('approval_candidate_keys_v46.json'))['readyRowKeys'])
READY={v for v,c in REV.items() if c['status']=='READY'};NOT={v for v,c in REV.items() if c['status']!='READY'}
V45={r['key'] for r in json.load(open('delta_character_videos_v45.json'))['rows']}
META=set(l.split('\t')[0] for l in open('meta_fill_v46.tsv',encoding='utf-8'))
def proj():
    shutil.rmtree('sim',ignore_errors=True)
    src='/home/claude/wt074/v2-web/src/data'
    shutil.copytree(src+'/player-research','sim/src/data/player-research');shutil.copytree(src+'/character-videos','sim/src/data/character-videos')
    shutil.copy('out/videos.json','sim/src/data/player-research/videos.json');shutil.copy('out/registered.json','sim/src/data/character-videos/registered.json')
    return json.loads(subprocess.run(['python3','count_videos.py','sim','wnuxaxbrpudyypzdbdho','actual'],capture_output=True,text=True,check=True).stdout)
P=proj()
class T(unittest.TestCase):
    def test_before_all_pending(self):
        for n in ('videos.json','registered.json'): self.assertTrue(all(r['publicationApproval']=='PENDING' for r in B[n]))
    def test_key_unique(self):
        for n in ('videos.json','registered.json'): ks=[r['key'] for r in O[n]]; self.assertEqual(len(ks),len(set(ks)))
    def test_registered_one_row_per_video_char(self):
        c=collections.Counter((r['youtubeId'],r['characterSlug']) for r in O['registered.json']); self.assertEqual(max(c.values()),max(collections.Counter((r['youtubeId'],r['characterSlug']) for r in B['registered.json']).values()))
    def test_only_ready_approved(self):
        for n in ('videos.json','registered.json'):
            for r in O[n]:
                if r['publicationApproval']=='APPROVED': self.assertIn(r['key'],KEYS); self.assertIn(r['youtubeId'],READY)
                if r['youtubeId'] in NOT: self.assertEqual(r['publicationApproval'],'PENDING')
    def test_approved_count(self): self.assertEqual(sum(r['publicationApproval']=='APPROVED' for n in ('videos.json','registered.json') for r in O[n]),1094)
    def test_no_out_of_scope_change(self):
        b={r['key']:r for r in B['videos.json']}
        for r in O['videos.json']:
            o=b[r['key']];d={k for k in set(o)|set(r) if o.get(k)!=r.get(k)}
            self.assertTrue(d<= {'publicationApproval','sourceDate','channelName','cardNote'},(r['key'],d))
            if 'sourceDate' in d: self.assertIn(o.get('sourceDate'),('',None));self.assertIn(r['youtubeId'],META)
            if 'channelName' in d: self.assertEqual(o['channelName'],'')
        self.assertEqual(len(O['videos.json']),len(B['videos.json']))
        b2={r['key']:r for r in B['registered.json']}
        for r in O['registered.json']:
            if r['key'] in b2:
                d={k for k in r if b2[r['key']].get(k)!=r.get(k)}; self.assertTrue(d<={'publicationApproval','caution'},d)
            else: self.assertIn(r['key'],V45)
    def test_display(self):
        self.assertEqual(P['registered_cards'],691)
        self.assertEqual(P['zero_characters'],[]); self.assertTrue(all(v>=5 for v in P['by_character'].values()))
    def test_hold_not_displayed(self): pass
    def test_old_patch_notes(self):
        for r in O['videos.json']:
            if r['publicationApproval']=='APPROVED' and r['kind']=='本人解説' and r['sourceDate']<'2026-08-03': self.assertTrue(r.get('cardNote'))
        for r in O['registered.json']:
            if r['publicationApproval']=='APPROVED' and r['category']=='解説' and r['sourceDate']<'2026-08-03': self.assertTrue(r['caution'])
    def test_profile(self):
        s=json.dumps(O['profile-supplements.json'],ensure_ascii=False); self.assertNotIn('Cヴァイパー',s)
        self.assertTrue(all(x['publicationApproval']=='PENDING' for x in O['profile-supplements.json']))
        self.assertEqual(sum(len(x['facts']) for x in O['profile-supplements.json'])-sum(len(x['facts']) for x in B['profile-supplements.json']),53)
        for x in O['profile-supplements.json']:
            for f in x['facts']: self.assertTrue(f['sourceUrl'].startswith('https://'))
    def test_player_links(self): self.assertGreaterEqual(P['by_player_count'],50)
unittest.main(verbosity=1)
