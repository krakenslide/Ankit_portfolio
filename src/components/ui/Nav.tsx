import { useEffect, useState } from 'react'
import Logo from './Logo'

const LINKS = ['About', 'Experience', 'Skills', 'Impact']

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-12 py-5 transition-all duration-300 max-md:px-5 ${
          scrolled ? 'bg-bg/90 backdrop-blur-xl border-b border-white/[0.07]' : 'border-b border-transparent'
        }`}
      >
        <a href="#" className="flex items-center gap-2.5 no-underline">
          <Logo />
        </a>

        {/* Desktop links */}
        <div className="flex gap-8 max-md:hidden">
          {LINKS.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="font-mono text-[11px] tracking-[0.1em] uppercase text-muted hover:text-accent transition-colors no-underline"
            >
              {l}
            </a>
          ))}
        </div>

        <a
          href="mailto:muk.ankit@gmail.com"
          className="max-md:hidden font-mono text-[11px] tracking-[0.08em] uppercase border border-white/10 px-[18px] py-2 rounded-full text-tx hover:bg-accent hover:text-black hover:border-accent transition-all no-underline"
        >
          Hire Me
        </a>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden flex flex-col gap-[5px] bg-transparent border-none p-1"
          aria-label="Open menu"
        >
          {[0, 1, 2].map((i) => (
            <span key={i} className="block w-[22px] h-[1.5px] bg-tx" />
          ))}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 bg-bg/97 backdrop-blur-2xl z-[200] flex flex-col justify-center items-center gap-7">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 bg-transparent border-none text-tx text-3xl leading-none"
          >
            ✕
          </button>
          {[...LINKS, 'Contact'].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="font-display text-[clamp(36px,10vw,52px)] font-bold tracking-[-2px] no-underline text-tx hover:text-accent transition-colors"
            >
              {l}
            </a>
          ))}
        </div>
      )}
    </>
  )
}
