import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Leaf, BookOpen, Zap, Medal, Users, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground relative">
      <div
        className="absolute inset-0 -z-10 bg-center bg-cover"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/70"
        aria-hidden
      />

      <main className="px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Hero */}
        <section className="max-w-6xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-900 px-3 py-1 text-sm font-medium shadow-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
            About EcoLearn
          </span>
          <h1 className="mt-4 text-4xl sm:text-6xl font-extrabold tracking-tight text-emerald-700 dark:text-emerald-200">
            Learning that turns into Action
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            EcoLearn is a gamified environmental education platform where students learn
            through interactive lessons, complete real-world challenges, and track their
            impact with points, badges, and leaderboards.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/lessons">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-5 text-lg font-semibold">
                Get Started
              </Button>
            </Link>
            <Link href="/challenges">
              <Button variant="secondary" className="px-5 py-5 text-lg font-semibold">
                Explore Challenges
              </Button>
            </Link>
          </div>
        </section>

        {/* What we do */}
        <section className="max-w-6xl mx-auto mt-16 grid lg:grid-cols-3 gap-6">
          {[
            {
              icon: <BookOpen className="h-6 w-6 text-emerald-700 dark:text-emerald-200" />,
              title: "Modular Lessons",
              desc:
                "Bite-sized modules on biodiversity, climate change, waste management, and renewable energy.",
            },
            {
              icon: <Zap className="h-6 w-6 text-emerald-700 dark:text-emerald-200" />,
              title: "Real-World Challenges",
              desc:
                "Track tree-planting, energy-saving, and plastic reduction activities that create real impact.",
            },
            {
              icon: <Medal className="h-6 w-6 text-amber-500" />,
              title: "Gamified Progress",
              desc:
                "Earn points, badges, and climb leaderboards to stay motivated and engaged.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card/85 backdrop-blur p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-50/80 dark:bg-emerald-900/30 p-2">{f.icon}</div>
                <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-200">{f.title}</h3>
              </div>
              <p className="mt-3 text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Impact */}
        <section className="max-w-6xl mx-auto mt-16 rounded-2xl border border-border bg-card/85 backdrop-blur p-6">
          <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-200">Our Impact</h2>
          <p className="text-muted-foreground">Together with our community, we are driving measurable change.</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: <Users className="h-6 w-6 text-emerald-700 dark:text-emerald-200" />, value: "10,000+", label: "Active Learners" },
              { icon: <Leaf className="h-6 w-6 text-emerald-700 dark:text-emerald-200" />, value: "48k", label: "Trees Planted" },
              { icon: <Globe className="h-6 w-6 text-emerald-700 dark:text-emerald-200" />, value: "300+", label: "Schools" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-card p-5 border border-border">
                <div className="flex items-center gap-3">
                  {s.icon}
                  <div>
                    <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">{s.value}</div>
                    <div className="text-muted-foreground">{s.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-6xl mx-auto mt-16 text-center">
          <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 text-white p-8">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold">
              <Leaf className="h-6 w-6" /> Join EcoLearn Today
            </div>
            <p className="mt-3 text-white/90 max-w-2xl mx-auto">
              Bring EcoLearn to your classroom or community and start turning knowledge into action.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link href="/auth/signup">
                <Button className="bg-white text-emerald-900 hover:bg-emerald-50">Get Started</Button>
              </Link>
              <Link href="/lessons">
                <Button variant="outline" className="border-white bg-transparent text-white hover:bg-white/10">
                  Browse Lessons
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}