const defaultConfig = {
  mode: 'demo',
  endpoint: '',
  method: 'POST',
  headers: {},
  internalEmail: 'escapes.travelplanner@gmail.com',
  responseTime: ''
}

export const leadConfig = () => ({ ...defaultConfig, ...(window.S_ESCAPES_LEAD_CONFIG || {}) })

const value = (data, name) => String(data.get(name) || '').trim()
const queryContext = () => Object.fromEntries(new URLSearchParams(location.search).entries())
const line = (label, content) => `${label} : ${content || '—'}`

const confirmationCopy = ({ firstName, destination, travelType, responseTime }) => ({
  subject: 'Votre demande S Escapes est bien reçue',
  text: `Bonjour ${firstName || ''},\n\nMerci de nous avoir confié votre projet${destination ? ` autour de ${destination}` : ''}. Notre équipe prépare une première réponse${responseTime ? ` — ${responseTime.toLowerCase()}` : ''}.\n\nÀ très bientôt,\nS Escapes`,
  preview: `Votre projet ${travelType || 'de voyage'} est entre de bonnes mains.`
})

export const createLeadPayload = ({ form, kind, extras = {} }) => {
  const data = new FormData(form)
  const config = leadConfig()
  const name = value(data, 'name')
  const destination = extras.destination || value(data, 'destination')
  const travelType = extras.travelType || value(data, 'project') || value(data, 'type') || kind
  const fields = Object.fromEntries([...data.entries()].map(([key, fieldValue]) => [key, String(fieldValue).trim()]))
  const firstName = name.split(/\s+/)[0]
  const internalBrief = [
    'NOUVEAU LEAD S ESCAPES',
    line('Type', travelType),
    line('Source', `${location.pathname}${location.search}`),
    '',
    'VOYAGE',
    line('Inspiration', value(data, 'inspiration')),
    line('URL d’inspiration', value(data, 'inspirationUrl')),
    line('Destination', destination),
    line('Ville de départ', value(data, 'departureCity')),
    line('Dates', value(data, 'dates') || value(data, 'period')),
    line('Durée', value(data, 'duration')),
    line('Budget', value(data, 'budget')),
    line('Voyageurs', [value(data, 'adults'), value(data, 'children')].filter(Boolean).join(' adultes/enfants')),
    line('Rythme', value(data, 'pace')),
    '',
    'CONTACT',
    line('Nom', name),
    line('E-mail', value(data, 'email')),
    line('Téléphone', value(data, 'phone')),
    line('Préférence', value(data, 'contactPreference')),
    line('Créneau', value(data, 'contactTime')),
    '',
    'NOTES',
    value(data, 'notes') || value(data, 'message') || '—'
  ].join('\n')

  return {
    schemaVersion: 's-escapes.lead.v1',
    submittedAt: new Date().toISOString(),
    kind,
    travelType,
    fields,
    context: {
      page: location.pathname,
      url: location.href,
      referrer: document.referrer || null,
      query: queryContext(),
      cta: extras.context?.cta || form.dataset.cta || null,
      ...extras.context
    },
    consent: {
      marketingOrContact: data.get('consent') === 'on',
      privacyPolicy: '/confidentialite.html'
    },
    notifications: {
      internalBrief: {
        to: config.internalEmail,
        subject: `Nouveau projet — ${travelType}${name ? ` — ${name}` : ''}`,
        text: internalBrief
      },
      customerConfirmation: value(data, 'email') ? {
        to: value(data, 'email'),
        ...confirmationCopy({ firstName, destination, travelType, responseTime: config.responseTime })
      } : null
    }
  }
}

export const submitLead = async payload => {
  const config = leadConfig()
  if (config.mode !== 'endpoint' || !config.endpoint) {
    return { delivered: false, mode: 'demo' }
  }

  const response = await fetch(config.endpoint, {
    method: config.method || 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...config.headers
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) throw new Error(`Lead endpoint responded with ${response.status}`)
  return { delivered: true, mode: 'endpoint' }
}

export const responsePromise = () => leadConfig().responseTime

export const setSubmitting = (form, isSubmitting) => {
  const button = form.querySelector('[type="submit"]')
  if (button) {
    button.disabled = isSubmitting
    button.dataset.originalLabel ||= button.textContent
    button.textContent = isSubmitting ? 'Envoi en cours…' : button.dataset.originalLabel
  }
}

export const showLeadResult = (form, result, { onSuccess } = {}) => {
  const status = form.querySelector('.form-status')
  const success = form.parentElement?.querySelector('[data-form-success]')
  const promise = responsePromise()

  if (result.delivered) {
    form.hidden = true
    if (success) {
      success.hidden = false
      const responseTime = success.querySelector('[data-response-time]')
      if (responseTime) responseTime.textContent = promise ? `${promise}.` : ''
    }
    onSuccess?.()
    return
  }

  if (status) status.textContent = 'Mode démonstration : votre demande est préparée, mais aucun e-mail ni lead n’a été envoyé. Configurez un endpoint de réception pour activer l’envoi.'
}

export const showLeadError = form => {
  const status = form.querySelector('.form-status')
  if (status) status.textContent = 'Votre demande n’a pas pu être envoyée. Vérifiez votre connexion ou contactez-nous directement.'
}
