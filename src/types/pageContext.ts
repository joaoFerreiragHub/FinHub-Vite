// src/types/pageContext.ts
import type { PageContextBuiltInClientWithClientRouting } from 'vite-plugin-ssr/types'
import type { ReactNode } from 'react'
import type { User } from '../stores/useUserStore'

export type PageProps = Record<string, unknown>
export type Page = (props: PageProps) => ReactNode

export type PageContext = PageContextBuiltInClientWithClientRouting & {
  Page: Page
  pageProps?: PageProps
  theme?: 'light' | 'dark'
  user?: User // importante para o SSR saber quem está logado
}
