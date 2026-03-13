import { z } from 'zod'

/**
 * Schema de validacao para Login
 */
export const loginSchema = z.object({
  email: z.string().min(1, 'Email e obrigatorio').email('Email invalido'),
  password: z
    .string()
    .min(1, 'Password e obrigatoria')
    .min(6, 'Password deve ter pelo menos 6 caracteres'),
  rememberMe: z.boolean().optional(),
  captchaToken: z.string().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>

/**
 * Schema de validacao para Register
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nome e obrigatorio')
      .min(2, 'Nome deve ter pelo menos 2 caracteres')
      .max(50, 'Nome nao pode ter mais de 50 caracteres'),
    lastName: z
      .string()
      .min(2, 'Apelido deve ter pelo menos 2 caracteres')
      .max(50, 'Apelido nao pode ter mais de 50 caracteres')
      .optional()
      .or(z.literal('')),
    email: z.string().min(1, 'Email e obrigatorio').email('Email invalido'),
    username: z
      .string()
      .min(1, 'Username e obrigatorio')
      .min(3, 'Username deve ter pelo menos 3 caracteres')
      .max(30, 'Username nao pode ter mais de 30 caracteres')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username so pode conter letras, numeros e underscore'),
    password: z
      .string()
      .min(1, 'Password e obrigatoria')
      .min(8, 'Password deve ter pelo menos 8 caracteres')
      .regex(/[A-Z]/, 'Password deve conter pelo menos uma letra maiuscula')
      .regex(/[a-z]/, 'Password deve conter pelo menos uma letra minuscula')
      .regex(/[0-9]/, 'Password deve conter pelo menos um numero'),
    confirmPassword: z.string().min(1, 'Confirmacao de password e obrigatoria'),
    captchaToken: z.string().optional(),
    termsAccepted: z
      .boolean()
      .refine((value) => value === true, 'Deves aceitar os Termos de Servico'),
    privacyAccepted: z
      .boolean()
      .refine((value) => value === true, 'Deves aceitar a Politica de Privacidade'),
    financialDisclaimerAccepted: z
      .boolean()
      .refine((value) => value === true, 'Deves aceitar o Aviso Legal Financeiro'),
    cookieAnalytics: z.boolean().optional(),
    cookieMarketing: z.boolean().optional(),
    cookiePreferences: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As passwords nao coincidem',
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof registerSchema>

/**
 * Schema de validacao para Forgot Password
 */
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email e obrigatorio').email('Email invalido'),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

/**
 * Schema de validacao para Reset Password
 */
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Password e obrigatoria')
      .min(8, 'Password deve ter pelo menos 8 caracteres')
      .regex(/[A-Z]/, 'Password deve conter pelo menos uma letra maiuscula')
      .regex(/[a-z]/, 'Password deve conter pelo menos uma letra minuscula')
      .regex(/[0-9]/, 'Password deve conter pelo menos um numero'),
    confirmPassword: z.string().min(1, 'Confirmacao de password e obrigatoria'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As passwords nao coincidem',
    path: ['confirmPassword'],
  })

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
