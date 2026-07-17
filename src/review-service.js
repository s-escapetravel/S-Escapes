const MAX_FILES = 3
const MAX_FILE_BYTES = 8 * 1024 * 1024
const MAX_EDGE = 1600
const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

const config = () => ({
  endpoint: '/.netlify/functions/reviews',
  ...(window.S_ESCAPES_LEAD_CONFIG || {})
})

const readAsDataUrl = file => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = () => reject(new Error('lecture impossible'))
  reader.readAsDataURL(file)
})

const resizePhoto = async file => {
  const source = await readAsDataUrl(file)
  const image = await new Promise((resolve, reject) => {
    const element = new Image()
    element.onload = () => resolve(element)
    element.onerror = () => reject(new Error('image invalide'))
    element.src = source
  })
  const scale = Math.min(1, MAX_EDGE / Math.max(image.naturalWidth, image.naturalHeight))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
  return {
    name: file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 90) || 'souvenir.jpg',
    type: 'image/jpeg',
    dataUrl: canvas.toDataURL('image/jpeg', .84)
  }
}

export const approvedReviews = async () => {
  const response = await fetch(config().endpoint, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error('avis indisponibles')
  const body = await response.json()
  return Array.isArray(body.reviews) ? body.reviews : []
}

export const submitReview = async ({ form, photos }) => {
  const data = new FormData(form)
  const payload = {
    name: String(data.get('name') || '').trim(),
    email: String(data.get('email') || '').trim(),
    trip: String(data.get('trip') || '').trim(),
    rating: Number(data.get('rating')),
    message: String(data.get('message') || '').trim(),
    consent: data.get('consent') === 'on',
    photoConsent: data.get('photoConsent') === 'on',
    photos: await Promise.all(photos.map(resizePhoto)),
    context: { page: location.pathname, url: location.href }
  }
  const response = await fetch(config().endpoint, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!response.ok) throw new Error('avis non envoyé')
  return response.json()
}

const validateFiles = files => {
  if (files.length > MAX_FILES) return 'Choisissez au maximum trois photos.'
  const invalid = files.find(file => !ACCEPTED_TYPES.has(file.type) || file.size > MAX_FILE_BYTES)
  return invalid ? 'Ajoutez des images JPG, PNG ou WebP de moins de 8 Mo.' : ''
}

export const bindReviewForm = ({ form, onSuccess }) => {
  if (!form) return
  const fileInput = form.elements.photos
  const previews = form.querySelector('[data-review-previews]')
  const photoConsent = form.querySelector('[data-photo-consent]')
  const status = form.querySelector('.form-status')
  const submit = form.querySelector('[type="submit"]')
  let files = []

  const renderPreviews = () => {
    previews.replaceChildren()
    photoConsent.hidden = files.length === 0
    photoConsent.querySelector('input').required = files.length > 0
    files.forEach((file, index) => {
      const wrapper = document.createElement('figure')
      wrapper.className = 'review-preview'
      const image = document.createElement('img')
      image.src = URL.createObjectURL(file)
      image.alt = `Photo jointe ${index + 1}`
      image.onload = () => URL.revokeObjectURL(image.src)
      const remove = document.createElement('button')
      remove.type = 'button'
      remove.setAttribute('aria-label', `Retirer la photo ${index + 1}`)
      remove.textContent = '×'
      remove.addEventListener('click', () => {
        files = files.filter((_, current) => current !== index)
        renderPreviews()
      })
      wrapper.append(image, remove)
      previews.append(wrapper)
    })
  }

  fileInput.addEventListener('change', () => {
    const next = [...fileInput.files]
    const error = validateFiles(next)
    if (error) {
      status.textContent = error
      fileInput.value = ''
      return
    }
    status.textContent = ''
    files = next
    renderPreviews()
  })

  form.addEventListener('submit', async event => {
    event.preventDefault()
    if (!form.reportValidity()) return
    const photoError = validateFiles(files)
    if (photoError) {
      status.textContent = photoError
      return
    }
    submit.disabled = true
    submit.dataset.label ||= submit.textContent
    submit.textContent = 'Envoi de votre souvenir…'
    status.textContent = ''
    try {
      await submitReview({ form, photos: files })
      window.trackSEscapes?.('review_submit', { trip: form.elements.trip.value, photos: files.length })
      onSuccess?.()
    } catch {
      status.textContent = 'Votre avis n’a pas pu être envoyé. Réessayez dans un instant ou écrivez-nous directement.'
    } finally {
      submit.disabled = false
      submit.textContent = submit.dataset.label
    }
  })
}
