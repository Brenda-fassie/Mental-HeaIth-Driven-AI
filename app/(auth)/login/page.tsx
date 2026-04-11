import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
	return (
		<main className="relative min-h-screen bg-[#F1F9F7] flex items-center justify-center p-6 overflow-hidden">
			{/* Background Ambient Elements - Matching Signup */}
			<div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
				<div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#B2F7EF] rounded-full blur-[120px]" />
				<div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#F2B5D4] rounded-full blur-[120px]" />
			</div>

			<div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
				{/* Left Side: Branding & Value Prop */}
				<div className="hidden lg:flex flex-col space-y-10">
					<div className="relative w-64">
						<Image src="/Logo.svg" alt="Rooftop" width={260} height={80} className="object-contain" priority />
					</div>
					
					<div className="space-y-6">
						<h1 className="text-7xl font-medium text-gray-900 leading-[1.1] tracking-tight">
							Welcome back <br />
							to the <span className="text-black italic">rooftop.</span>
						</h1>
						<p className="text-2xl text-gray-600 font-light max-w-md leading-relaxed">
							Pick up exactly where you left off. Your safe space is waiting for you.
						</p>
					</div>
				</div>

				{/* Right Side: Modern Form Card */}
				<div className="flex justify-center lg:justify-end">
					<div className="w-full max-w-[500px] bg-white/80 backdrop-blur-xl p-10 md:p-14 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white">
						<div className="mb-10 text-center lg:text-left">
							<div className="lg:hidden mb-8 flex justify-center">
								<Image src="/Logo.svg" alt="Rooftop" width={180} height={60} />
							</div>
							<h2 className="text-3xl font-medium text-gray-900">Sign In</h2>
							<p className="text-gray-500 mt-2">Enter your details to access your account.</p>
						</div>

						<form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
							<div className="space-y-2">
								<label htmlFor="email" className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 ml-1">
									Email Address
								</label>
								<input
									type="email"
									id="email"
									placeholder="name@email.com"
									className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#B2F7EF] transition-all"
								/>
							</div>

							<div className="space-y-2">
								<div className="flex justify-between items-center px-1">
									<label htmlFor="password" className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
										Password
									</label>
									<button type="button" className="text-[10px] uppercase font-bold text-gray-400 hover:text-black transition-colors">
										Forgot?
									</button>
								</div>
								<input
									type="password"
									id="password"
									placeholder="••••••••"
									className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#B2F7EF] transition-all"
								/>
							</div>

							<div className="pt-4">
								<Link 
									href="/welcome" 
									className="group relative block w-full py-4 bg-black rounded-2xl text-xl font-medium text-white text-center overflow-hidden transition-all duration-300 shadow-xl shadow-black/10 hover:shadow-black/20"
								>
									<span className="relative z-10 transition-colors duration-300">
										Sign In
									</span>
									<div className="absolute inset-0 bg-[#333] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
								</Link>
							</div>

							<div className="text-center space-y-4 pt-6">
								<p className="text-sm text-gray-500">
									Don&apos;t have an account?{" "}
									<Link href="/signup" className="text-black font-semibold hover:underline">
										Sign up
									</Link>
								</p>
								<div className="h-px bg-gray-100 w-full" />
								<p className="text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">
									Protected by industry standard encryption. <br />
									Your data stays private.
								</p>
							</div>
						</form>
					</div>
				</div>
			</div>
		</main>
	);
}
