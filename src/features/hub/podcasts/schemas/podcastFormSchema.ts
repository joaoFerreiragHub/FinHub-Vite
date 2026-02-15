import { z } from 'zod'
import { ContentCategory } from '../../types'

export const podcastFormSchema = z.object({
  title: z.string().min(1, 'Titulo e obrigatorio').max(200, 'Maximo 200 caracteres'),
  description: z.string().min(1, 'Descricao e obrigatoria').max(2000, 'Maximo 2000 caracteres'),
  excerpt: z.string().max(300, 'Maximo 300 caracteres').optional(),
  coverImage: z.string().url('URL invalida').optional().or(z.literal('')),
  category: z.nativeEnum(ContentCategory),
  tags: z.string().optional(),

  frequency: z.enum(['daily', 'weekly', 'biweekly', 'monthly']).optional(),
  rssFeedUrl: z.string().url('URL invalida').optional().or(z.literal('')),
  spotifyUrl: z.string().url('URL invalida').optional().or(z.literal('')),
  applePodcastsUrl: z.string().url('URL invalida').optional().or(z.literal('')),

  requiredRole: z.enum(['visitor', 'free', 'premium']).optional(),
  isPremium: z.boolean().optional(),
  status: z.enum(['draft', 'published']).optional(),
})

export type PodcastFormValues = z.infer<typeof podcastFormSchema>

export const episodeFormSchema = z.object({
  title: z.string().min(1, 'Titulo e obrigatorio').max(200, 'Maximo 200 caracteres'),
  description: z.string().max(2000, 'Maximo 2000 caracteres').optional(),
  audioUrl: z.string().url('URL do audio e obrigatoria').min(1),
  duration: z.coerce.number().min(1, 'Duracao e obrigatoria'),
  transcript: z.string().optional(),
  showNotes: z.string().optional(),
  isPublished: z.boolean().optional(),
})

export type EpisodeFormValues = z.infer<typeof episodeFormSchema>
