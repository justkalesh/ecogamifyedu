import { db } from '@/db';
import { user, userKeys, lessonPerformance, userBadges, profiles } from '@/db/schema';

async function main() {
    // Create test users
    const testUsers = [
        {
            id: 'test-user-1',
            name: 'Alex Johnson',
            email: 'alex.johnson@test.com',
            emailVerified: true,
            image: 'https://example.com/avatars/alex.jpg',
            createdAt: new Date('2024-01-15T10:30:00').toISOString(),
            updatedAt: new Date('2024-01-15T10:30:00').toISOString(),
        },
        {
            id: 'test-user-2',
            name: 'Maria Rodriguez',
            email: 'maria.rodriguez@test.com',
            emailVerified: true,
            image: 'https://example.com/avatars/maria.jpg',
            createdAt: new Date('2024-01-20T14:45:00').toISOString(),
            updatedAt: new Date('2024-01-20T14:45:00').toISOString(),
        },
        {
            id: 'test-user-3',
            name: 'David Kim',
            email: 'david.kim@test.com',
            emailVerified: false,
            image: 'https://example.com/avatars/david.jpg',
            createdAt: new Date('2024-01-25T09:15:00').toISOString(),
            updatedAt: new Date('2024-01-25T09:15:00').toISOString(),
        }
    ];

    await db.insert(user).values(testUsers);

    // Create userKeys entries
    const userKeysData = [
        {
            extUserId: 'test-user-1',
            createdAt: new Date('2024-01-15T10:30:00').toISOString(),
            updatedAt: new Date('2024-01-15T10:30:00').toISOString(),
        },
        {
            extUserId: 'test-user-2',
            createdAt: new Date('2024-01-20T14:45:00').toISOString(),
            updatedAt: new Date('2024-01-20T14:45:00').toISOString(),
        },
        {
            extUserId: 'test-user-3',
            createdAt: new Date('2024-01-25T09:15:00').toISOString(),
            updatedAt: new Date('2024-01-25T09:15:00').toISOString(),
        }
    ];

    await db.insert(userKeys).values(userKeysData);

    // Create lessonPerformance entries
    const lessonPerformanceData = [
        // User 1 performances
        {
            userKeyId: 1,
            lessonKey: 'climate-change',
            chaptersCompleted: 4,
            totalChapters: 5,
            score: 85,
            lastActivityAt: new Date('2024-02-01T15:30:00'),
            completed: true,
            createdAt: new Date('2024-01-28T11:00:00').toISOString(),
            updatedAt: new Date('2024-02-01T15:30:00').toISOString(),
        },
        {
            userKeyId: 1,
            lessonKey: 'biodiversity',
            chaptersCompleted: 2,
            totalChapters: 4,
            score: 60,
            lastActivityAt: new Date('2024-02-05T09:45:00'),
            completed: false,
            createdAt: new Date('2024-02-03T14:20:00').toISOString(),
            updatedAt: new Date('2024-02-05T09:45:00').toISOString(),
        },
        // User 2 performances
        {
            userKeyId: 2,
            lessonKey: 'waste-management',
            chaptersCompleted: 3,
            totalChapters: 3,
            score: 92,
            lastActivityAt: new Date('2024-02-08T16:15:00'),
            completed: true,
            createdAt: new Date('2024-02-06T10:30:00').toISOString(),
            updatedAt: new Date('2024-02-08T16:15:00').toISOString(),
        },
        {
            userKeyId: 2,
            lessonKey: 'renewable-energy',
            chaptersCompleted: 1,
            totalChapters: 4,
            score: 45,
            lastActivityAt: new Date('2024-02-10T11:30:00'),
            completed: false,
            createdAt: new Date('2024-02-09T13:45:00').toISOString(),
            updatedAt: new Date('2024-02-10T11:30:00').toISOString(),
        },
        // User 3 performances
        {
            userKeyId: 3,
            lessonKey: 'climate-change',
            chaptersCompleted: 5,
            totalChapters: 5,
            score: 78,
            lastActivityAt: new Date('2024-02-12T14:00:00'),
            completed: true,
            createdAt: new Date('2024-02-11T09:00:00').toISOString(),
            updatedAt: new Date('2024-02-12T14:00:00').toISOString(),
        }
    ];

    await db.insert(lessonPerformance).values(lessonPerformanceData);

    // Create userBadges entries
    const userBadgesData = [
        {
            userKeyId: 1,
            badgeId: 1,
            awardedAt: new Date('2024-02-02T10:00:00'),
            createdAt: new Date('2024-02-02T10:00:00').toISOString(),
            updatedAt: new Date('2024-02-02T10:00:00').toISOString(),
        },
        {
            userKeyId: 1,
            badgeId: 3,
            awardedAt: new Date('2024-02-06T15:30:00'),
            createdAt: new Date('2024-02-06T15:30:00').toISOString(),
            updatedAt: new Date('2024-02-06T15:30:00').toISOString(),
        },
        {
            userKeyId: 2,
            badgeId: 2,
            awardedAt: new Date('2024-02-09T09:15:00'),
            createdAt: new Date('2024-02-09T09:15:00').toISOString(),
            updatedAt: new Date('2024-02-09T09:15:00').toISOString(),
        },
        {
            userKeyId: 2,
            badgeId: 4,
            awardedAt: new Date('2024-02-11T12:45:00'),
            createdAt: new Date('2024-02-11T12:45:00').toISOString(),
            updatedAt: new Date('2024-02-11T12:45:00').toISOString(),
        },
        {
            userKeyId: 3,
            badgeId: 5,
            awardedAt: new Date('2024-02-13T11:00:00'),
            createdAt: new Date('2024-02-13T11:00:00').toISOString(),
            updatedAt: new Date('2024-02-13T11:00:00').toISOString(),
        }
    ];

    await db.insert(userBadges).values(userBadgesData);

    // Create profiles entries
    const profilesData = [
        {
            userId: 'test-user-1',
            displayName: 'Eco Warrior Alex',
            bio: 'Passionate environmentalist dedicated to fighting climate change. I believe small actions can create big impacts!',
            avatarUrl: 'https://example.com/avatars/alex-profile.jpg',
            twitterUrl: 'https://twitter.com/ecoalex',
            linkedinUrl: 'https://linkedin.com/in/alexjohnson',
            githubUrl: 'https://github.com/alexeco',
            websiteUrl: 'https://alexeco-blog.com',
            createdAt: new Date('2024-01-15T11:00:00'),
            updatedAt: new Date('2024-02-01T16:30:00'),
        },
        {
            userId: 'test-user-2',
            displayName: 'Green Maria',
            bio: 'Sustainability advocate and waste reduction expert. Making the world cleaner, one step at a time.',
            avatarUrl: 'https://example.com/avatars/maria-profile.jpg',
            twitterUrl: 'https://twitter.com/greenmaria',
            linkedinUrl: 'https://linkedin.com/in/mariarodriguez',
            instagramUrl: 'https://instagram.com/greenmaria',
            createdAt: new Date('2024-01-20T15:30:00'),
            updatedAt: new Date('2024-02-08T17:00:00'),
        }
    ];

    await db.insert(profiles).values(profilesData);
    
    console.log('✅ Test profile data seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});