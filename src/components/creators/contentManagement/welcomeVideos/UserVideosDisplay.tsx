// src/components/creators/welcomeVideos/UserVideosDisplay.tsx
import { useState } from "react"
import { toast } from "react-toastify"

import { FaBars, FaTrash } from "react-icons/fa"
import VideoDisplay from "./VideoDisplay"
import { Card } from "../../../ui/card"
import { Button } from "../../../ui/button"
import { Checkbox } from "../../../ui/checkbox"

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd"

interface VideoData {
  id: string
  title: string
  videoLink: string
  isSelected?: boolean
}

interface Props {
  videos: VideoData[]
  onReorder: (newOrder: VideoData[]) => void
  onDelete: (id: string) => void
  onSelect: (id: string) => void
}




export default function UserVideosDisplay({ videos, onReorder, onDelete, onSelect }: Props) {
  const [dragging, setDragging] = useState(false)

  const handleDragEnd = (result: DropResult) => {
    setDragging(false)
    if (!result.destination) return

    const reordered = Array.from(videos)
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)

    onReorder(reordered)
    toast.success("Ordem atualizada")
  }

  return (
    <DragDropContext onDragStart={() => setDragging(true)} onDragEnd={handleDragEnd}>
      <Droppable droppableId="videos" direction="vertical">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
            {videos.map((video, index) => (
              <Draggable key={video.id} draggableId={video.id} index={index}>
                {(provided) => (
                  <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`w-full min-w-[300px] p-4 flex gap-4 items-start ${dragging ? "ring-2 ring-primary/40" : ""}`}
                  >
                    <div {...provided.dragHandleProps} className="cursor-grab pt-1">
                      <FaBars className="text-muted-foreground" />
                    </div>

                    <div className="flex-1">
                      <VideoDisplay videoLink={video.videoLink} />
                      <p className="text-sm font-medium mt-2 truncate">{video.title}</p>
                    </div>

                    <div className="space-y-2 text-right">
                      <Button variant="ghost" size="sm" onClick={() => onDelete(video.id)}>
                        <FaTrash className="text-destructive" />
                      </Button>
                      <Checkbox
                        checked={video.isSelected}
                        onCheckedChange={() => onSelect(video.id)}
                        className="block mx-auto"
                      />
                    </div>
                  </Card>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
