import { Text, Page } from '@vercel/examples-ui'

export const metadata = {
  title: 'Vercel example',
  description: 'A minimal Next.js example on Vercel.',
}

export default function Home() {
  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">Next.js on Vercel</Text>
        <Text>A minimal example page.</Text>
      </section>
    </Page>
  )
}
