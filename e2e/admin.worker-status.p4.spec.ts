import { expect, test, type Page, type Route } from 'playwright/test'

const NOW = new Date().toISOString()

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

const currentRunningJob = {
  id: 'job-running-1',
  type: 'bulk_moderate',
  status: 'running',
  action: 'hide',
  reason: 'Contencao operacional de spam',
  note: 'Lote a ser processado pelo worker.',
  confirm: true,
  markFalsePositive: false,
  attemptCount: 2,
  maxAttempts: 3,
  workerId: 'admin-content-jobs:e2e:123:efgh5678',
  leaseExpiresAt: NOW,
  lastHeartbeatAt: NOW,
  actor: adminActor,
  items: [],
  progress: {
    requested: 10,
    processed: 4,
    succeeded: 3,
    failed: 1,
    changed: 3,
  },
  guardrails: {
    maxItems: 50,
    confirmThreshold: 10,
    duplicatesSkipped: 0,
  },
  approval: null,
  error: null,
  startedAt: NOW,
  finishedAt: null,
  createdAt: NOW,
  updatedAt: NOW,
}

const recentJobs = [
  currentRunningJob,
  {
    id: 'job-rollback-approved-1',
    type: 'bulk_rollback',
    status: 'queued',
    action: null,
    reason: 'Rollback aguardando reexecucao',
    note: 'Aprovado e em retry.',
    confirm: true,
    markFalsePositive: true,
    attemptCount: 1,
    maxAttempts: 3,
    workerId: null,
    leaseExpiresAt: null,
    lastHeartbeatAt: null,
    actor: adminActor,
    items: [],
    progress: {
      requested: 6,
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
      reviewStatus: 'approved',
      reviewNote: 'Amostra revista',
      reviewRequestedAt: NOW,
      reviewRequestedBy: adminActor,
      approvalNote: 'Pode seguir',
      approvedAt: NOW,
      approvedBy: adminActor,
      sampleRequired: true,
      recommendedSampleSize: 2,
      reviewedSampleKeys: ['article:content-1:evt-1'],
      sampleItems: [
        {
          contentType: 'article',
          contentId: 'content-1',
          eventId: 'evt-1',
          title: 'Conteudo aprovado para retry',
          targetStatus: 'visible',
          openReports: 2,
          uniqueReporters: 2,
          automatedSeverity: 'high',
          creatorRiskLevel: 'medium',
          requiresConfirm: false,
          warnings: ['Confirmar consistencia do estado antes da nova tentativa.'],
        },
      ],
      riskSummary: {
        restoreVisibleCount: 2,
        activeRiskCount: 1,
        highRiskCount: 1,
        criticalRiskCount: 0,
        falsePositiveEligibleCount: 1,
      },
      falsePositiveValidationRequired: true,
      falsePositiveValidated: true,
    },
    error: null,
    startedAt: null,
    finishedAt: null,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'job-failed-1',
    type: 'bulk_moderate',
    status: 'failed',
    action: 'restrict',
    reason: 'Falha apos max attempts',
    note: null,
    confirm: true,
    markFalsePositive: false,
    attemptCount: 3,
    maxAttempts: 3,
    workerId: null,
    leaseExpiresAt: null,
    lastHeartbeatAt: null,
    actor: adminActor,
    items: [],
    progress: {
      requested: 5,
      processed: 5,
      succeeded: 2,
      failed: 3,
      changed: 2,
    },
    guardrails: {
      maxItems: 50,
      confirmThreshold: 10,
      duplicatesSkipped: 1,
    },
    approval: null,
    error: 'Limite de retry esgotado.',
    startedAt: NOW,
    finishedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
  },
]

const workerStatus = {
  generatedAt: NOW,
  worker: {
    key: 'admin_content_jobs',
    status: 'stale',
    workerId: 'admin-content-jobs:e2e:123:efgh5678',
    processId: 1234,
    host: 'e2e-host',
    startedAt: NOW,
    stoppedAt: null,
    lastHeartbeatAt: NOW,
    currentJobId: currentRunningJob.id,
    currentJobType: currentRunningJob.type,
    currentJobStartedAt: NOW,
    lastJobFinishedAt: null,
    stats: {
      claimedJobs: 9,
      completedJobs: 6,
      failedJobs: 1,
      requeuedJobs: 2,
    },
    lastError: 'Lease expirado; job reencaminhado para nova tentativa.',
    lastErrorAt: NOW,
  },
  queue: {
    queued: 2,
    awaitingApproval: 1,
    running: 1,
    staleRunning: 1,
    retrying: 2,
    maxAttemptsReached: 1,
    failedLast24h: 3,
  },
  currentJob: currentRunningJob,
  config: {
    leaseMs: 60000,
    heartbeatMs: 5000,
    staleAfterMs: 60000,
    maxAttempts: 3,
  },
}

const installWorkerStatusMocks = async (page: Page) => {
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
      await fulfillJson(route, workerStatus)
      return
    }

    if (method === 'GET' && pathname.endsWith('/api/admin/content/jobs')) {
      await fulfillJson(route, {
        items: recentJobs,
        pagination: { page: 1, limit: 6, total: recentJobs.length, pages: 1 },
      })
      return
    }

    await fulfillJson(route, {
      items: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 1 },
    })
  })
}

test.describe('admin worker status p4', () => {
  test('admin observa estados stale, retries e max attempts no painel de jobs', async ({
    page,
  }) => {
    await installAdminSession(page)
    await installWorkerStatusMocks(page)

    await page.goto('/admin/conteudo')
    await expect(page.getByText('Moderacao de conteudo')).toBeVisible()
    await expect(page.getByText(/^Stale$/).first()).toBeVisible()
    await expect(
      page.getByText(/Fila executavel:\s*2\s*\|\s*a aguardar aprovacao\s*1/),
    ).toBeVisible()
    await expect(page.getByText(/Running:\s*1\s*\|\s*retries em curso\s*2/)).toBeVisible()
    await expect(page.getByText('Running stale: 1')).toBeVisible()
    await expect(page.getByText('Falhas 24h: 3')).toBeVisible()
    await expect(page.getByText('Max attempts atingido: 1')).toBeVisible()
    await expect(
      page.getByText('Ultimo erro: Lease expirado; job reencaminhado para nova tentativa.'),
    ).toBeVisible()
    await expect(
      page.getByText(/Job atual:\s*Moderacao\s*\|\s*tentativa 2\/3\s*\|\s*4\/10 processados/),
    ).toBeVisible()

    await expect(page.getByText('A correr')).toBeVisible()
    await expect(
      page.getByText(/Tentativa:\s*2\/3\s*\|\s*worker admin-content-jobs:e2e:123:efgh5678/),
    ).toBeVisible()
    await expect(page.getByText(/Heartbeat:/)).toHaveCount(2)
    await expect(page.getByText(/^Falhou$/).first()).toBeVisible()
    await expect(page.getByText(/Tentativa:\s*3\/3/)).toBeVisible()
    await expect(page.getByText(/^Aprovado$/).first()).toBeVisible()
  })
})
