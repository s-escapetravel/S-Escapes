import { tripBySlug, tripDetail, trips } from './trip-data.js'
import { createLeadPayload, setSubmitting, showLeadError, showLeadResult, submitLead } from './lead-service.js'

const qs = (selector, root = document) => root.querySelector(selector)
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)]

const slug = location.pathname.split('/').filter(Boolean).pop().replace('.html', '')
const trip = tripBySlug(slug)

if (!trip) {
  location.href = '/#departs'
} else {
  const detail = tripDetail(trip)
  document.title = `${trip.name} — S Escapes`
  qs('meta[name="description"]').content = trip.copy
  qs('link[rel="canonical"]').href = `https://s-escapes.fr/voyages/${trip.slug}.html`
  const tripSchema = document.createElement('script')
  tripSchema.type = 'application/ld+json'
  tripSchema.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'TouristTrip', name: trip.name, description: trip.copy, itinerary: { '@type': 'ItemList', itemListElement: trip.itinerary.map(([name], position) => ({ '@type': 'ListItem', position: position + 1, name })) } })
  document.head.append(tripSchema)
  window.trackSEscapes?.('voyage_view', { destination: trip.name, slug: trip.slug })
  qs('[data-name]').textContent = trip.name
  qs('[data-coords]').textContent = trip.coords
  qs('[data-subtitle]').textContent = trip.subtitle
  qs('[data-subtitle-copy]').textContent = trip.subtitle
  qs('[data-duration]').textContent = trip.duration
  qs('[data-price]').textContent = trip.price
  qs('[data-ideal-period]').textContent = detail.idealPeriod
  qs('[data-style]').textContent = detail.style
  qs('[data-copy]').textContent = trip.copy
  const heroImage = qs('[data-image]')
  const storyImage = qs('[data-secondary-image]')
  heroImage.src = trip.image
  heroImage.alt = `${trip.name} — ${trip.subtitle}`
  storyImage.src = trip.secondaryImage
  storyImage.alt = `Carnet visuel de voyage — ${trip.name}`
  const note = qs('[data-note]')
  if (note) note.textContent = trip.note
  qs('[data-includes]').innerHTML = trip.includes.map(item => `<li>${item}</li>`).join('')
  qs('[data-prepare]').innerHTML = detail.prepare.map(item => `<li>${item}</li>`).join('')
  qs('[data-itinerary]').innerHTML = trip.itinerary.map(([title, copy], index) => `<li style="--delay:${index * .09}s"><span>${String(index + 1).padStart(2, '0')}</span><div><strong>${title}</strong><small>${copy}</small></div></li>`).join('')
  qsa('[data-adapt-link]').forEach(link => link.href = `/?destination=${encodeURIComponent(trip.name)}#atelier`)
  const alternatives = detail.alternatives.map(alternative => trips.find(candidate => candidate.slug === alternative)).filter(Boolean)
  qs('[data-alternatives]').innerHTML = alternatives.map(candidate => `<a href="/voyages/${candidate.slug}.html"><img src="${candidate.image}" alt="${candidate.name}" loading="lazy" /><span>${candidate.name}</span><small>${candidate.price}</small></a>`).join('')
}

/* ---------- topbar ---------- */
const header = qs('[data-header]')
const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 24)
addEventListener('scroll', onScroll, { passive: true })
onScroll()

const menuButton = qs('.menu-toggle')
const nav = qs('.main-nav')
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true'
  menuButton.setAttribute('aria-expanded', String(!open))
  nav.classList.toggle('is-open', !open)
})
qsa('.main-nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('is-open')
  menuButton?.setAttribute('aria-expanded', 'false')
}))

/* ---------- reveals ---------- */
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('is-visible')
    observer.unobserve(entry.target)
  }
}), { threshold: .08, rootMargin: '9999px 0px 12% 0px' })
qsa('.reveal').forEach((element, index) => {
  element.style.setProperty('--delay', `${Math.min(index % 3, 2) * .06}s`)
  observer.observe(element)
})

requestAnimationFrame(() => document.body.classList.add('is-ready'))

/* ---------- 3D tilt ---------- */
if (matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  qsa('[data-tilt]').forEach(element => {
    element.addEventListener('pointermove', event => {
      const box = element.getBoundingClientRect()
      const x = (event.clientX - box.left) / box.width - .5
      const y = (event.clientY - box.top) / box.height - .5
      element.style.transform = `perspective(700px) rotate(var(--tilt, 0deg)) rotateX(${(-y * 9).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) scale(1.04)`
    })
    element.addEventListener('pointerleave', () => { element.style.transform = '' })
  })
}

/* ---------- form ---------- */
qs('[data-voyage-form]')?.addEventListener('submit', event => {
  event.preventDefault()
  const form = event.currentTarget
  form.dataset.cta = 'Recevoir le programme'
  setSubmitting(form, true)
  submitLead(createLeadPayload({ form, kind: 'voyage-programme', extras: { destination: trip.name, travelType: `Programme ${trip.name}`, context: { voyageSlug: trip.slug } } }))
    .then(result => showLeadResult(form, result))
    .catch(() => showLeadError(form))
    .finally(() => setSubmitting(form, false))
})

qsa('[data-year]').forEach(item => item.textContent = new Date().getFullYear())
