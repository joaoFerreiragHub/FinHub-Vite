import { FormikErrors } from "formik"
import { ZodSchema } from "zod"

export const validateWithZod = async <T>(
  schema: ZodSchema<T>,
  values: T,
  asyncChecks?: (errors: Partial<FormikErrors<T>>) => Promise<void>
): Promise<Partial<FormikErrors<T>>> => {
  const result = schema.safeParse(values)
  const errors: Partial<FormikErrors<T>> = {}

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors

    Object.entries(fieldErrors).forEach(([key, messages]) => {
      if (Array.isArray(messages) && messages.length > 0) {
        errors[key as keyof T] = messages[0] as string
      }
    })
  }

  if (asyncChecks) await asyncChecks(errors)
  return errors
}
