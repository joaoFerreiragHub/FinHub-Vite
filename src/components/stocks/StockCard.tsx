import { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

// components/ui/CardBlock.tsx
export interface CardBlockProps {
  title: string
  children: ReactNode
}

export const CardBlock = ({ title, children }: CardBlockProps) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2 text-sm">
      {children}
    </CardContent>
  </Card>
)
