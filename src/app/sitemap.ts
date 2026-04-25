import { MetadataRoute } from 'next'
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://easygo.ba'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/o-nama`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/dostava`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/garancija`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/reklamacije`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/tracking`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.4,
    },
  ]

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = []
  try {
    const db = getDb()
    const productsRef = ref(db, 'products')
    const snapshot = await get(productsRef)
    if (snapshot.exists()) {
      const data = snapshot.val()
      productPages = Object.entries(data).map(([id, product]: [string, any]) => ({
        url: `${baseUrl}/product/${product.slug || id}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    }
  } catch (e) {
    // If Firebase fails, return static pages only
  }

  // Dynamic category pages
  let categoryPages: MetadataRoute.Sitemap = []
  try {
    const db = getDb()
    const categoriesRef = ref(db, 'categories')
    const snapshot = await get(categoriesRef)
    if (snapshot.exists()) {
      const data = snapshot.val()
      categoryPages = Object.values(data).map((cat: any) => ({
        url: `${baseUrl}/products/category/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      }))
    }
  } catch (e) {
    // If Firebase fails, skip category pages
  }

  return [...staticPages, ...productPages, ...categoryPages]
}
