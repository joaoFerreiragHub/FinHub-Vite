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
  "Real Estate":indicadoresMetaReits,
  industrials: indicadoresMetaIndustrials,
  Energy: indicadoresMetaEnergy,
  "Consumer Defensive": indicadoresMetaConsumerDefensive,
  "Financial Services": indicadoresMetaFinancials,
  "Consumer Cyclical" : indicadoresMetaConsumerCyclical,
  "Communication Services": indicadoresMetaCommunicationServices,
  "Basic Materials": indicadoresMetaBasicMaterials,
}

export function avaliarIndicadorComContexto(
  setor: Setor,
  label: string,
  valor: number,
  contexto: {
    valorAnterior?: number
    complementares?: Record<string, number>
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

  if (meta.chave === 'roic' && typeof contexto.valorAnterior === 'number') {
    const delta = Math.abs(valor - contexto.valorAnterior)
    if (delta > 30) {
      score = 'medium'
    }
  }

  if (meta.chave === 'liquidezCorrente' && typeof valor === 'number') {
    const fcf = contexto.complementares?.freeCashFlow
    if (valor < 0.5 && typeof fcf === 'number' && fcf > 0) {
      score = 'medium'
    }
  }

  if (meta.complementar && contexto.complementares) {
    for (const chave of meta.complementar) {
      const val = contexto.complementares[chave]

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

      if (chave === 'fcf' && typeof val === 'number') {
        if (meta.chave === 'debtToEbitda' && val > 0 && score === 'bad') {
          score = 'medium'
        }
      }

      if (chave === 'rAnddEfficiency' && typeof val === 'number') {
        if (meta.chave === 'investimentoPD' && val < 0.5 && score === 'good') {
          score = 'medium'
        }
      }

      if (chave === 'receitasRecorrentesPercent' && typeof val === 'number') {
        if (meta.chave === 'beta' && val > 80 && score === 'bad') {
          score = 'medium'
        }
      }

      if (chave === 'sgaOverRevenue' && typeof val === 'number') {
        if (meta.chave === 'margemEbitda' && val > 0.3 && score === 'good') {
          score = 'medium'
        }
      }

      if (chave === 'eps' && typeof val === 'number') {
        if (meta.chave === 'payoutRatio' && val < 0 && score === 'medium') {
          score = 'bad'
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
