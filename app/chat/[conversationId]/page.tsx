import Link from "next/link";
import { redirect } from "next/navigation";
import type { UIMessage } from "ai";
import { createClient } from "@/utils/supabase/server";
import ChatThread from "./thread";

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

type PageProps = {
  params: Promise<{ conversationId: string }>;
};

export default async function ConversationPage({ params }: PageProps) {
  const { conversationId } = await params;

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
          {conversations.map((conversation) => (
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
        <ChatThread
          conversationId={conversationId}
          initialMessages={initialMessages}
          messageSenderNames={Object.fromEntries(messageSenderNames)}
        />
      </section>
    </main>
  );
}