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
      <h4 className="text-lg font-semibold text-muted-foreground mb-3">Empresas Semelhantes</h4>
      <div className="flex flex-wrap gap-2">
        {peers.map((symbol) => (
          <Badge
            key={symbol}
            variant="outline"
            className="cursor-pointer hover:bg-primary hover:text-white transition-all duration-150 ease-in-out"
            onClick={() => onPeerClick(symbol)}
          >
            {symbol}
          </Badge>
        ))}
      </div>
    </div>
  )
}
