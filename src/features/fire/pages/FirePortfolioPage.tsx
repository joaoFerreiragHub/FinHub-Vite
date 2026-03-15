import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Edit3, Plus, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'
import { getErrorMessage } from '@/lib/api/client'
import { FireToolNav } from '../components/FireToolNav'
import {
  useAddFireHolding,
  useCreateFirePortfolio,
  useDeleteFireHolding,
  useDeleteFirePortfolio,
  useFirePortfolioDetail,
  useFirePortfolioList,
  useUpdateFireHolding,
  useUpdateFirePortfolio,
} from '../hooks/useFirePortfolio'
import type {
  CreateFireHoldingInput,
  CreateFirePortfolioInput,
  FireAssetType,
  FirePortfolioCurrency,
  FirePortfolioHolding,
  FireTargetMethod,
} from '../types/firePortfolio'

const CURRENCY_OPTIONS: FirePortfolioCurrency[] = ['EUR', 'USD', 'GBP']
const TARGET_OPTIONS: FireTargetMethod[] = ['expenses', 'passive_income', 'target_amount']
const ASSET_TYPES: FireAssetType[] = ['stock', 'etf', 'reit', 'crypto', 'bond', 'cash']

type PortfolioFormState = {
  name: string
  currency: FirePortfolioCurrency
  method: FireTargetMethod
  targetValue: string
  monthlyContribution: string
}

type HoldingFormState = {
  ticker: string
  assetType: FireAssetType
  name: string
  shares: string
  averageCost: string
  monthlyAllocation: string
  currentPrice: string
}

const createPortfolioFormDefault = (): PortfolioFormState => ({
  name: '',
  currency: 'EUR',
  method: 'expenses',
  targetValue: '',
  monthlyContribution: '0',
})

const createHoldingFormDefault = (): HoldingFormState => ({
  ticker: '',
  assetType: 'stock',
  name: '',
  shares: '',
  averageCost: '',
  monthlyAllocation: '0',
  currentPrice: '',
})

function parseNumber(value: string) {
  const parsed = Number.parseFloat(value.replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : undefined
}

function formatMoney(value: number, currency: FirePortfolioCurrency) {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value)
}

function labelForMethod(method: FireTargetMethod) {
  if (method === 'expenses') return 'Despesas'
  if (method === 'passive_income') return 'Rendimento passivo'
  return 'Montante alvo'
}

function getMethodValue(method: FireTargetMethod, target: {
  monthlyExpenses?: number
  desiredMonthlyIncome?: number
  targetAmount?: number
}) {
  if (method === 'expenses') return target.monthlyExpenses ?? 0
  if (method === 'passive_income') return target.desiredMonthlyIncome ?? 0
  return target.targetAmount ?? 0
}

export default function FirePortfolioPage() {
  const portfoliosQuery = useFirePortfolioList({ page: 1, limit: 50 })
  const createPortfolioMutation = useCreateFirePortfolio()
  const updatePortfolioMutation = useUpdateFirePortfolio()
  const deletePortfolioMutation = useDeleteFirePortfolio()
  const addHoldingMutation = useAddFireHolding()
  const updateHoldingMutation = useUpdateFireHolding()
  const deleteHoldingMutation = useDeleteFireHolding()

  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null)
  const [createPortfolioForm, setCreatePortfolioForm] = useState(createPortfolioFormDefault)
  const [editPortfolioForm, setEditPortfolioForm] = useState<PortfolioFormState | null>(null)
  const [createHoldingForm, setCreateHoldingForm] = useState(createHoldingFormDefault)
  const [editingHoldingId, setEditingHoldingId] = useState<string | null>(null)
  const [editHoldingForm, setEditHoldingForm] = useState<HoldingFormState | null>(null)

  const portfolioList = useMemo(() => portfoliosQuery.data?.items ?? [], [portfoliosQuery.data?.items])

  useEffect(() => {
    if (portfolioList.length === 0) {
      setSelectedPortfolioId(null)
      return
    }
    if (!selectedPortfolioId || !portfolioList.some((item) => item.id === selectedPortfolioId)) {
      setSelectedPortfolioId(portfolioList[0].id)
    }
  }, [portfolioList, selectedPortfolioId])

  const detailQuery = useFirePortfolioDetail(selectedPortfolioId, { enabled: Boolean(selectedPortfolioId) })
  const selected = detailQuery.data

  useEffect(() => {
    if (!selected) {
      setEditPortfolioForm(null)
      return
    }
    setEditPortfolioForm({
      name: selected.name,
      currency: selected.currency,
      method: selected.fireTarget.method,
      targetValue: String(getMethodValue(selected.fireTarget.method, selected.fireTarget)),
      monthlyContribution: String(selected.monthlyContribution),
    })
    setEditingHoldingId(null)
    setEditHoldingForm(null)
  }, [selected])

  const onCreatePortfolio = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const name = createPortfolioForm.name.trim()
      const targetValue = parseNumber(createPortfolioForm.targetValue)
      if (!name || !targetValue || targetValue <= 0) {
        toast.error('Preenche nome e objetivo FIRE valido.')
        return
      }

      const fireTarget: Record<string, number | string> = {
        method: createPortfolioForm.method,
        withdrawalRate: 0.04,
        inflationRate: 0.02,
      }
      if (createPortfolioForm.method === 'expenses') fireTarget.monthlyExpenses = targetValue
      if (createPortfolioForm.method === 'passive_income') fireTarget.desiredMonthlyIncome = targetValue
      if (createPortfolioForm.method === 'target_amount') fireTarget.targetAmount = targetValue

      const created = await createPortfolioMutation.mutateAsync({
        name,
        currency: createPortfolioForm.currency,
        fireTarget: fireTarget as CreateFirePortfolioInput['fireTarget'],
        monthlyContribution: parseNumber(createPortfolioForm.monthlyContribution) ?? 0,
      })
      setSelectedPortfolioId(created.id)
      setCreatePortfolioForm(createPortfolioFormDefault())
      toast.success('Portfolio criado.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const onUpdatePortfolio = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedPortfolioId || !editPortfolioForm) return

    try {
      const targetValue = parseNumber(editPortfolioForm.targetValue)
      if (!targetValue || targetValue <= 0) {
        toast.error('Objetivo FIRE invalido.')
        return
      }

      const fireTarget: Record<string, number | string> = {
        method: editPortfolioForm.method,
        withdrawalRate: 0.04,
        inflationRate: 0.02,
      }
      if (editPortfolioForm.method === 'expenses') fireTarget.monthlyExpenses = targetValue
      if (editPortfolioForm.method === 'passive_income') fireTarget.desiredMonthlyIncome = targetValue
      if (editPortfolioForm.method === 'target_amount') fireTarget.targetAmount = targetValue

      await updatePortfolioMutation.mutateAsync({
        portfolioId: selectedPortfolioId,
        payload: {
          name: editPortfolioForm.name.trim(),
          currency: editPortfolioForm.currency,
          fireTarget: fireTarget as CreateFirePortfolioInput['fireTarget'],
          monthlyContribution: parseNumber(editPortfolioForm.monthlyContribution) ?? 0,
        },
      })
      toast.success('Portfolio atualizado.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const onDeletePortfolio = async () => {
    if (!selectedPortfolioId) return
    if (!window.confirm('Eliminar este portfolio?')) return
    try {
      await deletePortfolioMutation.mutateAsync(selectedPortfolioId)
      setSelectedPortfolioId(null)
      toast.success('Portfolio eliminado.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const onAddHolding = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedPortfolioId) return
    try {
      const ticker = createHoldingForm.ticker.trim().toUpperCase()
      const name = createHoldingForm.name.trim()
      const shares = parseNumber(createHoldingForm.shares)
      const averageCost = parseNumber(createHoldingForm.averageCost)
      if (!ticker || !name || !shares || shares <= 0 || averageCost === undefined || averageCost < 0) {
        toast.error('Dados de holding invalidos.')
        return
      }
      const payload: CreateFireHoldingInput = {
        ticker,
        name,
        assetType: createHoldingForm.assetType,
        shares,
        averageCost,
        monthlyAllocation: parseNumber(createHoldingForm.monthlyAllocation),
        currentPrice: parseNumber(createHoldingForm.currentPrice),
      }
      await addHoldingMutation.mutateAsync({ portfolioId: selectedPortfolioId, payload })
      setCreateHoldingForm(createHoldingFormDefault())
      toast.success('Holding adicionado.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const onStartEditHolding = (holding: FirePortfolioHolding) => {
    setEditingHoldingId(holding.id)
    setEditHoldingForm({
      ticker: holding.ticker,
      assetType: holding.assetType,
      name: holding.name,
      shares: String(holding.shares),
      averageCost: String(holding.averageCost),
      monthlyAllocation: String(holding.monthlyAllocation),
      currentPrice: String(holding.currentPrice || ''),
    })
  }

  const onSaveHolding = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedPortfolioId || !editingHoldingId || !editHoldingForm) return
    try {
      await updateHoldingMutation.mutateAsync({
        portfolioId: selectedPortfolioId,
        holdingId: editingHoldingId,
        payload: {
          ticker: editHoldingForm.ticker.trim().toUpperCase(),
          name: editHoldingForm.name.trim(),
          assetType: editHoldingForm.assetType,
          shares: parseNumber(editHoldingForm.shares),
          averageCost: parseNumber(editHoldingForm.averageCost),
          monthlyAllocation: parseNumber(editHoldingForm.monthlyAllocation),
          currentPrice: parseNumber(editHoldingForm.currentPrice),
        },
      })
      setEditingHoldingId(null)
      setEditHoldingForm(null)
      toast.success('Holding atualizado.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const onDeleteHolding = async (holdingId: string) => {
    if (!selectedPortfolioId) return
    if (!window.confirm('Remover este holding?')) return
    try {
      await deleteHoldingMutation.mutateAsync({ portfolioId: selectedPortfolioId, holdingId })
      toast.success('Holding removido.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-3xl border border-border bg-gradient-to-br from-card via-card to-muted/30 p-6 sm:p-8 lg:p-10">
          <Badge variant="outline" className="bg-background/80">FIRE - Portfolio</Badge>
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">CRUD de portfolio e holdings</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Ligacao direta aos endpoints autenticados: criar, listar, atualizar, remover e editar holdings.
          </p>
          <div className="mt-4">
            <FireToolNav />
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[320px,1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Portfolios</CardTitle>
              <CardDescription>Seleciona um portfolio ou cria um novo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-56 space-y-2 overflow-auto pr-1">
                {portfolioList.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedPortfolioId(item.id)}
                    className={`w-full rounded-lg border p-3 text-left ${
                      item.id === selectedPortfolioId ? 'border-primary bg-primary/10' : 'border-border'
                    }`}
                  >
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.summary.holdingsCount} holdings</p>
                  </button>
                ))}
                {!portfolioList.length ? (
                  <p className="text-sm text-muted-foreground">Sem portfolios.</p>
                ) : null}
              </div>

              <form className="space-y-3 border-t border-border pt-4" onSubmit={onCreatePortfolio}>
                <Label>Nome</Label>
                <Input
                  value={createPortfolioForm.name}
                  onChange={(event) => setCreatePortfolioForm((prev) => ({ ...prev, name: event.target.value }))}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Moeda</Label>
                    <Select
                      value={createPortfolioForm.currency}
                      onValueChange={(value) =>
                        setCreatePortfolioForm((prev) => ({ ...prev, currency: value as FirePortfolioCurrency }))
                      }
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CURRENCY_OPTIONS.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Metodo FIRE</Label>
                    <Select
                      value={createPortfolioForm.method}
                      onValueChange={(value) =>
                        setCreatePortfolioForm((prev) => ({ ...prev, method: value as FireTargetMethod }))
                      }
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {TARGET_OPTIONS.map((item) => (
                          <SelectItem key={item} value={item}>{labelForMethod(item)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Label>Objetivo</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={createPortfolioForm.targetValue}
                  onChange={(event) => setCreatePortfolioForm((prev) => ({ ...prev, targetValue: event.target.value }))}
                />
                <Label>Contribuicao mensal</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={createPortfolioForm.monthlyContribution}
                  onChange={(event) =>
                    setCreatePortfolioForm((prev) => ({ ...prev, monthlyContribution: event.target.value }))
                  }
                />
                <Button type="submit" className="w-full" isLoading={createPortfolioMutation.isPending}>
                  <Plus className="h-4 w-4" />
                  Criar portfolio
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio selecionado</CardTitle>
              <CardDescription>Atualiza configuracao e gere holdings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selected || !editPortfolioForm ? (
                <p className="text-sm text-muted-foreground">Seleciona um portfolio para continuar.</p>
              ) : (
                <>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-xs text-muted-foreground">Holdings</p>
                      <p className="text-lg font-semibold">{selected.summary.holdingsCount}</p>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-xs text-muted-foreground">Investido</p>
                      <p className="text-lg font-semibold">{formatMoney(selected.summary.totalInvested, selected.currency)}</p>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-xs text-muted-foreground">Valor atual</p>
                      <p className="text-lg font-semibold">{formatMoney(selected.summary.currentValue, selected.currency)}</p>
                    </div>
                  </div>

                  <form className="space-y-3 rounded-lg border border-border p-4" onSubmit={onUpdatePortfolio}>
                    <Label>Nome</Label>
                    <Input
                      value={editPortfolioForm.name}
                      onChange={(event) => setEditPortfolioForm((prev) => prev ? ({ ...prev, name: event.target.value }) : prev)}
                    />
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <Label>Moeda</Label>
                        <Select
                          value={editPortfolioForm.currency}
                          onValueChange={(value) =>
                            setEditPortfolioForm((prev) => prev ? ({ ...prev, currency: value as FirePortfolioCurrency }) : prev)
                          }
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {CURRENCY_OPTIONS.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Metodo</Label>
                        <Select
                          value={editPortfolioForm.method}
                          onValueChange={(value) =>
                            setEditPortfolioForm((prev) => prev ? ({ ...prev, method: value as FireTargetMethod }) : prev)
                          }
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {TARGET_OPTIONS.map((item) => (
                              <SelectItem key={item} value={item}>{labelForMethod(item)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Objetivo</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={editPortfolioForm.targetValue}
                          onChange={(event) =>
                            setEditPortfolioForm((prev) => prev ? ({ ...prev, targetValue: event.target.value }) : prev)
                          }
                        />
                      </div>
                    </div>
                    <Label>Contribuicao mensal</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editPortfolioForm.monthlyContribution}
                      onChange={(event) =>
                        setEditPortfolioForm((prev) => prev ? ({ ...prev, monthlyContribution: event.target.value }) : prev)
                      }
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button type="submit" isLoading={updatePortfolioMutation.isPending}>Guardar</Button>
                      <Button type="button" variant="destructive" onClick={onDeletePortfolio} isLoading={deletePortfolioMutation.isPending}>
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </Button>
                    </div>
                  </form>

                  <form className="space-y-3 rounded-lg border border-border p-4" onSubmit={onAddHolding}>
                    <h3 className="text-sm font-semibold">Adicionar holding</h3>
                    <div className="grid gap-3 md:grid-cols-4">
                      <Input
                        placeholder="Ticker"
                        value={createHoldingForm.ticker}
                        onChange={(event) => setCreateHoldingForm((prev) => ({ ...prev, ticker: event.target.value }))}
                      />
                      <Select
                        value={createHoldingForm.assetType}
                        onValueChange={(value) => setCreateHoldingForm((prev) => ({ ...prev, assetType: value as FireAssetType }))}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {ASSET_TYPES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Nome"
                        value={createHoldingForm.name}
                        onChange={(event) => setCreateHoldingForm((prev) => ({ ...prev, name: event.target.value }))}
                      />
                      <Input
                        type="number"
                        step="0.0001"
                        placeholder="Qtd"
                        value={createHoldingForm.shares}
                        onChange={(event) => setCreateHoldingForm((prev) => ({ ...prev, shares: event.target.value }))}
                      />
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      <Input
                        type="number"
                        step="0.0001"
                        placeholder="Preco medio"
                        value={createHoldingForm.averageCost}
                        onChange={(event) => setCreateHoldingForm((prev) => ({ ...prev, averageCost: event.target.value }))}
                      />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Alocacao mensal"
                        value={createHoldingForm.monthlyAllocation}
                        onChange={(event) =>
                          setCreateHoldingForm((prev) => ({ ...prev, monthlyAllocation: event.target.value }))
                        }
                      />
                      <Input
                        type="number"
                        step="0.0001"
                        placeholder="Preco atual"
                        value={createHoldingForm.currentPrice}
                        onChange={(event) => setCreateHoldingForm((prev) => ({ ...prev, currentPrice: event.target.value }))}
                      />
                    </div>
                    <Button type="submit" isLoading={addHoldingMutation.isPending}>
                      <Plus className="h-4 w-4" />
                      Adicionar holding
                    </Button>
                  </form>

                  <div className="overflow-auto rounded-lg border border-border">
                    <table className="w-full min-w-[760px] text-sm">
                      <thead className="bg-muted/40">
                        <tr>
                          <th className="px-3 py-2 text-left">Ticker</th>
                          <th className="px-3 py-2 text-right">Qtd</th>
                          <th className="px-3 py-2 text-right">Preco medio</th>
                          <th className="px-3 py-2 text-right">Alocacao</th>
                          <th className="px-3 py-2 text-right">Acoes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selected.holdings.map((holding) => (
                          <tr key={holding.id} className="border-t border-border">
                            <td className="px-3 py-2">
                              <p className="font-semibold">{holding.ticker}</p>
                              <p className="text-xs text-muted-foreground">{holding.name}</p>
                            </td>
                            <td className="px-3 py-2 text-right">{holding.shares.toFixed(4)}</td>
                            <td className="px-3 py-2 text-right">{formatMoney(holding.averageCost, selected.currency)}</td>
                            <td className="px-3 py-2 text-right">{formatMoney(holding.monthlyAllocation, selected.currency)}</td>
                            <td className="px-3 py-2">
                              <div className="flex justify-end gap-2">
                                <Button type="button" size="sm" variant="outline" onClick={() => onStartEditHolding(holding)}>
                                  <Edit3 className="h-3.5 w-3.5" />
                                  Editar
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => onDeleteHolding(holding.id)}
                                  isLoading={deleteHoldingMutation.isPending && deleteHoldingMutation.variables?.holdingId === holding.id}
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {editHoldingForm && editingHoldingId ? (
                    <form className="space-y-3 rounded-lg border border-primary/30 bg-primary/5 p-4" onSubmit={onSaveHolding}>
                      <h3 className="text-sm font-semibold">Editar holding</h3>
                      <div className="grid gap-3 md:grid-cols-3">
                        <Input
                          value={editHoldingForm.ticker}
                          onChange={(event) => setEditHoldingForm((prev) => prev ? ({ ...prev, ticker: event.target.value }) : prev)}
                        />
                        <Input
                          value={editHoldingForm.name}
                          onChange={(event) => setEditHoldingForm((prev) => prev ? ({ ...prev, name: event.target.value }) : prev)}
                        />
                        <Select
                          value={editHoldingForm.assetType}
                          onValueChange={(value) => setEditHoldingForm((prev) => prev ? ({ ...prev, assetType: value as FireAssetType }) : prev)}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {ASSET_TYPES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-3 md:grid-cols-4">
                        <Input
                          type="number"
                          step="0.0001"
                          value={editHoldingForm.shares}
                          onChange={(event) => setEditHoldingForm((prev) => prev ? ({ ...prev, shares: event.target.value }) : prev)}
                        />
                        <Input
                          type="number"
                          step="0.0001"
                          value={editHoldingForm.averageCost}
                          onChange={(event) =>
                            setEditHoldingForm((prev) => prev ? ({ ...prev, averageCost: event.target.value }) : prev)
                          }
                        />
                        <Input
                          type="number"
                          step="0.01"
                          value={editHoldingForm.monthlyAllocation}
                          onChange={(event) =>
                            setEditHoldingForm((prev) => prev ? ({ ...prev, monthlyAllocation: event.target.value }) : prev)
                          }
                        />
                        <Input
                          type="number"
                          step="0.0001"
                          value={editHoldingForm.currentPrice}
                          onChange={(event) =>
                            setEditHoldingForm((prev) => prev ? ({ ...prev, currentPrice: event.target.value }) : prev)
                          }
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" isLoading={updateHoldingMutation.isPending}>Guardar holding</Button>
                        <Button type="button" variant="outline" onClick={() => {
                          setEditingHoldingId(null)
                          setEditHoldingForm(null)
                        }}>
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  ) : null}
                </>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
