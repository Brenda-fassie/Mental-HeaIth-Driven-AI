import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
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

export default async function ChatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: membershipRows, error: membershipError } = await supabase
    .from("conversation_members")
    .select("conversation_id,joined_at")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: false });

  if (membershipError) {
    throw new Error(membershipError.message);
  }

  const membershipRowsTyped = (membershipRows ?? []) as ConversationMembershipRow[];
  const conversationIds = membershipRowsTyped.map((row) => row.conversation_id);

  const { data: conversationRows, error: conversationError } =
    conversationIds.length > 0
      ? await supabase
          .from("conversations")
          .select("id,title,updated_at")
          .in("id", conversationIds)
      : { data: [] as ConversationRow[], error: null };

  if (conversationError) {
    throw new Error(conversationError.message);
  }

  const conversations = (conversationRows ?? []).sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );

  const resolvedConversations = conversations;

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Conversations</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className="rounded border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700"
          >
            Profile
          </Link>
          <form action={signOut}>
            <button
              className="rounded border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700"
              type="submit"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      <div className="flex gap-2">
        <Link
          href="/chat/new"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white"
        >
          New conversation
        </Link>
      </div>

      {resolvedConversations.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No conversations yet. Create one to start chatting.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {resolvedConversations.map((conversation) => (
            <li key={conversation.id}>
              <Link
                href={`/chat/${conversation.id}`}
                className="block rounded border border-zinc-200 px-4 py-3 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                <p className="font-medium">
                  {conversation.title ?? "Untitled conversation"}
                </p>
                <p className="text-xs text-zinc-500">
                  Updated {new Date(conversation.updated_at).toLocaleString()}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}