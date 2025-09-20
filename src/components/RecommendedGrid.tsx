import { useMemo, useState } from 'react'
import type { RecommendedSubscription } from '../types'
import { RECOMMENDED_SUBSCRIPTIONS } from '../data/recommendations'
import { describeFrequency } from '../utils/frequency'
import { formatCurrency } from '../utils/currency'

interface RecommendedGridProps {
  onAdd: (recommendation: RecommendedSubscription) => void
}

const categoryOptions: { value: 'all' | RecommendedSubscription['category']; label: string }[] = [
  { value: 'all', label: 'Все топы' },
  { value: 'International', label: 'Международные' },
  { value: 'Russian', label: 'Российские' },
]

export const RecommendedGrid = ({ onAdd }: RecommendedGridProps) => {
  const [category, setCategory] = useState<'all' | RecommendedSubscription['category']>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const base = category === 'all'
      ? RECOMMENDED_SUBSCRIPTIONS
      : RECOMMENDED_SUBSCRIPTIONS.filter((item) => item.category === category)

    if (!query.trim()) {
      return base
    }

    const normalizedQuery = query.trim().toLowerCase()
    return base.filter((item) => item.name.toLowerCase().includes(normalizedQuery))
  }, [category, query])

  return (
    <section className="recommended">
      <header className="recommended__header">
        <div>
          <h2>Каталог популярных подписок</h2>
          <p>Выберите готовый сервис и добавьте его в свой список в один клик.</p>
        </div>
        <div className="recommended__controls">
          <nav className="tabs" aria-label="Категории подписок">
            {categoryOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={option.value === category ? 'active' : ''}
                onClick={() => setCategory(option.value)}
              >
                {option.label}
              </button>
            ))}
          </nav>
          <label className="field">
            <span>Поиск</span>
            <input
              type="search"
              placeholder="Введите название"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
      </header>
      <div className="recommended__grid">
        {filtered.map((item) => (
          <article key={item.name} className="recommended__card">
            <div className="recommended__emoji" aria-hidden="true">
              {item.emoji}
            </div>
            <div className="recommended__body">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <div className="recommended__meta">
                <span className="chip">{item.category === 'International' ? 'Международная' : 'Российская'}</span>
                <span className="chip">{describeFrequency(item.frequency)}</span>
                <span className="chip">{formatCurrency(item.averageCost, item.currency)}</span>
              </div>
            </div>
            <button type="button" className="primary" onClick={() => onAdd(item)}>
              Добавить
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
