export const getRequiredFieldError = (value: string, message: string): string | null =>
  value.trim().length > 0 ? null : message

export const isDoubleConfirmTokenValid = (value: string, token: string): boolean =>
  value.trim().toUpperCase() === token.trim().toUpperCase()

export const getPositiveIntegerFieldError = (value: string, message: string): string | null => {
  const trimmed = value.trim()
  if (!/^\d+$/.test(trimmed)) return message

  return Number.parseInt(trimmed, 10) > 0 ? null : message
}
