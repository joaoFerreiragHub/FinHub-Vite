import React from 'react'
import { CreatorFile } from '../../../types/creatorFile'
import { FilesGrid } from '../../fileManagement/filesGrid'

type Props = {
  files: CreatorFile[]
}

const DocumentsSection: React.FC<Props> = ({ files }) => {
  return (
    <section className="mt-8 space-y-6">
      <h2 className="text-2xl font-semibold text-primary">Documentos</h2>
      <div>
        <FilesGrid files={files} showActions={false} />
      </div>
    </section>
  )
}

export default DocumentsSection
