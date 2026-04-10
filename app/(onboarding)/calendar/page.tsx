import OnboardingHeader from "@/components/shared/onboarding-header";

const dayLevels = [
  0, 1, 2, 3, 2, 1, 0,
  1, 2, 3, 3, 2, 1, 0,
  0, 1, 2, 2, 3, 2, 1,
  1, 1, 2, 3, 2, 1, 0,
  0, 1,
];

const levelColor = ["bg-gray-200", "bg-[#B2F7EF]", "bg-[#7BDFF2]", "bg-[#F2B5D4]"];

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-[#F5FAFF] flex flex-col">
      <OnboardingHeader />

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto w-full max-w-6xl grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6 md:gap-8">
          <section className="rounded-[34px] bg-white border border-blue-100 p-6 md:p-8 shadow-[0_18px_45px_-26px_rgba(59,130,246,0.3)]">
            <div className="mb-8 space-y-2">
              <p className="text-xs uppercase tracking-[0.22em] text-gray-400">Calendar</p>
              <h1 className="text-3xl md:text-4xl text-gray-900">Your emotional heat map</h1>
              <p className="text-sm md:text-base text-gray-600">
                Each dot is a daily signal. Tap a day to open Sarah&apos;s summary and related uploads.
              </p>
            </div>

            <div className="grid grid-cols-7 gap-3">
              {dayLevels.map((level, index) => (
                <button
                  key={index}
                  className={`h-10 rounded-full ${levelColor[level]} hover:scale-105 transition-transform`}
                  aria-label={`Day ${index + 1}`}
                />
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4 text-xs text-gray-600">
              <span className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-gray-200" /> quiet</span>
              <span className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-[#B2F7EF]" /> steady</span>
              <span className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-[#7BDFF2]" /> expressive</span>
              <span className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-[#F2B5D4]" /> intense</span>
            </div>
          </section>

          <aside className="rounded-[34px] bg-[#EFF7F6] border border-gray-200 p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.22em] text-gray-500">Selected Day</p>
            <h2 className="text-2xl text-gray-900 mt-2">April 10</h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-white p-4 border border-gray-100">
                <p className="text-sm font-medium text-gray-900">Sarah&apos;s Summary</p>
                <p className="text-sm text-gray-600 mt-2">
                  You felt low-energy early, then more grounded after your evening check-in. Sleep and social contact were both helpful.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4 border border-gray-100">
                <p className="text-sm font-medium text-gray-900">Gallery Links</p>
                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                  <li>Window light photo</li>
                  <li>Voice note: post-walk reflection</li>
                  <li>Notebook page upload</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
