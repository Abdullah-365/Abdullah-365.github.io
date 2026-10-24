import { useEffect, useRef, useState } from 'react'
import { reducedMotion, store } from './store'
import { sfx } from './sound'

// Ciphertext keeps each character's case so proportional fonts don't reflow while scrambling.
const UPPER = 'ABCDEFGHKMNPRSTUVWXYZ0123456789#$%&'
const LOWER = 'abcdefghkmnopqrstuvwxyz'
const pick = (set) => set[(Math.random() * set.length) | 0]
const rand = (c) => {
  if (/[a-z]/.test(c)) return pick(LOWER)
  if (/[A-Z0-9]/.test(c)) return pick(UPPER)
  return c
}

export const scrambleOf = (text) => [...text].map(rand).join('')

// Returns `text` scrambled into ciphertext that resolves left to right once `active` is true.
export function useScramble(text, active, { duration = 900, delay = 0, tick = false } = {}) {
  const [out, setOut] = useState(() => (reducedMotion ? text : scrambleOf(text)))
  const [done, setDone] = useState(reducedMotion)
  const raf = useRef(0)

  useEffect(() => {
    if (reducedMotion) {
      setOut(text)
      setDone(true)
      return
    }
    if (!active) {
      setOut(scrambleOf(text))
      setDone(false)
      return
    }
    const chars = [...text]
    const reveal = chars.map((_, i) => delay + (i / chars.length) * duration * 0.75 + Math.random() * duration * 0.25)
    let start = 0
    let last = 0
    const frame = (now) => {
      if (!start) start = now
      const t = now - start
      if (now - last > 45) {
        last = now
        let finished = true
        setOut(
          chars
            .map((c, i) => {
              if (c === ' ' || t >= reveal[i]) return c
              finished = false
              return rand(c)
            })
            .join(''),
        )
        if (tick && store.get().sound && Math.random() < 0.5) sfx.tick()
        if (finished) {
          setDone(true)
          return
        }
      }
      raf.current = requestAnimationFrame(frame)
    }
    raf.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf.current)
  }, [text, active, duration, delay, tick])

  return [out, done]
}

// Fires once when the element scrolls into view.
export function useInView(options = { threshold: 0.25 }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setSeen(true)
        io.disconnect()
      }
    }, options)
    io.observe(el)
    return () => io.disconnect()
  }, [seen])
  return [ref, seen]
}
