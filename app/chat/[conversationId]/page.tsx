import Link from "next/link";
import { redirect } from "next/navigation";
import type { UIMessage } from "ai";
import { createClient } from "@/utils/supabase/server";
import ChatThread from "./thread";
import {
  isGenericConversationTitle,
  summarizeConversationTitle,
} from "@/utils/conversations";

type ConversationRow = {
  id: string;
  title: string | null;
  updated_at: string;
};

type ConversationMembershipRow = {
  conversation_id: string;
  joined_at: string;
};

type MessageRow = {
  id: string;
  sender_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

type ProfileRow = {
  id: string;
  display_name: string | null;
  username: string | null;
};

type MemberRow = {
  user_id: string;
  role: string;
  joined_at: string;
};

type PageProps = {
  params: Promise<{ conversationId: string }>;
  searchParams: Promise<{ member_error?: string }>;
};

export default async function ConversationPage({ params, searchParams }: PageProps) {
  const { conversationId } = await params;
  const { member_error: memberError } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: membership } = await supabase
    .from("conversation_members")
    .select("conversation_id")
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    redirect("/chat");
  }

  const { data: conversationData } = await supabase
    .from("conversations")
    .select("id,title,updated_at,created_by")
    .eq("id", conversationId)
    .maybeSingle();

  if (!conversationData) {
    redirect("/chat");
  }

  const isCreator = conversationData.created_by === user.id;

  const { data: membershipRows } = await supabase
    .from("conversation_members")
    .select("conversation_id,joined_at")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: false });

  const membershipRowsTyped = (membershipRows ?? []) as ConversationMembershipRow[];
  const conversationIds = membershipRowsTyped.map((row) => row.conversation_id);

  const { data: conversationsData } =
    conversationIds.length > 0
      ? await supabase
          .from("conversations")
          .select("id,title,updated_at")
          .in("id", conversationIds)
      : { data: [] as ConversationRow[] };

  const conversations = (conversationsData ?? []).sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );

  const resolvedConversations = await Promise.all(
    conversations.map(async (conversation) => {
      if (!isGenericConversationTitle(conversation.title)) {
        return conversation;
      }

      const { data: conversationMessages } = await supabase
        .from("messages")
        .select("role,content")
        .eq("conversation_id", conversation.id)
        .order("created_at", { ascending: true })
        .limit(6);

      const title = await summarizeConversationTitle({
        supabase,
        conversationId: conversation.id,
        existingTitle: conversation.title,
        messages: (conversationMessages ?? []) as Array<{
          role: "user" | "assistant";
          content: string;
        }>,
      });

      return {
        ...conversation,
        title,
      };
    }),
  );

  const { data: messageRows } = await supabase
    .from("messages")
    .select("id,sender_id,role,content,created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  const messageSenderIds = Array.from(
    new Set(((messageRows ?? []) as MessageRow[]).map((message) => message.sender_id)),
  );

  const { data: profileRows } =
    messageSenderIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id,display_name,username")
          .in("id", messageSenderIds)
      : { data: [] as ProfileRow[] };

  const profileById = new Map(
    ((profileRows ?? []) as ProfileRow[]).map((profile) => [profile.id, profile]),
  );

  const messageSenderNames = new Map(
    ((messageRows ?? []) as MessageRow[]).map((message) => {
      const profile = profileById.get(message.sender_id);
      const displayName =
        profile?.display_name ?? profile?.username ?? `User ${message.sender_id.slice(0, 6)}`;

      return [message.id, displayName];
    }),
  );

  const initialMessages: UIMessage[] = ((messageRows ?? []) as MessageRow[]).map(
    (message) => {
      return {
        id: message.id,
        role: message.role,
        parts: [
          {
            type: "text",
            text: message.content,
          },
        ],
      };
    },
  );

  const { data: memberRows } = await supabase
    .from("conversation_members")
    .select("user_id,role,joined_at")
    .eq("conversation_id", conversationId)
    .order("joined_at", { ascending: true });

  const members = (memberRows ?? []) as MemberRow[];

  const memberProfiles =
    members.length > 0
      ? await supabase
          .from("profiles")
          .select("id,display_name,username")
          .in(
            "id",
            members.map((member) => member.user_id),
          )
      : { data: [] as ProfileRow[] };

  const profileByMemberId = new Map(
    ((memberProfiles.data ?? []) as ProfileRow[]).map((profile) => [profile.id, profile]),
  );

  const memberDisplayRows = members.map((member) => {
    const profile = profileByMemberId.get(member.user_id);
    return {
      id: member.user_id,
      role: member.role,
      name:
        profile?.display_name ?? profile?.username ?? `User ${member.user_id.slice(0, 6)}`,
    };
  });

  async function addMemberAction(formData: FormData) {
    "use server";

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const username = String(formData.get("username") ?? "").trim();

    if (!username) {
      redirect(`/chat/${conversationId}?member_error=missing_username`);
    }

    const { data: conversation } = await supabase
      .from("conversations")
      .select("created_by")
      .eq("id", conversationId)
      .maybeSingle();

    if (!conversation || conversation.created_by !== user.id) {
      redirect(`/chat/${conversationId}?member_error=not_authorized`);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (!profile) {
      redirect(`/chat/${conversationId}?member_error=user_not_found`);
    }

    const { error } = await supabase
      .from("conversation_members")
      .upsert(
        {
          conversation_id: conversationId,
          user_id: profile.id,
          role: "member",
        },
        { onConflict: "conversation_id,user_id" },
      );

    if (error) {
      redirect(`/chat/${conversationId}?member_error=${encodeURIComponent(error.message)}`);
    }

    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    redirect(`/chat/${conversationId}`);
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 py-6">
      <aside className="hidden w-72 shrink-0 border-r border-zinc-200 pr-4 md:block dark:border-zinc-800">
        <Link
          href="/chat/new"
          className="mb-4 block rounded bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white"
        >
          New conversation
        </Link>
        <ul className="flex flex-col gap-2">
          {resolvedConversations.map((conversation) => (
            <li key={conversation.id}>
              <Link
                href={`/chat/${conversation.id}`}
                className={`block rounded px-3 py-2 text-sm ${
                  conversation.id === conversationId
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                {conversation.title ?? "Untitled conversation"}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <section className="flex min-h-0 flex-1 flex-col">
        <div className="mb-3 flex items-center justify-between md:hidden">
          <Link href="/chat" className="text-sm text-blue-600">
            Back
          </Link>
          <Link
            href="/chat/new"
            className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
          >
            New
          </Link>
        </div>

        <div className="mb-4 rounded border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Members
              </h2>
              {memberError ? (
                <p className="mt-2 text-sm text-red-500">
                  {decodeURIComponent(memberError)}
                </p>
              ) : null}
            </div>

            <ul className="flex flex-wrap gap-2">
              {memberDisplayRows.map((member) => (
                <li
                  key={member.id}
                  className="rounded-full border border-zinc-200 px-3 py-1 text-sm dark:border-zinc-700"
                >
                  {member.name}
                  {member.role === "owner" ? " (owner)" : ""}
                </li>
              ))}
            </ul>

            {isCreator ? (
              <form action={addMemberAction} className="flex flex-col gap-2 sm:flex-row">
                <input
                  name="username"
                  placeholder="Add member by username"
                  className="flex-1 rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
                />
                <button
                  type="submit"
                  className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                >
                  Add member
                </button>
              </form>
            ) : null}
          </div>
        </div>

        <ChatThread
          conversationId={conversationId}
          initialMessages={initialMessages}
          messageSenderNames={Object.fromEntries(messageSenderNames)}
        />
      </section>
    </main>
  );
}