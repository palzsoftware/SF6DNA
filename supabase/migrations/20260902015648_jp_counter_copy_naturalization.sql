
do $check$
declare parent_rows integer; generic_rows integer;
begin
  select count(*) into parent_rows from public.counters
  where status='draft' and valid_to_patch_id is null and slug like 'jp-matchup-%';
  select count(*) into generic_rows from public.counters
  where status='draft' and valid_to_patch_id is null and slug like 'jp-vs-%'
    and conditions ~ '^2026\.08\.03以降。対象=.+。実機確認前はverified/publishedへ昇格しない。$';
  if parent_rows<>30 or generic_rows<>110 then
    raise exception 'JP copy precondition failed: parents %, generic %',parent_rows,generic_rows;
  end if;
end
$check$;

update public.counters c
set title='JP使用時の'||oc.name_ja||'対策',
 summary=oc.name_ja||'戦で確認したい内容を、接近阻止、確定反撃候補、対空・特殊軌道、画面端防御、飛び道具・設置技の5項目に分けています。',
 method='接近阻止、確定反撃、対空、画面端、遠距離戦の関連項目をトレーニングモードで再現し、結果を「確定」「相打ち」「読み合い」「不成立」に分けて確認します。',
 benefit=oc.name_ja||'戦で確認したいポイントと、トレーニングモードでの再確認項目を一つのページで確認できます。',
 risk='距離、連携の間隔、ドライブインパクト、飛び道具同士の相互作用、ODアムネジア後の状況は、実機確認が終わるまで検証済みとは扱いません。',
 conditions='2026.08.03版以降が対象です。関連する5件の対策を参照し、実機確認が終わるまでは未検証として扱います。',
 updated_at=now()
from public.characters oc
where c.opponent_character_id=oc.id
 and c.status='draft' and c.valid_to_patch_id is null and c.slug like 'jp-matchup-%';

update public.counters
set benefit=regexp_replace(benefit,
 '^(.+)戦の対面固有判断を、旧共通テンプレートではなく再現可能な項目として残せる。$',
 '\1戦で必要な判断を、状況ごとに再現して確認できます。'),
 conditions=regexp_replace(conditions,
 '^2026\.08\.03以降。対象=(.+)。実機確認前はverified/publishedへ昇格しない。$',
 '2026.08.03版以降の\1戦が対象です。実機確認が終わるまでは未検証として扱います。'),
 method=case method
  when 'verified Frameは入口としてのみ使用し、4F技・中距離反撃・SA候補を実距離で再現する。'
   then '検証済みのフレーム情報を目安に、4F技、中距離からの反撃、SAを実際の間合いで確認します。'
  when '相手カードの勝ち筋・距離別行動を別スロットに録画し、JP側回答を確定/相打ち/読み/不成立へ分類する。'
   then '相手の主な勝ち筋と距離別の行動を分けて記録し、JP側の対応を「確定」「相打ち」「読み合い」「不成立」に分類します。'
  when '端位置・Drive・SA・相手固有リソースを固定し、防御択ごとの結果を最低20局面比較する。'
   then '画面端の位置、Dゲージ、SAゲージ、相手固有のリソースを同じ条件にそろえ、防御手段ごとの結果を20通り以上比較します。'
  when '通常ジャンプと特殊軌道を20回以上ランダム再生し、正答率と誤2HP/空振り後被弾を記録する。'
   then '通常ジャンプと特殊軌道を20回以上ランダム再生し、正しく対空できた割合と、しゃがみ強Pの誤入力や空振り後の被弾を記録します。'
  when '遠・中遠・中距離の最低3位置で、JP遠距離択と相手固有行動を各10回以上比較する。'
   then '遠距離、中遠距離、中距離の3か所以上で、JPの遠距離手段と相手固有の行動を各10回以上比較します。'
  else method end,
 risk=case risk
  when '弾相互作用、DI、アーマー、反射、軌道など実機依存の結果はreviewedのまま保持する。'
   then '飛び道具同士の相互作用、ドライブインパクト、アーマー、反射、軌道など、実機で結果が変わる項目は確認が終わるまで未検証として扱います。'
  when 'ODアムネジア投げ成立後は2026.08.03変更後仕様で扱う。未確認の連携間隔や1F割り込みを確定しない。'
   then 'ODアムネジアで投げを取った後は、2026.08.03版以降の仕様で確認します。未確認の連携間隔や1F技による割り込みは確定情報として扱いません。'
  when 'ガード差だけで確反を断定しない。距離・派生・強化状態・持続当ては実機確認前に確定しない。'
   then 'ガード時のフレーム差だけで確定反撃とは判断しません。距離、派生、強化状態、持続当ては実機確認後に確定します。'
  else risk end,
 updated_at=now()
where status='draft' and valid_to_patch_id is null and slug like 'jp-vs-%'
 and conditions ~ '^2026\.08\.03以降。対象=.+。実機確認前はverified/publishedへ昇格しない。$';

do $verify$
declare parents integer; generic integer;
begin
 select count(*) into parents from public.counters
 where status='draft' and valid_to_patch_id is null and slug like 'jp-matchup-%'
 and title like 'JP使用時の%対策'
 and conditions='2026.08.03版以降が対象です。関連する5件の対策を参照し、実機確認が終わるまでは未検証として扱います。';
 select count(*) into generic from public.counters
 where status='draft' and valid_to_patch_id is null and slug like 'jp-vs-%'
 and conditions ~ '^2026\.08\.03版以降の.+戦が対象です。実機確認が終わるまでは未検証として扱います。$';
 if parents<>30 or generic<>110 then
  raise exception 'JP copy verify failed: parents %, generic %',parents,generic;
 end if;
end
$verify$;

