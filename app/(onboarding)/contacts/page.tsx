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
    <div className="min-h-screen bg-[#F1F9F7] flex flex-col">
      <OnboardingHeader />

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <section className="rounded-3xl bg-white border border-gray-100 p-6 md:p-8 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#7BDFF2]">Support Network</p>
            <h1 className="text-3xl font-[family-name:var(--font-overlock)] font-bold text-gray-900 mt-2">Trusted Rooftop Friends</h1>

            <div className="mt-6 space-y-3">
              {friends.map((friend) => (
                <div key={friend.name} className="rounded-2xl bg-[#EFF7F6] border border-gray-100 p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-gray-900">{friend.name}</p>
                    <p className="text-sm text-gray-500">{friend.relation}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${friend.status === "Available" ? "bg-emerald-400" : "bg-gray-300"}`} />
                    <button className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      Share memory
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-3xl bg-[#FCE2E9] border border-pink-100 p-6 md:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-pink-400">Emergency</p>
            <h2 className="text-2xl font-[family-name:var(--font-overlock)] font-bold text-gray-900 mt-2">Break glass resources</h2>

            <div className="mt-6 space-y-3">
              {resources.map((resource) => (
                <button
                  key={resource}
                  className="w-full text-left rounded-2xl bg-white p-4 border border-pink-100 hover:border-pink-300 font-medium text-gray-800 transition-colors"
                >
                  {resource}
                </button>
              ))}
            </div>

            <p className="mt-5 text-sm text-gray-700 leading-relaxed">
              If you mention self-harm signals, Sarah can surface these immediately and help draft a message.
            </p>
          </aside>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/notifications"
            className="inline-flex items-center justify-center px-10 py-4 bg-gray-900 text-white rounded-2xl text-lg font-medium hover:bg-black transition-all active:scale-[0.98]"
          >
            Next
          </Link>
        </div>
      </main>
    </div>
  );
}
