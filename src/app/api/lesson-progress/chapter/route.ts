import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { lessonProgress, lessonChapterAttempts, session, user } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export const dynamic = "force-dynamic";

// Ensure we always have a concrete user id (text) that exists in DB (for FK)
async function getUserId(request: NextRequest) {
  const raw = request.headers.get('x-user-id')?.trim();
  return raw && raw.length > 0 ? raw : 'demo-user';
}

async function ensureUserExists(userId: string) {
  const existing = await db.select().from(user).where(eq(user.id, userId)).limit(1);
  if (existing.length === 0) {
    const now = new Date();
    await db.insert(user).values({
      id: userId,
      name: 'Demo User',
      email: `${userId}@example.com`,
      emailVerified: false,
      createdAt: now,
      updatedAt: now,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    await ensureUserExists(userId);

    const body = await request.json();
    const { lessonKey, chapterIndex, score, total } = body;

    if (!lessonKey || typeof lessonKey !== 'string') {
      return NextResponse.json({ 
        error: "lessonKey is required and must be a string",
        code: "INVALID_LESSON_KEY" 
      }, { status: 400 });
    }

    if (typeof chapterIndex !== 'number' || chapterIndex < 0) {
      return NextResponse.json({ 
        error: "chapterIndex is required and must be a non-negative number",
        code: "INVALID_CHAPTER_INDEX" 
      }, { status: 400 });
    }

    if (typeof score !== 'number' || score < 0) {
      return NextResponse.json({ 
        error: "score is required and must be a non-negative number",
        code: "INVALID_SCORE" 
      }, { status: 400 });
    }

    if (typeof total !== 'number' || total <= 0) {
      return NextResponse.json({ 
        error: "total is required and must be a positive number",
        code: "INVALID_TOTAL" 
      }, { status: 400 });
    }

    if (score > total) {
      return NextResponse.json({ 
        error: "score cannot be greater than total",
        code: "INVALID_SCORE_TOTAL" 
      }, { status: 400 });
    }

    const percent = Math.round(score / total * 100);
    const passed = percent >= 80;

    const timestamp = new Date().toISOString();

    const existingAttempt = await db
      .select()
      .from(lessonChapterAttempts)
      .where(
        and(
          eq(lessonChapterAttempts.userId, userId),
          eq(lessonChapterAttempts.lessonKey, lessonKey),
          eq(lessonChapterAttempts.chapterIndex, chapterIndex)
        )
      )
      .limit(1);

    let updatedAttempt;
    const finalPassed = existingAttempt.length > 0 
      ? passed || Boolean(existingAttempt[0].passed)
      : passed;

    if (existingAttempt.length > 0) {
      const currentAttempt = existingAttempt[0];
      const bestScore = percent > currentAttempt.bestScore ? percent : currentAttempt.bestScore;
      
      updatedAttempt = await db
        .update(lessonChapterAttempts)
        .set({
          attempts: currentAttempt.attempts + 1,
          bestScore,
          latestScore: percent,
          passed: finalPassed,
          updatedAt: timestamp
        })
        .where(eq(lessonChapterAttempts.id, currentAttempt.id))
        .returning();
    } else {
      // Don't specify id field for auto-increment
      updatedAttempt = await db
        .insert(lessonChapterAttempts)
        .values({
          userId: userId,
          lessonKey,
          chapterIndex,
          attempts: 1,
          bestScore: percent,
          latestScore: percent,
          passed: finalPassed,
          createdAt: timestamp,
          updatedAt: timestamp
        })
        .returning();
    }

    if (finalPassed) {
      const progress = await db
        .select()
        .from(lessonProgress)
        .where(
          and(
            eq(lessonProgress.userId, userId),
            eq(lessonProgress.lessonKey, lessonKey)
          )
        )
        .limit(1);

      if (progress.length > 0) {
        const currentProgress = progress[0];
        if (chapterIndex >= currentProgress.currentChapter) {
          await db
            .update(lessonProgress)
            .set({
              currentChapter: chapterIndex + 1,
              updatedAt: timestamp
            })
            .where(
              and(
                eq(lessonProgress.userId, userId),
                eq(lessonProgress.lessonKey, lessonKey)
              )
            );
        }
      } else {
        await db
          .insert(lessonProgress)
          .values({
            userId: userId,
            lessonKey,
            currentChapter: chapterIndex + 1,
            completed: false,
            createdAt: timestamp,
            updatedAt: timestamp
          });
      }
    }

    const currentProgress = await db
      .select()
      .from(lessonProgress)
      .where(
        and(
          eq(lessonProgress.userId, userId),
          eq(lessonProgress.lessonKey, lessonKey)
        )
      )
      .limit(1);

    const currentChapter = currentProgress.length > 0 ? currentProgress[0].currentChapter : 0;

    return NextResponse.json({
      passed: finalPassed,
      percent,
      currentChapter
    });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}