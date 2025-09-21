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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lessonKey = searchParams.get('lessonKey');

    if (!lessonKey) {
      return NextResponse.json({ 
        error: "lessonKey is required",
        code: "MISSING_LESSON_KEY"
      }, { status: 400 });
    }

    const userId = await getUserId(request);
    await ensureUserExists(userId);

    let lessonProgressRecord = await db
      .select()
      .from(lessonProgress)
      .where(
        and(
          eq(lessonProgress.userId, userId),
          eq(lessonProgress.lessonKey, lessonKey)
        )
      )
      .limit(1);

    if (lessonProgressRecord.length === 0) {
      const now = new Date().toISOString();
      try {
        // Don't specify id field for auto-increment
        const newProgress = await db
          .insert(lessonProgress)
          .values({
            userId: userId,
            lessonKey: lessonKey,
            currentChapter: 0,
            completed: false,
            createdAt: now,
            updatedAt: now
          })
          .returning();
        
        lessonProgressRecord = newProgress;
      } catch (insertError) {
        console.error('Insert error details:', insertError);
        // Return a default response if insert fails
        const fallbackNow = new Date().toISOString();
        return NextResponse.json({
          lessonKey,
          currentChapter: 0,
          completed: false,
          finalScore: null,
          chapters: [],
          updatedAt: fallbackNow
        });
      }
    }

    const progress = lessonProgressRecord[0];

    const chapterAttempts = await db
      .select({
        chapterIndex: lessonChapterAttempts.chapterIndex,
        bestScore: lessonChapterAttempts.bestScore,
        passed: lessonChapterAttempts.passed,
        attempts: lessonChapterAttempts.attempts
      })
      .from(lessonChapterAttempts)
      .where(
        and(
          eq(lessonChapterAttempts.userId, userId),
          eq(lessonChapterAttempts.lessonKey, lessonKey)
        )
      );

    const response = {
      lessonKey: progress.lessonKey,
      currentChapter: progress.currentChapter,
      completed: Boolean(progress.completed),
      finalScore: progress.finalScore,
      chapters: chapterAttempts.map(attempt => ({
        chapterIndex: attempt.chapterIndex,
        bestScore: attempt.bestScore,
        passed: Boolean(attempt.passed),
        attempts: attempt.attempts
      })),
      updatedAt: progress.updatedAt
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('GET lesson progress error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}