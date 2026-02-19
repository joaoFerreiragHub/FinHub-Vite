import { useMemo, useState } from 'react'
import { AlertCircle, BarChart3, Loader2, RefreshCw, Waypoints } from 'lucide-react'
import { Badge, Button, Card, CardContent, Input, Label } from '@/components/ui'
import { MarketsNav } from '@/features/markets/components/MarketsNav'
import { fetchEtfOverlap, type EtfSectorWeight } from '@/features/markets/services/marketToolsApi'

interface OverlapHolding {
  name: string
  weight: number
}

interface SectorRow {
  sector: string
  overlap: number
  etf1Weight: number
  etf2Weight: number
}

function toNumber(value: unknown): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number.parseFloat(value.replace('%', '')) || 0
  return 0
}

function normalizeSectorRow(sector: string, value: EtfSectorWeight): SectorRow {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const etf1Weight = toNumber(value.etf1Weight)
    const etf2Weight = toNumber(value.etf2Weight)
    return {
      sector,
      overlap: Math.min(etf1Weight, etf2Weight),
      etf1Weight,
      etf2Weight,
    }
  }

  const overlap = toNumber(value)
  return {
    sector,
    overlap,
    etf1Weight: overlap,
    etf2Weight: overlap,
  }
}

const EUROPEAN_ETF_SUGGESTIONS = [
  { ticker: 'VWCE.DE', label: 'Vanguard All-World EUR' },
  { ticker: 'IWDA.AS', label: 'iShares MSCI World EUR' },
  { ticker: 'VUAA.AS', label: 'Vanguard S&P 500 EUR' },
  { ticker: 'EQQQ.DE', label: 'Invesco Nasdaq-100 EUR' },
  { ticker: 'VHYL.AS', label: 'Vanguard High Dividend EUR' },
  { ticker: 'EMIM.L', label: 'iShares MSCI EM IMI USD' },
]

export default function EtfOverlapPage() {
  const [etf1, setEtf1] = useState('VWCE.DE')
  const [etf2, setEtf2] = useState('IWDA.AS')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [totalOverlap, setTotalOverlap] = useState<number | null>(null)
  const [holdings, setHoldings] = useState<OverlapHolding[]>([])
  const [sectorRows, setSectorRows] = useState<SectorRow[]>([])

  const hasData = holdings.length > 0 || sectorRows.length > 0

  const topSectorOverlap = useMemo(
    () => sectorRows.reduce((max, row) => (row.overlap > max ? row.overlap : max), 0),
    [sectorRows],
  )

  const handleCompare = async () => {
    const left = etf1.trim().toUpperCase()
    const right = etf2.trim().toUpperCase()

    if (!left || !right) {
      setError('Insere os dois tickers de ETF para comparar.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await fetchEtfOverlap(left, right)

      const sortedHoldings = Object.entries(result.overlap?.overlappingHoldings ?? {})
        .map(([name, weight]) => ({ name, weight: toNumber(weight) }))
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 12)

      const normalizedSectors = Object.entries(result.sectors?.sectorOverlap ?? {})
        .map(([sector, value]) => normalizeSectorRow(sector, value))
        .sort((a, b) => b.overlap - a.overlap)

      setTotalOverlap(toNumber(result.sectors?.totalSectorOverlapWeight))
      setHoldings(sortedHoldings)
      setSectorRows(normalizedSectors)
    } catch (apiError) {
      console.error(apiError)
      setTotalOverlap(null)
      setHoldings([])
      setSectorRows([])
      setError(
        'Nao foi possivel comparar estes ETFs agora. Verifica se o endpoint /etfs/overlap esta ativo e tenta novamente.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-2xl border border-border bg-card/70 p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Comparador de ETFs</h1>
              <p className="text-sm text-muted-foreground">
                Sobreposicao de holdings e overlap setorial entre dois ETFs.
              </p>
            </div>
            <Badge variant="outline" className="inline-flex items-center gap-2">
              <Waypoints className="h-3.5 w-3.5" />
              ETF overlap
            </Badge>
          </div>
          <MarketsNav />
        </section>

        <Card className="border border-border/60 bg-card/75">
          <CardContent className="space-y-4 p-6">
            <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
              <div className="space-y-2">
                <Label htmlFor="etf-left">ETF 1</Label>
                <Input
                  id="etf-left"
                  value={etf1}
                  onChange={(event) => setEtf1(event.target.value)}
                  placeholder="Ex: SPY"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="etf-right">ETF 2</Label>
                <Input
                  id="etf-right"
                  value={etf2}
                  onChange={(event) => setEtf2(event.target.value)}
                  placeholder="Ex: VOO"
                />
              </div>
              <Button onClick={handleCompare} disabled={loading} className="md:min-w-36">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Comparar
              </Button>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">ETFs populares em Portugal/Europa:</p>
              <div className="flex flex-wrap gap-2">
                {EUROPEAN_ETF_SUGGESTIONS.map(({ ticker, label }) => (
                  <button
                    key={ticker}
                    type="button"
                    onClick={() => (etf1.trim() === '' ? setEtf1(ticker) : setEtf2(ticker))}
                    className="rounded-md border border-border/60 bg-muted/40 px-2.5 py-1 text-xs hover:bg-muted transition-colors"
                    title={label}
                  >
                    {ticker}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {hasData ? (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              <Card className="border border-border/60 bg-card/75">
                <CardContent className="space-y-2 p-5">
                  <p className="text-sm text-muted-foreground">Ticker comparado</p>
                  <p className="text-2xl font-semibold">{etf1.trim().toUpperCase()}</p>
                </CardContent>
              </Card>
              <Card className="border border-border/60 bg-card/75">
                <CardContent className="space-y-2 p-5">
                  <p className="text-sm text-muted-foreground">Ticker comparado</p>
                  <p className="text-2xl font-semibold">{etf2.trim().toUpperCase()}</p>
                </CardContent>
              </Card>
              <Card className="border border-border/60 bg-card/75">
                <CardContent className="space-y-2 p-5">
                  <p className="text-sm text-muted-foreground">Sobreposicao setorial</p>
                  <p className="text-2xl font-semibold">{totalOverlap?.toFixed(2) ?? '0.00'}%</p>
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              <Card className="border border-border/60 bg-card/75">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <h2 className="text-lg font-semibold">Top holdings em comum</h2>
                  </div>
                  <div className="flex items-start gap-2 rounded-md border border-yellow-500/30 bg-yellow-500/10 p-2.5 text-xs text-yellow-600 dark:text-yellow-400">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>
                      O Yahoo Finance devolve apenas os ~10 maiores holdings de cada ETF. A
                      sobreposicao real por holdings e muito superior — usa a sobreposicao setorial
                      como referencia principal.
                    </span>
                  </div>
                  {holdings.length > 0 ? (
                    <div className="space-y-3">
                      {holdings.map((holding) => (
                        <div key={holding.name} className="space-y-1">
                          <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="truncate text-muted-foreground">{holding.name}</span>
                            <span className="font-medium text-foreground">
                              {holding.weight.toFixed(2)}%
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-muted">
                            <div
                              className="h-2 rounded-full bg-primary"
                              style={{ width: `${Math.min(holding.weight, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Sem holdings em comum para estes tickers.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="border border-border/60 bg-card/75">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Overlap por setor</h2>
                    <Badge variant="secondary">Max: {topSectorOverlap.toFixed(2)}%</Badge>
                  </div>
                  {sectorRows.length > 0 ? (
                    <div className="space-y-3">
                      {sectorRows.slice(0, 10).map((row) => (
                        <div key={row.sector} className="rounded-lg border border-border/70 p-3">
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="truncate text-sm font-medium">{row.sector}</span>
                            <span className="text-sm text-muted-foreground">
                              overlap {row.overlap.toFixed(2)}%
                            </span>
                          </div>
                          <div className="grid gap-1 text-xs text-muted-foreground">
                            <div className="flex items-center justify-between">
                              <span>{etf1.trim().toUpperCase()}</span>
                              <span>{row.etf1Weight.toFixed(2)}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>{etf2.trim().toUpperCase()}</span>
                              <span>{row.etf2Weight.toFixed(2)}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Sem dados setoriais para estes ETFs.
                    </p>
                  )}
                </CardContent>
              </Card>
            </section>
          </>
        ) : (
          <Card className="border border-dashed border-border bg-card/50">
            <CardContent className="p-6 text-sm text-muted-foreground">
              Executa uma comparacao para ver holdings em comum e overlap setorial.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
