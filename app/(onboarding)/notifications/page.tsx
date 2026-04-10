import OnboardingHeader from "@/components/shared/onboarding-header";

const nudges = [
  {
    title: "Sarah noticed a 3-day gap",
    body: "Want a 60-second reset check-in?",
    time: "2h ago",
    tone: "bg-[#B2F7EF]",
  },
  {
    title: "Glimmer reminder",
    body: "Capture one good moment from today.",
    time: "Yesterday",
    tone: "bg-[#7BDFF2]",
  },
  {
    title: "Reflection streak",
    body: "You logged 5 check-ins this week. Keep the rhythm.",
    time: "2 days ago",
    tone: "bg-[#F2B5D4]",
  },
];

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-[#F7FAFF] flex flex-col">
      <OnboardingHeader />

      <main className="flex-1 p-4 md:p-8">
        <section className="mx-auto w-full max-w-4xl rounded-[34px] bg-white border border-gray-100 p-6 md:p-8 shadow-[0_16px_44px_-24px_rgba(0,0,0,0.18)]">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.22em] text-gray-400">Notifications</p>
            <h1 className="text-3xl md:text-4xl text-gray-900 mt-2">Sarah&apos;s nudges</h1>
            <p className="text-sm md:text-base text-gray-600 mt-2">A timeline of gentle check-ins and reminders.</p>
          </div>

          <div className="space-y-3">
            {nudges.map((nudge) => (
              <article key={nudge.title} className="rounded-2xl border border-gray-100 p-4 md:p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <p className="text-gray-900">{nudge.title}</p>
                    <p className="text-sm text-gray-600">{nudge.body}</p>
                  </div>
                  <span className={`h-3 w-3 rounded-full mt-1 ${nudge.tone}`} />
                </div>
                <p className="mt-3 text-xs text-gray-500">{nudge.time}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
