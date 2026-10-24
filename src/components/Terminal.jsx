import { useEffect, useRef, useState } from 'react'
import { files, profile } from '../data/content'
import { FLAGS, submitFlag } from '../lib/flags'
import { store, useStore } from '../lib/store'
import { sfx } from '../lib/sound'

const HELP = [
  'help                 show this list',
  'flag{...}            submit a captured flag',
  'hints                show a hint for each flag',
  'ls                   list the encrypted files',
  'whoami               who you are on this box',
  'sudo hire abdullah   you know what this does',
  'clear                clear the screen',
  'exit                 close the terminal',
]

export function Terminal() {
  const open = useStore((s) => s.terminal)
  const flags = useStore((s) => s.flags)
  const mode = useStore((s) => s.mode)
  const booted = useStore((s) => s.booted)
  const [lines, setLines] = useState([
    { t: 'cipher-core shell · type help', c: 'dim' },
    { t: `${FLAGS.length} flags are hidden across this site.`, c: '' },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [hIdx, setHIdx] = useState(-1)
  const inputRef = useRef(null)
  const bodyRef = useRef(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])
  useEffect(() => {
    bodyRef.current?.scrollTo(0, bodyRef.current.scrollHeight)
  }, [lines])
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && store.get().terminal) store.set({ terminal: false })
      if (e.key === '`' && store.get().booted && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        store.set({ terminal: !store.get().terminal })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const print = (...ls) => setLines((prev) => [...prev, ...ls])

  const run = async (raw) => {
    const cmd = raw.trim()
    print({ t: `$ ${cmd}`, c: 'cmd' })
    if (!cmd) return
    setHistory((h) => [cmd, ...h])
    const lower = cmd.toLowerCase()
    if (lower.startsWith('flag{')) {
      const r = await submitFlag(cmd)
      if (!r.ok) return print({ t: '✗ invalid flag. Keep digging.', c: 'err' })
      if (r.already) return print({ t: `• already captured: ${FLAGS[r.index].name}`, c: 'dim' })
      const n = store.get().flags.length
      print({ t: `✓ flag accepted: ${FLAGS[r.index].name} (${n}/${FLAGS.length})`, c: 'ok' })
      if (r.all)
        print(
          { t: '# root access granted. The core is yours.', c: 'gold' },
          { t: `If you found all ${FLAGS.length}, we should talk: ${profile.email}`, c: 'gold' },
        )
      return
    }
    switch (lower) {
      case 'help':
        return print(...HELP.map((t) => ({ t, c: 'dim' })))
      case 'hints':
      case 'hint':
        return print(...FLAGS.map((f, i) => ({ t: `[${flags.includes(i) ? 'x' : ' '}] ${f.name.padEnd(10)} ${f.hint}`, c: flags.includes(i) ? 'ok' : '' })))
      case 'ls':
        return print({ t: files.map((f) => (store.get().unlocked.includes(f.id) ? f.dir : f.file)).join('   '), c: '' })
      case 'whoami':
        return print({ t: `visitor (clearance: ${mode || 'none'})`, c: '' })
      case 'sudo hire abdullah':
        if (store.get().sound) sfx.select()
        return print(
          { t: '[sudo] password for recruiter: ********', c: 'dim' },
          { t: '✓ permission granted. Opening a secure channel…', c: 'ok' },
          { t: `→ ${profile.email}`, c: 'ok', href: `mailto:${profile.email}` },
        )
      case 'sudo':
      case 'sudo su':
      case 'su':
        return print({ t: 'visitor is not in the sudoers file. This incident will be reported.', c: 'err' })
      case 'clear':
        return setLines([])
      case 'exit':
        return store.set({ terminal: false })
      default:
        if (lower.startsWith('cat ')) return print({ t: `cat: ${cmd.slice(4)}: encrypted. Scroll to decrypt it.`, c: 'err' })
        if (lower.startsWith('rm ')) return print({ t: 'rm: nice try.', c: 'err' })
        return print({ t: `${cmd.split(' ')[0]}: command not found. Try help.`, c: 'err' })
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      run(input)
      setInput('')
      setHIdx(-1)
    } else if (e.key === 'ArrowUp' && history.length) {
      const i = Math.min(hIdx + 1, history.length - 1)
      setHIdx(i)
      setInput(history[i])
      e.preventDefault()
    } else if (e.key === 'ArrowDown') {
      const i = Math.max(hIdx - 1, -1)
      setHIdx(i)
      setInput(i === -1 ? '' : history[i])
    } else if (store.get().sound && e.key.length === 1) sfx.key()
  }

  return (
    <>
      <button className={`term-fab mono ${booted ? 'is-on' : ''} ${flags.length === FLAGS.length ? 'is-root' : ''}`} onClick={() => store.set({ terminal: !open })} aria-expanded={open}>
        <span className="ok">&gt;_</span> flags {flags.length}/{FLAGS.length}
      </button>
      {open && (
        <div className="shell panel mono" role="dialog" aria-label="Terminal" onClick={() => inputRef.current?.focus()}>
          <div className="term-bar">
            <i />
            <i />
            <i />
            <span>visitor@abdullah.sec · press ` to toggle</span>
            <button className="chip" onClick={() => store.set({ terminal: false })} aria-label="Close terminal">
              ✕
            </button>
          </div>
          <div className="shell-flags" aria-label="Captured flags">
            {FLAGS.map((f, i) => (
              <span key={f.name} className={flags.includes(i) ? 'ok' : 'dim'}>
                [{flags.includes(i) ? 'x' : ' '}] {f.name}
              </span>
            ))}
          </div>
          <div className="shell-body" ref={bodyRef}>
            {lines.map((l, i) =>
              l.href ? (
                <a key={i} className={`shell-line ${l.c}`} href={l.href}>
                  {l.t}
                </a>
              ) : (
                <p key={i} className={`shell-line ${l.c}`}>
                  {l.t}
                </p>
              ),
            )}
            <label className="shell-input">
              <span className="ok">$</span>
              <input ref={inputRef} autoFocus value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown} spellCheck={false} autoComplete="off" aria-label="Terminal input" />
            </label>
          </div>
        </div>
      )}
    </>
  )
}

export function Toast() {
  const toast = useStore((s) => s.toast)
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!toast) return
    setCopied(false)
    const t = setTimeout(() => store.set({ toast: null }), 9000)
    return () => clearTimeout(t)
  }, [toast])
  if (!toast) return null
  return (
    <div className="toast panel mono" role="status">
      <span className="tag">{toast.title}</span>
      <code>{toast.text}</code>
      <button
        className="chip"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(toast.text)
            setCopied(true)
          } catch {}
        }}
      >
        {copied ? 'copied' : 'copy'}
      </button>
    </div>
  )
}
