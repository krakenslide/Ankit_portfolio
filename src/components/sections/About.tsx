const INFO_ROWS = [
  ['Phone', '+91 8369 623 397'],
  ['Email', 'muk.ankit@gmail.com'],
  ['Based in', 'Mumbai, India'],
  ['Current role', 'SDE · Vodafone Idea'],
  ['Education', 'B.Tech CSE (AI)'],
  ['Status', '● Open to opportunities', true],
]

const CONTACT_LINKS = [
  ['✉ Email', 'mailto:muk.ankit@gmail.com'],
  ['⌥ GitHub', 'https://github.com/krakenslide'],
  ['⤴ LinkedIn', 'https://linkedin.com/in/ankitmukhopadhyay'],
]

export default function About() {
  return (
    <section id="about" className="py-28 relative z-10 max-md:py-18">
      <div className="max-w-[1280px] mx-auto px-12 max-md:px-5">
        {/* Tag */}
        <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-accent mb-4 flex items-center gap-3">
          01 — About
          <span className="flex-1 h-px bg-white/[0.07] max-w-[80px]" />
        </div>

        <div className="grid grid-cols-2 gap-16 items-start max-md:grid-cols-1 max-md:gap-9">
          {/* Left */}
          <div className="reveal">
            <p className="font-mono text-[15px] leading-[1.9] text-muted font-light">
              I'm a{' '}
              <strong className="text-tx font-normal">Software Development Engineer</strong> with
              2.6+ years building enterprise-grade frontend systems. Currently at{' '}
              <strong className="text-tx font-normal">Vodafone Idea</strong>, I architect
              dashboards, real-time network visualizations, and automated workflows that
              meaningfully cut operational overhead.
              <br />
              <br />
              My approach: ruthlessly component-driven, test-first, and performance-obsessed. I
              care deeply about what I ship — not just that it works, but that it scales.
            </p>

            <div className="flex gap-2.5 mt-7 flex-wrap">
              {CONTACT_LINKS.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 border border-white/[0.07] rounded-full font-mono text-[11px] text-muted no-underline hover:border-accent hover:text-accent transition-all"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="reveal [transition-delay:0.12s]">
            {INFO_ROWS.map(([label, value, accent]) => (
              <div
                key={label as string}
                className="flex justify-between items-center py-3.5 border-b border-white/[0.07]"
              >
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted">
                  {label}
                </span>
                <span
                  className={`text-[12px] font-semibold ${accent ? 'text-accent' : 'text-tx'}`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
