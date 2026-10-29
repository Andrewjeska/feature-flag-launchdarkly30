import { Text, Page, Link } from '@vercel/examples-ui'
import { type LDClient, init } from '@launchdarkly/vercel-server-sdk'
import { createClient } from '@vercel/edge-config'
import { cache } from 'react'

export const metadata = {
  title: 'Vercel x LaunchDarkly example',
  description:
    'An example showing how to use LaunchDarkly and Vercel. This example builds on top of the LaunchDarkly integration which syncs LaunchDarkly flags into Edge Config, so you can read them from your application near-instantly.',
}

export const dynamic = 'force-dynamic'

const getLdClient = cache(async (): Promise<LDClient> => {
  const edgeConfigClient = createClient(process.env.EXPERIMENTATION_CONFIG)
  const ldClient = init(
    process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_SIDE_ID!,
    edgeConfigClient
  )
  await ldClient.waitForInitialization()
  return ldClient
})

export default async function Home() {
  const before = Date.now()

  const ldClient = await getLdClient()

  const ldContext = {
    kind: 'org',
    key: 'my-org-key',
    someAttribute: 'my-attribute-value',
  }
  const flagValue = await ldClient.variation('my-flag', ldContext, true)
  const duration = Date.now() - before

  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">feature-flag-launchdarkly usage example</Text>
        <Text>
          This example shows how to use the{' '}
          <Link
            href="https://vercel.com/marketplace/launchdarkly"
            target="_blank"
          >
            LaunchDarkly integration
          </Link>{' '}
          with Edge Config.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">Feature Flag</Text>
        <p>
          Flag is <span className="font-bold">{flagValue ? 'on' : 'off'}</span>.{' '}
          Loading flag took&nbsp;
          <code>{duration === 0 ? `<1` : duration}ms</code>.
        </p>
        <Text>
          The feature flag above is loaded from Edge Config. The LaunchDarkly
          integration syncs all LaunchDarkly flags into Edge Config so they can
          be read from your application near-instantly.
        </Text>
        <Text>
          Read more about this in our{' '}
          <Link
            href="https://vercel.com/blog/edge-config-and-launch-darkly"
            target="_blank"
          >
            announcement
          </Link>
          .
        </Text>
      </section>
    </Page>
  )
}
