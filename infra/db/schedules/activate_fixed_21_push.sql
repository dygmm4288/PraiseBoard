-- 21시 고정 정책을 활성화하고 사용자 지정 시간 정책을 비활성화한다.
-- 두 작업이 모두 등록된 뒤 실행해야 한다.

do $$
declare
  custom_time_job_id bigint;
  fixed_21_job_id bigint;
begin
  select jobid
  into custom_time_job_id
  from cron.job
  where jobname = 'send-reminder-push-every-minute';

  select jobid
  into fixed_21_job_id
  from cron.job
  where jobname = 'send-fixed-21-reminder-push-every-minute';

  if custom_time_job_id is null or fixed_21_job_id is null then
    raise exception 'Both custom-time and fixed-21 push jobs must exist';
  end if;

  perform cron.alter_job(custom_time_job_id, active := false);
  perform cron.alter_job(fixed_21_job_id, active := true);
end;
$$;

select jobname, schedule, active
from cron.job
where jobname in (
  'send-reminder-push-every-minute',
  'send-fixed-21-reminder-push-every-minute'
)
order by jobname;
