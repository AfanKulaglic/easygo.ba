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
}

/**
 * Reklamni baner na početnoj strani.
 * Prikazuje ISKLJUČIVO sliku — bez naslova, teksta i dugmadi.
 * Slika se razvlači (object-fill) da popuni karticu i nikada se ne reže.
 * Preporučena dimenzija: 1216×208 px (odnos ~5,85:1) — vidi upozorenje u admin panelu.
 */
export default function PromoBanner({ image, link, alt = 'Reklamni baner' }: PromoBannerProps) {
  // Bez ispravne slike baner se ne prikazuje.
  if (!isImageUrl(image)) return null

  const media = (
    <Image
      src={image}
      alt={alt}
      fill
      sizes="(max-width: 640px) 92vw, (max-width: 1280px) 96vw, 1216px"
      className="object-fill"
    />
  )

  const cardClass =
    'relative block w-full h-40 md:h-48 lg:h-52 rounded-2xl lg:rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20'

  const href = link?.trim()

  return (
    <section className="px-4 py-4 lg:px-0 lg:py-0">
      {href ? (
        <Link href={href} className={cardClass} aria-label={alt}>
          {media}
        </Link>
      ) : (
        <div className={cardClass}>{media}</div>
      )}
    </section>
  )
}
