'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ShoppingBag, FileText, Phone, Mail, MapPin, Clock, Send, ArrowUp,
  Facebook, Instagram, Youtube, Banknote,
} from 'lucide-react'
import { useCategories } from '@/hooks/useProducts'
import { COMPANY } from '@/lib/company'

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

function VisaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 7.9 24 8.2" fill="currentColor" className={className} aria-hidden="true">
      <path d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z" />
    </svg>
  )
}

function MastercardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 4.5 24 15" fill="currentColor" className={className} aria-hidden="true">
      <path d="M11.343 18.031c.058.049.12.098.181.146-1.177.783-2.59 1.238-4.107 1.238C3.32 19.416 0 16.096 0 12c0-4.095 3.32-7.416 7.416-7.416 1.518 0 2.931.456 4.105 1.238-.06.051-.12.098-.165.15C9.6 7.489 8.595 9.688 8.595 12c0 2.311 1.001 4.51 2.748 6.031zm5.241-13.447c-1.52 0-2.931.456-4.105 1.238.06.051.12.098.165.15C14.4 7.489 15.405 9.688 15.405 12c0 2.31-1.001 4.507-2.748 6.031-.058.049-.12.098-.181.146 1.177.783 2.588 1.238 4.107 1.238C20.68 19.416 24 16.096 24 12c0-4.094-3.32-7.416-7.416-7.416zM12 6.174c-.096.075-.189.15-.28.231C10.156 7.764 9.169 9.765 9.169 12c0 2.236.987 4.236 2.551 5.595.09.08.185.158.28.232.096-.074.189-.152.28-.232 1.563-1.359 2.551-3.359 2.551-5.595 0-2.235-.987-4.236-2.551-5.595-.09-.08-.184-.156-.28-.231z" />
    </svg>
  )
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  )
}

function GooglePayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 7.1 24 9.6" fill="currentColor" className={className} aria-hidden="true">
      <path d="M3.963 7.235A3.963 3.963 0 00.422 9.419a3.963 3.963 0 000 3.559 3.963 3.963 0 003.541 2.184c1.07 0 1.97-.352 2.627-.957.748-.69 1.18-1.71 1.18-2.916a4.722 4.722 0 00-.07-.806H3.964v1.526h2.14a1.835 1.835 0 01-.79 1.205c-.356.241-.814.379-1.35.379-1.034 0-1.911-.697-2.225-1.636a2.375 2.375 0 010-1.517c.314-.94 1.191-1.636 2.225-1.636a2.152 2.152 0 011.52.594l1.132-1.13a3.808 3.808 0 00-2.652-1.033zm6.501.55v6.9h.886V11.89h1.465c.603 0 1.11-.196 1.522-.588a1.911 1.911 0 00.635-1.464 1.92 1.92 0 00-.635-1.456 2.125 2.125 0 00-1.522-.598zm2.427.85a1.156 1.156 0 01.823.365 1.176 1.176 0 010 1.686 1.171 1.171 0 01-.877.357H11.35V8.635h1.487a1.156 1.156 0 01.054 0zm4.124 1.175c-.842 0-1.477.308-1.907.925l.781.491c.288-.417.68-.626 1.175-.626a1.255 1.255 0 01.856.323 1.009 1.009 0 01.366.785v.202c-.34-.193-.774-.289-1.3-.289-.617 0-1.11.145-1.479.434-.37.288-.554.677-.554 1.165a1.476 1.476 0 00.525 1.156c.35.308.785.463 1.305.463.61 0 1.098-.27 1.465-.81h.038v.655h.848v-2.909c0-.61-.19-1.09-.568-1.44-.38-.35-.896-.525-1.551-.525zm2.263.154l1.946 4.422-1.098 2.38h.915L24 9.963h-.965l-1.368 3.391h-.02l-1.406-3.39zm-2.146 2.368c.494 0 .88.11 1.156.33 0 .372-.147.696-.44.973a1.413 1.413 0 01-.997.414 1.081 1.081 0 01-.69-.232.708.708 0 01-.293-.578c0-.257.12-.47.363-.647.24-.173.54-.26.9-.26Z" />
    </svg>
  )
}

const FALLBACK_CATEGORIES = [
  { name: 'Wifi Kamere', slug: 'wifi-kamere' },
  { name: 'Noćni binokulari', slug: 'nocni-binokulari' },
  { name: 'Projektori', slug: 'projektori' },
  { name: 'Smart Home', slug: 'smart-home' },
  { name: 'Gadgeti', slug: 'gadgeti' },
]

const USEFUL_LINKS = [
  { name: 'Dostava i plaćanje', href: '/dostava' },
  { name: 'Reklamacije i povrat', href: '/reklamacije' },
  { name: 'Uslovi korištenja', href: '/terms' },
  { name: 'Politika privatnosti', href: '/privacy' },
  { name: 'Česta pitanja (FAQ)', href: '/contact' },
  { name: 'Kontakt', href: '/contact' },
]

const SOCIALS = [
  { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61569683799611', Icon: Facebook },
  { name: 'Instagram', href: 'https://www.instagram.com/easygo.bih/', Icon: Instagram },
  { name: 'YouTube', href: 'https://www.youtube.com/@easygo-reviews', Icon: Youtube },
  { name: 'TikTok', href: '#', Icon: TikTokIcon },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { categories } = useCategories()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const categoryLinks = (categories && categories.length > 0 ? categories : FALLBACK_CATEGORIES)
    .slice(0, 5)
    .map(c => ({ name: c.name, href: `/products/category/${c.slug}` }))

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) return
    try { localStorage.setItem('elesonic_newsletter', email) } catch {}
    setSubscribed(true)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#0A192F] text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-12 lg:pt-16 pb-24 lg:pb-8">
        {/* Main columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1.25fr] gap-10">

          {/* Logo & Opis */}
          <div>
            <Link href="/" className="inline-flex flex-col items-start gap-3">
              <img
                src="/assets/images/elesonic-logo.png"
                alt="ELESONIC"
                className="h-8 w-auto object-contain"
              />
              <span className="text-sm font-semibold text-white">{COMPANY.name}</span>
            </Link>
            <div className="mt-4 max-w-xs">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white mb-1.5">
                Podaci o društvu
              </p>
              <p className="text-xs leading-relaxed text-slate-200">
                Sjedište firme: {COMPANY.address}
                <br />
                JIB: {COMPANY.jib}
                <br />
                Registarski broj: MBS: {COMPANY.mbs}
              </p>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed mt-3 max-w-xs">
              Pametna rješenja za sigurniji i udobniji dom.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {SOCIALS.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={name}
                  className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.15)] hover:bg-[rgba(59,130,246,0.45)] hover:border-[rgba(59,130,246,0.6)] flex items-center justify-center text-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Kupovina – kategorije */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold text-white uppercase tracking-wider mb-5">
              <ShoppingBag className="w-4 h-4 text-orange-400" />
              Kupovina
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/products" className="text-sm text-slate-300 hover:text-orange-300 transition-colors">
                  Sve kategorije
                </Link>
              </li>
              {categoryLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-300 hover:text-orange-300 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" className="text-sm text-slate-300 hover:text-orange-300 transition-colors">
                  Pomoć oko naručivanja
                </Link>
              </li>
            </ul>
          </div>

          {/* Korisni linkovi */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold text-white uppercase tracking-wider mb-5">
              <FileText className="w-4 h-4 text-orange-400" />
              Korisni linkovi
            </h4>
            <ul className="space-y-2.5">
              {USEFUL_LINKS.map(link => (
                <li key={link.href + link.name}>
                  <Link href={link.href} className="text-sm text-slate-300 hover:text-orange-300 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold text-white uppercase tracking-wider mb-5">
              <Phone className="w-4 h-4 text-orange-400" />
              Kontakt
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <a href="tel:+387671235249" className="flex items-center gap-2.5 text-slate-200 hover:text-orange-300 transition-colors font-medium">
                  <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                  +387 67 123 5249
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-slate-300">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  Pon – Pet: 08:00 – 16:00
                  <br />
                  <span className="text-slate-400">Vikendom ne radimo</span>
                </span>
              </li>
              <li>
                <a href="mailto:info@elesonic.ba" className="flex items-center gap-2.5 text-slate-200 hover:text-orange-300 transition-colors">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  info@elesonic.ba
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                Sarajevo, BiH — Online prodavnica
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row: newsletter + socijalne / plaćanja / legal + povratak na vrh */}
        <div className="mt-12 pt-8 border-t border-[rgba(255,255,255,0.12)] flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-6 lg:justify-between">
          {/* Newsletter */}
          <div className="w-full lg:w-auto">
            <p className="text-sm font-semibold text-white mb-3">Pretplatite se na novosti</p>
            {subscribed ? (
              <p className="text-sm text-emerald-400">Hvala! Uspješno ste se pretplatili.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full sm:w-80">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Unesite svoj email"
                  className="flex-1 min-w-0 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.15)] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
                />
                <button
                  type="submit"
                  aria-label="Pretplati se"
                  className="w-10 h-10 shrink-0 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-blue-400 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Načini plaćanja */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-md border border-white/15 px-2.5 py-1.5 text-[11px] font-semibold text-white">
              <Banknote className="w-3.5 h-3.5" />
              Pouzećem
            </span>
            <span aria-label="Visa" className="flex items-center rounded-md border border-white/15 px-2.5 py-1.5">
              <VisaIcon className="h-3 w-auto text-white" />
            </span>
            <span aria-label="Mastercard" className="flex items-center rounded-md border border-white/15 px-2.5 py-1.5">
              <MastercardIcon className="h-3.5 w-auto text-white" />
            </span>
            <span aria-label="Apple Pay" className="flex items-center gap-1 rounded-md border border-white/15 px-2.5 py-1.5">
              <AppleIcon className="h-3.5 w-auto text-white" />
              <span className="text-[11px] font-semibold text-white">Pay</span>
            </span>
            <span aria-label="Google Pay" className="flex items-center rounded-md border border-white/15 px-2.5 py-1.5">
              <GooglePayIcon className="h-3.5 w-auto text-white" />
            </span>
          </div>

          {/* Legal + povratak na vrh */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <Link href="/terms" className="hover:text-orange-300 transition-colors">Uslovi</Link>
              <span className="text-slate-500">|</span>
              <Link href="/privacy" className="hover:text-orange-300 transition-colors">Privatnost</Link>
              <span className="text-slate-500">|</span>
              <Link href="/privacy" className="hover:text-orange-300 transition-colors">Kolačići</Link>
            </div>
            <button
              onClick={scrollToTop}
              aria-label="Povratak na vrh"
              className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-slate-200 hover:bg-primary hover:border-primary transition-colors shrink-0"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-10 text-xs text-slate-400 text-center lg:text-left">
          © {currentYear} Elesonic Elektronika d.o.o. Sva prava zadržana.
        </p>
      </div>
    </footer>
  )
}
