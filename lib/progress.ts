import { PhraseStatus } from '@/data/phrases'

export interface UserProfile {
  token: string
  name: string
  createdAt: string
}

export interface Progress {
  [phraseId: string]: PhraseStatus
}

const USERS_KEY = 'morocco_users'
const PROGRESS_PREFIX = 'morocco_progress_'

export function getUser(token: string): UserProfile | null {
  if (typeof window === 'undefined') return null
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}')
  return users[token] || null
}

export function getAllUsers(): UserProfile[] {
  if (typeof window === 'undefined') return []
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}')
  return Object.values(users)
}

export function createUser(name: string): UserProfile {
  const token = generateToken(name)
  const user: UserProfile = { token, name, createdAt: new Date().toISOString() }
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}')
  users[token] = user
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return user
}

export function getProgress(token: string): Progress {
  if (typeof window === 'undefined') return {}
  return JSON.parse(localStorage.getItem(PROGRESS_PREFIX + token) || '{}')
}

export function setPhrasStatus(token: string, phraseId: string, status: PhraseStatus) {
  const progress = getProgress(token)
  progress[phraseId] = status
  localStorage.setItem(PROGRESS_PREFIX + token, JSON.stringify(progress))
}

export function getCategoryProgress(token: string, phraseIds: string[]) {
  const progress = getProgress(token)
  const total = phraseIds.length
  const gotIt = phraseIds.filter(id => progress[id] === 'got-it').length
  const learning = phraseIds.filter(id => progress[id] === 'learning').length
  return { total, gotIt, learning, pct: total > 0 ? Math.round((gotIt / total) * 100) : 0 }
}

function generateToken(name: string): string {
  const clean = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z-]/g, '')
  const rand = Math.random().toString(36).slice(2, 8)
  return `${clean}-${rand}`
}
