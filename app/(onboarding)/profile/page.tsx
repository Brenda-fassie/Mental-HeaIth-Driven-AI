import OnboardingHeader from "@/components/shared/onboarding-header";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <OnboardingHeader />
      <main className="flex-1 p-8 md:p-12 max-w-2xl mx-auto w-full flex flex-col justify-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-medium text-gray-900">Create your profile</h1>
          <p className="text-xl text-gray-600 font-light">
            How should we address you on the rooftop?
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            Username
          </label>
          <input 
            type="text" 
            placeholder="Choose a display name"
            className="w-full bg-[#F2F2F2] rounded-2xl p-5 text-lg text-gray-600 font-light focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>

        <div className="pt-8">
          <Link 
            href="/contacts" 
            className="inline-block px-12 py-4 bg-black text-white rounded-full text-xl font-medium hover:bg-gray-800 transition-all text-center"
          >
            Next
          </Link>
        </div>
      </main>
    </div>
  );
}
