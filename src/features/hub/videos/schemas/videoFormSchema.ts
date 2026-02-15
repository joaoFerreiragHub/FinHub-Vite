import { z } from 'zod'
import { ContentCategory } from '../../types'

export const videoFormSchema = z.object({
  title: z.string().min(1, 'Titulo e obrigatorio').max(200, 'Maximo 200 caracteres'),
  description: z.string().min(1, 'Descricao e obrigatoria').max(2000, 'Maximo 2000 caracteres'),
  excerpt: z.string().max(300, 'Maximo 300 caracteres').optional(),
  videoUrl: z.string().url('URL de video invalida'),
  duration: z.coerce.number().min(1, 'Duracao e obrigatoria'),
  thumbnail: z.string().url('URL invalida').optional().or(z.literal('')),
  coverImage: z.string().url('URL invalida').optional().or(z.literal('')),
  category: z.nativeEnum(ContentCategory),
  tags: z.string().optional(),
  quality: z.enum(['720p', '1080p', '4k']).default('1080p'),
  requiredRole: z.enum(['visitor', 'free', 'premium']).optional(),
  isPremium: z.boolean().optional(),
  status: z.enum(['draft', 'published']).optional(),
  language: z.string().default('pt'),
})

export type VideoFormValues = z.infer<typeof videoFormSchema>
