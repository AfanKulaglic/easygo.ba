'use client'

import Link from 'next/link'
import Image from 'next/image'

const isImageUrl = (str?: string) => !!str && (str.startsWith('http') || str.startsWith('/') || str.startsWith('data:'))

interface PromoBannerProps {
  /** URL slike banera (obavezno). */
  image: string
  /** Ako je prazno, baner nije klikabilan — link je potpuno isključen. */
  link?: string
  alt?: string
  /** Aspect ratio klase (npr. aspect-[2/1]). */
  className?: string
  /** Next/Image sizes atribut. */
  sizes?: string
}

/**
 * Reklamni baner na početnoj strani.
 * Prikazuje ISKLJUČIVO sliku — bez naslova, teksta i dugmadi.
 * Kada su dva banera aktivna, prikazuju se jedan pored drugog (50/50).
 * Preporučena dimenzija za dva banera: 1200×600 px (odnos 2:1) po baneru.
 */
export default function PromoBanner({
  image,
  link,
  alt = 'Reklamni baner',
  className = 'aspect-[2/1]',
  sizes = '(max-width: 640px) 92vw, 600px',
}: PromoBannerProps) {
  // Bez ispravne slike baner se ne prikazuje.
  if (!isImageUrl(image)) return null

  const media = (
    <Image
      src={image}
      alt={alt}
      fill
      sizes={sizes}
      className="object-cover"
    />
  )

  const cardClass = `relative block w-full ${className} rounded-2xl lg:rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20`

  const href = link?.trim()

  return href ? (
    <Link href={href} className={cardClass} aria-label={alt}>
      {media}
    </Link>
  ) : (
    <div className={cardClass}>{media}</div>
  )
}
