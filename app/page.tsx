import { Text, Page } from '@vercel/examples-ui'
import { evaluateBooleanFlag } from '../lib/launchdarkly'

const FLAG_KEY = 'ld-example-kill-switch-third-party-chat'

// Render per request so the flag is evaluated live, not once at build time.
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Vercel example',
  description: 'A minimal Next.js example on Vercel.',
}

export default async function Home() {
  // Evaluate and print the flag only; rendering is identical for both variations.
  // Falls back to `false` (control) when the flag is off or evaluation fails.
  const flagValue = await evaluateBooleanFlag(FLAG_KEY, false)
  console.log(`[launchdarkly] ${FLAG_KEY} = ${flagValue}`)

  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">Next.js on Vercel</Text>
        <Text>A minimal example page.</Text>
      </section>
    </Page>
  )
}
