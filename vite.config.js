import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        spiritual: resolve(import.meta.dirname, 'hajj-omra.html'),
        confidentialite: resolve(import.meta.dirname, 'confidentialite.html'),
        laponie: resolve(import.meta.dirname, 'voyages/laponie.html'),
        copenhague: resolve(import.meta.dirname, 'voyages/copenhague.html'),
        cracovie: resolve(import.meta.dirname, 'voyages/cracovie.html'),
        tenerife: resolve(import.meta.dirname, 'voyages/tenerife.html'),
        corse: resolve(import.meta.dirname, 'voyages/corse.html'),
        bali: resolve(import.meta.dirname, 'voyages/bali.html'),
        senegal: resolve(import.meta.dirname, 'voyages/senegal.html'),
        algarve: resolve(import.meta.dirname, 'voyages/algarve.html'),
        grece: resolve(import.meta.dirname, 'voyages/grece.html')
      }
    }
  }
})
