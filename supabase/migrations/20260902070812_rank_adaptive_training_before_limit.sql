
create or replace function public.get_adaptive_today_training_recommendations(
  p_player_character_id uuid default null,
  p_opponent_character_id uuid default null,
  p_limit integer default 3
)
returns table (
  recommendation_order bigint,
  adaptive_priority_score integer,
  priority_reasons jsonb,
  source_type text,
  training_plan_id uuid,
  focus_key text,
  focus_label text,
  training_id uuid,
  training_name text,
  training_type text,
  purpose text,
  duration_minutes integer,
  method text,
  success_criteria text,
  recommended_reps integer,
  rationale text,
  recent_sessions integer,
  last_practiced_at timestamptz,
  recent_success_rate numeric,
  latest_self_rating smallint
)
language sql
stable
security invoker
set search_path = ''
as $$
  with base as (
    select *
    from public.get_today_training_recommendations(
      p_player_character_id,
      p_opponent_character_id,
      12
    )
  ),
  history as (
    select
      l.training_id,
      count(*)::integer as recent_sessions,
      max(l.practiced_at) as last_practiced_at,
      round(
        100.0 * sum(coalesce(l.successes, 0))
        / nullif(sum(l.attempts), 0),
        1
      ) as recent_success_rate,
      (
        array_agg(l.self_rating order by l.practiced_at desc, l.created_at desc, l.id desc)
          filter (where l.self_rating is not null)
      )[1]::smallint as latest_self_rating
    from public.user_training_logs l
    where l.user_id = (select auth.uid())
      and l.training_id is not null
    group by l.training_id
  ),
  scored as (
    select
      b.*,
      coalesce(h.recent_sessions, 0) as recent_sessions,
      h.last_practiced_at,
      h.recent_success_rate,
      h.latest_self_rating,
      greatest(
        0,
        floor(
          extract(epoch from now() - h.last_practiced_at) / 86400
        )::integer
      ) as days_since_last_practice,
      (
        1000
        - (b.recommendation_order::integer * 100)
        + case
            when h.last_practiced_at is null then 30
            else least(
              greatest(
                0,
                floor(
                  extract(epoch from now() - h.last_practiced_at) / 86400
                )::integer
              ),
              30
            )
          end
        + case when h.latest_self_rating between 1 and 2 then 20 else 0 end
        + case when h.recent_success_rate is not null and h.recent_success_rate < 60 then 10 else 0 end
        - case
            when h.last_practiced_at >= date_trunc('day', now()) then 40
            else 0
          end
      )::integer as adaptive_priority_score
    from base b
    left join history h on h.training_id = b.training_id
  ),
  explained as (
    select
      s.*,
      coalesce((
        select jsonb_agg(reason order by display_order)
        from (
          values
            (
              1,
              case
                when s.last_practiced_at is null
                then 'まだ練習記録がありません'
              end
            ),
            (
              2,
              case
                when s.last_practiced_at is not null
                 and s.days_since_last_practice >= 3
                then s.days_since_last_practice::text || '日間取り組んでいません'
              end
            ),
            (
              3,
              case
                when s.latest_self_rating between 1 and 2
                then '自己評価が低いため、定着確認を優先します'
              end
            ),
            (
              4,
              case
                when s.recent_success_rate is not null
                 and s.recent_success_rate < 60
                then '直近の成功率が60%未満です'
              end
            ),
            (
              5,
              case
                when s.last_practiced_at >= date_trunc('day', now())
                then '今日はすでに練習済みのため優先度を下げています'
              end
            ),
            (6, s.rationale)
        ) as reasons(display_order, reason)
        where reason is not null
      ), '[]'::jsonb) as priority_reasons
    from scored s
  ),
  ranked as (
    select
      row_number() over (
        order by e.adaptive_priority_score desc, e.recommendation_order, e.training_id
      ) as new_recommendation_order,
      e.*
    from explained e
  )
  select
    r.new_recommendation_order as recommendation_order,
    r.adaptive_priority_score,
    r.priority_reasons,
    r.source_type,
    r.training_plan_id,
    r.focus_key,
    r.focus_label,
    r.training_id,
    r.training_name,
    r.training_type,
    r.purpose,
    r.duration_minutes,
    r.method,
    r.success_criteria,
    r.recommended_reps,
    r.rationale,
    r.recent_sessions,
    r.last_practiced_at,
    r.recent_success_rate,
    r.latest_self_rating
  from ranked r
  where r.new_recommendation_order <= least(greatest(coalesce(p_limit, 3), 1), 12)
  order by r.new_recommendation_order;
$$;
