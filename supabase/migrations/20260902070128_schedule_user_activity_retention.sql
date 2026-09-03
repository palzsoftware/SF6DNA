
create extension if not exists pg_cron with schema pg_catalog;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

select cron.schedule(
  'purge-expired-user-activity-logs',
  '17 * * * *',
  $cron$select public.purge_expired_user_activity_logs(20000);$cron$
);
