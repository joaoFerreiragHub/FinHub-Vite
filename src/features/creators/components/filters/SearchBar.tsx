import { useState } from 'react'
import { Search } from 'lucide-react'

import { Button } from '@/components/ui'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui'

interface SearchBarProps {
  onSearch: (query: string) => void
  creators: { username: string }[]
}

export default function SearchBar({ onSearch, creators }: SearchBarProps) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = creators.filter((c) => c.username.toLowerCase().includes(input.toLowerCase()))

  const handleSelect = (value: string) => {
    setSelected(value)
    setInput('')
    setOpen(false)
    onSearch(value)
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 w-full max-w-3xl mx-auto px-4 mt-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" className="w-full sm:flex-1 justify-between">
            <span className={selected ? '' : 'text-muted-foreground'}>
              {selected || 'Procurar criadores de conteúdos'}
            </span>
            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[calc(100vw-4rem)] sm:w-[400px] p-0">
          <Command>
            <CommandInput placeholder="Escreve o nome do criador" onValueChange={setInput} />
            <CommandList>
              <CommandEmpty>Nenhum criador encontrado.</CommandEmpty>
              <CommandGroup>
                {filtered.map((creator) => (
                  <CommandItem
                    key={creator.username}
                    value={creator.username}
                    onSelect={handleSelect}
                  >
                    {creator.username}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Button
        className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition"
        onClick={() => {
          if (selected) onSearch(selected)
          else alert('Por favor, escreve ou seleciona um nome.')
        }}
      >
        <Search size={16} />
        Procurar
      </Button>
    </div>
  )
}
