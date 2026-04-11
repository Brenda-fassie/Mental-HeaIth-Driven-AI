import OnboardingHeader from "@/components/shared/onboarding-header";
import Link from "next/link";

const resources = [
  "Crisis Helpline",
  "Nearest Mental Health Center",
  "Therapy Directory",
];

const friends = [
  { name: "Maya", relation: "Best friend", status: "Available" },
  { name: "Noah", relation: "Brother", status: "Busy" },
  { name: "Ari", relation: "Mentor", status: "Available" },
];

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <OnboardingHeader />

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <section className="rounded-3xl bg-card border border-border p-6 md:p-8 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#7BDFF2]">Support Network</p>
            <h1 className="text-3xl font-[family-name:var(--font-overlock)] font-bold text-card-foreground mt-2">Trusted Rooftop Friends</h1>

            <div className="mt-6 space-y-3">
              {friends.map((friend) => (
                <div key={friend.name} className="rounded-2xl bg-muted border border-border p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground">{friend.name}</p>
                    <p className="text-sm text-muted-foreground">{friend.relation}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${friend.status === "Available" ? "bg-emerald-400" : "bg-muted-foreground/40"}`} />
                    <button className="px-3 py-2 rounded-xl bg-card border border-border text-sm text-foreground hover:bg-muted transition-colors">
                      Share memory
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-3xl bg-[color:var(--surface-pink)] border border-border p-6 md:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#F2B5D4]">Emergency</p>
            <h2 className="text-2xl font-[family-name:var(--font-overlock)] font-bold text-foreground mt-2">Break glass resources</h2>

            <div className="mt-6 space-y-3">
              {resources.map((resource) => (
                <button
                  key={resource}
                  className="w-full text-left rounded-2xl bg-card p-4 border border-border hover:border-[#F2B5D4] font-medium text-foreground transition-colors"
                >
                  {resource}
                </button>
              ))}
            </div>

            <p className="mt-5 text-sm text-muted-foreground leading-relaxed">
              If you mention self-harm signals, Sarah can surface these immediately and help draft a message.
            </p>
          </aside>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/notifications"
            className="inline-flex items-center justify-center px-10 py-4 bg-[#7BDFF2] text-gray-900 rounded-2xl text-lg font-semibold hover:bg-[#5ED4E8] transition-colors active:scale-[0.98]"
          >
            Next
          </Link>
        </div>
      </main>
    </div>
  );
}
