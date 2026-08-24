// Default collegiate crest emblem for BlackOrgConnectionz

export const DEFAULT_APP_LOGO_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e2330" />
      <stop offset="50%" stop-color="#0e1017" />
      <stop offset="100%" stop-color="#050608" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF2A3" />
      <stop offset="50%" stop-color="#D4AF37" />
      <stop offset="100%" stop-color="#9A7B1C" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#D4AF37" flood-opacity="0.4" />
    </filter>
  </defs>

  <!-- Outer Shield Frame -->
  <path d="M 100 12 C 145 12 182 22 182 22 C 182 108 148 162 100 188 C 52 162 18 108 18 22 C 18 22 55 12 100 12 Z" 
        fill="url(#shieldGrad)" 
        stroke="url(#goldGrad)" 
        stroke-width="5" 
        stroke-linejoin="round" />

  <!-- Inner Inset Shield -->
  <path d="M 100 24 C 138 24 168 32 168 32 C 168 102 138 148 100 172 C 62 148 32 102 32 32 C 32 32 62 24 100 24 Z" 
        fill="none" 
        stroke="url(#goldGrad)" 
        stroke-width="1.5" 
        stroke-dasharray="4,2" 
        opacity="0.6" />

  <!-- Torch of Wisdom / Leadership Motif -->
  <!-- Torch Flame -->
  <path d="M 100 42 C 92 56 86 64 88 74 C 90 84 96 88 100 90 C 104 88 110 84 112 74 C 114 64 108 56 100 42 Z" 
        fill="url(#goldGrad)" 
        filter="url(#glow)" />
  <path d="M 100 52 C 96 60 93 66 94 72 C 95 78 98 81 100 82 C 102 81 105 78 106 72 C 107 66 104 60 100 52 Z" 
        fill="#FFF9D2" />

  <!-- Torch Bowl & Handle -->
  <path d="M 85 88 L 115 88 L 110 102 L 90 102 Z" fill="url(#goldGrad)" />
  <path d="M 94 102 L 106 102 L 103 148 L 97 148 Z" fill="url(#goldGrad)" />
  <rect x="91" y="148" width="18" height="6" rx="3" fill="url(#goldGrad)" />

  <!-- Collegiate Laurel Wreath -->
  <!-- Left Laurel -->
  <path d="M 68 82 C 60 92 58 112 68 128 C 74 138 84 146 92 152" 
        fill="none" 
        stroke="url(#goldGrad)" 
        stroke-width="2.5" 
        stroke-linecap="round" />
  <circle cx="58" cy="94" r="3.5" fill="url(#goldGrad)" />
  <circle cx="58" cy="112" r="3.5" fill="url(#goldGrad)" />
  <circle cx="68" cy="130" r="3.5" fill="url(#goldGrad)" />

  <!-- Right Laurel -->
  <path d="M 132 82 C 140 92 142 112 132 128 C 126 138 116 146 108 152" 
        fill="none" 
        stroke="url(#goldGrad)" 
        stroke-width="2.5" 
        stroke-linecap="round" />
  <circle cx="142" cy="94" r="3.5" fill="url(#goldGrad)" />
  <circle cx="142" cy="112" r="3.5" fill="url(#goldGrad)" />
  <circle cx="132" cy="130" r="3.5" fill="url(#goldGrad)" />

  <!-- 3 Stars of Excellence (Brotherhood/Sisterhood, Scholarship, Service) -->
  <polygon points="100,28 102,34 108,34 103,38 105,44 100,40 95,44 97,38 92,34 98,34" fill="#FFF2A3" />
  <polygon points="76,38 77.5,42.5 82,42.5 78.5,45.5 80,50 76,47 72,50 73.5,45.5 70,42.5 74.5,42.5" fill="#D4AF37" opacity="0.8" />
  <polygon points="124,38 125.5,42.5 130,42.5 126.5,45.5 128,50 124,47 120,50 121.5,45.5 118,42.5 122.5,42.5" fill="#D4AF37" opacity="0.8" />
</svg>
`)}`;
