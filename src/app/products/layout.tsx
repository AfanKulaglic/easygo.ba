import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Svi proizvodi',
  description: 'Pregledajte sve proizvode u EasyGo online shopu. Elektronika, moda, kućanski aparati i više po najboljim cijenama sa dostavom širom BiH.',
  alternates: { canonical: 'https://easygo.ba/products' },
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children
}
