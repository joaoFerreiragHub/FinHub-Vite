import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, Coins, Loader2, RefreshCw, Search } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import { MarketsNav } from '@/features/markets/components/MarketsNav'
import { fetchCryptoList } from '@/features/markets/services/marketToolsApi'

function formatMoney(value?: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'N/A'
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

function formatMarketCap(value?: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'N/A'
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value)
}

export default function CryptoListPage() {
  const [search, setSearch] = useState('')

  const {
    data: cryptos = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['markets', 'crypto-list'],
    queryFn: fetchCryptoList,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const filteredCryptos = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return cryptos.slice(0, 300)

    return cryptos
      .filter((crypto) => {
        const name = crypto.name?.toLowerCase() ?? ''
        const symbol = crypto.symbol?.toLowerCase() ?? ''
        return name.includes(term) || symbol.includes(term)
      })
      .slice(0, 300)
  }, [cryptos, search])

  return (
    <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-2xl border border-border bg-card/70 p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Lista de Cripto</h1>
              <p className="text-sm text-muted-foreground">
                Painel de criptomoedas para acompanhamento rapido de preco e market cap.
              </p>
            </div>
            <Badge variant="outline" className="inline-flex items-center gap-2">
              <Coins className="h-3.5 w-3.5" />
              Coin list
            </Badge>
          </div>
          <MarketsNav />
        </section>

        <Card className="border border-border/60 bg-card/75">
          <CardContent className="space-y-4 p-6">
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Pesquisar por nome ou simbolo (ex: BTC, ETH)"
                  className="pl-9"
                />
              </div>
              <Button onClick={() => refetch()} variant="outline" disabled={isFetching}>
                {isFetching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Atualizar
              </Button>
            </div>

            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />A carregar criptomoedas...
              </div>
            )}

            {isError && (
              <div className="rounded-md border border-red-500/40 bg-red-500/10 p-4">
                <div className="mb-2 flex items-center gap-2 text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">
                    Nao estamos a conseguir carregar as criptomoedas.
                  </span>
                </div>
                <p className="mb-3 text-sm text-red-300">
                  {error instanceof Error
                    ? error.message
                    : 'Verifica os endpoints e tenta novamente dentro de instantes.'}
                </p>
                <Button size="sm" onClick={() => refetch()} variant="secondary">
                  Tentar novamente
                </Button>
              </div>
            )}

            {!isLoading && !isError && filteredCryptos.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhuma criptomoeda encontrada para esta pesquisa.
              </p>
            )}

            {!isLoading && !isError && filteredCryptos.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ativo</TableHead>
                    <TableHead>Simbolo</TableHead>
                    <TableHead>Preco</TableHead>
                    <TableHead>Market Cap</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCryptos.map((crypto) => (
                    <TableRow key={crypto.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {crypto.image ? (
                            <img
                              src={crypto.image}
                              alt={crypto.name}
                              className="h-6 w-6 rounded-full border border-border/70 object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="h-6 w-6 rounded-full bg-muted" />
                          )}
                          <span className="font-medium">{crypto.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="uppercase text-muted-foreground">
                        {crypto.symbol}
                      </TableCell>
                      <TableCell>{formatMoney(crypto.price)}</TableCell>
                      <TableCell>{formatMarketCap(crypto.marketCap)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
