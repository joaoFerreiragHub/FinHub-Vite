import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminFinancialToolsService } from '../services/adminFinancialToolsService'
import type {
  AdminFinancialToolKey,
  AdminFinancialToolListQuery,
  AdminFinancialToolUpdatePayload,
  AdminFinancialToolUsageQuery,
} from '../types/adminFinancialTools'

interface AdminFinancialToolsQueryOptions {
  enabled?: boolean
}

const ADMIN_FINANCIAL_TOOLS_QUERY_KEY = ['admin', 'tools', 'financial'] as const

export function useAdminFinancialTools(
  query: AdminFinancialToolListQuery,
  options?: AdminFinancialToolsQueryOptions,
) {
  return useQuery({
    queryKey: [...ADMIN_FINANCIAL_TOOLS_QUERY_KEY, 'controls', query],
    queryFn: () => adminFinancialToolsService.list(query),
    staleTime: 30_000,
    enabled: options?.enabled ?? true,
  })
}

export function useAdminFinancialToolsUsage(
  query: AdminFinancialToolUsageQuery,
  options?: AdminFinancialToolsQueryOptions,
) {
  return useQuery({
    queryKey: [...ADMIN_FINANCIAL_TOOLS_QUERY_KEY, 'usage', query],
    queryFn: () => adminFinancialToolsService.usage(query),
    staleTime: 30_000,
    enabled: options?.enabled ?? true,
  })
}

export function useUpdateAdminFinancialTool() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { tool: AdminFinancialToolKey; payload: AdminFinancialToolUpdatePayload }) =>
      adminFinancialToolsService.update(input.tool, input.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_FINANCIAL_TOOLS_QUERY_KEY })
    },
  })
}
