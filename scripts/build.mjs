import { execFileSync } from 'node:child_process'

const run = (command, args) => execFileSync(command, args, { stdio: 'inherit' })
const tinaReady = Boolean(process.env.NEXT_PUBLIC_TINA_CLIENT_ID && process.env.TINA_TOKEN)
const isNetlifyBuild = process.env.NETLIFY === 'true' || Boolean(process.env.CONTEXT)

if (tinaReady) {
  run('tinacms', ['build'])
} else if (isNetlifyBuild) {
  throw new Error('TinaCMS is not configured for this Netlify build. Set NEXT_PUBLIC_TINA_CLIENT_ID and TINA_TOKEN in Netlify before deploying.')
} else {
  console.warn('TinaCMS admin not generated: set NEXT_PUBLIC_TINA_CLIENT_ID and TINA_TOKEN for this deploy.')
}

run('vite', ['build'])
