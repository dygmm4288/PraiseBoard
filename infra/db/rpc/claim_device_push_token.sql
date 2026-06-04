create or replace function public.claim_device_push_token(
  p_device_id text,
  p_push_token text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_push_token is null or length(p_push_token) = 0 then
    return;
  end if;

  if not exists (
    select 1
    from public.devices d
    join public.profiles p on p.id = d.profile_id
    where d.device_id = p_device_id
      and p.auth_user_id = auth.uid()
  ) then
    raise exception 'device_id is not owned by current user'
      using errcode = '42501';
  end if;

  update public.devices
  set push_token = null
  where push_token = p_push_token
    and device_id <> p_device_id;
end;
$$;

grant execute on function public.claim_device_push_token(text, text)
to authenticated;
