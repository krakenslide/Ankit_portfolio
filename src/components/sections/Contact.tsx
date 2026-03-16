import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function WaveGL() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const parent = canvas.parentElement!
    const W = () => parent.clientWidth
    const H = () => parent.clientHeight

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
    renderer.setSize(W(), H())

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, W() / H(), 0.1, 500)
    camera.position.set(0, 7, 18)
    camera.lookAt(0, 0, 0)

    const SEG = 52
    const geo = new THREE.PlaneGeometry(30, 18, SEG, SEG)
    geo.rotateX(-Math.PI / 2.3)

    // snapshot Y after rotation
    const arr = geo.attributes.position.array as Float32Array
    const origY = new Float32Array(geo.attributes.position.count)
    for (let i = 0; i < geo.attributes.position.count; i++) origY[i] = arr[i * 3 + 1]

    scene.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xc8f542, wireframe: true, transparent: true, opacity: 0.11 })))
    scene.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x030303, side: THREE.BackSide })))

    let raf: number
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const t = Date.now() * 0.001
      const a = geo.attributes.position.array as Float32Array
      for (let i = 0; i < geo.attributes.position.count; i++) {
        const x = a[i * 3], z = a[i * 3 + 2]
        a[i * 3 + 1] =
          origY[i] +
          Math.sin(x * 0.42 + t * 1.05) * 0.44 +
          Math.sin(z * 0.5  + t * 0.82) * 0.36 +
          Math.sin((x + z) * 0.28 + t * 1.35) * 0.24 +
          Math.sin(x * 0.14 - z * 0.2 + t * 0.58) * 0.55
      }
      geo.attributes.position.needsUpdate = true
      geo.computeVertexNormals()
      renderer.render(scene, camera)
    }
    tick()

    const onResize = () => { renderer.setSize(W(), H()); camera.aspect = W() / H(); camera.updateProjectionMatrix() }
    window.addEventListener('resize', onResize)

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); renderer.dispose() }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-[130px] text-center relative overflow-hidden max-md:py-24"
    >
      <WaveGL />

      <div className="max-w-[1280px] mx-auto px-12 max-md:px-5 relative z-10">
        <div className="reveal">
          <h2 className="font-display text-[clamp(38px,9vw,112px)] font-extrabold tracking-[-4px] leading-[0.87] mb-8 max-md:tracking-[-2px]">
            Let's build
            <br />
            <em className="not-italic text-accent">something</em>
            <br />
            great.
          </h2>

          <p className="font-mono text-[12px] text-muted font-light mb-11">
            Available for full-time roles and select freelance projects.
          </p>

          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href="mailto:muk.ankit@gmail.com"
              className="inline-flex items-center gap-2 bg-accent text-black font-sans text-[12px] font-bold tracking-[0.08em] uppercase px-8 py-3.5 rounded-full no-underline border border-accent transition-all hover:bg-transparent hover:text-accent"
            >
              Get in touch ↗
            </a>
            {[
              ['LinkedIn', 'https://linkedin.com/in/ankitmukhopadhyay'],
              ['GitHub',   'https://github.com/krakenslide'],
            ].map(([l, h]) => (
              <a
                key={l}
                href={h}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center font-sans text-[12px] font-bold tracking-[0.08em] uppercase px-8 py-3.5 rounded-full no-underline text-tx border border-white/10 transition-all hover:border-white/40"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
