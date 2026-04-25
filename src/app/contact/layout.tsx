import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Kontaktirajte EasyGo tim. Tu smo za sva vaša pitanja o narudžbama, proizvodima i dostavi. Pišite nam ili nazovite.',
  alternates: { canonical: 'https://easygo.ba/contact' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
