import { useEffect, useState } from 'react'
import { Announcement } from '@/features/hub/types/announcement'
import AnnouncementForm from './announcementForm'
import AnnouncementVisibilityToggle from './announcementVisibilityToggle'
import { toast } from 'react-toastify'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { Button } from '@/components/ui'
import { Loader2, Plus } from 'lucide-react'
import { useDeleteAnnouncement, useAnnouncements } from './hooks/useAnnouncementsQuery'
import { AnnouncementPopup } from './AnnouncementPopup'
import AnnouncementsList from './announcementsList'

export default function AnnouncementsManager() {
  const { data: announcements, isLoading } = useAnnouncements()
  const deleteMutation = useDeleteAnnouncement()

  const [globalVisible, setGlobalVisible] = useState(true)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [hiddenAnnouncements, setHiddenAnnouncements] = useState<string[]>([])
  const [popupAnnouncement, setPopupAnnouncement] = useState<Announcement | null>(null)

  // Verifica anúncios popup visíveis e mostra automaticamente
  useEffect(() => {
    if (announcements) {
      const popup = announcements.find((a) => a.type === 'popup' && a.isVisible)
      if (popup) {
        setPopupAnnouncement(popup)
      }
    }
  }, [announcements])

  const handleDelete = async (id: string) => {
    if (confirm('Tens a certeza que queres apagar este anúncio?')) {
      try {
        await deleteMutation.mutateAsync(id)
        toast.success('Anúncio apagado com sucesso!')
      } catch {
        toast.error('Erro ao apagar o anúncio.')
      }
    }
  }

  const handleHideToggle = (id: string) => {
    setHiddenAnnouncements((prev) =>
      prev.includes(id) ? prev.filter((hid) => hid !== id) : [...prev, id],
    )
  }

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    setShowForm(true)
  }

  const handleSuccess = () => {
    setShowForm(false)
    setEditingAnnouncement(null)
  }

  const closePopup = () => setPopupAnnouncement(null)

  // Filtra anúncios que devem ser visíveis (global toggle + não escondidos individualmente)
  const visibleAnnouncements =
    announcements?.filter((a) => globalVisible && !hiddenAnnouncements.includes(a.id)) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Gerir Anúncios</h2>
        <Button
          onClick={() => {
            setShowForm(!showForm)
            setEditingAnnouncement(null)
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> {showForm ? 'Cancelar' : 'Novo Anúncio'}
        </Button>
      </div>

      <AnnouncementVisibilityToggle isVisible={globalVisible} onToggle={setGlobalVisible} />

      {showForm && (
        <AnnouncementForm
          initialData={editingAnnouncement ?? undefined}
          onSuccess={handleSuccess}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Em Destaque</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin w-6 h-6" />
            </div>
          ) : (
            <AnnouncementsList
              announcements={visibleAnnouncements}
              onEdit={handleEdit}
              onDelete={handleDelete}
              hiddenAnnouncements={hiddenAnnouncements}
              onToggleHide={handleHideToggle}
            />
          )}
        </CardContent>
      </Card>

      {/* Pop-up automático se existir um anúncio popup */}
      {popupAnnouncement && (
        <AnnouncementPopup announcement={popupAnnouncement} onClose={closePopup} />
      )}
    </div>
  )
}
