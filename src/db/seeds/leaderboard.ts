import { db } from '@/db';
import { user, userKeys, lessonPerformance, userBadges } from '@/db/schema';

async function main() {
    // Check if lessonPerformance table is empty
    const existingPerformance = await db.select().from(lessonPerformance).limit(1);
    if (existingPerformance.length > 0) {
        console.log('ℹ️ lessonPerformance table already seeded, skipping');
        return;
    }

    const now = new Date().toISOString();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Create users data
    const sampleUsers = [
        {
            id: 'user_01h4kxt2e8z9y3b1n7m6q5w8r0',
            email: 'alice.johnson@example.com',
            name: 'Alice Johnson',
            emailVerified: true,
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b5da?w=150&h=150&fit=crop&crop=face',
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'user_01h4kxt2e8z9y3b1n7m6q5w8r1',
            email: 'bob.smith@example.com',
            name: 'Bob Smith',
            emailVerified: true,
            image: null,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'user_01h4kxt2e8z9y3b1n7m6q5w8r2',
            email: 'carol.davis@example.com',
            name: 'Carol Davis',
            emailVerified: true,
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'user_01h4kxt2e8z9y3b1n7m6q5w8r3',
            email: 'david.wilson@example.com',
            name: 'David Wilson',
            emailVerified: true,
            image: null,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            email: 'emma.brown@example.com',
            name: 'Emma Brown',
            emailVerified: true,
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'user_01h4kxt2e8z9y3b1n7m6q5w8r5',
            email: 'frank.miller@example.com',
            name: 'Frank Miller',
            emailVerified: true,
            image: null,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'user_01h4kxt2e8z9y3b1n7m6q5w8r6',
            email: 'grace.lee@example.com',
            name: 'Grace Lee',
            emailVerified: true,
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'user_01h4kxt2e8z9y3b1n7m6q5w8r7',
            email: 'henry.taylor@example.com',
            name: 'Henry Taylor',
            emailVerified: true,
            image: null,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'user_01h4kxt2e8z9y3b1n7m6q5w8r8',
            email: 'isabella.jones@example.com',
            name: 'Isabella Jones',
            emailVerified: true,
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'user_01h4kxt2e8z9y3b1n7m6q5w8r9',
            email: 'jack.davis@example.com',
            name: 'Jack Davis',
            emailVerified: true,
            image: null,
            createdAt: now,
            updatedAt: now,
        },
    ];

    await db.insert(user).values(sampleUsers);

    // Create user_keys
    const sampleUserKeys = sampleUsers.map((u, index) => ({
        id: index + 1,
        extUserId: u.id,
        createdAt: now,
        updatedAt: now,
    }));

    await db.insert(userKeys).values(sampleUserKeys);

    // Create lesson performance data
    const sampleLessonPerformance = [
        // Alice Johnson (High performer)
        { userKeyId: 1, lessonKey: 'climate-change', chaptersCompleted: 8, totalChapters: 10, score: 92, completed: true },
        { userKeyId: 1, lessonKey: 'biodiversity', chaptersCompleted: 10, totalChapters: 10, score: 95, completed: true },
        { userKeyId: 1, lessonKey: 'waste-management', chaptersCompleted: 7, totalChapters: 8, score: 88, completed: true },
        { userKeyId: 1, lessonKey: 'renewable-energy', chaptersCompleted: 6, totalChapters: 9, score: 85, completed: false },
        
        // Bob Smith (High performer)
        { userKeyId: 2, lessonKey: 'climate-change', chaptersCompleted: 9, totalChapters: 10, score: 90, completed: true },
        { userKeyId: 2, lessonKey: 'biodiversity', chaptersCompleted: 8, totalChapters: 10, score: 87, completed: false },
        { userKeyId: 2, lessonKey: 'waste-management', chaptersCompleted: 8, totalChapters: 8, score: 91, completed: true },
        { userKeyId: 2, lessonKey: 'renewable-energy', chaptersCompleted: 9, totalChapters: 9, score: 93, completed: true },
        
        // Carol Davis (Medium performer)
        { userKeyId: 3, lessonKey: 'climate-change', chaptersCompleted: 7, totalChapters: 10, score: 78, completed: false },
        { userKeyId: 3, lessonKey: 'biodiversity', chaptersCompleted: 9, totalChapters: 10, score: 82, completed: true },
        { userKeyId: 3, lessonKey: 'waste-management', chaptersCompleted: 6, totalChapters: 8, score: 75, completed: false },
        
        // David Wilson (Medium performer)
        { userKeyId: 4, lessonKey: 'climate-change', chaptersCompleted: 10, totalChapters: 10, score: 81, completed: true },
        { userKeyId: 4, lessonKey: 'biodiversity', chaptersCompleted: 5, totalChapters: 10, score: 68, completed: false },
        { userKeyId: 4, lessonKey: 'renewable-energy', chaptersCompleted: 7, totalChapters: 9, score: 79, completed: false },
        
        // Emma Brown (Medium performer)
        { userKeyId: 5, lessonKey: 'climate-change', chaptersCompleted: 9, totalChapters: 10, score: 85, completed: true },
        { userKeyId: 5, lessonKey: 'waste-management', chaptersCompleted: 8, totalChapters: 8, score: 88, completed: true },
        { userKeyId: 5, lessonKey: 'biodiversity', chaptersCompleted: 4, totalChapters: 10, score: 65, completed: false },
        
        // Frank Miller (Lower performer)
        { userKeyId: 6, lessonKey: 'climate-change', chaptersCompleted: 5, totalChapters: 10, score: 62, completed: false },
        { userKeyId: 6, lessonKey: 'waste-management', chaptersCompleted: 6, totalChapters: 8, score: 71, completed: true },
        { userKeyId: 6, lessonKey: 'renewable-energy', chaptersCompleted: 3, totalChapters: 9, score: 55, completed: false },
        
        // Grace Lee (Lower performer)
        { userKeyId: 7, lessonKey: 'biodiversity', chaptersCompleted: 7, totalChapters: 10, score: 72, completed: false },
        { userKeyId: 7, lessonKey: 'climate-change', chaptersCompleted: 4, totalChapters: 10, score: 58, completed: false },
        
        // Henry Taylor (Lower performer)
        { userKeyId: 8, lessonKey: 'climate-change', chaptersCompleted: 6, totalChapters: 10, score: 68, completed: false },
        { userKeyId: 8, lessonKey: 'waste-management', chaptersCompleted: 4, totalChapters: 8, score: 52, completed: false },
        
        // Isabella Jones (Lower performer)
        { userKeyId: 9, lessonKey: 'renewable-energy', chaptersCompleted: 5, totalChapters: 9, score: 63, completed: false },
        { userKeyId: 9, lessonKey: 'climate-change', chaptersCompleted: 3, totalChapters: 10, score: 45, completed: false },
        
        // Jack Davis (Lower performer)
        { userKeyId: 10, lessonKey: 'biodiversity', chaptersCompleted: 6, totalChapters: 10, score: 65, completed: false },
        { userKeyId: 10, lessonKey: 'waste-management', chaptersCompleted: 3, totalChapters: 8, score: 48, completed: false },
    ];

    await db.insert(lessonPerformance).values(
        sampleLessonPerformance.map(p => ({
            ...p,
            lastActivityAt: thirtyDaysAgo,
            createdAt: thirtyDaysAgo,
            updatedAt: thirtyDaysAgo,
        }))
    );

    // Create user badges for top performers
    const sampleUserBadges = [
        { userKeyId: 1, badgeId: 1, awardedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }, // climate-change-complete
        { userKeyId: 1, badgeId: 2, awardedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() }, // biodiversity-complete
        { userKeyId: 1, badgeId: 3, awardedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() }, // waste-management-complete
        { userKeyId: 2, badgeId: 1, awardedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }, // climate-change-complete
        { userKeyId: 2, badgeId: 4, awardedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() }, // renewable-energy-complete
        { userKeyId: 3, badgeId: 2, awardedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() }, // biodiversity-complete
        { userKeyId: 5, badgeId: 1, awardedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() }, // climate-change-complete
        { userKeyId: 5, badgeId: 3, awardedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() }, // waste-management-complete
    ];

    await db.insert(userBadges).values(
        sampleUserBadges.map(b => ({
            ...b,
            createdAt: now,
            updatedAt: now,
        }))
    );

    console.log('✅ Leaderboard seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});