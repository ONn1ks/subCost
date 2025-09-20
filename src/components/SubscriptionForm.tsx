import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { Subscription, SubscriptionDraft } from '../types'
import { currencySymbols } from '../utils/currency'
import { frequencyOptions } from '../utils/frequency'

interface SubscriptionFormProps {
  editing?: Subscription | null
  defaults?: Partial<SubscriptionDraft> | null
  onSave: (draft: SubscriptionDraft, editingId?: string) => void
  onCancelEdit?: () => void
}

const emptyDraft: SubscriptionDraft = {
  name: '',
  cost: 0,
  currency: 'RUB',
  frequency: 'monthly',
  billingDay: undefined,
  nextPayment: undefined,
  notes: '',
  image: null,
  source: 'Custom',
}

export const SubscriptionForm = ({ editing, defaults, onSave, onCancelEdit }: SubscriptionFormProps) => {
  const [draft, setDraft] = useState<SubscriptionDraft>(editing ?? { ...emptyDraft, ...defaults })
  const [costValue, setCostValue] = useState(() => (editing ? String(editing.cost) : defaults?.cost ? String(defaults.cost) : ''))
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (editing) {
      setDraft({
        name: editing.name,
        cost: editing.cost,
        currency: editing.currency,
        frequency: editing.frequency,
        billingDay: editing.billingDay,
        nextPayment: editing.nextPayment,
        notes: editing.notes ?? '',
        image: editing.image ?? null,
        source: editing.source,
      })
      setCostValue(String(editing.cost))
    } else if (defaults) {
      setDraft({
        ...emptyDraft,
        ...defaults,
        notes: defaults.notes ?? '',
        image: defaults.image ?? null,
        source: defaults.source ?? 'Custom',
      })
      setCostValue(defaults.cost !== undefined ? String(defaults.cost) : '')
    } else {
      setDraft(emptyDraft)
      setCostValue('')
    }
  }, [editing, defaults])

  const handleChange = <K extends keyof SubscriptionDraft>(key: K, value: SubscriptionDraft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  const handleImageUpload = (file: File | null) => {
    if (!file) {
      handleChange('image', null)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      handleChange('image', typeof reader.result === 'string' ? reader.result : null)
    }
    reader.readAsDataURL(file)
  }

  const resetForm = () => {
    setDraft(emptyDraft)
    setCostValue('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const numericCost = parseFloat(costValue.replace(',', '.'))
    if (!draft.name.trim() || Number.isNaN(numericCost) || numericCost <= 0) {
      return
    }
    const payload: SubscriptionDraft = {
      ...draft,
      name: draft.name.trim(),
      cost: Number(numericCost.toFixed(2)),
      notes: draft.notes?.trim() ?? '',
    }

    onSave(payload, editing?.id)
    if (editing) {
      onCancelEdit?.()
    }
    resetForm()
  }

  return (
    <section className="subscription-form">
      <h2>{editing ? 'Редактирование подписки' : 'Добавить подписку'}</h2>
      <p>
        Заполните данные вручную или используйте одну из готовых рекомендаций. Фотографию можно добавить для наглядности.
      </p>
      <form onSubmit={handleSubmit} className="form">
        <label className="field">
          <span>Название</span>
          <input
            type="text"
            placeholder="Например, Netflix"
            value={draft.name}
            onChange={(event) => handleChange('name', event.target.value)}
            required
          />
        </label>
        <div className="form__row">
          <label className="field">
            <span>Сумма</span>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={costValue}
              onChange={(event) => setCostValue(event.target.value)}
              required
            />
          </label>
          <label className="field">
            <span>Валюта</span>
            <select
              value={draft.currency}
              onChange={(event) => handleChange('currency', event.target.value as SubscriptionDraft['currency'])}
            >
              {Object.entries(currencySymbols).map(([code, symbol]) => (
                <option key={code} value={code}>
                  {code} {symbol}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Периодичность</span>
            <select
              value={draft.frequency}
              onChange={(event) => handleChange('frequency', event.target.value as SubscriptionDraft['frequency'])}
            >
              {frequencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="form__row">
          <label className="field">
            <span>День списания (если ежемесячно)</span>
            <input
              type="number"
              min="1"
              max="31"
              value={draft.billingDay ?? ''}
              onChange={(event) =>
                handleChange('billingDay', event.target.value ? Number(event.target.value) : undefined)
              }
              placeholder="15"
            />
          </label>
          <label className="field">
            <span>Следующее списание</span>
            <input
              type="date"
              value={draft.nextPayment ?? ''}
              onChange={(event) => handleChange('nextPayment', event.target.value || undefined)}
            />
          </label>
        </div>
        <label className="field">
          <span>Заметки</span>
          <textarea
            rows={3}
            placeholder="Например, тариф для семьи или условия скидки"
            value={draft.notes}
            onChange={(event) => handleChange('notes', event.target.value)}
          />
        </label>
        <div className="form__upload">
          <label className="field">
            <span>Фотография / логотип</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(event) => handleImageUpload(event.target.files?.[0] ?? null)}
            />
          </label>
          {draft.image && (
            <div className="form__preview">
              <img src={draft.image} alt="Превью подписки" />
              <button type="button" className="link" onClick={() => handleImageUpload(null)}>
                Удалить фото
              </button>
            </div>
          )}
        </div>
        <div className="form__footer">
          {editing && (
            <button type="button" className="ghost" onClick={() => { onCancelEdit?.(); resetForm() }}>
              Отменить
            </button>
          )}
          <button type="submit" className="primary">
            {editing ? 'Сохранить изменения' : 'Добавить подписку'}
          </button>
        </div>
      </form>
    </section>
  )
}
