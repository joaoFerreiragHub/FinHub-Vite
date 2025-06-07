import { getScoreByThreshold } from '../hooks/getScoreByThreshold'
import { IndicatorValuePro } from '../quickAnalysis/IndicatorValuePro'
import { thresholds } from './thresholds'

interface RatingsTechProps {
  // Crescimento e Performance
  crescimentoReceita: string
  cagrEps: string
  eps: string

  // Margens e Rentabilidade
  margemBruta: string
  margemEbitda: string
  margemLiquida: string
  margemOperacional: string

  // Retorno sobre Capital
  roic: string
  roe: string

  // Múltiplos de Avaliação
  pl: string
  ps: string
  peg: string

  // Estrutura de Capital e Liquidez
  debtToEbitda: string
  liquidezCorrente: string
  cashRatio: string

  // Risco e Volatilidade
  beta: string

  // Métricas Específicas de Tech
  investimentoPD: string
  rAnddEfficiency: string
  cashFlowOverCapex: string
  fcf: string
  sgaOverRevenue: string
  payoutRatio: string
}

export function RatingsTech(props: RatingsTechProps) {
  const t = thresholds.Technology

  // Organização dos indicadores por categoria para melhor visualização
  const crescimentoIndicadores = [
    { label: 'Crescimento Receita', value: props.crescimentoReceita, key: 'Crescimento Receita' },
    { label: 'CAGR EPS', value: props.cagrEps, key: 'CAGR EPS' },
    { label: 'EPS', value: props.eps, key: 'EPS' },
  ]

  const rentabilidadeIndicadores = [
    { label: 'Margem Bruta', value: props.margemBruta, key: 'Margem Bruta' },
    { label: 'Margem EBITDA', value: props.margemEbitda, key: 'Margem EBITDA' },
    { label: 'Margem Líquida', value: props.margemLiquida, key: 'Margem Líquida' },
    { label: 'Margem Operacional', value: props.margemOperacional, key: 'Margem Operacional' },
  ]

  const retornoIndicadores = [
    { label: 'ROIC', value: props.roic, key: 'ROIC' },
    { label: 'ROE', value: props.roe, key: 'ROE' },
  ]

  const avaliacaoIndicadores = [
    { label: 'P/L', value: props.pl, key: 'P/L' },
    { label: 'P/S', value: props.ps, key: 'P/S' },
    { label: 'PEG', value: props.peg, key: 'PEG' },
  ]

  const estruturaCapitalIndicadores = [
    { label: 'Dívida/EBITDA', value: props.debtToEbitda, key: 'Dívida/EBITDA' },
    { label: 'Liquidez Corrente', value: props.liquidezCorrente, key: 'Liquidez Corrente' },
    { label: 'Cash Ratio', value: props.cashRatio, key: 'Cash Ratio' },
  ]

  const techEspecificosIndicadores = [
    { label: 'Investimento em P&D', value: props.investimentoPD, key: 'Investimento em P&D' },
    { label: 'Eficiência de P&D', value: props.rAnddEfficiency, key: 'Eficiência de P&D' },
    { label: 'Cash Flow / CapEx', value: props.cashFlowOverCapex, key: 'Cash Flow / CapEx' },
    { label: 'Free Cash Flow', value: props.fcf, key: 'Free Cash Flow' },
    { label: 'SG&A / Receita', value: props.sgaOverRevenue, key: 'SG&A / Receita' },
    { label: 'Payout Ratio', value: props.payoutRatio, key: 'Payout Ratio' },
    { label: 'Beta', value: props.beta, key: 'Beta' },
  ]

  const formatValue = (value: string, key: string) => {
    // Função para formatar valores baseado no tipo de indicador
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return value

    if (key.includes('margem') || key.includes('crescimento') || key.includes('cagr') || key.includes('roe') || key.includes('roic')) {
      return `${numValue.toFixed(1)}%`
    }
    if (key.includes('ratio') || key.includes('liquidez') || key.includes('beta') || key.includes('peg')) {
      return numValue.toFixed(2)
    }
    return numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const categorias = {
    "🚀 Crescimento": crescimentoIndicadores,
    "💰 Rentabilidade": rentabilidadeIndicadores,
    "📈 Retorno sobre Capital": retornoIndicadores,
    "🏷️ Múltiplos de Avaliação": avaliacaoIndicadores,
    "🏦 Estrutura de Capital": estruturaCapitalIndicadores,
    "🔬 Métricas Específicas de Tech": techEspecificosIndicadores,
  }

  return (
    <div className="mt-6 space-y-8">
      {Object.entries(categorias).map(([categoria, indicadores]) => {
        // Filtrar indicadores válidos (com valores não vazios)
        const indicadoresValidos = indicadores.filter(({ value }) =>
          value && value !== '0' && value.trim() !== ''
        )

        // Se não há indicadores válidos, não renderizar a categoria
        if (indicadoresValidos.length === 0) return null

        return (
          <div key={categoria} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                {categoria}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({indicadoresValidos.length} indicador{indicadoresValidos.length !== 1 ? 'es' : ''})
                </span>
              </h3>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {indicadoresValidos.map(({ label, value, key }) => {
                  const score = getScoreByThreshold(value, t[key as keyof typeof t])

                  return (
                    <div key={key} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 text-sm">{label}</h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Setor: Tecnologia
                          </p>
                        </div>
                        <IndicatorValuePro
                          score={score}
                          tooltip={`Benchmark para "${label}" no setor tecnológico.`}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          {formatValue(value, key.toLowerCase())}
                        </span>
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
