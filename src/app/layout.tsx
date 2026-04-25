import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import { DataCacheProvider } from '@/context/DataCacheContext'
import { GlobalLoader } from '@/components/GlobalLoader'
import { IframeSync } from '@/components/IframeSync'
import { CartSync } from '@/components/CartSync'
import LazyCookieConsent from '@/components/LazyCookieConsent'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://easygo.ba'),
  title: {
    default: 'EasyGo - Online Shop | Kupovina iz BiH',
    template: '%s | EasyGo'
  },
  description: 'EasyGo - Vaša pouzdana online prodavnica u Bosni i Hercegovini. Kvalitetni proizvodi po najboljim cijenama sa brzom dostavom širom BiH. Elektronika, moda, kućanski aparati i više.',
  keywords: ['online shop', 'online prodavnica', 'kupovina online', 'BiH', 'Bosna i Hercegovina', 'easygo', 'brza dostava', 'elektronika', 'povoljne cijene', 'web shop BiH'],
  authors: [{ name: 'EasyGo' }],
  creator: 'EasyGo',
  publisher: 'EasyGo',
  icons: {
    icon: '/assets/images/logo.png',
    apple: '/assets/images/logo.png',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://easygo.ba',
  },
  openGraph: {
    type: 'website',
    locale: 'bs_BA',
    url: 'https://easygo.ba',
    title: 'EasyGo - Online Shop | Kupovina iz BiH',
    description: 'Vaša pouzdana online prodavnica u Bosni i Hercegovini. Kvalitetni proizvodi, brza dostava širom BiH.',
    siteName: 'EasyGo',
    images: [{
      url: '/assets/images/logo.png',
      width: 512,
      height: 512,
      alt: 'EasyGo Logo',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EasyGo - Online Shop | Kupovina iz BiH',
    description: 'Vaša pouzdana online prodavnica u Bosni i Hercegovini.',
    images: ['/assets/images/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: 'your-verification-code',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bs" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://easygo-a9fd0-default-rtdb.firebaseio.com" />
        <link rel="preconnect" href="https://easygo-a9fd0-default-rtdb.firebaseio.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'EasyGo',
              url: 'https://easygo.ba',
              logo: 'https://easygo.ba/assets/images/logo.png',
              description: 'Online prodavnica u Bosni i Hercegovini sa brzom dostavom širom BiH.',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'BA',
              },
              sameAs: [],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'EasyGo',
              url: 'https://easygo.ba',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://easygo.ba/products?search={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <noscript>
          <img height="1" width="1" style={{display:'none'}}
            src="https://www.facebook.com/tr?id=1648753932817443&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body className={`${inter.className} bg-background text-text min-h-screen flex flex-col antialiased`} suppressHydrationWarning>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1648753932817443');
            fbq('track', 'PageView');
          `}
        </Script>
        <ThemeProvider>
          <AuthProvider>
          <DataCacheProvider>
            <GlobalLoader>
              <CartSync />
              <IframeSync />
              <Header />
              <main className="pt-16 lg:pt-20 pb-8 flex-1">
                  {children}
              </main>
              <Footer />
              <LazyCookieConsent />
            </GlobalLoader>
          </DataCacheProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
