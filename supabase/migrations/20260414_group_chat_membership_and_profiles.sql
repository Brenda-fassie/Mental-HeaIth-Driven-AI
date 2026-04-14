-- Group chat lifecycle and profiling-safe features.

alter table public.messages
  alter column sender_id drop not null;

alter table public.messages
  add column if not exists triggered_by_user_id uuid references auth.users(id) on delete set null;

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

drop policy if exists "conversation creators can add members" on public.conversation_members;
drop policy if exists "members can read conversation memberships" on public.conversation_members;

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

drop policy if exists "members can remove or leave memberships" on public.conversation_members;
create policy "members can remove or leave memberships"
on public.conversation_members
for delete
to authenticated
using (
  auth.uid() = user_id
  or public.is_conversation_creator(conversation_id)
);

create table if not exists public.message_features (
  message_id uuid primary key references public.messages(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  word_count integer not null,
  char_count integer not null,
  extracted_at timestamptz not null default now()
);

alter table public.message_features enable row level security;

drop policy if exists "members can read message features" on public.message_features;
create policy "members can read message features"
on public.message_features
for select
to authenticated
using (public.is_conversation_member(conversation_id));

drop policy if exists "senders can insert their message features" on public.message_features;
create policy "senders can insert their message features"
on public.message_features
for insert
to authenticated
with check (
  auth.uid() = sender_id
  and public.is_conversation_member(conversation_id)
);

update public.conversations c
set is_group = member_counts.member_count >= 2
from (
  select conversation_id, count(*)::int as member_count
  from public.conversation_members
  group by conversation_id
) as member_counts
where c.id = member_counts.conversation_id;