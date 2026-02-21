import { createContext, ReactNode, useContext } from 'react'
import { QuickMetricState } from '@/features/tools/stocks/types/stocks'

interface QuickMetricGovernanceContextValue {
  states?: Record<string, QuickMetricState>
}

const QuickMetricGovernanceContext = createContext<QuickMetricGovernanceContextValue | null>(null)

interface QuickMetricGovernanceProviderProps {
  states?: Record<string, QuickMetricState>
  children: ReactNode
}

export function QuickMetricGovernanceProvider({
  states,
  children,
}: QuickMetricGovernanceProviderProps) {
  return (
    <QuickMetricGovernanceContext.Provider value={{ states }}>
      {children}
    </QuickMetricGovernanceContext.Provider>
  )
}

export function useQuickMetricGovernance() {
  return useContext(QuickMetricGovernanceContext)
}
