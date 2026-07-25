-- 21시 고정 푸시 작업을 "비활성 상태"로 등록한다.
-- 실제 전환은 activate_fixed_21_push.sql을 별도로 실행한다.
--
-- 실행 전 아래 값을 실제 프로젝트 값으로 바꾼다.
-- - <PROJECT_REF>: Supabase project ref
-- - <SUPABASE_ANON_KEY>: Project Settings > API의 anon/public key
-- - <CRON_SECRET>: Edge Function secret CRON_SECRET와 같은 값

begin;

create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

select cron.unschedule('send-fixed-21-reminder-push-every-minute')
where exists (
  select 1
  from cron.job
  where jobname = 'send-fixed-21-reminder-push-every-minute'
);

select cron.schedule(
  'send-fixed-21-reminder-push-every-minute',
  '* * * * *',
  $$
  select net.http_post(
    url := 'https://<PROJECT_REF>.supabase.co/functions/v1/send-reminder-push',
    headers := jsonb_build_object(
      'content-type', 'application/json',
      'apikey', '<SUPABASE_ANON_KEY>',
      'authorization', 'Bearer <SUPABASE_ANON_KEY>',
      'x-cron-secret', '<CRON_SECRET>'
    ),
    body := '{"policy":"fixed_21"}'::jsonb
  );
  $$
);

select cron.alter_job(jobid, active := false)
from cron.job
where jobname = 'send-fixed-21-reminder-push-every-minute';

commit;

select jobname, schedule, active
from cron.job
where jobname in (
  'send-reminder-push-every-minute',
  'send-fixed-21-reminder-push-every-minute'
)
order by jobname;
