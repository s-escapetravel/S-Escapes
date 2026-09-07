/*
 * S Escapes lead delivery configuration
 *
 * Set mode to "endpoint" and supply a secure HTTPS endpoint when a form
 * provider, CRM, or serverless function is ready. This public file contains no
 * credentials: authenticate the receiving endpoint server-side where possible.
 */
window.S_ESCAPES_LEAD_CONFIG = {
  mode: 'demo',
  endpoint: '',
  method: 'POST',
  headers: {},
  internalEmail: 'sescapes.travelplanner@gmail.com',
  responseTime: 'Réponse sous 24 h ouvrées'
}
