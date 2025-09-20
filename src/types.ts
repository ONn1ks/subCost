export type BillingFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly'

export type CurrencyCode = 'RUB' | 'USD' | 'EUR' | 'GBP'

export type SubscriptionSource = 'International' | 'Russian' | 'Custom'

export interface Subscription {
  id: string
  name: string
  cost: number
  currency: CurrencyCode
  frequency: BillingFrequency
  billingDay?: number
  nextPayment?: string
  notes?: string
  image?: string | null
  source: SubscriptionSource
  createdAt: string
}

export interface SubscriptionDraft {
  name: string
  cost: number
  currency: CurrencyCode
  frequency: BillingFrequency
  billingDay?: number
  nextPayment?: string
  notes?: string
  image?: string | null
  source: SubscriptionSource
}

export interface RecommendedSubscription {
  name: string
  description: string
  averageCost: number
  currency: CurrencyCode
  frequency: BillingFrequency
  category: Exclude<SubscriptionSource, 'Custom'>
  emoji: string
}
