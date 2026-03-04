import { fireEvent, screen, within } from '@testing-library/react'
import ContentModerationPage from '@/features/admin/pages/ContentModerationPage'
import * as adminContentHooks from '@/features/admin/hooks/useAdminContent'
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders'

jest.mock('@/features/admin/hooks/useAdminContent')

const mockedHooks = adminContentHooks as jest.Mocked<typeof adminContentHooks>

const baseWorkerStatus = {
  generatedAt: '2026-03-04T10:00:00.000Z',
  worker: {
    key: 'admin_content_jobs',
    status: 'idle',
    workerId: 'worker-1',
    processId: 1234,
    host: 'localhost',
    startedAt: '2026-03-04T09:00:00.000Z',
    stoppedAt: null,
    lastHeartbeatAt: '2026-03-04T10:00:00.000Z',
    currentJobId: null,
    currentJobType: null,
    currentJobStartedAt: null,
    lastJobFinishedAt: null,
    stats: {
      claimedJobs: 0,
      completedJobs: 0,
      failedJobs: 0,
      requeuedJobs: 0,
    },
    lastError: null,
    lastErrorAt: null,
  },
  queue: {
    queued: 1,
    awaitingApproval: 1,
    running: 0,
    staleRunning: 0,
    retrying: 0,
    maxAttemptsReached: 0,
    failedLast24h: 0,
  },
  currentJob: null,
  config: {
    leaseMs: 60000,
    heartbeatMs: 5000,
    staleAfterMs: 60000,
    maxAttempts: 3,
  },
}

const reviewJob = {
  id: 'job-rollback-1',
  type: 'bulk_rollback',
  status: 'queued',
  action: null,
  reason: 'Rollback validado',
  note: 'Lote critico',
  confirm: true,
  markFalsePositive: true,
  attemptCount: 0,
  maxAttempts: 3,
  workerId: null,
  leaseExpiresAt: null,
  lastHeartbeatAt: null,
  actor: {
    id: 'admin-1',
    name: 'Admin',
    role: 'admin',
  },
  items: [],
  progress: {
    requested: 1,
    processed: 0,
    succeeded: 0,
    failed: 0,
    changed: 0,
  },
  guardrails: {
    maxItems: 50,
    confirmThreshold: 10,
    duplicatesSkipped: 0,
  },
  approval: {
    required: true,
    reviewStatus: 'review',
    reviewNote: 'Amostra revista',
    reviewRequestedAt: '2026-03-04T10:00:00.000Z',
    reviewRequestedBy: {
      id: 'admin-2',
      name: 'Reviewer',
      role: 'admin',
    },
    approvalNote: null,
    approvedAt: null,
    approvedBy: null,
    sampleRequired: true,
    recommendedSampleSize: 1,
    reviewedSampleKeys: [],
    sampleItems: [
      {
        contentType: 'article',
        contentId: 'content-1',
        eventId: 'evt-1',
        title: 'Conteudo em revisao',
        targetStatus: 'visible',
        openReports: 4,
        uniqueReporters: 3,
        automatedSeverity: 'critical',
        creatorRiskLevel: 'high',
        requiresConfirm: true,
        warnings: ['Ha risco ativo.'],
      },
    ],
    riskSummary: {
      restoreVisibleCount: 1,
      activeRiskCount: 1,
      highRiskCount: 1,
      criticalRiskCount: 1,
      falsePositiveEligibleCount: 1,
    },
    falsePositiveValidationRequired: true,
    falsePositiveValidated: false,
  },
  error: null,
  startedAt: null,
  finishedAt: null,
  createdAt: '2026-03-04T09:30:00.000Z',
  updatedAt: '2026-03-04T10:00:00.000Z',
}

const buildQueueQueryResult = () => ({
  data: {
    items: [],
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      pages: 1,
    },
  },
  isLoading: false,
  isError: false,
  isFetching: false,
  error: null,
  refetch: jest.fn(),
})

const buildJobsQueryResult = () => ({
  data: {
    items: [reviewJob],
    pagination: {
      page: 1,
      limit: 6,
      total: 1,
      pages: 1,
    },
  },
  isLoading: false,
  isError: false,
  error: null,
  refetch: jest.fn(),
})

const buildIdleMutation = () => ({
  mutateAsync: jest.fn(),
  isPending: false,
})

const renderPage = (initialRoute = '/admin/conteudo') =>
  (() => {
    window.history.pushState({}, '', initialRoute)

    return renderWithProviders(<ContentModerationPage />, {
      initialRoute,
      authState: {
        user: {
          id: 'admin-1',
          role: 'admin',
          email: 'admin@example.com',
          name: 'Admin',
          username: 'admin',
          adminReadOnly: false,
          adminScopes: ['admin.content.read', 'admin.content.moderate'],
        } as never,
        isAuthenticated: true,
      },
    })
  })()

describe('ContentModerationPage', () => {
  beforeAll(() => {
    Element.prototype.scrollIntoView = jest.fn()
  })

  beforeEach(() => {
    jest.clearAllMocks()

    mockedHooks.useAdminContentQueue.mockReturnValue(buildQueueQueryResult() as never)
    mockedHooks.useAdminContentHistory.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as never)
    mockedHooks.useAdminContentRollbackReview.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as never)
    mockedHooks.useAdminContentJobs.mockReturnValue(buildJobsQueryResult() as never)
    mockedHooks.useAdminContentWorkerStatus.mockReturnValue({
      data: baseWorkerStatus,
      isLoading: false,
      isError: false,
      error: null,
    } as never)
    mockedHooks.useHideAdminContent.mockReturnValue(buildIdleMutation() as never)
    mockedHooks.useUnhideAdminContent.mockReturnValue(buildIdleMutation() as never)
    mockedHooks.useRestrictAdminContent.mockReturnValue(buildIdleMutation() as never)
    mockedHooks.useRollbackAdminContent.mockReturnValue(buildIdleMutation() as never)
    mockedHooks.useCreateBulkModerationJob.mockReturnValue(buildIdleMutation() as never)
    mockedHooks.useRequestBulkRollbackJobReview.mockReturnValue(buildIdleMutation() as never)
    mockedHooks.useApproveBulkRollbackJob.mockReturnValue(buildIdleMutation() as never)
  })

  it('reads deep-link context from the URL and applies it to queue/jobs queries', () => {
    renderPage(
      '/admin/conteudo?creatorId=creator-1&contentType=article&flaggedOnly=flagged&panel=jobs&jobId=job-rollback-1',
    )

    expect(mockedHooks.useAdminContentQueue).toHaveBeenCalledWith(
      expect.objectContaining({
        creatorId: 'creator-1',
        contentType: 'article',
        flaggedOnly: true,
        page: 1,
        limit: 20,
      }),
    )
    expect(screen.getByText('Contexto creator')).toBeInTheDocument()
    expect(screen.getByText('creator-1')).toBeInTheDocument()
    expect(screen.getByText('Deep-link')).toBeInTheDocument()
  })

  it('keeps rollback approval disabled until sample, validation, and confirm token are provided', () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Aprovar lote' }))

    const dialog = screen.getByRole('dialog')
    const approveButton = within(dialog).getByRole('button', {
      name: 'Aprovar e libertar job',
    })
    expect(approveButton).toBeDisabled()

    const checkboxes = within(dialog).getAllByRole('checkbox')
    fireEvent.click(checkboxes[0])
    fireEvent.click(checkboxes[1])
    fireEvent.change(within(dialog).getByLabelText(/Confirmacao dupla \(escreve CONFIRMAR\)/i), {
      target: { value: 'CONFIRMAR' },
    })

    expect(within(dialog).getByLabelText(/Confirmacao dupla \(escreve CONFIRMAR\)/i)).toHaveValue(
      'CONFIRMAR',
    )
    expect(approveButton).toBeEnabled()
  })
})
