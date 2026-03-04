import { adminContentService } from '@/features/admin/services/adminContentService'
import { apiClient } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('adminContentService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps queue response and forwards query params', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: 'content-1',
            contentType: 'article',
            title: 'Titulo',
            slug: 'titulo',
            description: 'Descricao',
            category: 'finance',
            status: 'published',
            moderationStatus: 'visible',
            moderationReason: null,
            moderationNote: null,
            moderatedAt: null,
            moderatedBy: null,
            creator: {
              id: 'creator-1',
              name: 'Creator',
              role: 'creator',
            },
            reportSignals: {
              openReports: 4,
              uniqueReporters: 3,
              latestReportAt: '2026-02-20T11:30:00.000Z',
              topReasons: [{ reason: 'scam', count: 2 }],
              priorityScore: 12,
              priority: 'critical',
            },
            automatedSignals: {
              active: true,
              status: 'active',
              score: 14,
              severity: 'critical',
              recommendedAction: 'hide',
              triggerSource: 'publish',
              triggeredRules: [
                {
                  rule: 'suspicious_link',
                  score: 8,
                  severity: 'high',
                  description: 'Padrao de links suspeitos detetado.',
                },
              ],
              lastDetectedAt: '2026-02-20T11:40:00.000Z',
              lastEvaluatedAt: '2026-02-20T11:40:00.000Z',
              textSignals: {
                textLength: 240,
                tokenCount: 38,
                uniqueTokenRatio: 0.42,
                urlCount: 4,
                suspiciousUrlCount: 2,
                duplicateUrlCount: 1,
                repeatedTokenCount: 3,
                duplicateLineCount: 0,
              },
              activitySignals: {
                sameSurfaceLast10m: 4,
                sameSurfaceLast60m: 7,
                portfolioLast10m: 4,
                portfolioLast60m: 8,
              },
              automation: {
                enabled: false,
                eligible: true,
                blockedReason: 'auto_hide_disabled',
                attempted: false,
                executed: false,
                action: null,
                lastOutcome: null,
                lastError: null,
                lastAttemptAt: null,
              },
            },
            policySignals: {
              recommendedAction: 'hide',
              escalation: 'critical',
              automationEligible: true,
              automationEnabled: false,
              automationBlockedReason: 'auto_hide_disabled',
              matchedReasons: ['scam'],
              profile: {
                key: 'multi_surface_discovery',
                label: 'Discovery multi-superficie',
                primarySurface: 'editorial_home',
                surfaces: [
                  'editorial_home',
                  'editorial_verticals',
                  'creator_page',
                  'search',
                  'derived_feeds',
                ],
              },
              thresholds: {
                reviewMinPriority: 'low',
                restrictMinPriority: 'medium',
                highPriorityHideMinUniqueReporters: 2,
                highRiskHideMinUniqueReporters: 2,
                autoHideMinPriority: 'critical',
                autoHideMinUniqueReporters: 3,
                autoHideAllowedReasons: ['scam'],
              },
            },
            creatorTrustSignals: {
              trustScore: 38,
              riskLevel: 'high',
              recommendedAction: 'block_publishing',
              generatedAt: '2026-02-20T11:30:00.000Z',
              summary: {
                openReports: 4,
                highPriorityTargets: 1,
                criticalTargets: 1,
                hiddenItems: 0,
                restrictedItems: 0,
                recentModerationActions30d: 2,
                repeatModerationTargets30d: 1,
                recentCreatorControlActions30d: 0,
                falsePositiveEvents30d: 2,
                automatedFalsePositiveEvents30d: 1,
                falsePositiveRate30d: 100,
                falsePositiveCompensationScore30d: 8,
                dominantFalsePositiveCategory30d: 'automated_detection',
                dominantAutomatedFalsePositiveRule30d: 'suspicious_link',
                falsePositiveCategoryBreakdown30d: {
                  reports: 1,
                  policy_auto_hide: 0,
                  automated_detection: 2,
                  manual_moderation: 0,
                },
                automatedFalsePositiveRuleBreakdown30d: {
                  spam: 0,
                  suspicious_link: 2,
                  flood: 0,
                  mass_creation: 0,
                },
                activeControlFlags: [],
              },
              flags: ['critical_report_targets'],
              reasons: ['1 alvo com reports criticos.'],
            },
            createdAt: '2026-02-20T10:00:00.000Z',
            updatedAt: '2026-02-20T11:00:00.000Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          pages: 1,
        },
      },
    })

    const result = await adminContentService.listQueue({
      contentType: 'article',
      moderationStatus: 'visible',
      publishStatus: 'published',
      search: 'titulo',
      flaggedOnly: true,
      minReportPriority: 'high',
      page: 1,
      limit: 20,
    })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/content/queue', {
      params: {
        contentType: 'article',
        moderationStatus: 'visible',
        publishStatus: 'published',
        search: 'titulo',
        flaggedOnly: 'true',
        minReportPriority: 'high',
        page: 1,
        limit: 20,
      },
    })

    expect(result.items[0]).toMatchObject({
      id: 'content-1',
      contentType: 'article',
      moderationStatus: 'visible',
      creator: { id: 'creator-1' },
      reportSignals: { priority: 'critical' },
      automatedSignals: {
        active: true,
        severity: 'critical',
        triggeredRules: [{ rule: 'suspicious_link' }],
      },
      creatorTrustSignals: { riskLevel: 'high' },
      policySignals: {
        profile: {
          key: 'multi_surface_discovery',
        },
        thresholds: {
          highPriorityHideMinUniqueReporters: 2,
        },
      },
    })
  })

  it('maps comment and review queue items from backend', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: 'comment-1',
            contentType: 'comment',
            title: 'Comentario ofensivo',
            slug: 'comment-1',
            description: 'Comentario em article:abc',
            category: 'article',
            status: 'published',
            moderationStatus: 'hidden',
            moderationReason: 'Abuso',
            moderationNote: null,
            moderatedAt: '2026-02-20T11:00:00.000Z',
            creator: { id: 'user-1', name: 'User 1', role: 'free' },
            moderatedBy: { id: 'admin-1', name: 'Admin', role: 'admin' },
            createdAt: '2026-02-20T10:00:00.000Z',
            updatedAt: '2026-02-20T11:00:00.000Z',
          },
          {
            id: 'review-1',
            contentType: 'review',
            title: 'Review 1/5',
            slug: 'review-1',
            description: 'Spam',
            category: 'course',
            status: 'published',
            moderationStatus: 'restricted',
            moderationReason: 'Spam',
            moderationNote: null,
            moderatedAt: null,
            creator: { id: 'user-2', name: 'User 2', role: 'premium' },
            moderatedBy: null,
            createdAt: '2026-02-20T09:00:00.000Z',
            updatedAt: '2026-02-20T09:00:00.000Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          pages: 1,
        },
      },
    })

    const result = await adminContentService.listQueue({
      contentType: 'comment',
      page: 1,
      limit: 20,
    })

    expect(result.items).toHaveLength(2)
    expect(result.items[0]).toMatchObject({
      id: 'comment-1',
      contentType: 'comment',
      moderationStatus: 'hidden',
    })
    expect(result.items[1]).toMatchObject({
      id: 'review-1',
      contentType: 'review',
      moderationStatus: 'restricted',
    })
  })

  it('maps content moderation history records', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: 'evt-1',
            contentType: 'video',
            contentId: 'content-1',
            actor: {
              _id: 'admin-1',
              name: 'Admin',
              role: 'admin',
            },
            action: 'restrict',
            fromStatus: 'visible',
            toStatus: 'restricted',
            reason: 'Conteudo sensivel',
            note: 'Rever em 24h',
            createdAt: '2026-02-20T12:00:00.000Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          pages: 1,
        },
      },
    })

    const result = await adminContentService.getContentModerationHistory(
      'video',
      'content-1',
      1,
      10,
    )

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/content/video/content-1/history', {
      params: { page: 1, limit: 10 },
    })
    expect(result.items[0]).toMatchObject({
      id: 'evt-1',
      action: 'restrict',
      fromStatus: 'visible',
      toStatus: 'restricted',
      actor: { id: 'admin-1' },
    })
  })

  it('maps rollback review response', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        content: {
          id: 'content-1',
          contentType: 'article',
          title: 'Titulo',
          slug: 'titulo',
          description: 'Descricao',
          category: 'finance',
          status: 'published',
          moderationStatus: 'hidden',
          moderationReason: 'Ocultado',
          moderationNote: null,
          moderatedAt: '2026-03-01T10:00:00.000Z',
          creator: null,
          moderatedBy: null,
          reportSignals: {
            openReports: 2,
            uniqueReporters: 2,
            latestReportAt: '2026-03-01T09:00:00.000Z',
            topReasons: [{ reason: 'spam', count: 2 }],
            priorityScore: 8,
            priority: 'high',
          },
          automatedSignals: {
            active: true,
            status: 'active',
            score: 12,
            severity: 'high',
            recommendedAction: 'hide',
            triggerSource: 'publish',
            triggeredRules: [],
            lastDetectedAt: '2026-03-01T09:10:00.000Z',
            lastEvaluatedAt: '2026-03-01T09:10:00.000Z',
            textSignals: {},
            activitySignals: {},
            automation: {},
          },
          policySignals: {
            recommendedAction: 'hide',
            escalation: 'high',
            automationEligible: false,
            automationEnabled: false,
            automationBlockedReason: null,
            matchedReasons: [],
            profile: {
              key: 'multi_surface_discovery',
              label: 'Discovery multi-superficie',
              primarySurface: 'editorial_home',
              surfaces: ['editorial_home'],
            },
            thresholds: {
              reviewMinPriority: 'low',
              restrictMinPriority: 'medium',
              highPriorityHideMinUniqueReporters: 2,
              highRiskHideMinUniqueReporters: 2,
            },
          },
          creatorTrustSignals: {
            trustScore: 42,
            riskLevel: 'high',
            recommendedAction: 'block_publishing',
            generatedAt: '2026-03-01T10:00:00.000Z',
            summary: {
              openReports: 2,
              highPriorityTargets: 1,
              criticalTargets: 0,
              hiddenItems: 1,
              restrictedItems: 0,
              recentModerationActions30d: 1,
              repeatModerationTargets30d: 0,
              recentCreatorControlActions30d: 0,
              falsePositiveCompensationScore30d: 4,
              dominantFalsePositiveCategory30d: 'reports',
              falsePositiveCategoryBreakdown30d: {
                reports: 1,
                policy_auto_hide: 0,
                automated_detection: 0,
                manual_moderation: 0,
              },
              automatedFalsePositiveRuleBreakdown30d: {
                spam: 0,
                suspicious_link: 0,
                flood: 0,
                mass_creation: 0,
              },
              activeControlFlags: [],
            },
            flags: [],
            reasons: [],
          },
          createdAt: '2026-03-01T08:00:00.000Z',
          updatedAt: '2026-03-01T10:00:00.000Z',
        },
        event: {
          id: 'evt-2',
          contentType: 'article',
          contentId: 'content-1',
          actor: { id: 'admin-1', name: 'Admin', role: 'admin' },
          action: 'hide',
          fromStatus: 'visible',
          toStatus: 'hidden',
          reason: 'Spam',
          note: 'Rever depois',
          metadata: { fastTrack: true },
          createdAt: '2026-03-01T10:00:00.000Z',
        },
        rollback: {
          action: 'unhide',
          targetStatus: 'visible',
          currentStatus: 'hidden',
          canRollback: true,
          requiresConfirm: true,
          warnings: ['Ha risco ativo.'],
          blockers: [],
          guidance: ['Volta a expor o alvo.'],
          checks: {
            isLatestEvent: true,
            newerEventsCount: 0,
            currentMatchesEventToStatus: true,
            openReports: 2,
            uniqueReporters: 2,
            automatedSignalActive: true,
            automatedSeverity: 'high',
            creatorRiskLevel: 'high',
          },
        },
      },
    })

    const result = await adminContentService.getContentRollbackReview(
      'article',
      'content-1',
      'evt-2',
    )

    expect(mockedApiClient.get).toHaveBeenCalledWith(
      '/admin/content/article/content-1/rollback-review',
      {
        params: { eventId: 'evt-2' },
      },
    )
    expect(result.rollback).toMatchObject({
      action: 'unhide',
      targetStatus: 'visible',
      requiresConfirm: true,
      checks: {
        openReports: 2,
        automatedSeverity: 'high',
      },
    })
  })

  it('sends moderation action payload to backend endpoint', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        message: 'Conteudo ocultado com sucesso.',
        changed: true,
        fromStatus: 'visible',
        toStatus: 'hidden',
        content: {
          id: 'content-1',
          contentType: 'article',
          title: 'Titulo',
          slug: 'titulo',
          description: 'Descricao',
          category: 'finance',
          status: 'published',
          moderationStatus: 'hidden',
          moderationReason: 'Violacao',
          moderationNote: 'Detalhe',
          moderatedAt: '2026-02-20T12:30:00.000Z',
          creator: null,
          moderatedBy: null,
          createdAt: '2026-02-20T10:00:00.000Z',
          updatedAt: '2026-02-20T12:30:00.000Z',
        },
      },
    })

    const result = await adminContentService.hideContent('article', 'content-1', {
      reason: 'Violacao',
      note: 'Detalhe',
    })

    expect(mockedApiClient.post).toHaveBeenCalledWith('/admin/content/article/content-1/hide', {
      reason: 'Violacao',
      note: 'Detalhe',
    })
    expect(result).toMatchObject({
      message: 'Conteudo ocultado com sucesso.',
      changed: true,
      fromStatus: 'visible',
      toStatus: 'hidden',
      content: {
        id: 'content-1',
        moderationStatus: 'hidden',
      },
    })
  })

  it('throws when moderation action response does not include content', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        message: 'Conteudo ocultado com sucesso.',
        changed: true,
        fromStatus: 'visible',
        toStatus: 'hidden',
        content: null,
      },
    })

    await expect(
      adminContentService.hideContent('article', 'content-1', {
        reason: 'Violacao',
      }),
    ).rejects.toThrow('Resposta admin invalida: conteudo em falta.')
  })

  it('sends rollback payload to backend endpoint', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        message: 'Rollback assistido concluido com sucesso.',
        changed: true,
        fromStatus: 'hidden',
        toStatus: 'visible',
        content: {
          id: 'content-1',
          contentType: 'article',
          title: 'Titulo',
          slug: 'titulo',
          description: 'Descricao',
          category: 'finance',
          status: 'published',
          moderationStatus: 'visible',
          moderationReason: 'Rollback',
          moderationNote: 'OK',
          moderatedAt: '2026-03-01T11:00:00.000Z',
          creator: null,
          moderatedBy: null,
          createdAt: '2026-03-01T08:00:00.000Z',
          updatedAt: '2026-03-01T11:00:00.000Z',
        },
        rollback: {
          eventId: 'evt-2',
          action: 'unhide',
          targetStatus: 'visible',
          requiresConfirm: true,
          warnings: ['Ha risco ativo.'],
        },
      },
    })

    const result = await adminContentService.rollbackContent('article', 'content-1', {
      eventId: 'evt-2',
      reason: 'Revisao concluida',
      note: 'Liberado',
      confirm: true,
    })

    expect(mockedApiClient.post).toHaveBeenCalledWith('/admin/content/article/content-1/rollback', {
      eventId: 'evt-2',
      reason: 'Revisao concluida',
      note: 'Liberado',
      confirm: true,
    })
    expect(result.rollback).toMatchObject({
      eventId: 'evt-2',
      action: 'unhide',
      targetStatus: 'visible',
      requiresConfirm: true,
    })
  })

  it('maps worker status payload for admin jobs', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        generatedAt: '2026-03-03T10:00:00.000Z',
        worker: {
          key: 'admin_content_jobs',
          status: 'processing',
          workerId: 'admin-content-jobs:host:1234:abcd1234',
          processId: 1234,
          host: 'host',
          startedAt: '2026-03-03T09:50:00.000Z',
          lastHeartbeatAt: '2026-03-03T10:00:00.000Z',
          currentJobId: 'job-1',
          currentJobType: 'bulk_moderate',
          currentJobStartedAt: '2026-03-03T09:59:00.000Z',
          lastJobFinishedAt: '2026-03-03T09:45:00.000Z',
          stats: {
            claimedJobs: 8,
            completedJobs: 6,
            failedJobs: 1,
            requeuedJobs: 1,
          },
          lastError: null,
          lastErrorAt: null,
        },
        queue: {
          queued: 4,
          awaitingApproval: 2,
          running: 1,
          staleRunning: 0,
          retrying: 2,
          maxAttemptsReached: 1,
          failedLast24h: 3,
        },
        currentJob: {
          id: 'job-1',
          type: 'bulk_moderate',
          status: 'running',
          action: 'hide',
          reason: 'Spam coordenado',
          note: null,
          confirm: true,
          markFalsePositive: false,
          attemptCount: 2,
          maxAttempts: 3,
          workerId: 'admin-content-jobs:host:1234:abcd1234',
          leaseExpiresAt: '2026-03-03T10:01:00.000Z',
          lastHeartbeatAt: '2026-03-03T10:00:00.000Z',
          actor: {
            id: 'admin-1',
            name: 'Admin',
            role: 'admin',
          },
          items: [],
          progress: {
            requested: 10,
            processed: 6,
            succeeded: 5,
            failed: 1,
            changed: 5,
          },
          guardrails: {
            maxItems: 50,
            confirmThreshold: 10,
            duplicatesSkipped: 0,
          },
          error: null,
          startedAt: '2026-03-03T09:59:00.000Z',
          finishedAt: null,
          createdAt: '2026-03-03T09:58:00.000Z',
          updatedAt: '2026-03-03T10:00:00.000Z',
        },
        config: {
          leaseMs: 60000,
          heartbeatMs: 5000,
          staleAfterMs: 60000,
          maxAttempts: 3,
        },
      },
    })

    const result = await adminContentService.getWorkerStatus()

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/content/jobs/worker-status')
    expect(result.worker).toMatchObject({
      status: 'processing',
      processId: 1234,
      stats: {
        claimedJobs: 8,
        requeuedJobs: 1,
      },
    })
    expect(result.queue).toMatchObject({
      queued: 4,
      awaitingApproval: 2,
      retrying: 2,
      maxAttemptsReached: 1,
    })
    expect(result.currentJob).toMatchObject({
      id: 'job-1',
      status: 'running',
      attemptCount: 2,
      maxAttempts: 3,
    })
  })

  it('maps rollback approval details in admin jobs list', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: 'job-rollback-1',
            type: 'bulk_rollback',
            status: 'queued',
            action: null,
            reason: 'Rollback validado',
            note: 'Lote sensivel',
            confirm: false,
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
            items: [
              {
                contentType: 'article',
                contentId: 'content-1',
                eventId: 'evt-1',
                status: 'pending',
              },
            ],
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
              reviewRequestedAt: '2026-03-03T10:00:00.000Z',
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
              reviewedSampleKeys: ['article:content-1:evt-1'],
              sampleItems: [
                {
                  contentType: 'article',
                  contentId: 'content-1',
                  eventId: 'evt-1',
                  title: 'Titulo',
                  targetStatus: 'visible',
                  openReports: 4,
                  uniqueReporters: 3,
                  automatedSeverity: 'high',
                  creatorRiskLevel: 'high',
                  requiresConfirm: true,
                  warnings: ['Ha reports ativos.'],
                },
              ],
              riskSummary: {
                restoreVisibleCount: 1,
                activeRiskCount: 1,
                highRiskCount: 1,
                criticalRiskCount: 0,
                falsePositiveEligibleCount: 1,
              },
              falsePositiveValidationRequired: true,
              falsePositiveValidated: false,
            },
            error: null,
            startedAt: null,
            finishedAt: null,
            createdAt: '2026-03-03T09:55:00.000Z',
            updatedAt: '2026-03-03T10:00:00.000Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          pages: 1,
        },
      },
    })

    const result = await adminContentService.listJobs({
      page: 1,
      limit: 10,
      type: 'bulk_rollback',
      status: 'queued',
    })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/content/jobs', {
      params: {
        page: 1,
        limit: 10,
        type: 'bulk_rollback',
        status: 'queued',
      },
    })
    expect(result.items[0]).toMatchObject({
      id: 'job-rollback-1',
      type: 'bulk_rollback',
      approval: {
        reviewStatus: 'review',
        sampleRequired: true,
        reviewedSampleKeys: ['article:content-1:evt-1'],
        reviewRequestedBy: {
          id: 'admin-2',
        },
        sampleItems: [
          {
            contentType: 'article',
            eventId: 'evt-1',
            automatedSeverity: 'high',
          },
        ],
        riskSummary: {
          activeRiskCount: 1,
        },
      },
    })
  })

  it('submits bulk rollback jobs for review', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        message: 'Job de rollback em lote submetido para revisao.',
        job: {
          id: 'job-rollback-1',
          type: 'bulk_rollback',
          status: 'queued',
          reason: 'Rollback validado',
          note: null,
          confirm: false,
          markFalsePositive: false,
          attemptCount: 0,
          maxAttempts: 3,
          items: [],
          progress: {
            requested: 2,
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
            reviewNote: 'Passa para revisao',
            reviewRequestedAt: '2026-03-03T10:10:00.000Z',
            reviewRequestedBy: {
              id: 'admin-2',
              name: 'Reviewer',
              role: 'admin',
            },
            sampleRequired: false,
            recommendedSampleSize: 0,
            reviewedSampleKeys: [],
            sampleItems: [],
            riskSummary: {
              restoreVisibleCount: 1,
              activeRiskCount: 0,
              highRiskCount: 0,
              criticalRiskCount: 0,
              falsePositiveEligibleCount: 0,
            },
            falsePositiveValidationRequired: false,
            falsePositiveValidated: false,
          },
          createdAt: '2026-03-03T10:00:00.000Z',
          updatedAt: '2026-03-03T10:10:00.000Z',
        },
      },
    })

    const result = await adminContentService.requestBulkRollbackJobReview('job-rollback-1', {
      note: 'Passa para revisao',
    })

    expect(mockedApiClient.post).toHaveBeenCalledWith(
      '/admin/content/jobs/job-rollback-1/request-review',
      {
        note: 'Passa para revisao',
      },
    )
    expect(result.job.approval).toMatchObject({
      reviewStatus: 'review',
      reviewNote: 'Passa para revisao',
    })
  })

  it('approves bulk rollback jobs with reviewed sample payload', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        message: 'Job de rollback em lote aprovado.',
        job: {
          id: 'job-rollback-1',
          type: 'bulk_rollback',
          status: 'queued',
          reason: 'Rollback validado',
          note: null,
          confirm: true,
          markFalsePositive: true,
          attemptCount: 0,
          maxAttempts: 3,
          items: [],
          progress: {
            requested: 2,
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
            reviewRequestedAt: '2026-03-03T10:10:00.000Z',
            reviewRequestedBy: {
              id: 'admin-2',
              name: 'Reviewer',
              role: 'admin',
            },
            approvalNote: 'Pode seguir',
            approvedAt: '2026-03-03T10:15:00.000Z',
            approvedBy: {
              id: 'admin-3',
              name: 'Approver',
              role: 'admin',
            },
            sampleRequired: true,
            recommendedSampleSize: 1,
            reviewedSampleKeys: ['article:content-1:evt-1'],
            sampleItems: [
              {
                contentType: 'article',
                contentId: 'content-1',
                eventId: 'evt-1',
                title: 'Titulo',
                targetStatus: 'visible',
                openReports: 3,
                uniqueReporters: 2,
                automatedSeverity: 'critical',
                creatorRiskLevel: 'high',
                requiresConfirm: true,
                warnings: ['Sinal auto ativo.'],
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
            falsePositiveValidated: true,
          },
          createdAt: '2026-03-03T10:00:00.000Z',
          updatedAt: '2026-03-03T10:15:00.000Z',
        },
      },
    })

    const result = await adminContentService.approveBulkRollbackJob('job-rollback-1', {
      note: 'Pode seguir',
      confirm: true,
      falsePositiveValidated: true,
      reviewedSampleItems: [
        {
          contentType: 'article',
          contentId: 'content-1',
          eventId: 'evt-1',
        },
      ],
    })

    expect(mockedApiClient.post).toHaveBeenCalledWith(
      '/admin/content/jobs/job-rollback-1/approve',
      {
        note: 'Pode seguir',
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
    expect(result.job.approval).toMatchObject({
      reviewStatus: 'approved',
      falsePositiveValidated: true,
      approvedBy: {
        id: 'admin-3',
      },
    })
  })
})
