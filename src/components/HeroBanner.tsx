'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useHeroProducts } from '@/hooks/useProducts'
import { Product } from '@/lib/realtimeProducts'

// Helper to check if string is an image URL or base64
const isImageUrl = (str: string) => str?.startsWith('http') || str?.startsWith('/') || str?.startsWith('data:')

// Default banner when no products are set for hero
const defaultBanner: Partial<Product> & { id: string } = {
  id: 'default',
  name: 'Dobrodošli u Shop',
  heroSubtitle: 'Pronađite najbolje proizvode po najboljim cijenama',
  image: '🛒',
}

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const { heroProducts, loading } = useHeroProducts()

  // Use hero products or fallback to default
  const banners = heroProducts.length > 0 ? heroProducts : [defaultBanner]

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners.length])

  const prev = () => setCurrent((c) => (c - 1 + banners.length) % banners.length)
  const next = () => setCurrent((c) => (c + 1) % banners.length)

  if (loading) {
    return (
      <div className="relative mx-4 mt-4 lg:mx-8 lg:mt-6 rounded-2xl lg:rounded-3xl overflow-hidden bg-gradient-to-r from-primary/20 to-accent/20">
        <div className="h-48 md:h-64 lg:h-80 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="mx-4 mt-4 lg:mx-8 lg:mt-6">
      {/* Banner container */}
      <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden">
        <div className="relative h-52 sm:h-64 md:h-80 lg:h-96">
          {banners.map((banner, index) => {
            // Cijela kartica je klikabilna. Link se postavlja u admin panelu (heroLink);
            // ako nije postavljen, vodi na stranicu proizvoda.
            const heroHref = banner.heroLink?.trim() || (banner.id !== 'default' ? `/product/${banner.slug || banner.id}` : '')
            const cardMedia = banner.image && isImageUrl(banner.image) ? (
              <Image
                src={banner.image}
                alt={banner.name || ''}
                fill
                sizes="(max-width: 640px) 92vw, (max-width: 1280px) 96vw, 1216px"
                priority={index === 0}
                className="object-fill"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary/20 to-accent/20">
                <span className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-lg transition-all duration-500 ${
                  index === current ? 'scale-100 rotate-0' : 'scale-75 rotate-12'
                }`}>{banner.image}</span>
              </div>
            )
            return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                index === current 
                  ? 'opacity-100 scale-100 translate-x-0' 
                  : index < current 
                    ? 'opacity-0 scale-95 -translate-x-8 pointer-events-none' 
                    : 'opacity-0 scale-95 translate-x-8 pointer-events-none'
              }`}
            >
              {/* Kartica sadrži SAMO sliku — bez teksta i bez dugmadi.
                  Slika se razvlači (object-fill) da popuni karticu i nikad se ne reže.
                  Preporučena dimenzija: 1216×384 px (odnos ~3,17:1) — vidi upozorenje u admin panelu. */}
              {heroHref ? (
                <Link href={heroHref} className="absolute inset-0 block" aria-label={banner.name || 'Baner'}>
                  {cardMedia}
                </Link>
              ) : (
                cardMedia
              )}
            </div>
            )
          })}
        </div>
      </div>

      {/* Controls outside the banner */}
      {banners.length > 1 && (
        <div className="flex items-center justify-between mt-3">
          {/* Dots indicator - left side */}
          <div className="flex gap-1.5 lg:gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === current 
                    ? 'bg-primary w-4 sm:w-5 lg:w-6 h-1.5 sm:h-2' 
                    : 'bg-muted/30 hover:bg-muted/50 w-1.5 sm:w-2 h-1.5 sm:h-2'
                }`}
                aria-label={`Idi na slajd ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation arrows - right side */}
          <div className="flex gap-1.5">
            <button
              onClick={prev}
              className="p-1.5 sm:p-2 bg-surface hover:bg-white/10 rounded-full transition-all border border-white/10"
              aria-label="Prethodna"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-muted" />
            </button>
            <button
              onClick={next}
              className="p-1.5 sm:p-2 bg-surface hover:bg-white/10 rounded-full transition-all border border-white/10"
              aria-label="Sljedeća"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
