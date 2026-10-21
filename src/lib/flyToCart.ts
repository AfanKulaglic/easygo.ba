'use client'

const TARGET_SELECTOR = '[data-cart-target]'
const FLY_DURATION = 700

const isImageUrl = (value?: string) =>
  !!value && (value.startsWith('http') || value.startsWith('/') || value.startsWith('data:'))

function getVisibleCartTarget(): HTMLElement | null {
  const targets = Array.from(document.querySelectorAll<HTMLElement>(TARGET_SELECTOR))
  return targets.find(el => {
    const rect = el.getBoundingClientRect()
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      rect.bottom > 0 &&
      rect.top < window.innerHeight
    )
  }) ?? null
}

function bumpCartBadge(target: HTMLElement) {
  target.classList.remove('cart-bump')
  void target.offsetWidth
  target.classList.add('cart-bump')
  window.setTimeout(() => target.classList.remove('cart-bump'), 500)
}

/**
 * Animira mali "let" od izvornog dugmeta do ikone korpe u headeru.
 * Ako nema vidljive ikone korpe ili je korisnik isključio animacije, samo
 * se kratko "bumpuje" ikona korpe.
 */
export function flyToCart(source?: HTMLElement | null, image?: string) {
  if (typeof window === 'undefined') return

  const target = getVisibleCartTarget()
  if (!target) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const startRect = source?.getBoundingClientRect()
  if (reduceMotion || !startRect) {
    bumpCartBadge(target)
    return
  }

  const endRect = target.getBoundingClientRect()
  const size = 40
  const startX = startRect.left + startRect.width / 2
  const startY = startRect.top + startRect.height / 2
  const endX = endRect.left + endRect.width / 2
  const endY = endRect.top + endRect.height / 2

  const flyer = document.createElement('div')
  flyer.setAttribute('aria-hidden', 'true')
  flyer.style.cssText = [
    'position:fixed',
    `left:${startX - size / 2}px`,
    `top:${startY - size / 2}px`,
    `width:${size}px`,
    `height:${size}px`,
    'border-radius:12px',
    'overflow:hidden',
    'z-index:9999',
    'pointer-events:none',
    'background:#ffffff',
    'box-shadow:0 10px 25px rgba(0,0,0,0.28)',
    'will-change:transform,opacity',
  ].join(';')

  if (isImageUrl(image)) {
    const img = document.createElement('img')
    img.src = image!
    img.alt = ''
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;'
    flyer.appendChild(img)
  } else {
    flyer.textContent = image || '🛒'
    flyer.style.display = 'flex'
    flyer.style.alignItems = 'center'
    flyer.style.justifyContent = 'center'
    flyer.style.fontSize = '22px'
  }

  document.body.appendChild(flyer)

  const midX = (startX + endX) / 2
  const midY = Math.min(startY, endY) - 120

  const animation = flyer.animate(
    [
      { transform: 'translate(0, 0) scale(1)', opacity: 1, offset: 0 },
      {
        transform: `translate(${midX - startX}px, ${midY - startY}px) scale(0.85)`,
        opacity: 1,
        offset: 0.45,
      },
      {
        transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0.22)`,
        opacity: 0.35,
        offset: 1,
      },
    ],
    { duration: FLY_DURATION, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)', fill: 'forwards' }
  )

  const cleanup = () => {
    flyer.remove()
    bumpCartBadge(target)
  }

  animation.onfinish = cleanup
  window.setTimeout(() => {
    if (flyer.isConnected) cleanup()
  }, FLY_DURATION + 250)
}
