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

export default function SignupPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const supabase = createClient();

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						full_name: name,
					},
				},
			});

			if (error) throw error;

			if (data.user) {
				router.push("/welcome");
			}
		} catch (err: any) {
			setError(err.message || "An error occurred during signup.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<main className="relative min-h-screen bg-slate-50/50 flex items-center justify-center p-6 overflow-hidden">
			{/* Subtle Background Ambient Blurs */}
			<div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
				<div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-cyan-100 rounded-full blur-[120px]" />
				<div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-rose-100 rounded-full blur-[120px]" />
			</div>

			<div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
				{/* Left Side: Branding */}
				<div className="hidden lg:flex flex-col space-y-12">
					<div className="relative w-48">
						<Image src="/Logo.svg" alt="Rooftop" width={200} height={60} className="object-contain grayscale brightness-0 opacity-80" priority />
					</div>
					
					<div className="space-y-8">
						<h1 className="text-7xl font-semibold text-slate-900 leading-[1.1] tracking-tight">
							Your journey to <br />
							<span className="text-cyan-600">wellness</span> starts here.
						</h1>
						<p className="text-2xl text-slate-500 font-light max-w-lg leading-relaxed">
							Experience a new way of personal growth. Secure, private, and designed for your peace of mind.
						</p>
					</div>

					<div className="flex items-center space-x-6">
						<div className="flex -space-x-3">
							{[1, 2, 3, 4].map((i) => (
								<div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 ring-1 ring-slate-100 shadow-sm" />
							))}
						</div>
						<div className="space-y-1">
							<p className="text-sm font-semibold text-slate-900">Join a thriving community</p>
							<p className="text-xs text-slate-500">2,400+ members active today</p>
						</div>
					</div>
				</div>

				{/* Right Side: shadcn/ui Form */}
				<div className="flex justify-center lg:justify-end">
					<Card className="w-full max-w-[480px] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-[32px] bg-white/90 backdrop-blur-md">
						<CardHeader className="space-y-4 pb-8 text-center lg:text-left">
							<div className="lg:hidden mb-6 flex justify-center">
								<Image src="/Logo.svg" alt="Rooftop" width={140} height={40} className="opacity-80" />
							</div>
							<CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Create account</CardTitle>
							<CardDescription className="text-slate-500 text-lg">
								Enter your details to begin your onboarding.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<form className="space-y-5" onSubmit={handleSignup}>
								{error && (
									<div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
										{error}
									</div>
								)}
								<div className="space-y-2">
									<Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Full Name</Label>
									<Input 
										id="name" 
										required
										value={name}
										onChange={(e) => setName(e.target.value)}
										placeholder="Sarah Parker" 
										className="h-14 rounded-2xl bg-slate-50 border-slate-100 focus-visible:ring-cyan-200 transition-all text-lg px-5" 
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email address</Label>
									<Input 
										id="email" 
										type="email" 
										required
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="sarah@example.com" 
										className="h-14 rounded-2xl bg-slate-50 border-slate-100 focus-visible:ring-cyan-200 transition-all text-lg px-5" 
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="password" title="At least 6 characters" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Password</Label>
									<Input 
										id="password" 
										type="password" 
										required
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="••••••••" 
										className="h-14 rounded-2xl bg-slate-50 border-slate-100 focus-visible:ring-cyan-200 transition-all text-lg px-5" 
									/>
								</div>
								<div className="pt-2">
									<Button 
										type="submit"
										disabled={isLoading}
										className="w-full h-14 rounded-2xl text-lg font-semibold bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-50"
									>
										{isLoading ? "Creating account..." : "Get Started"}
									</Button>
								</div>
							</form>

							<div className="space-y-6 pt-4">
								<p className="text-center text-slate-500">
									Already have an account?{" "}
									<Link href="/login" className="text-slate-900 font-bold hover:underline underline-offset-4">
										Log in
									</Link>
								</p>
								<div className="relative">
									<div className="absolute inset-0 flex items-center">
										<span className="w-full border-t border-slate-100" />
									</div>
									<div className="relative flex justify-center text-xs uppercase">
										<span className="bg-white px-2 text-slate-400 font-medium">Privacy guaranteed</span>
									</div>
								</div>
								<p className="text-[11px] text-center text-slate-400 leading-relaxed max-w-[280px] mx-auto">
									By joining, you agree to our <Link href="/terms" className="hover:text-slate-600 underline">Terms of Service</Link> and <Link href="/privacy" className="hover:text-slate-600 underline">Privacy Policy</Link>.
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</main>
	);
}
