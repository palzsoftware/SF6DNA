-- Idempotent 20-question comprehensive diagnosis.
-- Combines improvement self-assessment and playstyle preference without publishing gameplay facts.

do $$
declare
  d uuid;
  qid uuid;
  r record;
begin
  insert into public.diagnoses (slug,title,description,diagnosis_type,question_count,display_order,status)
  values ('comprehensive-check','総合簡易診断','20問で、現在の改善優先度と好みのプレイスタイルをまとめて整理します。','comprehensive',20,40,'published')
  on conflict (slug) do update set
    title=excluded.title,
    description=excluded.description,
    diagnosis_type=excluded.diagnosis_type,
    question_count=excluded.question_count,
    display_order=excluded.display_order,
    status=excluded.status
  returning id into d;

  delete from public.diagnosis_questions where diagnosis_id=d;

  -- Improvement section: higher score = higher training priority.
  for r in select * from (values
    (1,'相手のジャンプに対空を安定して出せますか？','anti_air'),
    (2,'相手のドライブラッシュを見て止められますか？','drive_rush_defense'),
    (3,'ドライブインパクトを見て返せますか？','impact_response'),
    (4,'確定反撃できる場面を逃さず反撃できますか？','punish'),
    (5,'起き上がりや画面端で防御手段を使い分けられますか？','defense'),
    (6,'攻めで打撃・投げ・シミーを使い分けられますか？','offense'),
    (7,'ドライブゲージとSAゲージを状況に応じて管理できますか？','meter'),
    (8,'苦手キャラに対して警戒行動や確反を説明できますか？','matchup'),
    (9,'使いたいコンボやセットプレイを実戦で安定して完走できますか？','execution'),
    (10,'中距離で技・歩き・待ちを使い分けられますか？','neutral')
  ) as t(ord,prompt,axis)
  loop
    insert into public.diagnosis_questions (diagnosis_id,prompt,help_text,display_order,status)
    values (d,r.prompt,'実戦での安定度を基準に答えてください。',r.ord,'published') returning id into qid;
    insert into public.diagnosis_options (question_id,label,value,score_payload,display_order) values
      (qid,'安定してできる','good',jsonb_build_object(r.axis,0),1),
      (qid,'時々できる','sometimes',jsonb_build_object(r.axis,1),2),
      (qid,'苦手','weak',jsonb_build_object(r.axis,2),3),
      (qid,'よくわからない / 未意識','unknown',jsonb_build_object(r.axis,3),4);
  end loop;

  -- Preference section: higher score = stronger preference.
  for r in select * from (values
    (11,'試合ではどの距離を作りたいですか？','近距離で攻め続けたい','rushdown','中距離で差し合いたい','footsies','遠距離から動かしたい','keepout','距離より状況対応を重視','technicality'),
    (12,'一番気持ちいい勝ち方は？','連続攻めで押し切る','aggression','大きな読み合いを通す','explosive','差し返しや確反を積み重ねる','footsies','設置や起き攻めを組み立てる','setup'),
    (13,'キャラ操作で好みなのは？','簡単で判断に集中できる','simplicity','難しくても選択肢が多い','technicality','高い機動力で動き回れる','mobility','投げを大きな勝ち筋にできる','grappling'),
    (14,'相手が慎重に待っているときは？','自分から崩しに行く','aggression','さらに観察する','patience','けん制で動かす','keepout','位置を変えて接近角度を作る','mobility'),
    (15,'守りから攻めへ切り替えるなら？','ガードして確実に反撃','defense_preference','一気に接近して流れを変える','rushdown','位置を入れ替える','mobility','距離を離して立て直す','keepout'),
    (16,'画面端へ追い込んだときの理想は？','打撃と投げで直接崩す','rushdown','大きい投げ択を狙う','grappling','設置や連携で逃げ道を減らす','setup','無理せず位置を維持する','patience'),
    (17,'ゲージの使い方で好みなのは？','早めに使って攻めを継続','aggression','最大火力の機会まで残す','explosive','守りや位置調整にも使う','defense_preference','状況別に細かく使い分ける','technicality'),
    (18,'練習で楽しいものは？','コンボや複雑な連携','technicality','対空・確反など基礎','defense_preference','間合い・差し返し','footsies','起き攻めパターン研究','setup'),
    (19,'苦しい状況から逆転するなら？','距離を離して立て直す','keepout','速い接近で流れを変える','mobility','少ない読み勝ちで大きく取る','explosive','守って相手のミスを待つ','patience'),
    (20,'長く使うキャラに一番求めるものは？','扱いやすさと安定感','simplicity','研究量に応える深さ','technicality','自分から試合を動かせること','rushdown','相手に対応して戦えること','footsies')
  ) as t(ord,prompt,a1,k1,a2,k2,a3,k3,a4,k4)
  loop
    insert into public.diagnosis_questions (diagnosis_id,prompt,help_text,display_order,status)
    values (d,r.prompt,'強さではなく、自分が楽しい・続けやすい方を選んでください。',r.ord,'published') returning id into qid;
    insert into public.diagnosis_options (question_id,label,value,score_payload,display_order) values
      (qid,r.a1,'a',jsonb_build_object(r.k1,3),1),
      (qid,r.a2,'b',jsonb_build_object(r.k2,3),2),
      (qid,r.a3,'c',jsonb_build_object(r.k3,3),3),
      (qid,r.a4,'d',jsonb_build_object(r.k4,3),4);
  end loop;
end $$;
