import { defineConfig } from 'tinacms'

export default defineConfig({
  branch: process.env.NEXT_PUBLIC_TINA_BRANCH || 'main',
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,
  build: {
    outputFolder: 'admin',
    publicFolder: 'public'
  },
  media: {
    tina: { mediaRoot: 'uploads', publicFolder: 'public' }
  },
  schema: {
    collections: [
      {
        name: 'testimonial',
        label: 'Avis voyageurs',
        path: 'content/testimonials',
        format: 'json',
        ui: {
          filename: { readonly: true },
          allowedActions: { create: false, delete: false }
        },
        fields: [
          { type: 'string', name: 'status', label: 'Décision', required: true, options: ['pending', 'approved', 'rejected'], ui: { component: 'select' } },
          { type: 'string', name: 'name', label: 'Nom à afficher', required: true },
          { type: 'string', name: 'email', label: 'E-mail privé', required: true },
          { type: 'string', name: 'trip', label: 'Voyage', required: true },
          { type: 'number', name: 'rating', label: 'Note', required: true },
          { type: 'string', name: 'message', label: 'Avis', required: true, ui: { component: 'textarea' } },
          { type: 'boolean', name: 'photoConsent', label: 'Accord pour publier les photos' },
          { type: 'image', name: 'photos', label: 'Photos jointes', list: true },
          { type: 'datetime', name: 'submittedAt', label: 'Reçu le', required: true },
          { type: 'string', name: 'sourcePage', label: 'Page source', ui: { component: 'hidden' } }
        ]
      }
    ]
  }
})
