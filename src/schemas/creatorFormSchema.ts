// src/schemas/creatorFormSchema.ts
import { z } from "zod"

export const creatorFormSchema = z.object({
  userName: z.string().min(1, "Username é obrigatório"),
  name: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().min(1, "Apelido é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "A password deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Deve conter uma letra maiúscula")
    .regex(/[a-z]/, "Deve conter uma letra minúscula")
    .regex(/[0-9]/, "Deve conter um número"),
  dateOfBirth: z.date({
      required_error: "Data de nascimento obrigatória",
      invalid_type_error: "Data inválida",
    })
    .nullable()
    .refine((date) => {
      if (!date) return false
      const age = new Date().getFullYear() - date.getFullYear()
      return age >= 18 && age <= 100
    }, {
      message: "A idade deve estar entre 18 e 100 anos",
    }),
  bio: z.string().optional(),
  topics: z.array(z.string()).min(1, "Seleciona pelo menos um tópico").max(3),
    termsAgreement: z.boolean().refine(val => val === true, {
      message: "Aceita os Termos de Serviço"
    }),
    contentLicenseAgreement: z.boolean().refine(val => val === true, {
      message: "Aceita o Licenciamento de Conteúdo"
    }),
    paymentTermsAgreement: z.boolean().refine(val => val === true, {
      message: "Aceita os Termos de Pagamento"
    }),
})

export type CreatorFormSchema = z.infer<typeof creatorFormSchema>
