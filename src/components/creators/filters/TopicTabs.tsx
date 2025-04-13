// src/components/creators/filters/TopicTabs.tsx

import { useState } from 'react'
import { Button } from '../../ui/button'

const topics = [
  'Todos',
  'Ações',
  'ETFs',
  'REITs',
  'Imobiliário',
  'Cripto Moedas',
  'P2P Lending',
  'Outros',
]

interface TopicTabsProps {
  selectedTopic: string
  setSelectedTopic: (topic: string) => void
}

export default function TopicTabs({ selectedTopic, setSelectedTopic }: TopicTabsProps) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 px-4">
      {topics.map((topic) => (
        <Button
          key={topic}
          variant={selectedTopic === topic ? 'default' : 'outline'}
          onClick={() => setSelectedTopic(topic)}
          onMouseEnter={() => setHovered(topic)}
          onMouseLeave={() => setHovered(null)}
          className={`text-sm font-medium transition-all duration-200 ${
            hovered === topic && selectedTopic !== topic
              ? 'border-primary bg-muted text-primary'
              : ''
          }`}
        >
          {topic}
        </Button>
      ))}
    </div>
  )
}
