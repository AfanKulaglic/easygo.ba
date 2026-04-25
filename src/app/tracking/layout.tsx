import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Praćenje narudžbi',
  description: 'Pratite status vaše narudžbe na EasyGo online shopu. Unesite broj narudžbe i provjerite gdje se vaš paket nalazi.',
  alternates: { canonical: 'https://easygo.ba/tracking' },
}

export default function TrackingLayout({ children }: { children: React.ReactNode }) {
  return children
}
