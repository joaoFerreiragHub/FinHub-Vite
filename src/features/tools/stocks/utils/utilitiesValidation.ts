// src/utils/validation/utilitiesValidation.ts

export interface ValidationResult {
  isValid: boolean
  warning?: string
  severity?: 'low' | 'medium' | 'high' | 'critical'
}

/**
 * ✅ Validação de sanidade específica para Utilities
 * Verifica se os valores estão dentro de ranges razoáveis para o setor
 */
export function validateUtilitiesIndicator(chave: string, valor: number): ValidationResult {
  switch (chave) {
    case 'dividendYield':
      if (valor > 12) {
        return {
          isValid: false,
          warning: 'Dividend Yield > 12% pode indicar risco extremo ou erro nos dados',
          severity: 'critical'
        }
      }
      if (valor > 9) {
        return {
          isValid: true,
          warning: 'Dividend Yield > 9% é alto - verificar sustentabilidade',
          severity: 'medium'
        }
      }
      break

    case 'payoutRatio':
      if (valor > 150) {
        return {
          isValid: false,
          warning: 'Payout Ratio > 150% é insustentável a longo prazo',
          severity: 'critical'
        }
      }
      if (valor > 100) {
        return {
          isValid: true,
          warning: 'Payout > 100% indica distribuição acima dos lucros',
          severity: 'high'
        }
      }
      break

    case 'coberturaJuros':
      if (valor < 0.5) {
        return {
          isValid: false,
          warning: 'Cobertura < 0.5x indica risco de default iminente',
          severity: 'critical'
        }
      }
      if (valor < 1.5) {
        return {
          isValid: true,
          warning: 'Cobertura < 1.5x indica stress financeiro',
          severity: 'high'
        }
      }
      break

    case 'debtToEbitda':
      if (valor > 10) {
        return {
          isValid: false,
          warning: 'Dívida/EBITDA > 10x indica stress financeiro extremo',
          severity: 'critical'
        }
      }
      if (valor > 7) {
        return {
          isValid: true,
          warning: 'Dívida/EBITDA > 7x é alto mesmo para utilities',
          severity: 'high'
        }
      }
      break

    case 'roe':
      if (valor > 40) {
        return {
          isValid: false,
          warning: 'ROE > 40% pode indicar alavancagem excessiva ou evento não recorrente',
          severity: 'critical'
        }
      }
      if (valor < 0) {
        return {
          isValid: true,
          warning: 'ROE negativo indica prejuízo',
          severity: 'high'
        }
      }
      break

    case 'roic':
      if (valor > 50) {
        return {
          isValid: false,
          warning: 'ROIC > 50% pode indicar evento não recorrente ou erro',
          severity: 'critical'
        }
      }
      break

    case 'capexOverRevenue':
      if (valor > 50) {
        return {
          isValid: false,
          warning: 'CapEx > 50% da receita pode ser insustentável',
          severity: 'critical'
        }
      }
      if (valor > 35) {
        return {
          isValid: true,
          warning: 'CapEx > 35% é muito alto - verificar ciclo de investimentos',
          severity: 'medium'
        }
      }
      break

    case 'endividamento':
      if (valor > 90) {
        return {
          isValid: false,
          warning: 'Endividamento > 90% é extremo mesmo para utilities',
          severity: 'critical'
        }
      }
      break

    case 'margemEbitda':
      if (valor > 80) {
        return {
          isValid: false,
          warning: 'Margem EBITDA > 80% pode indicar erro nos dados',
          severity: 'critical'
        }
      }
      if (valor < 0) {
        return {
          isValid: true,
          warning: 'Margem EBITDA negativa indica problemas operacionais',
          severity: 'high'
        }
      }
      break

    case 'pl':
      if (valor > 100) {
        return {
          isValid: false,
          warning: 'P/L > 100x pode indicar lucros próximos de zero ou erro',
          severity: 'critical'
        }
      }
      if (valor < 0) {
        return {
          isValid: false,
          warning: 'P/L negativo indica prejuízo',
          severity: 'high'
        }
      }
      break

    default:
      // ESLint: Todos os cases devem ter um default
      break
  }

  return { isValid: true }
}

/**
 * ✅ Validação de consistência entre indicadores relacionados
 */
export function validateUtilitiesConsistency(
  complementares: Record<string, number>
): ValidationResult[] {
  const warnings: ValidationResult[] = []

  // Consistência Dividend Yield vs Payout vs ROE
  const { dividendYield, payoutRatio, roe } = complementares

  if (!Number.isNaN(dividendYield) && !Number.isNaN(payoutRatio) && !Number.isNaN(roe)) {
    const expectedYield = (roe * payoutRatio) / 100
    const actualYield = dividendYield
    const deviation = Math.abs(actualYield - expectedYield)

    if (deviation > 3) { // Desvio > 3pp
      warnings.push({
        isValid: true,
        warning: `Inconsistência: Yield (${actualYield.toFixed(1)}%) vs ROE*Payout (${expectedYield.toFixed(1)}%)`,
        severity: 'medium'
      })
    }
  }

  // Consistência Cobertura vs Dívida/EBITDA
  const { coberturaJuros, debtToEbitda } = complementares

  if (!Number.isNaN(coberturaJuros) && !Number.isNaN(debtToEbitda)) {
    if (coberturaJuros < 2 && debtToEbitda > 6) {
      warnings.push({
        isValid: true,
        warning: 'Combinação perigosa: Baixa cobertura de juros + Alto endividamento',
        severity: 'high'
      })
    }
  }

  return warnings
}

/**
 * ✅ Função principal de validação para utilities
 */
export function validateAllUtilitiesIndicators(
  complementares: Record<string, number>
): {
  isValid: boolean
  warnings: ValidationResult[]
  criticalIssues: ValidationResult[]
} {
  const warnings: ValidationResult[] = []
  const criticalIssues: ValidationResult[] = []
  let overallValid = true

  // Validar cada indicador individualmente
  Object.keys(complementares).forEach((chave: string) => {
    const valor = complementares[chave]
    if (!Number.isNaN(valor)) {
      const result = validateUtilitiesIndicator(chave, valor)

      if (!result.isValid) {
        overallValid = false
        criticalIssues.push({
          ...result,
          warning: `${chave}: ${result.warning || 'Valor inválido'}`
        })
      } else if (result.warning) {
        warnings.push({
          ...result,
          warning: `${chave}: ${result.warning}`
        })
      }
    }
  })

  // Validar consistência entre indicadores
  const consistencyWarnings = validateUtilitiesConsistency(complementares)
  warnings.push(...consistencyWarnings)

  return {
    isValid: overallValid,
    warnings,
    criticalIssues
  }
}
