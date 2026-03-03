import { expect, test, type Page, type Route } from 'playwright/test'

const NOW = new Date().toISOString()
const SAMPLE_EVENT_ID = 'evt-rollback-1'
const SAMPLE_CONTENT_ID = 'content-sample-1'

type RollbackJobPhase = 'draft' | 'review' | 'running'

interface RollbackJobFlowState {
  phase: RollbackJobPhase
  reviewNote: string | null
  approvalNote: string | null
}

const adminActor = {
  id: 'e2e-admin-user-1',
  name: 'E2E Admin',
  username: 'e2e-admin',
  email: 'admin@finhub.test',
  role: 'admin',
}

const buildAuthStorage = () =>
  JSON.stringify({
    state: {
      user: {
        ...adminActor,
        accountStatus: 'active',
        adminReadOnly: false,
        adminScopes: ['admin.content.read', 'admin.content.moderate'],
        isEmailVerified: true,
        createdAt: NOW,
        updatedAt: NOW,
      },
      accessToken: 'dev-e2e-access-token',
      refreshToken: 'dev-e2e-refresh-token',
      isAuthenticated: true,
    },
    version: 0,
  })

const installAdminSession = async (page: Page) => {
  const authStorage = buildAuthStorage()
  await page.addInitScript((value: string) => {
    window.localStorage.setItem('auth-storage', value)
    window.localStorage.setItem('auth-dev-role', 'admin')
  }, authStorage)
}

const fulfillJson = async (route: Route, data: unknown) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(data),
  })
}

const buildRollbackJob = (state: RollbackJobFlowState) => ({
  id: 'job-rollback-1',
  type: 'bulk_rollback',
  status: state.phase === 'running' ? 'running' : 'queued',
  action: null,
  reason: 'Rollback assistido apos revisao operacional',
  note: 'Lote critico usado em E2E.',
  confirm: state.phase === 'running',
  markFalsePositive: true,
  attemptCount: state.phase === 'running' ? 1 : 0,
  maxAttempts: 3,
  workerId: state.phase === 'running' ? 'admin-content-jobs:e2e:123:abcd1234' : null,
  leaseExpiresAt: state.phase === 'running' ? NOW : null,
  lastHeartbeatAt: state.phase === 'running' ? NOW : null,
  actor: adminActor,
  items: [
    {
      contentType: 'article',
      contentId: SAMPLE_CONTENT_ID,
      eventId: SAMPLE_EVENT_ID,
      status: state.phase === 'running' ? 'success' : 'pending',
      changed: state.phase === 'running',
      fromStatus: state.phase === 'running' ? 'hidden' : undefined,
      toStatus: state.phase === 'running' ? 'visible' : undefined,
      error: null,
      statusCode: null,
    },
  ],
  progress: {
    requested: 1,
    processed: state.phase === 'running' ? 1 : 0,
    succeeded: state.phase === 'running' ? 1 : 0,
    failed: 0,
    changed: state.phase === 'running' ? 1 : 0,
  },
  guardrails: {
    maxItems: 50,
    confirmThreshold: 10,
    duplicatesSkipped: 0,
  },
  approval: {
    required: true,
    reviewStatus:
      state.phase === 'draft' ? 'draft' : state.phase === 'review' ? 'review' : 'approved',
    reviewNote: state.reviewNote,
    reviewRequestedAt: state.phase === 'draft' ? null : NOW,
    reviewRequestedBy: state.phase === 'draft' ? null : adminActor,
    approvalNote: state.approvalNote,
    approvedAt: state.phase === 'running' ? NOW : null,
    approvedBy: state.phase === 'running' ? adminActor : null,
    sampleRequired: true,
    recommendedSampleSize: 1,
    reviewedSampleKeys:
      state.phase === 'running' ? [`article:${SAMPLE_CONTENT_ID}:${SAMPLE_EVENT_ID}`] : [],
    sampleItems: [
      {
        contentType: 'article',
        contentId: SAMPLE_CONTENT_ID,
        eventId: SAMPLE_EVENT_ID,
        title: 'Artigo revisto para rollback em lote',
        targetStatus: 'visible',
        openReports: 4,
        uniqueReporters: 3,
        automatedSeverity: 'critical',
        creatorRiskLevel: 'high',
        requiresConfirm: true,
        warnings: ['Ha reports ativos.', 'A reativacao volta a expor o alvo.'],
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
    falsePositiveValidated: state.phase === 'running',
  },
  error: null,
  startedAt: state.phase === 'running' ? NOW : null,
  finishedAt: null,
  createdAt: NOW,
  updatedAt: NOW,
})

const buildWorkerStatus = (state: RollbackJobFlowState) => ({
  generatedAt: NOW,
  worker: {
    key: 'admin_content_jobs',
    status: state.phase === 'running' ? 'processing' : 'idle',
    workerId: 'admin-content-jobs:e2e:123:abcd1234',
    processId: 1234,
    host: 'e2e-host',
    startedAt: NOW,
    stoppedAt: null,
    lastHeartbeatAt: NOW,
    currentJobId: state.phase === 'running' ? 'job-rollback-1' : null,
    currentJobType: state.phase === 'running' ? 'bulk_rollback' : null,
    currentJobStartedAt: state.phase === 'running' ? NOW : null,
    lastJobFinishedAt: null,
    stats: {
      claimedJobs: state.phase === 'running' ? 1 : 0,
      completedJobs: 0,
      failedJobs: 0,
      requeuedJobs: 0,
    },
    lastError: null,
    lastErrorAt: null,
  },
  queue: {
    queued: 0,
    awaitingApproval: state.phase === 'running' ? 0 : 1,
    running: state.phase === 'running' ? 1 : 0,
    staleRunning: 0,
    retrying: 0,
    maxAttemptsReached: 0,
    failedLast24h: 0,
  },
  currentJob: state.phase === 'running' ? buildRollbackJob(state) : null,
  config: {
    leaseMs: 60000,
    heartbeatMs: 5000,
    staleAfterMs: 60000,
    maxAttempts: 3,
  },
})

const installRollbackJobMocks = async (page: Page, state: RollbackJobFlowState) => {
  await page.route('**/api/admin/**', async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const { pathname } = url
    const method = request.method().toUpperCase()

    if (method === 'GET' && pathname.endsWith('/api/admin/content/queue')) {
      await fulfillJson(route, {
        items: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 1 },
      })
      return
    }

    if (method === 'GET' && pathname.endsWith('/api/admin/content/jobs/worker-status')) {
      await fulfillJson(route, buildWorkerStatus(state))
      return
    }

    if (method === 'GET' && pathname.endsWith('/api/admin/content/jobs')) {
      await fulfillJson(route, {
        items: [buildRollbackJob(state)],
        pagination: { page: 1, limit: 6, total: 1, pages: 1 },
      })
      return
    }

    if (
      method === 'POST' &&
      pathname.endsWith('/api/admin/content/jobs/job-rollback-1/request-review')
    ) {
      const payload = request.postDataJSON() as { note?: string }
      expect(payload.note).toBe('Revisao operacional pronta')

      state.phase = 'review'
      state.reviewNote = payload.note ?? null

      await fulfillJson(route, {
        message: 'Job de rollback em lote submetido para revisao.',
        job: buildRollbackJob(state),
      })
      return
    }

    if (method === 'POST' && pathname.endsWith('/api/admin/content/jobs/job-rollback-1/approve')) {
      const payload = request.postDataJSON() as {
        note?: string
        confirm?: boolean
        falsePositiveValidated?: boolean
        reviewedSampleItems?: Array<{
          contentType: string
          contentId: string
          eventId: string
        }>
      }

      expect(payload.note).toBe('Amostra validada e lote libertado')
      expect(payload.confirm).toBe(true)
      expect(payload.falsePositiveValidated).toBe(true)
      expect(payload.reviewedSampleItems).toEqual([
        {
          contentType: 'article',
          contentId: SAMPLE_CONTENT_ID,
          eventId: SAMPLE_EVENT_ID,
        },
      ])

      state.phase = 'running'
      state.approvalNote = payload.note ?? null

      await fulfillJson(route, {
        message: 'Job de rollback em lote aprovado.',
        job: buildRollbackJob(state),
      })
      return
    }

    await fulfillJson(route, {
      items: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 1 },
    })
  })
}

test.describe('admin rollback jobs p4', () => {
  test('admin submete rollback em lote para revisao e aprova lote critico', async ({ page }) => {
    const state: RollbackJobFlowState = {
      phase: 'draft',
      reviewNote: null,
      approvalNote: null,
    }

    await installAdminSession(page)
    await installRollbackJobMocks(page, state)

    await page.goto('/admin/conteudo')
    await expect(page.getByText('Moderacao de conteudo')).toBeVisible()
    await expect(
      page.getByText(/Fila executavel:\s*0\s*\|\s*a aguardar aprovacao\s*1/),
    ).toBeVisible()

    await page.getByRole('button', { name: 'Submeter revisao' }).click()
    await expect(
      page.getByRole('heading', { name: 'Submeter rollback em lote para revisao' }),
    ).toBeVisible()

    await page.fill('#admin-content-job-review-note', 'Revisao operacional pronta')
    await page.getByRole('button', { name: 'Submeter para revisao' }).click()

    await expect(page.getByText('Job de rollback em lote submetido para revisao.')).toBeVisible()
    await expect(page.getByText('Em revisao')).toBeVisible()

    await page.getByRole('button', { name: 'Aprovar lote' }).click()
    const approvalDialog = page.getByRole('dialog')
    await expect(
      approvalDialog.getByRole('heading', { name: 'Aprovar rollback em lote' }),
    ).toBeVisible()

    const approveButton = approvalDialog.getByRole('button', { name: 'Aprovar e libertar job' })
    await expect(approveButton).toBeDisabled()

    await approvalDialog.getByRole('checkbox').nth(0).click()
    await approvalDialog
      .getByText('Confirmo a validacao manual dos false positives deste lote')
      .click()
    await page.locator('#admin-content-job-approval-note').fill('Amostra validada e lote libertado')
    await page.locator('#admin-content-job-approval-confirm').fill('CONFIRMAR')

    await expect(approveButton).toBeEnabled()
    await approveButton.click()

    await expect(page.getByText('Job de rollback em lote aprovado.')).toBeVisible()
    await expect(
      page.getByText(/Fila executavel:\s*0\s*\|\s*a aguardar aprovacao\s*0/),
    ).toBeVisible()
    await expect(page.getByText(/Running:\s*1\s*\|\s*retries em curso\s*0/)).toBeVisible()
    await expect(page.getByText(/Job atual:\s*Rollback/)).toBeVisible()
    await expect(page.getByText(/^Aprovado$/).first()).toBeVisible()
  })
})
