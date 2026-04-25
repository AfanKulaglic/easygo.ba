import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chat podrška',
  description: 'Razgovarajte sa EasyGo timom u realnom vremenu. Brza pomoć za sva vaša pitanja.',
  robots: { index: false, follow: true },
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return children
}
