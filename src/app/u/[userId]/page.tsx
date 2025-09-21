import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { headers } from "next/headers";

interface PublicProfile {
  userId: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  socials: {
    twitterUrl: string | null;
    linkedinUrl: string | null;
    githubUrl: string | null;
    websiteUrl: string | null;
    instagramUrl: string | null;
    youtubeUrl: string | null;
  };
  stats: {
    points: number;
    level: number;
  };
  badges: Array<{ id: number | string; name: string; awardedAt: string }>;
  recentActivities?: Array<{
    title: string;
    subtitle?: string;
    createdAt?: string;
  }>;
}

export const dynamic = "force-dynamic";
export const fetchCache = "default-no-store";

export default async function PublicProfilePage({ params }: { params: { userId: string } }) {
  const { userId } = params;

  let profile: PublicProfile | null = null;
  try {
    const h = headers();
    const host = h.get("x-forwarded-host") || h.get("host");
    const proto = h.get("x-forwarded-proto") || "http";
    const absoluteUrl = host ? `${proto}://${host}/api/profile/public/${userId}` : `/api/profile/public/${userId}`;
    const res = await fetch(absoluteUrl, { cache: "no-store" });
    if (res.ok) profile = await res.json();
  } catch {
    // ignore and show fallback UI
  }

  const name = profile?.name || "EcoLearner";
  const initials = name.split(" ").map((n) => n[0]).join("") || "U";

  // Build social links dynamically from all non-null fields and show platform names visibly
  const socialEntries = Object.entries(profile?.socials ?? {}).filter(([, href]) => !!href) as Array<[string, string]>;
  const labelMap: Record<string, string> = {
    websiteUrl: "Website",
    twitterUrl: "Twitter",
    linkedinUrl: "LinkedIn",
    githubUrl: "GitHub",
    instagramUrl: "Instagram",
    youtubeUrl: "YouTube",
  };
  const toLabel = (key: string) =>
    labelMap[key] || key.replace(/Url$/, "").replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).trim();
  const toHost = (value: string) => {
    try {
      const u = new URL(value);
      return u.hostname.replace(/^www\./, "");
    } catch {
      return value;
    }
  };

  // Derive XP within current level (level increases every 400 points per API logic)
  const totalPoints = profile?.stats.points ?? 0;
  const xpInLevel = totalPoints % 400;
  const xpPercent = Math.min(100, Math.max(0, (xpInLevel / 400) * 100));

  return (
    <div className="min-h-screen w-full bg-background text-foreground relative pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <div
        className="absolute inset-0 -z-10 bg-center bg-cover bg-no-repeat md:bg-fixed opacity-20"
        style={{ backgroundImage: "url(/globe.svg)" }}
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-900/40 via-emerald-950/70 to-black" aria-hidden />

      <div className="max-w-5xl mx-auto">
        <div className="rounded-2xl border border-border bg-card/85 backdrop-blur p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar className="h-20 w-20 ring-2 ring-emerald-500/20 shadow-sm">
              <AvatarImage src={profile?.avatarUrl ?? undefined} alt={name} />
              <AvatarFallback className="bg-muted text-muted-foreground font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-emerald-100">{name}</h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
                {profile?.bio || "This user hasn't added a bio yet."}
              </p>
            </div>
            <div className="w-full sm:w-auto flex gap-3">
              <Link href="/leaderboard" className="inline-flex rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-foreground/5">
                Back to Leaderboard
              </Link>
              <Link href={`/profile?view=${encodeURIComponent(userId)}`} className="inline-flex rounded-md bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 text-sm">
                View as owner
              </Link>
            </div>
          </div>

          {socialEntries.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {socialEntries.map(([key, href]) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-900/20 px-3 py-1 text-xs text-emerald-200 hover:bg-emerald-900/30"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="font-medium">{toLabel(key)}</span>
                  <span className="text-emerald-300/80">• {toHost(href)}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Stats / Activity */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-border bg-card/85 backdrop-blur p-6">
            <div className="text-sm text-muted-foreground">Level</div>
            <div className="mt-2 text-3xl font-extrabold text-emerald-300">{profile?.stats.level ?? 1}</div>
            <div className="mt-3 h-2 w-full rounded-full bg-emerald-900/40">
              <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${xpPercent}%` }} />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">{xpInLevel} / 400 XP</div>
          </div>
          <div className="rounded-2xl border border-border bg-card/85 backdrop-blur p-6">
            <div className="text-sm text-muted-foreground">Total Points</div>
            <div className="mt-2 text-3xl font-extrabold text-emerald-300">{totalPoints.toLocaleString()}</div>
            <div className="mt-3 h-2 w-full rounded-full bg-emerald-900/40">
              <div className="h-2 rounded-full bg-amber-400" style={{ width: `${xpPercent}%` }} />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Towards next level</div>
          </div>
          <div className="rounded-2xl border border-border bg-card/85 backdrop-blur p-6">
            <div className="text-sm text-muted-foreground">Badges</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile?.badges?.length ? (
                profile.badges.map((b) => (
                  <span key={String(b.id)} className="inline-flex items-center rounded-full bg-emerald-100/10 text-emerald-200 border border-emerald-400/20 px-3 py-1 text-xs">{b.name}</span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">No badges yet</span>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity (no API yet) */}
        <div className="mt-8 rounded-2xl border border-border bg-card/85 backdrop-blur p-6">
          <div className="text-lg font-semibold text-emerald-100">Recent Activity</div>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {profile?.recentActivities?.length ? (
              profile.recentActivities.map((a: any, idx: number) => (
                <li key={idx} className="rounded-lg border border-border bg-background/70 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-foreground/90">{a.title}</div>
                      {a.subtitle ? (
                        <div className="text-xs text-muted-foreground mt-0.5">{a.subtitle}</div>
                      ) : null}
                    </div>
                    {a.createdAt ? (
                      <time className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(a.createdAt).toLocaleString()}
                      </time>
                    ) : null}
                  </div>
                </li>
              ))
            ) : (
              <li className="rounded-lg border border-border bg-background/70 p-3">No recent activity available.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}