-- Mirrors the live SF6DNAPro search RPC as of 2026-08-26.
-- Adds setup and sequence to the existing cross-entity search.

create or replace function public.search_sf6dna(search_query text, result_limit integer default 30)
returns table(entity_type text, entity_id uuid, slug text, title text, subtitle text, matched_by text, score real)
language sql
stable
set search_path to 'public', 'extensions'
as $function$
with q as (
  select lower(trim(search_query)) as term
), candidates(entity_type, entity_id, slug, title, subtitle, matched_by, score) as (
  select 'character'::text, c.id, c.slug, c.name_ja, c.summary, 'name'::text,
    greatest(similarity(lower(c.name_ja), q.term), case when lower(c.name_ja)=q.term then 1 else 0 end)::real
  from public.characters c cross join q
  where c.status='published' and (lower(c.name_ja) like '%'||q.term||'%' or lower(coalesce(c.name_en,'')) like '%'||q.term||'%' or similarity(lower(c.name_ja), q.term) > 0.2)
  union all
  select 'character', c.id, c.slug, c.name_ja, '別名: '||a.alias, 'alias', greatest(similarity(a.normalized_alias,q.term),case when a.normalized_alias=q.term then 1 else 0 end)::real
  from public.character_aliases a join public.characters c on c.id=a.character_id cross join q
  where c.status='published' and (a.normalized_alias like '%'||q.term||'%' or similarity(a.normalized_alias,q.term)>0.2)
  union all
  select 'move',m.id,m.slug,m.name_ja,c.name_ja,'name',greatest(similarity(lower(m.name_ja),q.term),case when lower(m.name_ja)=q.term then 1 else 0 end)::real
  from public.moves m join public.characters c on c.id=m.character_id cross join q
  where m.status='published' and c.status='published' and (lower(m.name_ja) like '%'||q.term||'%' or lower(coalesce(m.name_en,'')) like '%'||q.term||'%' or similarity(lower(m.name_ja),q.term)>0.2)
  union all
  select 'move',m.id,m.slug,m.name_ja,'別名: '||a.alias||' / '||c.name_ja,'alias',greatest(similarity(a.normalized_alias,q.term),case when a.normalized_alias=q.term then 1 else 0 end)::real
  from public.move_aliases a join public.moves m on m.id=a.move_id join public.characters c on c.id=m.character_id cross join q
  where m.status='published' and c.status='published' and (a.normalized_alias like '%'||q.term||'%' or similarity(a.normalized_alias,q.term)>0.2)
  union all
  select 'combo',x.id,x.slug,x.name,c.name_ja,'content',similarity(lower(x.name),q.term)::real
  from public.combos x join public.characters c on c.id=x.character_id cross join q
  where x.status='published' and (lower(x.name) like '%'||q.term||'%' or lower(coalesce(x.purpose,'')) like '%'||q.term||'%' or lower(coalesce(x.notation,'')) like '%'||q.term||'%')
  union all
  select 'setup',x.id,x.slug,x.name,c.name_ja,'content',similarity(lower(x.name),q.term)::real
  from public.setups x join public.characters c on c.id=x.character_id cross join q
  where x.status='published' and (lower(x.name) like '%'||q.term||'%' or lower(coalesce(x.description,'')) like '%'||q.term||'%' or lower(coalesce(x.sequence_text,'')) like '%'||q.term||'%')
  union all
  select 'sequence',x.id,x.slug,x.name,c.name_ja,'content',similarity(lower(x.name),q.term)::real
  from public.sequences x join public.characters c on c.id=x.character_id cross join q
  where x.status='published' and (lower(x.name) like '%'||q.term||'%' or lower(coalesce(x.sequence_text,'')) like '%'||q.term||'%' or lower(coalesce(x.notes,'')) like '%'||q.term||'%')
  union all
  select 'counter',x.id,x.slug,x.title,x.summary,'content',similarity(lower(x.title),q.term)::real
  from public.counters x cross join q
  where x.status='published' and (lower(x.title) like '%'||q.term||'%' or lower(coalesce(x.summary,'')) like '%'||q.term||'%' or lower(coalesce(x.situation,'')) like '%'||q.term||'%')
  union all
  select 'training',x.id,x.slug,x.name,x.purpose,'content',similarity(lower(x.name),q.term)::real
  from public.trainings x cross join q
  where x.status='published' and (lower(x.name) like '%'||q.term||'%' or lower(coalesce(x.purpose,'')) like '%'||q.term||'%' or lower(coalesce(x.method,'')) like '%'||q.term||'%')
  union all
  select 'player',p.id,p.slug,p.display_name,coalesce(p.team_name,p.player_type),'name',greatest(similarity(lower(p.display_name),q.term),case when lower(p.display_name)=q.term then 1 else 0 end)::real
  from public.players p cross join q
  where p.status='published' and (lower(p.display_name) like '%'||q.term||'%' or similarity(lower(p.display_name),q.term)>0.2)
  union all
  select 'player',p.id,p.slug,p.display_name,'別名: '||a.alias,'alias',greatest(similarity(a.normalized_alias,q.term),case when a.normalized_alias=q.term then 1 else 0 end)::real
  from public.player_aliases a join public.players p on p.id=a.player_id cross join q
  where p.status='published' and (a.normalized_alias like '%'||q.term||'%' or similarity(a.normalized_alias,q.term)>0.2)
  union all
  select 'tournament',t.id,t.slug,t.name,t.series_name,'name',similarity(lower(t.name),q.term)::real
  from public.tournaments t cross join q
  where t.status='published' and (lower(t.name) like '%'||q.term||'%' or lower(coalesce(t.series_name,'')) like '%'||q.term||'%')
  union all
  select 'video',v.id,v.slug,v.title,v.video_type,'content',similarity(lower(v.title),q.term)::real
  from public.videos v cross join q
  where v.status='published' and (lower(v.title) like '%'||q.term||'%' or lower(coalesce(v.description,'')) like '%'||q.term||'%')
  union all
  select 'glossary',g.id,g.slug,g.term,g.short_definition,'name',greatest(similarity(lower(g.term),q.term),case when lower(g.term)=q.term then 1 else 0 end)::real
  from public.glossary g cross join q
  where g.status='published' and (lower(g.term) like '%'||q.term||'%' or lower(coalesce(g.definition,'')) like '%'||q.term||'%' or similarity(lower(g.term),q.term)>0.2)
  union all
  select 'glossary',g.id,g.slug,g.term,'別名: '||a.alias,'alias',greatest(similarity(a.normalized_alias,q.term),case when a.normalized_alias=q.term then 1 else 0 end)::real
  from public.glossary_aliases a join public.glossary g on g.id=a.glossary_id cross join q
  where g.status='published' and (a.normalized_alias like '%'||q.term||'%' or similarity(a.normalized_alias,q.term)>0.2)
), ranked as (
  select *, row_number() over (partition by entity_type,entity_id order by score desc,matched_by) rn from candidates
)
select entity_type,entity_id,slug,title,subtitle,matched_by,score
from ranked where rn=1
order by score desc,title
limit greatest(1,least(result_limit,100));
$function$;
