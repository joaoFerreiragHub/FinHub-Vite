import { useEffect } from 'react'
import { HomepageLayout } from '@/components/home/HomepageLayout'

export const passToClient = ['pageProps']

export function Page() {
  useEffect(() => {
    window.location.replace('/hub/conteudos/artigos')
  }, [])

  return (
    <HomepageLayout>
      <section className="mx-auto max-w-4xl px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold">A redirecionar para conteudos/artigos</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Se nao fores redirecionado automaticamente, usa o link abaixo.
        </p>
        <a
          href="/hub/conteudos/artigos"
          className="mt-4 inline-block text-sm text-primary underline"
        >
          Ir para artigos
        </a>
      </section>
    </HomepageLayout>
  )
}
