const ROWS = [
  ['Period', '2018 — 2022'],
  ['Specialization', 'Artificial Intelligence'],
  ['Degree', 'B.Tech'],
  ['Location', 'Pune, Maharashtra'],
]

export default function Education() {
  return (
    <section id="education" className="py-28 relative z-10 max-md:py-18">
      <div className="max-w-[1280px] mx-auto px-12 max-md:px-5">
        <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-accent mb-4 flex items-center gap-3">
          05 — Education
          <span className="flex-1 h-px bg-white/[0.07] max-w-[80px]" />
        </div>

        <div className="reveal bg-surface p-[clamp(24px,5vw,52px)] grid grid-cols-2 gap-12 items-center max-md:grid-cols-1 max-md:gap-8">
          <div>
            <h3 className="font-display text-[clamp(26px,4vw,36px)] font-bold tracking-[-2px] leading-[1.1] mb-3">
              Bachelor of
              <br />
              Technology
            </h3>
            <p className="font-mono text-[10px] text-accent tracking-[0.15em] uppercase mb-5">
              Computer Science & Engineering (AI)
            </p>
            <p className="text-[14px] text-muted">MIT School of Engineering, Pune</p>
          </div>

          <div>
            {ROWS.map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between py-3.5 border-b border-white/[0.07] font-mono text-[11px]"
              >
                <span className="text-muted tracking-[0.06em]">{label}</span>
                <span className="text-tx">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
