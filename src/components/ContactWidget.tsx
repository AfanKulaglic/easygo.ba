'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type MouseEvent } from 'react'

const PHONE_DISPLAY = '+387 67 123 5247'
const PHONE_DIGITS = '387671235247'
const MESSAGE = 'Zdravo, zanima me vaša ponuda.'
const ENCODED_MESSAGE = encodeURIComponent(MESSAGE)

// WhatsApp: https link radi na Androidu, iPhoneu i desktopu. Na mobilnom ga
// otvaramo u istom tabu jer in-app browseri često blokiraju target="_blank".
const WHATSAPP_URL = `https://api.whatsapp.com/send/?phone=${PHONE_DIGITS}&text=${ENCODED_MESSAGE}`

// Viber prima broj bez plusa. Zakodiran plus (%2B) na nekim iOS/Android
// verzijama ne otvara chat, pa je primarni format sa samim ciframa. `text`
// je best-effort prefill; ako ga Viber ignoriše, poruka je u clipboardu.
const VIBER_URL = `viber://chat?number=${PHONE_DIGITS}&text=${ENCODED_MESSAGE}`
const VIBER_URL_PLUS = `viber://chat?number=%2B${PHONE_DIGITS}&text=${ENCODED_MESSAGE}`
const VIBER_FORWARD_URL = `viber://forward?text=${ENCODED_MESSAGE}`

const VIBER_ANDROID_STORE = 'https://play.google.com/store/apps/details?id=com.viber.voip'
const VIBER_IOS_STORE = 'https://apps.apple.com/app/viber-messenger/id382617920'

const isIosDevice = () =>
  typeof navigator !== 'undefined' &&
  (/iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))

const isMobileDevice = () =>
  typeof navigator !== 'undefined' &&
  (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))

function ViberIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M11.4 0C9.473.028 5.333.344 3.02 2.467 1.302 4.187.696 6.7.633 9.817.57 12.933.488 18.776 6.12 20.36h.003l-.004 2.416s-.037.977.61 1.177c.777.242 1.234-.5 1.98-1.302.407-.44.972-1.084 1.397-1.58 3.85.326 6.812-.416 7.15-.525.776-.252 5.176-.816 5.892-6.657.74-6.02-.36-9.83-2.34-11.546-.596-.55-3.006-2.3-8.375-2.323 0 0-.395-.025-1.037-.017zm.058 1.693c.545-.004.88.017.88.017 4.542.02 6.717 1.388 7.222 1.846 1.675 1.435 2.53 4.868 1.906 9.897v.002c-.604 4.878-4.174 5.184-4.832 5.395-.28.09-2.882.737-6.153.524 0 0-2.436 2.94-3.197 3.704-.12.12-.26.167-.352.144-.13-.033-.166-.188-.165-.414l.02-4.018c-4.762-1.32-4.485-6.292-4.43-8.895.054-2.604.543-4.738 1.996-6.173 1.96-1.773 5.474-2.018 7.11-2.03zm.38 2.602c-.167 0-.303.135-.304.302 0 .167.133.303.3.305 1.624.01 2.946.537 4.028 1.592 1.073 1.046 1.62 2.468 1.633 4.334.002.167.14.3.307.3.166-.002.3-.138.3-.304-.014-1.984-.618-3.596-1.816-4.764-1.19-1.16-2.692-1.753-4.447-1.765zm-3.96.695c-.19-.032-.4.005-.616.117l-.01.002c-.43.247-.816.562-1.146.932-.002.004-.006.004-.008.008-.267.323-.42.638-.46.948-.008.046-.01.093-.007.14 0 .136.022.27.065.4l.013.01c.135.48.473 1.276 1.205 2.604.42.768.903 1.5 1.446 2.186.27.344.56.673.87.984l.132.132c.31.308.64.6.984.87.686.543 1.418 1.027 2.186 1.447 1.328.733 2.126 1.07 2.604 1.206l.01.014c.13.042.265.064.402.063.046.002.092 0 .138-.008.31-.036.627-.19.948-.46.004 0 .003-.002.008-.005.37-.33.683-.72.93-1.148l.003-.01c.225-.432.15-.842-.18-1.12-.004 0-.698-.58-1.037-.83-.36-.255-.73-.492-1.113-.71-.51-.285-1.032-.106-1.248.174l-.447.564c-.23.283-.657.246-.657.246-3.12-.796-3.955-3.955-3.955-3.955s-.037-.426.248-.656l.563-.448c.277-.215.456-.737.17-1.248-.217-.383-.454-.756-.71-1.115-.25-.34-.826-1.033-.83-1.035-.137-.165-.31-.265-.502-.297zm4.49.88c-.158.002-.29.124-.3.282-.01.167.115.312.282.324 1.16.085 2.017.466 2.645 1.15.63.688.93 1.524.906 2.57-.002.168.13.306.3.31.166.003.305-.13.31-.297.025-1.175-.334-2.193-1.067-2.994-.74-.81-1.777-1.253-3.05-1.346h-.024zm.463 1.63c-.16.002-.29.127-.3.287-.008.167.12.31.288.32.523.028.875.175 1.113.422.24.245.388.62.416 1.164.01.167.15.295.318.287.167-.008.295-.15.287-.317-.03-.644-.215-1.178-.58-1.557-.367-.378-.893-.574-1.52-.607h-.018z" />
    </svg>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

export default function ContactWidget() {
  const pathname = usePathname()
  const isProductPage = pathname.startsWith('/product/')
  const stackBottom = isProductPage ? 'bottom-[7.75rem] lg:bottom-16' : 'bottom-16'
  const [showViberHelp, setShowViberHelp] = useState(false)
  const [copied, setCopied] = useState(false)
  const viberTimer = useRef<number | null>(null)

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setShowViberHelp(false)
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      if (viberTimer.current !== null) window.clearTimeout(viberTimer.current)
    }
  }, [])

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(MESSAGE)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  const openViber = (url: string) => {
    setShowViberHelp(false)
    if (viberTimer.current !== null) window.clearTimeout(viberTimer.current)

    viberTimer.current = window.setTimeout(() => {
      if (document.visibilityState === 'visible') setShowViberHelp(true)
    }, 2500)

    window.location.href = url
  }

  const handleWhatsAppClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isMobileDevice()) return

    // Na mobilnom otvaramo u istom tabu. Tako se pouzdanije pokreće
    // WhatsApp aplikacija, posebno iz in-app browsera.
    event.preventDefault()
    window.location.href = WHATSAPP_URL
  }

  const handleViberClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    void copyMessage()
    openViber(VIBER_URL)
  }

  const handleViberRetry = () => {
    void copyMessage()
    openViber(VIBER_URL_PLUS)
  }

  const viberStoreUrl = isIosDevice() ? VIBER_IOS_STORE : VIBER_ANDROID_STORE

  return (
    <>
      <div className={`fixed right-4 z-[9990] flex flex-col items-center gap-3 ${stackBottom}`}>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          aria-label="Pišite nam na WhatsApp"
          className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <WhatsAppIcon className="h-5 w-5" />
          <span className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-surface px-3 py-1.5 text-xs font-medium text-text opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100 lg:block">
            Pišite nam na WhatsApp
          </span>
        </a>

        <a
          href={VIBER_URL}
          onClick={handleViberClick}
          aria-label="Kontaktirajte nas putem Vibera"
          className="contact-viber-pulse group relative flex h-11 w-11 items-center justify-center rounded-full bg-[#7360F2] text-white shadow-lg shadow-black/25 transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <ViberIcon className="h-[19px] w-[19px]" />
          <span className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-surface px-3 py-1.5 text-xs font-medium text-text opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100 lg:block">
            Kontaktirajte nas putem Vibera
          </span>
        </a>
      </div>

      {showViberHelp && (
        <div
          className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="viber-help-title"
        >
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface p-5 text-text shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="viber-help-title" className="text-base font-semibold">
                  Viber chat nije otvoren
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-text/70">
                  Provjeri da je Viber instaliran i ažuriran. Poruka se kopira automatski — ako
                  nije, kopiraj je ispod i nalijepi u chat sa {PHONE_DISPLAY}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowViberHelp(false)}
                aria-label="Zatvori"
                className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg text-text/60 transition hover:bg-white/10 hover:text-text"
              >
                ×
              </button>
            </div>

            <div className="mt-4 grid gap-2">
              <button
                type="button"
                onClick={handleViberRetry}
                className="rounded-xl bg-[#7360F2] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Pokušaj ponovo
              </button>
              <a
                href={viberStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center text-sm font-semibold text-text transition hover:bg-white/10"
              >
                Ažuriraj / preuzmi Viber
              </a>
              <a
                href={VIBER_FORWARD_URL}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center text-sm font-semibold text-text transition hover:bg-white/10"
              >
                Pošalji poruku kroz Viber
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => {
                  setShowViberHelp(false)
                  handleWhatsAppClick(event)
                }}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center text-sm font-semibold text-text transition hover:bg-white/10"
              >
                Piši na WhatsApp
              </a>
              <button
                type="button"
                onClick={() => void copyMessage()}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-text transition hover:bg-white/10"
              >
                {copied ? 'Poruka kopirana' : 'Kopiraj poruku'}
              </button>
            </div>

            <p className="mt-3 text-xs text-text/50">Broj: {PHONE_DISPLAY}</p>
          </div>
        </div>
      )}
    </>
  )
}
