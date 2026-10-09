import { createContext, useContext, useSyncExternalStore } from 'react'
import type Lenis from 'lenis'

export interface SmoothScrollContextType {
  lenis: Lenis | null
}

export const SmoothScrollContext = createContext<SmoothScrollContextType>({ lenis: null })

let globalLenis: Lenis | null = null
const listeners = new Set<() => void>()

export function setGlobalLenis(instance: Lenis | null) {
  globalLenis = instance
  listeners.forEach((listener) => listener())
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => {
    listeners.delete(callback)
  }
}

function getSnapshot() {
  return globalLenis
}

export function useLenis(): Lenis | null {
  const context = useContext(SmoothScrollContext)
  const storeLenis = useSyncExternalStore(subscribe, getSnapshot, () => null)
  return context.lenis ?? storeLenis
}

