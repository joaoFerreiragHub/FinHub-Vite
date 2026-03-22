import { AlertCircle } from 'lucide-react'
import { Button, Card, CardContent } from '@/components/ui'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ErrorStateProps {
  message: string
  title?: string
  onRetry?: () => void
  className?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Unified error block shown when a query fails.
 *
 * Replaces the three different inline error patterns found across
 * CreatorsListPage (red div), PublicDirectoryPage (Card + destructive),
 * and ContentList.
 */
export function ErrorState({ message, title, onRetry, className }: ErrorStateProps) {
  return (
    <Card className={cn('border-destructive/40', className)}>
      <CardContent className="flex flex-col items-start gap-3 p-4 sm:flex-row sm:items-center">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive sm:mt-0" />
        <div className="flex-1 space-y-0.5">
          {title && <p className="text-sm font-medium text-foreground">{title}</p>}
          <p className="text-sm text-destructive">{message}</p>
        </div>
        {onRetry && (
          <Button size="sm" variant="outline" onClick={onRetry} className="shrink-0">
            Tentar novamente
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
