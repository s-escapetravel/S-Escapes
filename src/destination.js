import { createLeadPayload, setSubmitting, showLeadError, showLeadResult, submitLead } from './lead-service.js'

const qs = (selector, root = document) => root.querySelector(selector)
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)]

const trip = window.S_ESCAPES_TRIP
window.trackSEscapes?.('voyage_view', { destination: trip?.name, slug: trip?.slug })

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
