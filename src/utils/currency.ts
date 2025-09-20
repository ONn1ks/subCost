import type { CurrencyCode } from '../types'

export const BASE_CURRENCY: CurrencyCode = 'RUB'

export const currencySymbols: Record<CurrencyCode, string> = {
  RUB: '₽',
  USD: '$',
  EUR: '€',
  GBP: '£',
}

export const currencyRatesToRub: Record<CurrencyCode, number> = {
  RUB: 1,
  USD: 92,
  EUR: 99,
  GBP: 115,
}

export const secondaryCurrencies: CurrencyCode[] = ['USD', 'EUR']

export const formatCurrency = (value: number, currency: CurrencyCode) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)

export const convertToRub = (value: number, currency: CurrencyCode) =>
  value * currencyRatesToRub[currency]

export const convertFromRub = (valueInRub: number, targetCurrency: CurrencyCode) =>
  valueInRub / currencyRatesToRub[targetCurrency]

export const formatRub = (value: number) =>
  formatCurrency(value, 'RUB')
