import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { profiles, user } from '@/db/schema';
import { eq } from 'drizzle-orm';

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

function isValidUrl(url: string | null | undefined): boolean {
  if (!url) return true;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    await ensureUserExists(userId);

    if (!userId) {
      return NextResponse.json({ 
        error: 'User ID is required',
        code: 'MISSING_USER_ID' 
      }, { status: 400 });
    }

    const existingProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    if (existingProfile.length > 0) {
      return NextResponse.json(existingProfile[0]);
    }

    // Create default empty profile
    const now = new Date();
    const newProfile = await db
      .insert(profiles)
      .values({
        userId: userId,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    return NextResponse.json(newProfile[0]);
  } catch (error) {
    console.error('GET profile error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    await ensureUserExists(userId);

    if (!userId) {
      return NextResponse.json({ 
        error: 'User ID is required',
        code: 'MISSING_USER_ID' 
      }, { status: 400 });
    }

    const body = await request.json();

    const {
      displayName,
      bio,
      avatarUrl,
      twitterUrl,
      linkedinUrl,
      githubUrl,
      websiteUrl,
      instagramUrl,
      youtubeUrl
    } = body;

    // Validate URL fields
    const urlFields: Record<string, string | null | undefined> = {
      avatarUrl,
      twitterUrl,
      linkedinUrl,
      githubUrl,
      websiteUrl,
      instagramUrl,
      youtubeUrl
    };

    for (const [key, value] of Object.entries(urlFields)) {
      const urlValue = value as string | null | undefined;
      if (urlValue !== undefined && urlValue !== null && urlValue !== '') {
        const allowDataScheme = key === 'avatarUrl' && urlValue.startsWith('data:');
        if (!allowDataScheme && !isValidUrl(urlValue)) {
          return NextResponse.json({ 
            error: `Invalid URL format for ${key}`,
            code: 'INVALID_URL',
            field: key
          }, { status: 400 });
        }
      }
    }

    const existingProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    const updateData = {
      ...(displayName !== undefined && { displayName: displayName?.trim() || null }),
      ...(bio !== undefined && { bio: bio?.trim() || null }),
      ...(avatarUrl !== undefined && { avatarUrl: avatarUrl?.trim() || null }),
      ...(twitterUrl !== undefined && { twitterUrl: twitterUrl?.trim() || null }),
      ...(linkedinUrl !== undefined && { linkedinUrl: linkedinUrl?.trim() || null }),
      ...(githubUrl !== undefined && { githubUrl: githubUrl?.trim() || null }),
      ...(websiteUrl !== undefined && { websiteUrl: websiteUrl?.trim() || null }),
      ...(instagramUrl !== undefined && { instagramUrl: instagramUrl?.trim() || null }),
      ...(youtubeUrl !== undefined && { youtubeUrl: youtubeUrl?.trim() || null }),
      updatedAt: new Date()
    };

    let result;
    if (existingProfile.length > 0) {
      // Update existing profile
      result = await db
        .update(profiles)
        .set(updateData)
        .where(eq(profiles.userId, userId))
        .returning();
    } else {
      // Create new profile
      result = await db
        .insert(profiles)
        .values({
          userId: userId,
          ...updateData,
          createdAt: new Date()
        })
        .returning();
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('PUT profile error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}