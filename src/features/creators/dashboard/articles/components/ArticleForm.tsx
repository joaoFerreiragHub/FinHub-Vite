import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Card } from '@/shared/ui'
import { ContentCategory } from '@/features/hub/types'
import type { Article, CreateArticleDto, UpdateArticleDto } from '@/features/hub/articles/types'
import { getErrorMessage } from '@/lib/api'

const articleFormSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Máximo 200 caracteres'),
  description: z.string().min(1, 'Descrição é obrigatória').max(500, 'Máximo 500 caracteres'),
  excerpt: z.string().max(300, 'Máximo 300 caracteres').optional(),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  coverImage: z.string().url('URL inválida').optional().or(z.literal('')),
  category: z.nativeEnum(ContentCategory),
  tags: z.string().optional(), // Comma-separated
  requiredRole: z.enum(['visitor', 'free', 'premium']).optional(),
  isPremium: z.boolean().optional(),
  status: z.enum(['draft', 'published', 'scheduled']).optional(),
  scheduledFor: z.string().optional(),
  language: z.string().optional(),
})

type ArticleFormData = z.infer<typeof articleFormSchema>

export interface ArticleFormProps {
  /**
   * Artigo existente (para edição)
   */
  article?: Article
  /**
   * Callback ao submeter
   */
  onSubmit: (data: CreateArticleDto | UpdateArticleDto) => Promise<void>
  /**
   * Texto do botão submit
   */
  submitText?: string
  /**
   * Mostrar opção de salvar como rascunho
   */
  showDraftOption?: boolean
}

/**
 * Formulário de criar/editar Article
 *
 * @example
 * <ArticleForm onSubmit={handleCreate} submitText="Criar Artigo" />
 * <ArticleForm article={existingArticle} onSubmit={handleUpdate} />
 */
export function ArticleForm({
  article,
  onSubmit,
  submitText = article ? 'Atualizar' : 'Criar Artigo',
  showDraftOption = true,
}: ArticleFormProps) {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    watch,
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: article
      ? {
          title: article.title,
          description: article.description,
          excerpt: article.excerpt,
          content: article.content,
          coverImage: article.coverImage || '',
          category: article.category,
          tags: article.tags.join(', '),
          requiredRole: article.requiredRole as 'visitor' | 'free' | 'premium',
          isPremium: article.isPremium,
          status: article.status as 'draft' | 'published',
          language: article.language,
        }
      : {
          status: 'draft',
          category: ContentCategory.PERSONAL_FINANCE,
          requiredRole: 'free',
          isPremium: false,
          language: 'pt',
        },
  })

  const isPremium = watch('isPremium')

  const handleSubmit = async (data: ArticleFormData, isDraft = false) => {
    setServerError(null)
    setIsSubmitting(true)

    try {
      const payload: CreateArticleDto | UpdateArticleDto = {
        ...data,
        tags: data.tags
          ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        status: isDraft ? 'draft' : data.status,
        excerpt: data.excerpt || undefined,
        coverImage: data.coverImage || undefined,
      }

      await onSubmit(payload)

      // Navegar de volta para lista
      navigate('/creators/dashboard/artigos')
    } catch (error) {
      setServerError(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleFormSubmit((data) => handleSubmit(data, false))} className="space-y-6">
      {serverError && (
        <Card variant="outlined" padding="default" className="border-red-500 bg-red-50">
          <p className="text-sm text-red-800">
            <strong>Erro:</strong> {serverError}
          </p>
        </Card>
      )}

      {/* Título */}
      <Input
        label="Título"
        placeholder="Ex: Como Poupar 1000€ em 6 Meses"
        error={errors.title?.message}
        {...register('title')}
      />

      {/* Descrição */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Descrição (SEO)</label>
        <textarea
          rows={3}
          placeholder="Resumo curto que aparece nos resultados de busca..."
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Resumo (opcional)</label>
        <textarea
          rows={2}
          placeholder="Resumo que aparece no card do artigo..."
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
          {...register('excerpt')}
        />
        {errors.excerpt && (
          <p className="text-sm text-red-600">{errors.excerpt.message}</p>
        )}
      </div>

      {/* Conteúdo */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Conteúdo *</label>
        <textarea
          rows={15}
          placeholder="Escreva o conteúdo do artigo em Markdown ou HTML..."
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 font-mono text-sm"
          {...register('content')}
        />
        {errors.content && (
          <p className="text-sm text-red-600">{errors.content.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Suporta Markdown e HTML. Usa Markdown para formatação simples.
        </p>
      </div>

      {/* Cover Image */}
      <Input
        label="Imagem de Capa (URL)"
        type="url"
        placeholder="https://exemplo.com/imagem.jpg"
        error={errors.coverImage?.message}
        {...register('coverImage')}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Categoria */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Categoria *</label>
          <select
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
            {...register('category')}
          >
            <option value={ContentCategory.PERSONAL_FINANCE}>Finanças Pessoais</option>
            <option value={ContentCategory.BUDGETING}>Orçamento</option>
            <option value={ContentCategory.SAVING}>Poupança</option>
            <option value={ContentCategory.DEBT}>Dívidas</option>
            <option value={ContentCategory.STOCKS}>Ações</option>
            <option value={ContentCategory.CRYPTO}>Crypto</option>
            <option value={ContentCategory.REAL_ESTATE}>Imobiliário</option>
            <option value={ContentCategory.FUNDS}>Fundos</option>
            <option value={ContentCategory.BASICS}>Básico</option>
            <option value={ContentCategory.ADVANCED}>Avançado</option>
            <option value={ContentCategory.TRENDS}>Tendências</option>
          </select>
        </div>

        {/* Tags */}
        <Input
          label="Tags (separadas por vírgula)"
          placeholder="poupança, investimento, dicas"
          helperText="Ex: poupança, dicas, iniciantes"
          {...register('tags')}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Required Role */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Nível de Acesso</label>
          <select
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
            {...register('requiredRole')}
          >
            <option value="visitor">Visitante (Todos)</option>
            <option value="free">Gratuito (Conta necessária)</option>
            <option value="premium">Premium (Assinantes)</option>
          </select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Estado</label>
          <select
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
            {...register('status')}
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
            <option value="scheduled">Agendado</option>
          </select>
        </div>
      </div>

      {/* Premium checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPremium"
          className="h-4 w-4 rounded border-gray-300"
          {...register('isPremium')}
        />
        <label htmlFor="isPremium" className="text-sm font-medium">
          ⭐ Marcar como conteúdo Premium
        </label>
      </div>

      {isPremium && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          Este artigo será visível apenas para assinantes Premium
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" variant="default" size="lg" isLoading={isSubmitting}>
          {submitText}
        </Button>

        {showDraftOption && !article && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleFormSubmit((data) => handleSubmit(data, true))}
            disabled={isSubmitting}
          >
            Guardar Rascunho
          </Button>
        )}

        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={() => navigate('/creators/dashboard/artigos')}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
