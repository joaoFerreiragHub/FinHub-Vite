import { Helmet } from '@/lib/helmet'

interface JsonLdProps {
  schema: Record<string, unknown> | null | undefined
}

export function JsonLd({ schema }: JsonLdProps) {
  if (!schema || Object.keys(schema).length === 0) {
    return null
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema, null, 0)}</script>
    </Helmet>
  )
}

export default JsonLd
