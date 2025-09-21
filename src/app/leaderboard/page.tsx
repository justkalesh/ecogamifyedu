"use client";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import Link from "next/link";

const users = [
  { rank: 1, name: "Aisha Khan", email: "aisha@school.edu", points: 4820, level: 12, badge: "Eco Hero", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop" },
  { rank: 2, name: "Rahul Mehta", email: "rahul@college.edu", points: 4590, level: 11, badge: "Tree Planter", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop" },
  { rank: 3, name: "Sophia Lee", email: "sophia@uni.edu", points: 4415, level: 11, badge: "Energy Saver", img: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=400&auto=format&fit=crop" },
  { rank: 4, name: "Diego Rivera", email: "diego@campus.edu", points: 4070, level: 10, badge: "Waste Warrior", img: "https://images.unsplash.com/photo-1543966888-7c1dc482a810?q=80&w=400&auto=format&fit=crop" },
  { rank: 5, name: "Mia Chen", email: "mia@school.edu", points: 3920, level: 9, badge: "Biodiversity Ally", img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=400&auto=format&fit=crop" },
];

export default function LeaderboardPage() {
  const [items, setItems] = useState<Array<{
    rank: number;
    userId: string;
    name: string | null;
    email: string;
    image: string | null;
    points: number;
    level: number;
    topBadge: string | null;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
        const res = await fetch(`/api/leaderboard?limit=50`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          cache: "no-store",
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || `Failed to load leaderboard (${res.status})`);
        }
        const data = await res.json();

        // Enrich items with avatarUrl from public profile when image is missing (batched, best-effort)
        const rawItems = (data.items || []) as Array<{
          rank: number;
          userId: string;
          name: string | null;
          email: string;
          image: string | null;
          points: number;
          level: number;
          topBadge: string | null;
        }>;

        let enrichedItems = rawItems;
        try {
          const missing = rawItems.filter((i) => !i.image).slice(0, 20);
          if (missing.length) {
            const profiles = await Promise.all(
              missing.map((m) =>
                fetch(`/api/profile/public/${m.userId}`, { cache: "no-store" })
                  .then((r) => (r.ok ? r.json() : null))
                  .catch(() => null)
              )
            );
            const avatarMap = new Map<string, string>();
            missing.forEach((m, idx) => {
              const p = profiles[idx];
              if (p?.avatarUrl) avatarMap.set(m.userId, p.avatarUrl as string);
            });
            enrichedItems = rawItems.map((it) => ({
              ...it,
              image: it.image || avatarMap.get(it.userId) || null,
            }));
          }
        } catch {
          // best-effort enrichment; ignore errors
        }

        if (!aborted) setItems(enrichedItems);
      } catch (e: any) {
        if (!aborted) setError(e?.message || "Failed to load leaderboard");
      } finally {
        if (!aborted) setLoading(false);
      }
    };
    fetchLeaderboard();
    return () => {
      aborted = true;
    };
  }, []);

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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground mt-2">Track top performers, points, levels, and badges.</p>

        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card/85">
          <Table>
            <TableCaption className="text-muted-foreground">
              {loading ? "Loading leaderboard..." : error ? error : items.length ? "Stay consistent to climb the rankings!" : "No results yet"}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20 text-foreground">Rank</TableHead>
                <TableHead className="text-foreground">User</TableHead>
                <TableHead className="text-foreground">Points</TableHead>
                <TableHead className="text-foreground">Level</TableHead>
                <TableHead className="text-foreground">Badge</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">Loading...</TableCell>
                </TableRow>
              )}
              {!loading && !error && items.map((u) => (
                <TableRow key={u.userId + String(u.rank)} className="hover:bg-foreground/5">
                  <TableCell className="font-semibold">#{u.rank}</TableCell>
                  <TableCell>
                    <Link href={`/u/${u.userId}`} className="flex items-center gap-3 group">
                      <Avatar>
                        <AvatarImage src={u.image ?? undefined} alt={u.name ?? u.email} />
                        <AvatarFallback>{(u.name || u.email || "?").split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium group-hover:underline">{u.name || "Anonymous"}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="font-semibold">{(u.points ?? 0).toLocaleString()}</TableCell>
                  <TableCell>{u.level}</TableCell>
                  <TableCell>
                    {u.topBadge ? (
                      <Badge className="bg-green-600 hover:bg-green-700 text-white">{u.topBadge}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {!loading && !error && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No leaderboard data yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}