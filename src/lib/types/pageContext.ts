import type { PageContextBuiltInClientWithClientRouting } from 'vite-plugin-ssr/types'
import type { ReactNode } from 'react'
import type { User } from '@/features/auth/types'

import type { PageContextServer } from 'vite-plugin-ssr/types'

export type PageContextWithUsernameClient = PageContextBuiltInClientWithClientRouting & {
  routeParams: { username: string }
}

export type PageContextWithUsernameServer = PageContextServer & {
  routeParams: { username: string }
}

export type PageProps = Record<string, unknown>
export type Page = (props: PageProps) => ReactNode

// ✅ Custom page context usado no lado do cliente
export type PageContext = PageContextBuiltInClientWithClientRouting & {
  routeParams: { username: string }
  Page: Page
  pageProps?: PageProps
  theme?: 'light' | 'dark'
  user?: User
}
