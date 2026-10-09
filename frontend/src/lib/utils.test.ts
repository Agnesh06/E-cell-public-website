import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('merges conflicting Tailwind classes', () => {
    expect(cn('px-2 text-blue-500', 'px-4 text-red-500')).toBe(
      'px-4 text-red-500',
    )
  })
})
