import { useMemo } from 'react'
import type { Subscription } from '../types'
import { monthlyRubCost, yearlyRubCost, describeFrequency } from '../utils/frequency'
import { convertFromRub, formatRub, secondaryCurrencies, currencySymbols } from '../utils/currency'

interface StatsPanelProps {
  subscriptions: Subscription[]
}

export const StatsPanel = ({ subscriptions }: StatsPanelProps) => {
  const stats = useMemo(() => {
    const frequencyTotals: Record<Subscription['frequency'], { count: number; monthly: number }> = {
      daily: { count: 0, monthly: 0 },
      weekly: { count: 0, monthly: 0 },
      monthly: { count: 0, monthly: 0 },
      yearly: { count: 0, monthly: 0 },
    }

    const sourceTotals: Record<Subscription['source'], { count: number; monthly: number }> = {
      International: { count: 0, monthly: 0 },
      Russian: { count: 0, monthly: 0 },
      Custom: { count: 0, monthly: 0 },
    }

    let monthlySum = 0
    let yearlySum = 0

    const sortedByMonthly = [...subscriptions]
      .sort((a, b) => monthlyRubCost(b) - monthlyRubCost(a))
      .slice(0, 3)

    subscriptions.forEach((subscription) => {
      const monthly = monthlyRubCost(subscription)
      const yearly = yearlyRubCost(subscription)

      monthlySum += monthly
      yearlySum += yearly

      frequencyTotals[subscription.frequency].count += 1
      frequencyTotals[subscription.frequency].monthly += monthly

      sourceTotals[subscription.source].count += 1
      sourceTotals[subscription.source].monthly += monthly
    })

    return {
      monthlySum,
      yearlySum,
      frequencyTotals,
      sourceTotals,
      topSubscriptions: sortedByMonthly,
    }
  }, [subscriptions])

  const monthlySecondary = secondaryCurrencies.map((currency) => ({
    currency,
    amount: stats.monthlySum ? convertFromRub(stats.monthlySum, currency) : 0,
  }))

  const maxFrequencyCount = Math.max(...Object.values(stats.frequencyTotals).map((item) => item.count), 1)
  const maxSourceMonthly = Math.max(...Object.values(stats.sourceTotals).map((item) => item.monthly), 1)

  return (
    <section className="stats-panel">
      <h2>Статистика расходов</h2>
      <div className="stats-panel__cards">
        <div className="stats-card">
          <span className="stats-card__label">В месяц</span>
          <strong className="stats-card__value">{formatRub(stats.monthlySum)}</strong>
          <ul className="stats-card__inline">
            {monthlySecondary.map((item) => (
              <li key={item.currency}>
                ≈ {item.amount.toFixed(0)} {currencySymbols[item.currency]}
              </li>
            ))}
          </ul>
        </div>
        <div className="stats-card">
          <span className="stats-card__label">В год</span>
          <strong className="stats-card__value">{formatRub(stats.yearlySum)}</strong>
          <span className="stats-card__hint">
            Это {formatRub(stats.monthlySum * 3)} за квартал и {formatRub(stats.monthlySum / 30)} в день.
          </span>
        </div>
        <div className="stats-card">
          <span className="stats-card__label">Подписок</span>
          <strong className="stats-card__value">{subscriptions.length}</strong>
          <span className="stats-card__hint">
            {subscriptions.length === 0
              ? 'Добавьте подписку, чтобы увидеть динамику.'
              : `Средний чек: ${formatRub(
                  subscriptions.length ? stats.monthlySum / subscriptions.length : 0,
                )} в месяц`}
          </span>
        </div>
      </div>
      <div className="stats-panel__grid">
        <div className="stats-panel__block">
          <h3>По периодичности</h3>
          <ul className="bar-list">
            {Object.entries(stats.frequencyTotals).map(([frequency, value]) => (
              <li key={frequency}>
                <div className="bar-list__label">
                  <span>{describeFrequency(frequency as Subscription['frequency'])}</span>
                  <span>{value.count}</span>
                </div>
                <div className="bar-list__bar">
                  <div
                    className="bar-list__fill"
                    style={{ width: `${(value.count / maxFrequencyCount) * 100}%` }}
                  />
                </div>
                <span className="bar-list__value">{formatRub(value.monthly)} / мес</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="stats-panel__block">
          <h3>По источникам</h3>
          <ul className="bar-list">
            {Object.entries(stats.sourceTotals).map(([source, value]) => (
              <li key={source}>
                <div className="bar-list__label">
                  <span>{source === 'Custom' ? 'Свои' : source === 'Russian' ? 'Российские' : 'Международные'}</span>
                  <span>{value.count}</span>
                </div>
                <div className="bar-list__bar">
                  <div
                    className="bar-list__fill"
                    style={{ width: `${(value.monthly / maxSourceMonthly) * 100}%` }}
                  />
                </div>
                <span className="bar-list__value">{formatRub(value.monthly)} / мес</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="stats-panel__block stats-panel__block--top">
          <h3>Самые дорогие подписки</h3>
          {stats.topSubscriptions.length === 0 ? (
            <p className="stats-panel__empty">Добавьте подписку, чтобы увидеть список лидеров.</p>
          ) : (
            <ol className="top-list">
              {stats.topSubscriptions.map((subscription) => (
                <li key={subscription.id}>
                  <span>{subscription.name}</span>
                  <span>{formatRub(monthlyRubCost(subscription))} / мес</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  )
}
