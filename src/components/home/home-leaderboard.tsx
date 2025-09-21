"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Medal } from "lucide-react";

interface Item {
  rank: number;
  userId: string;
  name: string | null;
  email: string;
  image: string | null;
  points: number;
  level: number;
  topBadge: string | null;
}

export const HomeLeaderboard = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let aborted = false;
    const load = async () => {
      try {
        setLoading(true);
        const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
        const res = await fetch(`/api/leaderboard?limit=3`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          cache: "no-store",
        });
        if (!res.ok) throw new Error("failed");
        const data = await res.json();
        let list: Item[] = (data.items || []) as Item[];

        // Best-effort: fill missing avatars from public profile
        const missing = list.filter((i) => !i.image);
        if (missing.length) {
          const profiles = await Promise.all(
            missing.map((m) =>
              fetch(`/api/profile/public/${m.userId}`, { cache: "no-store" })
                .then((r) => (r.ok ? r.json() : null))
                .catch(() => null)
            )
          );
          const map = new Map<string, string>();
          missing.forEach((m, idx) => {
            const p = profiles[idx];
            if (p?.avatarUrl) map.set(m.userId, p.avatarUrl as string);
          });
          list = list.map((it) => ({ ...it, image: it.image || map.get(it.userId) || null }));
        }

        if (!aborted) setItems(list);
      } catch {
        if (!aborted) setItems([]);
      } finally {
        if (!aborted) setLoading(false);
      }
    };
    load();
    return () => {
      aborted = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="mt-6 space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 rounded-xl border border-border bg-card/60 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return <div className="mt-6 text-muted-foreground">No leaderboard data yet.</div>;
  }

  return (
    <div className="mt-6 space-y-3">
      {items.map((u, i) => (
        <Link key={u.userId} href={`/u/${u.userId}`} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:bg-foreground/5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 grid place-items-center text-sm font-semibold">
              {u.rank}
            </div>
            <Avatar>
              <AvatarImage src={u.image ?? undefined} alt={u.name ?? u.email} />
              <AvatarFallback>{(u.name || u.email || "?").split(" ").map((n) => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-emerald-900 dark:text-emerald-200">{u.name || "Anonymous"}</div>
              <div className="text-xs text-muted-foreground">{(u.points ?? 0).toLocaleString()} points</div>
            </div>
          </div>
          <Medal className="text-amber-500" />
        </Link>
      ))}
    </div>
  );
};