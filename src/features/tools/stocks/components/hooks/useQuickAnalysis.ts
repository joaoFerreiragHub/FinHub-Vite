import { useEffect, useState } from 'react'
import { StockData } from '@/features/tools/stocks/types/stocks'
import { apiClient } from '@/lib/api/client'

export function useQuickAnalysis(symbol: string) {
  const [data, setData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!symbol) return

    setLoading(true)
    apiClient
      .get(`/stocks/quick-analysis/${symbol}`)

      .then((res) => {
        setData(res.data)
        setError(null)
      })
      .catch((err) => {
        console.error('Erro ao carregar análise rápida:', err)
        setError('Erro ao carregar os dados')
      })
      .finally(() => setLoading(false))
  }, [symbol])

  return { data, loading, error }
}
