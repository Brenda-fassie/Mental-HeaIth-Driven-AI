"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function LoginPage() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const router = useRouter();
const supabase = createClient();

const handleLogin = async (e: React.FormEvent) => {
e.preventDefault();
setIsLoading(true);
setError(null);

try {
const { data, error } = await supabase.auth.signInWithPassword({
email,
password,
});

if (error) throw error;

if (data.user) {
router.push("/chat");
}
} catch (err: any) {
setError(err.message || "Invalid email or password.");
} finally {
setIsLoading(false);
}
};

return (
<main className="relative min-h-screen bg-background flex items-center justify-center p-6 overflow-hidden">
{/* Theme toggle */}
<div className="absolute top-6 right-6 z-20">
<ThemeToggle />
</div>

{/* Ambient background blobs */}
<div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
<div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#B2F7EF] rounded-full blur-[120px]" />
<div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#F2B5D4] rounded-full blur-[120px]" />
</div>

<div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
{/* Left Side: Branding */}
<div className="hidden lg:flex flex-col space-y-12">
<div className="relative w-48">
<Image src="/Logo.svg" alt="Rooftop" width={200} height={60} className="object-contain dark:invert" priority />
</div>

<div className="space-y-8">
<h1 className="text-7xl font-[family-name:var(--font-overlock)] font-bold text-foreground leading-[1.1]">
Welcome back <br />
to the <span className="text-[#7BDFF2]">rooftop.</span>
</h1>
<p className="text-2xl text-muted-foreground font-light max-w-lg leading-relaxed">
Pick up right where you left off. Your personal space for reflection and growth is waiting.
</p>
</div>
</div>

{/* Right Side: Form */}
<div className="flex justify-center lg:justify-end">
<Card className="w-full max-w-[480px] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] rounded-[32px] bg-card/90 backdrop-blur-md">
<CardHeader className="space-y-4 pb-8 text-center lg:text-left">
<div className="lg:hidden mb-6 flex justify-center">
<Image src="/Logo.svg" alt="Rooftop" width={140} height={40} className="opacity-90 dark:invert" />
</div>
<CardTitle className="text-3xl font-[family-name:var(--font-overlock)] font-bold tracking-tight text-card-foreground">Sign in</CardTitle>
<CardDescription className="text-muted-foreground text-base">
Enter your credentials to access your account.
</CardDescription>
</CardHeader>
<CardContent className="space-y-6">
<form className="space-y-5" onSubmit={handleLogin}>
{error && (
<div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl">
{error}
</div>
)}
<div className="space-y-2">
<Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Email address</Label>
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
<div className="space-y-2">
<div className="flex justify-between items-center px-1">
<Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Password</Label>
<span className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"><Link href="/forgot-password">Forgot?</Link></span>
</div>
<Input 
id="password" 
type="password" 
required
value={password}
onChange={(e) => setPassword(e.target.value)}
placeholder="••••••••" 
className="h-14 rounded-2xl bg-muted border-transparent focus-visible:ring-[#7BDFF2] transition-all text-base px-5" 
/>
</div>
<div className="pt-2">
<Button 
type="submit"
disabled={isLoading}
                className="w-full h-14 rounded-2xl text-base font-semibold bg-[#7BDFF2] text-gray-900 hover:bg-[#5ED4E8] shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
>
{isLoading ? "Signing in…" : "Sign In"}
</Button>
</div>
</form>

<div className="space-y-5 pt-2">
<p className="text-center text-muted-foreground text-sm">
Don&apos;t have an account?{" "}
<Link href="/signup" className="text-foreground font-bold hover:underline underline-offset-4">
Create one
</Link>
</p>
<div className="relative">
<div className="absolute inset-0 flex items-center">
<span className="w-full border-t border-border" />
</div>
<div className="relative flex justify-center text-[10px] uppercase">
<span className="bg-card px-3 text-muted-foreground font-medium tracking-widest">Secure access</span>
</div>
</div>
<p className="text-[11px] text-center text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
Your security is our priority. We use industry-standard encryption to protect your data.
</p>
</div>
</CardContent>
</Card>
</div>
</div>
</main>
);
}
