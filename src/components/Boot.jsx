import { useEffect, useRef, useState } from 'react'
import { live, reducedMotion, store, useStore } from '../lib/store'
import { sfx } from '../lib/sound'

const LINES = [
  ['> ', 'initiating secure channel to abdullah.sec:443'],
  ['> ', 'TLS 1.3 · ClientHello · x25519 · aes-256-gcm'],
  ['> ', 'ServerHello · certificate CN=abdullah.sec', ' [verified]'],
  ['> ', 'deriving session keys ', '.................. ok'],
  ['> ', 'payload: 5 files · status ', 'ENCRYPTED'],
]

export const CLEARANCES = [
  { id: 'recruiter', key: '1', label: 'Recruiter', desc: 'The 30-second brief, then the highlights' },
  { id: 'engineer', key: '2', label: 'Engineer', desc: 'Full technical depth, plus hidden flags' },
  { id: 'visitor', key: '3', label: 'Visitor', desc: 'Just here to look around' },
]

export default function Boot() {
  const mode = useStore((s) => s.mode)
  const sound = useStore((s) => s.sound)
  // A returning visitor in the same tab session skips straight past the handshake.
  const [resumed] = useState(() => !!store.get().mode)
  const [shown, setShown] = useState(resumed || reducedMotion ? LINES.length : 0)
  const [leaving, setLeaving] = useState(false)
  const [gone, setGone] = useState(false)
  const first = useRef(null)

  const enter = (id) => {
    if (leaving) return
    store.set({ mode: id, booted: true })
    live.decrypt = 1
    if (store.get().sound) sfx.boot()
    setLeaving(true)
    setTimeout(() => setGone(true), 1100)
  }

  useEffect(() => {
    if (resumed) {
      store.set({ booted: true })
      live.decrypt = 1
      setGone(true)
      return
    }
    document.documentElement.classList.add('is-locked')
    return () => document.documentElement.classList.remove('is-locked')
  }, [resumed])

  useEffect(() => {
    if (gone) document.documentElement.classList.remove('is-locked')
  }, [gone])

  useEffect(() => {
    if (shown >= LINES.length) {
      first.current?.focus({ preventScroll: true })
      return
    }
    const t = setTimeout(() => setShown((s) => s + 1), shown === 0 ? 500 : 420)
    return () => clearTimeout(t)
  }, [shown])

  useEffect(() => {
    if (gone) return
    const onKey = (e) => {
      const c = CLEARANCES.find((c) => c.key === e.key)
      if (c && shown >= LINES.length) enter(c.id)
      else if (shown < LINES.length) setShown(LINES.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (gone) return null
  const ready = shown >= LINES.length

  return (
    <div className={`boot ${leaving ? 'is-leaving' : ''}`} onClick={() => !ready && setShown(LINES.length)} role="dialog" aria-modal="true" aria-label="Secure handshake">
      <div className="boot-inner mono">
        <div className="boot-lines" aria-live="polite">
          {LINES.slice(0, shown).map(([p, t, end], i) => (
            <div key={i} className="boot-line">
              <span className="dim">{p}</span>
              {t}
              {end && <span className={end.includes('ENCRYPTED') ? 'warn' : 'ok'}>{end}</span>}
            </div>
          ))}
          {!ready && <span className="cursor" />}
        </div>

        <div className={`boot-choose ${ready ? 'is-ready' : ''}`}>
          <p className="boot-q">
            {leaving ? (
              <>
                clearance <span className="ok">{mode}</span> · access granted · decrypting<span className="cursor" />
              </>
            ) : (
              'Select a clearance level to decrypt:'
            )}
          </p>
          <div className="boot-options">
            {CLEARANCES.map((c, i) => (
              <button key={c.id} ref={i === 0 ? first : null} className={`boot-option ${mode === c.id ? 'is-picked' : ''}`} onClick={() => enter(c.id)} disabled={!ready}>
                <span className="boot-key">[{c.key}]</span>
                <span className="boot-label">{c.label}</span>
                <span className="boot-desc">{c.desc}</span>
              </button>
            ))}
          </div>
          <button className="boot-sound" onClick={() => store.set({ sound: !sound })} disabled={!ready}>
            sound: <span className={sound ? 'ok' : 'dim'}>{sound ? 'on' : 'off'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
