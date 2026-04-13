import Link from "next/link";
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

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <Link href="/chat" className="text-sm text-blue-600">
          Back to chat
        </Link>
      </div>

      {error ? (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {decodeURIComponent(error)}
        </p>
      ) : null}

      {success ? (
        <p className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {decodeURIComponent(success)}
        </p>
      ) : null}

      <form action={updateProfileAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Display name</span>
          <input
            name="displayName"
            defaultValue={profile?.display_name ?? ""}
            className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="How your name appears"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Username</span>
          <input
            name="username"
            defaultValue={profile?.username ?? ""}
            className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="your_username"
            required
          />
          <span className="text-xs text-zinc-500">
            3-24 characters. Letters, numbers, and underscores only.
          </span>
        </label>

        <button
          type="submit"
          className="w-fit rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white"
        >
          Save profile
        </button>
      </form>
    </main>
  );
}