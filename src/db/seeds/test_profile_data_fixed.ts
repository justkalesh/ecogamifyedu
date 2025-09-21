import { db } from '@/db';
import { user, userKeys, lessonPerformance, userBadges, profiles } from '@/db/schema';

async function main() {
    // Create test users with text IDs
    const testUsers = [
        {
            id: 'test-user-alpha',
            name: 'Alice Johnson',
            email: 'alice.johnson@test.com',
            emailVerified: true,
            image: 'https://example.com/avatar-alice.png',
            createdAt: new Date('2024-11-15T10:30:00Z'),
            updatedAt: new Date('2024-11-15T10:30:00Z'),
        },
        {
            id: 'test-user-beta',
            name: 'Marcus Chen',
            email: 'marcus.chen@test.com',
            emailVerified: true,
            image: 'https://example.com/avatar-marcus.png',
            createdAt: new Date('2024-11-16T14:45:00Z'),
            updatedAt: new Date('2024-11-16T14:45:00Z'),
        },
        {
            id: 'test-user-gamma',
            name: 'Sofia Rodriguez',
            email: 'sofia.rodriguez@test.com',
            emailVerified: false,
            image: 'https://example.com/avatar-sofia.png',
            createdAt: new Date('2024-11-17T09:15:00Z'),
            updatedAt: new Date('2024-11-17T09:15:00Z'),
        }
    ];

    await db.insert(user).values(testUsers);

    // Create userKeys entries (without specifying ID to allow auto-increment)
    const userKeysData = [
        {
            extUserId: 'test-user-alpha',
            createdAt: new Date('2024-11-15T10:30:00Z').toISOString(),
            updatedAt: new Date('2024-11-15T10:30:00Z').toISOString(),
        },
        {
            extUserId: 'test-user-beta',
            createdAt: new Date('2024-11-16T14:45:00Z').toISOString(),
            updatedAt: new Date('2024-11-16T14:45:00Z').toISOString(),
        },
        {
            extUserId: 'test-user-gamma',
            createdAt: new Date('2024-11-17T09:15:00Z').toISOString(),
            updatedAt: new Date('2024-11-17T09:15:00Z').toISOString(),
        }
    ];

    await db.insert(userKeys).values(userKeysData);

    // Query for the actual auto-generated userKeys IDs
    const createdUserKeys = await db.select().from(userKeys).where((userKeys.extUserId as any).in(['test-user-alpha', 'test-user-beta', 'test-user-gamma']));
    
    const alphaKeyId = createdUserKeys.find(k => k.extUserId === 'test-user-alpha')!.id;
    const betaKeyId = createdUserKeys.find(k => k.extUserId === 'test-user-beta')!.id;
    const gammaKeyId = createdUserKeys.find(k => k.extUserId === 'test-user-gamma')!.id;

    // Create lessonPerformance entries
    const lessonPerformances = [
        // User Alpha performances
        {
            userKeyId: alphaKeyId,
            lessonKey: 'climate-change',
            chaptersCompleted: 4,
            totalChapters: 5,
            score: 85,
            lastActivityAt: new Date('2024-11-20T16:30:00Z'),
            completed: false,
            createdAt: new Date('2024-11-15T10:35:00Z').toISOString(),
            updatedAt: new Date('2024-11-20T16:30:00Z').toISOString(),
        },
        {
            userKeyId: alphaKeyId,
            lessonKey: 'biodiversity',
            chaptersCompleted: 3,
            totalChapters: 4,
            score: 78,
            lastActivityAt: new Date('2024-11-18T11:20:00Z'),
            completed: false,
            createdAt: new Date('2024-11-16T09:00:00Z').toISOString(),
            updatedAt: new Date('2024-11-18T11:20:00Z').toISOString(),
        },
        // User Beta performances
        {
            userKeyId: betaKeyId,
            lessonKey: 'waste-management',
            chaptersCompleted: 6,
            totalChapters: 6,
            score: 92,
            lastActivityAt: new Date('2024-11-19T14:15:00Z'),
            completed: true,
            createdAt: new Date('2024-11-16T15:00:00Z').toISOString(),
            updatedAt: new Date('2024-11-19T14:15:00Z').toISOString(),
        },
        {
            userKeyId: betaKeyId,
            lessonKey: 'renewable-energy',
            chaptersCompleted: 3,
            totalChapters: 5,
            score: 67,
            lastActivityAt: new Date('2024-11-21T10:45:00Z'),
            completed: false,
            createdAt: new Date('2024-11-17T08:30:00Z').toISOString(),
            updatedAt: new Date('2024-11-21T10:45:00Z').toISOString(),
        },
        // User Gamma performances
        {
            userKeyId: gammaKeyId,
            lessonKey: 'climate-change',
            chaptersCompleted: 5,
            totalChapters: 5,
            score: 94,
            lastActivityAt: new Date('2024-11-22T17:00:00Z'),
            completed: true,
            createdAt: new Date('2024-11-17T09:30:00Z').toISOString(),
            updatedAt: new Date('2024-11-22T17:00:00Z').toISOString(),
        }
    ];

    await db.insert(lessonPerformance).values(lessonPerformances);

    // Create userBadges entries
    const userBadgesData = [
        {
            userKeyId: alphaKeyId,
            badgeId: 1,
            awardedAt: new Date('2024-11-18T12:00:00Z'),
            createdAt: new Date('2024-11-18T12:00:00Z').toISOString(),
            updatedAt: new Date('2024-11-18T12:00:00Z').toISOString(),
        },
        {
            userKeyId: alphaKeyId,
            badgeId: 2,
            awardedAt: new Date('2024-11-20T15:30:00Z'),
            createdAt: new Date('2024-11-20T15:30:00Z').toISOString(),
            updatedAt: new Date('2024-11-20T15:30:00Z').toISOString(),
        },
        {
            userKeyId: betaKeyId,
            badgeId: 3,
            awardedAt: new Date('2024-11-19T16:45:00Z'),
            createdAt: new Date('2024-11-19T16:45:00Z').toISOString(),
            updatedAt: new Date('2024-11-19T16:45:00Z').toISOString(),
        },
        {
            userKeyId: gammaKeyId,
            badgeId: 4,
            awardedAt: new Date('2024-11-22T18:15:00Z'),
            createdAt: new Date('2024-11-22T18:15:00Z').toISOString(),
            updatedAt: new Date('2024-11-22T18:15:00Z').toISOString(),
        },
        {
            userKeyId: gammaKeyId,
            badgeId: 5,
            awardedAt: new Date('2024-11-23T09:00:00Z'),
            createdAt: new Date('2024-11-23T09:00:00Z').toISOString(),
            updatedAt: new Date('2024-11-23T09:00:00Z').toISOString(),
        }
    ];

    await db.insert(userBadges).values(userBadgesData);

    // Create profiles entries for one user
    const profilesData = [
        {
            userId: 'test-user-beta',
            displayName: 'Marcus the Eco-Warrior',
            bio: 'Environmental scientist passionate about sustainable technology and climate solutions. Love exploring renewable energy innovations and waste reduction strategies.',
            avatarUrl: 'https://example.com/avatar-marcus-profile.png',
            twitterUrl: 'https://twitter.com/marcus_eco',
            linkedinUrl: 'https://linkedin.com/in/marcus-chen-env',
            githubUrl: 'https://github.com/marcus-eco',
            websiteUrl: 'https://marcus-eco-lab.com',
            createdAt: new Date('2024-11-16T14:50:00Z'),
            updatedAt: new Date('2024-11-21T11:00:00Z'),
        }
    ];

    await db.insert(profiles).values(profilesData);

    console.log('✅ Profile test data seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});