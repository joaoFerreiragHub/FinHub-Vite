// hooks/useStockSearch.ts
import { useState } from 'react'
import { StockData } from '@/features/tools/stocks/types/stocks'

const mockStockData: StockData = {
  symbol: 'AAPL',
  name: 'Apple Inc.',
  companyName: 'Apple Inc.',
  image: 'https://logo.clearbit.com/apple.com',
  sector: 'Tecnologia',
  industry: 'Hardware',
  exchange: 'NASDAQ',
  pais: 'Estados Unidos',
  price: 190.5,
  marketCap: '3T',
  enterpriseValue: '2.8T',

  valuationGrade: 'A',
  qualityScore: 8.8,
  growthScore: 8.2,
  riskScore: 3.1,

  eps: '5.3',
  pe: '18.5',
  pegRatio: '0.9',
  dcf: '220.00',
  leveredDCF: '215.00',
  freeCashFlow: '95B',

  ebitda: '110B',
  lucroLiquido: '100B',
  margemEbitda: '32',
  margemBruta: '28',
  margemLiquida: '23',
  netProfitMargin: '23',
  roe: '28',
  roic: '19',
  cagrEps: '12',
  epsGrowth5Y: '14',
  ebitdaGrowth5Y: '11',

  receita: '450B',
  receitaPorAcao: '28.3',
  receitaCagr3y: '8',
  receitaGrowth5y: '32',
  lucro: '100B',
  lucroPorAcao: '5.3',
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

  description: 'Empresa de tecnologia focada em hardware, software e serviços.',
  website: 'https://www.apple.com',
  ipoDate: '1980-12-12',
  address: 'One Apple Park Way, Cupertino, CA',
  indicadores: {},
  radarData: [],
  radarPeers: [],
  alerts: [],
  peers: ['MSFT', 'GOOGL', 'NVDA'],
  peersQuotes: [],
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
    } catch {
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
