// src/hooks/avaliarIndicadorComContexto.ts

import { FinancialComplementares } from "../../../utils/complementares/financialComplementares"
import { HealthcareComplementares } from "../../../utils/complementares/healthcareComplementares"
import { RealEstateComplementares } from "../../../utils/complementares/realEstateComplementares"
import { TechnologyComplementares } from "../../../utils/complementares/technologyComplementares"
import { IndustrialsComplementares } from "../../../utils/complementares/industrialsComplementares"
import { EnergyComplementares } from "../../../utils/complementares/energyComplementares" // ✅ CORRIGIDO
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
  IndicadorMeta
} from "../sections/indicadoresMeta"
import { thresholds, Setor } from "../StockSectors/thresholds"
import { getScoreByThreshold } from "./getScoreByThreshold"
import { getScoreByThresholdWithDelta } from "./getScoreByThresholdWithDelta"


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
  "Real Estate": indicadoresMetaReits,
  industrials: indicadoresMetaIndustrials,
  Energy: indicadoresMetaEnergy,
  "Consumer Defensive": indicadoresMetaConsumerDefensive,
  "Financial Services": indicadoresMetaFinancials,
  "Consumer Cyclical": indicadoresMetaConsumerCyclical,
  "Communication Services": indicadoresMetaCommunicationServices,
  "Basic Materials": indicadoresMetaBasicMaterials,
}

// ✅ CORRIGIDO: Type union incluindo Energy
type SectorSpecificComplementares =
  | TechnologyComplementares
  | HealthcareComplementares
  | FinancialComplementares
  | RealEstateComplementares
  | IndustrialsComplementares
  | EnergyComplementares // ✅ ADICIONADO
  | Record<string, number>

export function avaliarIndicadorComContexto(
  setor: Setor,
  label: string,
  valor: number,
  contexto: {
    valorAnterior?: number
    // ✅ CORRIGIDO: Complementares tipados incluindo Energy
    complementares?: SectorSpecificComplementares
  } = {}
): AvaliacaoIndicador {
  const metas = indicadoresMetaPorSetor[setor]
  const meta = metas.find((m) => m.label === label)

  if (!meta) {
    console.warn(`Indicador "${label}" não encontrado nos metadados do setor ${setor}`)
    return { score: 'bad', peso: 1 }
  }

  const defaultThresholds = {} as Partial<typeof thresholds[keyof typeof thresholds]>
  const thresholdSetor = thresholds[setor] || defaultThresholds
  const threshold = thresholdSetor?.[meta.chave as keyof typeof thresholdSetor]

  let score: 'good' | 'medium' | 'bad'

  if (meta.ajustarComDelta && typeof contexto.valorAnterior === 'number') {
    score = getScoreByThresholdWithDelta(valor, contexto.valorAnterior, threshold)
  } else {
    score = getScoreByThreshold(valor.toString(), threshold)
  }

  // ✅ REGRAS ESPECÍFICAS POR INDICADOR (mantidas)
  if (meta.chave === 'roic' && typeof contexto.valorAnterior === 'number') {
    const delta = Math.abs(valor - contexto.valorAnterior)
    if (delta > 30) {
      score = 'medium'
    }
  }

  if (meta.chave === 'liquidezCorrente' && typeof valor === 'number') {
    // ✅ CORRIGIDO: Verifica se complementares existe E tem freeCashFlow
    if (contexto.complementares && 'freeCashFlow' in contexto.complementares) {
      const fcf = contexto.complementares.freeCashFlow
      if (valor < 0.5 && typeof fcf === 'number' && fcf > 0) {
        score = 'medium'
      }
    }
  }

  // ✅ AVALIAÇÃO DE COMPLEMENTARES - AGORA ESPECÍFICA POR SETOR
  if (meta.complementar && contexto.complementares) {
    for (const chave of meta.complementar) {
      const val = contexto.complementares[chave as keyof SectorSpecificComplementares]

      // ✅ REGRAS GERAIS (aplicáveis a todos os setores)
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

      // ✅ NOVO: Regra geral para basileia (aplicável a Financial Services)
      if (chave === 'basileia' && typeof val === 'number') {
        if (meta.chave === 'dividendYield' && val < 11 && score === 'good') {
          score = 'medium' // Yield alto com capital baixo pode ser insustentável
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
        // Regra: ROE alto com alavancagem excessiva
        if (chave === 'alavancagem' && typeof val === 'number') {
          if (meta.chave === 'roe' && val > 12 && score === 'good') {
            score = 'medium' // ROE pode estar artificialmente inflado por alavancagem
          }
        }

        // Regra: Eficiência com contexto de NIM
        if (chave === 'nim' && typeof val === 'number') {
          if (meta.chave === 'eficiencia' && val < 3 && score === 'good') {
            score = 'medium' // Eficiência pode estar mascarando problemas de margem
          }
        }

        // Regra: P/VPA com contexto de ROE
        if (chave === 'roe' && typeof val === 'number') {
          if (meta.chave === 'pvpa' && val < 10 && score === 'bad') {
            score = 'medium' // P/VPA baixo pode ser justificado por ROE baixo
          }
        }

        // Regra: Inadimplência com cobertura
        if (chave === 'cobertura' && typeof val === 'number') {
          if (meta.chave === 'inadimplencia' && val > 150 && score === 'bad') {
            score = 'medium' // Cobertura alta pode compensar inadimplência elevada
          }
        }

        // Regra: LDR com liquidez
        if (chave === 'liquidez' && typeof val === 'number') {
          if (meta.chave === 'ldr' && val > 1.5 && score === 'bad') {
            score = 'medium' // Liquidez alta pode compensar LDR elevado
          }
        }

        // Regra: Liquidez com contexto de Tier 1 (equivalente bancário do FCF)
        if (chave === 'tier1' && typeof val === 'number') {
          if (meta.chave === 'liquidez' && val > 12 && score === 'bad') {
            score = 'medium' // Capital forte pode compensar liquidez baixa temporária
          }
        }
      }

      // ✅ REGRAS ESPECÍFICAS DE REAL ESTATE
      if (setor === 'Real Estate') {
        // Regra: Dividend Yield vs FFO Payout
        if (chave === 'ffoPayoutRatio' && typeof val === 'number') {
          if (meta.chave === 'dividendYield' && val > 95 && score === 'good') {
            score = 'medium' // Payout muito alto pode comprometer sustentabilidade
          }
        }

        // Regra: Ocupação vs NOI
        if (chave === 'noi' && typeof val === 'number') {
          if (meta.chave === 'ocupacao' && val < 0 && score === 'good') {
            score = 'medium' // Ocupação alta com NOI negativo é preocupante
          }
        }

        // Regra: Dívida vs FFO
        if (chave === 'ffo' && typeof val === 'number') {
          if (meta.chave === 'dividaEbitda' && val < 2 && score === 'bad') {
            score = 'medium' // FFO baixo pode justificar dívida alta temporariamente
          }
        }

        // Regra: P/FFO vs FFO
        if (chave === 'ffo' && typeof val === 'number') {
          if (meta.chave === 'pFfo' && val > 3 && score === 'bad') {
            score = 'medium' // FFO alto pode justificar P/FFO elevado
          }
        }

        // Regra: Cap Rate vs Ocupação
        if (chave === 'ocupacao' && typeof val === 'number') {
          if (meta.chave === 'capRate' && val > 90 && score === 'bad') {
            score = 'medium' // Ocupação alta pode compensar cap rate baixo
          }
        }
      }

      // ✅ REGRAS ESPECÍFICAS DE INDUSTRIALS
      if (setor === 'industrials') {
        // Regra: ROIC vs Alavancagem
        if (chave === 'alavancagem' && typeof val === 'number') {
          if (meta.chave === 'roic' && val < 2 && score === 'bad') {
            score = 'medium' // Alavancagem baixa pode compensar ROIC temporariamente baixo
          }
        }

        // Regra: Cobertura de Juros vs Alavancagem
        if (chave === 'coberturaJuros' && typeof val === 'number') {
          if (meta.chave === 'alavancagem' && val > 6 && score === 'bad') {
            score = 'medium' // Cobertura forte pode permitir alavancagem maior
          }
        }

        // Regra: Giro do Ativo vs ROIC
        if (chave === 'giroAtivo' && typeof val === 'number') {
          if (meta.chave === 'roic' && val > 1.5 && score === 'bad') {
            score = 'medium' // Giro alto pode compensar ROIC baixo temporário
          }
        }

        // Regra: Margem EBITDA vs Alavancagem
        if (chave === 'margemEbitda' && typeof val === 'number') {
          if (meta.chave === 'alavancagem' && val > 25 && score === 'bad') {
            score = 'medium' // Margem EBITDA muito alta pode permitir alavancagem maior
          }
        }

        // Regra: Beta vs Cobertura de Juros
        if (chave === 'coberturaJuros' && typeof val === 'number') {
          if (meta.chave === 'beta' && val > 5 && score === 'bad') {
            score = 'medium' // Cobertura forte reduz risco apesar de beta alto
          }
        }

        // Regra: FCF vs Dividend Yield
        if (chave === 'fcf' && typeof val === 'number') {
          if (meta.chave === 'dividendYield' && val > 0 && score === 'bad') {
            score = 'medium' // FCF positivo pode sustentar yield baixo temporário
          }
        }

        // Regra: P/VPA vs ROE
        if (chave === 'roe' && typeof val === 'number') {
          if (meta.chave === 'pb' && val > 15 && score === 'bad') {
            score = 'medium' // ROE alto pode justificar P/VPA elevado
          }
        }

        // Regra: Crescimento Receita vs P/S
        if (chave === 'crescimentoReceita' && typeof val === 'number') {
          if (meta.chave === 'ps' && val > 8 && score === 'bad') {
            score = 'medium' // Crescimento forte pode justificar P/S alto
          }
        }
      }

      // ✅ NOVO: REGRAS ESPECÍFICAS DE ENERGY
      if (setor === 'Energy') {
        // Regra: ROE vs Dívida/EBITDA
        if (chave === 'dividaEbitda' && typeof val === 'number') {
          if (meta.chave === 'roe' && val < 2 && score === 'bad') {
            score = 'medium' // Baixo endividamento pode compensar ROE baixo temporário
          }
        }

        // Regra: Cobertura de Juros vs Dívida/EBITDA
        if (chave === 'coberturaJuros' && typeof val === 'number') {
          if (meta.chave === 'dividaEbitda' && val > 5 && score === 'bad') {
            score = 'medium' // Cobertura forte pode permitir endividamento maior
          }
        }

        // Regra: FCF vs Dividend Yield
        if (chave === 'freeCashFlow' && typeof val === 'number') {
          if (meta.chave === 'dividendYield' && val > 0 && score === 'bad') {
            score = 'medium' // FCF positivo pode sustentar yield baixo temporário
          }
        }

        // Regra: Margem EBITDA vs Dívida/EBITDA
        if (chave === 'margemEbitda' && typeof val === 'number') {
          if (meta.chave === 'dividaEbitda' && val > 30 && score === 'bad') {
            score = 'medium' // Margem EBITDA muito alta pode permitir endividamento maior
          }
        }

        // Regra: Beta vs Cobertura de Juros
        if (chave === 'coberturaJuros' && typeof val === 'number') {
          if (meta.chave === 'beta' && val > 5 && score === 'bad') {
            score = 'medium' // Cobertura forte reduz risco apesar de beta alto
          }
        }

        // Regra: Custo Produção vs Break-even
        if (chave === 'custoProducao' && typeof val === 'number') {
          if (meta.chave === 'breakEvenPrice' && val < 40 && score === 'bad') {
            score = 'medium' // Custo baixo pode compensar break-even alto temporário
          }
        }

        // Regra: FCF Yield vs Payout Ratio
        if (chave === 'fcfYield' && typeof val === 'number') {
          if (meta.chave === 'payoutRatio' && val > 8 && score === 'bad') {
            score = 'medium' // FCF Yield alto pode sustentar payout alto
          }
        }

        // Regra: Reservas vs CapEx
        if (chave === 'reservasProvadas' && typeof val === 'number') {
          if (meta.chave === 'capexRevenue' && val > 0 && score === 'bad') {
            score = 'medium' // Reservas provadas podem justificar CapEx alto
          }
        }
      }
    }
  }

  return {
    score,
    peso: meta.peso ?? 1,
    apenasInformativo: meta.apenasInformativo,
    explicacaoAuto: meta.explicacaoAuto,
    explicacaoCustom: typeof meta.explicacaoCustom === 'function'
      ? meta.explicacaoCustom({ valor, valorAnterior: contexto.valorAnterior, score, meta })
      : meta.explicacaoCustom,
  }
}
