// components/Stocks/StockPeers.tsx
import React from 'react'
import { Badge } from '../ui/badge'


interface StockPeersProps {
  peers: string[]
  onPeerClick: (symbol: string) => void
}

export const StockPeers: React.FC<StockPeersProps> = ({ peers, onPeerClick }) => {
  if (!peers?.length) return null

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold mb-2">Empresas Semelhantes</h4>
      <div className="flex flex-wrap gap-2">
        {peers.map((symbol) => (
          <Badge
            key={symbol}
            variant="secondary"
            className="cursor-pointer hover:bg-blue-500 hover:text-white transition"
            onClick={() => onPeerClick(symbol)}
          >
            {symbol}
          </Badge>
        ))}
      </div>
    </div>
  )
}
