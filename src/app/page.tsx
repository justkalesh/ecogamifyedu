import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Play,
  Users,
  Medal,
  Zap,
  Leaf,
  Trees,
  Recycle,
  SunMedium,
  Globe,
  Droplets,
  Wind,
  Crown,
  Trophy,
  Camera,
  Clock } from
"lucide-react";
import { LessonProgress } from "@/app/lessons/LessonProgress";
import { HomeLeaderboard } from "@/components/home/home-leaderboard";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground relative">
      <div
        className="absolute inset-0 -z-10 bg-center bg-cover bg-no-repeat bg-scroll md:bg-fixed opacity-15"
        style={{
          backgroundImage:
          "url(/globe.svg)"
        }}
        aria-hidden />

      {/* Atmospheric overlays to enrich background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-900/40 via-emerald-950/80 to-black" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.24),transparent_60%)]" aria-hidden />
      {/* Aurora sweep for vibrancy */}
      <div className="absolute inset-0 -z-10 opacity-25 bg-[conic-gradient(from_140deg_at_30%_20%,rgba(16,185,129,0.35),rgba(20,184,166,0.2)_20%,rgba(34,197,94,0.15)_35%,transparent_55%)]" aria-hidden />
      {/* Soft vignette for focus */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_65%,rgba(0,0,0,0.45))]" aria-hidden />

      <main className="px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <section className="mx-auto text-center max-w-3xl">
          {/* small badge */}
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-900 px-3 py-1 text-sm font-medium shadow-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
            Gamified Environmental Education
          </span>

          <h1 className="mt-4 text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-emerald-300">
            Learn. Play. Save the Planet.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform environmental education through interactive lessons, real-world challenges, and gamified learning that makes sustainability fun and engaging.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            <Link href="/lessons">
              <Button className="w-full sm:w-auto text-white px-5 py-5 text-lg font-semibold bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-400 hover:via-green-500 hover:to-teal-400 shadow-lg shadow-emerald-500/20">
                <Play className="mr-2 h-5 w-5" /> Start Learning
              </Button>
            </Link>
            <Button className="w-full sm:w-auto text-white px-5 py-5 text-lg font-semibold bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-400 hover:via-green-500 hover:to-teal-400 shadow-lg shadow-emerald-500/20">
              Watch Demo
            </Button>
          </div>

          {/* Glass stats overlay */}
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 sm:grid-cols-3 gap-4">
            {[
            {
              icon: <Users className="h-6 w-6 text-emerald-600" />,
              value: "10,000+",
              label: "Active Learners"
            },
            {
              icon: <Medal className="h-6 w-6 text-amber-500" />,
              value: "500+",
              label: "Challenges Completed"
            },
            {
              icon: <Zap className="h-6 w-6 text-emerald-600" />,
              value: "95%",
              label: "Engagement Rate"
            }].
            map((s) =>
            <div
              key={s.label}
              className="rounded-2xl bg-card/60 backdrop-blur border border-border px-6 py-5 text-left shadow-sm">

                <div className="flex items-center gap-3">
                  {s.icon}
                  <div>
                    <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{s.value}</div>
                    <div className="text-muted-foreground">{s.label}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Feature cards section from original kept but tuned to light UI */}
        <section className="max-w-6xl mx-auto mt-16 grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl overflow-hidden border border-border bg-card/80 backdrop-blur">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-emerald-800 dark:text-emerald-200">Modular Lessons</h2>
              <p className="mt-2 text-muted-foreground">
                Topics include climate change, biodiversity, waste management, and renewable energy with quizzes and activities.
              </p>
              <Link href="/lessons" className="inline-block mt-4">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Browse Lessons</Button>
              </Link>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-border bg-card/80 backdrop-blur">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-emerald-800 dark:text-emerald-200">Real-World Challenges</h2>
              <p className="mt-2 text-muted-foreground">
                Track energy-saving competitions, tree-planting drives, and plastic reduction goals with live progress.
              </p>
              <Link href="/challenges" className="inline-block mt-4">
                <Button variant="outline" className="border-emerald-700 text-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 dark:text-emerald-200 dark:border-emerald-400/60">
                  View Challenges
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Interactive Learning Modules */}
        <section className="max-w-6xl mx-auto mt-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-emerald-900 dark:text-emerald-200">Interactive Learning Modules</h2>
          <p className="mt-3 text-center text-muted-foreground max-w-3xl mx-auto">
            Dive into comprehensive environmental topics through engaging lessons, quizzes, and hands-on activities designed for all skill levels.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
            { icon: <Trees className="text-emerald-600" />, title: "Biodiversity & Ecosystems", level: "Beginner", lessons: 12, points: 250, lessonKey: "biodiversity" },
            { icon: <Recycle className="text-emerald-600" />, title: "Waste Management", level: "Intermediate", lessons: 8, points: 180, lessonKey: "waste-management" },
            { icon: <SunMedium className="text-amber-500" />, title: "Renewable Energy", level: "Advanced", lessons: 15, points: 320, lessonKey: "renewable-energy" },
            { icon: <Globe className="text-emerald-600" />, title: "Climate Change", level: "Intermediate", lessons: 10, points: 220, lessonKey: "climate-change" },
            { icon: <Droplets className="text-emerald-600" />, title: "Water Conservation", level: "Beginner", lessons: 6, points: 150, lessonKey: "water-conservation" },
            { icon: <Wind className="text-amber-500" />, title: "Air Quality", level: "Beginner", lessons: 9, points: 200 }].
            map((m) =>
            <div key={m.title} className="rounded-2xl border border-border bg-card/85 backdrop-blur p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-emerald-50/80 dark:bg-emerald-900/30 p-2">{m.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-200">{m.title}</h3>
                      <p className="mt-1 inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-medium dark:bg-emerald-900/30 dark:text-emerald-200">{m.level}</p>
                    </div>
                  </div>
                </div>
                {"lessonKey" in m ? (
                  <LessonProgress lessonKey={(m as any).lessonKey} totalChapters={5} />
                ) : (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>0%</span>
                    </div>
                    <div className="mt-1 h-3 w-full rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                      <div className="h-3 rounded-full bg-emerald-600" style={{ width: `0%` }} />
                    </div>
                  </div>
                )}
                <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                  <span>{m.lessons} lessons</span>
                  <span className="text-amber-600 font-medium">{m.points} points</span>
                </div>
                <Button className="w-full mt-5 bg-emerald-600 hover:bg-emerald-700">Continue</Button>
              </div>
            )}
          </div>
        </section>

        {/* Your Environmental Journey: Achievements + Leaderboard */}
        <section className="max-w-6xl mx-auto mt-16 grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card/85 backdrop-blur p-6">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 text-2xl font-bold">
              <Trophy className="text-amber-500" /> Achievements
            </div>
            <p className="mt-1 text-muted-foreground">Unlock badges as you progress through your eco journey</p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["First Steps", "Eco Warrior", "Green Leader", "Recycling Pro"].map((a) =>
              <div key={a} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <Leaf className="text-emerald-600" />
                    <div>
                      <div className="font-semibold text-emerald-900 dark:text-emerald-200">{a}</div>
                      <div className="text-xs text-muted-foreground">Earned</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/85 backdrop-blur p-6">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 text-2xl font-bold">
              <Crown className="text-amber-500" /> Global Leaderboard
            </div>
            <p className="mt-1 text-muted-foreground">See how you rank among eco-learners worldwide</p>
            <HomeLeaderboard />
          </div>
        </section>

        {/* Your Progress */}
        <section className="max-w-6xl mx-auto mt-16">
          <div className="rounded-2xl border border-border bg-card/85 backdrop-blur p-6">
            <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-200">Your Progress</h3>
            <p className="text-muted-foreground">Track your learning journey and environmental impact</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
              { label: "Total Points", value: 650, pct: 35 },
              { label: "Lessons Completed", value: 12, pct: 60 },
              { label: "Challenges Done", value: 8, pct: 70 },
              { label: "Days Streak", value: 15, pct: 80 }].
              map((m) =>
              <div key={m.label} className="rounded-xl bg-card p-4 border border-border">
                  <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-300">{m.value}</div>
                  <div className="text-sm text-muted-foreground">{m.label}</div>
                  <div className="mt-3 h-3 w-full rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                    <div className="h-3 rounded-full bg-emerald-600" style={{ width: `${m.pct}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Real-World Environmental Challenges */}
        <section className="max-w-6xl mx-auto mt-16">
          <h2 className="text-3xl font-extrabold text-emerald-900 dark:text-emerald-200 text-center">Real-World Environmental Challenges</h2>
          <p className="mt-2 text-center text-muted-foreground max-w-3xl mx-auto">Take your learning beyond the classroom with hands-on challenges that create real environmental impact in your community.</p>

          {/* Active challenge */}
          <div className="mt-8 rounded-2xl border border-border bg-card/85 backdrop-blur p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 p-2"><Zap className="text-emerald-700 dark:text-emerald-300" /></div>
                <div>
                  <div className="text-sm inline-flex items-center rounded-full bg-amber-100 text-amber-800 px-3 py-1 font-medium dark:bg-amber-900/30 dark:text-amber-300">Active Challenge</div>
                  <h3 className="mt-2 text-2xl font-bold text-emerald-900 dark:text-emerald-200">Energy Detective Week</h3>
                  <p className="text-muted-foreground">Monitor and reduce your household energy consumption</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /> 3 days left</div>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
              { label: "Progress", value: "65%" },
              { label: "Participants", value: "247" },
              { label: "Points Reward", value: "150" }].
              map((i) =>
              <div key={i.label} className="text-center">
                  <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-300">{i.value}</div>
                  <div className="text-muted-foreground">{i.label}</div>
                </div>
              )}
            </div>
            <div className="mt-4 h-3 w-full rounded-full bg-emerald-100 dark:bg-emerald-900/40">
              <div className="h-3 rounded-full bg-emerald-600" style={{ width: "65%" }} />
            </div>
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Button className="bg-amber-400 hover:bg-amber-500 text-emerald-950 dark:text-emerald-950"><Camera className="mr-2 h-4 w-4" /> Upload Progress</Button>
              <Button variant="outline" className="border-emerald-700 text-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 dark:text-emerald-200 dark:border-emerald-400/60">View Details</Button>
            </div>
          </div>

          {/* Available challenges */}
          <h3 className="sr-only">Available Challenges</h3>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
            { title: "Plant a Tree Challenge", tag: "Biodiversity", icon: <Trees className="text-emerald-600" />, duration: "30 days", joined: 156, points: 200, level: "Easy" },
            { title: "Water Conservation Sprint", tag: "Conservation", icon: <Droplets className="text-emerald-600" />, duration: "14 days", joined: 89, points: 120, level: "Medium" }].
            map((c) =>
            <div key={c.title} className="rounded-2xl border border-border bg-card/85 backdrop-blur p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-emerald-50/80 dark:bg-emerald-900/30 p-2">{c.icon}</div>
                    <div>
                      <h4 className="text-xl font-semibold text-emerald-900 dark:text-emerald-200">{c.title}</h4>
                      <p className="text-sm text-muted-foreground">{c.tag}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-medium dark:bg-emerald-900/30 dark:text-emerald-200">Team challenge</span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center text-muted-foreground">
                  <div className="rounded-lg bg-emerald-50/80 dark:bg-emerald-900/30 p-3">
                    <div className="font-semibold">{c.duration}</div>
                    <div className="text-xs">Duration</div>
                  </div>
                  <div className="rounded-lg bg-emerald-50/80 dark:bg-emerald-900/30 p-3">
                    <div className="font-semibold">{c.joined}</div>
                    <div className="text-xs">Joined</div>
                  </div>
                  <div className="rounded-lg bg-emerald-50/80 dark:bg-emerald-900/30 p-3">
                    <div className="font-semibold">{c.points}</div>
                    <div className="text-xs">Points</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-medium dark:bg-emerald-900/30 dark:text-emerald-200">{c.level}</span>
                </div>
                <Button className="w-full mt-5 bg-emerald-600 hover:bg-emerald-700"><Trophy className="mr-2 h-4 w-4" /> Join Challenge</Button>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16">
          <div className="mx-4 sm:mx-6 lg:mx-8 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 text-white p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 text-2xl font-bold"><img src="/ecolearn-icon.svg" alt="EcoLearn icon" className="h-6 w-6" /> EcoLearn</div>
                <p className="mt-3 text-white/90">Transforming environmental education through gamification and technology. Join thousands of students making a real difference for our planet.</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 grid place-items-center">★</div>
                  <div className="h-10 w-10 rounded-full bg-white/20 grid place-items-center">✉</div>
                  <div className="h-10 w-10 rounded-full bg-white/20 grid place-items-center">▶</div>
                  <div className="h-10 w-10 rounded-full bg-white/20 grid place-items-center">●</div>
                </div>
              </div>
              <div>
                <div className="text-lg font-semibold">Platform</div>
                <ul className="mt-3 space-y-2 text-white/90">
                  <li><Link href="/lessons">Learning Modules</Link></li>
                  <li><Link href="/challenges">Challenges</Link></li>
                  <li><Link href="/leaderboard">Leaderboards</Link></li>
                  <li><Link href="/dashboard">Community</Link></li>
                  <li>Achievements</li>
                </ul>
              </div>
              <div>
                <div className="text-lg font-semibold">Support</div>
                <ul className="mt-3 space-y-2 text-white/90">
                  <li>Help Center</li>
                  <li>Contact Us</li>
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                  <li>For Educators</li>
                </ul>
              </div>
            </div>
            <div className="max-w-6xl mx-auto mt-8 border-t border-white/20 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white/90 text-sm">
              <div>© 2024 EcoLearn. All rights reserved. Made with <span className="text-emerald-200">❤</span> for our planet.</div>
              <div className="flex items-center gap-4"><span>🌱 Carbon Neutral Platform</span><span>🌍 Global Impact</span></div>
            </div>
          </div>
        </footer>
      </main>
    </div>);

}