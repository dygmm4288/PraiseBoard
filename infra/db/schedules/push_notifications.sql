-- Supabase SQL editor에서 값 3개를 실제 프로젝트 값으로 바꾼 뒤 실행하세요.
-- - <PROJECT_REF>: Supabase project ref
-- - <CRON_SECRET>: Edge Function 환경변수 CRON_SECRET와 같은 값
--
-- 함수 deploy:
-- supabase functions deploy send-reminder-push
-- supabase functions deploy check-push-receipts

create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

select cron.unschedule('send-reminder-push-every-minute')
where exists (
  select 1 from cron.job where jobname = 'send-reminder-push-every-minute'
);

select cron.unschedule('check-push-receipts-every-15-minutes')
where exists (
  select 1 from cron.job where jobname = 'check-push-receipts-every-15-minutes'
);

select cron.schedule(
  'send-reminder-push-every-minute',
  '* * * * *',
  $$
  select net.http_post(
    url := 'https://<PROJECT_REF>.supabase.co/functions/v1/send-reminder-push',
    headers := jsonb_build_object(
      'content-type', 'application/json',
      'authorization', 'Bearer <CRON_SECRET>'
    ),
    body := '{}'::jsonb
  );
  $$
);

select cron.schedule(
  'check-push-receipts-every-15-minutes',
  '*/15 * * * *',
  $$
  select net.http_post(
    url := 'https://<PROJECT_REF>.supabase.co/functions/v1/check-push-receipts',
    headers := jsonb_build_object(
      'content-type', 'application/json',
      'authorization', 'Bearer <CRON_SECRET>'
    ),
    body := '{}'::jsonb
  );
  $$
);
