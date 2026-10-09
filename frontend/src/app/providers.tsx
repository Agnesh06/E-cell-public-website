import type { ReactNode } from 'react'
import { SmoothScrollProvider } from './SmoothScrollProvider'

type ProvidersProps = {
  children: ReactNode
}

function Providers({ children }: ProvidersProps) {
  return <SmoothScrollProvider>{children}</SmoothScrollProvider>
}

export default Providers
