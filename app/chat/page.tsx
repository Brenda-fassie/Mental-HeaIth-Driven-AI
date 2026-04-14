import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import "./corkboard.css";

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
          .select("id,title,updated_at, messages(count)")
          .in("id", conversationIds)
      : { data: [] as any[], error: null };

  if (conversationError) {
    throw new Error(conversationError.message);
  }

  const conversations = (conversationRows ?? [])
    .filter((conv: any) => (conv.messages?.[0]?.count ?? 0) > 0)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-zinc-950 font-sans antialiased text-zinc-900 dark:text-zinc-50">
      {/* Sidebar - Consistent with chat views */}
      <aside className="hidden w-72 flex-col border-r border-zinc-100 bg-zinc-50/50 md:flex dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex h-24 items-center border-b border-zinc-100 px-6 dark:border-zinc-800">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/Logo.svg" alt="Rooftop" width={56} height={56} className="dark:invert" />
          </Link>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto p-4">
          <Link
            href="/chat/new"
            className="mb-6 flex items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-sm font-semibold text-black shadow-sm transition-all hover:opacity-90"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </Link>

          <div className="space-y-1">
            <h3 className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Navigation
            </h3>
            <Link
              href="/chat"
              className="flex items-center justify-between rounded-lg bg-brand/10 px-3 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-600 transition-all hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Profile Settings
            </Link>
          </div>
        </div>

        <div className="border-t border-zinc-100 p-4 dark:border-zinc-800">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {user.email?.[0].toUpperCase() ?? "U"}
            </div>
            <span className="truncate">{user.email}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col min-w-0 overflow-y-auto">
        {/* Mobile Header */}
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-zinc-100 px-6 md:hidden dark:border-zinc-800">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/Logo.svg" alt="Rooftop" width={48} height={48} className="dark:invert" />
          </Link>
          <div className="flex items-center gap-3">
             <Link href="/profile" className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Profile</Link>
             <form action={signOut}>
                <button type="submit" className="text-sm font-medium text-red-600">Sign out</button>
             </form>
          </div>
        </header>

        <div className="mx-auto w-full max-w-6xl p-6 lg:p-12">
          <div className="mb-12 flex flex-col items-center justify-center text-center gap-4">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Welcome to Rooftop</h1>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-lg">Your digital board of shared thoughts and connections.</p>
            
            <Link
              href="/chat/new"
              className="mt-4 h-14 inline-flex items-center justify-center px-10 rounded-2xl bg-brand text-lg font-black text-black shadow-xl shadow-brand/20 hover:scale-105 hover:opacity-90 transition-all active:scale-95"
            >
              Start a New Conversation
            </Link>
          </div>

          <section className="corkboard-section">
            <h2 className="mb-10 self-start px-4 text-xl font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 font-comfortaa">
              Recent Chats
            </h2>
            
            {conversations.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-20 text-center w-full">
                  <div className="h-16 w-16 rounded-3xl bg-zinc-50 flex items-center justify-center mb-6 dark:bg-zinc-900">
                    <span className="text-3xl text-zinc-300">📌</span>
                  </div>
                  <p className="text-zinc-400 font-gloria text-xl">Empty board... your recent chats will appear here.</p>
               </div>
            ) : (
              <div className="corkboard-grid">
                {conversations.map((conversation) => (
                  <Link
                    key={conversation.id}
                    href={`/chat/${conversation.id}`}
                    className="corkboard-card"
                  >
                    <div className="corkboard-pin" />
                    <h3 className="corkboard-title">
                      {conversation.title ?? "Untitled chat"}
                    </h3>
                    <p className="corkboard-meta">
                      Updated {new Date(conversation.updated_at).toLocaleDateString()}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Desktop Logout */}
        <div className="mt-auto hidden border-t border-zinc-100 p-6 md:block dark:border-zinc-800">
           <form action={signOut} className="flex justify-end">
              <button type="submit" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors font-comfortaa">
                 End Session / Sign out
              </button>
           </form>
        </div>
      </main>
    </div>
  );
}
