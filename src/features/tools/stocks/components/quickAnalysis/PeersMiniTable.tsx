import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

interface Peer {
  symbol: string
  name: string
  price: number
  change: number
  marketCap?: number | null
  pe?: number | null
}

interface PeersMiniTableProps {
  peers: Peer[]
  onPeerClick?: (symbol: string) => void
}

function fmtMarketCap(value: number | null | undefined): string {
  if (value == null || !isFinite(value)) return '—'
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`
  if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M`
  return `${value}`
}

function fmtPE(value: number | null | undefined): string {
  if (value == null || !isFinite(value) || value <= 0) return '—'
  return value.toFixed(1) + 'x'
}

// Initials fallback when logo fails to load
function LogoFallback({ symbol }: { symbol: string }) {
  return (
    <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
      <span className="text-[11px] font-bold text-muted-foreground tracking-tight">
        {symbol.slice(0, 2)}
      </span>
    </div>
  )
}

function CompanyLogo({ symbol }: { symbol: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) return <LogoFallback symbol={symbol} />

  return (
    <img
      src={`https://financialmodelingprep.com/image-stock/${symbol}.png`}
      alt={symbol}
      onError={() => setFailed(true)}
      className="size-8 rounded-lg object-contain bg-white shrink-0"
    />
  )
}

export function PeersMiniTable({ peers, onPeerClick }: PeersMiniTableProps) {
  return (
    <div className="space-y-3">
      {/* ── Header igual ao "Indicadores por Categoria" ── */}
      <div className="flex items-center gap-3 pt-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
          Ações Relacionadas
        </span>
        <div className="flex-1 h-px bg-border" />
        <span className="text-[11px] text-muted-foreground shrink-0">{peers.length} empresas</span>
      </div>

      {/* ── Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {peers.map((peer) => {
          const isPositive = peer.change >= 0

          return (
            <button
              key={peer.symbol}
              onClick={() => onPeerClick?.(peer.symbol)}
              className="group text-left rounded-xl border border-border bg-card px-4 py-3 hover:bg-muted/40 hover:border-border/80 hover:shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {/* ── Linha 1: Logo + Symbol + % change + ícone ── */}
              <div className="flex items-center gap-2.5 mb-2">
                <CompanyLogo symbol={peer.symbol} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-bold text-foreground tracking-tight">
                      {peer.symbol}
                    </span>
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-[11px] font-semibold tabular-nums px-1.5 py-0.5 rounded-md ${
                          isPositive
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {peer.change.toFixed(2)}%
                      </span>
                      <ArrowUpRight className="size-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0" />
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate leading-tight">
                    {peer.name}
                  </p>
                </div>
              </div>

              {/* ── Linha 2: Preço | PE | Market Cap ── */}
              <div className="flex items-end justify-between gap-2 pt-1 border-t border-border/50">
                <div>
                  <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wide leading-none mb-0.5">
                    Preço
                  </p>
                  <p className="text-base font-bold tabular-nums text-foreground leading-none">
                    ${peer.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="text-right">
                    <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wide leading-none mb-0.5">
                      P/E
                    </p>
                    <p className="text-[11px] font-semibold text-foreground tabular-nums leading-none">
                      {fmtPE(peer.pe)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wide leading-none mb-0.5">
                      Mkt Cap
                    </p>
                    <p className="text-[11px] font-semibold text-foreground tabular-nums leading-none">
                      {fmtMarketCap(peer.marketCap)}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
