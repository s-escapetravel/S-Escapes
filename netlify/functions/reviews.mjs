import { RequestError, assertOrigin, emailIsValid, escapeHtml, getRepositoryJson, json, listRepositoryFiles, paragraph, parseJson, putRepositoryFile, reviewId, sendResend, text } from './lib/shared.mjs'

const MAX_PHOTO_BYTES = 3 * 1024 * 1024
const ownerEmail = () => process.env.LEAD_RECIPIENT || 'escapes.travelplanner@gmail.com'
const siteUrl = () => (process.env.SITE_URL || 'https://s-escapes.fr').replace(/\/$/, '')

const imageType = (type, buffer) => {
  const signatures = {
    'image/jpeg': buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])),
    'image/png': buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
    'image/webp': buffer.subarray(0, 4).toString() === 'RIFF' && buffer.subarray(8, 12).toString() === 'WEBP'
  }
  return signatures[type] ? type : ''
}

const decodePhoto = (photo, index) => {
  const type = text(photo?.type, 30)
  const match = String(photo?.dataUrl || '').match(/^data:(image\/(?:jpeg|png|webp));base64,([a-zA-Z0-9+/=]+)$/)
  if (!match || match[1] !== type) throw new RequestError(400, `La photo ${index + 1} est invalide.`)
  const buffer = Buffer.from(match[2], 'base64')
  if (!buffer.length || buffer.length > MAX_PHOTO_BYTES || !imageType(type, buffer)) throw new RequestError(400, `La photo ${index + 1} est invalide ou trop lourde.`)
  return { buffer, extension: type === 'image/jpeg' ? 'jpg' : type.split('/')[1] }
}

const reviewInput = payload => {
  const name = text(payload.name, 80)
  const email = text(payload.email, 160).toLowerCase()
  const trip = text(payload.trip, 100)
  const message = text(payload.message, 1600)
  const rating = Number(payload.rating)
  const photos = Array.isArray(payload.photos) ? payload.photos : []
  if (!name || !emailIsValid(email) || !trip || message.length < 30 || ![3, 4, 5].includes(rating) || payload.consent !== true) throw new RequestError(400, 'Merci de compléter les informations demandées.')
  if (photos.length > 3) throw new RequestError(400, 'Trois photos maximum sont acceptées.')
  if (photos.length && payload.photoConsent !== true) throw new RequestError(400, 'Votre autorisation est nécessaire pour joindre des photos.')
  return { name, email, trip, message, rating, photos, photoConsent: payload.photoConsent === true, context: payload.context || {} }
}

const reviewNotification = review => ({
  subject: `Avis à modérer — ${review.trip} — ${review.name}`,
  replyTo: review.email,
  textBody: `${review.name} a laissé un avis (${review.rating}/5) pour ${review.trip}.\n\n${review.message}\n\nModérer : ${siteUrl()}/admin/`,
  html: `<!doctype html><html><body style="margin:0;background:#f5f1e8;font-family:Arial,sans-serif;color:#21372a"><main style="max-width:680px;margin:24px auto;background:#fff;padding:32px"><p style="margin:0 0 12px;color:#a97920;font-size:12px;letter-spacing:1.6px;text-transform:uppercase">Avis à modérer</p><h1 style="margin:0 0 12px;font-size:28px">${escapeHtml(review.trip)}</h1><p style="margin:0 0 20px;color:#5b675e">${escapeHtml(review.name)} · ${escapeHtml(review.rating)}/5</p><blockquote style="margin:0;padding:18px 20px;border-left:3px solid #c9962e;background:#f8f5ed;font-size:17px;line-height:1.6">${paragraph(review.message)}</blockquote><p style="margin:28px 0 0"><a href="${siteUrl()}/admin/" style="display:inline-block;padding:12px 18px;background:#163c31;color:#fff;text-decoration:none">Relire et décider dans Tina</a></p></main></body></html>`
})

const createReview = async request => {
  assertOrigin(request)
  const review = reviewInput(await parseJson(request))
  const id = reviewId()
  const images = review.photos.map(decodePhoto)
  const photos = images.map((image, index) => `/uploads/reviews/${id}-${index + 1}.${image.extension}`)
  await Promise.all(images.map((image, index) => putRepositoryFile({
    path: `public${photos[index]}`,
    content: image.buffer,
    message: `chore(reviews): add submitted image ${id}-${index + 1}`
  })))
  const document = {
    status: 'pending',
    name: review.name,
    email: review.email,
    trip: review.trip,
    rating: review.rating,
    message: review.message,
    photoConsent: review.photoConsent,
    photos,
    submittedAt: new Date().toISOString(),
    sourcePage: text(review.context.page, 200)
  }
  await putRepositoryFile({
    path: `content/testimonials/${id}.json`,
    content: JSON.stringify(document, null, 2) + '\n',
    message: `chore(reviews): add pending review ${id}`
  })
  try {
    await sendResend({ to: ownerEmail(), ...reviewNotification(review) })
  } catch (error) {
    console.error('Review stored but moderation e-mail failed', error)
  }
  return json({ received: true }, 201)
}

const approvedReviews = async () => {
  const files = await listRepositoryFiles('content/testimonials')
  const documents = await Promise.all(files.filter(file => file.type === 'file' && file.name.endsWith('.json')).slice(0, 80).map(file => getRepositoryJson(file.path)))
  const reviews = documents
    .filter(review => review.status === 'approved')
    .sort((left, right) => String(right.submittedAt).localeCompare(String(left.submittedAt)))
    .slice(0, 12)
    .map(review => ({ author: text(review.name, 80), quote: text(review.message, 1600), trip: text(review.trip, 100), rating: Number(review.rating), photos: review.photoConsent ? (Array.isArray(review.photos) ? review.photos : []) : [] }))
  return json({ reviews })
}

export default async request => {
  try {
    if (request.method === 'GET') return await approvedReviews()
    if (request.method === 'POST') return await createReview(request)
    return json({ error: 'Method not allowed' }, 405)
  } catch (error) {
    const status = error instanceof RequestError ? error.status : 500
    if (status >= 500) console.error(error)
    return json({ error: error instanceof RequestError ? error.message : 'Une erreur est survenue.' }, status)
  }
}
