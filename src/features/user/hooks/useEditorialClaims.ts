import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { editorialClaimsService } from '../services/editorialClaimsService'
import type {
  CancelEditorialClaimInput,
  CreateEditorialClaimInput,
  EditorialMyClaimsQuery,
} from '../services/editorialClaimsService'

interface EditorialClaimsQueryOptions {
  enabled?: boolean
}

interface CancelClaimMutationInput {
  claimId: string
  input?: CancelEditorialClaimInput
}

export function useMyEditorialClaims(
  query: EditorialMyClaimsQuery,
  options?: EditorialClaimsQueryOptions,
) {
  return useQuery({
    queryKey: ['editorial', 'claims', 'my', query],
    queryFn: () => editorialClaimsService.listMyClaims(query),
    enabled: options?.enabled ?? true,
  })
}

export function useCreateMyEditorialClaim() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateEditorialClaimInput) => editorialClaimsService.createMyClaim(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['editorial', 'claims', 'my'] })
    },
  })
}

export function useCancelMyEditorialClaim() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ claimId, input }: CancelClaimMutationInput) =>
      editorialClaimsService.cancelMyClaim(claimId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['editorial', 'claims', 'my'] })
    },
  })
}
