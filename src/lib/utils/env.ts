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
    if (typeof import.meta !== 'undefined' && import.meta.env) {
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
