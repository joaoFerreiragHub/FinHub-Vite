import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui'

interface PublicSurfaceDisabledStateProps {
  title: string
  message: string
  compact?: boolean
}

export function PublicSurfaceDisabledState({
  title,
  message,
  compact = false,
}: PublicSurfaceDisabledStateProps) {
  if (compact) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card/60 p-6 text-center">
        <ShieldAlert className="mx-auto h-10 w-10 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <ShieldAlert className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-foreground sm:text-3xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {message}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <a href="/">Voltar a Home</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/explorar/tudo">Explorar conteudos</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
