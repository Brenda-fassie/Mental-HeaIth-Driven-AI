import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
	return (
		<main className="relative min-h-screen bg-white flex items-center justify-center p-6 overflow-hidden">
			{/* Decorative Elements matching SignupPage */}
			<div className="fixed bottom-10 left-10 md:bottom-20 md:left-20 z-0 opacity-90 transition-transform hover:scale-105 duration-500">
				<Image src="/Orange_Shirt.svg" alt="" width={180} height={180} priority />
			</div>

			<div className="fixed top-10 left-[15%] z-0 opacity-80 -rotate-12 hidden lg:block">
				<Image src="/Green_1.svg" alt="" width={120} height={120} />
			</div>

			<div className="fixed top-1/2 -right-12 -translate-y-1/2 z-0 opacity-90 rotate-12 hidden md:block">
				<Image src="/Green_2.svg" alt="" width={220} height={220} />
			</div>

			<div className="fixed bottom-12 right-[10%] z-0 opacity-70 rotate-45 hidden lg:block">
				<Image src="/Green_1.svg" alt="" width={100} height={100} />
			</div>

			<div className="relative z-10 max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
				<div className="flex justify-center md:justify-end">
					<form className="w-full max-w-[460px] bg-white p-12 md:p-16 rounded-[50px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-50 space-y-10">
						<h2 className="text-4xl font-normal text-gray-800">Login</h2>

						<div className="space-y-8">
							<div className="space-y-2">
								<label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 pl-1">
									Email
								</label>
								<input
									type="email"
									id="email"
									placeholder="your.name@email.com"
									className="w-full bg-[#F2F2F2] rounded-2xl p-5 text-lg text-gray-500 font-light focus:outline-none focus:ring-2 focus:ring-gray-200"
								/>
							</div>

							<div className="space-y-2">
								<label htmlFor="password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 pl-1">
									Password
								</label>
								<input
									type="password"
									id="password"
									placeholder="••••••••"
									className="w-full bg-[#F2F2F2] rounded-2xl p-5 text-lg text-gray-500 font-light focus:outline-none focus:ring-2 focus:ring-gray-200"
								/>
							</div>
						</div>

						<Link 
							href="/welcome" 
							className="block w-full py-5 bg-[#D3D8E2] rounded-xl text-xl font-medium text-gray-700 text-center hover:bg-black hover:text-white transition-all duration-300"
						>
							Sign In
						</Link>

						<div className="text-center space-y-3 pt-4">
							<p className="text-[11px] text-gray-400 uppercase tracking-wider">Welcome back to the rooftop</p>
							<div className="flex justify-center gap-4 text-xs">
								<Link href="/signup" className="text-blue-500 underline hover:text-blue-700">
									Create an account
								</Link>
								<span className="text-gray-400 cursor-not-allowed">
									Forgot Password?
								</span>
							</div>
						</div>
					</form>
				</div>

				<div className="flex flex-col items-center md:items-start space-y-8">
					<div className="relative">
						<Image src="/Logo.svg" alt="Rooftop" width={320} height={100} className="object-contain" />
					</div>

					<div className="space-y-4 text-center md:text-left">
						<h1 className="text-6xl font-medium text-gray-900 tracking-tight">Login to Rooftop</h1>
						<p className="text-2xl text-gray-600 font-light max-w-md leading-relaxed">
							Pick up right where you left off. The rooftop is always open.
						</p>
					</div>
				</div>
			</div>
		</main>
	);
}
