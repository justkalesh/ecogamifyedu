"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MoreVertical, User, Settings, HelpCircle, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardPage() {
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();
  const [summary, setSummary] = useState<any | null>(null);
  const [loadingSummary, setLoadingSummary] = useState<boolean>(true);
  const [errorSummary, setErrorSummary] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/auth/login");
    }
  }, [isPending, session, router]);

  // Fetch personalized dashboard summary
  useEffect(() => {
    if (isPending) return;
    if (!session?.user) return;
    (async () => {
      setLoadingSummary(true);
      setErrorSummary(null);
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const xuid = typeof window !== "undefined" ? (localStorage.getItem("x_user_id") || "demo-user") : "demo-user";
        headers["x-user-id"] = xuid;
        const res = await fetch(`/api/dashboard/summary?t=${Date.now()}` , { headers, cache: "no-store" });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setSummary(data);
      } catch (e: any) {
        setErrorSummary(typeof e?.message === "string" ? e.message : "Failed to load summary");
      } finally {
        setLoadingSummary(false);
      }
    })();
  }, [isPending, session]);

  if (isPending) return <div className="pt-24 px-6 text-foreground">Loading...</div>;
  if (!session?.user) return null;

  const handleSignOut = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : "";
    const { error } = await authClient.signOut({
      fetchOptions: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    if (!error?.code) {
      localStorage.removeItem("bearer_token");
      refetch();
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground relative pt-24 px-4 sm:px-6 lg:px-8 pb-10">
      <div
        className="absolute inset-0 -z-10 bg-center bg-cover"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop)",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/70" aria-hidden />
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">Welcome, {session.user.name || session.user.email}</h1>
          <p className="text-muted-foreground mt-2">Track your learning progress and environmental impact.</p>
        </div>

        {/* Top stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-card/85 border-border text-foreground">
            <CardHeader>
              <CardTitle>Total Points</CardTitle>
              <CardDescription className="text-muted-foreground">Earned from lessons and challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{loadingSummary ? "—" : summary?.points ?? 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/85 border-border text-foreground">
            <CardHeader>
              <CardTitle>Badges</CardTitle>
              <CardDescription className="text-muted-foreground">Recent achievements</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2 flex-wrap">
              {loadingSummary ? (
                <span className="text-muted-foreground text-sm">Loading…</span>
              ) : summary?.badges?.length ? (
                summary.badges.map((b: any) => (
                  <span key={b.code} className="inline-flex items-center rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white">
                    {b.icon || "🏅"} <span className="ml-1">{b.name}</span>
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground text-sm">No badges yet</span>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/85 border-border text-foreground">
            <CardHeader>
              <CardTitle>Level</CardTitle>
              <CardDescription className="text-muted-foreground">Keep learning to level up</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{loadingSummary ? "—" : summary?.level ?? 1}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-card/85 border-border text-foreground">
            <CardHeader>
              <CardTitle>Lesson Progress</CardTitle>
              <CardDescription className="text-muted-foreground">Your progress across modules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingSummary && <div className="text-sm text-muted-foreground">Loading…</div>}
              {!loadingSummary && summary?.lessons?.map((i: any) => (
                <div key={i.key}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{i.title}</span>
                    <span className="font-semibold">{i.progressPct}%</span>
                  </div>
                  <Progress value={i.progressPct} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card/85 border-border text-foreground">
            <CardHeader>
              <CardTitle>Challenge Activity</CardTitle>
              <CardDescription className="text-muted-foreground">Recent contributions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {errorSummary && (
                <div className="text-sm text-red-500">{errorSummary}</div>
              )}
              {loadingSummary ? (
                <div className="text-sm text-muted-foreground">Loading…</div>
              ) : (
                <>
                  {[
                    { label: "Tree Planting", value: summary?.activity?.trees ?? 0, unit: "trees" },
                    { label: "Energy Saved", value: summary?.activity?.energyKwh ?? 0, unit: "kWh" },
                    { label: "Plastic Reduced", value: summary?.activity?.plasticKg ?? 0, unit: "kg" },
                  ].map((i) => (
                    <div key={i.label} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{i.label}</div>
                        <div className="text-xs text-muted-foreground">This week</div>
                      </div>
                      <div className="text-2xl font-bold">{i.value}<span className="text-sm ml-1">{i.unit}</span></div>
                    </div>
                  ))}
                </>
              )}
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-border bg-foreground/10 hover:bg-foreground/15 text-foreground px-2">
                      <MoreVertical className="h-5 w-5" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-44">
                    <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                      <User className="mr-2 h-4 w-4" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/settings")}>
                      <Settings className="mr-2 h-4 w-4" /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/about")}>
                      <HelpCircle className="mr-2 h-4 w-4" /> Help
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500">
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}