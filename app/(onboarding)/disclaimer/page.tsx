import OnboardingHeader from "@/components/shared/onboarding-header";
import Link from "next/link";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <OnboardingHeader />
      <main className="flex-1 p-8 md:p-12 max-w-2xl mx-auto w-full flex flex-col justify-center space-y-12">
        <div className="space-y-6">
          <h1 className="text-4xl font-medium text-gray-900">Important Disclaimer</h1>
          <div className="space-y-4 text-lg text-gray-600 font-light leading-relaxed">
            <p>
              Rooftop is a mental wellness support tool, not a clinical replacement for professional therapy, medical diagnosis, or emergency services.
            </p>
            <p>
              If you are in immediate danger or experiencing a crisis, please contact your local emergency services or a crisis hotline immediately.
            </p>
          </div>
        </div>

        <div className="pt-8">
          <Link 
            href="/profile" 
            className="inline-block px-12 py-4 bg-black text-white rounded-full text-xl font-medium hover:bg-gray-800 transition-all"
          >
            I understand
          </Link>
        </div>
      </main>
    </div>
  );
}
