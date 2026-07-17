/*
 * S Escapes lead delivery configuration
 *
 * Netlify Functions serve these same-origin paths. This public file contains
 * no credentials: e-mail delivery and moderation run server-side.
 */
window.S_ESCAPES_LEAD_CONFIG = {
  mode: 'endpoint',
  endpoint: '/.netlify/functions/leads',
  reviewEndpoint: '/.netlify/functions/reviews',
  method: 'POST',
  headers: {},
  internalEmail: 'escapes.travelplanner@gmail.com',
  responseTime: 'Réponse sous 24 h ouvrées'
}
