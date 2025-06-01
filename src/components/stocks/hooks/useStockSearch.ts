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
  margemBruta: '28',
  margemLiquida: '23',
  roe: '28',
  roic: '19',
  cagrEps: '12',
  epsGrowth5Y: '14',
  ebitdaGrowth5Y: '11',

  receita: '450B',
  receitaPorAcao: '28.3',
  lucroPorAcao: '5.3',
  receitaCagr3y: '8',
  receitaGrowth5y: '32',
  lucroCagr3y: '9',
  lucroGrowth5y: '27',

  debtToEquity: '0.8',
  currentRatio: '1.6',
  cash: '100B',
  interestCoverage: '9.5',

  netDebt: '50B',
  totalDebt: '120B',
  interestExpense: '3.2B',
  cashRatio: '0.6',
  debtToEBITDA: '1.1',
  netDebtToEBITDA: '0.5',

  riskFreeRate: '4.2',
  marketRiskPremium: '5.5',
  beta: '1.1',
  costOfEquity: '9',
  costOfDebt: '4.3',
  effectiveTaxRate: '23',
  wacc: '7.5',

  dividendYield: '1.2',
  dividend_pershare: '2.2',
  payoutRatio: '38',

  fundacao: '1976',
  ceo: 'Tim Cook',
  employees: '160000',

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
