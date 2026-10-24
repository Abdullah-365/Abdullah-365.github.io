import { useEffect, useRef } from 'react'
import Scene from './components/Scene'
import Boot from './components/Boot'
import Nav from './components/Nav'
import { Hero, Brief } from './components/Hero'
import { About, Experience, Skills, Contact, Footer } from './components/Sections'
import Projects from './components/Projects'
import { Terminal, Toast } from './components/Terminal'
import { files } from './data/content'
import { consoleBanner } from './lib/flags'
import { live, store } from './lib/store'

let bannerShown = false

export default function App() {
  const orbitLayer = useRef(null)

  useEffect(() => {
    if (!bannerShown) consoleBanner()
    bannerShown = true
  }, [])

  // Feed scroll position and speed to the 3D scene every frame.
  useEffect(() => {
    let raf
    let last = window.scrollY
    const loop = () => {
      const y = window.scrollY
      live.velocity += (y - last - live.velocity) * 0.2
      live.scroll = y
      live.heroProgress = Math.min(1, Math.max(0, y / window.innerHeight))
      last = y
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Track which section sits in the middle of the screen.
  useEffect(() => {
    const ids = ['hero', ...files.map((f) => f.id)]
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && store.set({ active: e.target.id })),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <>
      <Scene portal={orbitLayer} />
      <div className="orbit-layer" ref={orbitLayer} />
      <div className="scanlines" aria-hidden />
      <Nav />
      <main>
        <Hero />
        <div className="content">
          <Brief />
          <About />
          <Projects />
          <Experience />
          <Skills />
          <Contact />
        </div>
      </main>
      <Footer />
      <Terminal />
      <Toast />
      <Boot />
    </>
  )
}
