import { store } from './store'
import { sfx } from './sound'

// The checker compares SHA-256 hashes, so there's no list of answers in the bundle.
// (Flags 2 and 4 do ship base64-encoded, because the page has to reveal them.)
export const FLAGS = [
  { hash: '29aa13910b32e988ab385623ecb46122ba0bb3466cd2bc0fbfbf330e5288f674', name: 'source', hint: 'Every page has a source. Read it.' },
  { hash: '1ed3fe384269c9ba6af0302ced8a074ae94ce0d97bc72e3b851c4215e5f4d88c', name: 'console', hint: 'Developers talk to the console. Some of them speak base64.' },
  { hash: '510aea2372bae74f403afa047e561e40ba8d162f2085e69b0069740e33ab9f03', name: 'crawler', hint: 'Crawlers get their own instructions.' },
  { hash: '4b6b64efc746fd9b030c4ae7966cf15280dc1cfabd35410f71a369ac1617e324', name: 'core dump', hint: 'The core responds to persistence. Knock five times.' },
  { hash: 'f1121d4dee0f8a39366a74311608305a5d981fba04490838d244b7c85d90bb2b', name: 'hex', hint: 'Not everything in the contact section is meant for humans.' },
]

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

// Returns { ok, index, already, all }.
export async function submitFlag(raw) {
  // crypto.subtle only exists on HTTPS and localhost.
  if (!globalThis.crypto?.subtle) return { ok: false }
  const hash = await sha256(raw.trim().slice(0, 200))
  const index = FLAGS.findIndex((f) => f.hash === hash)
  const { flags, sound } = store.get()
  if (index === -1) {
    if (sound) sfx.deny()
    return { ok: false }
  }
  if (flags.includes(index)) return { ok: true, index, already: true, all: flags.length === FLAGS.length }
  const next = [...flags, index]
  store.set({ flags: next })
  const all = next.length === FLAGS.length
  if (sound) all ? sfx.root() : sfx.unlock()
  return { ok: true, index, all }
}

// Flag 4 is revealed in-page, so it's stored lightly obfuscated rather than as plain text.
export const coreDump = () => atob('ZmxhZ3tjMHIzX2R1bXBfNGNxdTFyM2R9')

export function consoleBanner() {
  const s = 'color:#7CF2B0;font-family:monospace;font-size:12px'
  console.log(
    '%c\n   ___ _      _              ___\n  / __(_)_ __| |_  ___ _ _  / __|___ _ _ ___\n | (__| | \'_ \\ \' \\/ -_) \'_|| (__/ _ \\ \'_/ -_)\n  \\___|_| .__/_||_\\___|_|   \\___\\___/_| \\___|\n        |_|\n',
    s,
  )
  console.log('%cHey, you opened the console. You might be my kind of person.', s)
  console.log('%cA message for you: ZmxhZ3tjMG5zMGwzX3doMXNwM3JzfQ==', s)
  console.log('%cSubmit flags with the terminal button in the bottom right.', 'color:#5c8f74;font-family:monospace')
}
