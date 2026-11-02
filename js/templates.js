/**
 * card4u Template Directory
 * Curated luxury cinematic card templates with default values,
 * color schemes, envelope styling, and sample media.
 */

const CARD_TEMPLATES = {
  'royal-wedding': {
    id: 'royal-wedding',
    name: 'Royal Shubh Vivah',
    category: 'wedding',
    tag: 'Trending Wedding',
    description: 'Majestic crimson & royal gold aesthetics with palace arch motifs, shehnai melodies, and sacred countdown.',
    badge: 'Luxury Invite',
    theme: {
      primaryColor: '#D4AF37',
      secondaryColor: '#800020',
      bgColor: '#16080A',
      cardBg: 'linear-gradient(135deg, #1C0A0E 0%, #2B0F16 50%, #150609 100%)',
      envelopeColor: '#5C0612',
      envelopeFlap: '#780B1B',
      envelopeLining: '#D4AF37',
      sealColor: '#D4AF37',
      sealIcon: 'crown',
      fontHeading: "'Playfair Display', serif",
      fontBody: "'Cinzel', serif",
      accentGlow: 'rgba(212, 175, 55, 0.35)',
      music: 'royal'
    },
    defaults: {
      recipientName: 'Rohan & Ananya',
      senderName: 'The Verma & Sharma Families',
      occasion: 'wedding',
      title: 'Together with our families, we joyfully invite you to celebrate our wedding!',
      message: 'Two souls, one destiny. Join us as we begin our forever under the stars. Your presence and blessings will make our special day truly complete.',
      secretMessage: '💍 Secret Venue Tip: Join us on the terrace at 9 PM for the royal firework toast!',
      date: '2026-12-18T18:30',
      venue: 'The Leela Palace Royal Ballroom, Udaipur',
      mapsUrl: 'https://maps.google.com',
      photos: [
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80'
      ]
    }
  },

  'midnight-birthday': {
    id: 'midnight-birthday',
    name: 'Midnight Sparkle Birthday',
    category: 'birthday',
    tag: 'Best Seller',
    description: 'Dazzling midnight obsidian background with golden confetti bursts and festive celebration melodies.',
    badge: 'Popular',
    theme: {
      primaryColor: '#F59E0B',
      secondaryColor: '#3B82F6',
      bgColor: '#0B0F19',
      cardBg: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)',
      envelopeColor: '#090D16',
      envelopeFlap: '#131B2E',
      envelopeLining: '#F59E0B',
      sealColor: '#F59E0B',
      sealIcon: 'cake',
      fontHeading: "'Plus Jakarta Sans', sans-serif",
      fontBody: "'Inter', sans-serif",
      accentGlow: 'rgba(245, 158, 11, 0.4)',
      music: 'birthday'
    },
    defaults: {
      recipientName: 'Aarav',
      senderName: 'Your Forever Crew',
      occasion: 'birthday',
      title: 'Happy 25th Birthday to our Favorite Human! 🎉',
      message: 'Here is to another year of unstoppable laughter, wild late-night drives, and conquering the world together. Keep shining brighter than the stars!',
      secretMessage: '🎁 Surprise: We booked a private rooftop karaoke bash tonight! Be ready by 8 PM sharp!',
      date: '2026-11-20T20:00',
      venue: 'Sky Lounge Rooftop, Indiranagar',
      mapsUrl: 'https://maps.google.com',
      photos: [
        'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80'
      ]
    }
  },

  'romantic-wax': {
    id: 'romantic-wax',
    name: 'Wax Seal Romantic Letter',
    category: 'love',
    tag: 'Deep Romance',
    description: 'Timeless vintage ivory letter with wax seal unseal, floating red rose petals, and acoustic piano arpeggios.',
    badge: 'Romantic Choice',
    theme: {
      primaryColor: '#E11D48',
      secondaryColor: '#BE123C',
      bgColor: '#17070B',
      cardBg: 'linear-gradient(145deg, #2A0813 0%, #1A050B 100%)',
      envelopeColor: '#4C0519',
      envelopeFlap: '#881337',
      envelopeLining: '#FDA4AF',
      sealColor: '#BE123C',
      sealIcon: 'heart',
      fontHeading: "'Playfair Display', serif",
      fontBody: "'Lora', serif",
      accentGlow: 'rgba(225, 29, 72, 0.4)',
      music: 'romantic'
    },
    defaults: {
      recipientName: 'My Beloved Maya',
      senderName: 'Yours Forever, Kabir',
      occasion: 'love',
      title: 'Every day with you is my favourite love story ❤️',
      message: 'In a world full of noise, you are my serene melody. From our first shy coffee date to this very moment, loving you has been the easiest and most magical adventure of my life.',
      secretMessage: '🌹 P.S. Pack a warm weekend bag. I’ve arranged that quiet cabin in the hills for our anniversary!',
      date: '2026-11-14T19:30',
      venue: 'Candlelight Dinner by the Lake',
      mapsUrl: 'https://maps.google.com',
      photos: [
        'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80'
      ]
    }
  },

  'sunset-anniversary': {
    id: 'sunset-anniversary',
    name: 'Sunset Vows Anniversary',
    category: 'anniversary',
    tag: 'Milestone Love',
    description: 'Warm golden amber dusk tones celebrating your journey together with photo polaroid slides.',
    badge: 'Anniversary Special',
    theme: {
      primaryColor: '#F97316',
      secondaryColor: '#D97706',
      bgColor: '#1A0E05',
      cardBg: 'linear-gradient(135deg, #261205 0%, #3D1C06 50%, #1A0E05 100%)',
      envelopeColor: '#381602',
      envelopeFlap: '#5C2404',
      envelopeLining: '#FDBA74',
      sealColor: '#F59E0B',
      sealIcon: 'ring',
      fontHeading: "'Playfair Display', serif",
      fontBody: "'Inter', sans-serif",
      accentGlow: 'rgba(249, 115, 22, 0.35)',
      music: 'romantic'
    },
    defaults: {
      recipientName: 'Sneha & Vikram',
      senderName: 'With Love from Mom & Dad',
      occasion: 'anniversary',
      title: 'Celebrating 10 Glorious Years of Love & Partnership',
      message: 'Ten years of building dreams, weathering storms, and nurturing a home filled with warmth and joy. Watching your bond deepen inspires us every day.',
      secretMessage: '🥂 Cheers to the next 50 years of boundless adventures and sweet memories!',
      date: '2026-12-05T19:00',
      venue: 'The Grand Terrace Garden',
      mapsUrl: 'https://maps.google.com',
      photos: [
        'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=800&q=80'
      ]
    }
  },

  'pastel-baby': {
    id: 'pastel-baby',
    name: 'Starlight Baby Shower',
    category: 'baby',
    tag: 'Warm & Sweet',
    description: 'Soft cloud lilac, celestial stars, and gentle dream bells welcoming a brand new bundle of joy.',
    badge: 'Baby & Kids',
    theme: {
      primaryColor: '#A855F7',
      secondaryColor: '#EC4899',
      bgColor: '#100B1B',
      cardBg: 'linear-gradient(135deg, #1C122D 0%, #2A1747 50%, #130B24 100%)',
      envelopeColor: '#25133F',
      envelopeFlap: '#3D2069',
      envelopeLining: '#E9D5FF',
      sealColor: '#C084FC',
      sealIcon: 'star',
      fontHeading: "'Plus Jakarta Sans', sans-serif",
      fontBody: "'Inter', sans-serif",
      accentGlow: 'rgba(168, 85, 247, 0.35)',
      music: 'chill'
    },
    defaults: {
      recipientName: 'Priya & Dev',
      senderName: 'Auntie Sunita & Family',
      occasion: 'baby',
      title: 'A Little Miracle is on the Way! 🍼✨',
      message: 'Ten tiny fingers, ten tiny toes, endless love that constantly grows. We cannot wait to hold and spoil your baby girl with all the hugs in the world!',
      secretMessage: '🧸 Peek inside: The nursery theme is Enchanted Woodland Starscape!',
      date: '2026-11-28T16:00',
      venue: 'Orchid Blossom Banquet Hall',
      mapsUrl: 'https://maps.google.com',
      photos: [
        'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80'
      ]
    }
  },

  'retro-party': {
    id: 'retro-party',
    name: 'Neon Chill Mixtape',
    category: 'party',
    tag: 'Trendy & Fun',
    description: 'Vibrant neon gradient, retro cassette vibes, and relaxed chill lo-fi groove.',
    badge: 'Party Vibes',
    theme: {
      primaryColor: '#06B6D4',
      secondaryColor: '#EC4899',
      bgColor: '#0A0E17',
      cardBg: 'linear-gradient(135deg, #091E2A 0%, #1F0D2B 100%)',
      envelopeColor: '#071822',
      envelopeFlap: '#102D3E',
      envelopeLining: '#67E8F9',
      sealColor: '#06B6D4',
      sealIcon: 'music',
      fontHeading: "'Plus Jakarta Sans', sans-serif",
      fontBody: "'Inter', sans-serif",
      accentGlow: 'rgba(6, 182, 212, 0.4)',
      music: 'chill'
    },
    defaults: {
      recipientName: 'Siddharth',
      senderName: 'The Bangalore Crew',
      occasion: 'party',
      title: 'Graduation / New Chapter Celebration! 🚀',
      message: 'You pulled off the impossible and crushed it! Time to kick back, drop the books, and let the bass drop at the afterparty.',
      secretMessage: '🎧 DJ Setlist has your favorite 2000s bangers lined up all night!',
      date: '2026-11-15T21:00',
      venue: 'The Neon Warehouse, Koramangala',
      mapsUrl: 'https://maps.google.com',
      photos: [
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80'
      ]
    }
  }
};

window.CARD_TEMPLATES = CARD_TEMPLATES;
