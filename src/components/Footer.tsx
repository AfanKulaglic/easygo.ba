'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ShoppingBag, FileText, Phone, Mail, MapPin, Clock, Send, ArrowUp,
  Facebook, Instagram, Youtube, Apple, Banknote,
} from 'lucide-react'
import { useCategories } from '@/hooks/useProducts'

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

function MastercardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 20" className={className} aria-hidden="true">
      <circle cx="12" cy="10" r="8" fill="#EB001B" />
      <circle cx="20" cy="10" r="8" fill="#F79E1B" />
      <path d="M16 3.6a8 8 0 0 1 0 12.8 8 8 0 0 1 0-12.8z" fill="#FF5F00" />
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
    .map(c => ({ name: c.name, href: `/category/${c.slug}` }))

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
              <span className="bg-white rounded-xl px-3.5 py-2 inline-flex shadow-lg shadow-black/20">
                <img
                  src="/assets/images/elesonic-logo.png"
                  alt="ELESONIC"
                  className="h-8 w-auto object-contain"
                />
              </span>
              <span className="text-sm font-semibold text-slate-200">Elesonic Elektronika d.o.o.</span>
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed mt-3 max-w-xs">
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
                  className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.15)] hover:bg-[rgba(59,130,246,0.45)] hover:border-[rgba(59,130,246,0.6)] flex items-center justify-center text-slate-100 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Kupovina – kategorije */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-100 uppercase tracking-wider mb-5">
              <ShoppingBag className="w-4 h-4 text-orange-400" />
              Kupovina
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/products" className="text-sm text-slate-400 hover:text-orange-300 transition-colors">
                  Sve kategorije
                </Link>
              </li>
              {categoryLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-orange-300 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" className="text-sm text-slate-400 hover:text-orange-300 transition-colors">
                  Pomoć oko naručivanja
                </Link>
              </li>
            </ul>
          </div>

          {/* Korisni linkovi */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-100 uppercase tracking-wider mb-5">
              <FileText className="w-4 h-4 text-orange-400" />
              Korisni linkovi
            </h4>
            <ul className="space-y-2.5">
              {USEFUL_LINKS.map(link => (
                <li key={link.href + link.name}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-orange-300 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-100 uppercase tracking-wider mb-5">
              <Phone className="w-4 h-4 text-orange-400" />
              Kontakt
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <a href="tel:+387671235249" className="flex items-center gap-2.5 text-slate-300 hover:text-orange-300 transition-colors font-medium">
                  <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                  +387 67 123 5249
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-slate-400">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                Pon – Sub: 08:00 – 20:00
              </li>
              <li>
                <a href="mailto:info@elesonic.ba" className="flex items-center gap-2.5 text-slate-300 hover:text-orange-300 transition-colors">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  info@elesonic.ba
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-slate-400">
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
            <p className="text-sm font-semibold text-slate-100 mb-3">Pretplatite se na novosti</p>
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
                  className="flex-1 min-w-0 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.15)] rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-400"
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
            <span className="flex items-center gap-1.5 bg-white rounded-md px-2.5 py-1.5 text-[11px] font-semibold text-slate-700">
              <Banknote className="w-3.5 h-3.5 text-emerald-600" />
              Pouzećem
            </span>
            <span className="bg-white rounded-md px-2.5 py-1.5 text-[11px] font-extrabold italic text-[#1A1F71]">VISA</span>
            <span className="flex items-center gap-1.5 bg-white rounded-md px-2.5 py-1.5">
              <MastercardIcon className="w-6 h-3.5" />
              <span className="text-[11px] font-semibold text-slate-700">mastercard</span>
            </span>
            <span className="flex items-center gap-1 bg-white rounded-md px-2.5 py-1.5 text-[11px] font-semibold text-slate-800">
              <Apple className="w-3.5 h-3.5" />
              Pay
            </span>
            <span className="bg-white rounded-md px-2.5 py-1.5 text-[11px] font-semibold text-slate-700">
              <span className="text-blue-600">G</span> <span className="text-emerald-600">P</span>ay
            </span>
          </div>

          {/* Legal + povratak na vrh */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <Link href="/terms" className="hover:text-orange-300 transition-colors">Uslovi</Link>
              <span className="text-slate-600">|</span>
              <Link href="/privacy" className="hover:text-orange-300 transition-colors">Privatnost</Link>
              <span className="text-slate-600">|</span>
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
        <p className="mt-10 text-xs text-slate-500 text-center lg:text-left">
          © {currentYear} Elesonic Elektronika d.o.o. Sva prava zadržana.
        </p>
      </div>
    </footer>
  )
}
