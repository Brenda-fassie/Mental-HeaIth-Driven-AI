import OnboardingHeader from "@/components/shared/onboarding-header";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <OnboardingHeader />
      <main className="flex-1 p-8 md:p-12 max-w-2xl mx-auto w-full flex flex-col justify-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-5xl font-medium text-gray-900">Welcome</h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed">
            We're glad you're here. Let's take a moment to get you settled into the rooftop.
          </p>
        </div>

        <div className="pt-8">
          <Link 
            href="/disclaimer" 
            className="inline-block px-12 py-4 bg-black text-white rounded-full text-xl font-medium hover:bg-gray-800 transition-all"
          >
            Next
          </Link>
        </div>
      </main>
    </div>
  );
}
