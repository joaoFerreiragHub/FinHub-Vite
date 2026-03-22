import { z } from 'zod'
import { ContentCategory } from '../../types'
import { isSupportedVideoUrl } from '../utils/videoUrl'

const durationMinutesSchema = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) return undefined
  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : value
}, z.number().min(0.5, 'Duracao minima de 0.5 minutos').max(600, 'Duracao maxima de 600 minutos').optional())

export const videoFormSchema = z.object({
  title: z.string().min(1, 'Titulo e obrigatorio').max(200, 'Maximo 200 caracteres'),
  description: z.string().min(1, 'Descricao e obrigatoria').max(2000, 'Maximo 2000 caracteres'),
  excerpt: z.string().max(300, 'Maximo 300 caracteres').optional(),
  videoUrl: z
    .string()
    .url('URL de video invalida')
    .refine(
      (value) => isSupportedVideoUrl(value),
      'Apenas URLs de YouTube ou Vimeo sao suportadas',
    ),
  durationMinutes: durationMinutesSchema,
  thumbnail: z.string().url('URL invalida').optional().or(z.literal('')),
  coverImage: z.string().url('URL invalida').optional().or(z.literal('')),
  category: z.nativeEnum(ContentCategory),
  tags: z.array(z.string()).optional(),
  quality: z.enum(['720p', '1080p', '4k']).default('1080p'),
  requiredRole: z.enum(['visitor', 'free', 'premium']).optional(),
  isPremium: z.boolean().optional(),
  publishNow: z.boolean().optional(),
  language: z.string().default('pt'),
})

export type VideoFormValues = z.infer<typeof videoFormSchema>
