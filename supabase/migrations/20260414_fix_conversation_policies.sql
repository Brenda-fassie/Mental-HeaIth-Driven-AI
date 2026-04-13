-- Replace recursive conversation_members select policy with a non-recursive one.

alter table public.messages
  add column if not exists role text not null default 'user';

update public.messages
set
  role = case
    when content like '__AI__%' then 'assistant'
    else 'user'
  end,
  content = case
    when content like '__AI__%' then regexp_replace(content, '^__AI__', '')
    else content
  end
where role is distinct from case
  when content like '__AI__%' then 'assistant'
  else 'user'
end;

alter table public.messages
  drop constraint if exists messages_role_check;

alter table public.messages
  add constraint messages_role_check
  check (role in ('user', 'assistant'));

create or replace function public.is_conversation_member(
  p_conversation_id uuid,
  p_user_id uuid default auth.uid()
)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.conversation_members cm
    where cm.conversation_id = p_conversation_id
      and cm.user_id = p_user_id
  );
$$;

create or replace function public.is_conversation_creator(
  p_conversation_id uuid,
  p_user_id uuid default auth.uid()
)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.conversations c
    where c.id = p_conversation_id
      and c.created_by = p_user_id
  );
$$;

drop policy if exists "members can read membership" on public.conversation_members;
drop policy if exists "users can read their own memberships" on public.conversation_members;
drop policy if exists "members can read conversation memberships" on public.conversation_members;
drop policy if exists "conversation creators can add members" on public.conversation_members;
drop policy if exists "members can read conversations" on public.conversations;
drop policy if exists "members can update conversations" on public.conversations;
drop policy if exists "members can read messages" on public.messages;

create policy "members can read conversation memberships"
on public.conversation_members
for select
to authenticated
using (public.is_conversation_member(conversation_id));

create policy "conversation creators can add members"
on public.conversation_members
for insert
to authenticated
with check (public.is_conversation_creator(conversation_id));

create policy "members can read conversations"
on public.conversations
for select
to authenticated
using (
  public.is_conversation_creator(conversations.id)
  or public.is_conversation_member(conversations.id)
);

create policy "members can update conversations"
on public.conversations
for update
to authenticated
using (
  public.is_conversation_creator(conversations.id)
  or public.is_conversation_member(conversations.id)
)
with check (
  public.is_conversation_creator(conversations.id)
  or public.is_conversation_member(conversations.id)
);

create policy "members can read messages"
on public.messages
for select
to authenticated
using (
  public.is_conversation_member(messages.conversation_id)
);