import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { navigate } from 'vike/client/router'
import { Button, Card, Input, Label } from '@/components/ui'
import { ContentCategory } from '@/features/hub/types'
import type { Article, CreateArticleDto, UpdateArticleDto } from '@/features/hub/articles/types'
import { getErrorMessage } from '@/lib/api/client'

const DEFAULT_ARTICLE_TAGS = [
  'poupanca',
  'orcamento',
  'investimento',
  'acoes',
  'etf',
  'crypto',
  'dividendos',
  'imobiliario',
  'fiscalidade',
  'fundo de emergencia',
  'gestao de risco',
  'planeamento financeiro',
]

const articleFormSchema = z.object({
  title: z.string().min(1, 'Titulo e obrigatorio').max(200, 'Maximo 200 caracteres'),
  description: z.string().min(1, 'Descricao e obrigatoria').max(500, 'Maximo 500 caracteres'),
  excerpt: z.string().max(300, 'Maximo 300 caracteres').optional(),
  content: z.string().min(1, 'Conteudo e obrigatorio'),
  coverImage: z.string().url('URL invalida').optional().or(z.literal('')),
  category: z.nativeEnum(ContentCategory),
  tags: z.array(z.string()).optional(),
  requiredRole: z.enum(['visitor', 'free', 'premium']).optional(),
  isPremium: z.boolean().optional(),
  publishNow: z.boolean().optional(),
  language: z.string().optional(),
})

type ArticleFormData = z.infer<typeof articleFormSchema>

interface ArticleFormCreateProps {
  article?: undefined
  onSubmit: (data: CreateArticleDto) => Promise<void>
  submitText?: string
  showDraftOption?: boolean
  redirectTo?: string
}

interface ArticleFormEditProps {
  article: Article
  onSubmit: (data: UpdateArticleDto) => Promise<void>
  submitText?: string
  showDraftOption?: boolean
  redirectTo?: string
}

export type ArticleFormProps = ArticleFormCreateProps | ArticleFormEditProps

export function ArticleForm(props: ArticleFormProps) {
  const { article } = props
  const submitText = props.submitText ?? (article ? 'Atualizar Artigo' : 'Criar Artigo')
  const showDraftOption = props.showDraftOption ?? true
  const redirectTo = props.redirectTo ?? '/creators/dashboard/articles'
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const tagOptions = useMemo(() => {
    const articleTags = article?.tags ?? []
    return Array.from(new Set([...DEFAULT_ARTICLE_TAGS, ...articleTags])).sort((left, right) =>
      left.localeCompare(right),
    )
  }, [article?.tags])

  const navigateTo = (path: string) => {
    void navigate(path)
  }

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
          tags: article.tags,
          requiredRole: article.requiredRole as 'visitor' | 'free' | 'premium',
          isPremium: article.isPremium,
          publishNow: article.status === 'published' || article.isPublished === true,
          language: article.language,
        }
      : {
          category: ContentCategory.PERSONAL_FINANCE,
          requiredRole: 'free',
          isPremium: false,
          publishNow: false,
          language: 'pt',
          tags: [],
        },
  })

  const isPremium = watch('isPremium')
  const publishNow = watch('publishNow')

  const handleSubmit = async (data: ArticleFormData, isDraft = false) => {
    setServerError(null)
    setIsSubmitting(true)

    try {
      const tags = (data.tags ?? []).map((tag) => tag.trim()).filter(Boolean)
      const status: 'draft' | 'published' = isDraft
        ? 'draft'
        : data.publishNow
          ? 'published'
          : 'draft'

      if (article) {
        const updatePayload: UpdateArticleDto = {
          title: data.title,
          description: data.description,
          content: data.content,
          excerpt: data.excerpt || undefined,
          coverImage: data.coverImage || undefined,
          category: data.category,
          tags,
          requiredRole: data.requiredRole,
          isPremium: data.isPremium,
          status,
        }
        await props.onSubmit(updatePayload)
      } else {
        const createPayload: CreateArticleDto = {
          title: data.title,
          description: data.description,
          content: data.content,
          excerpt: data.excerpt || undefined,
          coverImage: data.coverImage || undefined,
          category: data.category,
          tags,
          requiredRole: data.requiredRole,
          isPremium: data.isPremium,
          status,
          language: data.language,
        }
        await props.onSubmit(createPayload)
      }

      navigateTo(redirectTo)
    } catch (error) {
      setServerError(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleFormSubmit((data) => handleSubmit(data, false))} className="space-y-6">
      {serverError ? (
        <Card className="border-red-500 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            <strong>Erro:</strong> {serverError}
          </p>
        </Card>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="title">Titulo</Label>
        <Input
          id="title"
          placeholder="Ex: Como poupar 1000 EUR em 6 meses"
          {...register('title')}
        />
        {errors.title ? <p className="text-sm text-red-600">{errors.title.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descricao (SEO)</Label>
        <textarea
          id="description"
          rows={3}
          placeholder="Resumo curto para resultados de pesquisa e cards."
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
          {...register('description')}
        />
        {errors.description ? (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Resumo (opcional)</Label>
        <textarea
          id="excerpt"
          rows={2}
          placeholder="Resumo breve para destaque no card do artigo."
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
          {...register('excerpt')}
        />
        {errors.excerpt ? <p className="text-sm text-red-600">{errors.excerpt.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Conteudo</Label>
        <textarea
          id="content"
          rows={15}
          placeholder="Escreve o conteudo do artigo..."
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
          {...register('content')}
        />
        {errors.content ? <p className="text-sm text-red-600">{errors.content.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverImage">Imagem de Capa (URL)</Label>
        <Input
          id="coverImage"
          type="url"
          placeholder="https://exemplo.com/imagem.jpg"
          {...register('coverImage')}
        />
        {errors.coverImage ? (
          <p className="text-sm text-red-600">{errors.coverImage.message}</p>
        ) : null}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <select
            id="category"
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
          <Label htmlFor="requiredRole">Nivel de Acesso</Label>
          <select
            id="requiredRole"
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
            {...register('requiredRole')}
          >
            <option value="visitor">Visitante (todos)</option>
            <option value="free">Gratuito</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Topicos/Tags</Label>
        <select
          id="tags"
          multiple
          size={Math.min(8, Math.max(4, tagOptions.length))}
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
          {...register('tags')}
        >
          {tagOptions.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">
          Usa Ctrl/Cmd para selecionar varios topicos.
        </p>
        {errors.tags ? <p className="text-sm text-red-600">{errors.tags.message}</p> : null}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="publishNow"
            className="h-4 w-4 rounded border-gray-300"
            {...register('publishNow')}
          />
          <label htmlFor="publishNow" className="text-sm font-medium">
            Publicar imediatamente
          </label>
        </div>
        <p className="text-xs text-muted-foreground">
          {publishNow
            ? 'Este artigo sera publicado assim que gravares.'
            : 'Este artigo sera guardado como rascunho.'}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPremium"
            className="h-4 w-4 rounded border-gray-300"
            {...register('isPremium')}
          />
          <label htmlFor="isPremium" className="text-sm font-medium">
            Marcar como conteudo premium
          </label>
        </div>

        {isPremium ? (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
            Este artigo sera visivel apenas para assinantes premium.
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="default" size="lg" isLoading={isSubmitting}>
          {submitText}
        </Button>

        {showDraftOption && !article ? (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleFormSubmit((data) => handleSubmit(data, true))}
            disabled={isSubmitting}
          >
            Guardar Rascunho
          </Button>
        ) : null}

        <Button type="button" variant="ghost" size="lg" onClick={() => navigateTo(redirectTo)}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
