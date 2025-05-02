export default function ArticleSkeleton() {
  return (
    <div className="border border-border rounded-lg p-4 shadow-sm bg-card animate-pulse space-y-4">
      <div className="h-40 bg-muted rounded"></div>
      <div className="h-4 bg-muted rounded w-3/4"></div>
      <div className="h-3 bg-muted rounded w-2/3"></div>
      <div className="flex justify-end gap-2">
        <div className="h-8 w-16 bg-muted rounded"></div>
        <div className="h-8 w-16 bg-muted rounded"></div>
      </div>
    </div>
  )
}
