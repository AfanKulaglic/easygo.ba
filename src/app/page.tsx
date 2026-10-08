'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import HeroBanner from '@/components/HeroBanner'
import CategoryGrid from '@/components/CategoryGrid'
import FlashDeals from '@/components/FlashDeals'
import TopProducts from '@/components/TopProducts'
import PromoBanner from '@/components/PromoBanner'
import WeeklyBestSellers from '@/components/WeeklyBestSellers'
import TrustBadges from '@/components/TrustBadges'
import FeaturedProducts from '@/components/FeaturedProducts'
import { trackPageView } from '@/lib/cookieManager'
import { subscribeToBanners, Banner } from '@/lib/realtimeProducts'

// Only DarkModeToggle needs dynamic import (client-only, no SSR)
const DarkModeToggle = dynamic(() => import('@/components/DarkModeToggle'), { ssr: false })

export default function Home() {
  const [promoBanner, setPromoBanner] = useState<Banner | null>(null)

  useEffect(() => {
    trackPageView()
  }, [])

  // Reklamni baner (podešava se u admin panelu → tab "Baneri")
  useEffect(() => {
    const unsubscribe = subscribeToBanners((banners) => {
      setPromoBanner(banners.find(b => b.active && b.image) || null)
    })
    return () => unsubscribe()
  }, [])

  return (
    <div className="min-h-screen lg:py-6 max-w-7xl mx-auto">
      <HeroBanner />
      <CategoryGrid />
      <FlashDeals />
      <div className="px-4 py-4 lg:px-8">
        <DarkModeToggle />
      </div>
      <TopProducts />
      
      {/* Trust badges */}
      <TrustBadges />
      
      <WeeklyBestSellers />
      
      {/* Promo baner — samo slika, postavlja se u admin panelu (tab "Baneri") */}
      {promoBanner && (
        <div className="lg:px-8">
          <PromoBanner image={promoBanner.image} link={promoBanner.link} />
        </div>
      )}
      
      <FeaturedProducts />
    </div>
  )
}
