import { IndicatorValue } from '../IndicatorValue'

interface RatingsTechProps {
  crescimentoReceita: string
  margemBruta: string
  margemEbitda: string
  margemLiquida: string
  roic: string
  roe: string
  pl: string
  ps: string
  peg: string
  debtToEbitda: string
  liquidezCorrente: string
  cashRatio: string
  beta: string
  cagrEps: string
  eps: string
}


export function RatingsTech({
  crescimentoReceita,
  margemBruta,
  margemEbitda,
  margemLiquida,
  roic,
  roe,
  pl,
  ps,
  peg,
  debtToEbitda,
  liquidezCorrente,
  cashRatio,
  beta,
  cagrEps,
  eps,
}: RatingsTechProps) {
  const crescimentoVal = parseFloat(crescimentoReceita)
  const margemBrutaVal = parseFloat(margemBruta)
  const margemEbitdaVal = parseFloat(margemEbitda)
  const margemLiquidaVal = parseFloat(margemLiquida)
  const roicVal = parseFloat(roic)
  const roeVal = parseFloat(roe)
  const plVal = parseFloat(pl)
  const psVal = parseFloat(ps)
  const pegVal = parseFloat(peg)
  const debtVal = parseFloat(debtToEbitda)
  const liquidezVal = parseFloat(liquidezCorrente)
  const cashVal = parseFloat(cashRatio)
  const betaVal = parseFloat(beta)
  const cagrVal = parseFloat(cagrEps)
  const epsVal = parseFloat(eps)

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
      <p>
        <strong>Crescimento Receita (YoY):</strong> {crescimentoReceita}%
        <IndicatorValue value={crescimentoVal} isGood={(v) => v > 20} />
      </p>
      <p>
        <strong>CAGR EPS:</strong> {cagrEps}%
        <IndicatorValue value={cagrVal} isGood={(v) => v > 15} />
      </p>
      <p>
        <strong>EPS:</strong> {eps}
        <IndicatorValue value={epsVal} isGood={(v) => v > 0} />
      </p>
      <p>
        <strong>Margem Bruta:</strong> {margemBruta}%
        <IndicatorValue value={margemBrutaVal} isGood={(v) => v > 60} />
      </p>
      <p>
        <strong>Margem EBITDA:</strong> {margemEbitda}%
        <IndicatorValue value={margemEbitdaVal} isGood={(v) => v > 20} />
      </p>
      <p>
        <strong>Margem Líquida:</strong> {margemLiquida}%
        <IndicatorValue value={margemLiquidaVal} isGood={(v) => v > 15} />
      </p>
      <p>
        <strong>ROIC:</strong> {roic}%
        <IndicatorValue value={roicVal} isGood={(v) => v > 10} />
      </p>
      <p>
        <strong>ROE:</strong> {roe}%
        <IndicatorValue value={roeVal} isGood={(v) => v > 15} />
      </p>
      <p>
        <strong>P/L:</strong> {pl}
        <IndicatorValue value={plVal} isGood={(v) => v > 0 && v < 30} />
      </p>
      <p>
        <strong>P/S:</strong> {ps}
        <IndicatorValue value={psVal} isGood={(v) => v < 10} />
      </p>
      <p>
        <strong>PEG:</strong> {peg}
        <IndicatorValue value={pegVal} isGood={(v) => v > 0 && v < 1.5} />
      </p>
      <p>
        <strong>Dívida/EBITDA:</strong> {debtToEbitda}
        <IndicatorValue value={debtVal} isGood={(v) => v < 2} />
      </p>
      <p>
        <strong>Liquidez Corrente:</strong> {liquidezCorrente}
        <IndicatorValue value={liquidezVal} isGood={(v) => v > 1.5} />
      </p>
      <p>
        <strong>Cash Ratio:</strong> {cashRatio}
        <IndicatorValue value={cashVal} isGood={(v) => v > 0.5} />
      </p>
      <p>
        <strong>Beta:</strong> {beta}
        <IndicatorValue value={betaVal} isGood={(v) => v > 0 && v < 1.5} />
      </p>
    </div>
  )
}

