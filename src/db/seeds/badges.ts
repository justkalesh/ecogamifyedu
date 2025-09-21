import { db } from '@/db';
import { badges } from '@/db/schema';

async function main() {
    const sampleBadges = [
        {
            code: 'climate-change-complete',
            name: 'Climate Champion',
            description: 'Completed the Climate Change lesson',
            icon: '🌡️',
            createdAt: new Date('2024-01-10').toISOString(),
            updatedAt: new Date('2024-01-10').toISOString(),
        },
        {
            code: 'biodiversity-complete',
            name: 'Wildlife Guardian',
            description: 'Completed the Biodiversity lesson',
            icon: '🦋',
            createdAt: new Date('2024-01-11').toISOString(),
            updatedAt: new Date('2024-01-11').toISOString(),
        },
        {
            code: 'waste-management-complete',
            name: 'Waste Warrior',
            description: 'Completed the Waste Management lesson',
            icon: '♻️',
            createdAt: new Date('2024-01-12').toISOString(),
            updatedAt: new Date('2024-01-12').toISOString(),
        },
        {
            code: 'renewable-energy-complete',
            name: 'Energy Pioneer',
            description: 'Completed the Renewable Energy lesson',
            icon: '⚡',
            createdAt: new Date('2024-01-13').toISOString(),
            updatedAt: new Date('2024-01-13').toISOString(),
        },
        {
            code: 'all-lessons-complete',
            name: 'Eco Master',
            description: 'Completed all environmental lessons',
            icon: '🌍',
            createdAt: new Date('2024-01-14').toISOString(),
            updatedAt: new Date('2024-01-14').toISOString(),
        }
    ];

    await db.insert(badges).values(sampleBadges);
    
    console.log('✅ Badges seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});