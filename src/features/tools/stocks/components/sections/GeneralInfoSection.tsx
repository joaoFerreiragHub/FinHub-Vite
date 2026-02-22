import { StockData } from '@/features/tools/stocks/types/stocks'
import { CardBlock } from '../StockCard'

const DASH = '\u2014'

function fmtMktCap(val: string | number | undefined): string {
  if (val == null || val === '') return DASH
  const n = typeof val === 'string' ? parseFloat(val.replace(/[^0-9.-]/g, '')) : val
  if (isNaN(n) || n === 0) return DASH
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  return `$${n.toLocaleString('en-US')}`
}

function fmtEmployees(val: string | number | undefined): string {
  if (val == null || val === '' || val === 0) return DASH
  const n = typeof val === 'string' ? parseInt(val.replace(/\D/g, ''), 10) : val
  if (isNaN(n) || n === 0) return DASH
  return n.toLocaleString('pt-PT')
}

export function GeneralInfoSection({ data }: { data: StockData }) {
  const dataLegacy = data as StockData & {
    mktCap?: string | number
    fullTimeEmployees?: string | number
  }

  return (
    <CardBlock title="Informação Geral">
      <div className="grid grid-cols-[200px_1fr_auto] gap-y-2 items-center text-sm">
        <div className="font-semibold">Capitalização:</div>
        <div>{fmtMktCap(dataLegacy.mktCap ?? data.marketCap)}</div>
        <div />

        <div className="font-semibold">Sector:</div>
        <div>{data.sector || DASH}</div>
        <div />

        <div className="font-semibold">Funcionários:</div>
        <div>{fmtEmployees(dataLegacy.fullTimeEmployees ?? data.employees)}</div>
        <div />

        <div className="font-semibold">Fundada em:</div>
        <div>{data.ipoDate || data.fundacao || DASH}</div>
        <div />

        <div className="font-semibold">Beta:</div>
        <div>{data.beta || DASH}</div>
        <div />

        <div className="font-semibold">CEO:</div>
        <div>{data.ceo || DASH}</div>
        <div />
      </div>
    </CardBlock>
  )
}
