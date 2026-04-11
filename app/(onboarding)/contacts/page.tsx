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
    <div className="min-h-screen bg-[#F9FBFF] flex flex-col">
      <OnboardingHeader />

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <section className="rounded-[34px] bg-white border border-gray-100 p-6 md:p-8 shadow-[0_12px_40px_-22px_rgba(0,0,0,0.18)]">
            <p className="text-xs uppercase tracking-[0.22em] text-gray-400">Support Network</p>
            <h1 className="text-3xl text-gray-900 mt-2">Trusted Rooftop Friends</h1>

            <div className="mt-6 space-y-3">
              {friends.map((friend) => (
                <div key={friend.name} className="rounded-2xl bg-[#EFF7F6] border border-gray-100 p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-gray-900">{friend.name}</p>
                    <p className="text-sm text-gray-600">{friend.relation}</p>
                  </div>
                  <button className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">
                    Share memory
                  </button>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-[34px] bg-[#FCE2E9] border border-pink-100 p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.22em] text-gray-500">Emergency</p>
            <h2 className="text-2xl text-gray-900 mt-2">Break glass resources</h2>

            <div className="mt-6 space-y-3">
              {resources.map((resource) => (
                <button
                  key={resource}
                  className="w-full text-left rounded-2xl bg-white p-4 border border-pink-100 hover:border-pink-300 transition-colors"
                >
                  {resource}
                </button>
              ))}
            </div>

            <p className="mt-5 text-sm text-gray-700">
              If you mention self-harm signals, Sarah can surface these immediately and help draft a message.
            </p>
          </aside>
        </div>

        <div className="mt-12 flex justify-center">
          <Link 
            href="/notifications" 
            className="px-12 py-4 bg-black text-white rounded-full text-xl font-medium hover:bg-gray-800 transition-all text-center"
          >
            Next
          </Link>
        </div>
      </main>
    </div>
  );
}
