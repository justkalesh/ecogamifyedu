import { db } from '@/db';
import { user, userKeys, lessonPerformance, userBadges, badges, profiles } from '@/db/schema';

async function main() {
    // Create test user
    const testUser = await db.insert(user).values({
        id: 'user_activity_test_01h4kxt2e8z9y3b1n7m6q5w8r4',
        name: 'activity-test-user',
        email: 'activity.test.user@example.com',
        emailVerified: true,
        image: 'https://example.com/avatar.jpg',
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-15T10:00:00Z'),
    }).returning();

    // Create userKeys entry
    const userKey = await db.insert(userKeys).values({
        extUserId: 'activity_test_user_001',
        createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
        updatedAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    }).returning();

    // Create badges for testing
    const badge1 = await db.insert(badges).values({
        code: 'speed-learner',
        name: 'Speed Learner',
        description: 'Complete lessons quickly',
        icon: '🚀',
        createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
        updatedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    }).returning();

    const badge2 = await db.insert(badges).values({
        code: 'perfectionist',
        name: 'Perfectionist',
        description: 'Score 100% on any lesson',
        icon: '⭐',
        createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
        updatedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    }).returning();

    // Create 3 lessonPerformance entries with different lastActivityAt dates
    const lessonPerformances = [
        {
            userKeyId: userKey[0].id,
            lessonKey: 'javascript-basics',
            chaptersCompleted: 2,
            totalChapters: 5,
            score: 85,
            lastActivityAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            completed: false,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            userKeyId: userKey[0].id,
            lessonKey: 'typescript-fundamentals',
            chaptersCompleted: 4,
            totalChapters: 6,
            score: 92,
            lastActivityAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            completed: false,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            userKeyId: userKey[0].id,
            lessonKey: 'react-hooks',
            chaptersCompleted: 3,
            totalChapters: 3,
            score: 100,
            lastActivityAt: new Date(), // Today
            completed: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];

    await db.insert(lessonPerformance).values(lessonPerformances);

    // Create 2 userBadges entries with different awardedAt dates
    const userBadgeEntries = [
        {
            userKeyId: userKey[0].id,
            badgeId: badge1[0].id,
            awardedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            userKeyId: userKey[0].id,
            badgeId: badge2[0].id,
            awardedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        },
    ];

    await db.insert(userBadges).values(userBadgeEntries);

    // Create profiles entry
    await db.insert(profiles).values({
        userId: testUser[0].id,
        displayName: 'Activity Tester',
        bio: 'Testing activity sorting functionality',
        avatarUrl: 'https://example.com/test-avatar.jpg',
        twitterUrl: 'https://twitter.com/activitytester',
        linkedinUrl: 'https://linkedin.com/in/activitytester',
        githubUrl: 'https://github.com/activitytester',
        websiteUrl: 'https://activitytester.dev',
        instagramUrl: 'https://instagram.com/activitytester',
        youtubeUrl: 'https://youtube.com/@activitytester',
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-15T10:00:00Z'),
    });

    console.log('✅ Complex activity test seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});