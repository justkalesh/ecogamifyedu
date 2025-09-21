import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { lessonProgress, lessonChapterAttempts, lessonPerformance, userKeys, badges, userBadges } from '@/db/schema';
import { eq, and, sum } from 'drizzle-orm';

export const dynamic = "force-dynamic";

// Badge mapping for environmental lessons
const LESSON_BADGE_MAP: Record<string, string> = {
  'climate-change': 'climate-change-complete',
  'biodiversity': 'biodiversity-complete', 
  'waste-management': 'waste-management-complete',
  'renewable-energy': 'renewable-energy-complete'
};

// Ensure we always have a concrete user id (text) that exists in DB (for FK)
async function getUserId(request: NextRequest) {
  const raw = request.headers.get('x-user-id')?.trim();
  return raw && raw.length > 0 ? raw : 'demo-user';
}

export async function POST(request: NextRequest) {
  try {
    const externalUserId = await getUserId(request);
    
    if (!externalUserId) {
      return NextResponse.json({ 
        error: 'External user ID is required',
        code: 'MISSING_EXTERNAL_USER_ID' 
      }, { status: 400 });
    }

    // Parse request body (optional)
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // Empty body is valid for recompute from existing data
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
    let updatedPerformances: any[] = [];
    let newlyAwardedBadges: any[] = [];

    if (body.lesson_key) {
      // Direct upsert mode
      const { lesson_key, total_chapters, chapters_completed, score } = body;
      
      if (total_chapters === undefined || chapters_completed === undefined || score === undefined) {
        return NextResponse.json({ 
          error: 'All fields required for direct upsert: lesson_key, total_chapters, chapters_completed, score',
          code: 'MISSING_FIELDS'
        }, { status: 400 });
      }

      const completed = chapters_completed >= total_chapters;
      const now = new Date().toISOString();
      const lastActivityAt = new Date();

      // Check if record exists
      const existingRecord = await db.select()
        .from(lessonPerformance)
        .where(and(
          eq(lessonPerformance.userKeyId, userKeyId),
          eq(lessonPerformance.lessonKey, lesson_key)
        ))
        .limit(1);

      let performance;
      if (existingRecord.length > 0) {
        // Update existing
        performance = await db.update(lessonPerformance)
          .set({
            chaptersCompleted: chapters_completed,
            totalChapters: total_chapters,
            score,
            completed,
            lastActivityAt,
            updatedAt: now
          })
          .where(eq(lessonPerformance.id, existingRecord[0].id))
          .returning();
      } else {
        // Insert new
        performance = await db.insert(lessonPerformance)
          .values({
            userKeyId,
            lessonKey: lesson_key,
            chaptersCompleted: chapters_completed,
            totalChapters: total_chapters,
            score,
            lastActivityAt,
            completed,
            createdAt: now,
            updatedAt: now
          })
          .returning();
      }

      updatedPerformances = performance;

      // Award badge if completed
      if (completed) {
        const awardedBadges = await awardLessonBadges(userKeyId, lesson_key);
        newlyAwardedBadges = awardedBadges;
      }
    } else {
      // Recompute from existing lesson_progress data
      const progressRecords = await db.select()
        .from(lessonProgress)
        .where(eq(lessonProgress.userId, externalUserId));

      const chapterRecords = await db.select()
        .from(lessonChapterAttempts)
        .where(eq(lessonChapterAttempts.userId, externalUserId));

      // Group chapters by lesson
      const chaptersByLesson: Record<string, any[]> = {};
      chapterRecords.forEach(chapter => {
        if (!chaptersByLesson[chapter.lessonKey]) {
          chaptersByLesson[chapter.lessonKey] = [];
        }
        chaptersByLesson[chapter.lessonKey].push(chapter);
      });

      // Process each lesson progress record
      for (const progress of progressRecords) {
        const lessonChapters = chaptersByLesson[progress.lessonKey] || [];
        
        // Calculate performance metrics
        const completedChapters = lessonChapters.filter(ch => ch.passed).length;
        const totalChapters = Math.max(progress.currentChapter, lessonChapters.length);
        const averageScore = lessonChapters.length > 0 
          ? Math.round(lessonChapters.reduce((sum, ch) => sum + ch.bestScore, 0) / lessonChapters.length)
          : 0;
        const completed = completedChapters >= totalChapters && totalChapters > 0;
        const lastActivityAt = new Date();
        const now = new Date().toISOString();

        // Upsert lesson performance
        const existingPerf = await db.select()
          .from(lessonPerformance)
          .where(and(
            eq(lessonPerformance.userKeyId, userKeyId),
            eq(lessonPerformance.lessonKey, progress.lessonKey)
          ))
          .limit(1);

        let performance;
        if (existingPerf.length > 0) {
          performance = await db.update(lessonPerformance)
            .set({
              chaptersCompleted: completedChapters,
              totalChapters,
              score: averageScore,
              completed,
              lastActivityAt,
              updatedAt: now
            })
            .where(eq(lessonPerformance.id, existingPerf[0].id))
            .returning();
        } else {
          performance = await db.insert(lessonPerformance)
            .values({
              userKeyId,
              lessonKey: progress.lessonKey,
              chaptersCompleted: completedChapters,
              totalChapters,
              score: averageScore,
              lastActivityAt,
              completed,
              createdAt: now,
              updatedAt: now
            })
            .returning();
        }

        updatedPerformances.push(performance[0]);

        // Award badges if completed
        if (completed) {
          const awardedBadges = await awardLessonBadges(userKeyId, progress.lessonKey);
          newlyAwardedBadges.push(...awardedBadges);
        }
      }
    }

    // Get updated summary
    const allPerformance = await db.select()
      .from(lessonPerformance)
      .where(eq(lessonPerformance.userKeyId, userKeyId));

    const scoreSum = await db
      .select({ total: sum(lessonPerformance.score) })
      .from(lessonPerformance)
      .where(eq(lessonPerformance.userKeyId, userKeyId));

    const totalPoints = Math.round((scoreSum[0]?.total || 0) * 100);
    const level = Math.floor(totalPoints / 300) + 1;

    return NextResponse.json({
      performances: updatedPerformances,
      summary: {
        points: totalPoints,
        level
      },
      newlyAwardedBadges
    }, { status: 200 });

  } catch (error) {
    console.error('Recompute API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

async function awardLessonBadges(userKeyId: number, lessonKey: string): Promise<any[]> {
  const newlyAwardedBadges: any[] = [];

  // Award lesson-specific badge
  const badgeCode = LESSON_BADGE_MAP[lessonKey];
  if (badgeCode) {
    const badge = await db.select()
      .from(badges)
      .where(eq(badges.code, badgeCode))
      .limit(1);

    if (badge.length > 0) {
      // Check if badge already awarded
      const existingBadge = await db.select()
        .from(userBadges)
        .where(and(
          eq(userBadges.userKeyId, userKeyId),
          eq(userBadges.badgeId, badge[0].id)
        ))
        .limit(1);

      if (existingBadge.length === 0) {
        // Award the badge
        const now = new Date();
        await db.insert(userBadges)
          .values({
            userKeyId,
            badgeId: badge[0].id,
            awardedAt: now,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });

        newlyAwardedBadges.push({
          code: badge[0].code,
          name: badge[0].name,
          icon: badge[0].icon,
          awardedAt: now
        });
      }
    }
  }

  // Check for all-lessons-complete badge
  const completedLessons = await db.select()
    .from(lessonPerformance)
    .where(and(
      eq(lessonPerformance.userKeyId, userKeyId),
      eq(lessonPerformance.completed, true)
    ));

  const lessonKeys = Object.keys(LESSON_BADGE_MAP);
  const allLessonsCompleted = lessonKeys.every(key => 
    completedLessons.some(perf => perf.lessonKey === key)
  );

  if (allLessonsCompleted) {
    const allLessonsBadge = await db.select()
      .from(badges)
      .where(eq(badges.code, 'all-lessons-complete'))
      .limit(1);

    if (allLessonsBadge.length > 0) {
      const existingAllBadge = await db.select()
        .from(userBadges)
        .where(and(
          eq(userBadges.userKeyId, userKeyId),
          eq(userBadges.badgeId, allLessonsBadge[0].id)
        ))
        .limit(1);

      if (existingAllBadge.length === 0) {
        const now = new Date();
        await db.insert(userBadges)
          .values({
            userKeyId,
            badgeId: allLessonsBadge[0].id,
            awardedAt: now,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });

        newlyAwardedBadges.push({
          code: allLessonsBadge[0].code,
          name: allLessonsBadge[0].name,
          icon: allLessonsBadge[0].icon,
          awardedAt: now
        });
      }
    }
  }

  return newlyAwardedBadges;
}