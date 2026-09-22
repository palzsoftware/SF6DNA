select cron.unschedule(jobid)
from cron.job
where jobname = 'purge-expired-contact-inbox';

drop function if exists private.purge_expired_contact_inbox();
drop function if exists public.submit_contact(text, text, text, text, text);
drop table if exists public.contact_inbox;
drop table if exists private.contact_inbox_config;
