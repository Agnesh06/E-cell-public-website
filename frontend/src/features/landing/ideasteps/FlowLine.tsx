import React from 'react'
import { FLOW_PATH } from '@/data/flowPath'

export interface FlowLineProps {
  drawnPathRef?: React.Ref<SVGPathElement>
  ghostPathRef?: React.Ref<SVGPathElement>
  className?: string
}

export const FlowLine: React.FC<FlowLineProps> = ({
  drawnPathRef,
  ghostPathRef,
  className = '',
}) => {
  return (
    <div
      className={`flow-line-container absolute inset-0 pointer-events-none overflow-hidden z-0 select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        className="flow-line-svg w-full h-full"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMin slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ghost path: always visible in blue-ghost */}
        <path
          ref={ghostPathRef}
          d={FLOW_PATH}
          stroke="var(--color-blue-ghost)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="opacity-75"
        />

        {/* Drawn path: revealed dynamically by strokeDashoffset */}
        <path
          ref={drawnPathRef}
          d={FLOW_PATH}
          stroke="var(--color-blue)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}

export default FlowLine

