import Link from "next/link";

type HomeProps = {
  searchParams: Promise<{
    error?: string;
    error_description?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const error = params.error;
  const errorDescription = params.error_description;

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-12 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col gap-6 rounded border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-semibold">Mental Health App</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Continue to login or open your chat dashboard.
        </p>

        {error ? (
          <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            <p className="font-medium">Authentication error: {decodeURIComponent(error)}</p>
            {errorDescription ? (
              <p>{decodeURIComponent(errorDescription)}</p>
            ) : null}
            <p className="mt-2">Please request a new login/signup link.</p>
          </div>
        ) : null}

        <div className="flex gap-3">
          <Link href="/login" className="rounded bg-blue-600 px-4 py-2 text-sm text-white">
            Login
          </Link>
          <Link
            href="/chat"
            className="rounded border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"
          >
            Chat
          </Link>
        </div>
      </main>
    </div>
  );
}
