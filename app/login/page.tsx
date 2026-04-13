"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit =
    (mode: "signin" | "signup") => async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);
      setSuccess(null);
      setIsLoading(true);

      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
          setIsLoading(false);
          return;
        }

        router.push("/chat");
        router.refresh();
        return;
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
        return;
      }

      setSuccess("Account created. Check your email for the confirmation link.");
      setIsLoading(false);
    };

  const authError = searchParams.get("error");

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 px-6 py-12">
      <h1 className="text-2xl font-semibold">Login</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Sign in to continue your chat history, or create a new account.
      </p>

      {authError ? (
        <p className="text-sm text-red-500">Auth error: {decodeURIComponent(authError)}</p>
      ) : null}

      <form onSubmit={handleSubmit("signin")} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          className="rounded border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-900"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="rounded border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-900"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        {success ? <p className="text-sm text-green-600">{success}</p> : null}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
          >
            Sign in
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={async () => {
              setError(null);
              setSuccess(null);
              setIsLoading(true);

              const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                  emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
              });

              if (signUpError) {
                setError(signUpError.message);
                setIsLoading(false);
                return;
              }

              setSuccess("Account created. Check your email for the confirmation link.");
              setIsLoading(false);
            }}
            className="rounded border border-zinc-300 px-4 py-2 dark:border-zinc-700"
          >
            Sign up
          </button>
        </div>
      </form>
    </main>
  );
}