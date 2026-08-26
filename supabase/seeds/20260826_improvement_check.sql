-- Idempotent seed for the first SF6DNA v2 short diagnosis.
-- Safe self-assessment only; it does not publish unverified frame or matchup facts.

insert into public.diagnoses (slug,title,description,diagnosis_type,question_count,display_order,status)
values ('improvement-check','上達課題診断','12問で、今どこを優先して練習すると伸びやすいかを整理します。自己評価型の簡易診断です。','improvement',12,10,'published')
on conflict (slug) do update set
  title=excluded.title,
  description=excluded.description,
  diagnosis_type=excluded.diagnosis_type,
  question_count=excluded.question_count,
  display_order=excluded.display_order,
  status=excluded.status;

do $$
declare
  diagnosis_uuid uuid;
  q record;
  question_uuid uuid;
begin
  select id into diagnosis_uuid from public.diagnoses where slug='improvement-check';

  for q in
    select * from (values
      (1,'相手のジャンプに対空を安定して出せますか？','通常対空・必殺技対空・空対空など、普段使う手段で考えてください。','anti_air'),
      (2,'相手のドライブラッシュを見て止められますか？','毎回ではなく、実戦で反応できているかを基準にしてください。','drive_rush_defense'),
      (3,'ドライブインパクトを見て返せますか？','端だけでなく中央も含めて考えてください。','impact_response'),
      (4,'ガード後に確定反撃できる技を逃さず反撃できますか？','相手キャラごとの確反知識と操作の両方を含みます。','punish'),
      (5,'起き上がりや画面端で守るとき、選択肢を使い分けられますか？','ガード、投げ抜け、パリィ、Dリバーサル、無敵技など。','defense'),
      (6,'攻めを始めたあと、打撃・投げ・シミーを使い分けられますか？','同じ択に偏らず、相手の防御に合わせられるかで考えてください。','offense'),
      (7,'ドライブゲージとSAゲージを状況に応じて管理できますか？','バーンアウト回避、リーサル、OD技・Dラッシュの使い分けを含みます。','meter'),
      (8,'苦手キャラに対して「何を警戒するか」を説明できますか？','主要技、接近手段、確反、割り込みなどを把握しているかで考えてください。','matchup'),
      (9,'使いたいコンボ・セットプレイを実戦で安定して完走できますか？','トレモではなく、実戦での成功率を基準にしてください。','execution'),
      (10,'中距離で何を振るか、歩くか、待つかを判断できますか？','通常技の間合い管理、差し返し、置き技などを含みます。','neutral'),
      (11,'自分が画面端を背負ったとき、脱出手段を複数持っていますか？','前ジャンプだけでなく、ガード継続、Dリバーサル、パリィなども含みます。','corner_defense'),
      (12,'ラウンド中に相手の癖を見て行動を変えられますか？','反応だけでなく、観察→仮説→次の選択まで含みます。','decision')
    ) as x(ord,prompt,help_text,axis)
  loop
    select id into question_uuid
    from public.diagnosis_questions
    where diagnosis_id=diagnosis_uuid and display_order=q.ord
    limit 1;

    if question_uuid is null then
      insert into public.diagnosis_questions (diagnosis_id,prompt,help_text,display_order,status)
      values (diagnosis_uuid,q.prompt,q.help_text,q.ord,'published')
      returning id into question_uuid;
    else
      update public.diagnosis_questions
      set prompt=q.prompt, help_text=q.help_text, status='published'
      where id=question_uuid;
    end if;

    insert into public.diagnosis_options (question_id,label,value,score_payload,display_order)
    select question_uuid,o.label,o.value,jsonb_build_object(q.axis,o.score),o.ord
    from (values
      (1,'安定してできる','good',0),
      (2,'時々できる','sometimes',1),
      (3,'苦手','weak',2),
      (4,'よくわからない / 意識できていない','unknown',3)
    ) as o(ord,label,value,score)
    where not exists (
      select 1 from public.diagnosis_options d
      where d.question_id=question_uuid and d.value=o.value
    );

    question_uuid := null;
  end loop;
end $$;
