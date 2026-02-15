import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Card, Label } from '@/components/ui'
import { ContentCategory } from '@/features/hub/types'
import type { Article, CreateArticleDto, UpdateArticleDto } from '@/features/hub/articles/types'
import { getErrorMessage } from '@/lib/api/client'

const articleFormSchema = z.object({
  title: z.string().min(1, 'Titulo e obrigatorio').max(200, 'Maximo 200 caracteres'),
  description: z.string().min(1, 'Descricao e obrigatoria').max(500, 'Maximo 500 caracteres'),
  excerpt: z.string().max(300, 'Maximo 300 caracteres').optional(),
  content: z.string().min(1, 'Conteudo e obrigatorio'),
  coverImage: z.string().url('URL invalida').optional().or(z.literal('')),
  category: z.nativeEnum(ContentCategory),
  tags: z.string().optional(),
  requiredRole: z.enum(['visitor', 'free', 'premium']).optional(),
  isPremium: z.boolean().optional(),
  status: z.enum(['draft', 'published', 'scheduled']).optional(),
  scheduledFor: z.string().optional(),
  language: z.string().optional(),
})

type ArticleFormData = z.infer<typeof articleFormSchema>

interface ArticleFormCreateProps {
  article?: undefined
  onSubmit: (data: CreateArticleDto) => Promise<void>
  submitText?: string
  showDraftOption?: boolean
}

interface ArticleFormEditProps {
  article: Article
  onSubmit: (data: UpdateArticleDto) => Promise<void>
  submitText?: string
  showDraftOption?: boolean
}

export type ArticleFormProps = ArticleFormCreateProps | ArticleFormEditProps

export function ArticleForm(props: ArticleFormProps) {
  const { article } = props
  const submitText = props.submitText ?? (article ? 'Atualizar' : 'Criar Artigo')
  const showDraftOption = props.showDraftOption ?? true
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
      const tags = data.tags
        ? data.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : []

      if (article) {
        const updatePayload: UpdateArticleDto = {
          ...data,
          tags,
          status: isDraft ? 'draft' : data.status,
          excerpt: data.excerpt || undefined,
          coverImage: data.coverImage || undefined,
        }
        await props.onSubmit(updatePayload)
      } else {
        const createPayload: CreateArticleDto = {
          title: data.title,
          description: data.description,
          content: data.content,
          category: data.category,
          tags,
          requiredRole: data.requiredRole,
          isPremium: data.isPremium,
          status: isDraft ? 'draft' : data.status,
          scheduledFor: data.scheduledFor,
          excerpt: data.excerpt || undefined,
          coverImage: data.coverImage || undefined,
          language: data.language,
        }
        await props.onSubmit(createPayload)
      }
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
        <Card className="border-red-500 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            <strong>Erro:</strong> {serverError}
          </p>
        </Card>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Titulo</Label>
        <Input id="title" placeholder="Ex: Como Poupar 1000EUR em 6 Meses" {...register('title')} />
        {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Descricao (SEO)</label>
        <textarea
          rows={3}
          placeholder="Resumo curto que aparece nos resultados de busca..."
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
          {...register('description')}
        />
        {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Resumo (opcional)</label>
        <textarea
          rows={2}
          placeholder="Resumo que aparece no card do artigo..."
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
          {...register('excerpt')}
        />
        {errors.excerpt && <p className="text-sm text-red-600">{errors.excerpt.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Conteudo *</label>
        <textarea
          rows={15}
          placeholder="Escreva o conteudo do artigo em Markdown ou HTML..."
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 font-mono text-sm"
          {...register('content')}
        />
        {errors.content && <p className="text-sm text-red-600">{errors.content.message}</p>}
        <p className="text-xs text-muted-foreground">
          Suporta Markdown e HTML. Usa Markdown para formatacao simples.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverImage">Imagem de Capa (URL)</Label>
        <Input
          id="coverImage"
          type="url"
          placeholder="https://exemplo.com/imagem.jpg"
          {...register('coverImage')}
        />
        {errors.coverImage && <p className="text-sm text-red-600">{errors.coverImage.message}</p>}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Categoria *</label>
          <select
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
            {...register('category')}
          >
            <option value={ContentCategory.PERSONAL_FINANCE}>Financas Pessoais</option>
            <option value={ContentCategory.BUDGETING}>Orcamento</option>
            <option value={ContentCategory.SAVING}>Poupanca</option>
            <option value={ContentCategory.DEBT}>Dividas</option>
            <option value={ContentCategory.STOCKS}>Acoes</option>
            <option value={ContentCategory.CRYPTO}>Crypto</option>
            <option value={ContentCategory.REAL_ESTATE}>Imobiliario</option>
            <option value={ContentCategory.FUNDS}>Fundos</option>
            <option value={ContentCategory.BASICS}>Basico</option>
            <option value={ContentCategory.ADVANCED}>Avancado</option>
            <option value={ContentCategory.TRENDS}>Tendencias</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (separadas por virgula)</Label>
          <Input id="tags" placeholder="poupanca, investimento, dicas" {...register('tags')} />
          <p className="text-xs text-muted-foreground">Ex: poupanca, dicas, iniciantes</p>
          {errors.tags && <p className="text-sm text-red-600">{errors.tags.message}</p>}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nivel de Acesso</label>
          <select
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
            {...register('requiredRole')}
          >
            <option value="visitor">Visitante (Todos)</option>
            <option value="free">Gratuito (Conta necessaria)</option>
            <option value="premium">Premium (Assinantes)</option>
          </select>
        </div>

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

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPremium"
          className="h-4 w-4 rounded border-gray-300"
          {...register('isPremium')}
        />
        <label htmlFor="isPremium" className="text-sm font-medium">
          Marcar como conteudo Premium
        </label>
      </div>

      {isPremium && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          Este artigo sera visivel apenas para assinantes Premium
        </div>
      )}

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
