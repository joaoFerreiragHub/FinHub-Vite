import { avaliarIndicadorComContexto } from "../hooks/avaliarIndicadorComContexto"
import { IndicatorValuePro } from "../quickAnalysis/IndicatorValuePro"

interface RatingsIndustrialsProps {
  // Rentabilidade e Eficiência (Props principais do JSX)
  margemEbitda: string
  margemEbitdaAnoAnterior?: string
  roic: string
  roicAnoAnterior?: string

  // Estrutura Financeira (Props principais do JSX)
  alavancagem: string
  alavancagemAnoAnterior?: string
  coberturaJuros: string
  coberturaJurosAnoAnterior?: string
  liquidezCorrente: string
  liquidezCorrenteAnoAnterior?: string

  // Eficiência Operacional (Props principais do JSX)
  rotatividadeEstoques: string
  rotatividadeEstoquesAnoAnterior?: string
  giroAtivo: string
  giroAtivoAnoAnterior?: string

  // Múltiplos de Valuation (Props principais do JSX)
  pe: string
  peAnoAnterior?: string
  pb: string
  pbAnoAnterior?: string
  ps: string
  psAnoAnterior?: string
  peg: string
  pegAnoAnterior?: string

  // Dividendos e Risco (Props principais do JSX)
  dividendYield: string
  dividendYieldAnoAnterior?: string
  beta: string
  betaAnoAnterior?: string

  // Props opcionais para métricas adicionais
  roe?: string
  roeAnoAnterior?: string
  margemOperacional?: string
  margemOperacionalAnoAnterior?: string
  margemLiquida?: string
  margemLiquidaAnoAnterior?: string
  endividamento?: string
  endividamentoAnoAnterior?: string
  cicloOperacional?: string
  cicloOperacionalAnoAnterior?: string
  payoutRatio?: string
  payoutRatioAnoAnterior?: string
  crescimentoReceita?: string
  crescimentoReceitaAnoAnterior?: string
  crescimentoEps?: string
  crescimentoEpsAnoAnterior?: string
  fcf?: string
  fcfAnoAnterior?: string
  capexOverRevenue?: string
  capexOverRevenueAnoAnterior?: string
}

interface Categoria {
  label: string
  chave: string
  valor: string
  anterior?: string
  icon?: string
  description?: string
}

export function RatingsIndustrials(props: RatingsIndustrialsProps) {
  // Calcular indicadores específicos de Industrials
  const calculateIndustrialsMetrics = () => {
    const rotatividadeEstoquesNum = parseFloat(props.rotatividadeEstoques) || 0
    const giroAtivoNum = parseFloat(props.giroAtivo) || 0
    const margemEbitdaNum = parseFloat(props.margemEbitda) || 0
    const alavancagemNum = parseFloat(props.alavancagem) || 0
    const roicNum = parseFloat(props.roic) || 0

    return {
      // Eficiência de Capital de Giro (estimado)
      eficienciaCapitalGiro: rotatividadeEstoquesNum > 6 && giroAtivoNum > 1 ? "85" :
                            rotatividadeEstoquesNum > 4 ? "70" : "50",

      // Qualidade dos Ativos (baseado no ROIC e Giro)
      qualidadeAtivos: roicNum > 12 && giroAtivoNum > 1.2 ? "90" :
                      roicNum > 8 ? "75" : "60",

      // Score de Alavancagem Operacional
      alavancagemOperacional: margemEbitdaNum > 20 && alavancagemNum < 2 ? "80" :
                             margemEbitdaNum > 15 ? "65" : "45",

      // Ciclo de Conversão de Caixa (estimado)
      cicloConversaoCaixa: rotatividadeEstoquesNum > 0 ? (365 / rotatividadeEstoquesNum).toFixed(0) : "0",

      // Intensidade de Capital
      intensidadeCapital: parseFloat(props.capexOverRevenue || "0") > 0 ?
                         props.capexOverRevenue :
                         margemEbitdaNum > 0 ? (20 - margemEbitdaNum * 0.3).toFixed(1) : "15",
    }
  }

  const calculatedMetrics = calculateIndustrialsMetrics()

  const categorias: Record<string, Categoria[]> = {
    "Rentabilidade e Eficiência": [
      {
        label: "Margem EBITDA",
        chave: "margemEbitda",
        valor: props.margemEbitda,
        anterior: props.margemEbitdaAnoAnterior,
        icon: "⚙️",
        description: "Margem EBITDA operacional"
      },
      {
        label: "ROIC",
        chave: "roic",
        valor: props.roic,
        anterior: props.roicAnoAnterior,
        icon: "🎯",
        description: "Retorno sobre Capital Investido"
      },
      ...(props.roe ? [{
        label: "ROE",
        chave: "roe",
        valor: props.roe,
        anterior: props.roeAnoAnterior,
        icon: "📈",
        description: "Retorno sobre Patrimônio Líquido"
      }] : []),
      ...(props.margemOperacional ? [{
        label: "Margem Operacional",
        chave: "margemOperacional",
        valor: props.margemOperacional,
        anterior: props.margemOperacionalAnoAnterior,
        icon: "🔧",
        description: "Margem operacional"
      }] : []),
      ...(props.margemLiquida ? [{
        label: "Margem Líquida",
        chave: "margemLiquida",
        valor: props.margemLiquida,
        anterior: props.margemLiquidaAnoAnterior,
        icon: "💎",
        description: "Margem líquida"
      }] : []),
    ],

    "Estrutura Financeira": [
      {
        label: "Alavancagem Financeira",
        chave: "alavancagem",
        valor: props.alavancagem,
        anterior: props.alavancagemAnoAnterior,
        icon: "⚖️",
        description: "Nível de alavancagem financeira"
      },
      {
        label: "Cobertura de Juros",
        chave: "coberturaJuros",
        valor: props.coberturaJuros,
        anterior: props.coberturaJurosAnoAnterior,
        icon: "🛡️",
        description: "Capacidade de pagamento de juros"
      },
      {
        label: "Liquidez Corrente",
        chave: "liquidezCorrente",
        valor: props.liquidezCorrente,
        anterior: props.liquidezCorrenteAnoAnterior,
        icon: "💧",
        description: "Liquidez de curto prazo"
      },
      ...(props.endividamento ? [{
        label: "Endividamento",
        chave: "endividamento",
        valor: props.endividamento,
        anterior: props.endividamentoAnoAnterior,
        icon: "⚠️",
        description: "Nível de endividamento"
      }] : []),
    ],

    "Eficiência Operacional": [
      {
        label: "Rotatividade de Estoques",
        chave: "rotatividadeEstoques",
        valor: props.rotatividadeEstoques,
        anterior: props.rotatividadeEstoquesAnoAnterior,
        icon: "📦",
        description: "Eficiência na gestão de estoques"
      },
      {
        label: "Giro do Ativo",
        chave: "giroAtivo",
        valor: props.giroAtivo,
        anterior: props.giroAtivoAnoAnterior,
        icon: "🔄",
        description: "Eficiência no uso dos ativos"
      },
      ...(props.cicloOperacional ? [{
        label: "Ciclo Operacional",
        chave: "cicloOperacional",
        valor: props.cicloOperacional,
        anterior: props.cicloOperacionalAnoAnterior,
        icon: "🔁",
        description: "Ciclo operacional em dias"
      }] : []),
      ...(props.capexOverRevenue ? [{
        label: "CapEx/Receita",
        chave: "capexOverRevenue",
        valor: props.capexOverRevenue,
        anterior: props.capexOverRevenueAnoAnterior,
        icon: "🏗️",
        description: "Investimentos em capital"
      }] : []),
    ],

    "Múltiplos de Valuation": [
      {
        label: "P/L",
        chave: "pe",
        valor: props.pe,
        anterior: props.peAnoAnterior,
        icon: "💲",
        description: "Preço sobre Lucro"
      },
      {
        label: "P/VPA",
        chave: "pb",
        valor: props.pb,
        anterior: props.pbAnoAnterior,
        icon: "🏦",
        description: "Preço sobre Valor Patrimonial"
      },
      {
        label: "P/S",
        chave: "ps",
        valor: props.ps,
        anterior: props.psAnoAnterior,
        icon: "💰",
        description: "Preço sobre Vendas"
      },
      {
        label: "PEG",
        chave: "peg",
        valor: props.peg,
        anterior: props.pegAnoAnterior,
        icon: "📊",
        description: "P/L ajustado pelo crescimento"
      },
    ],

    "Dividendos e Risco": [
      {
        label: "Dividend Yield",
        chave: "dividendYield",
        valor: props.dividendYield,
        anterior: props.dividendYieldAnoAnterior,
        icon: "💰",
        description: "Rendimento de dividendos"
      },
      {
        label: "Beta",
        chave: "beta",
        valor: props.beta,
        anterior: props.betaAnoAnterior,
        icon: "📉",
        description: "Volatilidade em relação ao mercado"
      },
      ...(props.payoutRatio ? [{
        label: "Payout Ratio",
        chave: "payoutRatio",
        valor: props.payoutRatio,
        anterior: props.payoutRatioAnoAnterior,
        icon: "💸",
        description: "% dos lucros distribuídos"
      }] : []),
    ],

    "Crescimento": [
      ...(props.crescimentoReceita ? [{
        label: "Crescimento Receita",
        chave: "crescimentoReceita",
        valor: props.crescimentoReceita,
        anterior: props.crescimentoReceitaAnoAnterior,
        icon: "📈",
        description: "Taxa de crescimento da receita"
      }] : []),
      ...(props.crescimentoEps ? [{
        label: "Crescimento EPS",
        chave: "crescimentoEps",
        valor: props.crescimentoEps,
        anterior: props.crescimentoEpsAnoAnterior,
        icon: "📊",
        description: "Crescimento do lucro por ação"
      }] : []),
    ],

    "Métricas Específicas de Industrials": [
      ...(props.fcf ? [{
        label: "Free Cash Flow",
        chave: "fcf",
        valor: props.fcf,
        anterior: props.fcfAnoAnterior,
        icon: "💵",
        description: "Fluxo de Caixa Livre"
      }] : []),
      {
        label: "Eficiência Capital de Giro",
        chave: "eficienciaCapitalGiro",
        valor: calculatedMetrics.eficienciaCapitalGiro,
        icon: "💼",
        description: "Eficiência na gestão do capital de giro"
      },
      {
        label: "Qualidade dos Ativos",
        chave: "qualidadeAtivos",
        valor: calculatedMetrics.qualidadeAtivos,
        icon: "🏭",
        description: "Qualidade e produtividade dos ativos"
      },
      {
        label: "Ciclo Conversão Caixa",
        chave: "cicloConversaoCaixa",
        valor: calculatedMetrics.cicloConversaoCaixa,
        icon: "🔄",
        description: "Dias para converter estoque em caixa"
      },
    ],
  };

  // Complementares incluindo métricas calculadas e dados base
  const complementares = {
    // Métricas calculadas
    eficienciaCapitalGiro: parseFloat(calculatedMetrics.eficienciaCapitalGiro || "0"),
    qualidadeAtivos: parseFloat(calculatedMetrics.qualidadeAtivos || "0"),
    alavancagemOperacional: parseFloat(calculatedMetrics.alavancagemOperacional || "0"),
    cicloConversaoCaixa: parseFloat(calculatedMetrics.cicloConversaoCaixa || "0"),
    intensidadeCapital: parseFloat(calculatedMetrics.intensidadeCapital || "0"),

    // Dados originais (valores atuais)
    margemEbitda: parseFloat(props.margemEbitda ?? "NaN"),
    roic: parseFloat(props.roic ?? "NaN"),
    alavancagem: parseFloat(props.alavancagem ?? "NaN"),
    coberturaJuros: parseFloat(props.coberturaJuros ?? "NaN"),
    liquidezCorrente: parseFloat(props.liquidezCorrente ?? "NaN"),
    rotatividadeEstoques: parseFloat(props.rotatividadeEstoques ?? "NaN"),
    pe: parseFloat(props.pe ?? "NaN"),
    pb: parseFloat(props.pb ?? "NaN"),
    ps: parseFloat(props.ps ?? "NaN"),
    peg: parseFloat(props.peg ?? "NaN"),
    dividendYield: parseFloat(props.dividendYield ?? "NaN"),
    beta: parseFloat(props.beta ?? "NaN"),
    giroAtivo: parseFloat(props.giroAtivo ?? "NaN"),
    roe: parseFloat(props.roe ?? "NaN"),
    margemOperacional: parseFloat(props.margemOperacional ?? "NaN"),
    margemLiquida: parseFloat(props.margemLiquida ?? "NaN"),
    endividamento: parseFloat(props.endividamento ?? "NaN"),
    cicloOperacional: parseFloat(props.cicloOperacional ?? "NaN"),
    payoutRatio: parseFloat(props.payoutRatio ?? "NaN"),
    crescimentoReceita: parseFloat(props.crescimentoReceita ?? "NaN"),
    crescimentoEps: parseFloat(props.crescimentoEps ?? "NaN"),
    fcf: parseFloat(props.fcf ?? "NaN"),
    capexOverRevenue: parseFloat(props.capexOverRevenue ?? "NaN"),

    // Dados anteriores (valores do ano anterior)
    margemEbitdaAnoAnterior: parseFloat(props.margemEbitdaAnoAnterior ?? "NaN"),
    roicAnoAnterior: parseFloat(props.roicAnoAnterior ?? "NaN"),
    alavancagemAnoAnterior: parseFloat(props.alavancagemAnoAnterior ?? "NaN"),
    coberturaJurosAnoAnterior: parseFloat(props.coberturaJurosAnoAnterior ?? "NaN"),
    liquidezCorrenteAnoAnterior: parseFloat(props.liquidezCorrenteAnoAnterior ?? "NaN"),
    rotatividadeEstoquesAnoAnterior: parseFloat(props.rotatividadeEstoquesAnoAnterior ?? "NaN"),
    peAnoAnterior: parseFloat(props.peAnoAnterior ?? "NaN"),
    pbAnoAnterior: parseFloat(props.pbAnoAnterior ?? "NaN"),
    psAnoAnterior: parseFloat(props.psAnoAnterior ?? "NaN"),
    pegAnoAnterior: parseFloat(props.pegAnoAnterior ?? "NaN"),
    dividendYieldAnoAnterior: parseFloat(props.dividendYieldAnoAnterior ?? "NaN"),
    betaAnoAnterior: parseFloat(props.betaAnoAnterior ?? "NaN"),
    giroAtivoAnoAnterior: parseFloat(props.giroAtivoAnoAnterior ?? "NaN"),
    roeAnoAnterior: parseFloat(props.roeAnoAnterior ?? "NaN"),
    margemOperacionalAnoAnterior: parseFloat(props.margemOperacionalAnoAnterior ?? "NaN"),
    margemLiquidaAnoAnterior: parseFloat(props.margemLiquidaAnoAnterior ?? "NaN"),
    endividamentoAnoAnterior: parseFloat(props.endividamentoAnoAnterior ?? "NaN"),
    cicloOperacionalAnoAnterior: parseFloat(props.cicloOperacionalAnoAnterior ?? "NaN"),
    payoutRatioAnoAnterior: parseFloat(props.payoutRatioAnoAnterior ?? "NaN"),
    crescimentoReceitaAnoAnterior: parseFloat(props.crescimentoReceitaAnoAnterior ?? "NaN"),
    crescimentoEpsAnoAnterior: parseFloat(props.crescimentoEpsAnoAnterior ?? "NaN"),
    fcfAnoAnterior: parseFloat(props.fcfAnoAnterior ?? "NaN"),
    capexOverRevenueAnoAnterior: parseFloat(props.capexOverRevenueAnoAnterior ?? "NaN"),
  }

  // Formatação adequada para Industrials
  const formatValue = (valor: string, chave: string) => {
    const num = parseFloat(valor)
    if (isNaN(num)) return valor

    // Percentuais
    if (['margemEbitda', 'roic', 'roe', 'margemOperacional', 'margemLiquida', 'endividamento', 'dividendYield', 'payoutRatio', 'crescimentoReceita', 'crescimentoEps', 'capexOverRevenue', 'eficienciaCapitalGiro', 'qualidadeAtivos', 'alavancagemOperacional', 'intensidadeCapital'].includes(chave)) {
      return `${num.toFixed(2)}%`
    }

    // Dias (ciclos)
    if (['cicloOperacional', 'cicloConversaoCaixa'].includes(chave)) {
      return `${num.toFixed(0)} dias`
    }

    // Valores monetários (FCF)
    if (['fcf'].includes(chave)) {
      if (Math.abs(num) > 1000000000) {
        return `${(num / 1000000000).toFixed(1)}B`
      }
      if (Math.abs(num) > 1000000) {
        return `${(num / 1000000).toFixed(1)}M`
      }
      return `${num.toFixed(2)}`
    }

    // Múltiplos e ratios
    if (['rotatividadeEstoques', 'giroAtivo'].includes(chave)) {
      return `${num.toFixed(1)}x`
    }

    // Ratios gerais
    return num.toFixed(2)
  }

  return (
    <div className="mt-6 space-y-8">
      {Object.entries(categorias).map(([categoria, indicadores]) => {
        // CORREÇÃO: Filtrar indicadores válidos passando o valorAnterior correto
        const indicadoresValidos = indicadores.filter(({ label, valor, anterior }) => {
          const numeric = parseFloat(valor)
          // Aceitar qualquer valor numérico válido (incluindo 0)
          if (isNaN(numeric)) return false

          const prev = anterior ? parseFloat(anterior) : undefined

          const { apenasInformativo } = avaliarIndicadorComContexto(
            "industrials",
            label,
            numeric,
            {
              valorAnterior: prev, // ← CORREÇÃO: Passar o valor anterior correto
              complementares,
            }
          )
          return !apenasInformativo
        })

        // Se não há indicadores válidos, não renderizar a categoria
        if (indicadoresValidos.length === 0) return null

        return (
          <div key={categoria} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
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
                    "industrials",
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
