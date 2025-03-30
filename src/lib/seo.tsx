// src/lib/SEO.tsx
import { Helmet } from 'react-helmet-async'

type Props = {
  title: string
  description?: string
}

export function SEO({ title, description }: Props) {
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
    </Helmet>
  )
}
