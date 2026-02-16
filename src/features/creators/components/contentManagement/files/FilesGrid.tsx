// src/features/creators/components/files/FilesGrid.tsx

import type { CreatorFile } from '@/features/creators/types/creatorFile'
import FileItem from './FileItem'

interface Props {
  files: CreatorFile[]
  onDelete?: (id: string) => void
  showActions?: boolean
  loading?: boolean
}

export default function FilesGrid({ files, onDelete, showActions = true }: Props) {
  if (!files || files.length === 0) {
    return (
      <p className="text-muted-foreground">
        Nenhum ficheiro disponível. Faz upload de um novo documento.
      </p>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file) => (
        <FileItem
          key={file._id}
          file={file}
          onDelete={onDelete || (() => {})}
          showActions={showActions}
        />
      ))}
    </div>
  )
}
