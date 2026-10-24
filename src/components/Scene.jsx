import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, PerformanceMonitor } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { files } from '../data/content'
import { FLAGS, coreDump } from '../lib/flags'
import { live, lowPower, reducedMotion, store, useStore } from '../lib/store'
import { sfx } from '../lib/sound'

const RADIUS = 2.4
const MINT = new THREE.Color('#7CF2B0')
const AMBER = new THREE.Color('#FFC857')
const damp = THREE.MathUtils.damp

// 4x4 atlas of hex glyphs that every particle samples from.
const ATLAS_FONT = '600 46px "JetBrains Mono", ui-monospace, monospace'

function drawAtlas(c) {
  const g = c.getContext('2d')
  g.clearRect(0, 0, c.width, c.height)
  g.fillStyle = '#fff'
  g.font = ATLAS_FONT
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  '0123456789ABCDEF'.split('').forEach((ch, i) => g.fillText(ch, (i % 4) * 64 + 32, Math.floor(i / 4) * 64 + 34))
}

function makeAtlas() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  drawAtlas(c)
  const t = new THREE.CanvasTexture(c)
  t.minFilter = THREE.LinearMipmapLinearFilter
  // Redraw once the bundled font has loaded, so the glyphs use it instead of a fallback.
  document.fonts?.load(ATLAS_FONT).then(() => {
    drawAtlas(c)
    t.needsUpdate = true
  })
  return t
}

const vertex = /* glsl */ `
  uniform float uTime, uDecrypt, uPixelRatio, uSize, uGlitch, uPointerStrength, uPulse;
  uniform vec3 uPointer;
  attribute vec3 aChaos;
  attribute float aRand, aGlyph;
  varying float vGlyph, vAlpha, vHot;

  void main() {
    float d = smoothstep(0.0, 1.0, clamp(uDecrypt * 1.6 - aRand * 0.5, 0.0, 1.0));
    vec3 ordered = position * (1.0 + 0.025 * sin(uTime * 1.3 + aRand * 6.2831) + uPulse * 0.12 * aRand);
    vec3 chaos = aChaos + vec3(sin(uTime * 0.31 + aRand * 10.0), cos(uTime * 0.23 + aRand * 7.0), sin(uTime * 0.19 + aRand * 5.0)) * 0.35;
    vec3 p = mix(chaos, ordered, d);

    float hot = smoothstep(1.3, 0.0, distance(p, uPointer)) * uPointerStrength * d;
    p += normalize(p) * hot * 0.55;

    float jitter = fract(sin(aRand * 91.7 + floor(uTime * 24.0)) * 43758.5) - 0.5;
    p.x += jitter * uGlitch * step(0.7, aRand) * 0.6;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.65 + aRand * 0.7) * (1.0 + hot * 0.8) / -mv.z;

    float rate = step(0.82, aRand) * 7.0 + 0.25 + uGlitch * 10.0;
    vGlyph = mod(aGlyph + floor(uTime * rate + aRand * 10.0), 16.0);
    vHot = hot;
    vAlpha = mix(0.28, 1.0, d) * (0.45 + 0.55 * aRand);
  }
`

const fragment = /* glsl */ `
  uniform sampler2D uAtlas;
  uniform vec3 uColor, uHotColor;
  uniform float uOpacity;
  varying float vGlyph, vAlpha, vHot;

  void main() {
    vec2 pc = gl_PointCoord;
    float gx = mod(vGlyph, 4.0);
    float gy = floor(vGlyph / 4.0);
    vec2 uv = vec2((gx + pc.x) / 4.0, 1.0 - (gy + pc.y) / 4.0);
    float a = texture2D(uAtlas, uv).r;
    if (a < 0.08) discard;
    vec3 col = mix(uColor, uHotColor, vHot);
    gl_FragColor = vec4(col, a * vAlpha * uOpacity);
  }
`

function GlyphSphere({ count }) {
  const ref = useRef()
  const { gl, camera, pointer } = useThree()
  const tmp = useMemo(() => ({ ray: new THREE.Raycaster(), inv: new THREE.Matrix4(), hit: new THREE.Vector3(), sphere: new THREE.Sphere(new THREE.Vector3(), RADIUS) }), [])

  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const chaos = new Float32Array(count * 3)
    const rnd = new Float32Array(count)
    const glyph = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // Fibonacci sphere for an even spread of glyphs.
      const y = 1 - (2 * (i + 0.5)) / count
      const r = Math.sqrt(1 - y * y)
      const th = i * 2.399963
      pos.set([Math.cos(th) * r * RADIUS, y * RADIUS, Math.sin(th) * r * RADIUS], i * 3)
      chaos.set([(Math.random() - 0.5) * 22, (Math.random() - 0.5) * 13, (Math.random() - 0.5) * 10 - 1], i * 3)
      rnd[i] = Math.random()
      glyph[i] = Math.floor(Math.random() * 16)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aChaos', new THREE.BufferAttribute(chaos, 3))
    g.setAttribute('aRand', new THREE.BufferAttribute(rnd, 1))
    g.setAttribute('aGlyph', new THREE.BufferAttribute(glyph, 1))
    return g
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDecrypt: { value: reducedMotion ? 1 : 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uSize: { value: 70 },
      uGlitch: { value: 0 },
      uPulse: { value: 0 },
      uPointer: { value: new THREE.Vector3(0, 0, 99) },
      uPointerStrength: { value: 0 },
      uAtlas: { value: makeAtlas() },
      uColor: { value: MINT.clone() },
      uHotColor: { value: new THREE.Color('#ffffff') },
      uOpacity: { value: 1 },
    }),
    [gl],
  )

  // Built once and passed as an object: R3F clones a `uniforms` prop, which would detach our updates.
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [uniforms],
  )

  useFrame((state, dt) => {
    const u = uniforms
    const { flags } = store.get()
    u.uTime.value += reducedMotion ? dt * 0.3 : dt
    u.uDecrypt.value = damp(u.uDecrypt.value, live.decrypt, 1.4, dt)
    u.uGlitch.value = damp(u.uGlitch.value, Math.min(Math.abs(live.velocity) / 60, 1), 6, dt)
    u.uPulse.value = live.pulse
    u.uOpacity.value = damp(u.uOpacity.value, 1 - live.heroProgress * (lowPower ? 0.65 : 0.4), 4, dt)
    u.uColor.value.lerp(flags.length === FLAGS.length ? AMBER : MINT, 0.05)

    // Push glyphs away from wherever the cursor ray meets the sphere.
    tmp.ray.setFromCamera(pointer, camera)
    tmp.inv.copy(ref.current.matrixWorld).invert()
    tmp.ray.ray.applyMatrix4(tmp.inv)
    const hit = live.heroProgress < 0.6 && tmp.ray.ray.intersectSphere(tmp.sphere, tmp.hit)
    if (hit) u.uPointer.value.lerp(tmp.hit, 0.25)
    u.uPointerStrength.value = damp(u.uPointerStrength.value, hit ? 1 : 0, 5, dt)
  })

  return <points ref={ref} geometry={geometry} material={material} />
}

function InnerCore() {
  const wire = useRef()
  const heart = useRef()
  const mat = useRef()
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.05, 1)), [])
  const clicks = useRef([])

  const knock = (e) => {
    e.stopPropagation()
    if (live.heroProgress > 0.3 || !store.get().booted) return
    live.pulse = 1
    const now = performance.now()
    clicks.current = [...clicks.current.filter((t) => now - t < 2500), now]
    if (store.get().sound) sfx.key()
    if (clicks.current.length >= 5) {
      clicks.current = []
      store.set({ toast: { id: now, title: 'core dump acquired', text: coreDump() } })
      if (store.get().sound) sfx.unlock()
    }
  }

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const all = store.get().flags.length === FLAGS.length
    wire.current.rotation.x = t * 0.15
    wire.current.rotation.y = -t * 0.22
    heart.current.rotation.y = t * 0.6
    heart.current.scale.setScalar(1 + Math.sin(t * 2.2) * 0.06 + live.pulse * 0.5)
    mat.current.color.lerp(all ? AMBER : MINT, 0.05)
    live.pulse = damp(live.pulse, 0, 4, dt)
  })

  return (
    <group>
      <lineSegments ref={wire} geometry={edges}>
        <lineBasicMaterial color="#3fae7a" transparent opacity={0.55} />
      </lineSegments>
      <mesh ref={heart} onClick={knock}>
        <icosahedronGeometry args={[0.38, 0]} />
        <meshBasicMaterial ref={mat} color={MINT} wireframe toneMapped={false} />
      </mesh>
      {/* A larger invisible target so the core is easy to click. */}
      <mesh onClick={knock} visible={false}>
        <sphereGeometry args={[1.1, 16, 16]} />
      </mesh>
    </group>
  )
}

function makeRing(r, segments = 160, tickEvery = 10, tick = 0.12) {
  const pts = []
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2
    const b = ((i + 1) / segments) * Math.PI * 2
    pts.push(Math.cos(a) * r, 0, Math.sin(a) * r, Math.cos(b) * r, 0, Math.sin(b) * r)
    if (i % tickEvery === 0) pts.push(Math.cos(a) * r, 0, Math.sin(a) * r, Math.cos(a) * (r + tick), 0, Math.sin(a) * (r + tick))
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  return g
}

function Rings() {
  const a = useRef()
  const b = useRef()
  const ringA = useMemo(() => makeRing(3.05, 180, 6, 0.1), [])
  const ringB = useMemo(() => makeRing(3.35, 120, 15, -0.18), [])
  useFrame((_, dt) => {
    a.current.rotation.y += dt * 0.12
    b.current.rotation.y -= dt * 0.07
  })
  return (
    <>
      <group rotation={[0.42, 0, 0.18]}>
        <lineSegments ref={a} geometry={ringA}>
          <lineBasicMaterial color="#2f855a" transparent opacity={0.45} />
        </lineSegments>
      </group>
      <group rotation={[-0.3, 0, -0.42]}>
        <lineSegments ref={b} geometry={ringB}>
          <lineBasicMaterial color="#2f855a" transparent opacity={0.28} />
        </lineSegments>
      </group>
    </>
  )
}

const fileEdges = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.34, 0.44, 0.05))

function Orbit({ portal }) {
  const group = useRef()
  const nodes = useRef([])
  const labels = useRef([])
  const unlocked = useStore((s) => s.unlocked)
  const tmp = useMemo(() => new THREE.Vector3(), [])
  const ndc = useMemo(() => new THREE.Vector3(), [])
  const center = useMemo(() => new THREE.Vector3(), [])
  const heroText = useRef([])
  const ORBIT = 4.05

  useFrame((state, dt) => {
    const { active, booted } = store.get()
    group.current.rotation.y += dt * (reducedMotion ? 0.03 : 0.12)
    group.current.parent.getWorldPosition(center)
    const camDist = state.camera.position.distanceTo(center)
    const show = booted ? THREE.MathUtils.clamp(1 - live.heroProgress * 3.5, 0, 1) : 0
    if (!heroText.current.length) heroText.current = [...document.querySelectorAll('.hero-name .decrypt-ghost, .hero-tagline .decrypt-ghost, .hero-cta .btn')]
    const boxes = show > 0 && heroText.current.map((el) => el.getBoundingClientRect())
    files.forEach((f, i) => {
      const n = nodes.current[i]
      const l = labels.current[i]
      if (!n || !l) return
      n.rotation.y += dt * 0.6
      const target = active === f.id ? 1.6 : 1
      n.scale.setScalar(damp(n.scale.x, target, 5, dt))
      n.getWorldPosition(tmp)
      // Labels behind the core fade back so the orbit reads as 3D.
      const behind = state.camera.position.distanceTo(tmp) > camDist ? 0.35 : 1
      // ...and step aside while they cross the hero text.
      let clear = 1
      if (boxes) {
        ndc.copy(tmp).project(state.camera)
        const x = ((ndc.x + 1) / 2) * state.size.width
        const y = ((1 - ndc.y) / 2) * state.size.height - 34
        if (boxes.some((b) => x > b.left - 64 && x < b.right + 64 && y > b.top - 16 && y < b.bottom + 16)) clear = 0.06
      }
      const o = show * behind * clear
      l.style.opacity = o
      l.style.pointerEvents = o > 0.5 ? 'auto' : 'none'
    })
  })

  const open = (id) => {
    if (store.get().sound) sfx.select()
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <group rotation={[0.32, 0, 0.08]}>
      <group ref={group}>
        {files.map((f, i) => {
          const a = (i / files.length) * Math.PI * 2
          const isOpen = unlocked.includes(f.id)
          return (
            <group key={f.id} position={[Math.cos(a) * ORBIT, Math.sin(a * 2) * 0.25, Math.sin(a) * ORBIT]}>
              <lineSegments ref={(el) => (nodes.current[i] = el)} geometry={fileEdges}>
                <lineBasicMaterial color={isOpen ? '#ffffff' : '#7CF2B0'} toneMapped={false} />
              </lineSegments>
              <Html portal={portal} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
                <button
                  ref={(el) => (labels.current[i] = el)}
                  className={`orbit-label ${isOpen ? 'is-open' : ''}`}
                  style={{ opacity: 0 }}
                  onClick={() => open(f.id)}
                  aria-label={`Open ${f.id}`}
                  tabIndex={-1}
                >
                  <span className="orbit-icon" aria-hidden>{isOpen ? '◇' : '◆'}</span>
                  {isOpen ? f.dir : f.file}
                </button>
              </Html>
            </group>
          )
        })}
      </group>
    </group>
  )
}

// Places the core: centred in the hero, then drifting right (or fading back on phones) as you scroll.
function Rig({ children }) {
  const group = useRef()
  const { camera, size, viewport } = useThree()

  useFrame((state, dt) => {
    const h = live.heroProgress
    const portrait = size.width < 768 || size.width < size.height
    const aspect = size.width / size.height
    const fov = (camera.fov * Math.PI) / 180
    // Fit the orbit on narrow screens, otherwise keep a fixed distance.
    const fitZ = portrait ? (4.4 / aspect) / Math.tan(fov / 2) : 9
    camera.position.z = damp(camera.position.z, Math.max(9, fitZ), 3, dt)
    camera.position.x = damp(camera.position.x, state.pointer.x * 0.35, 2, dt)
    camera.position.y = damp(camera.position.y, state.pointer.y * 0.25, 2, dt)
    camera.lookAt(0, 0, 0)

    const vw = viewport.getCurrentViewport(camera, [0, 0, 0]).width
    const x = portrait ? 0 : vw * 0.26 * h
    const y = portrait ? h * 1.2 : 0
    group.current.position.x = damp(group.current.position.x, x, 4, dt)
    group.current.position.y = damp(group.current.position.y, y, 4, dt)
    group.current.scale.setScalar(damp(group.current.scale.x, 1 - h * 0.18, 4, dt))
    group.current.rotation.y += dt * (reducedMotion ? 0.02 : 0.07) + live.velocity * 0.00004
  })

  return <group ref={group}>{children}</group>
}

export default function Scene({ portal }) {
  const [fx, setFx] = useState(!reducedMotion)
  return (
    <div className="scene" aria-hidden>
      <Canvas
        dpr={lowPower ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 0, 9], fov: 45 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        eventSource={document.getElementById('root')}
        eventPrefix="client"
        fallback={<div className="scene-fallback" />}
      >
        <color attach="background" args={['#030605']} />
        <PerformanceMonitor onDecline={() => setFx(false)} />
        <Rig>
          <GlyphSphere count={lowPower ? 2400 : 4200} />
          <InnerCore />
          <Rings />
          <Orbit portal={portal} />
        </Rig>
        {fx && (
          <EffectComposer multisampling={0}>
            <Bloom mipmapBlur intensity={1.15} luminanceThreshold={0.12} luminanceSmoothing={0.3} radius={0.7} />
            <Vignette offset={0.25} darkness={0.75} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  )
}
