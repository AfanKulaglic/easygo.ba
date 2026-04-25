import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Korpa',
  description: 'Vaša korpa na EasyGo online shopu. Pregledajte proizvode i nastavite sa narudžbom.',
  robots: { index: false, follow: true },
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children
}
