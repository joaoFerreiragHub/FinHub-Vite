import { getErrorMessage } from '@/lib/api/client'

const DEV_MOCK_AUTH_401_MESSAGE =
  'Sessao DEV mock sem refresh automatico. Inicia sessao real para validar rotas admin protegidas.'

describe('apiClient getErrorMessage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns guidance message for 401 when session uses dev mock tokens', () => {
    localStorage.setItem(
      'auth-storage',
      JSON.stringify({
        state: {
          accessToken: 'dev-admin-access-token',
          refreshToken: 'dev-admin-refresh-token',
        },
      }),
    )

    const axios401Error = {
      isAxiosError: true,
      response: { status: 401, data: { message: 'Unauthorized' } },
      message: 'Request failed with status code 401',
    }

    expect(getErrorMessage(axios401Error)).toBe(DEV_MOCK_AUTH_401_MESSAGE)
  })

  it('keeps backend payload message for non-dev sessions', () => {
    localStorage.setItem(
      'auth-storage',
      JSON.stringify({
        state: {
          accessToken: 'real-access-token',
          refreshToken: 'real-refresh-token',
        },
      }),
    )

    const axios401Error = {
      isAxiosError: true,
      response: { status: 401, data: { message: 'Token expirado' } },
      message: 'Request failed with status code 401',
    }

    expect(getErrorMessage(axios401Error)).toBe('Token expirado')
  })

  it('maps refresh unsupported error to the same guidance message', () => {
    expect(getErrorMessage(new Error('Dev mock token does not support refresh'))).toBe(
      DEV_MOCK_AUTH_401_MESSAGE,
    )
  })
})
