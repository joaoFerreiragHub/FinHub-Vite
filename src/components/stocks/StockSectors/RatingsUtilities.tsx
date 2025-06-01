import { IndicatorValue } from '../IndicatorValue'

interface RatingsUtilitiesProps {
  pl: string
  roe: string
  margemEbitda: string
  endividamento: string
  coberturaJuros: string
  precoAtual: string
  leveredDcf: string
}
export function RatingsUtilities({
  pl,
  roe,
  margemEbitda,
  endividamento,
  coberturaJuros,
  precoAtual,
  leveredDcf,
}: RatingsUtilitiesProps) {
  const plVal = parseFloat(pl)
  const roeVal = parseFloat(roe)
  const ebitdaVal = parseFloat(margemEbitda)
  const endividamentoVal = parseFloat(endividamento)
  const coberturaJurosVal = parseFloat(coberturaJuros)
  const precoVal = parseFloat(precoAtual)
  const leveredDcfVal = parseFloat(leveredDcf)

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
      <p><strong>P/L:</strong> {pl} <IndicatorValue value={plVal} isGood={(v) => v > 0 && v < 20} /></p>
      <p><strong>ROE:</strong> {roe}% <IndicatorValue value={roeVal} isGood={(v) => v > 10} /></p>
      <p><strong>Margem EBITDA:</strong> {margemEbitda}% <IndicatorValue value={ebitdaVal} isGood={(v) => v > 30} /></p>
      <p><strong>Endividamento:</strong> {endividamento}% <IndicatorValue value={endividamentoVal} isGood={(v) => v < 70} /></p>
      <p><strong>Cobertura de Juros:</strong> {coberturaJuros} <IndicatorValue value={coberturaJurosVal} isGood={(v) => v > 2} /></p>
      <p><strong>Levered DCF:</strong> {leveredDcf} <IndicatorValue value={leveredDcfVal} isGood={(v) => v > precoVal} /></p>
    </div>
  )
}


