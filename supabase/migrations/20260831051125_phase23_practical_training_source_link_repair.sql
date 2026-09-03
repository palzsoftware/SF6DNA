-- Repair Source links for Phase23 practical Training batches 02/03.
-- No status or verification promotion.

with links(training_slug, source_url) as (
values
('ingrid-practical-medium-sunrise-oki','https://takukakugamer.com/st6-ingrid-setup/'),
('ingrid-practical-strong-sunrise-resource-oki','https://takukakugamer.com/st6-ingrid-setup/'),
('ingrid-practical-sweep-pc-oki','https://takukakugamer.com/st6-ingrid-setup/'),
('ingrid-practical-combo-end-choice','https://takukakugamer.com/sf6-ingrid-combo/'),
('luke-practical-light-bnb','https://takukakugamer.com/sf6-luke-combo/'),
('luke-practical-hp-confirm-hold','https://takukakugamer.com/sf6-luke-combo/'),
('luke-practical-just-flash-entry','https://takukakugamer.com/sf6-luke-combo/'),
('luke-practical-corner-air-flash','https://takukakugamer.com/sf6-luke-combo/'),
('jamie-practical-lv0-bnb','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie-practical-drink-vs-oki','https://takukakugamer.com/sf6-jamie-setup/'),
('jamie-practical-light-bakkai-oki','https://takukakugamer.com/sf6-jamie-setup/'),
('jamie-practical-corner-safejump','https://takukakugamer.com/sf6-jamie-setup/'),
('ed-practical-light-bnb','https://takukakugamer.com/sf6-ed-combo/'),
('ed-practical-medium-route-choice','https://takukakugamer.com/sf6-ed-combo/'),
('ed-practical-strong-blitz-killstep-oki','https://takukakugamer.com/sf6-ed-setup/'),
('ed-practical-crhp-dash-meaty','https://takukakugamer.com/sf6-ed-setup/'),
('blanka-practical-electricity-39-meaty','https://takukakugamer.com/sf6-blanka-setup/'),
('blanka-practical-corner-doll-loop','https://takukakugamer.com/sf6-blanka-setup/'),
('blanka-practical-rock-crush-mix','https://takukakugamer.com/sf6-blanka-setup/'),
('blanka-practical-plus2-strike-throw','https://takukakugamer.com/sf6-blanka-setup/'),
('marisa-practical-phalanx-safejump','https://takukakugamer.com/sf6-marisa-setup/'),
('marisa-practical-light-dimach-31','https://takukakugamer.com/sf6-marisa-setup/'),
('marisa-practical-corner-plus36-enfold','https://takukakugamer.com/sf6-marisa-setup/'),
('marisa-practical-safejump-plus11-mix','https://takukakugamer.com/sf6-marisa-setup/'),
('deejay-practical-sweep-sunrise-meaty','https://takukakugamer.com/sf6-deejay-setup/'),
('deejay-practical-quick-sobat-rush','https://takukakugamer.com/sf6-deejay-setup/'),
('deejay-practical-jackknife-42','https://takukakugamer.com/sf6-deejay-setup/'),
('deejay-practical-frontthrow-chase','https://takukakugamer.com/sf6-deejay-setup/'),
('juri-practical-light-fuha-bnb','https://takukakugamer.com/sf6-juri-combo/'),
('juri-practical-crmk-drc','https://takukakugamer.com/sf6-juri-combo/'),
('juri-practical-medium-fuha-oki','https://takukakugamer.com/sf6-juri-setup/'),
('juri-practical-sweep-pc-meaty','https://takukakugamer.com/sf6-juri-setup/'),
('ken-practical-light-bnb','https://takukakugamer.com/sf6-ken-combo/'),
('ken-practical-crmk-run-tatsu','https://takukakugamer.com/sf6-ken-combo/'),
('ken-practical-sweep40-oki','https://takukakugamer.com/sf6-ken-setup/'),
('ken-practical-run-shoryu-25','https://takukakugamer.com/sf6-ken-setup/')
)
insert into public.entity_sources(entity_type, entity_id, source_id, relationship, note)
select 'training', t.id, s.id, 'supporting', 'Practical Training recipe source; reviewed, not verified.'
from links l
join public.trainings t on t.slug=l.training_slug
join lateral (
  select s1.id from public.sources s1 where s1.url=l.source_url order by s1.created_at desc limit 1
) s on true
on conflict(entity_type,entity_id,source_id) do nothing;
