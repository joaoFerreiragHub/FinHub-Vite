// src/components/contentManagement/podcasts/PodcastsManagementPage.tsx
import { useState, useEffect } from "react"
import { Button } from "../../../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog"

import { toast } from "react-toastify"
import { Podcast } from "../../../../types/podcast"
import PodcastForm from "./podcastsForm/PodcastForm"
import PodcastsList from "./PodcastsList"
import { mockPodcasts } from '@/lib/mock/mockPodcasts'
import EpisodesManagerModal from "./EpisodesManagerModal"

const useMockData = true

export default function PodcastsManagementPage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([])
  const [editingPodcast, setEditingPodcast] = useState<Podcast | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPodcastForEpisodes, setSelectedPodcastForEpisodes] = useState<Podcast | null>(null)
  const [isEpisodesModalOpen, setIsEpisodesModalOpen] = useState(false)

  useEffect(() => {
    if (useMockData) {
      setPodcasts(mockPodcasts)
    } else {
      // fetchPodcasts()
    }
  }, [])

  const handleSave = async (podcast: Partial<Podcast>) => {
    try {
      if (useMockData) {
        if (editingPodcast) {
          setPodcasts(prev => prev.map(p => p.id === editingPodcast.id ? { ...p, ...podcast } : p))
          toast.success("Podcast atualizado (simulação).")
        } else {
          const newPodcast = { ...podcast, id: crypto.randomUUID() } as Podcast
          setPodcasts(prev => [...prev, newPodcast])
          toast.success("Podcast criado (simulação).")
        }
        setIsDialogOpen(false)
        setEditingPodcast(null)
        return
      }

      // API call aqui
    } catch {
      toast.error("Erro ao guardar podcast.")
    }
  }
    const handleToggleVisibility = (id: string, hidden: boolean) => {
      if (useMockData) {
        setPodcasts(prev =>
          prev.map(p => (p.id === id ? { ...p, hidden } : p))
        )
      } else {
        // Chamar API real para atualizar visibilidade
      }
    }

  const handleDelete = (id: string) => {
    if (!confirm("Tens a certeza que queres apagar este podcast?")) return
    if (useMockData) {
      setPodcasts(prev => prev.filter(p => p.id !== id))
      toast.success("Podcast apagado (simulação).")
    } else {
      // deletePodcast(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestão de Podcasts</h1>
        <Button onClick={() => { setEditingPodcast(null); setIsDialogOpen(true) }}>
          Novo Podcast
        </Button>
      </div>

      <PodcastsList
        podcasts={podcasts}
        onEdit={(podcast) => {
          setEditingPodcast(podcast)
          setIsDialogOpen(true)
        }}
        onDelete={handleDelete}
        onToggleVisibility={handleToggleVisibility}
        onManageEpisodes={(podcast) => {
          setSelectedPodcastForEpisodes(podcast)
          setIsEpisodesModalOpen(true)
        }}
      />
{selectedPodcastForEpisodes && (
  <EpisodesManagerModal
    podcast={selectedPodcastForEpisodes}
    open={isEpisodesModalOpen}
    onClose={() => {
      setSelectedPodcastForEpisodes(null)
      setIsEpisodesModalOpen(false)
    }}
  />
)}


      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPodcast ? "Editar Podcast" : "Novo Podcast"}</DialogTitle>
          </DialogHeader>
          <PodcastForm
            podcast={editingPodcast ?? undefined}
            onSave={handleSave}
            onCancel={() => {
              setIsDialogOpen(false)
              setEditingPodcast(null)
            }}
            />
        </DialogContent>
      </Dialog>
    </div>
  )
}
