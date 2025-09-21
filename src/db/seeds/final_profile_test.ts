import { db } from '@/db';
import { user, userKeys, lessonPerformance, userBadges, profiles } from '@/db/schema';

async function main() {
    const testUserId = 'final-test-user';
    const now = new Date().toISOString();
    const timestamp = new Date().getTime();

    // Insert test user
    await db.insert(user).values({
        id: testUserId,
        name: 'Final Test User',
        email: 'final-test-user@example.com',
        emailVerified: true,
        image: 'https://example.com/avatar.jpg',
        createdAt: timestamp,
        updatedAt: timestamp,
    });

    // Insert userKeys entry with matching extUserId
    await db.insert(userKeys).values({
        extUserId: testUserId, // This MUST match user.id exactly
        createdAt: now,
        updatedAt: now,
    });

    // Get the userKey ID
    const userKeyResult = await db.select().from(userKeys).where(eq(userKeys.extUserId, testUserId));
    const userKeyId = userKeyResult[0].id;

    // Insert lessonPerformance records
    await db.insert(lessonPerformance).values([
        {
            userKeyId: userKeyId,
            lessonKey: 'climate-change',
            chaptersCompleted: 3,
            totalChapters: 5,
            score: 75,
            lastActivityAt: timestamp,
            completed: false,
            createdAt: now,
            updatedAt: now,
        },
        {
            userKeyId: userKeyId,
            lessonKey: 'biodiversity',
            chaptersCompleted: 4,
            totalChapters: 4,
            score: 92,
            lastActivityAt: timestamp,
            completed: true,
            createdAt: now,
            updatedAt: now,
        }
    ]);

    // Insert userBadges record
    await db.insert(userBadges).values({
        userKeyId: userKeyId,
        badgeId: 1,
        awardedAt: timestamp,
        createdAt: now,
        updatedAt: now,
    });

    // Insert profiles entry
    await db.insert(profiles).values({
        userId: testUserId,
        displayName: 'Test User',
        bio: 'This is a test profile for API testing',
        avatarUrl: 'https://example.com/avatar.jpg',
        twitterUrl: 'https://twitter.com/testuser',
        linkedinUrl: 'https://linkedin.com/in/testuser',
        githubUrl: 'https://github.com/testuser',
        websiteUrl: 'https://testuser.example.com',
        instagramUrl: 'https://instagram.com/testuser',
        youtubeUrl: 'https://youtube.com/testuser',
        createdAt: timestamp,
        updatedAt: timestamp,
    });

    console.log('✅ Final test user seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});