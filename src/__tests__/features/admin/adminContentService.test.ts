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
              thresholds: {
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
            thresholds: {},
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
})
