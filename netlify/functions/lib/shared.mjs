import crypto from 'node:crypto'

export const MAX_BODY_BYTES = 11 * 1024 * 1024

export class RequestError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export const escapeHtml = value => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;')

export const text = (value, max = 500) => String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, max)
export const paragraph = value => escapeHtml(value).replace(/\n/g, '<br />')
export const emailIsValid = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export const json = (body, status = 200) => Response.json(body, {
  status,
  headers: { 'Cache-Control': 'no-store' }
})

export const assertOrigin = request => {
  const origin = request.headers.get('origin')
  const allowed = process.env.SITE_ORIGIN
  if (origin && allowed && origin !== allowed) throw new RequestError(403, 'Origine non autorisée.')
}

export const parseJson = async request => {
  const length = Number(request.headers.get('content-length') || 0)
  if (length > MAX_BODY_BYTES) throw new RequestError(413, 'La demande est trop volumineuse.')
  try {
    return await request.json()
  } catch {
    throw new RequestError(400, 'La demande est invalide.')
  }
}

export const sendResend = async ({ to, replyTo, subject, textBody, html }) => {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  if (!apiKey || !from) throw new RequestError(503, 'La messagerie est en cours de configuration.')
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, reply_to: replyTo || undefined, subject, text: textBody, html })
  })
  if (!response.ok) {
    console.error('Resend delivery failed', response.status, await response.text())
    throw new RequestError(502, 'L’e-mail n’a pas pu être transmis.')
  }
}

const githubConfig = () => {
  const token = process.env.GITHUB_CONTENTS_TOKEN
  const repository = process.env.GITHUB_REPOSITORY
  if (!token || !repository) throw new RequestError(503, 'La modération est en cours de configuration.')
  return { token, repository, branch: process.env.GITHUB_BRANCH || 'main' }
}

const githubRequest = async (path, options = {}) => {
  const { token, repository } = githubConfig()
  const response = await fetch(`https://api.github.com/repos/${repository}/contents/${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...options.headers
    }
  })
  if (!response.ok) {
    console.error('GitHub content API failed', response.status, await response.text())
    throw new RequestError(502, 'Le stockage de l’avis n’a pas pu être finalisé.')
  }
  return response
}

export const putRepositoryFile = async ({ path, content, message }) => {
  const { branch } = githubConfig()
  await githubRequest(path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, content: Buffer.from(content).toString('base64'), branch })
  })
}

export const listRepositoryFiles = async path => {
  const { branch } = githubConfig()
  const response = await githubRequest(`${path}?ref=${encodeURIComponent(branch)}`)
  const body = await response.json()
  return Array.isArray(body) ? body : []
}

export const getRepositoryJson = async path => {
  const { branch } = githubConfig()
  const response = await githubRequest(`${path}?ref=${encodeURIComponent(branch)}`)
  const body = await response.json()
  return JSON.parse(Buffer.from(body.content, 'base64').toString('utf8'))
}

export const reviewId = () => `${new Date().toISOString().slice(0, 10)}-${crypto.randomUUID()}`
