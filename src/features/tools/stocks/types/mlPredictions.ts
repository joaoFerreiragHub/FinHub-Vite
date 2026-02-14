// types/mlPredictions.ts
export interface MLPredictions {
  symbol: string
  timestamp: string
  sector: string
  sectorConfig: {
    name: string
    keyMetrics: {
      primary: string[]
      secondary: string[]
    }
    benchmarks: {
      avgPE: number
      avgMargin: number
      avgGrowth: number
      avgROE: number
    }
  }
  earnings: {
    nextQuarter: {
      surprise: number
      confidence: number
      drivers: string[]
      sectorContext: string
    }
    trend: (number | null)[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    quality: any | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vsEstimates: any | null
  }
  priceTarget: {
    current: number
    target3M: number
    upside: number
    confidence: number
    range: {
      low: number
      high: number
    }
    probabilityDistribution: Array<{
      range: string
      prob: number
    }>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vsBenchmark: any | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    technicalSupport: any
  }
  riskFactors: Array<{
    factor: string
    severity: 'low' | 'medium' | 'high'
    impact: number
    description: string
  }>
  modelMetrics: {
    earnings: {
      accuracy: number
      lastUpdate: string
      sectorSpecific: boolean
    }
    price: {
      accuracy: number
      lastUpdate: string
      sharpeRatio: number
    }
    sector: {
      name: string
      coverage: number
      reliability: number
    }
  }
  modelInsights: string[]
  marketContext: {
    sectorPerformance: number
    sectorPE: number
    sectorPEDeviation: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    economicIndicators: any | null
    peersCount: number
  }
  analytics: {
    dataQuality: number
    modelConfidence: {
      dataQuality: number
      sectorCoverage: number
    }
    sectorComparison: {
      growthVsSector: number
      marginVsSector: number
      roeVsSector: number
      overallRanking: string
    }
    riskAdjustedReturn: number
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug?: any
}

export interface EarningsOnly {
  symbol: string
  sector: string
  earningsSurprise: number
  confidence: number
  drivers: string[]
  sectorContext: string
  lastUpdate: string
}

export interface RiskFactor {
  factor: string
  severity: 'low' | 'medium' | 'high'
  impact: number
  description: string
}

export interface SectorInfo {
  name: string
  performance: number
  pe: number
}

export interface ProbabilityDistribution {
  range: string
  prob: number
}

export interface ModelMetrics {
  earnings: {
    accuracy: number
    lastUpdate: string
    sectorSpecific: boolean
  }
  price: {
    accuracy: number
    lastUpdate: string
    sharpeRatio: number
  }
  sector: {
    name: string
    coverage: number
    reliability: number
  }
}

// API Response types
export interface MLPredictionsApiResponse {
  earnings: EarningsOnly
  full?: MLPredictions
}

// Hook return types
export interface UseMLPredictionsReturn {
  data: MLPredictions | null
  earningsOnly: EarningsOnly | null
  loading: boolean
  error: string | null
  hasData: boolean
  hasFullData: boolean
  confidence: number
  sectorInfo: SectorInfo | null
  refetch: () => Promise<void>
  clearCache: () => void
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  isEmpty: boolean
}
