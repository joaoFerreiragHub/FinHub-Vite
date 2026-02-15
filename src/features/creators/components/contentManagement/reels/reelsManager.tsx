import { useState } from 'react'
import { Button } from '@/components/ui'
import { mockReels, ReelType } from '@/lib/mock/mockReels'
import AddReelModal from './AddReelModal'
import { toast } from 'react-toastify'
import ReelCard from './reelcard'

export default function ReelsManagementPage() {
  const [reels, setReels] = useState<ReelType[]>(mockReels)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingReel, setEditingReel] = useState<ReelType | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold"></h1>
        <Button
          onClick={() => {
            setEditingReel(null)
            setShowAddModal(true)
          }}
        >
          Novo Reel
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reels.map((reel) => (
          <ReelCard
            key={reel.id}
            reel={reel}
            onEdit={(reel) => {
              setEditingReel(reel)
              setShowAddModal(true)
            }}
            onDelete={(id) => {
              if (confirm('Tens a certeza que queres apagar este reel?')) {
                setReels((prev) => prev.filter((r) => r.id !== id))
                toast.success('Reel eliminado com sucesso.')
              }
            }}
            onToggleVisibility={(id) => {
              setReels((prev) =>
                prev.map((r) => (r.id === id ? { ...r, isVisible: !r.isVisible } : r)),
              )
              toast.success('Visibilidade atualizada.')
            }}
          />
        ))}
      </div>

      {showAddModal && (
        <AddReelModal
          open={showAddModal}
          initialData={editingReel ?? undefined}
          onClose={() => {
            setShowAddModal(false)
            setEditingReel(null)
          }}
          onSuccess={(newReel) => {
            setReels((prev) => {
              const exists = prev.find((r) => r.id === newReel.id)
              if (exists) {
                return prev.map((r) => (r.id === newReel.id ? newReel : r))
              }
              return [...prev, newReel]
            })
            toast.success('Reel guardado com sucesso!')
            setShowAddModal(false)
            setEditingReel(null)
          }}
        />
      )}
    </div>
  )
}
