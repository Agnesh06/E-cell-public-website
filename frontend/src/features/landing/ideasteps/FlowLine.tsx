import React from 'react'
import { FLOW_PATH } from '@/data/flowPath'

export interface FlowLineProps {
  drawnPathRef?: React.Ref<SVGPathElement>
  className?: string
}

export const FlowLine: React.FC<FlowLineProps> = ({
  drawnPathRef,
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
        <mask id="flow-stroke-mask">
          <path
            ref={drawnPathRef}
            d={FLOW_PATH}
            stroke="white"
            strokeWidth="13"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={{
              strokeDasharray: '3600 8000',
              strokeDashoffset: '3600',
            }}
          />
        </mask>

        {/* SVG paths retained in DOM for tests/measurement while Three.js renders the unified WebGL trail */}
        <path
          d={FLOW_PATH}
          stroke="var(--color-blue)"
          strokeWidth="13"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          mask="url(#flow-stroke-mask)"
          className="opacity-0"
        />

        {/* White dashed centre line retained in DOM */}
        <path
          d={FLOW_PATH}
          stroke="rgba(255, 255, 255, 0.9)"
          strokeWidth="2"
          strokeDasharray="14 12"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          mask="url(#flow-stroke-mask)"
          className="opacity-0"
        />
      </svg>
    </div>
  )
}

export default FlowLine


