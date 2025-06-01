import { IndicatorValue } from '../IndicatorValue'

interface RatingsIndustrialsProps {
  margemEbitda: string
  roic: string
  alavancagem: string
  coberturaJuros: string
  liquidezCorrente: string
  rotatividadeEstoques: string
  pe: string
  pb: string
  ps: string
  peg: string
  dividendYield: string
  beta: string
  giroAtivo: string
}

export function RatingsIndustrials({
  margemEbitda,
  roic,
  alavancagem,
  coberturaJuros,
  liquidezCorrente,
  rotatividadeEstoques,
  pe,
  pb,
  ps,
  peg,
  dividendYield,
  beta,
  giroAtivo,
}: RatingsIndustrialsProps) {
  const margemEbitdaVal = parseFloat(margemEbitda)
  const roicVal = parseFloat(roic)
  const alavancagemVal = parseFloat(alavancagem)
  const coberturaJurosVal = parseFloat(coberturaJuros)
  const liquidezCorrenteVal = parseFloat(liquidezCorrente)
  const rotatividadeEstoquesVal = parseFloat(rotatividadeEstoques)
  const peVal = parseFloat(pe)
  const pbVal = parseFloat(pb)
  const psVal = parseFloat(ps)
  const pegVal = parseFloat(peg)
  const dividendYieldVal = parseFloat(dividendYield)
  const betaVal = parseFloat(beta)
  const giroAtivoVal = parseFloat(giroAtivo)

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
      <p><strong>Margem EBITDA:</strong> {margemEbitda}% <IndicatorValue value={margemEbitdaVal} isGood={(v) => v > 15} /></p>
      <p><strong>ROIC:</strong> {roic}% <IndicatorValue value={roicVal} isGood={(v) => v > 10} /></p>
      <p><strong>Alavancagem Financeira:</strong> {alavancagem} <IndicatorValue value={alavancagemVal} isGood={(v) => v < 3} /></p>
      <p><strong>Cobertura de Juros:</strong> {coberturaJuros} <IndicatorValue value={coberturaJurosVal} isGood={(v) => v > 2} /></p>
      <p><strong>Liquidez Corrente:</strong> {liquidezCorrente} <IndicatorValue value={liquidezCorrenteVal} isGood={(v) => v > 1.5} /></p>
      <p><strong>Rotatividade de Estoques:</strong> {rotatividadeEstoques} <IndicatorValue value={rotatividadeEstoquesVal} isGood={(v) => v > 5} /></p>
      <p><strong>P/E:</strong> {pe} <IndicatorValue value={peVal} isGood={(v) => v > 0 && v < 20} /></p>
      <p><strong>P/B:</strong> {pb} <IndicatorValue value={pbVal} isGood={(v) => v < 3} /></p>
      <p><strong>P/S:</strong> {ps} <IndicatorValue value={psVal} isGood={(v) => v < 2} /></p>
      <p><strong>PEG:</strong> {peg} <IndicatorValue value={pegVal} isGood={(v) => v > 0 && v < 1.5} /></p>
      <p><strong>Dividend Yield:</strong> {dividendYield}% <IndicatorValue value={dividendYieldVal} isGood={(v) => v > 2} /></p>
      <p><strong>Beta:</strong> {beta} <IndicatorValue value={betaVal} isGood={(v) => v > 0.8 && v < 1.5} /></p>
      <p><strong>Giro do Ativo:</strong> {giroAtivo} <IndicatorValue value={giroAtivoVal} isGood={(v) => v > 1} /></p>
    </div>
  )
}
