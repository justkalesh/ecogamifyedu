import { db } from '@/db';
import { user, userKeys, lessonPerformance, userBadges, profiles } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
    // Create user
    await db.insert(user).values({
        id: 'simple-test-user',
        name: 'Simple User',
        email: 'simple@test.com',
        emailVerified: true,
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-15T10:00:00Z'),
    });

    // Create userKeys
    await db.insert(userKeys).values({
        extUserId: 'simple-test-user',
        createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
        updatedAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    });

    // Query userKeys to get auto-generated ID
    const userKeyResult = await db.select().from(userKeys).where(eq(userKeys.extUserId, 'simple-test-user')).limit(1);
    const userKeyId = userKeyResult[0].id;

    // Create lessonPerformance entry
    await db.insert(lessonPerformance).values({
        userKeyId: userKeyId,
        lessonKey: 'climate-change',
        totalChapters: 5,
        chaptersCompleted: 4,
        score: 85,
        lastActivityAt: new Date('2024-01-20T14:30:00Z'),
        completed: false,
        createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
        updatedAt: new Date('2024-01-20T14:30:00Z').toISOString(),
    });

    // Create userBadges entry
    await db.insert(userBadges).values({
        userKeyId: userKeyId,
        badgeId: 1,
        awardedAt: new Date('2024-01-18T09:15:00Z'),
        createdAt: new Date('2024-01-18T09:15:00Z').toISOString(),
        updatedAt: new Date('2024-01-18T09:15:00Z').toISOString(),
    });

    // Create profiles entry
    await db.insert(profiles).values({
        userId: 'simple-test-user',
        displayName: 'Simple User',
        bio: 'Learning about climate change and sustainability.',
        avatarUrl: 'https://example.com/avatar.jpg',
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-15T10:00:00Z'),
    });

    console.log('✅ Simple test seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});