import { useInView, useScramble } from '../lib/useScramble'

// Text that starts as ciphertext and resolves when it scrolls into view (or when `active` flips).
// The real text is always in the DOM for layout and screen readers; the scramble is an overlay.
export default function DecryptText({ text, as: Tag = 'span', active, className = '', duration, delay, tick }) {
  const [ref, seen] = useInView()
  const [out, done] = useScramble(text, active ?? seen, { duration, delay, tick })
  return (
    <Tag ref={ref} className={`decrypt ${done ? 'is-done' : ''} ${className}`}>
      <span className="decrypt-ghost">{text}</span>
      {!done && (
        <span className="decrypt-live" aria-hidden="true">
          {out}
        </span>
      )}
    </Tag>
  )
}
