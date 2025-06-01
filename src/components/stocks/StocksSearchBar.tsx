import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Search } from "lucide-react"

export interface StocksSearchBarProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSearch: () => void
}

export function StocksSearchBar({ value, onChange, onSearch }: StocksSearchBarProps) {
  return (
    <div className="flex w-full max-w-md gap-2">
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Ticker (ex: AAPL)"
        className="text-sm"
      />
      <Button onClick={onSearch} className="flex gap-1">
        <Search className="w-4 h-4" />
        Pesquisar
      </Button>
    </div>
  )
}
