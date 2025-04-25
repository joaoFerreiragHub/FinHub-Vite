// src/schemas/userFormSchema.ts
import { z } from "zod"

export const userFormSchema = z.object({
  userName: z.string().min(1, "Username obrigatório"),
  name: z.string().min(1, "Nome obrigatório"),
  lastName: z.string().min(1, "Apelido obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string()
    .min(8, "Password deve ter no mínimo 8 caracteres")
    .regex(/[A-Z]/, "Deve conter uma letra maiúscula")
    .regex(/[a-z]/, "Deve conter uma letra minúscula")
    .regex(/[0-9]/, "Deve conter um número"),
  dateOfBirth: z.date({
    required_error: "Data obrigatória",
    invalid_type_error: "Data inválida",
  }).refine((date) => {
    const now = new Date()
    const age = now.getFullYear() - date.getFullYear()
    const m = now.getMonth() - date.getMonth()
    const isBirthdayPassed = m > 0 || (m === 0 && now.getDate() >= date.getDate())
    const actualAge = isBirthdayPassed ? age : age - 1
    return actualAge >= 18 && actualAge <= 100
  }, { message: "A idade deve estar entre 18 e 100 anos" }),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "Obrigatório aceitar os termos" }),
  }),
  topics: z.array(z.string())
    .min(1, "Seleciona pelo menos 1 tópico")
    .max(3, "No máximo 3 tópicos"),
})

export type UserFormSchema = z.infer<typeof userFormSchema>
