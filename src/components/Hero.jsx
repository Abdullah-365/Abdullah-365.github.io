import DecryptText from './DecryptText'
import { brief, profile } from '../data/content'
import { store, useStore } from '../lib/store'

export function Hero() {
  const booted = useStore((s) => s.booted)
  const mode = useStore((s) => s.mode)
  return (
    <section id="hero" className="hero">
      <div className={`hero-inner ${booted ? 'is-on' : ''}`}>
        <p className={`hero-kicker mono fade ${booted ? 'in' : ''}`}>
          <span className="dim">//</span> identity decrypted <span className="dim">·</span> clearance <span className="ok">{mode || 'pending'}</span>
        </p>
        <DecryptText as="h1" text={profile.name} active={booted} duration={1500} delay={500} tick className="hero-name" />
        <DecryptText as="p" text={profile.tagline.join('  ·  ')} active={booted} duration={1200} delay={1300} className="hero-tagline" />
        <p className={`hero-meta mono fade d2 ${booted ? 'in' : ''}`}>
          {profile.location} <span className="dim">·</span> {profile.school} <span className="dim">·</span> <span className="ok">● open to co-op</span>
        </p>
        <div className={`hero-cta fade d3 ${booted ? 'in' : ''}`}>
          <a href="#projects" className="btn btn-primary">
            Decrypt the files
          </a>
          <a href="#contact" className="btn">
            Open a secure channel
          </a>
        </div>
      </div>
      <p className={`hero-hint mono fade d4 ${booted ? 'in' : ''}`}>
        5 encrypted files in orbit · click one, or scroll <span className="bounce">↓</span>
      </p>
    </section>
  )
}

// A short strip under the hero that changes with the visitor's clearance level.
export function Brief() {
  const mode = useStore((s) => s.mode)
  const flags = useStore((s) => s.flags)
  if (mode === 'recruiter')
    return (
      <aside className="brief panel" aria-label="Recruiter brief">
        <div className="brief-head mono">
          <span className="tag">CLEARANCE: RECRUITER</span>
          <span className="dim">30-second brief</span>
        </div>
        <p className="brief-seeking">
          Seeking <strong>{profile.seeking}</strong>.
        </p>
        <ul className="brief-list">
          {brief.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <div className="brief-cta">
          <a className="btn btn-primary" href={`mailto:${profile.email}`}>
            Email me
          </a>
          <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="btn" href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </aside>
    )
  if (mode === 'engineer')
    return (
      <aside className="brief brief-slim panel mono" aria-label="Engineer mode">
        <span className="tag">CLEARANCE: ENGINEER</span>
        <span>
          Technical details are expanded on every file. There are <span className="ok">5 flags</span> hidden on this site ({flags.length}/5 found).{' '}
          <button className="link" onClick={() => store.set({ terminal: true })}>
            Open the terminal
          </button>
        </span>
      </aside>
    )
  return (
    <aside className="brief brief-slim panel mono" aria-label="Visitor mode">
      <span className="tag">CLEARANCE: VISITOR</span>
      <span>Look around. You can change your clearance level from the top bar at any time.</span>
    </aside>
  )
}
