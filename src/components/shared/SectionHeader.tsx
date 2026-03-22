import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  /** Route href for the "Ver tudo →" link. Omit to hide the link. */
  href?: string
  linkLabel?: string
  className?: string
}

/**
 * Reusable section header with an optional "Ver tudo →" link.
 * Matches the visual style used across listing pages and the homepage.
 */
export function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel = 'Ver tudo →',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-baseline justify-between', className)}>
      <div>
        <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl md:text-2xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 hidden text-sm text-muted-foreground sm:block">{subtitle}</p>
        )}
      </div>
      {href && (
        <a
          href={href}
          className="whitespace-nowrap text-xs font-medium text-primary transition-colors hover:text-primary/80 sm:text-sm"
        >
          {linkLabel}
        </a>
      )}
    </div>
  )
}
