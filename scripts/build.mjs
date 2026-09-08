import { execFileSync } from 'node:child_process'

const run = (command, args) =>
  execFileSync(command, args, {
    stdio: 'inherit',
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' }
  })

const clientId =
  process.env.NEXT_PUBLIC_TINA_CLIENT_ID ||
  process.env.TINA_PUBLIC_CLIENT_ID ||
  process.env.TINA_CLIENT_ID
const token = process.env.TINA_TOKEN
const tinaReady = Boolean(clientId && token)
const isNetlify = process.env.NETLIFY === 'true' || Boolean(process.env.CONTEXT)

if (tinaReady) {
  console.log('Building TinaCMS admin with TinaCloud credentials...')
  run('npx', ['tinacms', 'build'])
} else if (isNetlify) {
  console.warn(
    '\n========================================================================\n' +
    'WARNING: TinaCloud credentials (NEXT_PUBLIC_TINA_CLIENT_ID & TINA_TOKEN)\n' +
    'are not set in Netlify. Skipping production TinaCMS admin generation.\n' +
    'Set them in Netlify Site Configuration -> Environment Variables.\n' +
    '========================================================================\n'
  )
} else {
  console.log('Building site with Astro (local dev/preview mode)...')
}

run('npx', ['astro', 'build'])

