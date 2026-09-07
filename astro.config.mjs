import { defineConfig } from 'astro/config'

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://s-escapes.com',
  output: 'static',
  build: {
    format: 'file'
  },
  vite: {
    server: {
      allowedHosts: true
    }
  }
})
