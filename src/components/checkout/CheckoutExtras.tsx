'use client'

import { useState } from 'react'
import { Check, CheckCircle, Gift, Tag, X } from 'lucide-react'
import { calculatePromoDiscount, type PromoCode, type UpsellItem } from '@/lib/realtimeProducts'

const isImageUrl = (str: string) => str?.startsWith('http') || str?.startsWith('/') || str?.startsWith('data:')

interface UpsellSectionProps {
  items: UpsellItem[]
  selectedIds: string[]
  onToggle: (item: UpsellItem) => void
}

export function UpsellSection({ items, selectedIds, onToggle }: UpsellSectionProps) {
  if (!items.length) return null

  return (
    <div className="bg-surface rounded-2xl p-4 lg:p-5 border border-white/5 mb-6">
      <div className="flex items-center gap-2 mb-1">
        <Gift className="w-5 h-5 text-secondary" />
        <h3 className="font-semibold text-text text-sm lg:text-base">Želite li dodati nešto uz narudžbu?</h3>
      </div>
      <p className="text-xs text-muted mb-4">Dodajte korisne dodatke po povoljnijoj cijeni.</p>

      <div className="space-y-2.5">
        {items.map(item => {
          const selected = selectedIds.includes(item.id!)
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggle(item)}
              className={`w-full flex items-start gap-3 rounded-xl p-3 text-left border transition-all ${
                selected
                  ? 'border-primary bg-primary/10'
                  : 'border-white/10 bg-background hover:border-primary/40'
              }`}
            >
              <span className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                selected ? 'bg-primary border-primary text-white' : 'border-white/20 text-transparent'
              }`}>
                <Check className="w-3.5 h-3.5" />
              </span>

              {item.image && isImageUrl(item.image) && (
                <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
              )}

              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-text">{item.name}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wide bg-danger/15 text-danger px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </span>
                {item.description && (
                  <span className="block text-xs text-muted mt-0.5">{item.description}</span>
                )}
              </span>

              <span className="text-right shrink-0">
                <span className="block text-sm font-bold text-primary">+{item.price.toFixed(2)} KM</span>
                {item.originalPrice && item.originalPrice > item.price && (
                  <span className="block text-xs text-muted line-through">{item.originalPrice.toFixed(2)} KM</span>
                )}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface PromoSectionProps {
  promoCodes: PromoCode[]
  /** Osnovica za obračun popusta (proizvodi + dodaci). */
  baseAmount: number
  appliedCode: string | null
  onApply: (code: string) => void
  onRemove: () => void
}

export function PromoSection({ promoCodes, baseAmount, appliedCode, onApply, onRemove }: PromoSectionProps) {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const applied = appliedCode ? calculatePromoDiscount(appliedCode, promoCodes, baseAmount) : null
  const hasActivePromo = promoCodes.some(p => p.active)

  if (!hasActivePromo && !applied) return null

  const handleApply = () => {
    const code = input.trim()
    if (!code) return
    const result = calculatePromoDiscount(code, promoCodes, baseAmount)
    if (!result) {
      setError('Nevažeći promo kod. Provjerite unos i pokušajte ponovo.')
      setSuccess('')
      return
    }
    const suffix = result.promo.type === 'percentage' ? '%' : ' KM'
    setError('')
    setInput('')
    setSuccess(`Promo kod ${result.promo.code} je uspješno primijenjen! Ostvarili ste ${result.promo.value}${suffix} popusta.`)
    onApply(result.promo.code)
  }

  return (
    <div className="bg-surface rounded-2xl p-4 lg:p-5 border border-white/5 mb-6">
      <div className="flex items-center gap-2 mb-1">
        <Tag className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-text text-sm lg:text-base">Imate promo kod?</h3>
      </div>

      {applied ? (
        <div className="mt-3">
          <div className="flex items-center gap-2 text-sm text-accent mb-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{success || `Promo kod ${applied.promo.code} je uspješno primijenjen!`}</span>
          </div>
          <div className="flex items-center justify-between bg-accent/10 border border-accent/20 rounded-xl px-3 py-2">
            <span className="text-sm text-text">
              Promo kod: <b>{applied.promo.code}</b>{' '}
              <span className="text-accent font-semibold">-{applied.discount.toFixed(2)} KM</span>
            </span>
            <button
              type="button"
              onClick={() => { onRemove(); setSuccess(''); setError('') }}
              className="text-muted hover:text-danger flex items-center gap-1 text-xs transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Ukloni
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleApply() } }}
              placeholder="Unesite kod"
              className="flex-1 min-w-0 bg-background border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="button"
              onClick={handleApply}
              className="shrink-0 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              Primijeni
            </button>
          </div>
          {error && <p className="text-xs text-danger mt-2">{error}</p>}
        </>
      )}
    </div>
  )
}
