import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

export interface CardBlockProps {
  title: string
  children: ReactNode
}

export const CardBlock = ({ title, children }: CardBlockProps) => (
  <Card className="border-muted shadow-sm rounded-2xl">
    <CardHeader className="pb-2">
      <CardTitle className="text-base font-semibold tracking-tight">{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2 text-sm text-muted-foreground">{children}</CardContent>
  </Card>
)
