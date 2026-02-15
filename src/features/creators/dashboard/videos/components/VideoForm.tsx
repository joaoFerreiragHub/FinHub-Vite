import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Card, Label } from '@/components/ui'
import { ContentCategory } from '@/features/hub/types'
import {
  videoFormSchema,
  type VideoFormValues,
} from '@/features/hub/videos/schemas/videoFormSchema'
import type { Video, CreateVideoDto, UpdateVideoDto } from '@/features/hub/videos/types'
import { getErrorMessage } from '@/lib/api/client'

interface VideoFormCreateProps {
  video?: undefined
  onSubmit: (data: CreateVideoDto) => Promise<void>
  submitText?: string
  showDraftOption?: boolean
}

interface VideoFormEditProps {
  video: Video
  onSubmit: (data: UpdateVideoDto) => Promise<void>
  submitText?: string
  showDraftOption?: boolean
}

export type VideoFormProps = VideoFormCreateProps | VideoFormEditProps

export function VideoForm(props: VideoFormProps) {
  const { video } = props
  const submitText = props.submitText ?? (video ? 'Atualizar' : 'Criar Video')
  const showDraftOption = props.showDraftOption ?? true
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    watch,
  } = useForm<VideoFormValues>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: video
      ? {
          title: video.title,
          description: video.description,
          excerpt: video.excerpt,
          videoUrl: video.videoUrl,
          duration: video.duration,
          thumbnail: video.thumbnail || '',
          coverImage: video.coverImage || '',
          category: video.category,
          tags: video.tags.join(', '),
          quality: video.quality,
          requiredRole: video.requiredRole as 'visitor' | 'free' | 'premium',
          isPremium: video.isPremium,
          status: video.status as 'draft' | 'published',
          language: video.language || 'pt',
        }
      : {
          status: 'draft',
          category: ContentCategory.PERSONAL_FINANCE,
          requiredRole: 'free',
          isPremium: false,
          quality: '1080p',
          language: 'pt',
        },
  })

  const isPremium = watch('isPremium')

  const handleSubmit = async (data: VideoFormValues, isDraft = false) => {
    setServerError(null)
    setIsSubmitting(true)

    try {
      const tags = data.tags
        ? data.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : []

      if (video) {
        const updatePayload: UpdateVideoDto = {
          title: data.title,
          description: data.description,
          excerpt: data.excerpt || undefined,
          videoUrl: data.videoUrl,
          duration: data.duration,
          thumbnail: data.thumbnail || undefined,
          coverImage: data.coverImage || undefined,
          category: data.category,
          tags,
          quality: data.quality,
          requiredRole: data.requiredRole,
          isPremium: data.isPremium,
          status: isDraft ? 'draft' : data.status,
        }
        await props.onSubmit(updatePayload)
      } else {
        const createPayload: CreateVideoDto = {
          title: data.title,
          description: data.description,
          excerpt: data.excerpt || undefined,
          videoUrl: data.videoUrl,
          duration: data.duration,
          thumbnail: data.thumbnail || undefined,
          coverImage: data.coverImage || undefined,
          category: data.category,
          tags,
          quality: data.quality,
          requiredRole: data.requiredRole,
          isPremium: data.isPremium,
          status: isDraft ? 'draft' : data.status,
          language: data.language,
        }
        await props.onSubmit(createPayload)
      }
      navigate('/creators/dashboard/videos')
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
          placeholder="https://youtube.com/embed/... ou https://vimeo.com/..."
          {...register('videoUrl')}
        />
        {errors.videoUrl && <p className="text-sm text-red-600">{errors.videoUrl.message}</p>}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="duration">Duracao (segundos) *</Label>
          <Input id="duration" type="number" min="1" placeholder="600" {...register('duration')} />
          {errors.duration && <p className="text-sm text-red-600">{errors.duration.message}</p>}
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (separadas por virgula)</Label>
          <Input id="tags" placeholder="acoes, analise, tutorial" {...register('tags')} />
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
          <label className="text-sm font-medium">Estado</label>
          <select
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
            {...register('status')}
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
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

        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={() => navigate('/creators/dashboard/videos')}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
