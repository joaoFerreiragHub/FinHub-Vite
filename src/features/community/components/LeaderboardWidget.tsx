import { useQuery } from '@tanstack/react-query'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { getErrorMessage } from '@/lib/api/client'
import { getCommunityBadgeMeta } from '../lib/xpMeta'
import { communityService } from '../services/communityService'

interface LeaderboardWidgetProps {
  className?: string
}

const getInitials = (username: string): string => {
  const normalized = username.trim()
  if (!normalized) return 'U'
  return normalized.slice(0, 2).toUpperCase()
}

export function LeaderboardWidget({ className }: LeaderboardWidgetProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const leaderboardQuery = useQuery({
    queryKey: ['community-leaderboard'],
    queryFn: () => communityService.getLeaderboard(),
    staleTime: 300_000,
  })

  const entries = leaderboardQuery.data?.items ?? []
  const me = leaderboardQuery.data?.me

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Leaderboard Semanal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {leaderboardQuery.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`leaderboard-loading-${index}`}
                className="h-10 animate-pulse rounded bg-muted"
              />
            ))}
          </div>
        ) : null}

        {leaderboardQuery.error ? (
          <p className="text-xs text-red-600">{getErrorMessage(leaderboardQuery.error)}</p>
        ) : null}

        {!leaderboardQuery.isLoading && !leaderboardQuery.error && entries.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Sem atividade semanal suficiente para ranking.
          </p>
        ) : null}

        {!leaderboardQuery.isLoading && !leaderboardQuery.error && entries.length > 0 ? (
          <ol className="space-y-2">
            {entries.map((entry) => {
              const badgeIcons = entry.badges
                .map((badge) => getCommunityBadgeMeta(badge.id))
                .filter((badgeMeta): badgeMeta is NonNullable<typeof badgeMeta> =>
                  Boolean(badgeMeta),
                )

              return (
                <li
                  key={`leaderboard-${entry.rank}-${entry.username}`}
                  className="rounded-md border border-border/70 p-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="w-5 text-xs font-semibold text-muted-foreground">
                        #{entry.rank}
                      </span>
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={entry.avatar} alt={entry.username} />
                        <AvatarFallback>{getInitials(entry.username)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          @{entry.username}
                        </p>
                        <div className="flex flex-wrap items-center gap-1">
                          <Badge
                            variant="outline"
                            className="h-5 rounded-full px-1.5 text-[10px] font-medium leading-none"
                            title={entry.levelName}
                          >
                            Nv.{entry.level}
                          </Badge>
                          {badgeIcons.map((badgeMeta) => (
                            <span
                              key={`${entry.username}-${badgeMeta.id}`}
                              title={badgeMeta.name}
                              className="text-xs"
                            >
                              {badgeMeta.emoji}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-foreground">{entry.weeklyXp} XP</p>
                  </div>
                </li>
              )
            })}
          </ol>
        ) : null}

        {!leaderboardQuery.isLoading && !leaderboardQuery.error && isAuthenticated && me ? (
          <div className="rounded-md border border-dashed border-border p-2">
            <p className="text-xs text-muted-foreground">A tua posicao</p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              #{me.rank} • {me.weeklyXp} XP
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
