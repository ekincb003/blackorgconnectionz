// Utility to generate dynamic SVG data URI avatars with custom colors and monograms

export interface MonogramOptions {
  text: string;
  bgColor: string;
  textColor: string;
  fontSize?: number;
  isGreek?: boolean;
}

export const PRESET_BG_COLORS = [
  { name: 'Royal Blue', hex: '#002B7F' },
  { name: 'Crimson', hex: '#9B111E' },
  { name: 'Old Gold', hex: '#D4AF37' },
  { name: 'Emerald Green', hex: '#008053' },
  { name: 'Salmon Pink', hex: '#F7C6D0' },
  { name: 'Deep Purple', hex: '#4B0082' },
  { name: 'Black Velvet', hex: '#111827' },
  { name: 'Burgundy', hex: '#800020' },
  { name: 'Navy Blue', hex: '#001F3F' },
  { name: 'Teal', hex: '#008080' },
  { name: 'UCR Blue', hex: '#003DA5' },
  { name: 'UCR Gold', hex: '#FFB81C' }
];

export const PRESET_TEXT_COLORS = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Pure Gold', hex: '#FFD700' },
  { name: 'Jet Black', hex: '#000000' },
  { name: 'Soft Cream', hex: '#FFFDD0' },
  { name: 'Silver Gray', hex: '#E5E7EB' }
];

export const GREEK_LETTERS = [
  'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ',
  'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π',
  'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'
];

export function generateMonogramDataUrl(options: MonogramOptions): string {
  const text = (options.text || 'EK').substring(0, 4).toUpperCase();
  const bgColor = options.bgColor || '#002B7F';
  const textColor = options.textColor || '#FFFFFF';
  const fontSize = options.fontSize || (text.length > 2 ? 65 : text.length === 2 ? 80 : 95);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgColor}" stop-opacity="1" />
        <stop offset="100%" stop-color="${bgColor}" stop-opacity="0.85" />
      </linearGradient>
    </defs>
    <rect width="200" height="200" rx="16" fill="url(#grad)" />
    <rect x="8" y="8" width="184" height="184" rx="12" fill="none" stroke="${textColor}" stroke-width="2.5" stroke-opacity="0.3" />
    <text x="50%" y="54%" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${fontSize}" font-weight="900" fill="${textColor}" text-anchor="middle" dominant-baseline="central" letter-spacing="1">
      ${text}
    </text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const CURATED_BANNER_LIBRARY = [
  {
    category: 'Collegiate & Campus Life',
    url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1400&auto=format&fit=crop&q=80',
    title: 'Historic University Campus Quad'
  },
  {
    category: 'Collegiate & Campus Life',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1400&auto=format&fit=crop&q=80',
    title: 'Student Leaders Collaborating'
  },
  {
    category: 'Collegiate & Campus Life',
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&auto=format&fit=crop&q=80',
    title: 'Excellence & Team Study'
  },
  {
    category: 'Events & Greek Life',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1400&auto=format&fit=crop&q=80',
    title: 'Yard Show & Stroll Exhibition Lights'
  },
  {
    category: 'Events & Greek Life',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1400&auto=format&fit=crop&q=80',
    title: 'Gala & Evening Celebration'
  },
  {
    category: 'Academic & Professional',
    url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1400&auto=format&fit=crop&q=80',
    title: 'Library & Graduate Research'
  },
  {
    category: 'Academic & Professional',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1400&auto=format&fit=crop&q=80',
    title: 'Business & Professional Leadership'
  },
  {
    category: 'Community & Service',
    url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1400&auto=format&fit=crop&q=80',
    title: 'Community Food Drive & Outreach'
  }
];
