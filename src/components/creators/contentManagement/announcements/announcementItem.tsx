import { Announcement } from '../../../../types/announcement'
import { Button } from '../../../ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../../ui/card'
import { AlertCircle, MessageSquare, Eye, EyeOff } from 'lucide-react'

interface AnnouncementItemProps {
  announcement: Announcement
  onEdit: () => void
  onDelete: () => void
  onToggleHide: () => void
  isHidden: boolean
}

export default function AnnouncementItem({
  announcement,
  onEdit,
  onDelete,
  onToggleHide,
  isHidden,
}: AnnouncementItemProps) {
  return (
    <Card className="relative border-2 border-primary/30 bg-card rounded-xl shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">{announcement.title || 'Anúncio'}</CardTitle>
          <span
            className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-medium ${
              announcement.type === 'popup'
                ? 'bg-red-200/70 text-red-700'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {announcement.type === 'popup' ? (
              <AlertCircle className="w-3 h-3" />
            ) : (
              <MessageSquare className="w-3 h-3" />
            )}
            {announcement.type === 'popup' ? 'Pop-up' : 'Aviso'}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {announcement.imageUrl && (
          <img
            src={announcement.imageUrl}
            alt="Imagem do anúncio"
            className="w-full max-h-40 object-cover rounded-md border border-border"
          />
        )}

        {/* Só mostra o texto se não estiver oculto */}
        {!isHidden && <p className="text-sm text-muted-foreground">{announcement.text}</p>}
      </CardContent>

      <CardFooter className="flex flex-wrap justify-end gap-2 pt-4 border-t border-border">
        <Button variant="secondary" onClick={onEdit}>
          Editar
        </Button>
        <Button variant="outline" onClick={onToggleHide}>
          {isHidden ? (
            <>
              <Eye className="w-4 h-4 mr-1" /> Mostrar
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4 mr-1" /> Ocultar
            </>
          )}
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          Apagar
        </Button>
      </CardFooter>
    </Card>
  )
}
