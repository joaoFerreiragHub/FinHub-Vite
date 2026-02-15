import { StockData } from '@/features/tools/stocks/types/stocks'
import { CardBlock } from '../StockCard'

// Função helper para formatar valores monetários
// function formatCurrency(value: string | number | undefined): string {
//   if (!value) return 'N/A'

//   // Se for string, tenta converter para número
//   if (typeof value === 'string') {
//     // Remove caracteres não numéricos exceto pontos e vírgulas
//     const cleanValue = value.replace(/[^0-9.-]/g, '')
//     const numValue = parseFloat(cleanValue)

//     if (isNaN(numValue)) return value // Retorna a string original se não conseguir converter

//     return numValue.toLocaleString('pt-PT', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     })
//   }

//   // Se for número
//   return value.toLocaleString('pt-PT', {
//     style: 'currency',
//     currency: 'USD',
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0
//   })
// }

export function GeneralInfoSection({ data }: { data: StockData }) {
  return (
    <CardBlock title="Informação Geral">
      <div className="grid grid-cols-[200px_1fr_auto] gap-y-2 items-center text-sm">
        <div className="font-semibold">Capitalização:</div>
        <div>{data.marketCap}</div>
        <div />

        <div className="font-semibold">Sector:</div>
        <div>{data.sector || 'N/A'}</div>
        <div />

        <div className="font-semibold">Funcionários:</div>
        <div>{data.employees || 'N/A'}</div>
        <div />

        <div className="font-semibold">Fundada em:</div>
        <div>{data.ipoDate || data.fundacao || 'N/A'}</div>
        <div />

        <div className="font-semibold">Beta:</div>
        <div>{data.beta || 'N/A'}</div>
        <div />

        <div className="font-semibold">CEO:</div>
        <div>{data.ceo || 'N/A'}</div>
        <div />
      </div>
    </CardBlock>
  )
}
