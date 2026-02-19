import { cn } from '@/lib/utils'

export interface ContentGridProps {
  children: React.ReactNode
  columns?: 2 | 3 | 4 | 5
  className?: string
}

const columnClasses: Record<number, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
}

export function ContentGrid({ children, columns = 4, className }: ContentGridProps) {
  return (
    <section
      className={cn(
        'px-4 sm:px-6 md:px-10 lg:px-12 py-6 sm:py-8',
        'grid gap-4 sm:gap-5 md:gap-6',
        columnClasses[columns],
        className,
      )}
    >
      {children}
    </section>
  )
}
