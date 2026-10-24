import { useEffect, useState } from 'react'
import DecryptText from './DecryptText'
import { live, reducedMotion, store, unlock, useStore } from '../lib/store'
import { useInView } from '../lib/useScramble'
import { sfx } from '../lib/sound'

const hex = () => Math.random().toString(16).slice(2, 10)

// A page section that "decrypts" the first time it scrolls into view.
export default function Section({ id, index, file, dir, title, kicker, children }) {
  const [ref, seen] = useInView({ threshold: 0.12 })
  const decrypted = useStore((s) => s.unlocked.includes(id))
  const [progress, setProgress] = useState(0)
  const [digest, setDigest] = useState('')

  useEffect(() => {
    if (!seen || decrypted) return
    if (reducedMotion) {
      unlock(id)
      return
    }
    let raf
    const start = performance.now()
    const step = (now) => {
      const p = Math.min(100, Math.round(((now - start) / 750) * 100))
      setProgress(p)
      setDigest(hex() + hex())
      if (p < 100) raf = requestAnimationFrame(step)
      else {
        unlock(id)
        live.pulse = 0.7
        if (store.get().sound) sfx.unlock()
      }
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [seen, decrypted, id])

  return (
    <section id={id} ref={ref} className={`section ${decrypted ? 'is-decrypted' : ''}`} aria-labelledby={`${id}-title`}>
      <header className="file-head mono">
        <span className="file-index">{index}</span>
        <span className="file-name">{decrypted ? dir : file}</span>
        <span className="file-bar" aria-hidden>
          <span style={{ width: `${decrypted ? 100 : progress}%` }} />
        </span>
        <span className="file-status">
          {decrypted ? (
            <>
              <span className="ok">DECRYPTED</span>
              <span className="file-digest"> sha256:{digest.slice(0, 12) || 'verified'}</span>
            </>
          ) : (
            <span>DECRYPTING {progress}%</span>
          )}
        </span>
      </header>
      <div id={`${id}-title`}>
        <DecryptText as="h2" text={title} active={decrypted} className="section-title" />
      </div>
      {kicker && <p className="section-kicker">{kicker}</p>}
      <div className="section-body">{children}</div>
    </section>
  )
}
