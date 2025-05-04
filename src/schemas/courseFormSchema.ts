// src/schemas/courseFormSchema.ts
import { z } from "zod"

export const courseFormSchema = z.object({
  courseName: z.string().min(3),
  description: z.string().min(10),
  price: z.number().min(0),
  topic: z.string().min(3),
  bannerImage: z.any().optional(),
  purchaseLink: z.string().url().optional(),
  status: z.enum(["draft", "published"]),
})

export type CourseFormValues = z.infer<typeof courseFormSchema>
