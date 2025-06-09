import { avaliarIndicadorComContexto } from "../hooks/avaliarIndicadorComContexto"
import { IndicatorValuePro } from "../quickAnalysis/IndicatorValuePro"

interface RatingsFinancialsProps {
  // Rentabilidade e Eficiência
  roe: string
  roeAnoAnterior?: string
  eficiencia: string
  eficienciaAnoAnterior?: string
  nim: string // Net Interest Margin
  nimAnoAnterior?: string

  // Solidez e Capitalização
  basileia: string
  basileiaAnoAnterior?: string
  tier1: string
  tier1AnoAnterior?: string

  // Estrutura de Capital e Risco
  alavancagem: string
  alavancagemAnoAnterior?: string
  liquidez: string
  liquidezAnoAnterior?: string
  inadimplencia: string
  inadimplenciaAnoAnterior?: string
  cobertura: string
  coberturaAnoAnterior?: string

  // Múltiplos de Avaliação
  pl: string
  plAnoAnterior?: string
  pvpa: string
  pvpaAnoAnterior?: string

  // Dividendos e Retorno
  dividendYield: string
  dividendYieldAnoAnterior?: string
  payoutRatio: string
  payoutRatioAnoAnterior?: string

  // Métricas Específicas de Bancos
  ldr: string // Loan-to-Deposit Ratio
  ldrAnoAnterior?: string
  beta: string
  betaAnoAnterior?: string
  leveredDcf: string
  leveredDcfAnoAnterior?: string
  precoAtual: string
  precoAtualAnoAnterior?: string

  // Métricas Adicionais Opcionais
  roa?: string // Return on Assets
  roaAnoAnterior?: string
  custoCredito?: string
  custoCreditoAnoAnterior?: string
  crescimentoCarteira?: string
  crescimentoCarteiraAnoAnterior?: string
}

interface Categoria {
  label: string
  chave: string
  valor: string
  anterior?: string
  icon?: string
  description?: string
}

export function RatingsFinancials(props: RatingsFinancialsProps) {
  // Calcular métricas específicas de bancos
  const calculateBankingMetrics = () => {
    const roeNum = parseFloat(props.roe) || 0
    const eficienciaNum = parseFloat(props.eficiencia) || 0
    const basileiaNum = parseFloat(props.basileia) || 0
    const inadimplenciaNum = parseFloat(props.inadimplencia) || 0
    const coberturaNum = parseFloat(props.cobertura) || 0

    return {
      // Score de Qualidade de Crédito
      qualidadeCredito: inadimplenciaNum < 2 && coberturaNum > 120 ? "90" :
                       inadimplenciaNum < 3.5 && coberturaNum > 100 ? "75" : "50",

      // Eficiência Operacional Ajustada
      eficienciaAjustada: eficienciaNum < 45 ? "85" :
                         eficienciaNum < 55 ? "70" : "45",

      // Score de Solidez Patrimonial
      solidezPatrimonial: basileiaNum > 14 && roeNum > 15 ? "95" :
                         basileiaNum > 11 && roeNum > 12 ? "80" : "60",
    }
  }

  const calculatedMetrics = calculateBankingMetrics()

  const categorias: Record<string, Categoria[]> = {
    "Rentabilidade e Eficiência": [
      {
        label: "ROE",
        chave: "roe",
        valor: props.roe,
        anterior: props.roeAnoAnterior,
        icon: "📈",
        description: "Retorno sobre Patrimônio Líquido"
      },
      {
        label: "Eficiência",
        chave: "eficiencia",
        valor: props.eficiencia,
        anterior: props.eficienciaAnoAnterior,
        icon: "⚙️",
        description: "Índice de Eficiência (quanto menor, melhor)"
      },
      {
        label: "NIM",
        chave: "nim",
        valor: props.nim,
        anterior: props.nimAnoAnterior,
        icon: "💰",
        description: "Margem Financeira Líquida"
      },
      ...(props.roa ? [{
        label: "ROA",
        chave: "roa",
        valor: props.roa,
        anterior: props.roaAnoAnterior,
        icon: "🎯",
        description: "Retorno sobre Ativos"
      }] : []),
    ],

    "Solidez e Capitalização": [
      {
        label: "Basileia",
        chave: "basileia",
        valor: props.basileia,
        anterior: props.basileiaAnoAnterior,
        icon: "🏛️",
        description: "Índice de Basileia"
      },
      {
        label: "Tier 1",
        chave: "tier1",
        valor: props.tier1,
        anterior: props.tier1AnoAnterior,
        icon: "🛡️",
        description: "Capital Principal"
      },
    ],

    "Estrutura de Capital e Risco": [
      {
        label: "Alavancagem",
        chave: "alavancagem",
        valor: props.alavancagem,
        anterior: props.alavancagemAnoAnterior,
        icon: "⚖️",
        description: "Índice de Alavancagem"
      },
      {
        label: "Liquidez",
        chave: "liquidez",
        valor: props.liquidez,
        anterior: props.liquidezAnoAnterior,
        icon: "💧",
        description: "Liquidez Corrente"
      },
      {
        label: "Inadimplência",
        chave: "inadimplencia",
        valor: props.inadimplencia,
        anterior: props.inadimplenciaAnoAnterior,
        icon: "⚠️",
        description: "Taxa de Inadimplência"
      },
      {
        label: "Cobertura",
        chave: "cobertura",
        valor: props.cobertura,
        anterior: props.coberturaAnoAnterior,
        icon: "🛡️",
        description: "Cobertura de Provisões"
      },
      ...(props.custoCredito ? [{
        label: "Custo do Crédito",
        chave: "custoCredito",
        valor: props.custoCredito,
        anterior: props.custoCreditoAnoAnterior,
        icon: "💸",
        description: "Custo do Risco de Crédito"
      }] : []),
    ],

    "Múltiplos de Avaliação": [
      {
        label: "P/L",
        chave: "pl",
        valor: props.pl,
        anterior: props.plAnoAnterior,
        icon: "💲",
        description: "Preço sobre Lucro"
      },
      {
        label: "P/VPA",
        chave: "pvpa",
        valor: props.pvpa,
        anterior: props.pvpaAnoAnterior,
        icon: "🏦",
        description: "Preço sobre Valor Patrimonial"
      },
      {
        label: "Valuation (DCF)",
        chave: "leveredDcf",
        valor: props.leveredDcf,
        anterior: props.leveredDcfAnoAnterior,
        icon: "📊",
        description: "Fluxo de Caixa Descontado"
      },
    ],

    "Dividendos e Retorno": [
      {
        label: "Dividend Yield",
        chave: "dividendYield",
        valor: props.dividendYield,
        anterior: props.dividendYieldAnoAnterior,
        icon: "💰",
        description: "Rendimento de Dividendos"
      },
      {
        label: "Payout Ratio",
        chave: "payoutRatio",
        valor: props.payoutRatio,
        anterior: props.payoutRatioAnoAnterior,
        icon: "💸",
        description: "% dos lucros distribuídos"
      },
    ],

    "Métricas Específicas Bancárias": [
      {
        label: "LDR",
        chave: "ldr",
        valor: props.ldr,
        anterior: props.ldrAnoAnterior,
        icon: "🔄",
        description: "Loan-to-Deposit Ratio"
      },
      {
        label: "Beta",
        chave: "beta",
        valor: props.beta,
        anterior: props.betaAnoAnterior,
        icon: "📉",
        description: "Volatilidade vs. mercado"
      },
      ...(props.crescimentoCarteira ? [{
        label: "Crescimento Carteira",
        chave: "crescimentoCarteira",
        valor: props.crescimentoCarteira,
        anterior: props.crescimentoCarteiraAnoAnterior,
        icon: "📈",
        description: "Crescimento da carteira de crédito"
      }] : []),
      {
        label: "Qualidade de Crédito",
        chave: "qualidadeCredito",
        valor: calculatedMetrics.qualidadeCredito,
        icon: "🏅",
        description: "Score de qualidade da carteira"
      },
      {
        label: "Solidez Patrimonial",
        chave: "solidezPatrimonial",
        valor: calculatedMetrics.solidezPatrimonial,
        icon: "🏛️",
        description: "Score de solidez do patrimônio"
      },
      {
        label: "Eficiência Ajustada",
        chave: "eficienciaAjustada",
        valor: calculatedMetrics.eficienciaAjustada,
        icon: "⚙️",
        description: "Score de eficiência operacional ajustado"
      },
    ],
  };

  // Complementares incluindo métricas calculadas e dados base
  const complementares = {
    // Métricas calculadas
    qualidadeCredito: parseFloat(calculatedMetrics.qualidadeCredito || "0"),
    eficienciaAjustada: parseFloat(calculatedMetrics.eficienciaAjustada || "0"),
    solidezPatrimonial: parseFloat(calculatedMetrics.solidezPatrimonial || "0"),

    // Dados originais (valores atuais)
    roe: parseFloat(props.roe ?? "NaN"),
    eficiencia: parseFloat(props.eficiencia ?? "NaN"),
    nim: parseFloat(props.nim ?? "NaN"),
    basileia: parseFloat(props.basileia ?? "NaN"),
    tier1: parseFloat(props.tier1 ?? "NaN"),
    alavancagem: parseFloat(props.alavancagem ?? "NaN"),
    liquidez: parseFloat(props.liquidez ?? "NaN"),
    inadimplencia: parseFloat(props.inadimplencia ?? "NaN"),
    cobertura: parseFloat(props.cobertura ?? "NaN"),
    pl: parseFloat(props.pl ?? "NaN"),
    pvpa: parseFloat(props.pvpa ?? "NaN"),
    dividendYield: parseFloat(props.dividendYield ?? "NaN"),
    payoutRatio: parseFloat(props.payoutRatio ?? "NaN"),
    ldr: parseFloat(props.ldr ?? "NaN"),
    beta: parseFloat(props.beta ?? "NaN"),
    leveredDcf: parseFloat(props.leveredDcf ?? "NaN"),
    precoAtual: parseFloat(props.precoAtual ?? "NaN"),
    roa: parseFloat(props.roa ?? "NaN"),
    custoCredito: parseFloat(props.custoCredito ?? "NaN"),
    crescimentoCarteira: parseFloat(props.crescimentoCarteira ?? "NaN"),

    // Dados anteriores
    roeAnoAnterior: parseFloat(props.roeAnoAnterior ?? "NaN"),
    eficienciaAnoAnterior: parseFloat(props.eficienciaAnoAnterior ?? "NaN"),
    nimAnoAnterior: parseFloat(props.nimAnoAnterior ?? "NaN"),
    basileiaAnoAnterior: parseFloat(props.basileiaAnoAnterior ?? "NaN"),
    tier1AnoAnterior: parseFloat(props.tier1AnoAnterior ?? "NaN"),
    alavancagemAnoAnterior: parseFloat(props.alavancagemAnoAnterior ?? "NaN"),
    liquidezAnoAnterior: parseFloat(props.liquidezAnoAnterior ?? "NaN"),
    inadimplenciaAnoAnterior: parseFloat(props.inadimplenciaAnoAnterior ?? "NaN"),
    coberturaAnoAnterior: parseFloat(props.coberturaAnoAnterior ?? "NaN"),
    plAnoAnterior: parseFloat(props.plAnoAnterior ?? "NaN"),
    pvpaAnoAnterior: parseFloat(props.pvpaAnoAnterior ?? "NaN"),
    dividendYieldAnoAnterior: parseFloat(props.dividendYieldAnoAnterior ?? "NaN"),
    payoutRatioAnoAnterior: parseFloat(props.payoutRatioAnoAnterior ?? "NaN"),
    ldrAnoAnterior: parseFloat(props.ldrAnoAnterior ?? "NaN"),
    betaAnoAnterior: parseFloat(props.betaAnoAnterior ?? "NaN"),
    leveredDcfAnoAnterior: parseFloat(props.leveredDcfAnoAnterior ?? "NaN"),
    precoAtualAnoAnterior: parseFloat(props.precoAtualAnoAnterior ?? "NaN"),
    roaAnoAnterior: parseFloat(props.roaAnoAnterior ?? "NaN"),
    custoCreditoAnoAnterior: parseFloat(props.custoCreditoAnoAnterior ?? "NaN"),
    crescimentoCarteiraAnoAnterior: parseFloat(props.crescimentoCarteiraAnoAnterior ?? "NaN"),
  }

  // Formatação adequada para bancos
  const formatValue = (valor: string, chave: string) => {
    const num = parseFloat(valor)
    if (isNaN(num)) return valor

    // Percentuais
    if (['roe', 'eficiencia', 'nim', 'basileia', 'tier1', 'inadimplencia', 'cobertura', 'dividendYield', 'payoutRatio', 'ldr', 'roa', 'custoCredito', 'crescimentoCarteira', 'qualidadeCredito', 'eficienciaAjustada', 'solidezPatrimonial'].includes(chave)) {
      return `${num.toFixed(2)}%`
    }

    // Valores monetários (DCF)
    if (['leveredDcf', 'precoAtual'].includes(chave)) {
      return `${num.toFixed(2)}`
    }

    // Ratios gerais
    return num.toFixed(2)
  }

  return (
    <div className="mt-6 space-y-8">
      {Object.entries(categorias).map(([categoria, indicadores]) => {
        // Filtrar indicadores válidos passando o valorAnterior correto
        const indicadoresValidos = indicadores.filter(({ label, valor, anterior }) => {
          const numeric = parseFloat(valor)
          if (isNaN(numeric)) return false

          const prev = anterior ? parseFloat(anterior) : undefined

          const { apenasInformativo } = avaliarIndicadorComContexto(
            "Financial Services", // ou "banking"
            label,
            numeric,
            {
              valorAnterior: prev,
              complementares,
            }
          )
          return !apenasInformativo
        })

        // Se não há indicadores válidos, não renderizar a categoria
        if (indicadoresValidos.length === 0) return null

        return (
          <div key={categoria} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {categoria}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({indicadoresValidos.length} indicador{indicadoresValidos.length !== 1 ? 'es' : ''})
                </span>
              </h3>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {indicadoresValidos.map(({ label, valor, anterior, icon, description, chave }) => {
                  const numeric = parseFloat(valor)
                  const prev = anterior ? parseFloat(anterior) : undefined

                  const { score, explicacaoCustom } = avaliarIndicadorComContexto(
                    "Financial Services", // ou "banking"
                    label,
                    numeric,
                    {
                      valorAnterior: prev,
                      complementares,
                    }
                  )

                  const hasImprovement = prev !== undefined && numeric > prev
                  const hasDeterioration = prev !== undefined && numeric < prev

                  return (
                    <div key={label} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {icon && <span className="text-lg">{icon}</span>}
                          <div>
                            <h4 className="font-medium text-gray-800 text-sm">{label}</h4>
                            {description && (
                              <p className="text-xs text-gray-500 mt-1">{description}</p>
                            )}
                          </div>
                        </div>
                        <IndicatorValuePro
                          score={score}
                          tooltip={
                            explicacaoCustom && explicacaoCustom.trim() !== ""
                              ? explicacaoCustom
                              : `Benchmark definido para o indicador "${label}".`
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          {formatValue(valor, chave)}
                        </span>

                        {anterior && (
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-gray-500">vs.</span>
                            <span className="text-gray-600">{formatValue(anterior, chave)}</span>
                            {hasImprovement && <span className="text-green-500">↗</span>}
                            {hasDeterioration && <span className="text-red-500">↘</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
