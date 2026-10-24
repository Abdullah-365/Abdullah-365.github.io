import { useSyncExternalStore } from 'react'

// Tiny global store: React reads it through useStore, the 3D scene reads `store.get()` every frame.

const read = (key, fallback) => {
  try {
    const v = localStorage.getItem(key)
    return v === null ? fallback : JSON.parse(v)
  } catch {
    return fallback
  }
}
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}
const readSession = (key) => {
  try {
    return sessionStorage.getItem(key)
  } catch {
    return null
  }
}

// Stored values can be edited by anyone, so only accept the shapes the app expects.
const MODES = ['recruiter', 'engineer', 'visitor']
const validMode = (m) => (MODES.includes(m) ? m : null)
const validFlags = (f) => (Array.isArray(f) ? [...new Set(f.filter((i) => Number.isInteger(i) && i >= 0 && i < 5))] : [])

let state = {
  mode: validMode(readSession('clearance')),
  booted: false,
  sound: read('sound', false) === true,
  unlocked: [], // section ids that have been decrypted
  active: 'hero',
  flags: validFlags(read('flags', [])), // indexes of captured flags
  toast: null, // { id, title, text }
  terminal: false,
}

const listeners = new Set()

export const store = {
  get: () => state,
  set(patch) {
    state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) }
    if ('sound' in patch) write('sound', state.sound)
    if ('flags' in patch) write('flags', state.flags)
    if ('mode' in patch && state.mode) {
      try {
        sessionStorage.setItem('clearance', state.mode)
      } catch {}
    }
    listeners.forEach((l) => l())
  },
  subscribe(l) {
    listeners.add(l)
    return () => listeners.delete(l)
  },
}

export function useStore(selector) {
  return useSyncExternalStore(store.subscribe, () => selector(state))
}

export function unlock(id) {
  if (!state.unlocked.includes(id)) store.set({ unlocked: [...state.unlocked, id] })
}

// Scroll and motion values the scene samples each frame without re-rendering React.
export const live = {
  scroll: 0, // px
  heroProgress: 0, // 0 at top, 1 after one viewport
  velocity: 0,
  decrypt: 0, // 0 = ciphertext cloud, 1 = ordered core
  pulse: 0, // spikes when something unlocks
}

export const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const lowPower =
  typeof window !== 'undefined' &&
  (window.matchMedia('(max-width: 768px)').matches || (navigator.hardwareConcurrency || 8) <= 4)
