import { Metadata } from "next";
import ProfileForm from "./profile-form";

export const metadata: Metadata = {
  title: "Your Profile • EcoLearn",
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-200">Your Profile</h1>
        <p className="mt-2 text-muted-foreground">
          Update your display name, bio, avatar, and social links.
        </p>
        <div className="mt-6 rounded-3xl border border-border bg-card/90 backdrop-blur p-6 sm:p-8 shadow-sm">
          <ProfileForm />
        </div>
      </div>
    </main>
  );
}