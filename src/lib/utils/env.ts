/**
 * Environment detection utilities
 * Safe for both build-time and runtime
 */

export function isDevelopment(): boolean {
  // Check multiple sources to be sure
  if (typeof window === 'undefined') {
    // SSR/Node environment
    return process.env.NODE_ENV !== 'production'
  }

  // Browser environment
  try {
    // @ts-expect-error - import.meta may not be available
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-expect-error - DEV may not exist
      return import.meta.env.DEV === true || import.meta.env.MODE === 'development'
    }
  } catch {
    // import.meta not available
  }

  // Fallback: check hostname
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
}

export function isProduction(): boolean {
  return !isDevelopment()
}
