const CARDS = [
  {
    n: '01',
    cat: 'Automation',
    title: 'Operational Workflow Automation',
    desc: 'Engineered automation at Vodafone Idea compressing 8-hour manual processes into ~2 hours.',
    stat: '80–90%',
    statLabel: 'Efficiency Gain',
  },
  {
    n: '02',
    cat: 'Real-Time Visualization',
    title: 'Network Monitoring Dashboards',
    desc: 'Built interactive real-time network diagrams using React Flow for operational decision-making.',
    stat: null,
    statLabel: null,
  },
  {
    n: '03',
    cat: 'Quality Engineering',
    title: 'CI/CD Quality Gates',
    desc: 'Maintained >90% automated test coverage across frontend and backend at both companies.',
    stat: '>90%',
    statLabel: 'Test Coverage',
  },
  {
    n: '04',
    cat: 'Component Systems',
    title: 'Scalable UI Libraries',
    desc: 'Designed reusable component libraries to standardize UI patterns and reduce dev effort.',
    stat: null,
    statLabel: null,
  },
]

export default function Impact() {
  return (
    <section id="impact" className="py-28 relative z-10 max-md:py-18">
      <div className="max-w-[1280px] mx-auto px-12 max-md:px-5">
        <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-accent mb-4 flex items-center gap-3">
          04 — Impact
          <span className="flex-1 h-px bg-white/[0.07] max-w-[80px]" />
        </div>

        <h2 className="reveal font-display text-[clamp(32px,5vw,68px)] font-bold leading-none tracking-[-2px] mb-12">
          What I've
          <br />
          <em className="not-italic text-accent">Delivered.</em>
        </h2>

        <div className="grid grid-cols-2 gap-0.5 max-md:grid-cols-1">
          {CARDS.map((card, i) => (
            <div
              key={card.n}
              className={`reveal group bg-surface p-9 relative overflow-hidden flex flex-col justify-between min-h-[230px] transition-colors hover:bg-[#101010] max-md:min-h-0 max-md:p-7 ${
                ['', '[transition-delay:0.08s]', '[transition-delay:0.16s]', '[transition-delay:0.24s]'][i]
              }`}
            >
              {/* Ghost number */}
              <span className="absolute top-4 right-4 font-display text-[62px] font-extrabold tracking-[-3px] text-accent/[0.08] leading-none select-none">
                {card.n}
              </span>

              <div>
                <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-accent mb-2">
                  {card.cat}
                </div>
                <div className="font-display text-[clamp(17px,2.5vw,21px)] font-bold tracking-[-1px] mb-2.5">
                  {card.title}
                </div>
                <div className="font-mono text-[11px] text-muted leading-[1.7] font-light">
                  {card.desc}
                </div>
              </div>

              <div>
                {card.stat && (
                  <>
                    <div className="font-display text-[clamp(28px,4vw,38px)] font-extrabold text-accent tracking-[-2px] mt-2.5">
                      {card.stat}
                    </div>
                    <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-muted">
                      {card.statLabel}
                    </div>
                  </>
                )}
                <div className="text-[18px] text-accent mt-3 inline-block transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                  ↗
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
