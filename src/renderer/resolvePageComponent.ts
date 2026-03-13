import type { ReactNode } from 'react'

type ResolvedPageComponent = (props: Record<string, unknown>) => ReactNode

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isRenderablePageComponent = (value: unknown): value is ResolvedPageComponent =>
  typeof value === 'function'

const readPageFromObject = (value: Record<string, unknown>): ResolvedPageComponent | null => {
  if (isRenderablePageComponent(value.Page)) return value.Page

  if (isRecord(value.default)) {
    const defaultExport = value.default
    if (isRenderablePageComponent(defaultExport.Page)) return defaultExport.Page
  }

  if (isRenderablePageComponent(value.default)) return value.default

  return null
}

export const resolvePageComponent = (rawPage: unknown): ResolvedPageComponent => {
  if (isRenderablePageComponent(rawPage)) return rawPage

  if (isRecord(rawPage)) {
    const nestedPage = readPageFromObject(rawPage)
    if (nestedPage) return nestedPage
  }

  throw new Error(
    'Page component invalido no runtime SSR/client. Esperava funcao ou objeto com campo Page.'
  )
}
