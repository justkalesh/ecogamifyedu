"use client";

import { useEffect, useState } from "react";

type Props = {
  lessonKey: string;
  totalChapters: number;
};

export const LessonProgress = ({ lessonKey, totalChapters }: Props) => {
  const [percent, setPercent] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    const fetchProgress = async () => {
      try {
        setLoading(true);
        // Build headers with freshest x-user-id each time (session id or device id set by auth-client)
        let uid = "demo-user";
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("x_user_id");
          if (stored && stored.trim().length > 0) uid = stored.trim();
        }
        const res = await fetch(`/api/lesson-progress?lessonKey=${encodeURIComponent(lessonKey)}&t=${Date.now()}`, {
          method: "GET",
          headers: { "x-user-id": uid },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        // Determine completed chapters
        const passedFromAttempts = Array.isArray(data.chapters)
          ? data.chapters.filter((c: any) => c?.passed).length
          : 0;
        const completedChapters = Math.max(
          Number.isFinite(data.currentChapter) ? data.currentChapter : 0,
          passedFromAttempts
        );
        const pct = data.completed
          ? 100
          : Math.max(0, Math.min(100, Math.round((completedChapters / Math.max(1, totalChapters)) * 100)));
        if (!active) return;
        setCompleted(Boolean(data.completed));
        setPercent(pct);
      } catch (err) {
        // On error keep defaults
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchProgress();
    return () => {
      active = false;
    };
  }, [lessonKey, totalChapters, refreshKey]);

  // Listen for x_user_id changes (e.g., after login) and refetch
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "x_user_id") {
        setRefreshKey((k) => k + 1);
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("storage", handler);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handler);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="mt-3">
        <div className="h-3 w-full rounded-full bg-emerald-100 dark:bg-emerald-900/40 overflow-hidden">
          <div className="h-3 w-1/3 animate-pulse rounded-full bg-emerald-600/60" />
        </div>
        <div className="mt-1 text-xs text-muted-foreground">Loading progress…</div>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{completed ? "Completed" : "Progress"}</span>
        <span className={completed ? "text-emerald-600 font-medium" : ""}>{percent}%</span>
      </div>
      <div className="mt-1 h-3 w-full rounded-full bg-emerald-100 dark:bg-emerald-900/40">
        <div
          className={`h-3 rounded-full ${completed ? "bg-emerald-500" : "bg-emerald-600"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {completed && (
        <div className="mt-2 inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[11px] font-medium dark:bg-emerald-900/30 dark:text-emerald-200">
          Completed
        </div>
      )}
    </div>
  );
};