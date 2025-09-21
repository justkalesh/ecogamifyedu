import { db } from '@/db';
import { profiles } from '@/db/schema';

async function main() {
    const sampleProfiles = [
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            displayName: 'John Doe',
            bio: 'Full-stack developer passionate about React, Node.js, and creating scalable web applications. Currently exploring AI integration in web apps.',
            avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
            twitterUrl: 'https://twitter.com/johndoe_dev',
            linkedinUrl: 'https://linkedin.com/in/johndoe-dev',
            githubUrl: 'https://github.com/johndoe-dev',
            websiteUrl: 'https://johndoe.dev',
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },
        {
            userId: 'user_02h5kxt2e8z9y3b1n7m6q5w8r4',
            displayName: 'Sarah Chen',
            bio: 'UI/UX Designer crafting delightful digital experiences. Coffee enthusiast and design systems advocate.',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=400&h=400&fit=crop&crop=face',
            linkedinUrl: 'https://linkedin.com/in/sarahchen-design',
            instagramUrl: 'https://instagram.com/sarahdesigns',
            websiteUrl: 'https://sarahchen.design',
            createdAt: new Date('2024-01-20').toISOString(),
            updatedAt: new Date('2024-01-20').toISOString(),
        },
        {
            userId: 'user_03h6kxt2e8z9y3b1n7m6q5w8r4',
            displayName: 'Mike Johnson',
            bio: 'Content creator and tech educator. Making complex topics simple through video tutorials and blog posts.',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
            twitterUrl: 'https://twitter.com/mikej_tech',
            youtubeUrl: 'https://youtube.com/c/techwithmike',
            githubUrl: 'https://github.com/mikej-tech',
            createdAt: new Date('2024-02-01').toISOString(),
            updatedAt: new Date('2024-02-01').toISOString(),
        },
        {
            userId: 'user_04h7kxt2e8z9y3b1n7m6q5w8r4',
            displayName: 'Emily Rodriguez',
            bio: 'Tech entrepreneur and startup founder. Building the future of remote collaboration tools.',
            avatarUrl: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face',
            twitterUrl: 'https://twitter.com/emrodriguezceo',
            linkedinUrl: 'https://linkedin.com/in/emilyrodriguez-startup',
            websiteUrl: 'https://collabfuture.io',
            createdAt: new Date('2024-02-10').toISOString(),
            updatedAt: new Date('2024-02-10').toISOString(),
        },
        {
            userId: 'demo-user',
            displayName: 'Demo User',
            bio: 'This is a demo profile showcasing the profile features and functionality.',
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face',
            createdAt: new Date('2024-03-01').toISOString(),
            updatedAt: new Date('2024-03-01').toISOString(),
        },
        {
            userId: 'user_05h8kxt2e8z9y3b1n7m6q5w8r4',
            displayName: 'David Park',
            bio: 'Open source contributor. Maintaining React frameworks and building developer tools.',
            avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b830303d71?w=400&h=400&fit=crop&crop=face',
            twitterUrl: 'https://twitter.com/dparkopensource',
            githubUrl: 'https://github.com/dpark-oss',
            createdAt: new Date('2024-02-20').toISOString(),
            updatedAt: new Date('2024-02-20').toISOString(),
        }
    ];

    await db.insert(profiles).values(sampleProfiles);
    
    console.log('✅ Profiles seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});