import { db, getOrCreateHafidh, getOrCreateVenue, insertRecording } from '../src/lib/db';

// Sample recordings from the provided SoundCloud links
const sampleRecordings = [
  {
    hafidh: 'Sheikh Abdul Rahman Al-Ausy',
    venue: 'Masjid Al-Furqan',
    city: 'Cape Town',
    year: 1445,
    url: 'https://on.soundcloud.com/OKmpOUTmH3YRxzEn8J',
    source: 'soundcloud' as const,
    title: 'Taraweeh 1445 AH',
  },
  {
    hafidh: 'Sheikh Yaseen Soobratty',
    venue: 'Musjid-ut-Taqwa',
    city: 'Pietermaritzburg',
    year: 1445,
    url: 'https://on.soundcloud.com/FF5iTDppTSissnLCP3',
    source: 'soundcloud' as const,
    title: 'Taraweeh 1445 AH',
  },
  {
    hafidh: 'Qari Yusuf Essack',
    venue: 'Masjid-e-Noor',
    city: 'Durban',
    year: 1445,
    url: 'https://on.soundcloud.com/85AOL9SvVDMgep3lNt',
    source: 'soundcloud' as const,
    title: 'Taraweeh 1445 AH',
  },
];

console.log('Seeding database...');

try {
  for (const recording of sampleRecordings) {
    const hafidhId = getOrCreateHafidh(recording.hafidh);
    const venueId = getOrCreateVenue(recording.venue, recording.city);

    insertRecording.run(
      hafidhId,
      venueId,
      recording.year,
      recording.url,
      recording.source,
      recording.title,
      null // description
    );

    console.log(`✓ Added: ${recording.hafidh} at ${recording.venue}, ${recording.city}`);
  }

  console.log('\n✅ Database seeded successfully!');
  console.log(`Added ${sampleRecordings.length} recordings`);
} catch (error) {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
} finally {
  db.close();
}
