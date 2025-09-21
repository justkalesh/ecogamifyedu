import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, userKeys, lessonPerformance, badges, userBadges, profiles } from '@/db/schema';
import { eq, desc, sum, sql, and, isNotNull, inArray } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Validate parameters
    if (isNaN(limit) || limit < 1) {
      return NextResponse.json({ 
        error: 'Invalid limit parameter',
        code: 'INVALID_LIMIT'
      }, { status: 400 });
    }

    if (isNaN(offset) || offset < 0) {
      return NextResponse.json({ 
        error: 'Invalid offset parameter',
        code: 'INVALID_OFFSET'
      }, { status: 400 });
    }

    // Get aggregated user performance with user details and profile data
    const userScores = await db
      .select({
        userKeyId: lessonPerformance.userKeyId,
        points: sum(lessonPerformance.score).mapWith(Number),
        userId: user.id,
        userName: user.name,
        userImage: user.image,
        email: user.email,
        displayName: profiles.displayName,
        avatarUrl: profiles.avatarUrl,
      })
      .from(lessonPerformance)
      .innerJoin(userKeys, eq(lessonPerformance.userKeyId, userKeys.id))
      .innerJoin(user, eq(userKeys.extUserId, user.id))
      .leftJoin(profiles, eq(user.id, profiles.userId))
      .groupBy(lessonPerformance.userKeyId, user.id, user.name, user.email, user.image, profiles.displayName, profiles.avatarUrl)
      .having(sql`${sum(lessonPerformance.score)} > 0`)
      .orderBy(desc(sum(lessonPerformance.score)))
      .limit(limit)
      .offset(offset);

    if (userScores.length === 0) {
      return NextResponse.json({
        items: [],
        total: 0
      });
    }

    // Get user key IDs for badge query
    const userKeyIds = userScores.map(score => score.userKeyId);

    // Get most recent badge for each user
    const userBadgesData = await db
      .select({
        userKeyId: userBadges.userKeyId,
        badgeName: badges.name,
        awardedAt: userBadges.awardedAt,
      })
      .from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(inArray(userBadges.userKeyId, userKeyIds))
      .orderBy(userBadges.userKeyId, desc(userBadges.awardedAt));

    // Group badges by user and pick the most recent one
    const recentBadgesByUser = new Map();
    userBadgesData.forEach(badge => {
      if (!recentBadgesByUser.has(badge.userKeyId) || 
          new Date(badge.awardedAt) > new Date(recentBadgesByUser.get(badge.userKeyId).awardedAt)) {
        recentBadgesByUser.set(badge.userKeyId, badge);
      }
    });

    // Calculate ranks and format response
    const items = userScores.map((userScore, index) => {
      const topBadge = recentBadgesByUser.get(userScore.userKeyId)?.badgeName || null;
      const level = Math.floor((userScore.points || 0) / 400) + 1;
      
      // Use profiles data with fallbacks
      const name = userScore.displayName || userScore.userName || null;
      const image = userScore.avatarUrl || userScore.userImage || null;

      return {
        rank: offset + index + 1,
        userId: userScore.userId,
        name: name,
        email: userScore.email || 'unknown@example.com',
        image: image,
        points: userScore.points || 0,
        level: level,
        topBadge: topBadge
      };
    });

    // Get total count for pagination
    const totalCountQuery = await db
      .select({
        userKeyId: lessonPerformance.userKeyId,
        points: sum(lessonPerformance.score).mapWith(Number),
      })
      .from(lessonPerformance)
      .innerJoin(userKeys, eq(lessonPerformance.userKeyId, userKeys.id))
      .innerJoin(user, eq(userKeys.extUserId, user.id))
      .groupBy(lessonPerformance.userKeyId)
      .having(sql`${sum(lessonPerformance.score)} > 0`);

    const total = totalCountQuery.length;

    return NextResponse.json({
      items,
      total
    });

  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}