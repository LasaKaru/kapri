import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kapri — AI Shopping Concierge by Kapruka',
  description: 'Chat with Kapri, your AI shopping concierge for Kapruka.lk — Sri Lanka\'s #1 gifting platform.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
