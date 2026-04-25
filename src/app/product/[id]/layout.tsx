import type { Metadata } from 'next'
import { ref, get } from 'firebase/database'
import { initializeApp, getApps } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyB6gdI1mHkrLlh6bBrDkoSTVQejCWPbry0',
  authDomain: 'easygo-a9fd0.firebaseapp.com',
  databaseURL: 'https://easygo-a9fd0-default-rtdb.firebaseio.com',
  projectId: 'easygo-a9fd0',
  storageBucket: 'easygo-a9fd0.firebasestorage.app',
  messagingSenderId: '630977237034',
  appId: '1:630977237034:web:9d8c0a57eb9bd95679f353',
}

function getDb() {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  return getDatabase(app)
}

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params

  try {
    const db = getDb()

    // Try to find by slug first
    const productsRef = ref(db, 'products')
    const snapshot = await get(productsRef)

    if (snapshot.exists()) {
      const data = snapshot.val()
      let product: any = null

      // Search by slug
      for (const [productId, p] of Object.entries(data) as [string, any][]) {
        if (p.slug === id || productId === id) {
          product = { ...p, id: productId }
          break
        }
      }

      if (product) {
        const title = product.name
        const description = product.description
          ? product.description.substring(0, 160).replace(/<[^>]*>/g, '')
          : `Kupite ${product.name} po najboljoj cijeni na EasyGo.ba`
        const price = product.price

        return {
          title,
          description,
          alternates: {
            canonical: `https://easygo.ba/product/${product.slug || product.id}`,
          },
          openGraph: {
            title: `${product.name} | EasyGo`,
            description,
            url: `https://easygo.ba/product/${product.slug || product.id}`,
            images: product.image ? [{ url: product.image, alt: product.name }] : [],
            type: 'website',
          },
          other: {
            'product:price:amount': String(price),
            'product:price:currency': 'BAM',
          },
        }
      }
    }
  } catch (e) {
    // Fall back to generic metadata
  }

  return {
    title: 'Proizvod',
    description: 'Pogledajte detalje proizvoda na EasyGo online shopu.',
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children
}
