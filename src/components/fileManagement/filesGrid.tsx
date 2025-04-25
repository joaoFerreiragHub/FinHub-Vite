import React from 'react'
import { CreatorFile } from '../../types/creatorFile'
import { FileItem } from './fileItem'



type Props = {
  files: CreatorFile[]
  onDelete?: (fileId: string) => void
  showActions?: boolean
  fetchFiles?: () => void
}

export const FilesGrid: React.FC<Props> = ({
  files,
  onDelete,
  showActions = true,
  fetchFiles,
}) => {
  if (!files || files.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Nenhum ficheiro disponível de momento.
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {files.map((file) => (
        <FileItem
          key={file.id}
          file={file}
          onDelete={onDelete}
          showActions={showActions}
          fetchFiles={fetchFiles}
        />
      ))}
    </div>
  )
}
