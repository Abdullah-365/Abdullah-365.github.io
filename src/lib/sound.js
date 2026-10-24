// All sounds are synthesized with WebAudio, so there are no audio files to load.

let ctx = null
const ac = () => {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function blip({ freq = 880, to = freq, dur = 0.06, type = 'square', gain = 0.03, delay = 0 }) {
  try {
    const a = ac()
    const t = a.currentTime + delay
    const o = a.createOscillator()
    const g = a.createGain()
    o.type = type
    o.frequency.setValueAtTime(freq, t)
    o.frequency.exponentialRampToValueAtTime(to, t + dur)
    g.gain.setValueAtTime(gain, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g).connect(a.destination)
    o.start(t)
    o.stop(t + dur + 0.02)
  } catch {}
}

export const sfx = {
  tick: () => blip({ freq: 1800 + Math.random() * 1400, dur: 0.018, gain: 0.012 }),
  key: () => blip({ freq: 420 + Math.random() * 80, dur: 0.03, type: 'triangle', gain: 0.03 }),
  select: () => {
    blip({ freq: 520, to: 1040, dur: 0.12, type: 'sine', gain: 0.06 })
    blip({ freq: 1040, to: 1560, dur: 0.16, type: 'sine', gain: 0.04, delay: 0.1 })
  },
  unlock: () => {
    blip({ freq: 660, dur: 0.07, type: 'triangle', gain: 0.05 })
    blip({ freq: 990, dur: 0.12, type: 'triangle', gain: 0.05, delay: 0.07 })
  },
  deny: () => blip({ freq: 180, to: 90, dur: 0.25, type: 'sawtooth', gain: 0.04 }),
  boot: () => {
    blip({ freq: 60, to: 240, dur: 1.2, type: 'sine', gain: 0.08 })
    blip({ freq: 2400, to: 300, dur: 0.9, type: 'sine', gain: 0.02, delay: 0.2 })
  },
  root: () => [523, 659, 784, 1046].forEach((f, i) => blip({ freq: f, dur: 0.25, type: 'triangle', gain: 0.05, delay: i * 0.11 })),
}
