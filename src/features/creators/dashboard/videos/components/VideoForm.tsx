import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@/lib/reactRouterDomCompat'
import { Button, Input, Card, Label } from '@/components/ui'
import { ContentCategory } from '@/features/hub/types'
import {
  videoFormSchema,
  type VideoFormValues,
} from '@/features/hub/videos/schemas/videoFormSchema'
import type { Video, CreateVideoDto, UpdateVideoDto } from '@/features/hub/videos/types'
import { resolveVideoEmbedPreview } from '@/features/hub/videos/utils/videoUrl'
import { getErrorMessage } from '@/lib/api/client'

interface VideoFormCreateProps {
  video?: undefined
  onSubmit: (data: CreateVideoDto) => Promise<void>
  submitText?: string
  showDraftOption?: boolean
  redirectTo?: string
}

interface VideoFormEditProps {
  video: Video
  onSubmit: (data: UpdateVideoDto) => Promise<void>
  submitText?: string
  showDraftOption?: boolean
  redirectTo?: string
}

export type VideoFormProps = VideoFormCreateProps | VideoFormEditProps

const DEFAULT_VIDEO_TOPICS = [
  'youtube',
  'vimeo',
  'investimento',
  'acoes',
  'etf',
  'crypto',
  'dividendos',
  'fundo imobiliario',
  'analise fundamental',
  'analise tecnica',
  'macroeconomia',
  'gestao de risco',
  'planeamento financeiro',
]

const secondsToMinutes = (seconds: number | undefined): number | undefined => {
  if (typeof seconds !== 'number' || !Number.isFinite(seconds) || seconds <= 0) {
    return undefined
  }
  return Number((seconds / 60).toFixed(1))
}

export function VideoForm(props: VideoFormProps) {
  const { video } = props
  const submitText = props.submitText ?? (video ? 'Atualizar Video' : 'Publicar Video')
  const showDraftOption = props.showDraftOption ?? true
  const redirectTo = props.redirectTo ?? '/creators/dashboard/videos'
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const topicOptions = useMemo(() => {
    const videoTopics = video?.tags ?? []
    return Array.from(new Set([...DEFAULT_VIDEO_TOPICS, ...videoTopics])).sort((left, right) =>
      left.localeCompare(right),
    )
  }, [video?.tags])

  const navigateTo = (path: string) => {
    navigate(path)
  }

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<VideoFormValues>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: video
      ? {
          title: video.title,
          description: video.description,
          excerpt: video.excerpt,
          videoUrl: video.videoUrl,
          durationMinutes: secondsToMinutes(video.duration),
          thumbnail: video.thumbnail || '',
          coverImage: video.coverImage || '',
          category: video.category,
          tags: video.tags,
          quality: video.quality,
          requiredRole: video.requiredRole as 'visitor' | 'free' | 'premium',
          isPremium: video.isPremium,
          publishNow: video.status === 'published' || video.isPublished === true,
          language: video.language || 'pt',
        }
      : {
          category: ContentCategory.PERSONAL_FINANCE,
          requiredRole: 'free',
          isPremium: false,
          quality: '1080p',
          language: 'pt',
          tags: [],
          publishNow: false,
        },
  })

  const isPremium = watch('isPremium')
  const publishNow = watch('publishNow')
  const videoUrl = watch('videoUrl')
  const videoPreview = useMemo(() => resolveVideoEmbedPreview(videoUrl ?? ''), [videoUrl])

  useEffect(() => {
    const thumbnailSuggestion = videoPreview?.youtubeThumbnailUrl
    if (!thumbnailSuggestion) return

    const currentThumbnail = getValues('thumbnail')
    if (typeof currentThumbnail === 'string' && currentThumbnail.trim()) return

    setValue('thumbnail', thumbnailSuggestion, { shouldValidate: true })
  }, [getValues, setValue, videoPreview?.youtubeThumbnailUrl])

  const useSuggestedThumbnail = () => {
    if (!videoPreview?.youtubeThumbnailUrl) return
    setValue('thumbnail', videoPreview.youtubeThumbnailUrl, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const handleSubmit = async (data: VideoFormValues, isDraft = false) => {
    setServerError(null)
    setIsSubmitting(true)

    try {
      const tags = (data.tags ?? []).map((tag) => tag.trim()).filter(Boolean)
      const durationSeconds =
        typeof data.durationMinutes === 'number' ? Math.round(data.durationMinutes * 60) : undefined
      const status: 'draft' | 'published' = isDraft
        ? 'draft'
        : data.publishNow
          ? 'published'
          : 'draft'

      if (video) {
        const updatePayload: UpdateVideoDto = {
          title: data.title,
          description: data.description,
          excerpt: data.excerpt || undefined,
          videoUrl: data.videoUrl,
          duration: durationSeconds,
          thumbnail: data.thumbnail || undefined,
          coverImage: data.coverImage || undefined,
          category: data.category,
          tags,
          quality: data.quality,
          requiredRole: data.requiredRole,
          isPremium: data.isPremium,
          status,
        }
        await props.onSubmit(updatePayload)
      } else {
        const createPayload: CreateVideoDto = {
          title: data.title,
          description: data.description,
          excerpt: data.excerpt || undefined,
          videoUrl: data.videoUrl,
          duration: durationSeconds ?? 0,
          thumbnail: data.thumbnail || undefined,
          coverImage: data.coverImage || undefined,
          category: data.category,
          tags,
          quality: data.quality,
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
      {serverError && (
        <Card className="border-red-500 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            <strong>Erro:</strong> {serverError}
          </p>
        </Card>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Titulo *</Label>
        <Input
          id="title"
          placeholder="Ex: Como Analisar Acoes em 10 Minutos"
          {...register('title')}
        />
        {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Descricao *</label>
        <textarea
          rows={4}
          placeholder="Descreve o conteudo do video..."
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
          {...register('description')}
        />
        {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="videoUrl">URL do Video *</Label>
        <Input
          id="videoUrl"
          type="url"
          placeholder="https://www.youtube.com/watch?v=... ou https://vimeo.com/..."
          {...register('videoUrl')}
        />
        {errors.videoUrl && <p className="text-sm text-red-600">{errors.videoUrl.message}</p>}
        {!errors.videoUrl && videoUrl ? (
          <p className="text-xs text-muted-foreground">Formatos suportados: YouTube e Vimeo.</p>
        ) : null}
      </div>

      {videoPreview ? (
        <Card className="overflow-hidden border-dashed">
          <div className="aspect-video bg-black">
            <iframe
              src={videoPreview.embedUrl}
              title="Preview do video"
              className="h-full w-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
          <div className="px-4 py-3 text-xs text-muted-foreground">
            Preview do embed {videoPreview.provider === 'youtube' ? 'YouTube' : 'Vimeo'}.
          </div>
        </Card>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="excerpt">Resumo (opcional)</Label>
        <textarea
          id="excerpt"
          rows={2}
          placeholder="Resumo curto para card e SEO."
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
          {...register('excerpt')}
        />
        {errors.excerpt && <p className="text-sm text-red-600">{errors.excerpt.message}</p>}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="durationMinutes">Duracao (minutos, opcional)</Label>
          <Input
            id="durationMinutes"
            type="number"
            min="0.5"
            step="0.5"
            placeholder="12"
            {...register('durationMinutes')}
          />
          {errors.durationMinutes && (
            <p className="text-sm text-red-600">{errors.durationMinutes.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Qualidade</label>
          <select
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
            {...register('quality')}
          >
            <option value="720p">720p</option>
            <option value="1080p">1080p (Full HD)</option>
            <option value="4k">4K</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Categoria *</label>
          <select
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
            {...register('category')}
          >
            <option value={ContentCategory.PERSONAL_FINANCE}>Financas Pessoais</option>
            <option value={ContentCategory.BUDGETING}>Orcamento</option>
            <option value={ContentCategory.SAVING}>Poupanca</option>
            <option value={ContentCategory.STOCKS}>Acoes</option>
            <option value={ContentCategory.CRYPTO}>Crypto</option>
            <option value={ContentCategory.BASICS}>Basico</option>
            <option value={ContentCategory.ADVANCED}>Avancado</option>
            <option value={ContentCategory.TRENDS}>Tendencias</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="thumbnail">Thumbnail (URL)</Label>
          <Input id="thumbnail" type="url" placeholder="https://..." {...register('thumbnail')} />
          {errors.thumbnail && <p className="text-sm text-red-600">{errors.thumbnail.message}</p>}
          {videoPreview?.youtubeThumbnailUrl ? (
            <button
              type="button"
              className="text-xs font-medium text-primary hover:underline"
              onClick={useSuggestedThumbnail}
            >
              Usar thumbnail sugerida do YouTube
            </button>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Topicos/Tags</Label>
          <select
            id="tags"
            multiple
            size={Math.min(8, Math.max(4, topicOptions.length))}
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
            {...register('tags')}
          >
            {topicOptions.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Usa Ctrl/Cmd para selecionar varios topicos.
          </p>
          {errors.tags && <p className="text-sm text-red-600">{errors.tags.message}</p>}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
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
          <label className="text-sm font-medium">Idioma</label>
          <select
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
            {...register('language')}
          >
            <option value="pt">Portugues</option>
            <option value="en">Ingles</option>
            <option value="es">Espanhol</option>
          </select>
        </div>
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
            ? 'Este video sera publicado assim que gravares.'
            : 'Este video sera guardado como rascunho.'}
        </p>
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
          Este video sera visivel apenas para assinantes Premium
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" variant="default" size="lg" isLoading={isSubmitting}>
          {submitText}
        </Button>

        {showDraftOption && !video && (
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

        <Button type="button" variant="ghost" size="lg" onClick={() => navigateTo(redirectTo)}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
