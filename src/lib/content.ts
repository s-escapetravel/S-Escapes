import settings from '../../content/settings/site.json'
import home from '../../content/pages/home.json'
import pilgrimage from '../../content/pages/hajj-omra.json'
import legal from '../../content/pages/confidentialite.json'

const tripModules = import.meta.glob(['../../content/trips/*.json', '../../content/destinations/*.json'], {
  eager: true,
  import: 'default'
}) as Record<string, any>

const storyModules = import.meta.glob('../../content/stories/*.json', {
  eager: true,
  import: 'default'
}) as Record<string, any>

export const siteSettings = settings
export const homePage = home
export const pilgrimagePage = pilgrimage
export const legalPage = legal

const normalizeTrip = (raw: any) => {
  const title = raw.title || raw.name || ''
  const name = raw.name || raw.title || ''
  const slug = raw.slug || title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')
  const coverImage = raw.coverImage || raw.image || ''
  const image = raw.image || raw.coverImage || ''
  const description = raw.description || raw.copy || ''
  const copy = raw.copy || raw.description || ''
  const destination = raw.destination || raw.coords || raw.location || name
  const highlights = Array.isArray(raw.highlights) ? raw.highlights : (Array.isArray(raw.includes) ? raw.includes : [])
  const includes = Array.isArray(raw.includes) ? raw.includes : highlights

  return {
    ...raw,
    title,
    name,
    slug,
    destination,
    location: raw.location || raw.coords || destination,
    coords: raw.coords || raw.location || destination,
    price: raw.price || '',
    duration: raw.duration || '',
    coverImage,
    image,
    secondaryImage: raw.secondaryImage || image,
    description,
    copy,
    highlights,
    includes,
    subtitle: raw.subtitle || '',
    note: raw.note || destination,
    category: raw.category || 'culture',
    status: raw.status || 'published',
    featured: raw.featured !== false,
    order: Number(raw.order ?? 99),
    idealPeriod: raw.idealPeriod || '',
    style: raw.style || '',
    prepare: Array.isArray(raw.prepare) ? raw.prepare : [],
    itinerary: Array.isArray(raw.itinerary) ? raw.itinerary : [],
    body: raw.body || null,
    seo: raw.seo || {}
  }
}

// Deduplicate trips by slug (content/trips takes precedence over content/destinations)
const tripsMap = new Map<string, any>()
for (const [filePath, raw] of Object.entries(tripModules)) {
  const trip = normalizeTrip(raw)
  if (!trip.slug) continue
  if (filePath.includes('/trips/') || !tripsMap.has(trip.slug)) {
    tripsMap.set(trip.slug, trip)
  }
}

export const trips = Array.from(tripsMap.values())
  .filter(trip => trip.status === 'published')
  .sort((a, b) => a.order - b.order)

export const featuredTrips = trips.filter(trip => trip.featured)

// Backward-compatible exports
export const destinations = trips
export const featuredDestinations = featuredTrips

export const stories = Object.values(storyModules)
  .filter(story => story.published)
  .sort((a, b) => a.order - b.order)

export const tripBySlug = (slug: string) => trips.find(trip => trip.slug === slug)
export const tripByReference = (reference: string) => {
  const slug = reference?.split('/').pop()?.replace(/\.json$/, '')
  return slug ? tripBySlug(slug) : undefined
}
export const destinationByReference = tripByReference
