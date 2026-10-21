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
  const [promoBanners, setPromoBanners] = useState<Banner[]>([])

  useEffect(() => {
    trackPageView()
  }, [])

  // Reklamni baneri (podešavaju se u admin panelu → tab "Baneri" → tip "Reklamni")
  // Prikazuju se maksimalno dva, jedan pored drugog.
  useEffect(() => {
    const unsubscribe = subscribeToBanners((banners) => {
      setPromoBanners(
        banners.filter(b => b.active && b.image && (b.type || 'promo') === 'promo').slice(0, 2)
      )
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
      
      {/* Promo baneri — same slike, postavljaju se u admin panelu (tab "Baneri") */}
      {promoBanners.length > 0 && (
        <div className="px-4 py-4 lg:px-8 lg:py-0">
          <div className={`grid gap-4 ${promoBanners.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
            {promoBanners.map((banner, index) => (
              <PromoBanner
                key={banner.id}
                image={banner.image}
                link={banner.link}
                alt={`Reklamni baner ${index + 1}`}
                className={promoBanners.length > 1 ? 'aspect-[2/1]' : 'aspect-[1216/208]'}
                sizes={promoBanners.length > 1 ? '(max-width: 640px) 92vw, 600px' : '(max-width: 640px) 92vw, 1216px'}
              />
            ))}
          </div>
        </div>
      )}
      
      <FeaturedProducts />
    </div>
  )
}
