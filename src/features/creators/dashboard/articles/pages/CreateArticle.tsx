import { DashboardLayout } from '@/shared/layouts'
import { ArticleForm } from '../components/ArticleForm'
import { useCreateArticle } from '@/features/hub/articles/hooks/useArticles'
import { Card } from '@/shared/ui'
import type { CreateArticleDto } from '@/features/hub/articles/types'

/**
 * Página de criação de artigo
 */
export function CreateArticle() {
  const createArticle = useCreateArticle()

  const handleSubmit = async (data: CreateArticleDto) => {
    await createArticle.mutateAsync(data)
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Criar Novo Artigo</h1>
          <p className="mt-1 text-muted-foreground">
            Partilha o teu conhecimento sobre finanças pessoais e investimentos
          </p>
        </div>

        {/* Form */}
        <Card padding="lg">
          <ArticleForm onSubmit={handleSubmit} submitText="Publicar Artigo" />
        </Card>

        {/* Tips */}
        <Card padding="default" variant="ghost">
          <h3 className="mb-2 font-semibold">💡 Dicas para um bom artigo</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>✅ Usa um título claro e descritivo</li>
            <li>✅ Estrutura o conteúdo com headings (# ## ###)</li>
            <li>✅ Adiciona exemplos práticos</li>
            <li>✅ Usa listas para facilitar leitura</li>
            <li>✅ Inclui uma imagem de capa atrativa</li>
            <li>✅ Revê ortografia e gramática</li>
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  )
}
