import { IndicatorValue } from "../IndicatorValue"

interface RatingsConsumerCyclicalProps {
  pe: string
  ps: string
  pb: string
  roe: string
  grossMargin: string
  ebitdaMargin: string
  endividamento: string
  liquidezCorrente: string
  rotatividadeEstoques: string
  receitaCagr3y: string
}

export function RatingsConsumerCyclical({
  pe,
  ps,
  pb,
  roe,
  grossMargin,
  ebitdaMargin,
  endividamento,
  liquidezCorrente,
  rotatividadeEstoques,
  receitaCagr3y,
}: RatingsConsumerCyclicalProps) {
  const peVal = parseFloat(pe)
  const psVal = parseFloat(ps)
  const pbVal = parseFloat(pb)
  const roeVal = parseFloat(roe)
  const grossVal = parseFloat(grossMargin)
  const ebitdaVal = parseFloat(ebitdaMargin)
  const debtVal = parseFloat(endividamento)
  const liquidezVal = parseFloat(liquidezCorrente)
  const estoqueVal = parseFloat(rotatividadeEstoques)
  const receitaCagrVal = parseFloat(receitaCagr3y)

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
      <p><strong>P/E:</strong> {pe}<IndicatorValue value={peVal} isGood={(v) => v > 0 && v < 22} /></p>
      <p><strong>P/S:</strong> {ps}<IndicatorValue value={psVal} isGood={(v) => v < 3} /></p>
      <p><strong>P/B:</strong> {pb}<IndicatorValue value={pbVal} isGood={(v) => v < 3} /></p>
      <p><strong>ROE:</strong> {roe}%<IndicatorValue value={roeVal} isGood={(v) => v > 15} /></p>
      <p><strong>Margem Bruta:</strong> {grossMargin}%<IndicatorValue value={grossVal} isGood={(v) => v > 30} /></p>
      <p><strong>Margem EBITDA:</strong> {ebitdaMargin}%<IndicatorValue value={ebitdaVal} isGood={(v) => v > 15} /></p>
      <p><strong>Endividamento:</strong> {endividamento}<IndicatorValue value={debtVal} isGood={(v) => v < 2.5} /></p>
      <p><strong>Liquidez Corrente:</strong> {liquidezCorrente}<IndicatorValue value={liquidezVal} isGood={(v) => v > 1.2} /></p>
      <p><strong>Rotatividade de Estoques:</strong> {rotatividadeEstoques}<IndicatorValue value={estoqueVal} isGood={(v) => v > 3} /></p>
      <p><strong>CAGR Receita 3Y:</strong> {receitaCagr3y}%<IndicatorValue value={receitaCagrVal} isGood={(v) => v > 8} /></p>
    </div>
  )
}
