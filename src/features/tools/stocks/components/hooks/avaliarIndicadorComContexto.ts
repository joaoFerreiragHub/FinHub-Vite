// src/hooks/avaliarIndicadorComContexto.ts

import { FinancialComplementares } from '@/features/tools/stocks/utils/complementares/financialComplementares'
import { HealthcareComplementares } from '@/features/tools/stocks/utils/complementares/healthcareComplementares'
import { RealEstateComplementares } from '@/features/tools/stocks/utils/complementares/realEstateComplementares'
import { TechnologyComplementares } from '@/features/tools/stocks/utils/complementares/technologyComplementares'
import { IndustrialsComplementares } from '@/features/tools/stocks/utils/complementares/industrialsComplementares'
import { EnergyComplementares } from '@/features/tools/stocks/utils/complementares/energyComplementares'
import { BasicMaterialsComplementares } from '@/features/tools/stocks/utils/complementares/basicMaterialsComplementares'
import { UtilitiesComplementares } from '@/features/tools/stocks/utils/complementares/utilitiesComplementares'
import { ConsumerCyclicalComplementares } from '@/features/tools/stocks/utils/complementares/consumerCyclicalComplementares' // ✅ ADICIONADO
import { thresholds, Setor } from '../StockSectors/thresholds'
import { getScoreByThreshold } from './getScoreByThreshold'
import { getScoreByThresholdWithDelta } from './getScoreByThresholdWithDelta'
import { ConsumerDefensiveComplementares } from '@/features/tools/stocks/utils/complementares/consumerDefensiveComplementares'

import {
  indicadoresMetaHealthcare,
  indicadoresMetaTech,
  indicadoresMetaReits,
  indicadoresMetaIndustrials,
  indicadoresMetaFinancials,
  indicadoresMetaEnergy,
  indicadoresMetaUtilities,
  indicadoresMetaBasicMaterials,
  indicadoresMetaConsumerDefensive,
  indicadoresMetaConsumerCyclical,
  indicadoresMetaCommunicationServices,
  IndicadorMeta,
} from '../sections/indicadoresMeta'
import { CommunicationServicesComplementares } from '@/features/tools/stocks/utils/complementares/communicationServicesComplementares'

export interface AvaliacaoIndicador {
  score: 'good' | 'medium' | 'bad'
  peso: number
  apenasInformativo?: boolean
  explicacaoAuto?: boolean
  explicacaoCustom?: string
}

const indicadoresMetaPorSetor: Record<Setor, IndicadorMeta[]> = {
  Healthcare: indicadoresMetaHealthcare,
  Technology: indicadoresMetaTech,
  utilities: indicadoresMetaUtilities,
  'Real Estate': indicadoresMetaReits,
  industrials: indicadoresMetaIndustrials,
  Energy: indicadoresMetaEnergy,
  'Consumer Defensive': indicadoresMetaConsumerDefensive,
  'Financial Services': indicadoresMetaFinancials,
  'Consumer Cyclical': indicadoresMetaConsumerCyclical,
  'Communication Services': indicadoresMetaCommunicationServices,
  'Basic Materials': indicadoresMetaBasicMaterials,
}

// ✅ ATUALIZADO: Type union incluindo todos os complementares
type SectorSpecificComplementares =
  | TechnologyComplementares
  | HealthcareComplementares
  | FinancialComplementares
  | RealEstateComplementares
  | IndustrialsComplementares
  | EnergyComplementares
  | BasicMaterialsComplementares
  | ConsumerDefensiveComplementares // ✅ ADICIONADO
  | ConsumerCyclicalComplementares // ✅ ADICIONADO
  | CommunicationServicesComplementares
  | UtilitiesComplementares
  | Record<string, number>

export function avaliarIndicadorComContexto(
  setor: Setor,
  label: string,
  valor: number,
  contexto: {
    valorAnterior?: number
    complementares?: SectorSpecificComplementares
  } = {},
): AvaliacaoIndicador {
  const metas = indicadoresMetaPorSetor[setor]
  let meta = metas.find((m) => m.label === label)

  // ✅ FALLBACK INTELIGENTE
  if (!meta) {
    console.warn(`⚠️ Indicador "${label}" não encontrado nos metadados do setor ${setor}`)

    const chaveAproximada = label
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[()]/g, '')
      .replace(/proxy/g, '')
      .replace(/calculad[ao]/g, '')
      .replace(/per\s*share/g, 'pershare')

    const metaFallback = metas.find(
      (m) =>
        m.chave.toLowerCase().includes(chaveAproximada) ||
        chaveAproximada.includes(m.chave.toLowerCase()) ||
        m.label.toLowerCase().includes(label.toLowerCase().replace(/[^a-z]/g, '')),
    )

    if (metaFallback) {
      console.log(`✅ Usando fallback: "${metaFallback.label}" para "${label}"`)
      meta = metaFallback
    } else {
      let scoreDefault: 'good' | 'medium' | 'bad' = 'medium'

      if (setor === 'Real Estate') {
        if (label.toLowerCase().includes('ffo') || label.toLowerCase().includes('affo')) {
          scoreDefault = valor > 2 ? 'good' : valor > 1 ? 'medium' : 'bad'
        } else if (label.toLowerCase().includes('yield')) {
          scoreDefault = valor >= 4 && valor <= 8 ? 'good' : 'medium'
        } else if (label.toLowerCase().includes('payout')) {
          scoreDefault = valor >= 60 && valor <= 90 ? 'good' : 'medium'
        }
      }

      return {
        score: scoreDefault,
        peso: 1,
        apenasInformativo: true,
        explicacaoCustom: `Indicador "${label}" não mapeado: usando avaliação automática para ${setor}.`,
      }
    }
  }

  const defaultThresholds = {} as Partial<(typeof thresholds)[keyof typeof thresholds]>
  const thresholdSetor = thresholds[setor] || defaultThresholds
  const threshold = thresholdSetor?.[meta.chave as keyof typeof thresholdSetor]

  let score: 'good' | 'medium' | 'bad'

  if (meta.ajustarComDelta && typeof contexto.valorAnterior === 'number') {
    score = getScoreByThresholdWithDelta(valor, contexto.valorAnterior, threshold)
  } else {
    score = getScoreByThreshold(valor.toString(), threshold)
  }

  // ✅ REGRAS ESPECÍFICAS POR INDICADOR
  if (meta.chave === 'roic' && typeof contexto.valorAnterior === 'number') {
    const delta = Math.abs(valor - contexto.valorAnterior)
    if (delta > 30) {
      score = 'medium'
    }
  }

  if (meta.chave === 'liquidezCorrente' && typeof valor === 'number') {
    if (contexto.complementares && 'freeCashFlow' in contexto.complementares) {
      const fcf = contexto.complementares.freeCashFlow
      if (valor < 0.5 && typeof fcf === 'number' && fcf > 0) {
        score = 'medium'
      }
    }
  }

  // ✅ AVALIAÇÃO DE COMPLEMENTARES POR SETOR
  if (meta.complementar && contexto.complementares) {
    for (const chave of meta.complementar) {
      const val = contexto.complementares[chave as keyof SectorSpecificComplementares]

      // ✅ REGRAS GERAIS
      if (chave === 'peg' && typeof val === 'number') {
        if (meta.chave === 'pl' && val < 1.5 && score === 'bad') {
          score = 'medium'
        }
      }

      if (chave === 'crescimentoReceita' && typeof val === 'number') {
        if (meta.chave === 'ps' && val > 10 && score === 'bad') {
          score = 'medium'
        }
      }

      if (chave === 'debtEquity' && typeof val === 'number') {
        if (meta.chave === 'roe' && val > 2 && score === 'good') {
          score = 'medium'
        }
      }

      if (chave === 'freeCashFlow' && typeof val === 'number') {
        if (meta.chave === 'debtToEbitda' && val > 0 && score === 'bad') {
          score = 'medium'
        }
      }

      if (chave === 'eps' && typeof val === 'number') {
        if (meta.chave === 'payoutRatio' && val < 0 && score === 'medium') {
          score = 'bad'
        }
      }

      if (chave === 'basileia' && typeof val === 'number') {
        if (meta.chave === 'dividendYield' && val < 11 && score === 'good') {
          score = 'medium'
        }
      }

      // ✅ REGRAS ESPECÍFICAS DE TECHNOLOGY
      if (setor === 'Technology') {
        if (chave === 'rAnddEfficiency' && typeof val === 'number') {
          if (meta.chave === 'investimentoPD' && val < 0.5 && score === 'good') {
            score = 'medium'
          }
        }

        if (chave === 'sgaOverRevenue' && typeof val === 'number') {
          if (meta.chave === 'margemEbitda' && val > 0.3 && score === 'good') {
            score = 'medium'
          }
        }

        if (chave === 'cashFlowOverCapex' && typeof val === 'number') {
          if (meta.chave === 'freeCashFlow' && val < 1 && score === 'good') {
            score = 'medium'
          }
        }
      }

      // ✅ REGRAS ESPECÍFICAS DE HEALTHCARE
      if (setor === 'Healthcare') {
        if (chave === 'rAnddEfficiency' && typeof val === 'number') {
          if (meta.chave === 'investimentoPD' && val < 0.3 && score === 'good') {
            score = 'medium'
          }
        }
      }

      // ✅ REGRAS ESPECÍFICAS DE FINANCIAL SERVICES
      if (setor === 'Financial Services') {
        if (chave === 'alavancagem' && typeof val === 'number') {
          if (meta.chave === 'roe' && val > 12 && score === 'good') {
            score = 'medium'
          }
        }

        if (chave === 'nim' && typeof val === 'number') {
          if (meta.chave === 'eficiencia' && val < 3 && score === 'good') {
            score = 'medium'
          }
        }

        if (chave === 'roe' && typeof val === 'number') {
          if (meta.chave === 'pvpa' && val < 10 && score === 'bad') {
            score = 'medium'
          }
        }

        if (chave === 'cobertura' && typeof val === 'number') {
          if (meta.chave === 'inadimplencia' && val > 150 && score === 'bad') {
            score = 'medium'
          }
        }

        if (chave === 'liquidez' && typeof val === 'number') {
          if (meta.chave === 'ldr' && val > 1.5 && score === 'bad') {
            score = 'medium'
          }
        }

        if (chave === 'tier1' && typeof val === 'number') {
          if (meta.chave === 'liquidez' && val > 12 && score === 'bad') {
            score = 'medium'
          }
        }
      }

      // ✅ REGRAS ESPECÍFICAS DE REAL ESTATE
      if (setor === 'Real Estate') {
        // Novos indicadores da API
        if (chave === 'ffoPerShare' && typeof val === 'number') {
          if (meta.chave === 'dividendYield' && score === 'good') {
            const complementares = contexto.complementares as Record<string, number>
            const divYield = complementares.dividendYield

            if (typeof divYield === 'number' && divYield > 0) {
              const estimatedCoverage = (val * 100) / (divYield * 57.58)
              if (estimatedCoverage < 1.2) {
                score = 'medium'
              }
            }
          }
        }

        if (chave === 'affoPerShare' && typeof val === 'number') {
          if (meta.chave === 'ffoPerShare' && contexto.complementares) {
            const complementares = contexto.complementares as Record<string, number>
            const ffoPerShare = complementares.ffoPerShare

            if (typeof ffoPerShare === 'number' && ffoPerShare > 0) {
              const affoToFfoRatio = val / ffoPerShare
              if (affoToFfoRatio < 0.8) {
                score = 'medium'
              }
            }
          }
        }

        // Core dividend sustainability
        if (chave === 'ffoPayoutRatio' && typeof val === 'number') {
          if (meta.chave === 'dividendYield' && val > 95 && score === 'good') {
            score = 'medium'
          }
          if (meta.chave === 'dividendYield' && val < 60 && score === 'bad') {
            score = 'medium'
          }
        }

        if (chave === 'dividendCagr5y' && typeof val === 'number') {
          if (meta.chave === 'dividendYield' && val > 8 && score === 'bad') {
            score = 'medium'
          }
          if (meta.chave === 'dividendYield' && val < 0 && score === 'good') {
            score = 'medium'
          }
        }

        // Operational efficiency
        if (chave === 'noi' && typeof val === 'number') {
          if (meta.chave === 'ocupacao' && val < 0 && score === 'good') {
            score = 'medium'
          }
          if (meta.chave === 'ocupacao' && val > 8 && score === 'bad') {
            score = 'medium'
          }
        }

        if (chave === 'ocupacao' && typeof val === 'number') {
          if (meta.chave === 'capRate' && val > 90 && score === 'bad') {
            score = 'medium'
          }
          if (meta.chave === 'capRate' && val < 80 && score === 'good') {
            score = 'medium'
          }
        }

        // Financial structure
        if (chave === 'ffo' && typeof val === 'number') {
          if (meta.chave === 'dividaEbitda' && val < 2 && score === 'bad') {
            score = 'medium'
          }
          if (meta.chave === 'dividaEbitda' && val > 5 && score === 'bad') {
            score = 'medium'
          }
          if (meta.chave === 'pFfo' && val > 3 && score === 'bad') {
            score = 'medium'
          }
          if (meta.chave === 'pFfo' && val < 1 && score === 'good') {
            score = 'medium'
          }
        }

        // Dividend/Interest coverage detection
        if (chave === 'coberturaJuros' && typeof val === 'number') {
          if (meta.label?.includes('Cobertura de Dividendos') || meta.label?.includes('FFO/Div')) {
            if (meta.chave === 'dividendYield' && val < 1.2 && score === 'good') {
              score = 'bad'
            }
            if (meta.chave === 'ffoPayoutRatio' && val > 2.0 && score === 'bad') {
              score = 'medium'
            }
          } else {
            if (meta.chave === 'dividendYield' && val < 1.5 && score === 'good') {
              score = 'medium'
            }
            if (meta.chave === 'dividaEbitda' && val > 4 && score === 'bad') {
              score = 'medium'
            }
          }
        }

        // Additional REITs rules
        if (chave === 'liquidezCorrente' && typeof val === 'number') {
          if (meta.chave === 'ffo' && val < 0.8 && score === 'bad') {
            score = 'medium'
          }
          if (val > 3 && meta.chave === 'capRate' && score === 'bad') {
            score = 'medium'
          }
        }

        if (chave === 'capRate' && typeof val === 'number') {
          if (meta.chave === 'pVpa' && val > 8 && score === 'bad') {
            score = 'medium'
          }
          if (meta.chave === 'pVpa' && val < 4 && score === 'good') {
            score = 'medium'
          }
        }

        if (chave === 'affo' && typeof val === 'number') {
          if (meta.chave === 'ffo' && val < 0 && score === 'good') {
            score = 'medium'
          }

          if (meta.chave === 'ffo' && val > 0 && contexto.complementares) {
            const complementares = contexto.complementares as Record<string, number>
            const ffoValue = complementares.ffo

            if (typeof ffoValue === 'number' && val < ffoValue * 0.8) {
              score = 'medium'
            }
          }
        }

        // Economic cycle and growth vs income balance
        if (chave === 'dividaEbitda' && typeof val === 'number') {
          if (val > 8) {
            if (meta.chave === 'dividendYield' && score === 'good') {
              score = 'medium'
            }
            if (meta.chave === 'coberturaJuros' && score === 'bad') {
              score = 'bad'
            }
          }
        }

        if (chave === 'dividendCagr5y' && typeof val === 'number') {
          if (val > 10) {
            if (meta.chave === 'dividendYield' && score === 'bad') {
              score = 'medium'
            }
            if (meta.chave === 'ffoPayoutRatio' && score === 'good') {
              score = 'good'
            }
          }

          if (val < 3) {
            if (meta.chave === 'dividendYield' && score === 'good') {
              score = 'good'
            }
            if (meta.chave === 'ffoPayoutRatio' && score === 'bad') {
              score = 'medium'
            }
          }
        }
      }

      // ✅ REGRAS ESPECÍFICAS DE INDUSTRIALS
      if (setor === 'industrials') {
        if (chave === 'alavancagem' && typeof val === 'number') {
          if (meta.chave === 'roic' && val < 2 && score === 'bad') {
            score = 'medium'
          }
        }

        if (chave === 'coberturaJuros' && typeof val === 'number') {
          if (meta.chave === 'alavancagem' && val > 6 && score === 'bad') {
            score = 'medium'
          }
        }

        if (chave === 'giroAtivo' && typeof val === 'number') {
          if (meta.chave === 'roic' && val > 1.5 && score === 'bad') {
            score = 'medium'
          }
        }

        if (chave === 'margemEbitda' && typeof val === 'number') {
          if (meta.chave === 'alavancagem' && val > 25 && score === 'bad') {
            score = 'medium'
          }
        }

        if (chave === 'fcf' && typeof val === 'number') {
          if (meta.chave === 'dividendYield' && val > 0 && score === 'bad') {
            score = 'medium'
          }
        }

        if (chave === 'roe' && typeof val === 'number') {
          if (meta.chave === 'pb' && val > 15 && score === 'bad') {
            score = 'medium'
          }
        }

        if (chave === 'crescimentoReceita' && typeof val === 'number') {
          if (meta.chave === 'ps' && val > 8 && score === 'bad') {
            score = 'medium'
          }
        }
      }

      // ✅ DEMAIS SETORES (ENERGY, BASIC MATERIALS, etc.)
      if (setor === 'Energy') {
        if (chave === 'dividaEbitda' && typeof val === 'number') {
          if (meta.chave === 'roe' && val < 2 && score === 'bad') {
            score = 'medium'
          }
        }

        if (chave === 'coberturaJuros' && typeof val === 'number') {
          if (meta.chave === 'dividaEbitda' && val > 5 && score === 'bad') {
            score = 'medium'
          }
        }

        if (chave === 'freeCashFlow' && typeof val === 'number') {
          if (meta.chave === 'dividendYield' && val > 0 && score === 'bad') {
            score = 'medium'
          }
        }
      }

      // Continue for other sectors as needed...
    }
  }

  return {
    score,
    peso: meta.peso ?? 1,
    apenasInformativo: meta.apenasInformativo,
    explicacaoAuto: meta.explicacaoAuto,
    explicacaoCustom:
      typeof meta.explicacaoCustom === 'function'
        ? meta.explicacaoCustom({ valor, valorAnterior: contexto.valorAnterior, score, meta })
        : meta.explicacaoCustom,
  }
}
