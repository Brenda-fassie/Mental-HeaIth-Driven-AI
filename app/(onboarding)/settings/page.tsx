import OnboardingHeader from "@/components/shared/onboarding-header";
import Link from "next/link";

const themes = ["Mint Calm", "Pink Warmth", "Blue Clarity", "Neutral Minimal"];

function ToggleRow({ title, hint, defaultChecked }: { title: string; hint: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 border border-gray-100">
      <div>
        <p className="text-gray-900">{title}</p>
        <p className="text-sm text-gray-500 mt-1">{hint}</p>
      </div>
      <span className="relative inline-flex items-center">
        <input type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
        <span className="h-7 w-12 rounded-full bg-gray-300 peer-checked:bg-[#7BDFF2] transition-colors" />
        <span className="absolute left-1 h-5 w-5 rounded-full bg-white shadow peer-checked:translate-x-5 transition-transform" />
      </span>
    </label>
  );
}

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#F8F8FC] flex flex-col">
      <OnboardingHeader />

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto w-full max-w-4xl rounded-[34px] bg-[#EEF4FF] border border-blue-100 p-6 md:p-10">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.22em] text-gray-500">Customizations</p>
            <h1 className="text-3xl md:text-4xl text-gray-900 mt-2">Tune Sarah to your style</h1>
          </div>

          <div className="space-y-4">
            <ToggleRow title="Directness" hint="Honest and straightforward coaching tone." defaultChecked />
            <ToggleRow title="Notification Frequency" hint="Let Sarah nudge you through the week." defaultChecked />
            <ToggleRow title="Reflection Prompts" hint="Enable deeper follow-up questions after check-ins." />
          </div>

          <div className="mt-8 rounded-2xl bg-white p-5 border border-gray-100">
            <p className="text-sm font-medium text-gray-900">Visual Theme</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {themes.map((theme) => (
                <button key={theme} className="px-4 py-2 rounded-full bg-gray-100 hover:bg-[#B2F7EF] text-sm text-gray-700 transition-colors">
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button className="px-8 py-3 rounded-xl bg-[#D3D8E2] text-gray-900 hover:bg-black hover:text-white transition-all duration-300">
              Save Preferences
            </button>
            <Link 
              href="/menu" 
              className="px-8 py-3 bg-black text-white rounded-xl text-center font-medium hover:bg-gray-800 transition-all"
            >
              Finish Setup
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
