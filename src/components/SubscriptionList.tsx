import type { BillingFrequency, Subscription, SubscriptionSource } from '../types'
import { SubscriptionCard } from './SubscriptionCard'
import { frequencyOptions } from '../utils/frequency'

interface SubscriptionListProps {
  subscriptions: Subscription[]
  onEdit: (subscription: Subscription) => void
  onRemove: (id: string) => void
  searchTerm: string
  onSearchTermChange: (value: string) => void
  sourceFilter: 'all' | SubscriptionSource
  onSourceFilterChange: (value: 'all' | SubscriptionSource) => void
  frequencyFilter: 'all' | BillingFrequency
  onFrequencyFilterChange: (value: 'all' | BillingFrequency) => void
}

const sourceOptions: { value: 'all' | SubscriptionSource; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'International', label: 'Международные' },
  { value: 'Russian', label: 'Российские' },
  { value: 'Custom', label: 'Свои' },
]

export const SubscriptionList = ({
  subscriptions,
  onEdit,
  onRemove,
  searchTerm,
  onSearchTermChange,
  sourceFilter,
  onSourceFilterChange,
  frequencyFilter,
  onFrequencyFilterChange,
}: SubscriptionListProps) => {
  return (
    <section className="subscription-list">
      <header className="subscription-list__header">
        <div>
          <h2>Ваши подписки</h2>
          <p>Отслеживайте стоимость, даты списания и статистику по своим сервисам.</p>
        </div>
        <div className="subscription-list__filters">
          <label className="field">
            <span>Поиск</span>
            <input
              type="search"
              placeholder="Например, Netflix"
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
            />
          </label>
          <label className="field">
            <span>Источник</span>
            <select
              value={sourceFilter}
              onChange={(event) =>
                onSourceFilterChange(event.target.value as 'all' | SubscriptionSource)
              }
            >
              {sourceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Периодичность</span>
            <select
              value={frequencyFilter}
              onChange={(event) =>
                onFrequencyFilterChange(event.target.value as 'all' | BillingFrequency)
              }
            >
              <option value="all">Все</option>
              {frequencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>
      {subscriptions.length === 0 ? (
        <div className="subscription-list__empty">
          <p>Пока нет подписок, добавьте первую через форму справа или выберите из рекомендаций.</p>
        </div>
      ) : (
        <div className="subscription-list__grid">
          {subscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onEdit={onEdit}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </section>
  )
}
