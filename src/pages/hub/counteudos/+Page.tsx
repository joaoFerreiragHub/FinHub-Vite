import { useEffect } from 'react'
import { HomepageLayout } from '@/components/home/HomepageLayout'

export function Page() {
  useEffect(() => {
    window.location.replace('/hub/conteudos')
  }, [])

  return (
    <HomepageLayout>
      <section className="mx-auto max-w-4xl px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold">A redirecionar para hub/conteudos</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Este caminho foi corrigido para a rota oficial.
        </p>
        <a href="/hub/conteudos" className="mt-4 inline-block text-sm text-primary underline">
          Ir para conteudos
        </a>
      </section>
    </HomepageLayout>
  )
}
