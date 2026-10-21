'use client'

import { useEffect, useState } from 'react'
import {
  subscribeToPromoCodes,
  subscribeToUpsellItems,
  matchesUpsellTarget,
  type PromoCode,
  type UpsellItem,
  type UpsellTarget,
} from '@/lib/realtimeProducts'

export function usePromoCodes(): PromoCode[] {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  useEffect(() => {
    const unsubscribe = subscribeToPromoCodes(setPromoCodes)
    return () => { unsubscribe() }
  }, [])
  return promoCodes
}

/**
 * Samo aktivne up-sell stavke, sortirane po sortOrder pa po vremenu kreiranja.
 * Ako se proslijedi `target`, vraćaju se samo stavke vezane za te proizvode/kategorije
 * (plus stavke bez ograničenja). Bez `target`-a vraćaju se samo stavke bez ograničenja.
 */
export function useUpsellItems(target?: UpsellTarget): UpsellItem[] {
  const [items, setItems] = useState<UpsellItem[]>([])
  useEffect(() => {
    const unsubscribe = subscribeToUpsellItems(setItems)
    return () => { unsubscribe() }
  }, [])
  return items
    .filter(i => i.active && matchesUpsellTarget(i, target))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || (a.createdAt || 0) - (b.createdAt || 0))
}
