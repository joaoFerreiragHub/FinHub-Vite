// src/features/tools/stocks/components/detailedAnalysis/peers/PeersComparisonTable.tsx

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'
interface PeerMetrics {
  symbol: string
  pe: number
  roe: number
  ebitdaMargin: number
  revenue: number
}

interface PeersComparisonTableProps {
  peersData: PeerMetrics[]
}

export function PeersComparisonTable({ peersData }: PeersComparisonTableProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-base font-semibold">Tabela Comparativa de Concorrência</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empresa</TableHead>
            <TableHead>P/E</TableHead>
            <TableHead>ROE (%)</TableHead>
            <TableHead>Margem EBITDA (%)</TableHead>
            <TableHead>Receita (B)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {peersData.map((peer) => (
            <TableRow key={peer.symbol}>
              <TableCell>{peer.symbol}</TableCell>
              <TableCell>{peer.pe}</TableCell>
              <TableCell>{peer.roe}</TableCell>
              <TableCell>{peer.ebitdaMargin}</TableCell>
              <TableCell>{peer.revenue}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
