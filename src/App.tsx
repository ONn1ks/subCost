import { useEffect, useMemo, useState } from 'react'
import './App.css'
import type {
  BillingFrequency,
  RecommendedSubscription,
  Subscription,
  SubscriptionDraft,
  SubscriptionSource,
} from './types'
import { SubscriptionForm } from './components/SubscriptionForm'
import { SubscriptionList } from './components/SubscriptionList'
import { StatsPanel } from './components/StatsPanel'
import { RecommendedGrid } from './components/RecommendedGrid'
import { monthlyRubCost } from './utils/frequency'

const STORAGE_KEY = 'subCost:subscriptions'

const createId = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Date.now().toString(36))

const loadSubscriptions = (): Subscription[] => {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as Subscription[]
    return parsed.map((item) => ({
      ...item,
      createdAt: item.createdAt ?? new Date().toISOString(),
      source: item.source ?? 'Custom',
    }))
  } catch (error) {
    console.error('Не удалось загрузить сохраненные подписки', error)
    return []
  }
}

const saveSubscriptions = (items: Subscription[]) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

function App() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => loadSubscriptions())
  const [editing, setEditing] = useState<Subscription | null>(null)
  const [formDefaults, setFormDefaults] = useState<Partial<SubscriptionDraft> | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sourceFilter, setSourceFilter] = useState<'all' | SubscriptionSource>('all')
  const [frequencyFilter, setFrequencyFilter] = useState<'all' | BillingFrequency>('all')

  useEffect(() => {
    saveSubscriptions(subscriptions)
  }, [subscriptions])

  const totalMonthly = useMemo(
    () => subscriptions.reduce((sum, subscription) => sum + monthlyRubCost(subscription), 0),
    [subscriptions],
  )

  const filteredSubscriptions = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase()
    return subscriptions
      .filter((subscription) => {
        if (sourceFilter !== 'all' && subscription.source !== sourceFilter) {
          return false
        }
        if (frequencyFilter !== 'all' && subscription.frequency !== frequencyFilter) {
          return false
        }
        if (!normalizedQuery) {
          return true
        }
        return (
          subscription.name.toLowerCase().includes(normalizedQuery) ||
          (subscription.notes ?? '').toLowerCase().includes(normalizedQuery)
        )
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [subscriptions, searchTerm, sourceFilter, frequencyFilter])

  const handleSave = (draft: SubscriptionDraft, editingId?: string) => {
    if (editingId) {
      setSubscriptions((prev) =>
        prev.map((item) => (item.id === editingId ? { ...item, ...draft, createdAt: item.createdAt } : item)),
      )
      setEditing(null)
    } else {
      const newSubscription: Subscription = {
        ...draft,
        id: createId(),
        createdAt: new Date().toISOString(),
      }
      setSubscriptions((prev) => [newSubscription, ...prev])
    }
    setFormDefaults(null)
  }

  const handleRemove = (id: string) => {
    const target = subscriptions.find((item) => item.id === id)
    if (!target) return
    if (window.confirm(`Удалить подписку «${target.name}»?`)) {
      setSubscriptions((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const handleAddRecommendation = (item: RecommendedSubscription) => {
    setEditing(null)
    setFormDefaults({
      name: item.name,
      cost: item.averageCost,
      currency: item.currency,
      frequency: item.frequency,
      source: item.category,
    })
  }

  const totalCount = subscriptions.length

  return (
    <div className="app">
      <header className="hero">
        <div className="hero__content">
          <h1>subCost — умный трекер подписок</h1>
          <p>
            Собирайте все подписки в одном месте, контролируйте даты списаний и понимаете, сколько тратите на
            цифровые сервисы каждый месяц. Добавляйте свои сервисы или выбирайте из готового каталога.
          </p>
          <div className="hero__badges">
            <span className="hero__badge">{totalCount} активных подписок</span>
            <span className="hero__badge">{totalMonthly.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽ в месяц</span>
          </div>
        </div>
        <div className="hero__card">
          <h2>Как работает</h2>
          <ol>
            <li>Добавьте подписку вручную или из каталога топовых сервисов.</li>
            <li>Укажите стоимость, периодичность и дату следующего списания.</li>
            <li>Получайте сводку расходов и подсказки по оптимизации бюджета.</li>
          </ol>
        </div>
      </header>
      <main>
        <StatsPanel subscriptions={subscriptions} />
        <div className="app__columns">
          <SubscriptionList
            subscriptions={filteredSubscriptions}
            onEdit={(subscription) => {
              setEditing(subscription)
              setFormDefaults(null)
            }}
            onRemove={handleRemove}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            sourceFilter={sourceFilter}
            onSourceFilterChange={setSourceFilter}
            frequencyFilter={frequencyFilter}
            onFrequencyFilterChange={setFrequencyFilter}
          />
          <SubscriptionForm
            editing={editing}
            defaults={formDefaults}
            onSave={handleSave}
            onCancelEdit={() => setEditing(null)}
          />
        </div>
        <RecommendedGrid onAdd={handleAddRecommendation} />
      </main>
      <footer className="footer">
        <p>
          Сделано для осознанных расходов. Данные хранятся только в вашем браузере. Экспорт и интеграции появятся в
          следующих релизах.
        </p>
      </footer>
    </div>
  )
}

export default App
