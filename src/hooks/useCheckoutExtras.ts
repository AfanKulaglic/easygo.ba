'use client'

import { useEffect, useState } from 'react'
import {
  subscribeToPromoCodes,
  subscribeToUpsellItems,
  type PromoCode,
  type UpsellItem,
} from '@/lib/realtimeProducts'

export function usePromoCodes(): PromoCode[] {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  useEffect(() => {
    const unsubscribe = subscribeToPromoCodes(setPromoCodes)
    return () => { unsubscribe() }
  }, [])
  return promoCodes
}

/** Samo aktivne up-sell stavke, sortirane po sortOrder pa po vremenu kreiranja. */
export function useUpsellItems(): UpsellItem[] {
  const [items, setItems] = useState<UpsellItem[]>([])
  useEffect(() => {
    const unsubscribe = subscribeToUpsellItems(setItems)
    return () => { unsubscribe() }
  }, [])
  return items
    .filter(i => i.active)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || (a.createdAt || 0) - (b.createdAt || 0))
}
