import { Calendar, Heart, MessageSquare, Star, Users } from 'lucide-react'
import { Badge } from '@/components/ui'
import { UserRole } from '@/features/auth/types'
import type { UserProfile } from '../types'

interface UserProfileCardProps {
  profile: UserProfile
  showStats?: boolean
}

const roleBadges: Record<
  UserRole,
  { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }
> = {
  [UserRole.VISITOR]: { label: 'Visitante', variant: 'outline' },
  [UserRole.FREE]: { label: 'Free', variant: 'secondary' },
  [UserRole.PREMIUM]: { label: 'Premium', variant: 'default' },
  [UserRole.CREATOR]: { label: 'Criador', variant: 'default' },
  [UserRole.BRAND_MANAGER]: { label: 'Marca', variant: 'default' },
  [UserRole.ADMIN]: { label: 'Admin', variant: 'destructive' },
}

export function UserProfileCard({ profile, showStats = true }: UserProfileCardProps) {
  const normalizedRole = String(profile.role ?? '').toLowerCase() as UserRole
  const roleBadge = roleBadges[normalizedRole] ?? {
    label: String(profile.role || 'Utilizador'),
    variant: 'outline' as const,
  }
  const fullName = [profile.name, profile.lastName].filter(Boolean).join(' ')
  const displayName = fullName || profile.username
  const creatorProfileHref = `/creators/${encodeURIComponent(profile.username)}`
  const isCreator = normalizedRole === UserRole.CREATOR

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt={profile.name}
            className="h-20 w-20 rounded-full object-cover border-2 border-border"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold border-2 border-border">
            {profile.name.charAt(0)}
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{displayName}</h2>
            <Badge variant={roleBadge.variant}>{roleBadge.label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">@{profile.username}</p>
          {isCreator ? (
            <a
              href={creatorProfileHref}
              className="mt-1 inline-flex text-xs font-medium text-primary hover:underline"
            >
              Ver pagina de criador
            </a>
          ) : null}
          {profile.bio && <p className="mt-2 text-sm text-muted-foreground">{profile.bio}</p>}
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Membro desde {formatJoinedAt(profile.joinedAt)}</span>
          </div>
        </div>
      </div>

      {/* Topics */}
      {profile.favoriteTopics && profile.favoriteTopics.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {profile.favoriteTopics.map((topic) => (
            <Badge key={topic} variant="outline" className="text-xs capitalize">
              {topic}
            </Badge>
          ))}
        </div>
      )}

      {/* Stats */}
      {showStats && (
        <div className="mt-4 grid grid-cols-4 gap-4 rounded-lg border border-border bg-muted/30 p-3">
          <StatItem icon={Users} label="A Seguir" value={profile.followingCount ?? 0} />
          <StatItem icon={Heart} label="Favoritos" value={profile.favoritesCount ?? 0} />
          <StatItem icon={MessageSquare} label="Comentarios" value={profile.commentsCount ?? 0} />
          <StatItem icon={Star} label="Avaliacoes" value={profile.ratingsCount ?? 0} />
        </div>
      )}
    </div>
  )
}

function formatJoinedAt(rawDate: string | undefined): string {
  if (!rawDate) return 'data indisponivel'

  const parsedDate = new Date(rawDate)
  if (Number.isNaN(parsedDate.getTime())) {
    return 'data indisponivel'
  }

  return parsedDate.toLocaleDateString('pt-PT', {
    month: 'long',
    year: 'numeric',
  })
}

function StatItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users
  label: string
  value: number
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <Icon className="h-4 w-4 text-muted-foreground mb-1" />
      <span className="text-lg font-bold">{value}</span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  )
}
