import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft, ShoppingBag, Package, Headphones, Truck } from 'lucide-react'
import CompanyInfo from '@/components/CompanyInfo'

export const metadata: Metadata = {
  title: 'Usluge | ELESONIC',
  description: 'Usluge ELESONIC prodavnice - posebne narudžbe, dostava i tehnička podrška.',
  alternates: { canonical: 'https://easygo.ba/usluge' },
}

const services = [
  {
    icon: Package,
    title: 'Posebne narudžbe',
    description: 'Proizvodi koji nisu u standardnoj ponudi? Provjeravamo dostupnost i naručujemo uz precizno određen rok isporuke.',
  },
  {
    icon: Truck,
    title: 'Dostava',
    description: 'Brza i pouzdana dostava širom BiH. Besplatna dostava za narudžbe iznad određenog iznosa.',
  },
  {
    icon: Headphones,
    title: 'Tehnička podrška',
    description: 'Naš tim stručnjaka je tu da odgovori na sva pitanja i pomogne vam da odaberete pravi proizvod.',
  },
]

export default function UslugePage() {
  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="max-w-3xl mx-auto px-4 py-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/"
            className="w-10 h-10 rounded-xl bg-surface border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-muted" />
          </Link>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-text">Usluge</h1>
            <p className="text-xs text-muted">Šta vam ELESONIC nudi</p>
          </div>
        </div>

        <div className="space-y-6">

          {/* Hero */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 lg:p-8 border border-primary/20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-text mb-3">Usluge ELESONIC prodavnice</h2>
            <p className="text-sm text-muted leading-relaxed max-w-lg mx-auto">
              Uz prodaju uređaja nudimo posebne narudžbe, dostavu i tehničku podršku za sve vaše potrebe.
            </p>
          </div>

          {/* Services */}
          {services.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-surface rounded-2xl p-5 lg:p-6 border border-white/5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-text mb-1">{title}</h2>
                  <p className="text-sm text-muted leading-relaxed">{description}</p>
                </div>
              </div>
            </div>
          ))}

          <CompanyInfo />

          {/* CTA */}
          <div className="bg-surface rounded-2xl p-5 lg:p-6 border border-white/5 text-center">
            <p className="text-sm text-muted mb-4">Imate pitanje o našim uslugama?</p>
            <Link
              href="/contact"
              className="inline-block px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Kontaktirajte nas
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
