import { useEffect, useRef, useState } from 'react'
import { files } from '../data/content'
import { store, useStore } from '../lib/store'
import { sfx } from '../lib/sound'
import { CLEARANCES } from './Boot'

export default function Nav() {
  const unlocked = useStore((s) => s.unlocked)
  const active = useStore((s) => s.active)
  const mode = useStore((s) => s.mode)
  const sound = useStore((s) => s.sound)
  const booted = useStore((s) => s.booted)
  const [menu, setMenu] = useState(false)
  const [clr, setClr] = useState(false)
  const clrRef = useRef(null)

  useEffect(() => {
    if (!clr) return
    const close = (e) => !clrRef.current?.contains(e.target) && setClr(false)
    window.addEventListener('pointerdown', close)
    return () => window.removeEventListener('pointerdown', close)
  }, [clr])

  const pick = (id) => {
    store.set({ mode: id })
    setClr(false)
    if (sound) sfx.select()
  }

  return (
    <nav className={`nav ${booted ? 'is-on' : ''}`} aria-label="Main">
      <a href="#hero" className="nav-logo mono" onClick={() => setMenu(false)}>
        <span className="nav-diamond" aria-hidden>◆</span> abdullah<span className="dim">.sec</span>
      </a>

      <ul className={`nav-links mono ${menu ? 'is-open' : ''}`}>
        {files.map((f, i) => (
          <li key={f.id}>
            <a href={`#${f.id}`} className={`${active === f.id ? 'is-active' : ''} ${unlocked.includes(f.id) ? 'is-open' : ''}`} onClick={() => setMenu(false)}>
              <span className="dim">0{i + 1}</span> {unlocked.includes(f.id) ? f.dir : f.file}
            </a>
          </li>
        ))}
      </ul>

      <div className="nav-tools mono">
        <div className="clearance" ref={clrRef}>
          <button className="chip" onClick={() => setClr(!clr)} aria-expanded={clr} aria-haspopup="true">
            <span className="dim">clearance:</span> {mode || '—'} <span aria-hidden>▾</span>
          </button>
          {clr && (
            <div className="clearance-menu" role="menu">
              {CLEARANCES.map((c) => (
                <button key={c.id} role="menuitemradio" aria-checked={mode === c.id} className={mode === c.id ? 'is-on' : ''} onClick={() => pick(c.id)}>
                  {c.label}
                  <span>{c.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="chip" onClick={() => store.set({ sound: !sound })} aria-pressed={sound} aria-label="Toggle sound">
          {sound ? '♪ on' : '♪ off'}
        </button>
        <button className="chip nav-burger" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Menu">
          {menu ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  )
}
