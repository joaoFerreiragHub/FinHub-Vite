import { redirect, LoaderFunctionArgs } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'

/**
 * Require user to be authenticated
 * Redirects to login if not authenticated
 */
export function requireAuth({ request }: LoaderFunctionArgs) {
  const { isAuthenticated } = useAuthStore.getState()

  if (!isAuthenticated) {
    const url = new URL(request.url)
    const redirectTo = url.pathname + url.search
    return redirect(`/login?redirect=${encodeURIComponent(redirectTo)}`)
  }

  return null
}

/**
 * Require user to be a Creator or Admin
 * Redirects to home if not authorized
 */
export function requireCreator() {
  const { isAuthenticated, user } = useAuthStore.getState()

  if (!isAuthenticated) {
    return redirect('/login')
  }

  const allowedRoles = ['creator', 'admin']
  if (!allowedRoles.includes(user?.role || '')) {
    return redirect('/')
  }

  return null
}

/**
 * Require user to be an Admin
 * Redirects to home if not authorized
 */
export function requireAdmin() {
  const { isAuthenticated, user } = useAuthStore.getState()

  if (!isAuthenticated) {
    return redirect('/login')
  }

  if (user?.role !== 'admin') {
    return redirect('/')
  }

  return null
}

/**
 * Require user to have Premium access (premium, creator, or admin)
 * Redirects to upgrade page if not authorized
 */
export function requirePremium() {
  const { isAuthenticated, user } = useAuthStore.getState()

  if (!isAuthenticated) {
    return redirect('/login')
  }

  const allowedRoles = ['premium', 'creator', 'admin']
  if (!allowedRoles.includes(user?.role || '')) {
    return redirect('/upgrade')
  }

  return null
}

/**
 * Redirect authenticated users away from auth pages
 * (e.g., if already logged in, redirect from /login to home)
 */
export function redirectIfAuthenticated() {
  const { isAuthenticated } = useAuthStore.getState()

  if (isAuthenticated) {
    return redirect('/')
  }

  return null
}
