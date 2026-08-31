update counters co
set
  summary = o.name_ja||'対面を接近阻止・確反候補・対空/特殊軌道・画面端防御・弾/設置の5項目へ分解した。',
  method = 'jp-vs-'||o.slug||'-approach / punish / air / corner / zoning をTrainingで再現し、確定・相打ち・読み・不成立を区別する。',
  benefit = o.name_ja||'戦の対戦前確認からトレモ再検証までを一つの親対面として辿れる。',
  risk = '距離、連携間隔、DI、弾相互作用、ODアムネジア後状況など実機依存項目はreviewedのまま扱う。',
  conditions = '2026.08.03以降。子Counter5件を参照。実機確認前はverified/publishedへ昇格しない。',
  updated_at = now()
from characters d, characters o
where co.defender_character_id=d.id
  and d.slug='jp'
  and co.opponent_character_id=o.id
  and co.slug in (
    'jp-matchup-akuma','jp-matchup-ken','jp-matchup-cammy','jp-matchup-m-bison',
    'jp-matchup-mai','jp-matchup-luke','jp-matchup-juri','jp-matchup-rashid'
  )
  and co.status='draft'
  and co.verification_status='reviewed';
