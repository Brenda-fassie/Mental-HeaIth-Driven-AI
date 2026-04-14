import Link from "next/link";
import Image from "next/image";
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
  sender_id: string | null;
  triggered_by_user_id?: string | null;
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
      if (conversation.id !== conversationId || !isGenericConversationTitle(conversation.title)) {
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
    .select("id,sender_id,triggered_by_user_id,role,content,created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  const messageSenderIds = Array.from(
    new Set(
      ((messageRows ?? []) as MessageRow[])
        .map((message) => message.sender_id)
        .filter((senderId): senderId is string => Boolean(senderId)),
    ),
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
      if (!message.sender_id) {
        return [message.id, "Rooftop Guide"];
      }

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

  async function refreshGroupFlag() {
    "use server";

    const supabase = await createClient();
    const { count } = await supabase
      .from("conversation_members")
      .select("*", { head: true, count: "exact" })
      .eq("conversation_id", conversationId);

    await supabase
      .from("conversations")
      .update({ is_group: (count ?? 0) >= 2, updated_at: new Date().toISOString() })
      .eq("id", conversationId);
  }

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

    await refreshGroupFlag();

    redirect(`/chat/${conversationId}`);
  }

  async function removeMemberAction(formData: FormData) {
    "use server";

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const memberId = String(formData.get("memberId") ?? "").trim();
    if (!memberId) {
      redirect(`/chat/${conversationId}?member_error=missing_member`);
    }

    const { data: conversation } = await supabase
      .from("conversations")
      .select("created_by")
      .eq("id", conversationId)
      .maybeSingle();

    if (!conversation || conversation.created_by !== user.id) {
      redirect(`/chat/${conversationId}?member_error=not_authorized`);
    }

    if (memberId === user.id) {
      redirect(`/chat/${conversationId}?member_error=owner_cannot_remove_self`);
    }

    const { error } = await supabase
      .from("conversation_members")
      .delete()
      .eq("conversation_id", conversationId)
      .eq("user_id", memberId);

    if (error) {
      redirect(`/chat/${conversationId}?member_error=${encodeURIComponent(error.message)}`);
    }

    await refreshGroupFlag();
    redirect(`/chat/${conversationId}`);
  }

  async function leaveConversationAction() {
    "use server";

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const { data: conversation } = await supabase
      .from("conversations")
      .select("created_by")
      .eq("id", conversationId)
      .maybeSingle();

    if (!conversation) {
      redirect("/chat");
    }

    const { data: rows } = await supabase
      .from("conversation_members")
      .select("user_id,joined_at")
      .eq("conversation_id", conversationId)
      .order("joined_at", { ascending: true });

    const others = (rows ?? []).filter((row) => row.user_id !== user.id);

    if (conversation.created_by === user.id && others.length > 0) {
      await supabase
        .from("conversations")
        .update({ created_by: others[0].user_id })
        .eq("id", conversationId);
    }

    const { error: removeError } = await supabase
      .from("conversation_members")
      .delete()
      .eq("conversation_id", conversationId)
      .eq("user_id", user.id);

    if (removeError) {
      redirect(`/chat/${conversationId}?member_error=${encodeURIComponent(removeError.message)}`);
    }

    if (others.length === 0) {
      await supabase.from("conversations").delete().eq("id", conversationId);
      redirect("/chat");
    }

    await refreshGroupFlag();
    redirect("/chat");
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="hidden w-72 flex-col border-r border-zinc-100 bg-zinc-50/50 md:flex dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex h-24 items-center border-b border-zinc-100 px-6 dark:border-zinc-800">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/Logo.svg" alt="Rooftop" width={56} height={56} className="dark:invert" />
          </Link>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto p-4">
          <Link
            href="/chat/new"
            className="mb-6 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New Support Circle
          </Link>

          <div className="space-y-1">
            <h3 className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Conversations
            </h3>
            {resolvedConversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/chat/${conversation.id}`}
                className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all ${
                  conversation.id === conversationId
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                <span className="truncate pr-2 font-medium">
                  {conversation.title ?? "Untitled conversation"}
                </span>
                {conversation.id === conversationId && (
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-zinc-100 p-4 dark:border-zinc-800">
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {user.email?.[0].toUpperCase() ?? "U"}
            </div>
            <span className="truncate">{user.email}</span>
          </Link>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex flex-1 flex-col min-w-0">
        {/* Chat Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-100 px-6 dark:border-zinc-800">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/chat" className="md:hidden">
              <svg className="h-5 w-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex flex-col min-w-0">
              <h2 className="truncate text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {conversationData.title ?? "Untitled Conversation"}
              </h2>
              <p className="truncate text-[11px] text-zinc-400">
                {memberDisplayRows.length} members • Active support circle
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center justify-center rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </summary>
              <div className="absolute right-0 top-full z-50 mt-2 w-72 origin-top-right rounded-2xl border border-zinc-100 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
                  Circle Members
                </h3>
                <ul className="mb-4 max-h-48 space-y-2 overflow-y-auto px-1">
                  {memberDisplayRows.map((member) => (
                    <li key={member.id} className="flex items-center justify-between text-sm group/item">
                      <div className="flex items-center gap-2 truncate">
                        <div className="h-6 w-6 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] dark:bg-zinc-800">
                          {member.name[0]}
                        </div>
                        <span className="truncate text-zinc-700 dark:text-zinc-300">
                          {member.name} {member.id === user.id && "(You)"}
                        </span>
                      </div>
                      {isCreator && member.id !== user.id && (
                        <form action={removeMemberAction}>
                          <input type="hidden" name="memberId" value={member.id} />
                          <button type="submit" className="text-[10px] font-bold text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity">
                            REMOVE
                          </button>
                        </form>
                      )}
                    </li>
                  ))}
                </ul>

                {isCreator && (
                  <form action={addMemberAction} className="mb-4 space-y-2 px-1">
                    <input
                      name="username"
                      placeholder="Add username..."
                      className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs transition-all focus:border-blue-400 focus:ring-0 dark:border-zinc-800 dark:bg-zinc-950"
                    />
                    <button type="submit" className="w-full rounded-lg bg-blue-600 py-1.5 text-xs font-bold text-white transition-colors hover:bg-blue-700">
                      Add to Circle
                    </button>
                  </form>
                )}

                <div className="border-t border-zinc-50 pt-3 dark:border-zinc-800 px-1">
                  <form action={leaveConversationAction}>
                    <button type="submit" className="w-full rounded-lg bg-red-50 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40">
                      Leave Support Circle
                    </button>
                  </form>
                </div>
                {memberError && (
                  <p className="mt-2 px-1 text-[10px] text-red-500 font-medium">
                    Error: {decodeURIComponent(memberError)}
                  </p>
                )}
              </div>
            </details>
          </div>
        </header>

        <ChatThread
          conversationId={conversationId}
          initialMessages={initialMessages}
          messageSenderNames={Object.fromEntries(messageSenderNames)}
        />
      </main>
    </div>
  );
}
