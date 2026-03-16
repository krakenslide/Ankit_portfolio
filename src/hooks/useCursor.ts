import { useEffect } from 'react'

export function useCursor() {
  useEffect(() => {
    // Inject cursor elements
    const dot = document.createElement('div')
    dot.id = 'cursor-dot'
    dot.style.cssText = `
      position:fixed; top:-20px; left:-20px; width:8px; height:8px;
      background:#c8f542; border-radius:50%; pointer-events:none;
      z-index:9999; transform:translate(-50%,-50%);
      transition:width .18s,height .18s; mix-blend-mode:difference;
    `
    const ring = document.createElement('div')
    ring.id = 'cursor-ring'
    ring.style.cssText = `
      position:fixed; top:-20px; left:-20px; width:32px; height:32px;
      border:1px solid rgba(200,245,66,.25); border-radius:50%;
      pointer-events:none; z-index:9998; transform:translate(-50%,-50%);
    `
    document.body.appendChild(dot)
    document.body.appendChild(ring)

    let rx = 0, ry = 0, tx = 0, ty = 0
    let raf: number

    const onMove = (e: MouseEvent) => {
      tx = e.clientX; ty = e.clientY
      dot.style.left = tx + 'px'; dot.style.top = ty + 'px'
    }
    const onOver = (e: MouseEvent) => {
      const hovering = !!(e.target as Element).closest('a,button')
      dot.style.width = hovering ? '22px' : '8px'
      dot.style.height = hovering ? '22px' : '8px'
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)

    const loop = () => {
      rx += (tx - rx) * 0.1
      ry += (ty - ry) * 0.1
      ring.style.left = rx + 'px'
      ring.style.top = ry + 'px'
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf)
      dot.remove()
      ring.remove()
    }
  }, [])
}
