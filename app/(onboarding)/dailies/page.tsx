import OnboardingHeader from "@/components/shared/onboarding-header";

const prompts = [
  { label: "Mood", helper: "How heavy or light does today feel?", defaultValue: 62 },
  { label: "Energy", helper: "How much fuel do you have right now?", defaultValue: 48 },
  { label: "Calm", helper: "How settled does your body feel?", defaultValue: 35 },
];

export default function DailiesPage() {
  return (
    <div className="min-h-screen bg-[#F1F9F7] flex flex-col">
      <OnboardingHeader />

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 md:gap-8">
          <section className="rounded-3xl bg-white border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="mb-8 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#7BDFF2]">Dailies</p>
              <h1 className="text-3xl md:text-4xl font-[family-name:var(--font-overlock)] font-bold text-gray-900">How are you feeling right now?</h1>
              <p className="text-sm md:text-base text-gray-600">
                Check in with Sarah in under a minute. Small logs build clear patterns over time.
              </p>
            </div>

            <div className="space-y-7">
              {prompts.map((prompt) => (
                <div key={prompt.label} className="space-y-2">
                  <div className="flex items-end justify-between gap-4">
                    <p className="text-lg text-gray-900">{prompt.label}</p>
                    <p className="text-xs text-gray-400">{prompt.helper}</p>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue={prompt.defaultValue}
                    className="w-full accent-[#7BDFF2]"
                    aria-label={prompt.label}
                  />
                </div>
              ))}
            </div>

            <button className="mt-8 w-full md:w-auto px-8 py-3 rounded-2xl bg-gray-900 text-white hover:bg-black transition-colors">
              Save Daily Check-in
            </button>
          </section>

          <aside className="rounded-3xl bg-[#FCE2E9] border border-pink-100 p-6 md:p-8 flex flex-col gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-pink-400">Multimodal</p>
              <h2 className="text-2xl font-[family-name:var(--font-overlock)] font-bold text-gray-900 mt-2">Quick Photo</h2>
              <p className="text-sm text-gray-700 mt-2">
                Capture your environment, a note, or a moment to help Sarah understand context.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-dashed border-pink-200 bg-white/70 min-h-44 flex items-center justify-center px-6 text-center text-gray-500 text-sm">
              Add a photo, screenshot, or handwritten note
            </div>

            <button className="w-full py-3 rounded-2xl bg-[#7BDFF2] text-gray-900 font-medium hover:brightness-95 transition-all">
              Add Photo
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}
