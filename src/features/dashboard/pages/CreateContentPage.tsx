import { Card } from '@/components/ui'
import { Link } from 'react-router-dom'
import { ArticleForm } from '@/features/creators/dashboard/articles/components/ArticleForm'
import { useCreateArticle } from '@/features/hub/articles/hooks/useArticles'
import type { CreateArticleDto } from '@/features/hub/articles/types'

export default function CreateContentPage() {
  const createArticle = useCreateArticle()

  const handleSubmit = async (data: CreateArticleDto) => {
    await createArticle.mutateAsync(data)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Criar artigo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Publica conhecimento financeiro para a tua audiencia.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Preferes formato audiovisual?{' '}
          <Link to="/dashboard/criar/video" className="text-primary underline underline-offset-2">
            Criar video
          </Link>
          .
        </p>
      </header>

      <Card className="p-6 sm:p-8">
        <ArticleForm
          onSubmit={handleSubmit}
          submitText="Publicar artigo"
          redirectTo="/dashboard/conteudo"
        />
      </Card>

      <Card className="border-dashed bg-muted/30 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide">Checklist rapido</h2>
        <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
          <li>Titulo claro e objetivo.</li>
          <li>Descricao curta para SEO.</li>
          <li>Estrutura do texto em secoes com headings.</li>
          <li>Call to action no fim para engagement.</li>
        </ul>
      </Card>
    </div>
  )
}
