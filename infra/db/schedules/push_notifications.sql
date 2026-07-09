-- Supabase SQL editor에서 값 4개를 실제 프로젝트 값으로 바꾼 뒤 실행하세요.
-- - <PROJECT_REF>: Supabase project ref
-- - <SUPABASE_ANON_KEY>: Project Settings > API의 anon/public key
-- - <CRON_SECRET>: Edge Function secret CRON_SECRET와 같은 값
--
-- Edge Function secrets:
-- supabase secrets set CRON_SECRET='<CRON_SECRET>'
-- SUPABASE_URL과 service role key는 hosted Edge Functions에서 기본 제공됩니다.
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
      'apikey', '<SUPABASE_ANON_KEY>',
      'authorization', 'Bearer <SUPABASE_ANON_KEY>',
      'x-cron-secret', '<CRON_SECRET>'
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
      'apikey', '<SUPABASE_ANON_KEY>',
      'authorization', 'Bearer <SUPABASE_ANON_KEY>',
      'x-cron-secret', '<CRON_SECRET>'
    ),
    body := '{}'::jsonb
  );
  $$
);
