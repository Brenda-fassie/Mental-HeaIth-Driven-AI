import OnboardingHeader from "@/components/shared/onboarding-header";
import Link from "next/link";

const themes = ["Mint Calm", "Pink Warmth", "Blue Clarity", "Neutral Minimal"];

function ToggleRow({ title, hint, defaultChecked }: { title: string; hint: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 border border-gray-100 cursor-pointer">
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500 mt-0.5">{hint}</p>
      </div>
      <span className="relative inline-flex items-center shrink-0">
        <input type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
        <span className="h-7 w-12 rounded-full bg-gray-200 peer-checked:bg-[#7BDFF2] peer-focus:ring-2 peer-focus:ring-[#7BDFF2] peer-focus:ring-offset-1 transition-colors" />
        <span className="absolute left-1 h-5 w-5 rounded-full bg-white shadow peer-checked:translate-x-5 transition-transform" />
      </span>
    </label>
  );
}

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#F1F9F7] flex flex-col">
      <OnboardingHeader />

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto w-full max-w-4xl rounded-3xl bg-white border border-gray-100 shadow-sm p-6 md:p-10">
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#7BDFF2]">Customizations</p>
            <h1 className="text-3xl md:text-4xl font-[family-name:var(--font-overlock)] font-bold text-gray-900 mt-2">Tune Sarah to your style</h1>
          </div>

          <div className="space-y-3">
            <ToggleRow title="Directness" hint="Honest and straightforward coaching tone." defaultChecked />
            <ToggleRow title="Notification Frequency" hint="Let Sarah nudge you through the week." defaultChecked />
            <ToggleRow title="Reflection Prompts" hint="Enable deeper follow-up questions after check-ins." />
          </div>

          <div className="mt-8 rounded-2xl bg-[#F1F9F7] p-5 border border-gray-100">
            <p className="text-sm font-semibold text-gray-900">Visual Theme</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {themes.map((theme) => (
                <button key={theme} className="px-4 py-2 rounded-full bg-white border border-gray-200 hover:bg-[#B2F7EF] hover:border-[#7BDFF2] text-sm text-gray-700 transition-colors">
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button className="px-8 py-3.5 rounded-2xl bg-[#EFF7F6] text-gray-900 font-medium hover:bg-[#B2F7EF] transition-all duration-300">
              Save Preferences
            </button>
            <Link
              href="/menu"
              className="px-8 py-3.5 bg-gray-900 text-white rounded-2xl text-center font-medium hover:bg-black transition-all active:scale-[0.98]"
            >
              Finish Setup
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
