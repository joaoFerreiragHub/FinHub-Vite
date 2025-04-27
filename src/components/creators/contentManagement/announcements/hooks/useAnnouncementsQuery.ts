import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Announcement } from '../../../../../types/announcement'

// Mock "persistente" em memória com imagem incluída
let mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Bem-vindo!',
    text: 'Estamos felizes por te ter aqui.',
    creatorId: '123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isVisible: true,
    type: 'inline',
    imageUrl: '', // Sem imagem
  },
  {
    id: '2',
    title: 'Desconto Especial!',
    text: 'Aproveita o desconto de 20% até sexta!',
    creatorId: '123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isVisible: true,
    type: 'popup',
    imageUrl: 'https://via.placeholder.com/400x200?text=Promoção', // Exemplo com imagem
  },
]

// ----------------------------

export type NewAnnouncement = Omit<Announcement, 'id' | 'createdAt' | 'updatedAt' | 'isVisible'>
export interface EditAnnouncementParams {
  id: string
  updatedData: Partial<Announcement>
}

const fetchAnnouncements = async (): Promise<Announcement[]> => {
  await new Promise((res) => setTimeout(res, 500))
  return mockAnnouncements
}

export const fetchVisibleAnnouncements = async (): Promise<Announcement[]> => {
  await new Promise((res) => setTimeout(res, 500))
  return mockAnnouncements.filter((a) => a.isVisible)
}

// ----------------------------

export const useAnnouncements = () => {
  return useQuery<Announcement[]>({
    queryKey: ['announcements'],
    queryFn: fetchAnnouncements,
  })
}

export const useVisibleAnnouncements = () => {
  return useQuery<Announcement[]>({
    queryKey: ['visible-announcements'],
    queryFn: fetchVisibleAnnouncements,
  })
}

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (newAnnouncement: NewAnnouncement) => {
      const newEntry: Announcement = {
        ...newAnnouncement,
        id: String(Date.now()),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isVisible: true,
      }
      mockAnnouncements.push(newEntry)
      return Promise.resolve(newEntry)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
    },
  })
}

export const useEditAnnouncement = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updatedData }: EditAnnouncementParams) => {
      mockAnnouncements = mockAnnouncements.map((a) =>
        a.id === id ? { ...a, ...updatedData, updatedAt: new Date().toISOString() } : a,
      )
      return Promise.resolve(mockAnnouncements.find((a) => a.id === id)!)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
    },
  })
}

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => {
      mockAnnouncements = mockAnnouncements.filter((a) => a.id !== id)
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
    },
  })
}

// ----------------------------
// Nova Mutation: Toggle visibilidade global
export const useToggleGlobalVisibility = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (visible: boolean) => {
      mockAnnouncements = mockAnnouncements.map((a) => ({ ...a, isVisible: visible }))
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
    },
  })
}

// Nova Mutation: Toggle individual
export const useToggleIndividualVisibility = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => {
      mockAnnouncements = mockAnnouncements.map((a) =>
        a.id === id ? { ...a, isVisible: !a.isVisible } : a,
      )
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
    },
  })
}
