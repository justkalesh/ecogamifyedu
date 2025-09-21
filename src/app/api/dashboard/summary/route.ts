import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userKeys, lessonPerformance, userBadges, badges, lessonProgress as lpTable, lessonChapterAttempts as lcaTable } from '@/db/schema';
import { eq, desc, sum, and } from 'drizzle-orm';
import { getAllLessons } from '@/app/lessons/data';

export const dynamic = "force-dynamic";

// Ensure we always have a concrete user id (text) that exists in DB (for FK)
async function getUserId(request: NextRequest) {
  const raw = request.headers.get('x-user-id')?.trim();
  return raw && raw.length > 0 ? raw : 'demo-user';
}

export async function GET(request: NextRequest) {
  try {
    const externalUserId = await getUserId(request);
    
    if (!externalUserId) {
      return NextResponse.json({ 
        error: 'External user ID is required',
        code: 'MISSING_EXTERNAL_USER_ID' 
      }, { status: 400 });
    }

    // Ensure userKey exists
    let userKey = await db.select()
      .from(userKeys)
      .where(eq(userKeys.extUserId, externalUserId))
      .limit(1);

    if (userKey.length === 0) {
      const now = new Date().toISOString();
      const newUserKey = await db.insert(userKeys)
        .values({ 
          extUserId: externalUserId,
          createdAt: now,
          updatedAt: now
        })
        .returning();
      userKey = newUserKey;
    }

    const userKeyId = userKey[0].id;

    // Build lesson title mapping dynamically from lessons data (ensures all lessons appear)
    const allLessons = getAllLessons();
    const lessonTitleMap: Record<string, string> = Object.fromEntries(
      allLessons.map(l => [l.key, l.title])
    );

    // Get performance data
    const performanceData = await db
      .select({
        lessonKey: lessonPerformance.lessonKey,
        chaptersCompleted: lessonPerformance.chaptersCompleted,
        totalChapters: lessonPerformance.totalChapters,
        score: lessonPerformance.score,
        completed: lessonPerformance.completed
      })
      .from(lessonPerformance)
      .where(eq(lessonPerformance.userKeyId, userKeyId))
      .orderBy(desc(lessonPerformance.lastActivityAt));

    // Calculate total points
    const scoreSum = await db
      .select({ total: sum(lessonPerformance.score) })
      .from(lessonPerformance)
      .where(eq(lessonPerformance.userKeyId, userKeyId));
    
    const totalPoints = Math.round((scoreSum[0]?.total || 0) * 100);
    const level = Math.floor(totalPoints / 300) + 1;

    // NEW: compute dashboard lesson progress using the SAME logic as /api/lesson-progress and LessonProgress component
    // Fetch all progress rows for this user once
    const progressRows = await db
      .select()
      .from(lpTable)
      .where(eq(lpTable.userId, externalUserId));

    // Fetch all chapter attempts for this user once
    const chapterAttemptRows = await db
      .select({
        lessonKey: lcaTable.lessonKey,
        chapterIndex: lcaTable.chapterIndex,
        passed: lcaTable.passed
      })
      .from(lcaTable)
      .where(eq(lcaTable.userId, externalUserId));

    const attemptsByLesson = chapterAttemptRows.reduce<Record<string, { passedCount: number }>>((acc, row) => {
      if (!acc[row.lessonKey]) acc[row.lessonKey] = { passedCount: 0 };
      if (row.passed) acc[row.lessonKey].passedCount += 1;
      return acc;
    }, {});

    const lessons = Object.keys(lessonTitleMap).map(lessonKey => {
      const lp = progressRows.find(p => p.lessonKey === lessonKey);
      const passedCount = attemptsByLesson[lessonKey]?.passedCount || 0;
      const currentChapter = lp?.currentChapter ?? 0;
      const totalChapters = allLessons.find(l => l.key === lessonKey)?.chapters.length || 1;
      const completedChapters = Math.max(currentChapter, passedCount);
      const completed = Boolean(lp?.completed);
      const progressPct = completed ? 100 : Math.max(0, Math.min(100, Math.round((completedChapters / totalChapters) * 100)));

      // merge in score from performanceData if present (kept for points display)
      const perf = performanceData.find(p => p.lessonKey === lessonKey);
      const score = perf?.score || 0;

      return {
        key: lessonKey,
        title: lessonTitleMap[lessonKey],
        progressPct,
        score,
        completed
      };
    });

    // Get user badges
    const userBadgeData = await db
      .select({
        code: badges.code,
        name: badges.name,
        icon: badges.icon
      })
      .from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userKeyId, userKeyId))
      .orderBy(desc(userBadges.awardedAt));

    // Calculate activity metrics (deterministic placeholders)
    const trees = Math.floor(totalPoints / 1000);
    const energyKwh = Math.floor(totalPoints * 0.05);  
    const plasticKg = Math.floor(totalPoints * 0.01);

    const response = {
      points: totalPoints,
      level,
      lessons,
      badges: userBadgeData,
      activity: {
        trees,
        energyKwh,
        plasticKg
      }
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Dashboard summary error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}