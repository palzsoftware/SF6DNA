-- Idempotent seeds for short playstyle and character-fit diagnoses.
-- These are preference/profile diagnostics and do not publish gameplay facts.

do $$
declare
  d uuid;
  qid uuid;
  r record;
begin
  insert into public.diagnoses (slug,title,description,diagnosis_type,question_count,display_order,status)
  values ('playstyle-check','プレイスタイル診断','10問で、攻め・待ち・差し合い・セットプレイなど、自分が好みやすい戦い方の傾向を整理します。','playstyle',10,20,'published')
  on conflict (slug) do update set title=excluded.title,description=excluded.description,diagnosis_type=excluded.diagnosis_type,question_count=excluded.question_count,display_order=excluded.display_order,status=excluded.status
  returning id into d;
  delete from public.diagnosis_questions where diagnosis_id=d;

  for r in select * from (values
    (1,'試合開始後、まず取りたい行動は？','前に出て主導権を取る','aggression',3,'少し待って相手を見る','patience',3,'中距離で技を置く','footsies',3,'距離を離して準備する','keepout',3),
    (2,'一番気持ちいい勝ち方は？','近距離の連続攻めで押し切る','rushdown',3,'読み勝って投げを通す','grappling',3,'差し返しや確反を積み重ねる','footsies',3,'設置や起き攻めを組み立てる','setup',3),
    (3,'相手が慎重に待っているときは？','自分から崩しに行く','aggression',3,'さらに観察して癖を探す','patience',3,'けん制で少しずつ動かす','keepout',3,'位置を変えて角度を作る','mobility',3),
    (4,'キャラ操作で好みなのは？','少ない操作で判断に集中したい','simplicity',3,'難しくても選択肢が多い方がいい','technicality',3,'機動力の高い操作が好き','mobility',3,'セットプレイの手順を覚えるのが好き','setup',3),
    (5,'守りから攻めに切り替えるなら？','ガードして確実に反撃','defense_preference',3,'無理をしてでも位置を入れ替える','mobility',3,'相手の隙に一気に攻め込む','explosive',3,'距離を離して立て直す','keepout',3),
    (6,'中距離戦で重視したいのは？','歩きと通常技の間合い','footsies',3,'飛び道具や長い技で触らせない','keepout',3,'一気に近づくきっかけ','rushdown',3,'相手の行動を見る時間','patience',3),
    (7,'画面端に追い込んだときは？','投げと打撃で直接崩す','rushdown',3,'コマ投げなど大きい読み合いを狙う','grappling',3,'設置や連携で逃げ道を減らす','setup',3,'無理せず位置を維持する','patience',3),
    (8,'ゲージを使うなら？','早めに使って攻めを継続','aggression',3,'最大火力の機会まで残す','explosive',3,'守りや位置調整にも回す','defense_preference',3,'状況別に細かく使い分ける','technicality',3),
    (9,'練習で楽しいのは？','コンボと連携を詰める','technicality',3,'対空や確反を安定させる','defense_preference',3,'間合いと差し返しを磨く','footsies',3,'起き攻めパターンを増やす','setup',3),
    (10,'自分の理想に近いのは？','常に相手へ圧をかける','rushdown',3,'相手を動かして迎撃する','keepout',3,'少ない読み勝ちで大きく取る','explosive',3,'相手を観察して対応を変える','patience',3)
  ) as t(ord,prompt,a1,k1,s1,a2,k2,s2,a3,k3,s3,a4,k4,s4)
  loop
    insert into public.diagnosis_questions (diagnosis_id,prompt,help_text,display_order,status)
    values (d,r.prompt,null,r.ord,'published') returning id into qid;
    insert into public.diagnosis_options (question_id,label,value,score_payload,display_order) values
      (qid,r.a1,'a',jsonb_build_object(r.k1,r.s1),1),
      (qid,r.a2,'b',jsonb_build_object(r.k2,r.s2),2),
      (qid,r.a3,'c',jsonb_build_object(r.k3,r.s3),3),
      (qid,r.a4,'d',jsonb_build_object(r.k4,r.s4),4);
  end loop;

  insert into public.diagnoses (slug,title,description,diagnosis_type,question_count,display_order,status)
  values ('character-fit-check','キャラクター適性診断','10問で、キャラクター選びで相性が良くなりやすい特性を整理します。特定キャラの強さではなく、操作と戦い方の好みを見る診断です。','character_fit',10,30,'published')
  on conflict (slug) do update set title=excluded.title,description=excluded.description,diagnosis_type=excluded.diagnosis_type,question_count=excluded.question_count,display_order=excluded.display_order,status=excluded.status
  returning id into d;
  delete from public.diagnosis_questions where diagnosis_id=d;

  for r in select * from (values
    (1,'理想の得意距離は？','遠距離','keepout',3,'中距離','footsies',3,'近距離','rushdown',3,'距離より状況対応力','technicality',3),
    (2,'キャラに欲しい強みは？','高い機動力','mobility',3,'強い投げ択','grappling',3,'設置・飛び道具','setup',3,'扱いやすい基本性能','simplicity',3),
    (3,'コマンドや操作難度は？','できるだけ簡単がいい','simplicity',3,'多少難しくても問題ない','technicality',3,'難しくても高い自由度が欲しい','technicality',3,'操作より読み合いを重視したい','grappling',3),
    (4,'攻めの作り方で好みなのは？','接近して打撃と投げ','rushdown',3,'設置や状況有利から攻める','setup',3,'相手の空振りを狙う','footsies',3,'離れた位置から動かす','keepout',3),
    (5,'1回の読み勝ちに求めるものは？','安定した小さなリターン','simplicity',3,'大ダメージ','explosive',3,'有利状況の継続','setup',3,'位置入れ替えや運び','mobility',3),
    (6,'相手に近づかれたときの理想は？','守って仕切り直す','defense_preference',3,'切り返してすぐ攻めたい','explosive',3,'機動力で逃げたい','mobility',3,'近距離もそのまま戦える方がいい','rushdown',3),
    (7,'技構成はどちらが好き？','用途が分かりやすい技が少数','simplicity',3,'用途が細かく分かれた技が多数','technicality',3,'飛び道具・設置が豊富','keepout',3,'投げ技が勝ち筋になる','grappling',3),
    (8,'トレモに使える時間は？','短め。すぐ実戦したい','simplicity',3,'基礎練習なら続けられる','footsies',3,'セットプレイ研究をしたい','setup',3,'難しい操作も長く練習できる','technicality',3),
    (9,'苦しい状況から逆転するなら？','一度距離を離して立て直す','keepout',3,'速い接近で流れを変える','mobility',3,'大きい読み合いを通す','explosive',3,'守って相手のミスを待つ','defense_preference',3),
    (10,'長く使うキャラに一番求めるものは？','分かりやすく安定している','simplicity',3,'研究量に応えてくれる深さ','technicality',3,'自分から試合を動かせる','rushdown',3,'相手に対応して戦える','footsies',3)
  ) as t(ord,prompt,a1,k1,s1,a2,k2,s2,a3,k3,s3,a4,k4,s4)
  loop
    insert into public.diagnosis_questions (diagnosis_id,prompt,help_text,display_order,status)
    values (d,r.prompt,null,r.ord,'published') returning id into qid;
    insert into public.diagnosis_options (question_id,label,value,score_payload,display_order) values
      (qid,r.a1,'a',jsonb_build_object(r.k1,r.s1),1),
      (qid,r.a2,'b',jsonb_build_object(r.k2,r.s2),2),
      (qid,r.a3,'c',jsonb_build_object(r.k3,r.s3),3),
      (qid,r.a4,'d',jsonb_build_object(r.k4,r.s4),4);
  end loop;
end $$;
