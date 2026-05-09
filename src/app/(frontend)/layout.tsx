import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CyberNexa Platform',
  description: 'Internal resource management platform',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
