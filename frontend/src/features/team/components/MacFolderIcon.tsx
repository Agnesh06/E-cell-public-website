export function MacFolderIcon({ className = 'w-20 h-16' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className={`${className} drop-shadow-[0_6px_10px_rgba(0,80,200,0.22)] select-none shrink-0 transition-transform duration-200 group-hover:scale-105`}
      aria-hidden="true"
    >
      <defs>
        {/* Back plate gradient */}
        <linearGradient id="macFolderBack" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2A82E4" />
          <stop offset="100%" stopColor="#1460BA" />
        </linearGradient>

        {/* Front pocket gradient */}
        <linearGradient id="macFolderFront" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#68C5FA" />
          <stop offset="25%" stopColor="#3DA4F7" />
          <stop offset="100%" stopColor="#0B6BD9" />
        </linearGradient>

        {/* Front highlight gradient */}
        <linearGradient id="macFolderHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.65)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        {/* Inner pocket shadow */}
        <linearGradient id="macFolderInnerShadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,35,90,0.3)" />
          <stop offset="100%" stopColor="rgba(0,35,90,0)" />
        </linearGradient>
      </defs>

      {/* Back Plate with Tab */}
      <path
        d="M 6 16
           C 6 11, 10 7, 15 7
           L 36 7
           C 41 7, 44 10, 47 13
           L 51 17
           C 53 19, 56 20, 60 20
           L 86 20
           C 92 20, 96 24, 96 30
           L 96 66
           C 96 72, 92 76, 86 76
           L 14 76
           C 8 76, 4 72, 4 66
           L 4 22
           C 4 18, 5 16, 6 16 Z"
        fill="url(#macFolderBack)"
      />

      {/* Subtle tab line highlight */}
      <path
        d="M 15 8 L 36 8 C 40 8, 43 11, 46 14 L 50 18 C 52 20, 55 21, 59 21 L 86 21"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />

      {/* Inner shadow just above front flap */}
      <rect x="6" y="24" width="88" height="8" rx="3" fill="url(#macFolderInnerShadow)" />

      {/* Front Flap / Pocket */}
      <rect
        x="4"
        y="26"
        width="92"
        height="48"
        rx="8"
        fill="url(#macFolderFront)"
      />

      {/* Front Flap Top Rim Highlight */}
      <path
        d="M 5 34 C 5 29.5, 8.5 26.5, 13 26.5 L 87 26.5 C 91.5 26.5, 95 29.5, 95 34"
        stroke="url(#macFolderHighlight)"
        strokeWidth="1.2"
        fill="none"
      />

      {/* Front Flap Subtle Bottom Rim Shadow */}
      <rect
        x="4"
        y="73"
        width="92"
        height="1"
        fill="rgba(0,25,80,0.25)"
      />
    </svg>
  );
}
