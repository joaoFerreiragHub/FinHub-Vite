import { z } from 'zod'

/**
 * Schema de validação para Login
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(1, 'Password é obrigatória')
    .min(6, 'Password deve ter pelo menos 6 caracteres'),
  rememberMe: z.boolean().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>

/**
 * Schema de validação para Register
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nome é obrigatório')
      .min(2, 'Nome deve ter pelo menos 2 caracteres')
      .max(50, 'Nome não pode ter mais de 50 caracteres'),
    lastName: z
      .string()
      .min(2, 'Apelido deve ter pelo menos 2 caracteres')
      .max(50, 'Apelido não pode ter mais de 50 caracteres')
      .optional()
      .or(z.literal('')),
    email: z
      .string()
      .min(1, 'Email é obrigatório')
      .email('Email inválido'),
    username: z
      .string()
      .min(1, 'Username é obrigatório')
      .min(3, 'Username deve ter pelo menos 3 caracteres')
      .max(30, 'Username não pode ter mais de 30 caracteres')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username só pode conter letras, números e underscore'),
    password: z
      .string()
      .min(1, 'Password é obrigatória')
      .min(8, 'Password deve ter pelo menos 8 caracteres')
      .regex(/[A-Z]/, 'Password deve conter pelo menos uma letra maiúscula')
      .regex(/[a-z]/, 'Password deve conter pelo menos uma letra minúscula')
      .regex(/[0-9]/, 'Password deve conter pelo menos um número'),
    confirmPassword: z
      .string()
      .min(1, 'Confirmação de password é obrigatória'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As passwords não coincidem',
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof registerSchema>

/**
 * Schema de validação para Forgot Password
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

/**
 * Schema de validação para Reset Password
 */
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Password é obrigatória')
      .min(8, 'Password deve ter pelo menos 8 caracteres')
      .regex(/[A-Z]/, 'Password deve conter pelo menos uma letra maiúscula')
      .regex(/[a-z]/, 'Password deve conter pelo menos uma letra minúscula')
      .regex(/[0-9]/, 'Password deve conter pelo menos um número'),
    confirmPassword: z
      .string()
      .min(1, 'Confirmação de password é obrigatória'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As passwords não coincidem',
    path: ['confirmPassword'],
  })

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
