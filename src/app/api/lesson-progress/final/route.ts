import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { lessonProgress, session, user } from '@/db/schema';
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
    const { lessonKey, score, total } = body;

    // Validate required fields
    if (!lessonKey || typeof lessonKey !== 'string') {
      return NextResponse.json({ 
        error: 'lessonKey is required and must be a string',
        code: 'MISSING_LESSON_KEY'
      }, { status: 400 });
    }

    if (typeof score !== 'number' || score < 0) {
      return NextResponse.json({ 
        error: 'score is required and must be a non-negative number',
        code: 'INVALID_SCORE'
      }, { status: 400 });
    }

    if (typeof total !== 'number' || total <= 0) {
      return NextResponse.json({ 
        error: 'total is required and must be a positive number',
        code: 'INVALID_TOTAL'
      }, { status: 400 });
    }

    // Calculate percentage
    const percent = Math.round((score / total) * 100);
    const completed = percent >= 75;

    // Check if lesson progress exists for this user
    const existingProgress = await db
      .select()
      .from(lessonProgress)
      .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonKey, lessonKey)))
      .limit(1);

    let result;
    const now = new Date().toISOString();

    if (existingProgress.length > 0) {
      // Update existing progress
      const updated = await db
        .update(lessonProgress)
        .set({
          completed: completed,
          finalScore: percent,
          updatedAt: now
        })
        .where(and(eq(lessonProgress.id, existingProgress[0].id), eq(lessonProgress.userId, userId)))
        .returning();

      result = updated[0];
    } else {
      // Don't specify id field for auto-increment
      const newProgress = await db
        .insert(lessonProgress)
        .values({
          userId: userId,
          lessonKey,
          currentChapter: 0,
          completed: completed,
          finalScore: percent,
          createdAt: now,
          updatedAt: now
        })
        .returning();

      result = newProgress[0];
    }

    return NextResponse.json({
      completed: Boolean(result.completed),
      percent
    }, { status: 200 });

  } catch (error) {
    console.error('POST lesson completion error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error,
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}