import { useEffect, useState } from 'react'
import axios from 'axios'
import { StockData } from '../../../types/stocks'

export function useQuickAnalysis(symbol: string) {
  const [data, setData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!symbol) return

    setLoading(true)
    axios
    .get(`/api/stocks/quick-analysis/${symbol}`)

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
