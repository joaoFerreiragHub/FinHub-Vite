import { IndicatorValue } from '../IndicatorValue'

interface RatingsEnergyProps {
  pe: string
  pb: string
  ebitdaMargin: string
  endividamento: string
  coberturaJuros: string
  liquidezCorrente: string
  dividendYield: string
  roic: string
  freeCashFlow: string
  beta: string
  precoAtual: string
  leveredDcf: string
}

export function RatingsEnergy({
  pe,
  pb,
  ebitdaMargin,
  endividamento,
  coberturaJuros,
  liquidezCorrente,
  dividendYield,
  roic,
  freeCashFlow,
  beta,
  precoAtual,
  leveredDcf,
}: RatingsEnergyProps) {
  const peVal = parseFloat(pe)
  const pbVal = parseFloat(pb)
  const ebitdaVal = parseFloat(ebitdaMargin)
  const endividamentoVal = parseFloat(endividamento)
  const coberturaVal = parseFloat(coberturaJuros)
  const liquidezVal = parseFloat(liquidezCorrente)
  const dividendVal = parseFloat(dividendYield)
  const roicVal = parseFloat(roic)
  const fcfVal = parseFloat(freeCashFlow)
  const betaVal = parseFloat(beta)
  const precoVal = parseFloat(precoAtual)
  const leveredDcfVal = parseFloat(leveredDcf)
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
      <p>
        <strong>P/E:</strong> {pe}
        <IndicatorValue value={peVal} isGood={(v) => v > 0 && v < 18} />
      </p>
      <p>
        <strong>P/B:</strong> {pb}
        <IndicatorValue value={pbVal} isGood={(v) => v < 2} />
      </p>
      <p>
        <strong>Margem EBITDA:</strong> {ebitdaMargin}%
        <IndicatorValue value={ebitdaVal} isGood={(v) => v > 25} />
      </p>
      <p>
        <strong>Endividamento:</strong> {endividamento}
        <IndicatorValue value={endividamentoVal} isGood={(v) => v < 2.5} />
      </p>
      <p>
        <strong>Cobertura de Juros:</strong> {coberturaJuros}
        <IndicatorValue value={coberturaVal} isGood={(v) => v > 3} />
      </p>
      <p>
        <strong>Liquidez Corrente:</strong> {liquidezCorrente}
        <IndicatorValue value={liquidezVal} isGood={(v) => v > 1.2} />
      </p>
      <p>
        <strong>Dividend Yield:</strong> {dividendYield}%
        <IndicatorValue value={dividendVal} isGood={(v) => v > 3} />
      </p>
      <p>
        <strong>ROIC:</strong> {roic}%
        <IndicatorValue value={roicVal} isGood={(v) => v > 8} />
      </p>
      <p>
        <strong>Fluxo de Caixa Livre:</strong> {freeCashFlow}
        <IndicatorValue value={fcfVal} isGood={(v) => v > 0} />
      </p>
      <p>
        <strong>Beta:</strong> {beta}
        <IndicatorValue value={betaVal} isGood={(v) => v >= 0.6 && v <= 1.2} />
      </p>
      <p>
        <strong>Levered DCF:</strong> {leveredDcf}
        <IndicatorValue value={leveredDcfVal} isGood={(v) => v > precoVal} />
      </p>

    </div>
  )
}
