-- JP move aliases generated from Classic numeric notation and English move names.
with j as (select id from public.characters where slug='jp'),
candidates as (
  select distinct m.id move_id, mc.numeric_notation alias,
         lower(regexp_replace(mc.numeric_notation,'\s+','','g')) normalized_alias,
         'notation' alias_type
  from public.moves m join j on m.character_id=j.id
  join public.move_commands mc on mc.move_id=m.id
  where mc.numeric_notation is not null and mc.numeric_notation<>''
  union all
  select distinct m.id,m.name_en,
         lower(regexp_replace(m.name_en,'[^a-zA-Z0-9]+','','g')),
         'english'
  from public.moves m join j on m.character_id=j.id
  where m.name_en is not null and m.name_en<>''
)
insert into public.move_aliases(move_id,alias,normalized_alias,alias_type)
select move_id,alias,normalized_alias,alias_type from candidates
where normalized_alias<>''
on conflict(move_id,normalized_alias) do nothing;
