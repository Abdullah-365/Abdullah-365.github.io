import { useState } from 'react'
import Section from './Section'
import DecryptText from './DecryptText'
import { education, experience, profile, skills } from '../data/content'
import { useInView } from '../lib/useScramble'

export function About() {
  return (
    <Section id="about" index="01" file="about.enc" dir="about/" title="Breaking things, then fixing them properly">
      <div className="about">
        <div className="about-text">
          {profile.about.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <div className="stats">
            {profile.stats.map((s) => (
              <div key={s.label} className="stat panel">
                <DecryptText as="span" text={s.value} className="stat-value mono" />
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="term panel mono" aria-label="whoami terminal">
          <div className="term-bar">
            <i />
            <i />
            <i />
            <span>visitor@abdullah.sec: ~</span>
          </div>
          <div className="term-body">
            <p>
              <span className="ok">$</span> whoami
            </p>
            <p className="out">abdullah</p>
            <p>
              <span className="ok">$</span> cat focus.txt
            </p>
            <p className="out">network security · DFIR · IAM · secure AI agents</p>
            <p>
              <span className="ok">$</span> cat status.txt
            </p>
            <p className="out">semester 5 of 8 · seeking co-op · part-time</p>
            <p>
              <span className="ok">$</span> uptime
            </p>
            <p className="out">5 semesters, 0 days without learning</p>
            <p>
              <span className="ok">$</span> <span className="cursor" />
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}

export function Experience() {
  return (
    <Section id="experience" index="03" file="experience.enc" dir="experience/" title="Event log" kicker="Pulled from the SIEM, newest first.">
      <ol className="log">
        {experience.map((e, i) => (
          <li key={e.role} className="log-row panel" style={{ '--i': i }}>
            <div className="log-meta mono">
              <span className={`level ${e.level === 'ACTIVE' ? 'level-active' : ''}`}>{e.level}</span>
              <span className="dim">
                {e.start} → {e.end}
              </span>
            </div>
            <div className="log-main">
              <DecryptText as="h3" text={e.role} className="log-role" />
              <p className="log-org mono">
                {e.org} {e.place && <span className="dim">· {e.place}</span>}
              </p>
              <ul className="log-details">
                {e.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>

      <div className="chain">
        <p className="chain-head mono">
          <span className="dim">$</span> openssl verify -show_chain education.pem
        </p>
        <ol className="chain-list">
          {[...education].reverse().map((ed, i) => (
            <li key={ed.title} className="chain-cert panel">
              <span className="tag mono">{i === 0 ? 'ROOT CA' : 'INTERMEDIATE'}</span>
              <strong>{ed.title}</strong>
              <span className="dim">
                {ed.org} · {ed.when}
              </span>
            </li>
          ))}
          <li className="chain-cert chain-leaf panel">
            <span className="tag mono">LEAF</span>
            <strong>abdullah.sec</strong>
            <span className="dim">you are here</span>
          </li>
        </ol>
        <p className="chain-ok mono">
          education.pem: <span className="ok">OK</span>
        </p>
      </div>
    </Section>
  )
}

export function Skills() {
  const [ref, seen] = useInView({ threshold: 0.2 })
  const total = skills.reduce((n, s) => n + s.items.length, 0)
  return (
    <Section id="skills" index="04" file="skills.enc" dir="skills/" title="Open ports" kicker={`A service scan of everything I run: ${total} tools across ${skills.length} services.`}>
      <div ref={ref} className={`nmap term panel mono ${seen ? 'is-scanning' : ''}`}>
        <div className="term-bar">
          <i />
          <i />
          <i />
          <span>nmap</span>
        </div>
        <div className="term-body">
          <p>
            <span className="ok">$</span> nmap -sV -p- abdullah.sec
          </p>
          <p className="dim">Starting Nmap 7.95 · Nmap scan report for abdullah.sec (127.0.0.1)</p>
          <p className="dim">Host is up (0.00042s latency).</p>
          <div className="nmap-table" role="table" aria-label="Skills by category">
            <div className="nmap-row nmap-th" role="row">
              <span role="columnheader">PORT</span>
              <span role="columnheader">STATE</span>
              <span role="columnheader">SERVICE</span>
              <span role="columnheader">VERSION</span>
            </div>
            {skills.map((s, i) => (
              <div key={s.port} className="nmap-row" role="row" style={{ '--i': i }}>
                <span role="cell" className="nmap-port">{s.port}</span>
                <span role="cell" className="ok">open</span>
                <span role="cell" className="nmap-svc">
                  {s.service}
                  <em>{s.label}</em>
                </span>
                <span role="cell" className="nmap-items">
                  {s.items.map((it) => (
                    <b key={it}>{it}</b>
                  ))}
                </span>
              </div>
            ))}
          </div>
          <p className="dim nmap-done">
            Service detection performed. {skills.length} services up, 0 filtered.
            <br />
            Nmap done: 1 IP address (1 host up) scanned in 5 semesters.
          </p>
        </div>
      </div>
    </Section>
  )
}

export function Contact() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {}
  }
  return (
    <Section id="contact" index="05" file="contact.enc" dir="contact/" title="Open a secure channel" kicker={`I'm looking for ${profile.seeking}. Recruiters, engineers and fellow CTF players are all welcome.`}>
      <div className="contact">
        <div className="contact-main panel">
          <p className="mono dim">primary endpoint</p>
          <a className="contact-email" href={`mailto:${profile.email}`}>
            <DecryptText text={profile.email} duration={1100} />
          </a>
          <div className="contact-cta">
            <a className="btn btn-primary" href={`mailto:${profile.email}`}>
              Send an email
            </a>
            <button className="btn" onClick={copy}>
              {copied ? 'Copied ✓' : 'Copy address'}
            </button>
          </div>
        </div>
        <div className="contact-side">
          <a className="endpoint panel" href={profile.github} target="_blank" rel="noreferrer">
            <span className="mono dim">github</span>
            <strong>Abdullah-365</strong>
            <span aria-hidden>↗</span>
          </a>
          <a className="endpoint panel" href={profile.linkedin} target="_blank" rel="noreferrer">
            <span className="mono dim">linkedin</span>
            <strong>abdullah3650</strong>
            <span aria-hidden>↗</span>
          </a>
          <div className="transmission panel mono" aria-label="Intercepted transmission">
            <p className="dim">-----BEGIN INTERCEPTED TRANSMISSION-----</p>
            <p className="hexdump">666c61677b6833785f6d34726b735f7468335f737030747d</p>
            <p className="dim">-----END INTERCEPTED TRANSMISSION-----</p>
          </div>
        </div>
      </div>
    </Section>
  )
}

export function Footer() {
  return (
    <footer className="footer mono">
      <span>© {new Date().getFullYear()} Abdullah</span>
      <span className="dim">built from scratch with React Three Fiber · no trackers, no cookies</span>
      <a href="#hero">back to the core ↑</a>
    </footer>
  )
}
