"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLessonByKey, type Lesson, type QuizQuestion } from "../data";

// Helper: auth headers per app rules
function authHeaders() {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  // Use string user id matching DB schema (text); default to demo-user
  const stored = typeof window !== "undefined" ? localStorage.getItem("x_user_id") : null;
  headers["x-user-id"] = stored && stored.trim().length > 0 ? stored : "demo-user";
  return headers;
}

type ProgressResponse = {
  lessonKey: string;
  currentChapter: number; // next unlock index
  completed: boolean;
  finalScore: number | null;
  chapters: { chapterIndex: number; bestScore: number; passed: boolean; attempts: number }[];
  updatedAt?: string;
};

export function LessonRunner({ lessonKey }: { lessonKey: string }) {
  const router = useRouter();
  const lesson: Lesson | undefined = getLessonByKey(lessonKey);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [activeChapter, setActiveChapter] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [chapterResult, setChapterResult] = useState<{ percent: number; passed: boolean } | null>(null);
  const [finalMode, setFinalMode] = useState(false);
  const [finalAnswers, setFinalAnswers] = useState<Record<string, number | null>>({});
  const [finalResult, setFinalResult] = useState<{ percent: number; completed: boolean } | null>(null);

  useEffect(() => {
    if (!lesson) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/lesson-progress?lessonKey=${encodeURIComponent(lessonKey)}&t=${Date.now()}`, {
          headers: authHeaders(),
          cache: "no-store",
        });
        if (!res.ok) throw new Error(await res.text());
        const data: ProgressResponse = await res.json();
        setProgress(data);
        // set initial chapter to current unlocked or 0
        setActiveChapter(Math.min(data.currentChapter, lesson.chapters.length - 1));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [lessonKey]);

  useEffect(() => {
    // reset chapter state when chapter changes
    setAnswers({});
    setChapterResult(null);
  }, [activeChapter]);

  const unlockedUntil = progress?.currentChapter ?? 0; // index of next locked boundary
  const allChapterQuestions: QuizQuestion[] = useMemo(() => {
    if (!lesson) return [];
    return lesson.chapters.flatMap((c) => c.quiz);
  }, [lesson]);

  const finalQuestions: QuizQuestion[] = useMemo(() => {
    // Build 30 questions from across chapters; if fewer available, cycle
    const pool = allChapterQuestions;
    const needed = 30;
    if (pool.length === 0) return [];
    const out: QuizQuestion[] = [];
    for (let i = 0; i < needed; i++) {
      out.push(pool[i % pool.length]);
    }
    return out;
  }, [allChapterQuestions]);

  if (!lesson) {
    return (
      <div className="max-w-5xl mx-auto pt-24 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Lesson not found</CardTitle>
            <CardDescription>The lesson you requested does not exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/lessons")} className="bg-green-600 hover:bg-green-700">Back to Lessons</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const chapter = lesson.chapters[activeChapter];

  const handleSelect = (qid: string, idx: number) => {
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
  };

  const submitChapter = async () => {
    if (!chapter) return;
    const selected = chapter.quiz.map((q) => answers[q.id]);
    const total = chapter.quiz.length;
    const score = chapter.quiz.reduce((acc, q, i) => {
      const ans = selected[i];
      if (ans == null) return acc; // unanswered treated as wrong
      return acc + (q.options[ans]?.correct ? 1 : 0);
    }, 0);
    const res = await fetch("/api/lesson-progress/chapter", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ lessonKey, chapterIndex: activeChapter, score, total }),
    });
    const data = await res.json();
    const percent = Math.round((score / total) * 100);
    const passed = Boolean(data?.passed ?? percent >= 80);
    setChapterResult({ percent, passed });

    // Optimistically update local progress so UI unlocks immediately on pass
    if (passed) {
      setProgress((prev) => {
        const base = prev ?? {
          lessonKey,
          currentChapter: 0,
          completed: false,
          finalScore: null,
          chapters: [],
        } as ProgressResponse;
        const nextIndex = Math.min(activeChapter + 1, lesson.chapters.length);
        const updatedChapters = [...base.chapters];
        const existingIdx = updatedChapters.findIndex((c) => c.chapterIndex === activeChapter);
        const bestScore = Math.max(percent, existingIdx >= 0 ? updatedChapters[existingIdx].bestScore : 0);
        const entry = { chapterIndex: activeChapter, bestScore, passed: true, attempts: (existingIdx >= 0 ? updatedChapters[existingIdx].attempts : 0) + 1 };
        if (existingIdx >= 0) updatedChapters[existingIdx] = entry; else updatedChapters.push(entry);
        return { ...base, currentChapter: Math.max(base.currentChapter, nextIndex), chapters: updatedChapters };
      });
    }

    // refresh progress from server
    try {
      const pRes = await fetch(`/api/lesson-progress?lessonKey=${encodeURIComponent(lessonKey)}&t=${Date.now()}`, { headers: authHeaders(), cache: "no-store" });
      if (pRes.ok) setProgress(await pRes.json());
    } catch {}

    // Trigger dashboard recompute (badges, points, summary)
    try {
      await fetch("/api/dashboard/recompute", {
        method: "POST",
        headers: authHeaders(),
        // Empty body -> recompute from existing progress/attempts
      });
    } catch {}
  };

  const canOpenFinal = (progress?.currentChapter ?? 0) >= lesson.chapters.length;

  const handleFinalSelect = (qid: string, idx: number) => setFinalAnswers((prev) => ({ ...prev, [qid]: idx }));

  const submitFinal = async () => {
    const qs = finalQuestions;
    const total = qs.length;
    const score = qs.reduce((acc, q) => {
      const sel = finalAnswers[q.id];
      return acc + (sel != null && q.options[sel]?.correct ? 1 : 0);
    }, 0);
    const res = await fetch("/api/lesson-progress/final", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ lessonKey, score, total }),
    });
    const data = await res.json();
    const percent = Math.round((score / total) * 100);
    setFinalResult({ percent, completed: Boolean(data?.completed ?? percent >= 75) });
    // refresh progress state
    try {
      const pRes = await fetch(`/api/lesson-progress?lessonKey=${encodeURIComponent(lessonKey)}&t=${Date.now()}`, { headers: authHeaders(), cache: "no-store" });
      if (pRes.ok) setProgress(await pRes.json());
    } catch {}

    // Trigger dashboard recompute (awards lesson badge + maybe all-lessons badge)
    try {
      await fetch("/api/dashboard/recompute", {
        method: "POST",
        headers: authHeaders(),
        // Empty body -> recompute from existing data
      });
    } catch {}
  };

  return (
    <div className="min-h-screen w-full relative pt-24 pb-12">
      <div
        className="absolute inset-0 -z-10 bg-center bg-cover"
        style={{ backgroundImage: `url(${lesson.cover})` }}
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/50 to-black/80" aria-hidden />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-6 flex-col md:flex-row">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">{lesson.title}</h1>
            <p className="text-muted-foreground max-w-2xl mt-2">{lesson.description}</p>
          </div>
          <div className="w-full md:w-72">
            <Card className="bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
                <CardDescription>
                  {loading ? "Loading..." : progress?.completed ? "Completed" : `Chapter ${Math.min(progress?.currentChapter ?? 0, lesson.chapters.length)} / ${lesson.chapters.length}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-2 w-full bg-muted rounded">
                  <div
                    className="h-2 bg-green-600 rounded"
                    style={{ width: `${Math.min(((progress?.currentChapter ?? 0) / lesson.chapters.length) * 100, 100)}%` }}
                  />
                </div>
                {progress?.finalScore != null && (
                  <p className="text-sm text-muted-foreground">Final Score: {progress.finalScore}%</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Chapters */}
        <div className="grid md:grid-cols-[280px_1fr] gap-6 mt-8">
          <aside>
            <Card className="bg-card/80">
              <CardHeader>
                <CardTitle className="text-base">Chapters</CardTitle>
                <CardDescription>Select a chapter to learn and take a 5-question quiz.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {lesson.chapters.map((c, idx) => {
                  const locked = idx > unlockedUntil;
                  const chapterAttempt = progress?.chapters.find((x) => x.chapterIndex === idx);
                  const status = chapterAttempt?.passed ? "Passed" : locked ? "Locked" : idx === unlockedUntil ? "Next" : "Open";
                  return (
                    <button
                      key={c.id}
                      onClick={() => !locked && setActiveChapter(idx)}
                      className={`w-full text-left px-3 py-2 rounded border ${idx === activeChapter ? "border-green-600 bg-green-600/10" : "border-border"} ${locked ? "opacity-50 cursor-not-allowed" : "hover:bg-accent"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{idx + 1}. {c.title}</span>
                        <span className="text-xs text-muted-foreground">{status}</span>
                      </div>
                      {chapterAttempt && (
                        <div className="text-xs text-muted-foreground mt-1">Best: {chapterAttempt.bestScore}% ({chapterAttempt.attempts} tries)</div>
                      )}
                    </button>
                  );
                })}

                <div className="pt-2 border-t mt-2">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={!canOpenFinal}
                    onClick={() => setFinalMode(true)}
                  >
                    Take Final Test (30 Qs)
                  </Button>
                  {!canOpenFinal && (
                    <p className="text-xs text-muted-foreground mt-2">Pass all chapters (>=80%) to unlock the final.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </aside>

          <main>
            {!finalMode ? (
              <Card className="bg-card/85">
                <CardHeader>
                  <CardTitle className="text-xl">{activeChapter + 1}. {chapter.title}</CardTitle>
                  <CardDescription>Read the chapter, then answer 5 questions. Score 80% to unlock the next chapter.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="prose prose-invert max-w-none text-sm leading-7 text-foreground/90">
                    {chapter.content}
                  </div>

                  <div className="space-y-4">
                    {chapter.quiz.map((q, qi) => (
                      <div key={q.id} className="p-3 rounded border border-border">
                        <p className="font-medium">Q{qi + 1}. {q.question}</p>
                        <div className="mt-2 grid gap-2">
                          {q.options.map((opt, oi) => {
                            const selected = answers[q.id] === oi;
                            return (
                              <button
                                key={oi}
                                onClick={() => handleSelect(q.id, oi)}
                                className={`text-left px-3 py-2 rounded border ${selected ? "border-green-600 bg-green-600/10" : "border-border hover:bg-accent"}`}
                              >
                                {opt.text}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Button className="bg-green-600 hover:bg-green-700" onClick={submitChapter}>Submit Quiz</Button>
                    <Button variant="outline" onClick={() => { setAnswers({}); setChapterResult(null); }}>Reset</Button>
                  </div>

                  {chapterResult && (
                    <div className="mt-4 p-3 rounded border border-border">
                      <p className="font-semibold">Your score: {chapterResult.percent}%</p>
                      {chapterResult.passed ? (
                        <p className="text-green-600">Great! You've passed. Next chapter unlocked.</p>
                      ) : (
                        <p className="text-red-500">You need at least 80% to pass. Try again.</p>
                      )}

                      {/* Actions: Retry (always), Next (only if >=80%) */}
                      <div className="mt-3 flex items-center gap-3">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setAnswers({});
                            setChapterResult(null);
                          }}
                        >
                          Retry
                        </Button>
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          disabled={!chapterResult.passed}
                          onClick={() => {
                            // Move to next chapter locally (optimistic); server progress already posted
                            const nextIdx = Math.min(activeChapter + 1, lesson.chapters.length - 1);
                            if (nextIdx !== activeChapter) {
                              setActiveChapter(nextIdx);
                            }
                            setAnswers({});
                            setChapterResult(null);
                          }}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card/85">
                <CardHeader>
                  <CardTitle className="text-xl">Final Test</CardTitle>
                  <CardDescription>30 questions covering all chapters. Score 75% to complete the lesson.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {finalQuestions.map((q, i) => (
                      <div key={`final-${i}-${q.id}`} className="p-3 rounded border border-border">
                        <p className="font-medium">Q{i + 1}. {q.question}</p>
                        <div className="mt-2 grid gap-2">
                          {q.options.map((opt, oi) => {
                            const selected = finalAnswers[q.id] === oi;
                            return (
                              <button
                                key={oi}
                                onClick={() => handleFinalSelect(q.id, oi)}
                                className={`text-left px-3 py-2 rounded border ${selected ? "border-green-600 bg-green-600/10" : "border-border hover:bg-accent"}`}
                              >
                                {opt.text}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Button className="bg-green-600 hover:bg-green-700" onClick={submitFinal}>Submit Final</Button>
                    <Button variant="outline" onClick={() => { setFinalAnswers({}); setFinalResult(null); }}>Reset</Button>
                    <Button variant="secondary" onClick={() => { setFinalMode(false); setFinalResult(null); }}>Back to Chapters</Button>
                  </div>

                  {finalResult && (
                    <div className="mt-4 p-3 rounded border border-border">
                      <p className="font-semibold">Your final score: {finalResult.percent}%</p>
                      {finalResult.completed ? (
                        <p className="text-green-600">Congratulations! Lesson completed.</p>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-red-500">Score at least 75% to complete. You can retake the test.</p>
                          <Button className="bg-green-600 hover:bg-green-700" onClick={() => { setFinalAnswers({}); setFinalResult(null); }}>Retake Final</Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}