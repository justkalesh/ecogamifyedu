import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, profiles, userKeys, lessonPerformance, userBadges, badges } from '@/db/schema';
import { eq, sum, desc } from 'drizzle-orm';

export async function GET(_request: NextRequest, context: { params: { userId: string } }) {
  try {
    const userId = context?.params?.userId;

    if (!userId) {
      return NextResponse.json({
        error: 'User ID is required',
        code: 'MISSING_USER_ID'
      }, { status: 400 });
    }

    // Query user table
    const userResult = await db.select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json({
        error: 'USER_NOT_FOUND',
        code: 'USER_NOT_FOUND'
      }, { status: 404 });
    }

    const userData = userResult[0];

    // Query profile
    const profileResult = await db.select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    const profileData = profileResult.length > 0 ? profileResult[0] : null;

    // Get userKey for this user
    const userKeyResult = await db.select()
      .from(userKeys)
      .where(eq(userKeys.extUserId, userId))
      .limit(1);

    let points = 0;
    let mappedBadges: any[] = [];
    let recentActivities: any[] = [];

    if (userKeyResult.length > 0) {
      const userKeyId = userKeyResult[0].id;

      // Calculate points and level
      const pointsResult = await db.select({
        totalScore: sum(lessonPerformance.score)
      })
        .from(lessonPerformance)
        .where(eq(lessonPerformance.userKeyId, userKeyId));

      points = pointsResult[0]?.totalScore || 0;

      // Query badges
      const badgesResult = await db.select({
        badgeId: badges.id,
        badgeName: badges.name,
        awardedAt: userBadges.awardedAt
      })
        .from(userBadges)
        .innerJoin(badges, eq(userBadges.badgeId, badges.id))
        .where(eq(userBadges.userKeyId, userKeyId))
        .orderBy(desc(userBadges.awardedAt));

      mappedBadges = badgesResult.map(badge => ({
        id: badge.badgeId,
        name: badge.badgeName,
        awardedAt: badge.awardedAt.toISOString()
      }));

      // Query recent activities
      const lessonActivities = await db.select({
        lessonKey: lessonPerformance.lessonKey,
        completed: lessonPerformance.completed,
        chaptersCompleted: lessonPerformance.chaptersCompleted,
        totalChapters: lessonPerformance.totalChapters,
        score: lessonPerformance.score,
        lastActivityAt: lessonPerformance.lastActivityAt
      })
        .from(lessonPerformance)
        .where(eq(lessonPerformance.userKeyId, userKeyId))
        .orderBy(desc(lessonPerformance.lastActivityAt))
        .limit(10);

      const badgeActivities = await db.select({
        badgeName: badges.name,
        awardedAt: userBadges.awardedAt
      })
        .from(userBadges)
        .innerJoin(badges, eq(userBadges.badgeId, badges.id))
        .where(eq(userBadges.userKeyId, userKeyId))
        .orderBy(desc(userBadges.awardedAt))
        .limit(10);

      const formattedLessonActivities = lessonActivities.map(activity => ({
        type: 'lesson' as const,
        title: activity.completed
          ? `Completed lesson: ${activity.lessonKey}`
          : `Worked on lesson: ${activity.lessonKey}`,
        subtitle: `${activity.chaptersCompleted}/${activity.totalChapters} chapters, score ${activity.score}`,
        createdAt: new Date(activity.lastActivityAt).toISOString()
      }));

      const formattedBadgeActivities = badgeActivities.map(activity => ({
        type: 'badge' as const,
        title: `Earned badge: ${activity.badgeName}`,
        createdAt: activity.awardedAt.toISOString()
      }));

      const allActivities = [...formattedLessonActivities, ...formattedBadgeActivities];
      allActivities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      recentActivities = allActivities.slice(0, 10);
    }

    const level = Math.floor(points / 400) + 1;

    const response = {
      userId: userData.id,
      name: profileData?.displayName || userData.name,
      email: userData.email,
      avatarUrl: profileData?.avatarUrl || userData.image,
      bio: profileData?.bio || null,
      socials: {
        twitterUrl: profileData?.twitterUrl || null,
        linkedinUrl: profileData?.linkedinUrl || null,
        githubUrl: profileData?.githubUrl || null,
        websiteUrl: profileData?.websiteUrl || null,
        instagramUrl: profileData?.instagramUrl || null,
        youtubeUrl: profileData?.youtubeUrl || null
      },
      stats: {
        points,
        level
      },
      badges: mappedBadges,
      recentActivities
    };

    return NextResponse.json(response, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}