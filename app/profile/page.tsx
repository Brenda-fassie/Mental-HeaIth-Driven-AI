import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

type PageProps = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,24}$/;

export default async function ProfilePage({ searchParams }: PageProps) {
  const { error, success } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name,username")
    .eq("id", user.id)
    .maybeSingle();

  // Fetch conversations for the sidebar
  const { data: membershipRows } = await supabase
    .from("conversation_members")
    .select("conversation_id,joined_at")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: false });

  const conversationIds = (membershipRows ?? []).map((row) => row.conversation_id);

  const { data: conversationRows } =
    conversationIds.length > 0
      ? await supabase
          .from("conversations")
          .select("id,title,updated_at")
          .in("id", conversationIds)
      : { data: [] };

  const conversations = (conversationRows ?? []).sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );

  async function updateProfileAction(formData: FormData) {
    "use server";

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const displayName = String(formData.get("displayName") ?? "").trim();
    const username = String(formData.get("username") ?? "").trim();

    if (!USERNAME_PATTERN.test(username)) {
      redirect(
        "/profile?error=Username%20must%20be%203-24%20characters%20using%20letters%2C%20numbers%2C%20or%20underscores",
      );
    }

    const { data: duplicateProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .neq("id", user.id)
      .maybeSingle();

    if (duplicateProfile) {
      redirect("/profile?error=That%20username%20is%20already%20taken");
    }

    const { error } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        username,
        display_name: displayName.length > 0 ? displayName : null,
      },
      { onConflict: "id" },
    );

    if (error) {
      redirect(`/profile?error=${encodeURIComponent(error.message)}`);
    }

    redirect("/profile?success=Profile%20updated");
  }

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
          <div className="flex items-center gap-3 rounded-lg bg-blue-50 px-2 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-400">
              {user.email?.[0].toUpperCase() ?? "U"}
            </div>
            <span className="truncate">{user.email}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col min-w-0 overflow-y-auto">
        {/* Mobile Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-100 px-6 md:hidden dark:border-zinc-800">
          <Link href="/chat" className="flex items-center gap-2">
             <svg className="h-5 w-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
             </svg>
             <span className="font-bold tracking-tight">Profile</span>
          </Link>
          <div className="flex items-center gap-3">
             <form action={signOut}>
                <button type="submit" className="text-sm font-medium text-red-600">Sign out</button>
             </form>
          </div>
        </header>

        <div className="mx-auto w-full max-w-2xl p-6 lg:p-12">
          <div className="mb-10 flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Your Profile</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Manage how you appear in your support circles.</p>
          </div>

          <div className="space-y-8">
            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
                <p className="font-bold">Updating failed</p>
                <p>{decodeURIComponent(error)}</p>
              </div>
            ) : null}

            {success ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-400">
                <p className="font-bold">Success</p>
                <p>{decodeURIComponent(success)}</p>
              </div>
            ) : null}

            <form action={updateProfileAction} className="space-y-6">
               <div className="space-y-4 rounded-3xl border border-zinc-100 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                      Display Name
                    </label>
                    <input
                      name="displayName"
                      defaultValue={profile?.display_name ?? ""}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-blue-900/20"
                      placeholder="e.g. Alex"
                    />
                    <p className="text-[11px] text-zinc-400">This is how your name will appear to others in support circles.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                      Username
                    </label>
                    <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">@</span>
                       <input
                         name="username"
                         defaultValue={profile?.username ?? ""}
                         className="w-full rounded-xl border border-zinc-200 bg-white pl-8 pr-4 py-3 text-sm transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-blue-900/20"
                         placeholder="your_unique_id"
                         required
                       />
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      3-24 characters. Letters, numbers, and underscores only. This is how people can invite you.
                    </p>
                  </div>
               </div>

               <div className="flex items-center justify-between gap-4">
                  <Link href="/chat" className="text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 dark:shadow-none"
                  >
                    Save Changes
                  </button>
               </div>
            </form>

            <div className="pt-10">
               <div className="rounded-3xl border border-red-100 bg-red-50/30 p-8 dark:border-red-900/20 dark:bg-red-950/10">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-4">Security</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                     <div>
                        <p className="text-sm font-bold">End Session</p>
                        <p className="text-xs text-zinc-500">Sign out of your account on this device.</p>
                     </div>
                     <form action={signOut}>
                        <button type="submit" className="rounded-lg bg-red-100 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-400 dark:hover:bg-red-900/60 transition-colors">
                           Sign Out
                        </button>
                     </form>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
