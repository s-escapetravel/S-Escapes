import { defineConfig } from 'tinacms'

const required = true
const textarea = { component: 'textarea' }

const seoFields = [
  { type: 'string', name: 'title', label: 'Titre SEO', required },
  { type: 'string', name: 'description', label: 'Description SEO', required, ui: textarea },
  { type: 'image', name: 'image', label: 'Image de partage' },
  { type: 'boolean', name: 'noIndex', label: 'Masquer aux moteurs de recherche' }
] as const

const sectionHeadingFields = [
  { type: 'string', name: 'number', label: 'Numéro' },
  { type: 'string', name: 'label', label: 'Petit titre' },
  { type: 'string', name: 'heading', label: 'Titre — première ligne', required },
  { type: 'string', name: 'headingAccent', label: 'Titre — ligne en italique', required }
] as const

export default defineConfig({
  branch:
    process.env.NEXT_PUBLIC_TINA_BRANCH ||
    process.env.TINA_BRANCH ||
    process.env.GITHUB_BRANCH ||
    process.env.HEAD ||
    'main',
  clientId:
    process.env.NEXT_PUBLIC_TINA_CLIENT_ID ||
    process.env.TINA_PUBLIC_CLIENT_ID ||
    process.env.TINA_CLIENT_ID ||
    null,
  token: process.env.TINA_TOKEN || null,

  build: {
    outputFolder: 'admin',
    publicFolder: 'public'
  },
  media: {
    tina: {
      mediaRoot: 'images',
      publicFolder: 'public'
    }
  },
  schema: {
    collections: [
      {
        name: 'settings',
        label: 'Réglages du site',
        path: 'content/settings',
        format: 'json',
        match: { include: 'site' },
        ui: {
          global: true,
          allowedActions: { create: false, delete: false }
        },
        fields: [
          { type: 'string', name: 'brandName', label: 'Nom de la marque', required, isTitle: true },
          { type: 'string', name: 'descriptor', label: 'Signature de marque' },
          { type: 'string', name: 'siteUrl', label: 'Adresse du site', required },
          {
            type: 'object', name: 'contact', label: 'Coordonnées', required,
            fields: [
              { type: 'string', name: 'phoneDisplay', label: 'Téléphone affiché', required },
              { type: 'string', name: 'phoneHref', label: 'Téléphone international', required, description: 'Exemple : +33634693243' },
              { type: 'string', name: 'email', label: 'E-mail', required },
              { type: 'string', name: 'hours', label: 'Horaires' },
              { type: 'string', name: 'responseTime', label: 'Délai de réponse annoncé', required },
              { type: 'string', name: 'locationNote', label: 'Zone de service' }
            ]
          },
          {
            type: 'object', name: 'social', label: 'Réseaux sociaux', required,
            fields: [
              { type: 'string', name: 'instagramUrl', label: 'Lien Instagram' },
              { type: 'string', name: 'instagramLabel', label: 'Nom Instagram' },
              { type: 'string', name: 'whatsappUrl', label: 'Lien WhatsApp' }
            ]
          },
          {
            type: 'object', name: 'navigation', label: 'Navigation principale', list: true, ui: { itemProps: item => ({ label: item?.label }) },
            fields: [
              { type: 'string', name: 'label', label: 'Libellé', required },
              { type: 'string', name: 'href', label: 'Lien', required },
              { type: 'boolean', name: 'highlight', label: 'Mettre en avant' }
            ]
          },
          {
            type: 'object', name: 'footer', label: 'Pied de page', required,
            fields: [
              { type: 'string', name: 'statement', label: 'Phrase', ui: textarea },
              { type: 'string', name: 'copyright', label: 'Copyright' }
            ]
          },
          {
            type: 'object', name: 'organization', label: 'Informations légales',
            fields: [
              { type: 'string', name: 'legalName', label: 'Raison sociale' },
              { type: 'string', name: 'registration', label: 'SIREN / immatriculation' },
              { type: 'string', name: 'address', label: 'Adresse', ui: textarea },
              { type: 'string', name: 'privacyEmail', label: 'E-mail confidentialité' }
            ]
          },
          { type: 'object', name: 'defaultSeo', label: 'SEO par défaut', fields: [...seoFields] }
        ]
      },
      {
        name: 'home',
        label: 'Page d’accueil',
        path: 'content/pages',
        format: 'json',
        match: { include: 'home' },
        ui: {
          allowedActions: { create: false, delete: false }
        },
        fields: [
          { type: 'string', name: 'pageName', label: 'Page', isTitle: true, required },
          { type: 'object', name: 'seo', label: 'Référencement', fields: [...seoFields] },
          {
            type: 'object', name: 'hero', label: 'Bannière principale', required,
            fields: [
              { type: 'string', name: 'heading', label: 'Titre — première ligne', required },
              { type: 'string', name: 'headingAccent', label: 'Titre — ligne en italique', required },
              { type: 'string', name: 'intro', label: 'Introduction', required, ui: textarea },
              { type: 'image', name: 'image', label: 'Image principale', required },
              { type: 'image', name: 'imageMobile', label: 'Image mobile' },
              { type: 'string', name: 'primaryCta', label: 'Bouton principal' },
              { type: 'string', name: 'secondaryCta', label: 'Bouton secondaire' },
              { type: 'string', name: 'note', label: 'Note manuscrite' },
              {
                type: 'object', name: 'polaroids', label: 'Photos flottantes', list: true, ui: { itemProps: item => ({ label: item?.caption }) },
                fields: [
                  { type: 'image', name: 'image', label: 'Image', required },
                  { type: 'string', name: 'caption', label: 'Légende', required }
                ]
              },
              { type: 'string', name: 'stripLeft', label: 'Bandeau — gauche' },
              { type: 'string', name: 'stripRight', label: 'Bandeau — droite' },
              { type: 'string', name: 'stamp', label: 'Tampon circulaire' }
            ]
          },
          {
            type: 'object', name: 'departures', label: 'Section voyages', required,
            fields: [
              ...sectionHeadingFields,
              { type: 'string', name: 'emptyMessage', label: 'Message si aucun résultat', ui: textarea },
              { type: 'string', name: 'budgetNote', label: 'Note sur les budgets', ui: textarea }
            ]
          },
          {
            type: 'object', name: 'atelier', label: 'Section sur mesure', required,
            fields: [
              ...sectionHeadingFields,
              { type: 'string', name: 'intro', label: 'Introduction', ui: textarea },
              { type: 'string', name: 'cta', label: 'Bouton' },
              { type: 'string', name: 'note', label: 'Note manuscrite' },
              {
                type: 'object', name: 'steps', label: 'Étapes', list: true, ui: { itemProps: item => ({ label: item?.title }) },
                fields: [
                  { type: 'string', name: 'title', label: 'Titre', required },
                  { type: 'string', name: 'description', label: 'Description', required }
                ]
              }
            ]
          },
          {
            type: 'object', name: 'spiritualPromo', label: 'Encart Hajj & Omra', required,
            fields: [
              ...sectionHeadingFields,
              { type: 'string', name: 'intro', label: 'Introduction', ui: textarea },
              { type: 'image', name: 'image', label: 'Image', required },
              { type: 'string', name: 'cta', label: 'Bouton' }
            ]
          },
          {
            type: 'object', name: 'approach', label: 'Section notre approche', required,
            fields: [
              ...sectionHeadingFields,
              { type: 'string', name: 'intro', label: 'Introduction', ui: textarea },
              { type: 'string', name: 'points', label: 'Points clés', list: true },
              { type: 'image', name: 'image', label: 'Image', required },
              { type: 'string', name: 'imageAlt', label: 'Texte alternatif' },
              { type: 'string', name: 'caption', label: 'Légende' }
            ]
          },
          {
            type: 'object', name: 'proof', label: 'Pourquoi nous choisir', required,
            fields: [
              ...sectionHeadingFields,
              {
                type: 'object', name: 'items', label: 'Arguments', list: true, ui: { itemProps: item => ({ label: item?.title }) },
                fields: [
                  { type: 'string', name: 'title', label: 'Titre', required },
                  { type: 'string', name: 'copy', label: 'Texte', required, ui: textarea }
                ]
              }
            ]
          },
          { type: 'object', name: 'storiesIntro', label: 'Introduction des carnets', fields: [...sectionHeadingFields, { type: 'string', name: 'intro', label: 'Introduction', ui: textarea }] },
          {
            type: 'object', name: 'advisor', label: 'Mot de la conseillère',
            fields: [
              { type: 'string', name: 'label', label: 'Petit titre' },
              { type: 'string', name: 'name', label: 'Nom' },
              { type: 'string', name: 'role', label: 'Rôle / signature' },
              { type: 'string', name: 'quote', label: 'Message', ui: textarea }
            ]
          },
          {
            type: 'object', name: 'testimonial', label: 'Témoignage mis en avant',
            fields: [
              { type: 'boolean', name: 'published', label: 'Afficher ce témoignage' },
              { type: 'string', name: 'quote', label: 'Citation', ui: textarea },
              { type: 'string', name: 'author', label: 'Auteur' },
              { type: 'string', name: 'trip', label: 'Voyage' }
            ]
          },
          {
            type: 'object', name: 'contact', label: 'Section contact', required,
            fields: [
              ...sectionHeadingFields,
              { type: 'string', name: 'intro', label: 'Introduction', ui: textarea },
              { type: 'string', name: 'note', label: 'Note manuscrite' },
              { type: 'string', name: 'submitLabel', label: 'Bouton du formulaire' },
              { type: 'string', name: 'successTitle', label: 'Titre de confirmation' },
              { type: 'string', name: 'successCopy', label: 'Texte de confirmation', ui: textarea }
            ]
          }
        ]
      },
      {
        name: 'trips',
        label: 'Voyages',
        path: 'content/trips',
        format: 'json',
        ui: {
          filename: {
            slugify: values => values?.slug || values?.title?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'nouveau-voyage'
          }
        },
        fields: [
          { type: 'string', name: 'title', label: 'Titre du voyage', required: true, isTitle: true },
          { type: 'string', name: 'destination', label: 'Destination / Lieu' },
          { type: 'string', name: 'location', label: 'Coordonnées / Localisation' },
          { type: 'string', name: 'slug', label: 'Adresse URL (slug)', required: true, description: 'Lettres minuscules et tirets (ex: corse).' },
          { type: 'string', name: 'price', label: 'Prix', description: 'Exemple : À partir de 899 €' },
          { type: 'string', name: 'duration', label: 'Durée', description: 'Exemple : 7 jours / 6 nuits' },
          { type: 'image', name: 'coverImage', label: 'Image de couverture' },
          { type: 'image', name: 'image', label: 'Image principale (alias)' },
          { type: 'image', name: 'secondaryImage', label: 'Image secondaire / carnet' },
          { type: 'string', name: 'description', label: 'Description', ui: textarea },
          { type: 'string', name: 'subtitle', label: 'Sous-titre' },
          { type: 'string', name: 'note', label: 'Accroche courte' },
          { type: 'string', name: 'highlights', label: 'Points forts / Inclusions', list: true },
          { type: 'string', name: 'status', label: 'Statut', options: [{ label: 'Publié', value: 'published' }, { label: 'Brouillon', value: 'draft' }, { label: 'Archivé', value: 'archived' }] },
          { type: 'boolean', name: 'featured', label: 'Afficher sur la page d’accueil' },
          { type: 'number', name: 'order', label: 'Ordre d’affichage' },
          { type: 'string', name: 'category', label: 'Catégorie', options: [{ label: 'Soleil', value: 'soleil' }, { label: 'Culture', value: 'culture' }, { label: 'Nature', value: 'nature' }] },
          { type: 'string', name: 'idealPeriod', label: 'Période idéale' },
          { type: 'string', name: 'style', label: 'Style du voyage' },
          { type: 'string', name: 'prepare', label: 'À prévoir', list: true },
          {
            type: 'object', name: 'itinerary', label: 'Itinéraire', list: true, ui: { itemProps: item => ({ label: item?.title }) },
            fields: [
              { type: 'string', name: 'title', label: 'Étape', required: true },
              { type: 'string', name: 'copy', label: 'Description', required: true, ui: textarea }
            ]
          },
          {
            type: 'object', name: 'alternatives', label: 'Autres voyages suggérés', list: true,
            fields: [{ type: 'reference', name: 'destination', label: 'Voyage', collections: ['trips'] }]
          },
          { type: 'rich-text', name: 'body', label: 'Corps du texte / Détails du voyage' },
          { type: 'object', name: 'seo', label: 'Référencement SEO', fields: [...seoFields] }
        ]
      },
      {
        name: 'story',
        label: 'Carnets de voyage',
        path: 'content/stories',
        format: 'json',
        fields: [
          { type: 'string', name: 'title', label: 'Titre', required, isTitle: true },
          { type: 'boolean', name: 'published', label: 'Afficher sur l’accueil' },
          { type: 'number', name: 'order', label: 'Ordre' },
          { type: 'string', name: 'destination', label: 'Destination', required },
          { type: 'image', name: 'image', label: 'Image', required },
          { type: 'string', name: 'alt', label: 'Texte alternatif', required },
          { type: 'string', name: 'copy', label: 'Résumé', required, ui: textarea },
          { type: 'string', name: 'href', label: 'Lien', required }
        ]
      },
      {
        name: 'pilgrimage',
        label: 'Page Hajj & Omra',
        path: 'content/pages',
        format: 'json',
        match: { include: 'hajj-omra' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: 'string', name: 'pageName', label: 'Page', isTitle: true, required },
          { type: 'object', name: 'seo', label: 'Référencement', fields: [...seoFields] },
          {
            type: 'object', name: 'hero', label: 'Bannière principale', fields: [
              { type: 'string', name: 'kicker', label: 'Lieu / coordonnées' },
              { type: 'string', name: 'heading', label: 'Titre — première ligne' },
              { type: 'string', name: 'headingAccent', label: 'Titre — ligne dorée' },
              { type: 'string', name: 'intro', label: 'Introduction', ui: textarea },
              { type: 'image', name: 'image', label: 'Image principale' },
              { type: 'image', name: 'imageMobile', label: 'Image mobile' },
              { type: 'string', name: 'primaryCta', label: 'Bouton principal' },
              { type: 'string', name: 'secondaryCta', label: 'Bouton secondaire' },
              { type: 'string', name: 'stripLeft', label: 'Bandeau — gauche' },
              { type: 'string', name: 'stripRight', label: 'Bandeau — droite' }
            ]
          },
          {
            type: 'object', name: 'choices', label: 'Hajj ou Omra', fields: [
              ...sectionHeadingFields,
              {
                type: 'object', name: 'items', label: 'Choix', list: true, ui: { itemProps: item => ({ label: item?.title }) },
                fields: [
                  { type: 'string', name: 'title', label: 'Titre', required },
                  { type: 'string', name: 'copy', label: 'Présentation', ui: textarea },
                  { type: 'object', name: 'facts', label: 'Repères', list: true, fields: [{ type: 'string', name: 'label', label: 'Libellé' }, { type: 'string', name: 'value', label: 'Valeur' }] },
                  { type: 'string', name: 'cta', label: 'Lien — texte' },
                  { type: 'string', name: 'href', label: 'Lien — cible' }
                ]
              }
            ]
          },
          {
            type: 'object', name: 'journey', label: 'Le parcours', fields: [
              ...sectionHeadingFields,
              {
                type: 'object', name: 'stages', label: 'Étapes', list: true, ui: { itemProps: item => ({ label: item?.title }) },
                fields: [
                  { type: 'string', name: 'title', label: 'Titre' },
                  { type: 'image', name: 'image', label: 'Image' },
                  { type: 'string', name: 'imageAlt', label: 'Texte alternatif' },
                  { type: 'object', name: 'items', label: 'Points', list: true, fields: [{ type: 'string', name: 'title', label: 'Titre' }, { type: 'string', name: 'copy', label: 'Description' }] }
                ]
              }
            ]
          },
          { type: 'object', name: 'hajjPromo', label: 'Préparer le Hajj', fields: [...sectionHeadingFields, { type: 'string', name: 'intro', label: 'Introduction', ui: textarea }, { type: 'image', name: 'image', label: 'Image' }, { type: 'string', name: 'cta', label: 'Bouton' }] },
          {
            type: 'object', name: 'practical', label: 'Repères pratiques', fields: [
              ...sectionHeadingFields,
              { type: 'object', name: 'columns', label: 'Colonnes', list: true, ui: { itemProps: item => ({ label: item?.title }) }, fields: [{ type: 'string', name: 'title', label: 'Titre' }, { type: 'string', name: 'items', label: 'Points', list: true }] }
            ]
          },
          {
            type: 'object', name: 'packages', label: 'Formules Omra', fields: [
              ...sectionHeadingFields,
              {
                type: 'object', name: 'items', label: 'Formules', list: true, ui: { itemProps: item => ({ label: item?.name }) },
                fields: [
                  { type: 'string', name: 'name', label: 'Nom', required },
                  { type: 'string', name: 'tagline', label: 'Accroche' },
                  { type: 'boolean', name: 'featured', label: 'Recommandée' },
                  { type: 'string', name: 'badge', label: 'Badge' },
                  { type: 'string', name: 'price', label: 'Prix' },
                  { type: 'object', name: 'features', label: 'Prestations', list: true, fields: [{ type: 'string', name: 'label', label: 'Libellé' }, { type: 'string', name: 'value', label: 'Valeur' }] },
                  { type: 'string', name: 'cta', label: 'Bouton' }
                ]
              }
            ]
          },
          {
            type: 'object', name: 'preparation', label: 'Préparer son départ', fields: [
              ...sectionHeadingFields,
              { type: 'object', name: 'items', label: 'Conseils', list: true, ui: { itemProps: item => ({ label: item?.title }) }, fields: [{ type: 'string', name: 'title', label: 'Titre' }, { type: 'string', name: 'copy', label: 'Description', ui: textarea }] }
            ]
          },
          {
            type: 'object', name: 'faq', label: 'Questions fréquentes', fields: [
              ...sectionHeadingFields,
              { type: 'object', name: 'items', label: 'Questions', list: true, ui: { itemProps: item => ({ label: item?.question }) }, fields: [{ type: 'string', name: 'question', label: 'Question' }, { type: 'string', name: 'answer', label: 'Réponse', ui: textarea }] }
            ]
          },
          { type: 'object', name: 'contact', label: 'Section rappel', fields: [...sectionHeadingFields, { type: 'string', name: 'intro', label: 'Introduction', ui: textarea }, { type: 'string', name: 'submitLabel', label: 'Bouton' }, { type: 'string', name: 'successTitle', label: 'Titre de confirmation' }, { type: 'string', name: 'successCopy', label: 'Texte de confirmation', ui: textarea }] }
        ]
      },
      {
        name: 'legal',
        label: 'Politique de confidentialité',
        path: 'content/pages',
        format: 'json',
        match: { include: 'confidentialite' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: 'string', name: 'pageName', label: 'Page', isTitle: true, required },
          { type: 'object', name: 'seo', label: 'Référencement', fields: [...seoFields] },
          { type: 'string', name: 'heading', label: 'Titre — première ligne' },
          { type: 'string', name: 'headingAccent', label: 'Titre — ligne en italique' },
          { type: 'string', name: 'updatedAt', label: 'Dernière mise à jour' },
          { type: 'object', name: 'sections', label: 'Sections', list: true, ui: { itemProps: item => ({ label: item?.title }) }, fields: [{ type: 'string', name: 'title', label: 'Titre' }, { type: 'string', name: 'body', label: 'Contenu', ui: textarea }] }
        ]
      }
    ]
  }
})
