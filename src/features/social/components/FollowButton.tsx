import { UserPlus, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui'
import { useSocialStore } from '../stores/useSocialStore'
import { useFollowCreator, useUnfollowCreator } from '../hooks/useSocial'
import { usePermissions } from '@/features/auth/hooks/usePermissions'
import { Permission } from '@/lib/permissions/config'

interface FollowButtonProps {
  creatorId: string
  creatorName: string
  creatorUsername: string
  creatorAvatar?: string
  creatorBio?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  showIcon?: boolean
}

export function FollowButton({
  creatorId,
  creatorName,
  creatorUsername,
  creatorAvatar,
  creatorBio,
  variant,
  size = 'default',
  showIcon = true,
}: FollowButtonProps) {
  const { can } = usePermissions()
  const canFollow = can(Permission.FOLLOW_CREATORS)
  const isFollowing = useSocialStore((s) => s.isFollowing(creatorId))

  const followMutation = useFollowCreator()
  const unfollowMutation = useUnfollowCreator()
  const isLoading = followMutation.isPending || unfollowMutation.isPending

  const handleClick = () => {
    if (!canFollow) return

    if (isFollowing) {
      unfollowMutation.mutate(creatorId)
    } else {
      followMutation.mutate({
        creatorId,
        username: creatorUsername,
        name: creatorName,
        avatar: creatorAvatar,
        bio: creatorBio,
        followedAt: new Date().toISOString(),
      })
    }
  }

  const resolvedVariant = variant ?? (isFollowing ? 'outline' : 'default')
  const Icon = isFollowing ? UserCheck : UserPlus

  return (
    <Button
      variant={resolvedVariant}
      size={size}
      onClick={handleClick}
      disabled={!canFollow || isLoading}
      title={!canFollow ? 'Faz login para seguir criadores' : undefined}
    >
      {showIcon && <Icon className="mr-2 h-4 w-4" />}
      {isFollowing ? 'A Seguir' : 'Seguir'}
    </Button>
  )
}
