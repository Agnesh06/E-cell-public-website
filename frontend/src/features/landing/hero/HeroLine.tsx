import { FLOW_PATH } from '@/data/flowPath'

export function HeroLine() {
  return (
    <div
      className="hero-line-container absolute inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      <svg
        className="hero-line-svg absolute right-[-20%] sm:right-[-10%] md:right-[-5%] lg:right-0 top-[28%] sm:top-[20%] md:top-[12%] lg:top-0 w-[115%] sm:w-[100%] md:w-[85%] lg:w-[68%] h-[68%] sm:h-[78%] md:h-[88%] lg:h-full opacity-65 md:opacity-85"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="hero-line-ghost"
          d={FLOW_PATH}
          stroke="var(--color-blue-ghost)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          className="hero-line-drawn"
          d={FLOW_PATH}
          stroke="var(--color-blue)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}

export default HeroLine

