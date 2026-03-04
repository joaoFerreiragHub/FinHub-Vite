import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import {
  useApproveBulkRollbackJob,
  useCreateBulkModerationJob,
} from '@/features/admin/hooks/useAdminContent'
import { adminContentService } from '@/features/admin/services/adminContentService'

jest.mock('@/features/admin/services/adminContentService', () => ({
  adminContentService: {
    createBulkModerationJob: jest.fn(),
    approveBulkRollbackJob: jest.fn(),
  },
}))

const mockedAdminContentService = adminContentService as jest.Mocked<typeof adminContentService>

const createWrapper = (queryClient: QueryClient) =>
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }

describe('useAdminContent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('invalidates jobs, worker status, and metrics after creating a bulk moderation job', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries')

    mockedAdminContentService.createBulkModerationJob.mockResolvedValueOnce({
      message: 'Job criado.',
      job: {
        id: 'job-1',
      },
    } as never)

    const { result } = renderHook(() => useCreateBulkModerationJob(), {
      wrapper: createWrapper(queryClient),
    })

    await act(async () => {
      await result.current.mutateAsync({
        action: 'hide',
        reason: 'Contencao',
        confirm: true,
        items: [{ contentType: 'article', contentId: 'content-1' }],
      })
    })

    expect(mockedAdminContentService.createBulkModerationJob).toHaveBeenCalledWith({
      action: 'hide',
      reason: 'Contencao',
      confirm: true,
      items: [{ contentType: 'article', contentId: 'content-1' }],
    })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['admin', 'content', 'jobs'] })
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['admin', 'content', 'jobs', 'worker-status'],
    })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['admin', 'metrics', 'overview'] })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['admin', 'metrics', 'drilldown'] })
  })

  it('invalidates jobs, worker status, and metrics after approving a rollback job', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries')

    mockedAdminContentService.approveBulkRollbackJob.mockResolvedValueOnce({
      message: 'Job aprovado.',
      job: {
        id: 'job-rollback-1',
      },
    } as never)

    const { result } = renderHook(() => useApproveBulkRollbackJob(), {
      wrapper: createWrapper(queryClient),
    })

    await act(async () => {
      await result.current.mutateAsync({
        jobId: 'job-rollback-1',
        payload: {
          note: 'Amostra revista',
          confirm: true,
          falsePositiveValidated: true,
          reviewedSampleItems: [
            {
              contentType: 'article',
              contentId: 'content-1',
              eventId: 'evt-1',
            },
          ],
        },
      })
    })

    expect(mockedAdminContentService.approveBulkRollbackJob).toHaveBeenCalledWith(
      'job-rollback-1',
      {
        note: 'Amostra revista',
        confirm: true,
        falsePositiveValidated: true,
        reviewedSampleItems: [
          {
            contentType: 'article',
            contentId: 'content-1',
            eventId: 'evt-1',
          },
        ],
      },
    )
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['admin', 'content', 'jobs'] })
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['admin', 'content', 'jobs', 'worker-status'],
    })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['admin', 'metrics', 'overview'] })
  })
})
