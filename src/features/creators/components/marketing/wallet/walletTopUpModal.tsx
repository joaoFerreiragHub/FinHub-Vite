import { useState } from 'react'
import { Euro } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'

export default function WalletTopUpModal() {
  const [amount, setAmount] = useState<number | ''>('')
  const [method, setMethod] = useState<'card' | 'paypal' | 'coupon'>('card')
  const [couponCode, setCouponCode] = useState('')

  const quickValues = [10, 20, 50, 100]

  const handleTopUp = () => {
    if (!amount || amount <= 0) return

    if (method === 'coupon' && !couponCode.trim()) {
      alert('Por favor insere um código de cupão válido.')
      return
    }

    // Aqui colocarias o logic de integração com Stripe, PayPal ou validação de cupão
    const msg =
      method === 'coupon'
        ? `Aplicar cupão "${couponCode}" no valor de ${amount}€`
        : `Carregar ${amount}€ via ${method === 'card' ? 'Cartão' : 'PayPal'}`
    alert(msg)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Carregar Wallet</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Carregar Wallet</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Valores rápidos */}
          <div className="grid grid-cols-4 gap-2">
            {quickValues.map((val) => (
              <Button key={val} variant="outline" onClick={() => setAmount(val)}>
                {val} €
              </Button>
            ))}
          </div>

          {/* Método de pagamento */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={method === 'card' ? 'default' : 'outline'}
              onClick={() => setMethod('card')}
            >
              Cartão
            </Button>
            <Button
              variant={method === 'paypal' ? 'default' : 'outline'}
              onClick={() => setMethod('paypal')}
            >
              PayPal
            </Button>
            <Button
              variant={method === 'coupon' ? 'default' : 'outline'}
              onClick={() => setMethod('coupon')}
            >
              Cupão
            </Button>
          </div>

          {/* Valor personalizado */}
          <div className="flex items-center gap-2">
            <Euro className="w-4 h-4 text-muted-foreground" />
            <Input
              type="number"
              placeholder="Outro valor..."
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>

          {/* Campo extra para cupão */}
          {method === 'coupon' && (
            <Input
              placeholder="Código do cupão"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
          )}

          <Button onClick={handleTopUp} disabled={!amount || amount <= 0}>
            Confirmar carregamento
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
