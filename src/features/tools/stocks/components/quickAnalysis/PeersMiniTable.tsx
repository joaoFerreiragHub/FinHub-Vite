import { ChevronRight } from 'lucide-react'

interface Peer {
  symbol: string
  name: string
  price: number
  change: number
}

interface PeersMiniTableProps {
  peers: Peer[]
  onPeerClick?: (symbol: string) => void
}

export function PeersMiniTable({ peers, onPeerClick }: PeersMiniTableProps) {
  return (
    <div className="rounded-md border p-4 space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">🧩 Empresas Relacionadas</h3>
      <table className="w-full text-sm">
        <tbody>
          {peers.map((peer) => (
            <tr
              key={peer.symbol}
              className="hover:bg-muted/50 cursor-pointer"
              onClick={() => onPeerClick?.(peer.symbol)}
            >
              <td className="py-1 font-medium">{peer.symbol}</td>
              <td className="text-right">{peer.price.toFixed(2)} €</td>
              <td className={`text-right ${peer.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {peer.change > 0 ? '+' : ''}
                {peer.change.toFixed(2)}%
              </td>
              <td>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
