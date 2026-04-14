import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

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
        <div className="flex h-16 items-center border-b border-zinc-100 px-6 dark:border-zinc-800">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/Logo.svg" alt="Rooftop" width={24} height={24} className="dark:invert" />
            <span className="font-bold tracking-tight">Rooftop</span>
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
              Your Circles
            </h3>
            {conversations.length === 0 ? (
               <p className="px-2 py-4 text-xs text-zinc-400 italic">No circles yet...</p>
            ) : (
              conversations.map((conversation) => (
                <Link
                  key={conversation.id}
                  href={`/chat/${conversation.id}`}
                  className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-600 transition-all hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  <span className="truncate pr-2 font-medium">
                    {conversation.title ?? "Untitled conversation"}
                  </span>
                </Link>
              ))
            )}
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

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col min-w-0 overflow-y-auto">
        {/* Mobile Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-100 px-6 md:hidden dark:border-zinc-800">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/Logo.svg" alt="Rooftop" width={24} height={24} className="dark:invert" />
            <span className="font-bold tracking-tight">Rooftop</span>
          </Link>
          <div className="flex items-center gap-3">
             <Link href="/profile" className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Profile</Link>
             <form action={signOut}>
                <button type="submit" className="text-sm font-medium text-red-600">Sign out</button>
             </form>
          </div>
        </header>

        <div className="mx-auto w-full max-w-4xl p-6 lg:p-12">
          <div className="mb-10 flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Welcome to Rooftop</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Your safe space for sharing, healing, and connecting.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
             {/* Quick Actions */}
             <div className="flex flex-col gap-4 rounded-3xl border border-zinc-100 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                   <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                   </svg>
                </div>
                <div>
                   <h3 className="text-lg font-bold">Start Fresh</h3>
                   <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Create a new support circle and invite people who understand your journey.</p>
                </div>
                <Link
                  href="/chat/new"
                  className="mt-2 inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-md shadow-blue-200 dark:shadow-none"
                >
                  Create New Circle
                </Link>
             </div>

             <div className="flex flex-col gap-4 rounded-3xl border border-zinc-100 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="h-12 w-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                   <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                   </svg>
                </div>
                <div>
                   <h3 className="text-lg font-bold">Your Identity</h3>
                   <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Update your display name or username to feel more comfortable in your circles.</p>
                </div>
                <Link
                  href="/profile"
                  className="mt-2 inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 text-sm font-bold transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                >
                  Edit Profile
                </Link>
             </div>
          </div>

          <div className="mt-12">
            <h2 className="mb-6 text-xl font-bold">Recent Circles</h2>
            
            {conversations.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-12 text-center rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
                  <p className="text-zinc-500">You haven&apos;t joined any support circles yet.</p>
                  <Link href="/chat/new" className="mt-4 text-sm font-bold text-blue-600 hover:underline underline-offset-4">Create your first circle →</Link>
               </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {conversations.map((conversation) => (
                  <Link
                    key={conversation.id}
                    href={`/chat/${conversation.id}`}
                    className="group flex items-center justify-between rounded-2xl border border-zinc-100 bg-white p-5 transition-all hover:border-blue-100 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                  >
                    <div className="flex items-center gap-4">
                       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                          <span className="text-lg">💬</span>
                       </div>
                       <div>
                          <p className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors">
                            {conversation.title ?? "Untitled circle"}
                          </p>
                          <p className="text-[11px] text-zinc-400">
                            Last activity {new Date(conversation.updated_at).toLocaleDateString()}
                          </p>
                       </div>
                    </div>
                    <svg className="h-5 w-5 text-zinc-300 group-hover:translate-x-1 group-hover:text-blue-400 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Logout - Hidden on mobile as it's in header */}
        <div className="mt-auto hidden border-t border-zinc-100 p-6 md:block dark:border-zinc-800">
           <form action={signOut} className="flex justify-end">
              <button type="submit" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors">
                 End Session / Sign out
              </button>
           </form>
        </div>
      </main>
    </div>
  );
}
