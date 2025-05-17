// components/creators/marketing/campanhas/promoPreviewCard.tsx

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../ui/card"
import { Button } from "../../../ui/button"
import { Badge } from "../../../ui/badge"

interface PromoPreviewCardProps {
  imageUrl: string
  title: string
  ctaText: string
  status?: "rascunho" | "ativo" | "rejeitado"
}

export default function PromoPreviewCard({
  imageUrl,
  title,
  ctaText,
  status = "rascunho",
}: PromoPreviewCardProps) {
  const statusColor = {
    rascunho: "bg-gray-100 text-gray-700",
    ativo: "bg-green-100 text-green-700",
    rejeitado: "bg-red-100 text-red-700",
  }

  return (
    <Card className="overflow-hidden">
      <img src={imageUrl} alt="Imagem da promoção" className="w-full h-40 object-cover" />
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Badge className={statusColor[status]}>{status.toUpperCase()}</Badge>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="outline" size="sm">
          {ctaText}
        </Button>
      </CardFooter>
    </Card>
  )
}
