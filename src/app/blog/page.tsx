import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft, Newspaper, Tag, Wrench } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog | ELESONIC',
  description: 'Najnovije vijesti, kampanje i savjeti iz ELESONIC prodavnice.',
  alternates: { canonical: 'https://easygo.ba/blog' },
}

const posts = [
  {
    icon: Tag,
    title: 'Kako iskoristiti kampanje i uštedjeti',
    excerpt: 'Pratite naše kampanje i akcije kako ne biste propustili najbolje cijene u našoj prodavnici.',
    href: '/products?filter=sale',
  },
  {
    icon: Newspaper,
    title: 'Novi proizvodi u ponudi',
    excerpt: 'Redovno proširujemo asortiman — pogledajte šta je novo u ELESONIC prodavnici.',
    href: '/products?filter=new',
  },
  {
    icon: Wrench,
    title: 'Savjeti za održavanje uređaja',
    excerpt: 'Kako produžiti životni vijek vaših uređaja — praktični savjeti našeg tima.',
    href: '/usluge',
  },
]

export default function BlogPage() {
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
            <h1 className="text-xl lg:text-2xl font-bold text-text">Blog</h1>
            <p className="text-xs text-muted">Vijesti i savjeti iz ELESONIC</p>
          </div>
        </div>

        <div className="space-y-4">
          {posts.map(({ icon: Icon, title, excerpt, href }) => (
            <Link
              key={title}
              href={href}
              className="block bg-surface rounded-2xl p-5 border border-white/5 hover:border-primary/20 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-text mb-1">{title}</h2>
                  <p className="text-sm text-muted leading-relaxed">{excerpt}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
