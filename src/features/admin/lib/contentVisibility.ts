import type {
  AdminContentModerationStatus,
  AdminContentPublishStatus,
} from '../types/adminContent'

export type AdminEffectivePublicVisibility =
  | 'visible'
  | 'blocked_by_moderation_hidden'
  | 'blocked_by_moderation_restricted'
  | 'blocked_by_editorial'

interface ResolveEffectiveVisibilityInput {
  moderationStatus: AdminContentModerationStatus
  publishStatus: AdminContentPublishStatus
}

export const EFFECTIVE_VISIBILITY_LABEL: Record<AdminEffectivePublicVisibility, string> = {
  visible: 'Publico',
  blocked_by_moderation_hidden: 'Bloqueado por moderacao (hidden)',
  blocked_by_moderation_restricted: 'Bloqueado por moderacao (restricted)',
  blocked_by_editorial: 'Bloqueado por estado editorial',
}

export const resolveEffectivePublicVisibility = ({
  moderationStatus,
  publishStatus,
}: ResolveEffectiveVisibilityInput): AdminEffectivePublicVisibility => {
  if (moderationStatus === 'hidden') return 'blocked_by_moderation_hidden'
  if (moderationStatus === 'restricted') return 'blocked_by_moderation_restricted'
  if (publishStatus === 'published') return 'visible'
  return 'blocked_by_editorial'
}
