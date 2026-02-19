import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RaioXInput, RaioXSnapshot, RaioXSummary } from './types'

const MAX_SNAPSHOTS = 50

interface RaioXStore {
  snapshots: RaioXSnapshot[]
  saveSnapshot: (input: RaioXInput, summary: RaioXSummary) => void
  deleteSnapshot: (id: string) => void
  clearSnapshots: () => void
  loadSnapshot: (id: string) => RaioXInput | null
}

export const useRaioXStore = create<RaioXStore>()(
  persist(
    (set, get) => ({
      snapshots: [],

      saveSnapshot: (input, summary) => {
        const snapshot: RaioXSnapshot = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          input: { ...input },
          summary: {
            score: summary.score,
            savingsRate: summary.savingsRate,
            debtToIncomeRatio: summary.debtToIncomeRatio,
            investmentRate: summary.investmentRate,
            emergencyFundMonths: summary.emergencyFundMonths,
            fireProgress: summary.fireProgress,
            projectedNetWorthAfterTax: summary.projectedNetWorthAfterTax,
            estimatedYearsToFire: summary.estimatedYearsToFire,
          },
        }

        set((state) => {
          const updated = [snapshot, ...state.snapshots].slice(0, MAX_SNAPSHOTS)
          return { snapshots: updated }
        })
      },

      deleteSnapshot: (id) => {
        set((state) => ({
          snapshots: state.snapshots.filter((s) => s.id !== id),
        }))
      },

      clearSnapshots: () => set({ snapshots: [] }),

      loadSnapshot: (id) => {
        const snapshot = get().snapshots.find((s) => s.id === id)
        return snapshot ? { ...snapshot.input } : null
      },
    }),
    {
      name: 'finhub-raio-x-snapshots',
    },
  ),
)
