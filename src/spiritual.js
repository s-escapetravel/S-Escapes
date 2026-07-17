import { createLeadPayload, responsePromise, setSubmitting, showLeadError, showLeadResult, submitLead } from './lead-service.js'

const qs = (selector, root = document) => root.querySelector(selector)
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)]

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
  element.style.setProperty('--delay', `${Math.min(index % 3, 2) * .07}s`)
  observer.observe(element)
})

requestAnimationFrame(() => document.body.classList.add('is-ready'))

/* ---------- formulas → callback ---------- */
qsa('[data-formula]').forEach(button => button.addEventListener('click', () => {
  const select = qs('[name="type"]')
  select.value = button.dataset.formula
  qs('[data-callback-form]').dataset.cta = `${button.textContent.trim()} — ${button.dataset.formula}`
  window.trackSEscapes?.('formula_request', { formula: button.dataset.formula })
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  qs('#rappel').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  setTimeout(() => qs('[name="name"]').focus(), reduced ? 0 : 850)
}))

qs('[data-callback-form]')?.addEventListener('submit', event => {
  event.preventDefault()
  const form = event.currentTarget
  form.dataset.cta ||= form.querySelector('[type="submit"]')?.textContent.trim() || 'Demander à être rappelé'
  setSubmitting(form, true)
  submitLead(createLeadPayload({ form, kind: 'hajj-omra-callback' }))
    .then(result => showLeadResult(form, result))
    .catch(() => showLeadError(form))
    .finally(() => setSubmitting(form, false))
})

const promise = responsePromise()
qsa('[data-response-promise]').forEach(element => {
  if (!promise) return
  element.hidden = false
  element.textContent = promise
})

qsa('[data-year]').forEach(item => item.textContent = new Date().getFullYear())
qsa('a[href^="tel:"], a[href^="mailto:"], a[href*="wa.me"]').forEach(link => link.addEventListener('click', () => window.trackSEscapes?.('contact_click', { channel: link.href.startsWith('tel:') ? 'phone' : link.href.startsWith('mailto:') ? 'email' : 'whatsapp' })))
