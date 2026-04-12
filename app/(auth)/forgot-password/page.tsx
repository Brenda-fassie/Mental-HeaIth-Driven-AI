"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    setIsLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <main className="relative min-h-screen bg-background flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Ambient blurs */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#B2F7EF] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#F2B5D4] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-[480px]">
        <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] rounded-[32px] bg-card/90 backdrop-blur-md">
          <CardHeader className="space-y-4 pb-8 text-center">
            <div className="flex justify-center mb-4">
              <Image src="/Logo.svg" alt="Rooftop" width={140} height={40} className="opacity-90 dark:invert" />
            </div>
            <CardTitle className="text-3xl font-[family-name:var(--font-overlock)] font-bold tracking-tight text-card-foreground">
              Reset password
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              {submitted
                ? "Check your email for a reset link."
                : "Enter your email and we'll send you a reset link."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {submitted ? (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-[#B2F7EF]/40 rounded-full flex items-center justify-center mx-auto">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-8 h-8 text-teal-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">
                  If an account exists for <strong>{email}</strong>, you will receive a password reset email shortly.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center w-full h-14 rounded-2xl bg-[#7BDFF2] text-gray-900 font-semibold hover:bg-[#5ED4E8] transition-colors"
                >
                  Back to Sign In
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-14 rounded-2xl bg-muted border-transparent focus-visible:ring-[#7BDFF2] transition-all text-base px-5"
                  />
                </div>
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 rounded-2xl text-base font-semibold bg-[#7BDFF2] text-gray-900 hover:bg-[#5ED4E8] shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {isLoading ? "Sending…" : "Send Reset Link"}
                  </Button>
                </div>
                <p className="text-center text-muted-foreground text-sm">
                  Remember your password?{" "}
                  <Link href="/login" className="text-foreground font-bold hover:underline underline-offset-4">
                    Sign in
                  </Link>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
