// Server-side only: imported from React Server Components.
import { init, type LDClient } from '@launchdarkly/node-server-sdk'

// Reuse a single client across requests (and across HMR reloads in dev).
const globalForLD = globalThis as unknown as { ldClient?: Promise<LDClient | null> }

function getClient(): Promise<LDClient | null> {
  if (!globalForLD.ldClient) {
    globalForLD.ldClient = (async () => {
      const sdkKey = process.env.LAUNCHDARKLY_SDK_KEY
      if (!sdkKey) return null
      try {
        const client = init(sdkKey)
        await client.waitForInitialization({ timeout: 5 })
        return client
      } catch (err) {
        console.error('[launchdarkly] client initialization failed', err)
        return null
      }
    })()
  }
  return globalForLD.ldClient
}

/**
 * Evaluates a boolean flag. Returns `defaultValue` when the SDK key is
 * missing, the client fails to initialize, or evaluation throws.
 */
export async function evaluateBooleanFlag(
  flagKey: string,
  defaultValue = false
): Promise<boolean> {
  try {
    const client = await getClient()
    if (!client) return defaultValue
    // Anonymous context: no user data is sent.
    return await client.boolVariation(
      flagKey,
      { kind: 'user', key: 'anonymous', anonymous: true },
      defaultValue
    )
  } catch (err) {
    console.error(`[launchdarkly] evaluation of "${flagKey}" failed`, err)
    return defaultValue
  }
}
