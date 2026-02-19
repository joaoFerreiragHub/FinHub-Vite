// hooks/useStockSearch.ts
import { useState } from 'react'
import { StockData } from '@/features/tools/stocks/types/stocks'
import axios from 'axios'
import { apiClient } from '@/lib/api/client'

export const useStockSearch = () => {
  const [ticker, setTicker] = useState('')
  const [data, setData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const searchStock = async () => {
    setLoading(true)
    setError('')
    setData(null)

    try {
      const symbol = ticker.trim().toUpperCase()
      if (!symbol) {
        setError('Insere um ticker valido.')
        return
      }

      const response = await apiClient.get(`/stocks/quick-analysis/${symbol}`)
      setData(response.data)
    } catch (err: unknown) {
      const apiError = axios.isAxiosError<{ error?: string }>(err) ? err : null
      const msg =
        apiError?.response?.status === 404
          ? `Ticker "${ticker.toUpperCase()}" nao encontrado.`
          : apiError?.response?.data?.error ||
            'Erro ao procurar o ticker. Verifica se a API esta ativa.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return {
    ticker,
    setTicker,
    searchStock,
    data,
    loading,
    error,
  }
}
