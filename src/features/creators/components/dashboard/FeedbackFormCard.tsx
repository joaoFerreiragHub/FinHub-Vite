import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { MessageSquare } from 'lucide-react'

export default function FeedbackFormCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          Feedback dos Utilizadores
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Vê o que os teus seguidores estão a dizer sobre os teus conteúdos.
        </p>
        <div className="space-y-2">
          <div className="flex items-start gap-2 rounded-md border p-3">
            <span className="text-lg">👍</span>
            <div>
              <p className="text-sm font-medium">Comentário positivo</p>
              <p className="text-xs text-muted-foreground">
                &quot;Excelente conteúdo, muito útil!&quot;
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-md border p-3">
            <span className="text-lg">💡</span>
            <div>
              <p className="text-sm font-medium">Sugestão</p>
              <p className="text-xs text-muted-foreground">
                &quot;Seria interessante um vídeo sobre ETFs.&quot;
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
