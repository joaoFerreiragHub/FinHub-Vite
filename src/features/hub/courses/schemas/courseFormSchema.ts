import { z } from 'zod'
import { ContentCategory } from '../../types'

export const courseFormSchema = z.object({
  title: z.string().min(1, 'Titulo e obrigatorio').max(200, 'Maximo 200 caracteres'),
  description: z.string().min(1, 'Descricao e obrigatoria').max(2000, 'Maximo 2000 caracteres'),
  excerpt: z.string().max(300, 'Maximo 300 caracteres').optional(),
  coverImage: z.string().url('URL invalida').optional().or(z.literal('')),
  category: z.nativeEnum(ContentCategory),
  tags: z.string().optional(),
  price: z.coerce.number().min(0, 'Preco nao pode ser negativo'),
  discountPrice: z.coerce.number().min(0).optional(),
  currency: z.string().default('EUR'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  language: z.string().default('pt'),
  prerequisites: z.string().optional(),
  learningOutcomes: z.string().optional(),
  requiredRole: z.enum(['visitor', 'free', 'premium']).optional(),
  isPremium: z.boolean().optional(),
  status: z.enum(['draft', 'published']).optional(),
})

export type CourseFormValues = z.infer<typeof courseFormSchema>
