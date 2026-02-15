import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Card, Label } from '@/components/ui'
import { ContentCategory } from '@/features/hub/types'
import {
  podcastFormSchema,
  type PodcastFormValues,
} from '@/features/hub/podcasts/schemas/podcastFormSchema'
import type { Podcast, CreatePodcastDto, UpdatePodcastDto } from '@/features/hub/podcasts/types'
import { getErrorMessage } from '@/lib/api/client'

interface PodcastFormCreateProps {
  podcast?: undefined
  onSubmit: (data: CreatePodcastDto) => Promise<void>
  submitText?: string
  showDraftOption?: boolean
}

interface PodcastFormEditProps {
  podcast: Podcast
  onSubmit: (data: UpdatePodcastDto) => Promise<void>
  submitText?: string
  showDraftOption?: boolean
}

export type PodcastFormProps = PodcastFormCreateProps | PodcastFormEditProps

export function PodcastForm(props: PodcastFormProps) {
  const { podcast } = props
  const submitText = props.submitText ?? (podcast ? 'Atualizar' : 'Criar Podcast')
  const showDraftOption = props.showDraftOption ?? true
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm<PodcastFormValues>({
    resolver: zodResolver(podcastFormSchema),
    defaultValues: podcast
      ? {
          title: podcast.title,
          description: podcast.description,
          excerpt: podcast.excerpt,
          coverImage: podcast.coverImage || '',
          category: podcast.category,
          tags: podcast.tags.join(', '),
          frequency: podcast.frequency,
          rssFeedUrl: podcast.rssFeedUrl || '',
          spotifyUrl: podcast.spotifyUrl || '',
          applePodcastsUrl: podcast.applePodcastsUrl || '',
          requiredRole: podcast.requiredRole as 'visitor' | 'free' | 'premium',
          isPremium: podcast.isPremium,
          status: podcast.status as 'draft' | 'published',
        }
      : {
          status: 'draft',
          category: ContentCategory.PERSONAL_FINANCE,
          requiredRole: 'free',
          isPremium: false,
          frequency: 'weekly',
        },
  })

  const handleSubmit = async (data: PodcastFormValues, isDraft = false) => {
    setServerError(null)
    setIsSubmitting(true)

    try {
      const tags = data.tags
        ? data.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : []

      if (podcast) {
        const updatePayload: UpdatePodcastDto = {
          title: data.title,
          description: data.description,
          excerpt: data.excerpt || undefined,
          coverImage: data.coverImage || undefined,
          category: data.category,
          tags,
          frequency: data.frequency,
          rssFeedUrl: data.rssFeedUrl || undefined,
          spotifyUrl: data.spotifyUrl || undefined,
          applePodcastsUrl: data.applePodcastsUrl || undefined,
          requiredRole: data.requiredRole,
          isPremium: data.isPremium,
          status: isDraft ? 'draft' : data.status,
        }
        await props.onSubmit(updatePayload)
      } else {
        const createPayload: CreatePodcastDto = {
          title: data.title,
          description: data.description,
          excerpt: data.excerpt || undefined,
          coverImage: data.coverImage || undefined,
          category: data.category,
          tags,
          frequency: data.frequency,
          rssFeedUrl: data.rssFeedUrl || undefined,
          spotifyUrl: data.spotifyUrl || undefined,
          applePodcastsUrl: data.applePodcastsUrl || undefined,
          requiredRole: data.requiredRole,
          isPremium: data.isPremium,
          status: isDraft ? 'draft' : data.status,
        }
        await props.onSubmit(createPayload)
      }
      navigate('/creators/dashboard/podcasts')
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
        <Input id="title" placeholder="Ex: Investir Sem Medo" {...register('title')} />
        {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Descricao *</label>
        <textarea
          rows={4}
          placeholder="Descreve o tema e formato do teu podcast..."
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
          {...register('description')}
        />
        {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverImage">Imagem de Capa (URL)</Label>
        <Input
          id="coverImage"
          type="url"
          placeholder="https://exemplo.com/capa.jpg"
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
            <option value={ContentCategory.STOCKS}>Acoes</option>
            <option value={ContentCategory.CRYPTO}>Crypto</option>
            <option value={ContentCategory.REAL_ESTATE}>Imobiliario</option>
            <option value={ContentCategory.BASICS}>Basico</option>
            <option value={ContentCategory.ADVANCED}>Avancado</option>
            <option value={ContentCategory.TRENDS}>Tendencias</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (separadas por virgula)</Label>
          <Input id="tags" placeholder="financas, investimento, podcast" {...register('tags')} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Frequencia</label>
          <select
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
            {...register('frequency')}
          >
            <option value="">Nao definida</option>
            <option value="daily">Diario</option>
            <option value="weekly">Semanal</option>
            <option value="biweekly">Quinzenal</option>
            <option value="monthly">Mensal</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rssFeedUrl">RSS Feed URL</Label>
          <Input
            id="rssFeedUrl"
            type="url"
            placeholder="https://feed.example.com/rss"
            {...register('rssFeedUrl')}
          />
          {errors.rssFeedUrl && <p className="text-sm text-red-600">{errors.rssFeedUrl.message}</p>}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="spotifyUrl">Spotify URL</Label>
          <Input
            id="spotifyUrl"
            type="url"
            placeholder="https://open.spotify.com/show/..."
            {...register('spotifyUrl')}
          />
          {errors.spotifyUrl && <p className="text-sm text-red-600">{errors.spotifyUrl.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="applePodcastsUrl">Apple Podcasts URL</Label>
          <Input
            id="applePodcastsUrl"
            type="url"
            placeholder="https://podcasts.apple.com/..."
            {...register('applePodcastsUrl')}
          />
          {errors.applePodcastsUrl && (
            <p className="text-sm text-red-600">{errors.applePodcastsUrl.message}</p>
          )}
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

        <div className="flex items-center gap-2 pt-7">
          <input
            type="checkbox"
            id="isPremium"
            className="h-4 w-4 rounded border-gray-300"
            {...register('isPremium')}
          />
          <label htmlFor="isPremium" className="text-sm font-medium">
            Premium
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="default" size="lg" isLoading={isSubmitting}>
          {submitText}
        </Button>

        {showDraftOption && !podcast && (
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
          onClick={() => navigate('/creators/dashboard/podcasts')}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
