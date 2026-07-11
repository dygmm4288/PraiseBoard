create or replace function public.create_board_with_active_limit(
  p_profile_id uuid,
  p_title text,
  p_emoji text,
  p_target_count integer,
  p_reward_memo text,
  p_limit_count integer
)
returns public.boards
language plpgsql
security definer
set search_path = public
as $$
declare
  created_board public.boards;
begin
  perform 1
  from public.profiles
  where id = p_profile_id
    and auth_user_id = auth.uid()
  for update;

  if not found then
    raise exception 'profile_id is not owned by current user'
      using errcode = '42501';
  end if;

  if (
    select count(*)
    from public.boards
    where profile_id = p_profile_id
      and status = 'active'::board_status
  ) >= 3 then
    raise exception 'ACTIVE_BOARD_LIMIT_REACHED'
      using errcode = 'P0001';
  end if;

  insert into public.boards (
    profile_id,
    title,
    emoji,
    target_count,
    reward_memo,
    limit_count
  )
  values (
    p_profile_id,
    p_title,
    p_emoji,
    p_target_count,
    p_reward_memo,
    p_limit_count
  )
  returning * into created_board;

  return created_board;
end;
$$;

grant execute on function public.create_board_with_active_limit(
  uuid,
  text,
  text,
  integer,
  text,
  integer
) to authenticated;
