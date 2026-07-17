import { trips } from './trip-data.js'
import { advisor, recentStories, testimonial } from './editorial-data.js'
import { createLeadPayload, responsePromise, setSubmitting, showLeadError, showLeadResult, submitLead } from './lead-service.js'
import { approvedReviews, bindReviewForm } from './review-service.js'

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

/* ---------- departure board ---------- */
const board = qs('[data-board]')
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
const renderBoard = (filter = 'all') => {
  const filtered = filter === 'all' ? trips : trips.filter(trip => trip.category === filter)
  board.replaceChildren()
  if (!filtered.length) {
    board.insertAdjacentHTML('beforeend', '<p class="board-empty">Aucun départ dans cette catégorie pour le moment — parlez-nous de votre envie, nous la dessinerons.</p>')
    return
  }
  const tripTile = (trip, index, variant = '') => `
    <a class="atlas-trip ${variant}" href="/voyages/${trip.slug}.html">
      <img src="${trip.image}" alt="${trip.name} — ${trip.note}" loading="lazy" />
      <span class="atlas-shade" aria-hidden="true"></span>
      <span class="atlas-no">${String(index + 1).padStart(2, '0')}</span>
      <span class="atlas-copy"><strong>${trip.name}</strong><em>${trip.price}</em></span>
      <span class="atlas-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg></span>
    </a>`
  const [lead, ...following] = filtered
  const sideTrips = following.slice(0, 3)
  const railTrips = following.slice(3)
  board.insertAdjacentHTML('beforeend', `
    <div class="atlas-stage">
      ${tripTile(lead, trips.indexOf(lead), 'atlas-trip--lead')}
      ${sideTrips.length ? `<div class="atlas-side">${sideTrips.map(trip => tripTile(trip, trips.indexOf(trip), 'atlas-trip--side')).join('')}</div>` : ''}
    </div>
    ${railTrips.length ? `<div class="atlas-rail">${railTrips.map(trip => tripTile(trip, trips.indexOf(trip), 'atlas-trip--rail')).join('')}</div>` : ''}`)
}
renderBoard()
let boardTransitioning = false
const changeFilter = button => {
  if (boardTransitioning || button.classList.contains('is-active')) return
  boardTransitioning = true
  qsa('[data-filter]').forEach(item => item.classList.remove('is-active'))
  button.classList.add('is-active')
  qsa('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)))
  window.trackSEscapes?.('atlas_filter', { filter: button.dataset.filter })
  const update = () => {
    renderBoard(button.dataset.filter)
    board.classList.add('is-assembling')
    requestAnimationFrame(() => board.classList.remove('is-assembling'))
    boardTransitioning = false
  }
  if (reducedMotion || !board.children.length) return update()
  board.classList.add('is-leaving')
  setTimeout(() => {
    board.classList.remove('is-leaving')
    update()
  }, 210)
}
qsa('[data-filter]').forEach(button => button.addEventListener('click', () => changeFilter(button)))

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

/* ---------- route thread ---------- */
const routeThread = qs('.route-thread span')
if (routeThread && !reducedMotion) {
  let routeTicking = false
  const updateRouteThread = () => {
    const main = qs('main')
    const progress = Math.min(1, Math.max(0, (scrollY + innerHeight * .45 - main.offsetTop) / (main.offsetHeight - innerHeight * .35)))
    routeThread.style.transform = `scaleY(${progress.toFixed(3)})`
    routeTicking = false
  }
  addEventListener('scroll', () => {
    if (routeTicking) return
    routeTicking = true
    requestAnimationFrame(updateRouteThread)
  }, { passive: true })
  addEventListener('resize', updateRouteThread, { passive: true })
  updateRouteThread()
}

/* ---------- 3D tilt + hero parallax ---------- */
const fineMotion = matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches
if (fineMotion) {
  qsa('[data-tilt]').forEach(element => {
    element.addEventListener('pointermove', event => {
      /* a running entrance animation would override the inline tilt */
      element.style.animation = 'none'
      element.style.opacity = 1
      const box = element.getBoundingClientRect()
      const x = (event.clientX - box.left) / box.width - .5
      const y = (event.clientY - box.top) / box.height - .5
      element.style.transform = `perspective(700px) rotate(var(--tilt, 0deg)) rotateX(${(-y * 9).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) scale(1.04)`
    })
    element.addEventListener('pointerleave', () => { element.style.transform = '' })
  })
  const floats = qsa('.cover-polaroids .polaroid')
  if (floats.length) {
    let ticking = false
    addEventListener('scroll', () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        floats.forEach((element, index) => {
          element.style.translate = `0 ${(scrollY * (index ? .1 : .16)).toFixed(1)}px`
        })
        ticking = false
      })
    }, { passive: true })
  }
}

/* ---------- planner modal ---------- */
const plannerModal = qs('[data-planner-modal]')
const openModal = modal => {
  modal.showModal()
  document.body.classList.add('modal-open')
}
const closeModal = modal => {
  modal.close()
  document.body.classList.remove('modal-open')
}
qsa('[data-open-planner]').forEach(button => button.addEventListener('click', () => {
  plannerForm.hidden = false
  qs('[data-form-success]', plannerModal).hidden = true
  plannerForm.dataset.cta = button.textContent.trim()
  window.trackSEscapes?.('planner_start', { cta: button.textContent.trim() })
  showPlannerStep(1)
  qs('.form-status', plannerModal).textContent = ''
  openModal(plannerModal)
}))

const reviewModal = qs('[data-review-modal]')
const reviewForm = qs('[data-review-form]')
qsa('[data-open-review]').forEach(button => button.addEventListener('click', () => {
  reviewForm.hidden = false
  qs('[data-review-success]', reviewModal).hidden = true
  qs('.form-status', reviewForm).textContent = ''
  openModal(reviewModal)
  qs('[name="name"]', reviewForm)?.focus()
}))
bindReviewForm({
  form: reviewForm,
  onSuccess: () => {
    reviewForm.hidden = true
    qs('[data-review-success]', reviewModal).hidden = false
  }
})

/* ---------- editorial proof ---------- */
const stories = qs('[data-stories]')
if (stories) {
  stories.innerHTML = recentStories.map((story, index) => `
    <a class="story-card" href="${story.href}">
      <figure><img src="${story.image}" alt="${story.alt}" loading="lazy" /><figcaption>${String(index + 1).padStart(2, '0')}</figcaption></figure>
      <span class="story-place">${story.destination}</span>
      <strong>${story.title}</strong>
      <small>${story.copy}</small>
      <span class="story-link">Lire le carnet <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg></span>
    </a>`).join('')
}
const advisorBlock = qs('[data-advisor]')
if (advisorBlock) {
  qs('.sect-label', advisorBlock).textContent = advisor.eyebrow
  qs('h2', advisorBlock).textContent = advisor.name
  qs('.advisor-role', advisorBlock).textContent = advisor.role
  qs('blockquote', advisorBlock).textContent = `« ${advisor.note} »`
}
const testimonialBlock = qs('[data-testimonial]')
const renderTestimonial = item => {
  if (!testimonialBlock || !item) return
  testimonialBlock.replaceChildren()
  if (item.photos?.[0]) {
    const figure = document.createElement('figure')
    figure.className = 'testimonial-photo'
    const photo = document.createElement('img')
    photo.src = item.photos[0]
    photo.alt = `Souvenir de voyage partagé par ${item.author}`
    photo.loading = 'lazy'
    figure.append(photo)
    testimonialBlock.append(figure)
  }
  const quoteMark = document.createElement('span')
  quoteMark.setAttribute('aria-hidden', 'true')
  quoteMark.textContent = '“'
  const quote = document.createElement('blockquote')
  quote.textContent = item.quote
  const author = document.createElement('p')
  author.append(document.createTextNode(item.author))
  const trip = document.createElement('small')
  trip.textContent = item.trip
  author.append(trip)
  testimonialBlock.append(quoteMark, quote, author)
}
renderTestimonial(testimonial)
approvedReviews().then(reviews => {
  if (reviews.length) renderTestimonial(reviews[0])
}).catch(() => {})
qsa('.proof .reveal, .carnets .reveal, .advisor .reveal').forEach(element => element.classList.add('is-visible'))
qsa('[data-close-modal]').forEach(button => button.addEventListener('click', () => closeModal(button.closest('dialog'))))
qsa('dialog').forEach(dialog => dialog.addEventListener('click', event => {
  if (event.target === dialog) closeModal(dialog)
}))

let plannerStep = 1
const plannerForm = qs('[data-planner-form]')
const plannerValue = name => new FormData(plannerForm).get(name)
const requestedDestination = new URLSearchParams(location.search).get('destination')
if (requestedDestination && plannerForm) {
  plannerForm.elements.destination.value = requestedDestination
  plannerForm.dataset.cta = `Imaginer ce voyage — ${requestedDestination}`
  requestAnimationFrame(() => {
    showPlannerStep(1)
    openModal(plannerModal)
  })
}
const updatePlannerSummary = () => {
  if (!plannerForm) return
  const adults = Number(plannerValue('adults') || 0)
  const children = Number(plannerValue('children') || 0)
  const travelers = [adults ? `${adults} adulte${adults > 1 ? 's' : ''}` : '', children ? `${children} enfant${children > 1 ? 's' : ''}` : ''].filter(Boolean).join(', ') || 'À définir'
  const values = {
    inspiration: plannerValue('inspiration') || 'À imaginer',
    destination: plannerValue('destination') || 'À découvrir',
    dates: plannerValue('dates') || 'À définir',
    travelers,
    pace: plannerValue('pace') || 'À votre mesure',
    budget: plannerValue('budget') || 'À définir'
  }
  Object.entries(values).forEach(([key, value]) => {
    const item = qs(`[data-summary="${key}"]`, plannerModal)
    if (item) item.textContent = value
  })
  const summary = qs('.planner-summary', plannerModal)
  summary?.classList.remove('is-updating')
  void summary?.offsetWidth
  summary?.classList.add('is-updating')
}
const showPlannerStep = step => {
  plannerStep = step
  qsa('[data-step]', plannerModal).forEach(fieldset => fieldset.hidden = Number(fieldset.dataset.step) !== step)
  qs('[data-planner-back]', plannerModal).hidden = step === 1
  qs('[data-planner-next]', plannerModal).hidden = step === 3
  qs('[data-planner-submit]', plannerModal).hidden = step !== 3
  qs('[data-planner-progress]', plannerModal).textContent = `Étape ${step} sur 3`
  qs('.planner-progress b', plannerModal).style.width = `${step / 3 * 100}%`
  plannerModal.dataset.step = String(step)
  plannerModal.classList.toggle('is-carnet-ready', step === 3)
  updatePlannerSummary()
}
plannerForm?.addEventListener('input', updatePlannerSummary)
plannerForm?.addEventListener('change', updatePlannerSummary)
qs('[data-planner-next]')?.addEventListener('click', () => {
  const current = qs(`[data-step="${plannerStep}"]`, plannerModal)
  const invalid = qsa('input[required], select[required], textarea[required]', current).find(input => !input.checkValidity())
  if (invalid) {
    qs('.form-status', plannerModal).textContent = plannerStep === 1 ? 'Choisissez une inspiration pour continuer.' : 'Il manque une ou plusieurs informations pour continuer.'
    invalid.focus()
    return
  }
  qs('.form-status', plannerModal).textContent = ''
  showPlannerStep(Math.min(3, plannerStep + 1))
})
qs('[data-planner-back]')?.addEventListener('click', () => showPlannerStep(Math.max(1, plannerStep - 1)))

/* ---------- lead delivery ---------- */
qs('[data-planner-form]')?.addEventListener('submit', event => {
  event.preventDefault()
  const finalStep = qs('[data-step="3"]', plannerModal)
  const invalid = qsa('input[required], select[required], textarea[required]', finalStep).find(input => !input.checkValidity())
  if (invalid) {
    qs('.form-status', event.currentTarget).textContent = 'Il manque une ou plusieurs informations pour envoyer votre carnet.'
    invalid.focus()
    return
  }
  const form = event.currentTarget
  window.trackSEscapes?.('planner_complete', { destination: plannerValue('destination') || null })
  setSubmitting(form, true)
  submitLead(createLeadPayload({ form, kind: 'travel-planner' }))
    .then(result => showLeadResult(form, result))
    .catch(() => showLeadError(form))
    .finally(() => setSubmitting(form, false))
})
qs('[data-contact-form]')?.addEventListener('submit', event => {
  event.preventDefault()
  const form = event.currentTarget
  form.dataset.cta = form.querySelector('[type="submit"]')?.textContent.trim() || 'Envoyer ma demande'
  setSubmitting(form, true)
  submitLead(createLeadPayload({ form, kind: 'general-contact' }))
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
