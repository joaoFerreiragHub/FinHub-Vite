import { IndicatorValue } from '../IndicatorValue'
interface RatingsHealthcareProps {
  investimentoPD: string
  margemBruta: string
  margemEbitda: string
  margemLiquida: string
  roic: string
  roe: string
  pl: string
  ps: string
  debtToEbitda: string
  liquidezCorrente: string
  cagrEps: string
  eps: string
  beta: string
}

export function RatingsHealthcare({
  investimentoPD,
  margemBruta,
  margemEbitda,
  margemLiquida,
  roic,
  roe,
  pl,
  ps,
  debtToEbitda,
  liquidezCorrente,
  cagrEps,
  eps,
  beta,
}: RatingsHealthcareProps) {
  const investimentoPDVal = parseFloat(investimentoPD)
  const margemBrutaVal = parseFloat(margemBruta)
  const margemEbitdaVal = parseFloat(margemEbitda)
  const margemLiquidaVal = parseFloat(margemLiquida)
  const roicVal = parseFloat(roic)
  const roeVal = parseFloat(roe)
  const plVal = parseFloat(pl)
  const psVal = parseFloat(ps)
  const debtVal = parseFloat(debtToEbitda)
  const liquidezVal = parseFloat(liquidezCorrente)
  const cagrVal = parseFloat(cagrEps)
  const epsVal = parseFloat(eps)
  const betaVal = parseFloat(beta)

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
      <p><strong>P&D / Receita:</strong> {investimentoPD}%<IndicatorValue value={investimentoPDVal} isGood={(v) => v > 7} /></p>
      <p><strong>Margem Bruta:</strong> {margemBruta}%<IndicatorValue value={margemBrutaVal} isGood={(v) => v > 50} /></p>
      <p><strong>Margem EBITDA:</strong> {margemEbitda}%<IndicatorValue value={margemEbitdaVal} isGood={(v) => v > 20} /></p>
      <p><strong>Margem Líquida:</strong> {margemLiquida}%<IndicatorValue value={margemLiquidaVal} isGood={(v) => v > 10} /></p>
      <p><strong>ROIC:</strong> {roic}%<IndicatorValue value={roicVal} isGood={(v) => v > 10} /></p>
      <p><strong>ROE:</strong> {roe}%<IndicatorValue value={roeVal} isGood={(v) => v > 15} /></p>
      <p><strong>P/L:</strong> {pl}<IndicatorValue value={plVal} isGood={(v) => v > 0 && v < 25} /></p>
      <p><strong>P/S:</strong> {ps}<IndicatorValue value={psVal} isGood={(v) => v < 10} /></p>
      <p><strong>Dívida/EBITDA:</strong> {debtToEbitda}<IndicatorValue value={debtVal} isGood={(v) => v < 2} /></p>
      <p><strong>Liquidez Corrente:</strong> {liquidezCorrente}<IndicatorValue value={liquidezVal} isGood={(v) => v > 1.5} /></p>
      <p><strong>CAGR EPS:</strong> {cagrEps}%<IndicatorValue value={cagrVal} isGood={(v) => v > 10} /></p>
      <p><strong>EPS:</strong> {eps}<IndicatorValue value={epsVal} isGood={(v) => v > 0} /></p>
      <p><strong>Beta:</strong> {beta}<IndicatorValue value={betaVal} isGood={(v) => v > 0.5 && v < 1.5} /></p>
    </div>
  )
}
