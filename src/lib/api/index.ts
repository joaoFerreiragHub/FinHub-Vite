/**
 * API Layer
 *
 * Cliente HTTP configurado com interceptors e helpers
 */

export {
  apiClient,
  getErrorMessage,
  isNetworkError,
  isAuthError,
  isPermissionError,
} from './client'
