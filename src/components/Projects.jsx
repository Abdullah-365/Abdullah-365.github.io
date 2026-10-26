import { useEffect, useRef, useState } from 'react'
import Section from './Section'
import DecryptText from './DecryptText'
import { projects } from '../data/content'
import { store, useStore } from '../lib/store'
import { sfx } from '../lib/sound'

function Card({ p, i, onOpen, expanded }) {
  return (
    <article className="card panel" style={{ '--i': i }}>
      <div className="card-head mono">
        <span className="tag">{p.code}</span>
        <span className="dim">{p.term}</span>
        {p.link && <span className="card-live">● {p.badge ?? 'public repo'}</span>}
      </div>
      <DecryptText as="h3" text={p.title} className="card-title" />
      <p className="card-line">{p.oneLiner}</p>
      {expanded && (
        <ul className="card-details">
          {p.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}
      <ul className="tags mono">
        {p.tags.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <button className="card-open mono" onClick={() => onOpen(p)}>
        <span>open file</span>
        <span aria-hidden>→</span>
        <span className="sr-only">: {p.title}</span>
      </button>
    </article>
  )
}

function ProjectDialog({ project, onClose }) {
  const ref = useRef(null)
  useEffect(() => {
    const d = ref.current
    if (project && !d.open) d.showModal()
    if (!project && d.open) d.close()
  }, [project])

  return (
    <dialog ref={ref} className="dialog panel" onClose={onClose} onClick={(e) => e.target === ref.current && onClose()}>
      {project && (
        <div className="dialog-inner">
          <div className="dialog-head mono">
            <span className="tag">{project.code}</span>
            <span className="dim">{project.term}</span>
            <button className="chip dialog-close" onClick={onClose} aria-label="Close" autoFocus>
              esc ✕
            </button>
          </div>
          <DecryptText as="h3" text={project.title} active className="dialog-title" duration={700} />
          <p className="dialog-line">{project.oneLiner}</p>
          <ul className="dialog-details">
            {project.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <ul className="tags mono">
            {project.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          {project.link && (
            <a className="btn btn-primary" href={project.link} target="_blank" rel="noreferrer">
              {project.linkLabel ?? 'View on GitHub'}
            </a>
          )}
        </div>
      )}
    </dialog>
  )
}

export default function Projects() {
  const mode = useStore((s) => s.mode)
  const [open, setOpen] = useState(null)
  const featured = projects.filter((p) => p.featured)
  const archive = projects.filter((p) => !p.featured)

  const openFile = (p) => {
    if (store.get().sound) sfx.select()
    setOpen(p)
  }

  return (
    <Section id="projects" index="02" file="projects.enc" dir="projects/" title="Things I've built and broken" kicker="Labs, coursework and open source. Open any file for the full write-up.">
      <div className="cards">
        {featured.map((p, i) => (
          <Card key={p.id} p={p} i={i} onOpen={openFile} expanded={mode === 'engineer'} />
        ))}
      </div>
      <div className="archive panel">
        <p className="archive-head mono">
          <span className="dim">$</span> ls -l ./archive <span className="dim">· {archive.length} more files</span>
        </p>
        <ul>
          {archive.map((p) => (
            <li key={p.id}>
              <button className="archive-row" onClick={() => openFile(p)}>
                <span className="mono dim">-rw-r--r--</span>
                <span className="mono archive-code">{p.code}</span>
                <span className="archive-title">{p.title}</span>
                <span className="mono dim archive-term">{p.term}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <ProjectDialog project={open} onClose={() => setOpen(null)} />
    </Section>
  )
}
