import { StockData } from "../../../types/stocks"
import { CardBlock } from "../StockCard"

export function GeneralInfoSection({ data }: { data: StockData }) {
  return (
    <CardBlock title="Informação Geral">
      <div className="grid grid-cols-[200px_1fr_auto] gap-y-2 items-center text-sm">
        <div className="font-semibold">Capitalização:</div>
        <div>{data.marketCap}</div>
        <div />

        <div className="font-semibold">Sector:</div>
        <div>{data.setor}</div>
        <div />

        <div className="font-semibold">País:</div>
        <div>{data.pais}</div>
        <div />

        <div className="font-semibold">Funcionários:</div>
        <div>{data.employees}</div>
        <div />

        <div className="font-semibold">Fundada em:</div>
        <div>{data.fundacao}</div>
        <div />

        <div className="font-semibold">Beta:</div>
        <div>{data.beta}</div>
        <div />

        <div className="font-semibold">CEO:</div>
        <div>{data.ceo}</div>
        <div />
      </div>
    </CardBlock>
  )
}
