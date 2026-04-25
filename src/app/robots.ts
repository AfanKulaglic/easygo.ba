import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/migrate', '/api/'],
      },
    ],
    sitemap: 'https://easygo.ba/sitemap.xml',
  }
}
