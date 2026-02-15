import { cn } from '@/lib/utils/cn'

describe('cn utility', () => {
  it('merges simple class strings', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })

  it('handles conditional classes', () => {
    const isActive = true
    const isInactive = false
    expect(cn('px-4', isActive && 'bg-blue-500')).toBe('px-4 bg-blue-500')
    expect(cn('px-4', isInactive && 'bg-blue-500')).toBe('px-4')
  })

  it('deduplicates conflicting Tailwind classes', () => {
    expect(cn('px-4', 'px-8')).toBe('px-8')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('handles undefined and null values', () => {
    expect(cn('px-4', undefined, null, 'py-2')).toBe('px-4 py-2')
  })

  it('handles empty string', () => {
    expect(cn('')).toBe('')
  })

  it('handles arrays of classes', () => {
    expect(cn(['px-4', 'py-2'])).toBe('px-4 py-2')
  })

  it('handles objects for conditional classes', () => {
    expect(cn({ 'bg-blue-500': true, 'bg-red-500': false })).toBe('bg-blue-500')
  })

  it('handles no arguments', () => {
    expect(cn()).toBe('')
  })
})
