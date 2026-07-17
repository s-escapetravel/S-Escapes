import { RequestError, assertOrigin, emailIsValid, escapeHtml, json, paragraph, parseJson, sendResend, text } from './lib/shared.mjs'

const ownerEmail = () => process.env.LEAD_RECIPIENT || 'escapes.travelplanner@gmail.com'

const labels = {
  inspiration: 'Inspiration', inspirationUrl: 'Lien d’inspiration', destination: 'Destination', departureCity: 'Ville de départ',
  dates: 'Dates souhaitées', period: 'Période souhaitée', duration: 'Durée', budget: 'Budget par personne', adults: 'Adultes',
  children: 'Enfants', pace: 'Rythme', name: 'Nom', email: 'E-mail', phone: 'Téléphone', contactPreference: 'Préférence de contact',
  contactTime: 'Créneau préféré', notes: 'Notes', message: 'Message', project: 'Projet', type: 'Type de voyage'
}

const leadEmail = payload => {
  const fields = payload.fields && typeof payload.fields === 'object' ? payload.fields : {}
  const name = text(fields.name, 80)
  const email = text(fields.email, 160)
  const travelType = text(payload.travelType || payload.kind, 120) || 'Projet de voyage'
  const rows = Object.entries(labels).filter(([key]) => text(fields[key], 180)).map(([key, label]) => `<tr><th style="padding:10px 14px 10px 0;text-align:left;vertical-align:top;color:#5b675e;font-size:12px;letter-spacing:.6px;text-transform:uppercase">${escapeHtml(label)}</th><td style="padding:10px 0;border-bottom:1px solid #ebe5da;line-height:1.5">${paragraph(fields[key])}</td></tr>`).join('')
  return {
    subject: `Nouveau projet — ${travelType}${name ? ` — ${name}` : ''}`,
    replyTo: emailIsValid(email) ? email : undefined,
    textBody: payload.notifications?.internalBrief?.text || `Nouveau projet : ${travelType}`,
    html: `<!doctype html><html><body style="margin:0;background:#f5f1e8;font-family:Arial,sans-serif;color:#21372a"><main style="max-width:680px;margin:24px auto;background:#fff;padding:32px"><p style="margin:0 0 12px;color:#a97920;font-size:12px;letter-spacing:1.6px;text-transform:uppercase">Nouveau projet S Escapes</p><h1 style="margin:0 0 18px;font-size:28px">${escapeHtml(travelType)}</h1><p style="margin:0 0 24px;color:#5b675e">Reçu le ${escapeHtml(new Date().toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' }))}</p><table style="width:100%;border-collapse:collapse">${rows}</table><p style="margin:26px 0 0;padding-top:20px;border-top:1px solid #d8d1c4;color:#5b675e;font-size:13px">Répondez directement à cet e-mail pour contacter ${escapeHtml(name || 'le voyageur')}.</p></main></body></html>`
  }
}

export default async request => {
  try {
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
    assertOrigin(request)
    const payload = await parseJson(request)
    const fields = payload.fields && typeof payload.fields === 'object' ? payload.fields : {}
    const name = text(fields.name, 80)
    const email = text(fields.email, 160)
    if (!name || !emailIsValid(email) || payload.consent?.marketingOrContact !== true) throw new RequestError(400, 'Merci de renseigner vos coordonnées et votre consentement.')
    await sendResend({ to: ownerEmail(), ...leadEmail(payload) })
    const confirmation = payload.notifications?.customerConfirmation
    if (confirmation?.to === email) {
      await sendResend({
        to: email,
        subject: text(confirmation.subject, 180),
        textBody: text(confirmation.text, 1600),
        html: `<!doctype html><html><body style="margin:0;background:#f5f1e8;font-family:Arial,sans-serif;color:#21372a"><main style="max-width:640px;margin:24px auto;background:#fff;padding:32px"><h1 style="font-size:28px">Votre projet est entre de bonnes mains.</h1><p style="font-size:16px;line-height:1.65">${paragraph(confirmation.text)}</p><p style="margin-top:28px;color:#5b675e">S Escapes</p></main></body></html>`
      })
    }
    return json({ delivered: true }, 201)
  } catch (error) {
    const status = error instanceof RequestError ? error.status : 500
    if (status >= 500) console.error(error)
    return json({ error: error instanceof RequestError ? error.message : 'Une erreur est survenue.' }, status)
  }
}
