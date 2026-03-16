import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const parent = canvas.parentElement!
    const W = () => parent.clientWidth
    const H = () => parent.clientHeight

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
    renderer.setSize(W(), H())

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, W() / H(), 1, 2000)
    camera.position.z = 500

    const mob = window.innerWidth < 600
    const COLS = mob ? 42 : 82, ROWS = mob ? 26 : 52
    const N = COLS * ROWS
    const SX = mob ? 600 : 1020, SY = mob ? 360 : 660

    const orig = new Float32Array(N * 3)
    const curr = new Float32Array(N * 3)
    const vel = new Float32Array(N * 3)
    const cols = new Float32Array(N * 3)

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i = (r * COLS + c) * 3
        const x = (c / (COLS - 1) - 0.5) * SX
        const y = (r / (ROWS - 1) - 0.5) * SY
        const z = (Math.random() - 0.5) * 50
        orig[i] = curr[i] = x
        orig[i + 1] = curr[i + 1] = y
        orig[i + 2] = curr[i + 2] = z
        const t = Math.random()
        cols[i] = t * 0.196 + (1 - t) * 0.137
        cols[i + 1] = t * 0.961 + (1 - t) * 0.910
        cols[i + 2] = t * 0.259 + (1 - t) * 0.784
      }
    }

    const geo = new THREE.BufferGeometry()
    const posAttr = new THREE.BufferAttribute(curr, 3)
    geo.setAttribute('position', posAttr)
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3))
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
      size: mob ? 1.9 : 2.2, vertexColors: true,
      transparent: true, opacity: 0.65,
      sizeAttenuation: true, depthWrite: false,
    })))

    const REPEL = 130, STR = 20000, SPRING = 0.042, DAMP = 0.80
    let mx = 99999, my = 99999

    const toWorld = (cx: number, cy: number) => {
      const rect = canvas.getBoundingClientRect()
      const ndx = ((cx - rect.left) / rect.width) * 2 - 1
      const ndy = -((cy - rect.top) / rect.height) * 2 + 1
      const v3 = new THREE.Vector3(ndx, ndy, 0.5).unproject(camera)
      const dir = v3.sub(camera.position).normalize()
      const t = -camera.position.z / dir.z
      return { x: camera.position.x + dir.x * t, y: camera.position.y + dir.y * t }
    }

    const onMove = (e: MouseEvent) => { const w = toWorld(e.clientX, e.clientY); mx = w.x; my = w.y }
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) { const w = toWorld(t.clientX, t.clientY); mx = w.x; my = w.y }
    }
    const onLeave = () => { mx = 99999; my = 99999 }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onTouch, { passive: true })
    parent.addEventListener('mouseleave', onLeave)

    let scrollY = 0
    const onScroll = () => { scrollY = window.scrollY }
    window.addEventListener('scroll', onScroll)

    let raf: number
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const p = geo.attributes.position.array as Float32Array
      const R2 = REPEL * REPEL
      for (let i = 0; i < N; i++) {
        const ix = i * 3, iy = ix + 1, iz = ix + 2
        const dx = p[ix] - mx, dy = p[iy] - my
        const d2 = dx * dx + dy * dy
        if (d2 < R2 && d2 > 0.01) {
          const d = Math.sqrt(d2), f = STR / (d2 + 1)
          vel[ix] += (dx / d) * f * 0.016
          vel[iy] += (dy / d) * f * 0.016
        }
        vel[ix] += (orig[ix] - p[ix]) * SPRING
        vel[iy] += (orig[iy] - p[iy]) * SPRING
        vel[iz] += (orig[iz] - p[iz]) * SPRING
        vel[ix] *= DAMP; vel[iy] *= DAMP; vel[iz] *= DAMP
        p[ix] += vel[ix]; p[iy] += vel[iy]; p[iz] += vel[iz]
      }
      geo.attributes.position.needsUpdate = true
      camera.position.y = -scrollY * 0.04
      renderer.render(scene, camera)
    }
    tick()

    const onResize = () => {
      renderer.setSize(W(), H())
      camera.aspect = W() / H()
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      try { parent.removeEventListener('mouseleave', onLeave) } catch (_) { }
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}

export default function Hero() {
  useEffect(() => {
    const spans = document.querySelectorAll<HTMLElement>('.hero-line > span')
    setTimeout(() => {
      spans.forEach((el, i) => setTimeout(() => el.classList.add('in'), i * 140))
    }, 200)
  }, [])

  return (
    <section
      id="hero"
      className="min-h-screen flex items-end pb-20 relative overflow-hidden max-md:items-center max-md:pt-24 max-md:pb-14"
    >
      <ParticleField />

      <div className="max-w-[1280px] mx-auto px-12 max-md:px-5 relative z-10 w-full">
        <p className="font-mono text-[11px] tracking-[0.22em] text-accent uppercase mb-7 flex items-center gap-3.5">
          <span className="block w-9 h-px bg-accent flex-shrink-0" />
          Full Stack Engineer · Pune/ Bengaluru
        </p>

        <h1 className="font-display text-[clamp(50px,11vw,152px)] font-extrabold leading-[0.87] tracking-[-3px] mb-10">
          <span className="hero-line"><span>Ankit</span></span>
          {/* <span className="hero-line"><span>Mukho-</span></span> */}
          <span className="hero-line"><span className="text-accent italic pb-10">Mukhopadhyay</span></span>
        </h1>

        <div className="flex justify-between items-end flex-wrap gap-6">
          <p className="max-w-[380px] font-mono text-sm text-muted leading-[1.9] font-light">
            Building scalable, high-performing<br />
            frontend applications — from concept<br />
            to production, with precision.
          </p>
          <div className="flex gap-8 max-md:gap-5">
            {[
              ['2.6+', 'Years exp'],
              ['80%', 'Efficiency gain'],
              ['90%+', 'Test coverage'],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-[clamp(30px,4vw,42px)] font-bold leading-none text-accent">
                  {n}
                </div>
                <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted mt-1">
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-9 right-12 max-md:right-5 font-mono text-[10px] tracking-[0.15em] text-muted uppercase flex items-center gap-2.5 [writing-mode:vertical-rl]">
        <div className="scroll-line w-px h-[52px] bg-gradient-to-b from-muted to-transparent" />
        Scroll
      </div>
    </section>
  )
}
