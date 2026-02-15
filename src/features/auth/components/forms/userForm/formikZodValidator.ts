// src/components/userForm/formikZodValidator.ts
import { ZodSchema } from 'zod'
import { FormikErrors } from 'formik'

export const validateWithZod = async <T>(
  schema: ZodSchema<T>,
  values: T,
  asyncChecks?: (errors: Partial<FormikErrors<T>>) => Promise<void>,
): Promise<Partial<FormikErrors<T>>> => {
  const result = schema.safeParse(values)
  const errors: Record<string, string> = {}

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors
    Object.entries(fieldErrors).forEach(([key, messages]) => {
      if (Array.isArray(messages) && messages.length > 0) {
        errors[key] = messages[0]
      }
    })
  }

  const formikErrors = errors as Partial<FormikErrors<T>>
  if (asyncChecks) await asyncChecks(formikErrors)
  return formikErrors
}
