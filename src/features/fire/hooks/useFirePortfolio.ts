import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { firePortfolioService } from '../services/firePortfolioService'
import type {
  CreateFireHoldingInput,
  CreateFirePortfolioInput,
  FirePortfolioListQuery,
  FireSimulationInput,
  UpdateFireHoldingInput,
  UpdateFirePortfolioInput,
} from '../types/firePortfolio'

interface FireQueryOptions {
  enabled?: boolean
}

const FIRE_PORTFOLIO_QUERY_KEY = ['fire', 'portfolio'] as const

export function useFirePortfolioList(query: FirePortfolioListQuery = {}, options?: FireQueryOptions) {
  return useQuery({
    queryKey: [...FIRE_PORTFOLIO_QUERY_KEY, 'list', query],
    queryFn: () => firePortfolioService.listPortfolios(query),
    enabled: options?.enabled ?? true,
    staleTime: 20_000,
  })
}

export function useFirePortfolioDetail(portfolioId: string | null, options?: FireQueryOptions) {
  return useQuery({
    queryKey: [...FIRE_PORTFOLIO_QUERY_KEY, 'detail', portfolioId],
    queryFn: () => firePortfolioService.getPortfolio(portfolioId || ''),
    enabled: Boolean(portfolioId) && (options?.enabled ?? true),
    staleTime: 20_000,
  })
}

export function useCreateFirePortfolio() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateFirePortfolioInput) => firePortfolioService.createPortfolio(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FIRE_PORTFOLIO_QUERY_KEY })
    },
  })
}

export function useUpdateFirePortfolio() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { portfolioId: string; payload: UpdateFirePortfolioInput }) =>
      firePortfolioService.updatePortfolio(input.portfolioId, input.payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: FIRE_PORTFOLIO_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...FIRE_PORTFOLIO_QUERY_KEY, 'detail', variables.portfolioId],
      })
    },
  })
}

export function useDeleteFirePortfolio() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (portfolioId: string) => firePortfolioService.deletePortfolio(portfolioId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FIRE_PORTFOLIO_QUERY_KEY })
    },
  })
}

export function useAddFireHolding() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { portfolioId: string; payload: CreateFireHoldingInput }) =>
      firePortfolioService.addHolding(input.portfolioId, input.payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: FIRE_PORTFOLIO_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...FIRE_PORTFOLIO_QUERY_KEY, 'detail', variables.portfolioId],
      })
    },
  })
}

export function useUpdateFireHolding() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { portfolioId: string; holdingId: string; payload: UpdateFireHoldingInput }) =>
      firePortfolioService.updateHolding(input.portfolioId, input.holdingId, input.payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: FIRE_PORTFOLIO_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...FIRE_PORTFOLIO_QUERY_KEY, 'detail', variables.portfolioId],
      })
    },
  })
}

export function useDeleteFireHolding() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { portfolioId: string; holdingId: string }) =>
      firePortfolioService.deleteHolding(input.portfolioId, input.holdingId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: FIRE_PORTFOLIO_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...FIRE_PORTFOLIO_QUERY_KEY, 'detail', variables.portfolioId],
      })
    },
  })
}

export function useRunFireSimulation() {
  return useMutation({
    mutationFn: (input: { portfolioId: string; payload?: FireSimulationInput }) =>
      firePortfolioService.simulatePortfolio(input.portfolioId, input.payload),
  })
}
