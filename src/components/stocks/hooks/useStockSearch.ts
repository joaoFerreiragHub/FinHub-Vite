// hooks/useStockSearch.ts
import { useState } from 'react'
import { StockData } from '../../../types/stocks'


const mockStockData: StockData = {
  symbol: 'AAPL',
  companyName: 'Apple Inc.',
  image: 'https://logo.clearbit.com/apple.com',
  setor: 'Tecnologia',
  industry: 'Hardware',
  exchange: 'NASDAQ',
  pais: 'Estados Unidos',
  preco: '190.50',
  marketCap: '3T',
  enterpriseValue: '2.8T',
  eps: '5.3',
  pe: '18.5',
  pegRatio: '0.9',
  dcf: '220.00',
  ebitda: '110B',
  lucroLiquido: '100B',
  margemEbitda: '32',
  roe: '28',
  peers: ['MSFT', 'GOOGL', 'NVDA'],
}

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
      if (!ticker.trim()) {
        setError('Insere um ticker válido.')
        return
      }

      await new Promise((r) => setTimeout(r, 800)) // simula delay
      setData({ ...mockStockData, symbol: ticker.toUpperCase() })
    } catch  {
      setError('Erro ao procurar o ticker.')
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
