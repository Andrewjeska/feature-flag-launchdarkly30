import { Text, Page } from '@vercel/examples-ui'
import { createClient } from '@vercel/edge-config'
import { init } from '@launchdarkly/vercel-server-sdk'

export const metadata = {
  title: 'Vercel example',
  description: 'A minimal Next.js example on Vercel.',
}
export const runtime = 'edge'

const NEW_SEARCH_FLAG_KEY = 'ld-example-release-new-search'

// Evaluates the flag and logs the result. Always resolves to the control
// value (false) when configuration is missing or evaluation fails.
async function evaluateNewSearchFlag(): Promise<boolean> {
  const clientSideId = process.env.LD_CLIENT_SIDE_ID
  const edgeConfigConnection = process.env.EDGE_CONFIG
  if (!clientSideId || !edgeConfigConnection) {
    console.log(
      `[LaunchDarkly] ${NEW_SEARCH_FLAG_KEY}: not configured, using control (false)`
    )
    return false
  }

  try {
    const ldClient = init(clientSideId, createClient(edgeConfigConnection))
    await ldClient.waitForInitialization()
    const value = await ldClient.variation(
      NEW_SEARCH_FLAG_KEY,
      { kind: 'user', key: 'anonymous', anonymous: true },
      false
    )
    const enabled = value === true
    console.log(`[LaunchDarkly] ${NEW_SEARCH_FLAG_KEY}: ${enabled}`)
    return enabled
  } catch (error) {
    console.error(
      `[LaunchDarkly] ${NEW_SEARCH_FLAG_KEY}: evaluation failed, using control (false)`,
      error
    )
    return false
  }
}

export default async function Home() {
  // Treatment has no new behavior yet; the result is only logged.
  await evaluateNewSearchFlag()

  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">Next.js on Vercel</Text>
        <Text>A minimal example page.</Text>
      </section>
    </Page>
  )
}
