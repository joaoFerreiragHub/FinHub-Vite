import {
  getPositiveIntegerFieldError,
  getRequiredFieldError,
  isDoubleConfirmTokenValid,
} from '@/features/admin/lib/formValidation'

describe('admin form validation helpers', () => {
  it('returns an error when required field is empty after trim', () => {
    expect(getRequiredFieldError('   ', 'Campo obrigatorio.')).toBe('Campo obrigatorio.')
    expect(getRequiredFieldError('valor', 'Campo obrigatorio.')).toBeNull()
  })

  it('validates the double confirm token in a case-insensitive way', () => {
    expect(isDoubleConfirmTokenValid('confirmar', 'CONFIRMAR')).toBe(true)
    expect(isDoubleConfirmTokenValid('  CONFIRMAR  ', 'confirmar')).toBe(true)
    expect(isDoubleConfirmTokenValid('CONFIRMARX', 'CONFIRMAR')).toBe(false)
  })

  it('accepts only positive integer values', () => {
    expect(getPositiveIntegerFieldError('24', 'Numero invalido')).toBeNull()
    expect(getPositiveIntegerFieldError('0', 'Numero invalido')).toBe('Numero invalido')
    expect(getPositiveIntegerFieldError('-1', 'Numero invalido')).toBe('Numero invalido')
    expect(getPositiveIntegerFieldError('abc', 'Numero invalido')).toBe('Numero invalido')
    expect(getPositiveIntegerFieldError('3.5', 'Numero invalido')).toBe('Numero invalido')
  })
})
