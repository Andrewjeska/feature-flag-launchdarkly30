import type { ReactNode } from 'react'
import { Layout, getMetadata } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export const metadata = getMetadata({
  title: 'vercel-example',
  description: 'A minimal Next.js example on Vercel',
})
export const runtime = 'edge'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout path="edge-middleware/vercel-example">{children}</Layout>
      </body>
    </html>
  )
}
