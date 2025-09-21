import { db } from '@/db';
import { user, userKeys, lessonPerformance, userBadges, profiles } from '@/db/schema';

async function main() {
  // Insert test user
  const testUser = {
    id: 'api-test-user',
    name: 'API Test User',
    email: 'api.test@example.com',
    emailVerified: true,
    image: null,
    createdAt: new Date('2024-12-15').toISOString(),
    updatedAt: new Date('2024-12-15').toISOString(),
  };

  await db.insert(user).values(testUser);

  // Insert userKeys entry
  const userKeyData = {
    extUserId: 'api-test-user-key',
    createdAt: new Date('2024-12-15').toISOString(),
    updatedAt: new Date('2024-12-15').toISOString(),
  };

  await db.insert(userKeys).values(userKeyData);

  // Query to get the actual userKey ID
  const insertedUserKey = await db.query.userKeys.findFirst({
    where: (userKeys, { eq }) => eq(userKeys.extUserId, 'api-test-user-key'),
  });

  if (!insertedUserKey) {
    throw new Error('Failed to retrieve inserted user key');
  }

  const userKeyId = insertedUserKey.id;

  // Insert lessonPerformance records
  const lessonPerformanceData = [
    {
      userKeyId: userKeyId,
      lessonKey: 'react-fundamentals',
      chaptersCompleted: 3,
      totalChapters: 5,
      score: 85,
      lastActivityAt: new Date('2024-12-20T10:30:00').toISOString(),
      completed: false,
      createdAt: new Date('2024-12-18').toISOString(),
      updatedAt: new Date('2024-12-20').toISOString(),
    },
    {
      userKeyId: userKeyId,
      lessonKey: 'typescript-basics',
      chaptersCompleted: 8,
      totalChapters: 8,
      score: 92,
      lastActivityAt: new Date('2024-12-21T14:15:00').toISOString(),
      completed: true,
      createdAt: new Date('2024-12-19').toISOString(),
      updatedAt: new Date('2024-12-21').toISOString(),
    },
  ];

  await db.insert(lessonPerformance).values(lessonPerformanceData);

  // Insert userBadges record
  const userBadgeData = {
    userKeyId: userKeyId,
    badgeId: 1,
    awardedAt: new Date('2024-12-21T16:45:00').toISOString(),
    createdAt: new Date('2024-12-21').toISOString(),
    updatedAt: new Date('2024-12-21').toISOString(),
  };

  await db.insert(userBadges).values(userBadgeData);

  // Insert profiles entry
  const profileData = {
    userId: 'api-test-user',
    displayName: 'Test User',
    bio: 'API testing specialist focused on educational content',
    avatarUrl: null,
    twitterUrl: null,
    linkedinUrl: 'https://linkedin.com/in/testuser',
    githubUrl: 'https://github.com/testuser',
    websiteUrl: 'https://testuser.dev',
    instagramUrl: null,
    youtubeUrl: null,
    createdAt: new Date('2024-12-15').toISOString(),
    updatedAt: new Date('2024-12-21').toISOString(),
  };

  await db.insert(profiles).values(profileData);

  console.log('✅ API test data seeder completed successfully');
}

main().catch((error) => {
  console.error('❌ Seeder failed:', error);
  process.exit(1);
});