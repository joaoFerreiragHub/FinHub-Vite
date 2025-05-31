// components/Stocks/StocksSearchBar.tsx
import React from 'react'

export interface StocksSearchBarProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSearch: () => void
}

export function StocksSearchBar({ value, onChange, onSearch }: StocksSearchBarProps) {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Ticker (ex: AAPL)"
        className="border p-2 rounded-md w-full"
      />
      <button onClick={onSearch} className="bg-primary text-white px-4 py-2 rounded-md">
        Pesquisar
      </button>
    </div>
  )
}
