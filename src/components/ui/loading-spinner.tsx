// src/components/ui/loading-spinner.tsx

import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className={`animate-spin text-muted-foreground`} size={size} />
    </div>
  )
}
