import React from 'react'

export type GlowBlobCorner = 'bottom-left' | 'top-right' | 'bottom-right' | 'top-left'

export interface GlowBlobProps {
  corner?: GlowBlobCorner
  className?: string
  style?: React.CSSProperties
}

const cornerClasses: Record<GlowBlobCorner, string> = {
  'bottom-left': 'left-[-10vw] bottom-[-10vh]',
  'top-right': 'right-[-10vw] top-[-10vh]',
  'bottom-right': 'right-[-10vw] bottom-[-10vh]',
  'top-left': 'left-[-10vw] top-[-10vh]',
}

export const GlowBlob = React.forwardRef<HTMLDivElement, GlowBlobProps>(
  ({ corner = 'bottom-left', className = '', style }, ref) => {
    return (
      <div
        ref={ref}
        className={`absolute w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] rounded-full pointer-events-none select-none z-0 blur-[90px] md:blur-[120px] opacity-70 ${cornerClasses[corner]} ${className}`}
        style={{
          background:
            'radial-gradient(circle, var(--color-blue-ghost) 0%, rgba(230, 235, 255, 0.4) 45%, transparent 70%)',
          ...style,
        }}
        aria-hidden="true"
      />
    )
  },
)

GlowBlob.displayName = 'GlowBlob'

export default GlowBlob

