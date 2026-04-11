import OnboardingHeader from "@/components/shared/onboarding-header";

const dayLevels = [
  0, 1, 2, 3, 2, 1, 0,
  1, 2, 3, 3, 2, 1, 0,
  0, 1, 2, 2, 3, 2, 1,
  1, 1, 2, 3, 2, 1, 0,
  0, 1,
];

const levelColor = ["bg-muted", "bg-[#B2F7EF]", "bg-[#7BDFF2]", "bg-[#F2B5D4]"];

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <OnboardingHeader />

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto w-full max-w-6xl grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6 md:gap-8">
          <section className="rounded-3xl bg-card border border-border p-6 md:p-8 shadow-sm">
            <div className="mb-8 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#7BDFF2]">Calendar</p>
              <h1 className="text-3xl md:text-4xl font-[family-name:var(--font-overlock)] font-bold text-card-foreground">Your emotional heat map</h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Each dot is a daily signal. Tap a day to open Sarah&apos;s summary and related uploads.
              </p>
            </div>

            <div className="grid grid-cols-7 gap-3">
              {dayLevels.map((level, index) => (
                <button
                  key={index}
                  className={`h-10 rounded-full ${levelColor[level]} hover:scale-110 transition-transform`}
                  aria-label={`Day ${index + 1}`}
                />
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-muted inline-block" /> quiet</span>
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#B2F7EF] inline-block" /> steady</span>
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#7BDFF2] inline-block" /> expressive</span>
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#F2B5D4] inline-block" /> intense</span>
            </div>
          </section>

          <aside className="rounded-3xl bg-[color:var(--surface-teal)] border border-border p-6 md:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">Selected Day</p>
            <h2 className="text-2xl font-[family-name:var(--font-overlock)] font-bold text-foreground mt-2">April 10</h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-card p-4 border border-border shadow-sm">
                <p className="text-sm font-semibold text-card-foreground">Sarah&apos;s Summary</p>
                <p className="text-sm text-muted-foreground mt-2">
                  You felt low-energy early, then more grounded after your evening check-in. Sleep and social contact were both helpful.
                </p>
              </div>

              <div className="rounded-2xl bg-card p-4 border border-border shadow-sm">
                <p className="text-sm font-semibold text-card-foreground">Gallery Links</p>
                <ul className="mt-2 text-sm text-muted-foreground space-y-1.5">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#7BDFF2]" /> Window light photo</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#7BDFF2]" /> Voice note: post-walk reflection</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#7BDFF2]" /> Notebook page upload</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
