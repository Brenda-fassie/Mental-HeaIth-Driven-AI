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

drop policy if exists "members can read membership" on public.conversation_members;
drop policy if exists "users can read their own memberships" on public.conversation_members;
drop policy if exists "members can read conversations" on public.conversations;
drop policy if exists "members can update conversations" on public.conversations;
drop policy if exists "members can read messages" on public.messages;

create policy "users can read their own memberships"
on public.conversation_members
for select
to authenticated
using (auth.uid() = user_id);

create policy "members can read conversations"
on public.conversations
for select
to authenticated
using (
  auth.uid() = created_by
  or
  exists (
    select 1
    from public.conversation_members cm
    where cm.conversation_id = conversations.id
      and cm.user_id = auth.uid()
  )
);

create policy "members can update conversations"
on public.conversations
for update
to authenticated
using (
  auth.uid() = created_by
  or
  exists (
    select 1
    from public.conversation_members cm
    where cm.conversation_id = conversations.id
      and cm.user_id = auth.uid()
  )
)
with check (
  auth.uid() = created_by
  or
  exists (
    select 1
    from public.conversation_members cm
    where cm.conversation_id = conversations.id
      and cm.user_id = auth.uid()
  )
);

create policy "members can read messages"
on public.messages
for select
to authenticated
using (
  exists (
    select 1
    from public.conversation_members cm
    where cm.conversation_id = messages.conversation_id
      and cm.user_id = auth.uid()
  )
);