import React from 'react';

export const FLOW_PATH =
  'M 1440 120 C 1200 80 980 180 820 280 C 640 390 540 520 380 500 C 240 480 160 360 220 260 C 280 160 480 180 620 240 C 820 320 1020 420 1200 460 C 1360 495 1440 470 1440 470';

export function HeroLine() {
  return (
    <div className="hero-line-container absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      <svg
        className="hero-line-svg absolute right-[-10%] lg:right-0 top-[15%] lg:top-0 w-[100%] lg:w-[68%] h-[80%] lg:h-full opacity-65 md:opacity-85"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="hero-line-ghost opacity-30"
          d={FLOW_PATH}
          stroke="#EDEFFC"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

export default HeroLine;
