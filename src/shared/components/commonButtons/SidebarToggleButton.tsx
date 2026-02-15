// src/components/commonButtons/SidebarToggleButton.tsx
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui'

type Props = {
  collapsed: boolean
  onClick: () => void
}

export const SidebarToggleButton = ({ collapsed, onClick }: Props) => (
  <Button variant="ghost" size="icon" onClick={onClick}>
    {collapsed ? <Menu /> : <X />}
  </Button>
)
