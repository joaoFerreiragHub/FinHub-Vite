import { IndicatorValue } from '../IndicatorValue'

interface RatingsBasicMaterialsProps {
  pe: string
  pb: string
  roic: string
  ebitdaMargin: string
}

export function RatingsBasicMaterials({
  pe,
  pb,
  roic,
  ebitdaMargin,
}: RatingsBasicMaterialsProps) {
  const peVal = parseFloat(pe)
  const pbVal = parseFloat(pb)
  const roicVal = parseFloat(roic)
  const ebitdaVal = parseFloat(ebitdaMargin)

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
      <p><strong>P/E:</strong> {pe}<IndicatorValue value={peVal} isGood={(v) => v > 0 && v < 25} /></p>
      <p><strong>P/B:</strong> {pb}<IndicatorValue value={pbVal} isGood={(v) => v < 3} /></p>
      <p><strong>ROIC:</strong> {roic}%<IndicatorValue value={roicVal} isGood={(v) => v > 10} /></p>
      <p><strong>Margem EBITDA:</strong> {ebitdaMargin}%<IndicatorValue value={ebitdaVal} isGood={(v) => v > 20} /></p>
    </div>
  )
}
