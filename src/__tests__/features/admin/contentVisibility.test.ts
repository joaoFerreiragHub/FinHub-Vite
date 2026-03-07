import {
  EFFECTIVE_VISIBILITY_LABEL,
  resolveEffectivePublicVisibility,
} from '@/features/admin/lib/contentVisibility'

describe('resolveEffectivePublicVisibility', () => {
  it('prioritizes moderation hidden over published status', () => {
    expect(
      resolveEffectivePublicVisibility({
        moderationStatus: 'hidden',
        publishStatus: 'published',
      }),
    ).toBe('blocked_by_moderation_hidden')
  })

  it('prioritizes moderation restricted over published status', () => {
    expect(
      resolveEffectivePublicVisibility({
        moderationStatus: 'restricted',
        publishStatus: 'published',
      }),
    ).toBe('blocked_by_moderation_restricted')
  })

  it('exposes content only when moderation is visible and editorial status is published', () => {
    expect(
      resolveEffectivePublicVisibility({
        moderationStatus: 'visible',
        publishStatus: 'published',
      }),
    ).toBe('visible')
  })

  it('keeps content blocked by editorial state when moderation is visible but not published', () => {
    expect(
      resolveEffectivePublicVisibility({
        moderationStatus: 'visible',
        publishStatus: 'draft',
      }),
    ).toBe('blocked_by_editorial')

    expect(
      resolveEffectivePublicVisibility({
        moderationStatus: 'visible',
        publishStatus: 'archived',
      }),
    ).toBe('blocked_by_editorial')
  })

  it('exposes labels for all effective visibility states', () => {
    expect(EFFECTIVE_VISIBILITY_LABEL.visible).toBe('Publico')
    expect(EFFECTIVE_VISIBILITY_LABEL.blocked_by_moderation_hidden).toContain('moderacao')
    expect(EFFECTIVE_VISIBILITY_LABEL.blocked_by_moderation_restricted).toContain('moderacao')
    expect(EFFECTIVE_VISIBILITY_LABEL.blocked_by_editorial).toContain('editorial')
  })
})
