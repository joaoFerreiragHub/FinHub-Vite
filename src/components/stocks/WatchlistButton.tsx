// components/Stocks/WatchlistButton.tsx
import { FaRegStar, FaStar } from 'react-icons/fa'
import { Button } from '../ui/button'


interface WatchlistButtonProps {
  isInWatchlist: boolean
  onToggle: () => void
}

export const WatchlistButton: React.FC<WatchlistButtonProps> = ({ isInWatchlist, onToggle }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="text-yellow-500 hover:text-yellow-600"
      aria-label="Alternar Watchlist"
    >
      {isInWatchlist ? <FaStar className="text-xl" /> : <FaRegStar className="text-xl" />}
    </Button>
  )
}
