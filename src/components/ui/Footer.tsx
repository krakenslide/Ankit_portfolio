const LINKS = [
  ['Email', 'mailto:muk.ankit@gmail.com'],
  ['GitHub', 'https://github.com/krakenslide'],
  ['LinkedIn', 'https://linkedin.com/in/ankitmukhopadhyay'],
]

export default function Footer() {
  return (
    <footer className="py-7 border-t border-white/[0.07] relative z-10">
      <div className="max-w-[1280px] mx-auto px-12 max-md:px-5 flex justify-between items-center flex-wrap gap-3">
        <p className="font-mono text-[10px] text-muted tracking-[0.07em]">
          © 2025 Ankit Mukhopadhyay
        </p>
        <div className="flex gap-4">
          {LINKS.map(([l, h]) => (
            <a
              key={l}
              href={h}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[10px] text-muted tracking-[0.07em] no-underline hover:text-accent transition-colors"
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
