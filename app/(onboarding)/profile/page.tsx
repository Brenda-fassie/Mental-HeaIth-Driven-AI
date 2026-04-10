import OnboardingHeader from "@/components/shared/onboarding-header";

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <OnboardingHeader />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-semibold">Profile</h1>
      </main>
    </div>
  );
}
