import { StockData } from '@/features/tools/stocks/types/stocks'
import { CardBlock } from '../StockCard'
import { IndicatorValue } from '../IndicatorValue'

export function GrowthSection({ data }: { data: StockData }) {
  const receita = parseFloat(data.receita)
  const receitaPorAcao = parseFloat(data.receitaPorAcao)
  const lucroPorAcao = parseFloat(data.lucroPorAcao)
  const receitaCagr3y = parseFloat(data.receitaCagr3y)
  const lucroCagr3y = parseFloat(data.lucroCagr3y)
  const receitaGrowth5y = parseFloat(data.receitaGrowth5y)
  const lucroGrowth5y = parseFloat(data.lucroGrowth5y)

  return (
    <CardBlock title="Crescimento">
      <div className="grid grid-cols-[260px_1fr_auto] gap-y-3 items-center text-sm">
        <div className="font-semibold">Receita TTM:</div>
        <div>{data.receita}</div>
        <IndicatorValue value={receita} isGood={(v) => v > 0} />

        <div className="font-semibold">Receita por Ação:</div>
        <div>{data.receitaPorAcao}</div>
        <IndicatorValue value={receitaPorAcao} isGood={(v) => v > 0} />

        <div className="font-semibold">Lucro por Ação:</div>
        <div>{data.lucroPorAcao}</div>
        <IndicatorValue value={lucroPorAcao} isGood={(v) => v > 0} />

        <div className="font-semibold">CAGR Receita 3Y:</div>
        <div>{data.receitaCagr3y}%</div>
        <IndicatorValue value={receitaCagr3y} isGood={(v) => v > 10} />

        <div className="font-semibold">Crescimento Receita 5Y:</div>
        <div>{data.receitaGrowth5y}%</div>
        <IndicatorValue value={receitaGrowth5y} isGood={(v) => v > 30} />

        <div className="font-semibold">CAGR Lucro 3Y:</div>
        <div>{data.lucroCagr3y}%</div>
        <IndicatorValue value={lucroCagr3y} isGood={(v) => v > 10} />

        <div className="font-semibold">Crescimento Lucro 5Y:</div>
        <div>{data.lucroGrowth5y}%</div>
        <IndicatorValue value={lucroGrowth5y} isGood={(v) => v > 30} />
      </div>
    </CardBlock>
  )
}
