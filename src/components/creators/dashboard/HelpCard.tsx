// src/components/creators/dashboard/HelpCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'

export default function HelpCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Precisas de ajuda?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Consulta o nosso guia ou entra em contacto connosco para obter suporte personalizado.</p>
        <div className="flex flex-col gap-2">
          <Button variant="default" className="w-full" asChild>
            <a href="/guia-do-criador">Ver Guia do Criador</a>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <a href="/suporte">Falar com Suporte</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
