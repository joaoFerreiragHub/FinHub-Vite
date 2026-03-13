import { authService } from '@/features/auth/services/authService'
import { apiClient } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('uses GET with token query to verify email', async () => {
    mockedApiClient.get.mockResolvedValue({ data: {} })

    await authService.verifyEmail('verification-token')

    expect(mockedApiClient.get).toHaveBeenCalledWith('/auth/verify-email', {
      params: {
        token: 'verification-token',
      },
    })
  })

  it('posts forgot-password payload', async () => {
    mockedApiClient.post.mockResolvedValue({ data: {} })

    await authService.forgotPassword('user@example.com')

    expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/forgot-password', {
      email: 'user@example.com',
    })
  })

  it('posts reset-password payload', async () => {
    mockedApiClient.post.mockResolvedValue({ data: {} })

    await authService.resetPassword('reset-token', 'StrongPass123')

    expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/reset-password', {
      token: 'reset-token',
      newPassword: 'StrongPass123',
    })
  })

  it('posts resend-verification without payload', async () => {
    mockedApiClient.post.mockResolvedValue({ data: { message: 'ok' } })

    const response = await authService.resendVerification()

    expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/resend-verification')
    expect(response).toEqual({ message: 'ok' })
  })
})
