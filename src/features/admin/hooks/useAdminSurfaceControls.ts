import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminSurfaceControlsService } from '../services/adminSurfaceControlsService'
import type {
  AdminSurfaceControlItem,
  AdminSurfaceControlUpdatePayload,
} from '../types/adminSurfaceControls'

interface UpdateSurfaceControlInput {
  key: AdminSurfaceControlItem['key']
  payload: AdminSurfaceControlUpdatePayload
}

export function useAdminSurfaceControls(enabled = true) {
  return useQuery({
    queryKey: ['admin', 'surface-controls'],
    queryFn: () => adminSurfaceControlsService.list(),
    enabled,
  })
}

export function useUpdateAdminSurfaceControl() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ key, payload }: UpdateSurfaceControlInput) =>
      adminSurfaceControlsService.update(key, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'surface-controls'] })
    },
  })
}
