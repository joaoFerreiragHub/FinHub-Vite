import React, { type ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import type { AuthState } from '@/features/auth/types'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRoute?: string
  authState?: Partial<AuthState>
}

export function renderWithProviders(ui: ReactElement, options: CustomRenderOptions = {}) {
  const { initialRoute = '/', authState, ...renderOptions } = options

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  // Set auth state if provided
  if (authState) {
    useAuthStore.setState({
      ...useAuthStore.getState(),
      ...authState,
      hydrated: true,
    })
  }

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialRoute]}>{children}</MemoryRouter>
      </QueryClientProvider>
    )
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  }
}
