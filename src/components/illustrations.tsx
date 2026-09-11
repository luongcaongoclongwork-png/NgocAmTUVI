// Vector "ink-wash" illustrations standing in for photography until real
// photography is supplied. Kept deliberately restrained: layered silhouettes,
// brand palette only, no literal deities / dragons / mystical iconography.

export function HeroMountainScape() {
  return (
    <svg
      viewBox="0 0 1440 900"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="heroSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8d7b9" />
          <stop offset="55%" stopColor="#d7c19c" />
          <stop offset="100%" stopColor="#c3ab7d" />
        </linearGradient>
        <linearGradient id="ridgeFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a98f68" />
          <stop offset="100%" stopColor="#8f7452" />
        </linearGradient>
        <linearGradient id="ridgeMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c6446" />
          <stop offset="100%" stopColor="#63502f" />
        </linearGradient>
        <linearGradient id="ridgeNear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a3a25" />
          <stop offset="100%" stopColor="#3e2b1e" />
        </linearGradient>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f4ebdd" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#f4ebdd" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1440" height="900" fill="url(#heroSky)" />

      {/* sun */}
      <circle cx="1080" cy="220" r="140" fill="url(#sunGlow)" />
      <circle cx="1080" cy="220" r="58" fill="#af8a50" opacity="0.55" />

      {/* mist bands */}
      <rect x="0" y="360" width="1440" height="46" fill="#f4ebdd" opacity="0.35" />
      <rect x="0" y="520" width="1440" height="30" fill="#f4ebdd" opacity="0.3" />

      {/* far ridge */}
      <path
        d="M0,430 L120,370 260,410 400,340 560,400 720,330 900,400 1080,350 1260,400 1440,360 L1440,900 L0,900 Z"
        fill="url(#ridgeFar)"
        opacity="0.55"
      />

      {/* mid ridge */}
      <path
        d="M0,540 L160,470 320,520 520,430 700,510 900,450 1100,520 1260,470 1440,510 L1440,900 L0,900 Z"
        fill="url(#ridgeMid)"
        opacity="0.75"
      />

      {/* pine, left */}
      <g opacity="0.9">
        <line x1="150" y1="760" x2="150" y2="640" stroke="#3e2b1e" strokeWidth="4" />
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M150,${660 + i * 28} l-46,30 h92 z`}
            fill="#3e2b1e"
          />
        ))}
      </g>

      {/* pavilion silhouette */}
      <g opacity="0.92">
        <path d="M1150,700 L1230,650 L1310,700 Z" fill="#3e2b1e" />
        <rect x="1160" y="700" width="140" height="10" fill="#3e2b1e" />
        <rect x="1180" y="710" width="14" height="60" fill="#3e2b1e" />
        <rect x="1266" y="710" width="14" height="60" fill="#3e2b1e" />
      </g>

      {/* near ridge */}
      <path
        d="M0,700 L200,640 420,690 640,610 860,680 1040,630 1220,690 1440,650 L1440,900 L0,900 Z"
        fill="url(#ridgeNear)"
      />

      {/* water line */}
      <rect x="0" y="780" width="1440" height="120" fill="#3e2b1e" opacity="0.08" />
      <line x1="0" y1="800" x2="1440" y2="800" stroke="#f4ebdd" strokeOpacity="0.18" strokeWidth="1" />
      <line x1="0" y1="822" x2="1440" y2="822" stroke="#f4ebdd" strokeOpacity="0.12" strokeWidth="1" />
    </svg>
  );
}

export function StudyDeskScene({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 460" className={className} aria-hidden="true">
      <rect width="600" height="460" fill="#e8d7b9" />
      <rect x="0" y="330" width="600" height="130" fill="#795a3a" opacity="0.35" />
      {/* desk */}
      <rect x="60" y="330" width="480" height="16" fill="#3e2b1e" />
      <rect x="90" y="346" width="18" height="90" fill="#3e2b1e" />
      <rect x="492" y="346" width="18" height="90" fill="#3e2b1e" />
      {/* scroll / chart */}
      <rect x="150" y="230" width="220" height="90" rx="2" fill="#f4ebdd" stroke="#af8a50" strokeWidth="1.5" />
      <g stroke="#795a3a" strokeWidth="1">
        <line x1="150" y1="260" x2="370" y2="260" />
        <line x1="150" y1="290" x2="370" y2="290" />
        <line x1="223" y1="230" x2="223" y2="320" />
        <line x1="297" y1="230" x2="297" y2="320" />
      </g>
      {/* ink stone + brush */}
      <ellipse cx="420" cy="310" rx="34" ry="12" fill="#25211b" opacity="0.85" />
      <line x1="440" y1="300" x2="470" y2="250" stroke="#3e2b1e" strokeWidth="5" strokeLinecap="round" />
      <circle cx="472" cy="246" r="7" fill="#25211b" />
      {/* books */}
      <rect x="150" y="190" width="120" height="14" fill="#3e2b1e" />
      <rect x="160" y="176" width="100" height="14" fill="#80633e" />
      <rect x="150" y="162" width="115" height="14" fill="#af8a50" opacity="0.8" />
      {/* window light */}
      <rect x="0" y="0" width="600" height="330" fill="#f4ebdd" opacity="0.08" />
    </svg>
  );
}

export function CourtyardScene({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 460" className={className} aria-hidden="true">
      <rect width="600" height="460" fill="#d7c19c" />
      {/* distant mountain */}
      <path d="M0,190 L120,120 240,180 360,110 480,175 600,140 600,230 0,230 Z" fill="#8f7452" opacity="0.6" />
      {/* roofline */}
      <path d="M60,260 L300,190 540,260 L500,260 300,205 100,260 Z" fill="#3e2b1e" />
      <rect x="150" y="260" width="300" height="12" fill="#3e2b1e" />
      <rect x="180" y="272" width="16" height="80" fill="#3e2b1e" />
      <rect x="404" y="272" width="16" height="80" fill="#3e2b1e" />
      {/* courtyard stones */}
      <rect x="0" y="352" width="600" height="108" fill="#795a3a" opacity="0.3" />
      <circle cx="150" cy="400" r="26" fill="#63502f" opacity="0.5" />
      <circle cx="230" cy="420" r="16" fill="#63502f" opacity="0.4" />
      <circle cx="420" cy="405" r="30" fill="#63502f" opacity="0.5" />
      {/* water basin */}
      <ellipse cx="300" cy="415" rx="70" ry="16" fill="#25211b" opacity="0.12" />
      <ellipse cx="300" cy="415" rx="70" ry="16" fill="none" stroke="#af8a50" strokeWidth="1.5" />
    </svg>
  );
}

export function StillLifeStone({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
      <rect width="400" height="400" fill="#25211b" />
      <ellipse cx="200" cy="300" rx="150" ry="18" fill="#3e2b1e" />
      <path
        d="M120,300 C110,230 150,190 200,190 C250,190 290,230 280,300 Z"
        fill="#7a8068"
        opacity="0.85"
      />
      <ellipse cx="200" cy="230" rx="42" ry="16" fill="#f4ebdd" opacity="0.15" />
      <circle cx="200" cy="150" r="3" fill="#af8a50" />
      <line x1="200" y1="153" x2="200" y2="190" stroke="#af8a50" strokeWidth="1" />
    </svg>
  );
}

export function BaguaMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      <circle cx="40" cy="40" r="38" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="40" cy="40" r="10" fill="currentColor" opacity="0.15" />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x1 = 40 + Math.cos(angle) * 26;
        const y1 = 40 + Math.sin(angle) * 26;
        const x2 = 40 + Math.cos(angle) * 36;
        const y2 = 40 + Math.sin(angle) * 36;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />
        );
      })}
    </svg>
  );
}
