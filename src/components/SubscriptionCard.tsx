import { describeFrequency, dailyRubCost, monthlyRubCost, yearlyRubCost } from '../utils/frequency'
import { formatCurrency, formatRub } from '../utils/currency'
import { daysUntil, formatDate, isOverdue } from '../utils/date'
import type { Subscription } from '../types'

interface SubscriptionCardProps {
  subscription: Subscription
  onEdit: (subscription: Subscription) => void
  onRemove: (id: string) => void
}

const sourceLabels: Record<Subscription['source'], string> = {
  International: 'Международная',
  Russian: 'Российская',
  Custom: 'Своя подписка',
}

export const SubscriptionCard = ({ subscription, onEdit, onRemove }: SubscriptionCardProps) => {
  const monthly = monthlyRubCost(subscription)
  const yearly = yearlyRubCost(subscription)
  const daily = dailyRubCost(subscription)
  const nextPayment = formatDate(subscription.nextPayment)
  const days = daysUntil(subscription.nextPayment)
  const overdue = isOverdue(subscription.nextPayment)

  return (
    <article className="subscription-card">
      <div className="subscription-card__cover">
        {subscription.image ? (
          <img src={subscription.image} alt={subscription.name} />
        ) : (
          <div className={`subscription-card__placeholder subscription-card__placeholder--${subscription.source.toLowerCase()}`}>
            {subscription.name.slice(0, 1).toUpperCase()}
          </div>
        )}
      </div>
      <div className="subscription-card__body">
        <header className="subscription-card__header">
          <div>
            <h3>{subscription.name}</h3>
            <span className={`subscription-card__source subscription-card__source--${subscription.source.toLowerCase()}`}>
              {sourceLabels[subscription.source]}
            </span>
          </div>
          <div className="subscription-card__actions">
            <button type="button" onClick={() => onEdit(subscription)} aria-label="Редактировать подписку">
              ✏️
            </button>
            <button
              type="button"
              className="danger"
              onClick={() => onRemove(subscription.id)}
              aria-label="Удалить подписку"
            >
              🗑️
            </button>
          </div>
        </header>
        <div className="subscription-card__pricing">
          <p className="subscription-card__price">
            {formatCurrency(subscription.cost, subscription.currency)}{' '}
            <span className="subscription-card__price-period">/{describeFrequency(subscription.frequency).toLowerCase()}</span>
          </p>
          <ul>
            <li>
              <strong>{formatRub(monthly)}</strong>
              <span>в месяц</span>
            </li>
            <li>
              <strong>{formatRub(yearly)}</strong>
              <span>в год</span>
            </li>
            <li>
              <strong>{formatRub(daily)}</strong>
              <span>в день</span>
            </li>
          </ul>
        </div>
        <div className="subscription-card__meta">
          <span className="chip">{describeFrequency(subscription.frequency)}</span>
          {subscription.billingDay && (
            <span className="chip">Списание {subscription.billingDay}-го числа</span>
          )}
          {nextPayment && (
            <span className={`chip ${overdue ? 'chip--warning' : ''}`}>
              {overdue ? 'Просрочено с ' : 'Следующее списание: '}
              {nextPayment}
              {days !== null && !Number.isNaN(days) && !overdue && ` · через ${days} дн.`}
            </span>
          )}
        </div>
        {subscription.notes && <p className="subscription-card__notes">{subscription.notes}</p>}
      </div>
    </article>
  )
}
