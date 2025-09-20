import type { BillingFrequency, Subscription } from '../types'
import { convertToRub } from './currency'

const monthlyMultiplier: Record<BillingFrequency, number> = {
  daily: 30,
  weekly: 52 / 12,
  monthly: 1,
  yearly: 1 / 12,
}

const yearlyMultiplier: Record<BillingFrequency, number> = {
  daily: 365,
  weekly: 52,
  monthly: 12,
  yearly: 1,
}

const dailyMultiplier: Record<BillingFrequency, number> = {
  daily: 1,
  weekly: 1 / 7,
  monthly: 1 / 30,
  yearly: 1 / 365,
}

export const monthlyRubCost = (subscription: Subscription) =>
  convertToRub(subscription.cost, subscription.currency) *
  monthlyMultiplier[subscription.frequency]

export const yearlyRubCost = (subscription: Subscription) =>
  convertToRub(subscription.cost, subscription.currency) *
  yearlyMultiplier[subscription.frequency]

export const dailyRubCost = (subscription: Subscription) =>
  convertToRub(subscription.cost, subscription.currency) *
  dailyMultiplier[subscription.frequency]

export const describeFrequency = (frequency: BillingFrequency) => {
  switch (frequency) {
    case 'daily':
      return 'Ежедневная'
    case 'weekly':
      return 'Еженедельная'
    case 'monthly':
      return 'Ежемесячная'
    case 'yearly':
      return 'Ежегодная'
    default:
      return frequency
  }
}

export const frequencyOptions: { value: BillingFrequency; label: string }[] = [
  { value: 'daily', label: 'Ежедневно' },
  { value: 'weekly', label: 'Еженедельно' },
  { value: 'monthly', label: 'Ежемесячно' },
  { value: 'yearly', label: 'Ежегодно' },
]
